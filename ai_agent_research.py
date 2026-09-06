import os
import json
import re
import sqlite3
import requests
from html.parser import HTMLParser
from typing import Dict, Any, List, Optional
from anthropic import Anthropic


class _VisibleTextExtractor(HTMLParser):
    """Extracts visible text from HTML, skipping script/style content."""

    _SKIP_TAGS = {"script", "style", "noscript", "head"}

    def __init__(self):
        super().__init__()
        self._skip_depth = 0
        self.chunks: List[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in self._SKIP_TAGS:
            self._skip_depth += 1

    def handle_endtag(self, tag):
        if tag in self._SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data):
        if self._skip_depth == 0:
            stripped = data.strip()
            if stripped:
                self.chunks.append(stripped)

    def get_text(self) -> str:
        return re.sub(r"\s+", " ", " ".join(self.chunks)).strip()


class ResearchAgent:
    """
    A Claude-powered research agent that searches for information on a topic
    and summarizes its findings into key points.

    Runs a full agentic loop: Claude may call `search` and `summarize` any
    number of times, in any order, before producing a final answer. The loop
    keeps feeding tool results back to Claude until it stops requesting tools
    (stop_reason == "end_turn").
    """

    def __init__(self, name: str = "CoreLogic-Research-Agent", db_path: str = "research_memory.db"):
        self.name = name
        self.db_path = db_path

        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            print("Warning: ANTHROPIC_API_KEY environment variable not set. Agent will not be able to call Claude.")
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-3-5-sonnet-20241022"

        self._init_db()

        self.tools = [
            {
                "name": "search",
                "description": "Search for information on a topic and return a list of relevant findings.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query, e.g. 'benefits of renewable energy'",
                        }
                    },
                    "required": ["query"],
                },
            },
            {
                "name": "fetch_page",
                "description": (
                    "Fetch a web page by URL and return its visible text content. "
                    "Use this to read a page in full when a search finding references a URL "
                    "and more detail than the search snippet is needed."
                ),
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "url": {
                            "type": "string",
                            "description": "The URL of the page to fetch, e.g. 'https://en.wikipedia.org/wiki/Renewable_energy'",
                        }
                    },
                    "required": ["url"],
                },
            },
            {
                "name": "summarize",
                "description": "Summarize a list of findings into a short list of key points.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "findings": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "The findings to summarize",
                        }
                    },
                    "required": ["findings"],
                },
            },
        ]

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def _save_message(self, session_id: str, role: str, content: Any):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        content_str = json.dumps(content) if not isinstance(content, str) else content
        cursor.execute(
            'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
            (session_id, role, content_str)
        )
        conn.commit()
        conn.close()

    def get_history(self, session_id: str = "default") -> List[Dict[str, Any]]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC',
            (session_id,)
        )
        rows = cursor.fetchall()
        conn.close()

        history = []
        for role, content_str in rows:
            try:
                content = json.loads(content_str)
            except json.JSONDecodeError:
                content = content_str
            history.append({"role": role, "content": content})

        return history

    def clear_history(self, session_id: str = "default"):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM messages WHERE session_id = ?', (session_id,))
        conn.commit()
        conn.close()

    # --- Tool Implementations ---

    def _tool_search(self, query: str) -> List[str]:
        """Search the web for a query using DuckDuckGo's keyless Instant Answer API."""
        try:
            response = requests.get(
                "https://api.duckduckgo.com/",
                params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
                timeout=5,
            )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            return [f"Error searching for '{query}': {str(e)}"]

        findings: List[str] = []

        def _add(text: str, url: Optional[str]):
            if url:
                findings.append(f"{text} (source: {url})")
            else:
                findings.append(text)

        if data.get("AbstractText"):
            _add(data["AbstractText"], data.get("AbstractURL"))

        for topic in data.get("RelatedTopics", []):
            if isinstance(topic, dict) and topic.get("Text"):
                _add(topic["Text"], topic.get("FirstURL"))
            elif isinstance(topic, dict) and topic.get("Topics"):
                for sub_topic in topic["Topics"]:
                    if isinstance(sub_topic, dict) and sub_topic.get("Text"):
                        _add(sub_topic["Text"], sub_topic.get("FirstURL"))

        if not findings:
            return [f"No findings available for '{query}'."]

        return findings[:10]

    def _tool_fetch_page(self, url: str) -> str:
        """Fetch a page and return its cleaned visible text, truncated to a safe length."""
        try:
            response = requests.get(
                url,
                headers={"User-Agent": "Mozilla/5.0 (compatible; CoreLogicResearchAgent/1.0)"},
                timeout=8,
            )
            response.raise_for_status()
        except Exception as e:
            return f"Error fetching '{url}': {str(e)}"

        content_type = response.headers.get("Content-Type", "")
        if "html" not in content_type:
            return f"Cannot read '{url}': unsupported content type '{content_type}'."

        extractor = _VisibleTextExtractor()
        try:
            extractor.feed(response.text)
        except Exception as e:
            return f"Error parsing '{url}': {str(e)}"

        text = extractor.get_text()
        if not text:
            return f"No readable text content found at '{url}'."

        max_chars = 4000
        if len(text) > max_chars:
            text = text[:max_chars] + "... [truncated]"

        return text

    def _tool_summarize(self, findings: List[str]) -> List[str]:
        """Condense findings into a deduplicated, capped list of key points."""
        seen = set()
        key_points = []
        for finding in findings:
            cleaned = finding.strip()
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                key_points.append(cleaned)

        return key_points[:5] if key_points else ["No key points could be extracted from the findings."]

    def _execute_tool(self, tool_name: str, tool_input: Dict[str, Any]) -> str:
        if tool_name == "search":
            result = self._tool_search(tool_input.get("query", ""))
        elif tool_name == "fetch_page":
            result = self._tool_fetch_page(tool_input.get("url", ""))
        elif tool_name == "summarize":
            result = self._tool_summarize(tool_input.get("findings", []))
        else:
            return f"Error: Unknown tool '{tool_name}'"

        return result if isinstance(result, str) else json.dumps(result)

    # --- Main Agent Logic ---

    def research(self, topic: str, session_id: str = "default", max_turns: int = 8) -> str:
        """Research a topic through Claude, looping over tool calls until Claude is done."""
        if not os.environ.get("ANTHROPIC_API_KEY"):
            return "Error: ANTHROPIC_API_KEY environment variable is not set."

        self._save_message(session_id, "user", topic)
        messages = self.get_history(session_id)

        system_prompt = (
            f"You are {self.name}, a research assistant for AI-CoreLogic. "
            "Use the search tool to gather information, fetch_page to read a promising "
            "source in full when the search snippet isn't enough, and the summarize tool "
            "to condense findings, then provide a comprehensive summary of the topic."
        )

        try:
            for _ in range(max_turns):
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=1024,
                    system=system_prompt,
                    messages=messages,
                    tools=self.tools,
                )

                self._save_message(session_id, "assistant", response.content)
                messages.append({"role": "assistant", "content": response.content})

                if response.stop_reason != "tool_use":
                    text_response = next(
                        (block.text for block in response.content if block.type == "text"), ""
                    )
                    return text_response

                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        print(f"  [Agent is using tool: {block.name}({block.input})]")
                        result_str = self._execute_tool(block.name, block.input)
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result_str,
                        })

                tool_result_message = {"role": "user", "content": tool_results}
                self._save_message(session_id, "user", tool_results)
                messages.append(tool_result_message)

            return "Error: Research did not conclude within the maximum number of tool-use turns."

        except Exception as e:
            error_msg = f"Error communicating with Claude: {str(e)}"
            print(error_msg)
            return error_msg


def main():
    print("Initializing Research Agent...")
    agent = ResearchAgent()
    print(f"Agent '{agent.name}' ready.")
    print("Note: Requires ANTHROPIC_API_KEY environment variable.")
    print("Type 'exit' or 'quit' to stop. Type 'clear' to reset memory.")
    print("-" * 50)

    session_id = "cli_session"

    while True:
        try:
            topic = input("\nResearch topic: ")
            if topic.lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
            elif topic.lower() == "clear":
                agent.clear_history(session_id)
                print("Memory cleared.")
                continue

            if not topic.strip():
                continue

            summary = agent.research(topic, session_id)
            print(f"\n{agent.name}: {summary}")

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")


if __name__ == "__main__":
    main()

import os
import json
import sqlite3
import requests
from typing import Dict, Any, List, Optional
from anthropic import Anthropic

class ClaudeAIAgent:
    """
    An advanced AI agent powered by Anthropic's Claude API.
    Features tool use (function calling), persistent SQLite memory, and real API integrations.
    """
    
    def __init__(self, name: str = "CoreLogic-Claude-Agent", db_path: str = "agent_memory.db"):
        self.name = name
        self.db_path = db_path
        
        # Initialize Anthropic client
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            print("Warning: ANTHROPIC_API_KEY environment variable not set. Agent will not be able to call Claude.")
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-3-5-sonnet-20241022" # Using a reliable recent model
        
        # Initialize database
        self._init_db()
        
        # Define available tools for Claude
        self.tools = [
            {
                "name": "calculate",
                "description": "Evaluate a mathematical expression. Use this for any math questions.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "The mathematical expression to evaluate (e.g., '2 + 2', '25 * 4 / 2')"
                        }
                    },
                    "required": ["expression"]
                }
            },
            {
                "name": "get_weather",
                "description": "Get the current weather for a specific location.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state/country, e.g., 'San Francisco, CA' or 'London, UK'"
                        }
                    },
                    "required": ["location"]
                }
            }
        ]
        
    def _init_db(self):
        """Initialize the SQLite database for persistent memory."""
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
        """Save a message to the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        # Store complex content (like tool_use blocks) as JSON strings
        content_str = json.dumps(content) if not isinstance(content, str) else content
        cursor.execute(
            'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
            (session_id, role, content_str)
        )
        conn.commit()
        conn.close()
        
    def get_history(self, session_id: str = "default") -> List[Dict[str, Any]]:
        """Retrieve conversation history for a session."""
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
                # Try to parse JSON content (for tool blocks)
                content = json.loads(content_str)
            except json.JSONDecodeError:
                # Fallback to plain string
                content = content_str
            history.append({"role": role, "content": content})
            
        return history

    def clear_history(self, session_id: str = "default"):
        """Clear conversation history for a session."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM messages WHERE session_id = ?', (session_id,))
        conn.commit()
        conn.close()

    # --- Tool Implementations ---
    
    def _tool_calculate(self, expression: str) -> str:
        """Execute the calculate tool."""
        try:
            # Safer evaluation using a restricted set of characters
            allowed_chars = set("0123456789+-*/(). ")
            if not all(c in allowed_chars for c in expression):
                return "Error: Invalid characters in expression. Only basic math operators are allowed."
            result = eval(expression)
            return str(result)
        except Exception as e:
            return f"Error calculating: {str(e)}"
            
    def _tool_get_weather(self, location: str) -> str:
        """Execute the weather tool using wttr.in (no API key required)."""
        try:
            # Use wttr.in for simple, keyless weather data
            url = f"https://wttr.in/{location}?format=%C+%t"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                return f"Current weather in {location}: {response.text.strip()}"
            else:
                return f"Could not fetch weather for {location}. Status code: {response.status_code}"
        except Exception as e:
            return f"Error fetching weather: {str(e)}"

    def _execute_tool(self, tool_name: str, tool_input: Dict[str, Any]) -> str:
        """Route tool calls to the appropriate method."""
        if tool_name == "calculate":
            return self._tool_calculate(tool_input.get("expression", ""))
        elif tool_name == "get_weather":
            return self._tool_get_weather(tool_input.get("location", ""))
        else:
            return f"Error: Unknown tool '{tool_name}'"

    # --- Main Agent Logic ---

    def process_input(self, user_input: str, session_id: str = "default") -> str:
        """Process user input through Claude and handle any tool calls."""
        if not os.environ.get("ANTHROPIC_API_KEY"):
            return "Error: ANTHROPIC_API_KEY environment variable is not set."

        # 1. Save user input and get history
        self._save_message(session_id, "user", user_input)
        messages = self.get_history(session_id)
        
        system_prompt = f"You are {self.name}, a helpful AI assistant for AI-CoreLogic. You have access to tools to help answer questions. Always use tools when appropriate."

        try:
            # 2. Call Claude
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=system_prompt,
                messages=messages,
                tools=self.tools
            )
            
            # 3. Save Claude's initial response (which may include tool_use blocks)
            self._save_message(session_id, "assistant", response.content)
            messages.append({"role": "assistant", "content": response.content})
            
            # 4. Check if Claude wants to use a tool
            if response.stop_reason == "tool_use":
                tool_results = []
                
                # Process all tool_use blocks in the response
                for block in response.content:
                    if block.type == "tool_use":
                        tool_name = block.name
                        tool_input = block.input
                        tool_use_id = block.id
                        
                        print(f"  [Agent is using tool: {tool_name}({tool_input})]")
                        
                        # Execute the tool
                        result_str = self._execute_tool(tool_name, tool_input)
                        
                        # Format the result block
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": tool_use_id,
                            "content": result_str
                        })
                
                # 5. Send tool results back to Claude
                tool_result_message = {
                    "role": "user",
                    "content": tool_results
                }
                self._save_message(session_id, "user", tool_results)
                messages.append(tool_result_message)
                
                # 6. Get final response from Claude
                final_response = self.client.messages.create(
                    model=self.model,
                    max_tokens=1024,
                    system=system_prompt,
                    messages=messages,
                    tools=self.tools
                )
                
                # Save and return final response
                self._save_message(session_id, "assistant", final_response.content)
                
                # Extract text from final response
                final_text = next((block.text for block in final_response.content if block.type == "text"), "")
                return final_text
                
            else:
                # No tools used, just return the text response
                text_response = next((block.text for block in response.content if block.type == "text"), "")
                return text_response
                
        except Exception as e:
            error_msg = f"Error communicating with Claude: {str(e)}"
            print(error_msg)
            return error_msg

def main():
    print("Initializing Claude AI Agent...")
    agent = ClaudeAIAgent()
    print(f"Agent '{agent.name}' ready.")
    print("Note: Requires ANTHROPIC_API_KEY environment variable.")
    print("Type 'exit' or 'quit' to stop. Type 'clear' to reset memory.")
    print("-" * 50)
    
    session_id = "cli_session"
    
    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break
            elif user_input.lower() == 'clear':
                agent.clear_history(session_id)
                print("Memory cleared.")
                continue
                
            if not user_input.strip():
                continue
                
            response = agent.process_input(user_input, session_id)
            print(f"\n{agent.name}: {response}")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()

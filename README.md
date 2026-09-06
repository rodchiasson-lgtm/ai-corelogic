# AI-CoreLogic Python Agent

This repository contains the AI-CoreLogic Python agent, an advanced AI assistant powered by Anthropic's Claude API.

## Features

- **Claude LLM Integration**: Uses the `claude-3-5-sonnet-20241022` model for high-quality natural language understanding and generation.
- **Tool Use (Function Calling)**: The agent can autonomously decide to use tools to gather information or perform actions.
  - `calculate`: Safely evaluates mathematical expressions.
  - `get_weather`: Fetches real-time weather data using the `wttr.in` API.
- **Research Agent**: A second Claude-powered agent (`ResearchAgent`) that researches a topic across multiple tool-use turns.
  - `search`: Searches the web for a query using DuckDuckGo's keyless Instant Answer API.
  - `fetch_page`: Fetches a URL surfaced by `search` and returns its cleaned visible text, for when a search snippet isn't enough detail.
  - `summarize`: Condenses a list of findings into a short list of key points.
- **Persistent Memory**: Uses SQLite (`agent_memory.db` / `research_memory.db`) to store conversation history across sessions.
- **FastAPI Web Interface**: Provides a REST API for easy integration with frontend applications (like React).
- **CLI Interface**: Includes an interactive command-line loop for direct testing and usage.

## Prerequisites

- Python 3.11+
- An Anthropic API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rodchiasson-lgtm/ai-corelogic.git
   cd ai-corelogic
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set your Anthropic API key as an environment variable:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

## Usage

### 1. Command-Line Interface (CLI)

Run the agent directly in your terminal:

```bash
python ai_agent_claude.py
```

Example interaction:
```
You: What is the weather in Tokyo?
  [Agent is using tool: get_weather({'location': 'Tokyo'})]

CoreLogic-Claude-Agent: The current weather in Tokyo is Clear, +18°C.

You: If I have 5 groups of 12 people, how many people is that?
  [Agent is using tool: calculate({'expression': '5 * 12'})]

CoreLogic-Claude-Agent: That would be 60 people in total.
```

Type `clear` to reset the conversation memory, or `exit` to quit.

### 2. FastAPI Web Server

Start the REST API server:

```bash
python api.py
```
*(Or run `uvicorn api:app --reload`)*

The API will be available at `http://localhost:8000`.

#### API Endpoints

- **`GET /`**: Health check.
- **`POST /api/chat`**: Send a message to the agent.
  ```json
  // Request body
  {
    "message": "What's the weather in London?",
    "session_id": "user_123"
  }
  ```
- **`GET /api/chat/{session_id}/history`**: Retrieve the conversation history for a specific session.
- **`DELETE /api/chat/{session_id}`**: Clear the conversation history for a specific session.
- **`POST /api/research`**: Research a topic with the research agent.
  ```json
  // Request body
  {
    "topic": "the benefits of renewable energy",
    "session_id": "user_123"
  }
  ```
- **`GET /api/research/{session_id}/history`**: Retrieve the research history for a specific session.
- **`DELETE /api/research/{session_id}`**: Clear the research history for a specific session.

You can view the interactive API documentation (Swagger UI) by navigating to `http://localhost:8000/docs` in your browser while the server is running.

## Architecture

- `ai_agent_claude.py`: The core agent class (`ClaudeAIAgent`) that handles the Anthropic API communication, tool execution loop, and SQLite database interactions.
- `ai_agent_research.py`: The research agent class (`ResearchAgent`) that loops over `search` and `summarize` tool calls until Claude produces a final summary.
- `api.py`: The FastAPI wrapper that exposes the agents' capabilities over HTTP.
- `ai_agent.py`: The original, simple rule-based agent template (kept for reference).

import os
import sys
import json
import requests
from typing import Dict, Any, List

class SimpleAIAgent:
    """
    A simple AI agent that can process text and perform basic tasks.
    This is a foundational template that can be expanded with LLM integration.
    """
    
    def __init__(self, name: str = "CoreLogic-Agent"):
        self.name = name
        self.memory: List[Dict[str, str]] = []
        self.tools = {
            "echo": self._tool_echo,
            "calculate": self._tool_calculate,
            "get_weather": self._tool_get_weather
        }
        
    def _tool_echo(self, text: str) -> str:
        """Simple echo tool for testing."""
        return f"Echo: {text}"
        
    def _tool_calculate(self, expression: str) -> str:
        """Basic calculator tool."""
        try:
            # WARNING: eval is used here for simplicity in this template.
            # In a production environment, use a safer alternative like ast.literal_eval
            # or a dedicated math parsing library.
            allowed_chars = set("0123456789+-*/(). ")
            if not all(c in allowed_chars for c in expression):
                return "Error: Invalid characters in expression."
            result = eval(expression)
            return str(result)
        except Exception as e:
            return f"Error calculating: {str(e)}"
            
    def _tool_get_weather(self, location: str) -> str:
        """Mock weather tool."""
        # In a real agent, this would call a weather API
        mock_weather = {
            "london": "Rainy, 15°C",
            "new york": "Sunny, 22°C",
            "tokyo": "Cloudy, 18°C",
            "sydney": "Clear, 25°C"
        }
        loc_lower = location.lower()
        for key in mock_weather:
            if key in loc_lower:
                return f"Weather in {key.title()}: {mock_weather[key]}"
        return f"Weather data not available for {location}. Try London, New York, Tokyo, or Sydney."

    def process_input(self, user_input: str) -> str:
        """Process user input and return a response."""
        self.memory.append({"role": "user", "content": user_input})
        
        response = ""
        user_input_lower = user_input.lower()
        
        # Simple intent routing
        if user_input_lower.startswith("calculate "):
            expr = user_input[10:]
            response = self.tools["calculate"](expr)
        elif "weather" in user_input_lower:
            response = self.tools["get_weather"](user_input)
        elif user_input_lower.startswith("echo "):
            text = user_input[5:]
            response = self.tools["echo"](text)
        else:
            response = f"Hello! I am {self.name}. I can calculate basic math, check mock weather, or echo text. Try 'calculate 5 * 10' or 'weather in London'."
            
        self.memory.append({"role": "agent", "content": response})
        return response
        
    def get_history(self) -> List[Dict[str, str]]:
        """Return the conversation history."""
        return self.memory

def main():
    print("Initializing AI Agent...")
    agent = SimpleAIAgent()
    print(f"Agent '{agent.name}' ready. Type 'exit' or 'quit' to stop.")
    print("-" * 50)
    
    while True:
        try:
            user_input = input("\nYou: ")
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break
                
            if not user_input.strip():
                continue
                
            response = agent.process_input(user_input)
            print(f"\n{agent.name}: {response}")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    main()

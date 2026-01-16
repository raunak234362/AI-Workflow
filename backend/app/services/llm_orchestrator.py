import openai
from google import genai
import os
from typing import Literal

class LLMOrchestrator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key and self.openai_api_key.startswith("sk-placeholder"):
            self.openai_api_key = None
            
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.gemini_client = None
        
        if self.gemini_api_key:
            self.gemini_client = genai.Client(api_key=self.gemini_api_key)

    def execute_query(self, query: str, context: str = "", provider: Literal["openai", "gemini"] = "gemini") -> str:
        # Force Gemini usage as requested ("in place of OpenAI")
        provider = "gemini"
        
        prompt = f"Context: {context}\n\nQuestion: {query}\n\nAnswer:"
        
        if provider == "openai" and self.openai_api_key:
            client = openai.OpenAI(api_key=self.openai_api_key)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
            
        # Fallback to Gemini if provider is openai but key is missing, or if provider is gemini
        if (provider == "gemini" or provider == "openai") and self.gemini_client:
            response = self.gemini_client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt
            )
            return response.text
            
        return "LLM Provider not configured or API Key missing."

llm_orchestrator = LLMOrchestrator()

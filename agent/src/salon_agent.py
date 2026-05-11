import json
import os
from pathlib import Path
from openai import AsyncAzureOpenAI
from dotenv import load_dotenv

load_dotenv()

BASE = Path(__file__).parent.parent


class SalonAgent:
    def __init__(self):
        self.client = AsyncAzureOpenAI(
            api_key=os.environ["AZURE_OPENAI_KEY"],
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-08-01-preview"),
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        )
        self.model = os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")
        self.system_prompt = self._load_system_prompt()
        self.faq_context = self._load_faq()

    def _load_system_prompt(self) -> str:
        path = BASE / "prompts" / "system-prompt.md"
        return path.read_text(encoding="utf-8")

    def _load_faq(self) -> str:
        path = BASE / "data" / "faq.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        lines = ["## FAQ Knowledge Base"]
        for item in data["faqs"]:
            lines.append(f"Q: {item['question']}\nA: {item['answer']}")
        return "\n\n".join(lines)

    async def respond(self, message: str) -> str:
        system = f"{self.system_prompt}\n\n{self.faq_context}"
        response = await self.client.chat.completions.create(
            model=self.model,
            max_tokens=512,
            temperature=0.4,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": message},
            ],
        )
        return response.choices[0].message.content.strip()

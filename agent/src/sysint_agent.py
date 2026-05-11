import json
import os
from pathlib import Path
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("OPENAI_API_VERSION", "2024-12-01-preview"),
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini")
DATA_DIR   = Path(__file__).parent.parent / "data"


def load_faq() -> str:
    lines = []
    for path in sorted(DATA_DIR.glob("*.json")):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        # support both {"faqs": [...]} and plain [...]
        items = data["faqs"] if isinstance(data, dict) else data
        for item in items:
            lines.append(f"Q: {item['question']}")
            lines.append(f"A: {item['answer']}")
            lines.append("")
    return "\n".join(lines)


SYSTEM_PROMPT = """You are the SysInt Assistant, a helpful AI for SysInt Inc — an enterprise integration and AI engineering firm.

Your job is to help visitors with questions about:
- Enterprise Integration services (Azure Integration Services, BizTalk migration, APIs, middleware)
- AI Engineering services (agentic automation, inference platforms, intelligent apps)
- The AI Agent Store for local businesses (restaurants, salons, clinics, real estate, retail, home services, legal, education)
- Getting in touch with the team for demos or consultations

## Tone
- Professional but approachable
- Concise — 1 to 3 sentences max unless more detail is asked for
- Use bullet points for lists, never use markdown headers in replies
- Confident about SysInt's capabilities

## Rules
- Only answer using information from the FAQ below. Never invent services, prices, or capabilities.
- If you don't know the answer, say: "Great question — let me connect you with Ganga directly. Reach him at 440-364-6078 or gangadhar.ananthoju@sysintinc.com"
- Never discuss competitors
- If someone wants a demo or consultation, direct them to contact Ganga Ananthoju

## Company Info
- Company: SysInt Inc | Tagline: Integration • Intelligence • Inference
- Founder: Ganga Ananthoju — Founder & AI Engineer
- Phone: 440-364-6078 | Email: gangadhar.ananthoju@sysintinc.com
- Website: www.sysintinc.com

## FAQ
{faq}
""".format(faq=load_faq())


def ask(message: str, history: list = []) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += history[-6:]
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=messages,
        temperature=0.3,
        max_tokens=250,
    )
    return response.choices[0].message.content

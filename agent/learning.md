# Agent Learning Notes

Running notes on what works, what doesn't, and decisions made.

## Setup
- Using Azure OpenAI (not OpenAI direct) — endpoint in .env
- uv for package management (`uv sync` to install)
- FastAPI for the HTTP layer

## Decisions
- FAQ loaded from `data/faq.json` at startup — no DB needed for MVP
- System prompt in `prompts/system-prompt.md` — easy to edit without touching code
- CORS set to allow all origins for now — tighten before production

## Issues & Fixes

---

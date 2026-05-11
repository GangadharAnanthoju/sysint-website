import asyncio
from src.sysint_agent import SysIntAgent

TEST_MESSAGES = [
    "Hi, what are your hours?",
    "How much does a haircut cost?",
    "Can I book an appointment for Saturday?",
    "Do you offer bridal packages?",
    "What's your cancellation policy?",
]


async def main():
    agent = SysIntAgent()
    print("SysInt Agent — Local Test\n" + "=" * 40)
    for msg in TEST_MESSAGES:
        print(f"\nUser: {msg}")
        reply = await agent.respond(msg)
        print(f"Aria: {reply}")


if __name__ == "__main__":
    asyncio.run(main())

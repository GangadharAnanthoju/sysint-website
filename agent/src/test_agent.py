import asyncio
from src.salon_agent import SalonAgent

TEST_MESSAGES = [
    "Hi, what are your hours?",
    "How much does a haircut cost?",
    "Can I book an appointment for Saturday?",
    "Do you offer bridal packages?",
    "What's your cancellation policy?",
]


async def main():
    agent = SalonAgent()
    print("SysInt Salon Agent — Local Test\n" + "=" * 40)
    for msg in TEST_MESSAGES:
        print(f"\nUser: {msg}")
        reply = await agent.respond(msg)
        print(f"Aria: {reply}")


if __name__ == "__main__":
    asyncio.run(main())

from sysint_agent import ask

TEST_MESSAGES = [
    "Hi, what does SysInt do?",
    "Do you help with BizTalk migration?",
    "What Azure services do you work with?",
    "I need an AI agent for my restaurant — can you help?",
    "How long does it take to go live?",
    "How do I get in touch with the team?",
]

if __name__ == "__main__":
    print("SysInt Agent — Local Test\n" + "=" * 40)
    history = []
    for msg in TEST_MESSAGES:
        print(f"\nUser: {msg}")
        reply = ask(msg, history)
        print(f"Agent: {reply}")
        history.append({"role": "user", "content": msg})
        history.append({"role": "assistant", "content": reply})

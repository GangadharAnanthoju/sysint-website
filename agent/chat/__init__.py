import json
import logging
import azure.functions as func

# TODO: swap CHAT_API_URL in chat-widget.js to point to this endpoint
# POST /api/chat  →  { "message": "user text" }
# Returns         →  { "reply": "bot response" }

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Chat function triggered")

    try:
        body = req.get_json()
        message = body.get("message", "").strip()
    except Exception:
        return func.HttpResponse(
            json.dumps({"error": "Invalid request body"}),
            status_code=400,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    if not message:
        return func.HttpResponse(
            json.dumps({"error": "message is required"}),
            status_code=400,
            mimetype="application/json",
            headers={"Access-Control-Allow-Origin": "*"}
        )

    # ── PLACEHOLDER — replace with real AI call ──────────────────────
    # Example (Anthropic Claude):
    #
    # import anthropic, os
    # client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    # response = client.messages.create(
    #     model="claude-sonnet-4-6",
    #     max_tokens=512,
    #     system="You are SysInt's assistant. Help with enterprise integration and AI services.",
    #     messages=[{"role": "user", "content": message}]
    # )
    # reply = response.content[0].text
    # ─────────────────────────────────────────────────────────────────

    reply = f"Echo (placeholder): {message}"

    return func.HttpResponse(
        json.dumps({"reply": reply}),
        status_code=200,
        mimetype="application/json",
        headers={"Access-Control-Allow-Origin": "*"}
    )

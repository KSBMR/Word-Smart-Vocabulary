import os
import json
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY"),
)

MODEL_NAME = "openai/gpt-oss-120b"

conversation_history = {}


def parse_ai_response(raw: str):
    """Robustly extract content from AI response."""
    if not raw:
        return {"type": "question", "content": "Could you repeat that?", "score": None, "errors": [], "suggestions": []}

    cleaned = raw.strip()
    # Remove markdown fences
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r'\s*```$', '', cleaned, flags=re.MULTILINE)
    cleaned = cleaned.strip()

    # Find outermost JSON object
    brace_count = 0
    start_idx = None
    end_idx = None
    for i, ch in enumerate(cleaned):
        if ch == '{':
            if brace_count == 0:
                start_idx = i
            brace_count += 1
        elif ch == '}':
            brace_count -= 1
            if brace_count == 0 and start_idx is not None:
                end_idx = i + 1
                break

    if start_idx is not None and end_idx is not None:
        json_str = cleaned[start_idx:end_idx]
        try:
            parsed = json.loads(json_str)
            if isinstance(parsed, dict):
                return {
                    "type": parsed.get("type", "question"),
                    "content": parsed.get("content", "").strip() or json_str,
                    "score": parsed.get("score"),
                    "errors": parsed.get("errors", []),
                    "suggestions": parsed.get("suggestions", []),
                }
        except json.JSONDecodeError as e:
            print(f"⚠️ JSON parse error: {e}")

    # Fallback: extract content field with regex
    content_match = re.search(r'"content"\s*:\s*"((?:[^"\\]|\\.)*)"', cleaned)
    if content_match:
        content = content_match.group(1)
        content = content.replace('\\"', '"').replace('\\n', '\n').replace('\\\\', '\\')
        type_match = re.search(r'"type"\s*:\s*"([^"]+)"', cleaned)
        return {
            "type": type_match.group(1) if type_match else "question",
            "content": content,
            "score": None,
            "errors": [],
            "suggestions": [],
        }

    # Final fallback: use cleaned text
    return {
        "type": "question",
        "content": cleaned or "I didn't quite understand. Could you repeat that?",
        "score": None,
        "errors": [],
        "suggestions": [],
    }


def call_groq(messages, max_tokens=800):
    """Call Groq with given messages."""
    return client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        max_tokens=max_tokens,
        temperature=0.6,
        # ⚠️ No response_format — Groq's strict mode is buggy
    )


@csrf_exempt
def ai_agent(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')

        history = conversation_history.get(session_id, [])
        if user_message:
            history.append({"role": "user", "content": user_message})

        prompt = f"""You are an IELTS speaking examiner conducting a test.

Conversation so far:
{json.dumps(history, indent=2)}

Instructions:
- If this is the START (no user message yet), ask a Part 1 IELTS question.
- If the user answered, provide brief feedback on grammar, vocabulary, fluency, then ask the next question.

Response format — you MUST reply with a JSON object like:
{{
  "type": "question",
  "content": "Your message to the user",
  "score": null,
  "errors": [],
  "suggestions": []
}}

Important:
- "type" is "question" or "feedback"
- "content" is plain text (no nested JSON)
- "score" is a number 0-9 or null
- "errors" and "suggestions" are lists of strings
- Do NOT add markdown or extra text
- Do NOT wrap in ```json
"""

        messages = [
            {
                "role": "system",
                "content": "You are an IELTS examiner. Respond with a valid JSON object only.",
            },
            {"role": "user", "content": prompt},
        ]

        # Attempt 1: normal call
        try:
            response = call_groq(messages, max_tokens=800)
            raw = response.choices[0].message.content
            print(f"🔍 Raw AI response (attempt 1): {raw[:250]}")
        except Exception as e:
            print(f"⚠️ Attempt 1 failed: {e}")
            raw = ""

        # Attempt 2: if response is empty/invalid, retry with shorter prompt
        reply_json = parse_ai_response(raw)

        # Check if parse looks broken
        content = reply_json.get("content", "")
        looks_bad = (
            not content
            or content.strip().startswith("{")
            or "json_validate_failed" in content
            or len(content) < 5
        )

        if looks_bad:
            print("⚠️ Attempt 1 gave bad result, retrying with simpler prompt...")
            simple_prompt = f"""You are an IELTS examiner.
User said: "{user_message or 'start'}"
Give short feedback or ask next question.
Respond ONLY with JSON: {{"type":"question","content":"your text here","score":null,"errors":[],"suggestions":[]}}
"""
            try:
                response = call_groq(
                    [
                        {"role": "system", "content": "Respond with valid JSON only."},
                        {"role": "user", "content": simple_prompt},
                    ],
                    max_tokens=400,
                )
                raw = response.choices[0].message.content
                print(f"🔍 Raw AI response (attempt 2): {raw[:250]}")
                reply_json = parse_ai_response(raw)
            except Exception as e:
                print(f"❌ Attempt 2 failed: {e}")
                reply_json = {
                    "type": "question",
                    "content": "I'm having trouble responding. Could you say that again?",
                    "score": None,
                    "errors": [],
                    "suggestions": [],
                }

        # Final guard: if content still looks like JSON, strip it
        content = reply_json.get("content", "")
        if content.strip().startswith("{"):
            inner = parse_ai_response(content)
            if inner.get("content") and not inner["content"].startswith("{"):
                reply_json = inner

        history.append({
            "role": "assistant",
            "content": reply_json.get("content", ""),
        })
        conversation_history[session_id] = history

        return JsonResponse(reply_json, safe=False)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'type': 'question',
            'content': "Something went wrong. Please try again.",
        }, status=200)
import os
import json
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_KEY = os.getenv('OPENROUTER_API_KEY')

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_KEY or "",
    default_headers={
        "HTTP-Referer": "https://word-smart-vocabulary.vercel.app",
        "X-Title": "Word Smart",
    },
)

# ✅ Change model here
MODEL_NAME = "google/gemma-4-31b-it:free"

conversation_history = {}


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

        prompt = f"""You are an IELTS speaking examiner.
Conversation history:
{json.dumps(history, indent=2)}

Task:
- If start, ask Part 1 IELTS question.
- If user answered, give feedback (grammar, vocabulary, fluency, band 0-9), then ask next question.

Respond ONLY with valid JSON:
{{
  "type": "question" or "feedback",
  "content": "Text to speak",
  "score": null or number,
  "errors": [],
  "suggestions": []
}}
"""

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an IELTS examiner. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        raw = response.choices[0].message.content

        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if json_match:
            try:
                reply_json = json.loads(json_match.group())
            except json.JSONDecodeError:
                reply_json = {"type": "question", "content": raw}
        else:
            reply_json = {"type": "question", "content": raw}

        history.append({"role": "assistant", "content": reply_json.get('content', '')})
        conversation_history[session_id] = history

        return JsonResponse(reply_json, safe=False)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'type': 'question',
            'content': f'Error: {str(e)[:200]}'
        }, status=200)
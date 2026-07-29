import os
import json
import re
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))   # <--- fixed

@csrf_exempt
def speaking_assessment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        transcript = data.get('transcript', '').strip()
        if not transcript:
            return JsonResponse({'error': 'No transcript provided'}, status=400)

        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
You are an English language coach. The user spoke the following sentence:

"{transcript}"

Analyze the user's speaking and provide feedback in JSON format with these keys:
- "grammar_errors": list of errors with corrections
- "vocabulary_suggestions": list of better word choices
- "coherence_feedback": how clear and structured the response is
- "fluency_score": a number from 0 to 9
- "overall_feedback": a short summary

Return ONLY valid JSON.
"""
        response = model.generate_content(prompt)
        raw = response.text
        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {"error": "Could not parse response", "raw": raw}
        return JsonResponse(result, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def writing_assessment(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        if not text:
            return JsonResponse({'error': 'No text provided'}, status=400)

        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
You are an IELTS writing examiner. Evaluate the following text:

"{text}"

Provide feedback in JSON format with keys:
- "overall": overall band score (0-9)
- "task_response": score for task response (0-9)
- "coherence": score for coherence and cohesion (0-9)
- "lexical": score for lexical resource (0-9)
- "grammar": score for grammatical range and accuracy (0-9)
- "errors": list of specific grammar/spelling errors with corrections
- "suggestions": list of suggestions to improve

Return ONLY valid JSON.
"""
        response = model.generate_content(prompt)
        raw = response.text
        json_match = re.search(r'\{.*\}', raw, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {"error": "Could not parse response", "raw": raw}
        return JsonResponse(result, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
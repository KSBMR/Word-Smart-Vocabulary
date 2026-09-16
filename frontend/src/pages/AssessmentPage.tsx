import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, PenTool, Loader2 } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AssessmentPage() {
  const { transcript, isListening, error, startListening } = useSpeechToText();
  const [writingText, setWritingText] = useState('');
  const [speechFeedback, setSpeechFeedback] = useState<any>(null);
  const [writingFeedback, setWritingFeedback] = useState<any>(null);
  const [loadingSpeech, setLoadingSpeech] = useState(false);
  const [loadingWriting, setLoadingWriting] = useState(false);

  // --- Speaking ---
  const assessSpeech = async () => {
    if (!transcript) return;
    setLoadingSpeech(true);
    try {
      const res = await fetch(`${API_URL}/api/speech-assessment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      });
      // Check if response is OK, else throw with status
      if (!res.ok) {
        const text = await res.text(); // get HTML or error message
        throw new Error(`Server responded with ${res.status}: ${text.slice(0, 100)}`);
      }
      const data = await res.json();
      setSpeechFeedback(data);
    } catch (err: any) {
      console.error('Speech assessment error:', err);
      setSpeechFeedback({ error: err.message || 'Failed to assess speech.' });
    } finally {
      setLoadingSpeech(false);
    }
  };

  // --- Writing ---
  const assessWriting = async () => {
  if (!writingText) return;
  setLoadingWriting(true);
  try {
    const res = await fetch(`${API_URL}/api/writing-assessment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: writingText })
    });
    // Check if response is OK, else throw with status
    if (!res.ok) {
      const text = await res.text(); // get HTML or error message
      throw new Error(`Server responded with ${res.status}: ${text.slice(0, 100)}`);
    }
    const data = await res.json();
    setWritingFeedback(data);
  } catch (err: any) {
    console.error('Writing assessment error:', err);
    setWritingFeedback({ error: err.message || 'Failed to assess writing.' });
  } finally {
    setLoadingWriting(false);
  }
};

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          🧠 AI Assessment
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Improve your English speaking & writing with instant AI feedback powered by Gemini.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="speaking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
          <TabsTrigger value="speaking" className="flex items-center gap-2">
            <Mic className="h-4 w-4" /> Speaking
          </TabsTrigger>
          <TabsTrigger value="writing" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" /> Writing
          </TabsTrigger>
        </TabsList>

        {/* Speaking Tab */}
        <TabsContent value="speaking" className="space-y-4 mt-6">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">🎤 Speak & Get Feedback</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click the mic, say a sentence, and receive instant analysis.
                  </p>
                </div>
                <Button
                  onClick={startListening}
                  disabled={isListening}
                  className="gap-2 rounded-full h-12 w-12 p-0 flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  {isListening ? (
                    <div className="relative">
                      <MicOff className="h-5 w-5 animate-pulse text-red-500" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                    </div>
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {transcript && (
                <div className="p-4 bg-muted rounded-xl space-y-3">
                  <p className="text-sm font-medium">You said:</p>
                  <p className="text-base italic">"{transcript}"</p>
                  <Button
                    onClick={assessSpeech}
                    disabled={loadingSpeech}
                    className="w-full sm:w-auto"
                  >
                    {loadingSpeech ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing...
                      </>
                    ) : (
                      'Get Feedback'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {speechFeedback && <FeedbackCard feedback={speechFeedback} type="speaking" />}
        </TabsContent>

        {/* Writing Tab */}
        <TabsContent value="writing" className="space-y-4 mt-6">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <div>
                <CardTitle className="text-lg">✍️ Write & Get Feedback</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste your text and get IELTS‑style feedback.
                </p>
              </div>
              <Textarea
                placeholder="Type or paste your writing here..."
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <Button
                onClick={assessWriting}
                disabled={loadingWriting || !writingText}
                className="w-full sm:w-auto"
              >
                {loadingWriting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing...
                  </>
                ) : (
                  'Check Writing'
                )}
              </Button>
            </CardContent>
          </Card>

          {writingFeedback && <FeedbackCard feedback={writingFeedback} type="writing" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Feedback Card Component ----------
function FeedbackCard({ feedback, type }: { feedback: any; type: 'speaking' | 'writing' }) {
  if (!feedback || feedback.error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="pt-6 text-red-600">
          {feedback?.error || 'Something went wrong. Please try again.'}
        </CardContent>
      </Card>
    );
  }

  if (type === 'speaking') {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">🎯 Fluency Score</span>
            <span className="text-2xl font-bold text-primary">{feedback.fluency_score || '—'}</span>
          </div>
          <div>
            <p className="font-medium text-sm">📝 Grammar Errors</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {feedback.grammar_errors?.map((err: string, i: number) => (
                <li key={i} className="text-muted-foreground">{err}</li>
              )) || <li className="text-muted-foreground">✨ No errors found.</li>}
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm">💡 Vocabulary Suggestions</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {feedback.vocabulary_suggestions?.map((s: string, i: number) => (
                <li key={i} className="text-muted-foreground">{s}</li>
              )) || <li className="text-muted-foreground">✅ Good vocabulary.</li>}
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm">🧩 Coherence</p>
            <p className="text-sm text-muted-foreground">{feedback.coherence_feedback || '—'}</p>
          </div>
          <div>
            <p className="font-medium text-sm">📌 Overall</p>
            <p className="text-sm">{feedback.overall_feedback || '—'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Writing feedback
  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="pt-6 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-white dark:bg-blue-950/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Overall</p>
            <p className="text-xl font-bold text-primary">{feedback.overall || '—'}</p>
          </div>
          <div className="p-2 bg-white dark:bg-blue-950/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Task Response</p>
            <p className="text-xl font-bold text-primary">{feedback.task_response || '—'}</p>
          </div>
          <div className="p-2 bg-white dark:bg-blue-950/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Coherence</p>
            <p className="text-xl font-bold text-primary">{feedback.coherence || '—'}</p>
          </div>
          <div className="p-2 bg-white dark:bg-blue-950/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Lexical</p>
            <p className="text-xl font-bold text-primary">{feedback.lexical || '—'}</p>
          </div>
          <div className="p-2 bg-white dark:bg-blue-950/50 rounded-lg col-span-2">
            <p className="text-xs text-muted-foreground">Grammar</p>
            <p className="text-xl font-bold text-primary">{feedback.grammar || '—'}</p>
          </div>
        </div>

        <div>
          <p className="font-medium text-sm">❌ Errors & Corrections</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {feedback.errors?.map((err: string, i: number) => (
              <li key={i} className="text-muted-foreground">{err}</li>
            )) || <li className="text-muted-foreground">✅ No errors found.</li>}
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm">💡 Suggestions</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {feedback.suggestions?.map((s: string, i: number) => (
              <li key={i} className="text-muted-foreground">{s}</li>
            )) || <li className="text-muted-foreground">—</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
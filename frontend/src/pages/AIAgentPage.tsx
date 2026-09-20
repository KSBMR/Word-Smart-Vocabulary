import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, Loader2, Send, Sparkles, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechToText } from '@/hooks/useSpeechToText';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Message {
  role: 'user' | 'ai';
  content: string;
  type?: string;
}

export default function AIAgentPage() {
  // ✅ ALL HOOKS FIRST
  const { transcript, isListening, error: speechError, startListening, stopListening } = useSpeechToText();
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [serverError, setServerError] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Load available voices for TTS
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        voicesRef.current = available;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send first question when page loads
  useEffect(() => {
    sendMessage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user finishes speaking
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      sendMessage(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening]);

  // ============ SPEAK (Text-to-Speech) ============
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    setIsSpeaking(true);

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voices = voicesRef.current;
    const preferred = voices.find(
      (v) =>
        v.name.includes('Google UK') ||
        v.name.includes('Google US') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // ============ SEND MESSAGE TO BACKEND ============
  const sendMessage = async (message: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setServerError('');

    if (message) {
      setMessages((prev) => [...prev, { role: 'user', content: message }]);
    }

    try {
      const res = await fetch(`${API_URL}/api/ai-agent/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text.slice(0, 150)}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const content = data.content || 'No response from AI';
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content, type: data.type },
      ]);
      setAiResponse(content);

      if (content) {
        speakText(content);
      }
    } catch (err: any) {
      console.error('❌ AI Agent error:', err);
      const errorMsg = err.message || 'Something went wrong.';
      setServerError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: `⚠️ ${errorMsg}` },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ============ HANDLERS ============
  const handleStartListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto animate-page-fade">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
          <Sparkles className="h-3 w-3" />
          AI POWERED
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Speaking Coach
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
          Practice IELTS speaking with an AI examiner. Speak or type, and get instant feedback.
        </p>
      </div>

      {/* Chat Area */}
      <Card className="border-border/60 shadow-lg">
        <CardContent className="p-0">
          <div className="max-h-[60vh] md:max-h-[65vh] overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">
                  Starting conversation...
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>

                  {msg.role === 'ai' && msg.type === 'feedback' && (
                    <div className="mt-2 pt-2 border-t border-border/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Feedback
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce-dot" />
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce-dot"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {serverError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400">
          <strong>Error:</strong> {serverError}
        </div>
      )}

      {speechError && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-600 dark:text-amber-400">
          <strong>Mic:</strong> {speechError}
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {/* Text Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your answer... (or use mic below)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="resize-none rounded-xl bg-muted/50 border-border/60 focus-visible:ring-primary/40"
            disabled={isProcessing}
          />
          <Button
            onClick={handleTextSend}
            disabled={!inputText.trim() || isProcessing}
            className="self-stretch px-4 rounded-xl gradient-bg hover:opacity-90 text-white shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Voice + Actions */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            onClick={handleStartListening}
            disabled={isProcessing}
            className={cn(
              'gap-2 rounded-full px-5 h-11 transition-all',
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'gradient-bg hover:opacity-90 text-white'
            )}
          >
            {isListening ? (
              <>
                <div className="relative">
                  <StopCircle className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full animate-ping" />
                </div>
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Speaking
              </>
            )}
          </Button>

          {aiResponse && (
            <>
              {isSpeaking ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopSpeaking}
                  className="rounded-xl h-11 w-11"
                  title="Stop speaking"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => speakText(aiResponse)}
                  className="rounded-xl h-11 w-11"
                  title="Replay response"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Status */}
        <p className="text-center text-[11px] text-muted-foreground">
          {isProcessing
            ? '🤔 AI is thinking...'
            : isSpeaking
              ? '🔊 AI is speaking...'
              : isListening
                ? '🎤 Listening...'
                : '💡 Speak or type your answer'}
        </p>
      </div>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen-safe bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ============ Background Decorative Elements ============ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient blobs */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-bg opacity-10 blur-3xl animate-float-slow"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 md:w-96 md:h-96 rounded-full gradient-bg opacity-10 blur-3xl animate-float-slow"
          style={{ animationDelay: '2s' }}
        />

        {/* Floating emojis / words */}
        <div
          className="absolute top-[15%] left-[10%] text-4xl md:text-5xl opacity-15 animate-float-letter"
          style={{ animationDelay: '0s' }}
        >
          📚
        </div>
        <div
          className="absolute top-[20%] right-[15%] text-3xl md:text-4xl opacity-15 animate-float-letter"
          style={{ animationDelay: '1s' }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-[20%] left-[20%] text-3xl md:text-4xl opacity-15 animate-float-letter"
          style={{ animationDelay: '2s' }}
        >
          🧠
        </div>
        <div
          className="absolute bottom-[15%] right-[10%] text-4xl md:text-5xl opacity-15 animate-float-letter"
          style={{ animationDelay: '0.5s' }}
        >
          📖
        </div>
      </div>

      {/* ============ Main Content ============ */}
      <div className="relative z-10 max-w-lg w-full text-center">
        {/* 404 Numbers */}
        <div className="relative mb-6 md:mb-8">
          <div
            className={`flex items-center justify-center gap-2 md:gap-4 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span
              className="text-[100px] md:text-[140px] lg:text-[180px] font-black leading-none gradient-text animate-float-number"
              style={{ animationDelay: '0s' }}
            >
              4
            </span>
            <span
              className="text-[100px] md:text-[140px] lg:text-[180px] font-black leading-none gradient-text animate-float-number"
              style={{ animationDelay: '0.2s' }}
            >
              0
            </span>
            <span
              className="text-[100px] md:text-[140px] lg:text-[180px] font-black leading-none gradient-text animate-float-number"
              style={{ animationDelay: '0.4s' }}
            >
              4
            </span>
          </div>

          {/* Underline accent */}
          <div
            className={`h-1 w-32 mx-auto mt-2 rounded-full gradient-bg transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </div>

        {/* Title */}
        <h1
          className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p
          className={`text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Oops! The word you're looking for isn't in our dictionary.
          <br />
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto gradient-bg hover:opacity-90 text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/30 gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto rounded-xl h-11 px-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div
          className={`mt-10 md:mt-12 transition-all duration-700 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold mb-4">
            Or try these
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/vocabulary"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors text-xs md:text-sm font-medium"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Vocabulary
            </Link>
            <Link
              to="/analogy"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors text-xs md:text-sm font-medium"
            >
              🔗 Analogy
            </Link>
            <Link
              to="/quiz"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors text-xs md:text-sm font-medium"
            >
              🧠 Quiz
            </Link>
            <Link
              to="/ai-agent"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors text-xs md:text-sm font-medium"
            >
              ✨ AI Coach
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div
          className={`mt-8 text-xs text-muted-foreground transition-all duration-700 delay-900 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          💡 Tip: Use the <strong className="text-foreground">search bar</strong>{' '}
          to find a specific word
        </div>
      </div>
    </div>
  );
}
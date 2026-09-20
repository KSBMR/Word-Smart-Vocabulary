import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: {
    box: 'w-8 h-8 rounded-lg',
    text: 'text-sm',
    sub: 'text-[9px]',
  },
  md: {
    box: 'w-9 h-9 rounded-xl',
    text: 'text-sm',
    sub: 'text-[10px]',
  },
  lg: {
    box: 'w-11 h-11 rounded-xl',
    text: 'text-lg',
    sub: 'text-xs',
  },
  xl: {
    box: 'w-20 h-20 rounded-2xl',
    text: 'text-2xl',
    sub: 'text-xs',
  },
};

export function Logo({
  size = 'md',
  showText = true,
  animated = false,
  className,
}: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo Image */}
      <div className="relative shrink-0">
        {animated && (
          <>
            <div className="absolute inset-0 rounded-2xl gradient-bg opacity-30 animate-ping-slow" />
            <div
              className="absolute inset-0 rounded-2xl gradient-bg opacity-20 animate-ping-slow"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}
        <img
          src="/favicon.jpg"
          alt="Word Smart"
          className={cn(
            s.box,
            'object-cover',
            'shadow-md shadow-primary/20',
            animated && 'shadow-xl shadow-primary/40 animate-float relative'
          )}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="min-w-0">
          <p className={cn('font-extrabold tracking-tight leading-tight', s.text)}>
            Word Smart
          </p>
          <p className={cn('text-muted-foreground leading-tight', s.sub)}>
            Vocabulary Learning
          </p>
        </div>
      )}
    </div>
  );
}
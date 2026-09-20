import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/useFullscreen';
import { cn } from '@/lib/utils';

interface FullscreenButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function FullscreenButton({
  className,
  variant = 'outline',
}: FullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleFullscreen}
      className={cn('rounded-xl h-10 w-10 shrink-0', className)}
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  );
}
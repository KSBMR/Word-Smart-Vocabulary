import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Vocabulary } from '@/types';
import { Volume2, Bookmark, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSpeech } from '@/hooks/useSpeech';

interface WordDetailsModalProps {
  word: Vocabulary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allWords: Vocabulary[];
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onWordSelect: (word: Vocabulary) => void;
}

export function WordDetailsModal({
  word,
  open,
  onOpenChange,
  allWords,
  isBookmarked = false,
  onBookmarkToggle,
  onWordSelect,
}: WordDetailsModalProps) {
  const speak = useSpeech();
  const [view, setView] = useState<'detail' | 'category'>('detail');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  if (!word) return null;

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setView('category');
  };

  const wordsInCategory = selectedLetter
    ? allWords.filter(
        (w) => (w.alphabet || w.word[0].toUpperCase()) === selectedLetter
      )
    : [];

  const goBackToDetail = () => {
    setView('detail');
  };

  const selectWord = (w: Vocabulary) => {
    onWordSelect(w);
    setView('detail');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        {view === 'detail' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <button
                  onClick={() => handleLetterClick(word.alphabet || word.word[0].toUpperCase())}
                  className="text-3xl font-bold text-muted-foreground hover:text-primary transition-colors"
                  title="View all words starting with this letter"
                >
                  {word.alphabet || word.word[0].toUpperCase()}
                </button>
                <span className="text-2xl">{word.word}</span>
                <Button variant="ghost" size="icon" onClick={() => speak(word.word)} className="h-8 w-8">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 overflow-y-auto flex-1">
              <p className="text-muted-foreground">{word.pronunciation}</p>
              <div>
                <p className="font-medium">English Meaning</p>
                <p>{word.englishMeaning}</p>
              </div>
              <div>
                <p className="font-medium">Bangla Meaning</p>
                <p>{word.banglaMeaning}</p>
              </div>
              <div>
                <p className="font-medium">Example</p>
                <p className="text-sm italic">"{word.sentence}"</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Book {word.book}</span>
                <span>•</span>
                <span>Lesson {word.lesson}</span>
                <span>•</span>
                <span>Alphabet {word.alphabet}</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 border-t pt-4">
              <Button variant="outline" onClick={onBookmarkToggle}>
                <Bookmark
                  className={cn('h-4 w-4 mr-2', isBookmarked && 'fill-primary text-primary')}
                />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="flex flex-row items-center gap-2">
              <Button variant="ghost" size="icon" onClick={goBackToDetail}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl">
                Words starting with <span className="font-bold">{selectedLetter}</span>
              </DialogTitle>
              <span className="text-sm text-muted-foreground ml-auto">
                {wordsInCategory.length} words
              </span>
            </DialogHeader>

            <ScrollArea className="flex-1 h-[400px] pr-4">
              <div className="space-y-1">
                {wordsInCategory.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => selectWord(w)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium">{w.word}</span>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">
                      {w.englishMeaning}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}



// import { useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Vocabulary } from '@/types'
// import { Volume2, Bookmark, X, ArrowLeft, List } from 'lucide-react'
// import { cn } from '@/lib/utils'
// import { ScrollArea } from '@/components/ui/scroll-area'

// interface WordDetailsModalProps {
//   word: Vocabulary | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   allWords: Vocabulary[]
//   isBookmarked?: boolean
//   onBookmarkToggle?: () => void
//   onWordSelect: (word: Vocabulary) => void
//   onLetterClick: (letter: string) => void
// }

// export function WordDetailsModal({
//   word,
//   open,
//   onOpenChange,
//   allWords,
//   isBookmarked = false,
//   onBookmarkToggle,
//   onWordSelect,
//   onLetterClick,
// }: WordDetailsModalProps) {
//   const [view, setView] = useState<'detail' | 'category'>('detail')
//   const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       setView('detail')
//       setSelectedLetter(null)
//     }
//     onOpenChange(open)
//   }

//   if (!word) return null

//   const speak = () => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(word.word)
//       utterance.lang = 'en-US'
//       utterance.rate = 0.9
//       window.speechSynthesis.speak(utterance)
//     }
//   }

//   const openCategory = (letter: string) => {
//     setSelectedLetter(letter)
//     setView('category')
//   }

//   const wordsInCategory = selectedLetter
//     ? allWords.filter(
//         (w) => (w.alphabet || w.word[0].toUpperCase()) === selectedLetter
//       )
//     : []

//   const goBackToDetail = () => {
//     setView('detail')
//   }

//   const selectWord = (w: Vocabulary) => {
//     onWordSelect(w)
//     setView('detail')
//   }

//   const letter = word.alphabet || word.word[0].toUpperCase()

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
//         {view === 'detail' ? (
//           // === DETAIL VIEW ===
//           <>
//             <DialogHeader>
//               <DialogTitle className="text-2xl flex items-center gap-2">
//                 <span>{word.word}</span>
//                 <Button variant="ghost" size="icon" onClick={speak} className="h-8 w-8">
//                   <Volume2 className="h-4 w-4" />
//                 </Button>
//               </DialogTitle>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <button
//                   onClick={() => {
//                     openCategory(letter)
//                     onLetterClick(letter)
//                   }}
//                   className="text-primary hover:underline flex items-center gap-1"
//                 >
//                   <List className="h-3 w-3" /> View all words starting with {letter}
//                 </button>
//               </div>
//             </DialogHeader>

//             <div className="space-y-4 overflow-y-auto flex-1">
//               <p className="text-muted-foreground">{word.pronunciation}</p>
//               <div>
//                 <p className="font-medium">English Meaning</p>
//                 <p>{word.englishMeaning}</p>
//               </div>
//               <div>
//                 <p className="font-medium">Bangla Meaning</p>
//                 <p>{word.banglaMeaning}</p>
//               </div>
//               <div>
//                 <p className="font-medium">Example</p>
//                 <p className="text-sm italic">"{word.sentence}"</p>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <span>Word Smart {word.book}</span>
//                 <span>•</span>
//                 <span>Lesson {word.lesson}</span>
//                 <span>•</span>
//                 <span>Alphabet {word.alphabet}</span>
//               </div>
//             </div>

//             <div className="flex justify-between mt-4 border-t pt-4">
//               <Button variant="outline" onClick={onBookmarkToggle}>
//                 <Bookmark
//                   className={cn('h-4 w-4 mr-2', isBookmarked && 'fill-primary text-primary')}
//                 />
//                 {isBookmarked ? 'Bookmarked' : 'Bookmark'}
//               </Button>
//             </div>
//           </>
//         ) : (
//           // === CATEGORY VIEW ===
//           <>
//             <DialogHeader className="flex flex-row items-center gap-2">
//               <Button variant="ghost" size="icon" onClick={goBackToDetail}>
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//               <DialogTitle className="text-xl">
//                 Words starting with <span className="font-bold">{selectedLetter}</span>
//               </DialogTitle>
//               <span className="text-sm text-muted-foreground ml-auto">
//                 {wordsInCategory.length} words
//               </span>
//             </DialogHeader>

//             <ScrollArea className="flex-1 h-[400px] pr-4">
//               <div className="space-y-1">
//                 {wordsInCategory.map((w) => (
//                   <button
//                     key={w.id}
//                     onClick={() => selectWord(w)}
//                     className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
//                   >
//                     <span className="font-medium">{w.word}</span>
//                     <span className="text-sm text-muted-foreground group-hover:text-foreground">
//                       {w.englishMeaning}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </ScrollArea>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

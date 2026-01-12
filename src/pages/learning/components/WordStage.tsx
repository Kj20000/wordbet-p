import { WordInput } from "@/components/learning/WordInput";
import { VirtualKeyboard } from "@/components/learning/VirtualKeyboard";
import { DeviceLayout } from "../hooks/useDeviceLayout";

interface WordStageProps {
  currentInput: string;
  suggestion: string;
  highlightedKey: string;
  wordLength: number;
  layout: DeviceLayout;
  onKeyClick: (letter: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const WordStage = ({
  currentInput,
  suggestion,
  highlightedKey,
  wordLength,
  layout,
  onKeyClick,
  onBackspace,
  onClear,
}: WordStageProps) => {
  const isMobilePortrait = layout === 'mobile-portrait';
  const isMobileLandscape = layout === 'mobile-landscape';
  const isIpadPortrait = layout === 'ipad-portrait';
  const isIpadLandscape = layout === 'ipad-landscape';

  // Mobile Portrait Layout
  if (isMobilePortrait) {
    return (
      <>
        <div className="w-full flex items-center justify-center">
          <WordInput
            value={currentInput}
            suggestion={suggestion}
            wordLength={wordLength}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <VirtualKeyboard
            onKeyClick={onKeyClick}
            onBackspace={onBackspace}
            onClear={onClear}
            highlightedKey={highlightedKey}
            layoutMode="mobile-portrait"
          />
        </div>
      </>
    );
  }

  // Mobile Landscape Layout
  if (isMobileLandscape) {
    return (
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center px-4">
          <WordInput
            value={currentInput}
            suggestion={suggestion}
            wordLength={wordLength}
          />
        </div>
        <div className="shrink-0">
          <VirtualKeyboard
            onKeyClick={onKeyClick}
            onBackspace={onBackspace}
            onClear={onClear}
            highlightedKey={highlightedKey}
            layoutMode="mobile-landscape"
          />
        </div>
      </div>
    );
  }

  // iPad Portrait Layout
  if (isIpadPortrait) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[60px] px-4 pt-3">
          <WordInput
            value={currentInput}
            suggestion={suggestion}
            wordLength={wordLength}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <VirtualKeyboard
            onKeyClick={onKeyClick}
            onBackspace={onBackspace}
            onClear={onClear}
            highlightedKey={highlightedKey}
            layoutMode="ipad-portrait"
          />
        </div>
      </>
    );
  }

  // iPad Landscape Layout
  if (isIpadLandscape) {
    return (
      <>
        <div className="w-1/2 flex items-center justify-center px-4">
          <WordInput
            value={currentInput}
            suggestion={suggestion}
            wordLength={wordLength}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <VirtualKeyboard
            onKeyClick={onKeyClick}
            onBackspace={onBackspace}
            onClear={onClear}
            highlightedKey={highlightedKey}
            layoutMode="ipad-landscape"
          />
        </div>
      </>
    );
  }

  return null;
};

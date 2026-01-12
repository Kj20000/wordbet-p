import { ChevronLeft, ChevronRight } from "lucide-react";
import { Word } from "../hooks/useWords";
import { DeviceLayout } from "../hooks/useDeviceLayout";

interface ImageStageProps {
  currentWord: Word | null;
  imageSrc: string;
  imageKey: number;
  mode: "image-first" | "word-first";
  wordCompleted: boolean;
  categoryChanging: boolean;
  currentIndex: number;
  layout: DeviceLayout;
  onPrevious: () => void;
  onNext: () => void;
}

export const ImageStage = ({
  currentWord,
  imageSrc,
  imageKey,
  mode,
  wordCompleted,
  categoryChanging,
  currentIndex,
  layout,
  onPrevious,
  onNext,
}: ImageStageProps) => {
  const isMobilePortrait = layout === 'mobile-portrait';
  const isMobileLandscape = layout === 'mobile-landscape';
  const isIpadPortrait = layout === 'ipad-portrait';
  const isIpadLandscape = layout === 'ipad-landscape';

  // Mobile Portrait Layout
  if (isMobilePortrait) {
    return (
      <div className="w-full flex items-center justify-center gap-2 px-3">
        <button
          onClick={onPrevious}
          className="shrink-0 rounded-full bg-white/30 p-2 hover:scale-110 transition-transform"
        >
          <ChevronLeft className="w-7 h-7 text-white drop-shadow" />
        </button>

        <div className="relative w-[80%] max-w-[352px]">
          {!categoryChanging && currentWord && (mode === "image-first" || wordCompleted) && (
            <div key={`${currentWord.id}-${currentIndex}`} className="w-full aspect-square rounded-3xl border-4 border-white shadow-2xl drop-shadow-xl overflow-hidden flex items-center justify-center bg-white image-transition">
              {imageSrc && (
                <img
                  key={`img-${imageKey}`}
                  src={imageSrc}
                  alt={currentWord.word}
                  className="object-cover w-full h-full image-fade-transition"
                />
              )}
            </div>
          )}

          {currentWord && mode === "word-first" && !wordCompleted && (
            <div className="w-full aspect-square rounded-3xl border-4 border-dashed border-blue-400 flex items-center justify-center bg-white/40 shadow-xl">
              <span className="text-8xl animate-bounce">❓</span>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          className="shrink-0 rounded-full bg-white/30 p-2 hover:scale-110 transition-transform"
        >
          <ChevronRight className="w-7 h-7 text-white drop-shadow"/>
        </button>
      </div>
    );
  }

  // Mobile Landscape Layout
  if (isMobileLandscape) {
    return (
      <div className="relative w-1/2 flex items-center justify-center p-2">
        <button onClick={onPrevious} className="absolute left-2 z-10">
          <ChevronLeft />
        </button>

        {!categoryChanging && currentWord && (mode === "image-first" || wordCompleted) && (
          <div className="rounded-xl overflow-hidden flex items-center justify-center bg-white">
            {imageSrc && (
              <img
                key={`img-${imageKey}`}
                src={imageSrc}
                alt={currentWord.word}
                className="object-contain rounded-xl max-h-[calc(100dvh-120px)] max-w-full image-transition"
              />
            )}
          </div>
        )}

        {currentWord && mode === "word-first" && !wordCompleted && (
          <div className="w-full h-[calc(100dvh-120px)] max-w-[400px] rounded-xl border-4 border-dashed border-primary/30 flex items-center justify-center bg-primary/5">
            <span className="text-6xl">❓</span>
          </div>
        )}

        <button onClick={onNext} className="absolute right-2 z-10">
          <ChevronRight />
        </button>
      </div>
    );
  }

  // iPad Portrait Layout
  if (isIpadPortrait) {
    return (
      <div className="relative flex-initial flex items-start justify-center p-3 pt-12">
        <button onClick={onPrevious} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform">
          <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
        </button>

        {!categoryChanging && currentWord && (mode === "image-first" || wordCompleted) && (
          <div key={`${currentWord.id}-${currentIndex}`} className="w-[68%] aspect-square max-w-[400px] rounded-3xl border-4 border-white shadow-2xl drop-shadow-xl overflow-hidden flex items-center justify-center bg-white image-transition">
            {imageSrc && (
              <img
                key={`img-${imageKey}`}
                src={imageSrc}
                alt={currentWord.word}
                className="object-cover w-full h-full rounded-[1.25rem] image-fade-transition"
              />
            )}
          </div>
        )}

        {currentWord && mode === "word-first" && !wordCompleted && (
          <div className="w-[68%] aspect-square max-w-[400px] rounded-3xl border-4 border-dashed border-blue-400 flex items-center justify-center bg-white/40 shadow-xl">
            <span className="text-9xl animate-bounce">❓</span>
          </div>
        )}

        <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform">
          <ChevronRight className="w-8 h-8 text-white drop-shadow-lg"/>
        </button>
      </div>
    );
  }

  // iPad Landscape Layout
  if (isIpadLandscape) {
    return (
      <div className="relative w-1/2 flex items-center justify-center p-2 -translate-y-3">
        <button onClick={onPrevious} className="absolute left-2 z-10">
          <ChevronLeft />
        </button>

        {!categoryChanging && currentWord && (mode === "image-first" || wordCompleted) && (
          <div key={`${currentWord.id}-${currentIndex}`} className="rounded-3xl border-4 border-white shadow-2xl drop-shadow-xl overflow-hidden flex items-center justify-center bg-white w-[480px] h-[300px] image-transition">
            {imageSrc && (
              <img
                key={`img-${imageKey}`}
                src={imageSrc}
                alt={currentWord.word}
                className="object-contain w-full h-full image-fade-transition"
              />
            )}
          </div>
        )}

        {currentWord && mode === "word-first" && !wordCompleted && (
          <div className="w-[480px] h-[300px] rounded-3xl border-4 border-dashed border-primary/30 flex items-center justify-center bg-primary/5">
            <span className="text-6xl">❓</span>
          </div>
        )}

        <button onClick={onNext} className="absolute right-2 z-10">
          <ChevronRight />
        </button>
      </div>
    );
  }

  return null;
};

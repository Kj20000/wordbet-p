import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Image, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { getCelebrationEnabled } from "@/storage/settings";

// Custom Hooks
import { useDeviceLayout } from "./hooks/useDeviceLayout";
import { useWords } from "./hooks/useWords";
import { useAudioFlow } from "./hooks/useAudioFlow";
import { useCelebration } from "./hooks/useCelebration";

// Components
import { LearningHeader } from "./components/LearningHeader";
import { ImageStage } from "./components/ImageStage";
import { WordStage } from "./components/WordStage";
import { CelebrationLayer } from "./components/CelebrationLayer";

type LearningMode = "image-first" | "word-first";

const Learning = () => {
  const navigate = useNavigate();
  const layout = useDeviceLayout();

  // Local state
  const [mode, setMode] = useState<LearningMode>("image-first");
  const [pendingCategory, setPendingCategory] = useState("all");
  const [categoryChanging, setCategoryChanging] = useState(false);
  
  const categoryDebounceRef = useRef<number | null>(null);
  const categoryChangeTimerRef = useRef<number | null>(null);
  const lastCelebratedWordIdRef = useRef<string | null>(null);

  // Custom hooks
  const {
    words,
    categories,
    currentWord,
    currentIndex,
    imageSrc,
    imageKey,
    selectedCategory,
    setSelectedCategory,
    goPrevious,
    goNext,
    changeWord,
  } = useWords();

  const {
    showBalloons,
    balloons,
    stars,
    confetti,
    handleBalloonPop,
    clearCelebration,
    triggerCelebration,
  } = useCelebration();

  const {
    currentInput,
    suggestion,
    highlightedKey,
    wordCompleted,
    handleInputChange,
    hardStopAudio,
    resetWordState,
  } = useAudioFlow(currentWord, showBalloons);

  // Sync pending category with selected category
  useEffect(() => {
    setPendingCategory(selectedCategory);
  }, [selectedCategory]);

  // Cleanup debounce ref
  useEffect(() => {
    return () => {
      if (categoryDebounceRef.current) {
        clearTimeout(categoryDebounceRef.current);
        categoryDebounceRef.current = null;
      }
    };
  }, []);

  // Category change handler with debounce
  const handleCategoryChange = (value: string) => {
    setPendingCategory(value);

    if (categoryDebounceRef.current) {
      clearTimeout(categoryDebounceRef.current);
    }

    categoryDebounceRef.current = window.setTimeout(() => {
      setSelectedCategory(value);
      categoryDebounceRef.current = null;
    }, 250);
  };

  // Animation race lock on category change
  useEffect(() => {
    setCategoryChanging(true);

    if (categoryChangeTimerRef.current) {
      clearTimeout(categoryChangeTimerRef.current);
    }

    categoryChangeTimerRef.current = window.setTimeout(() => {
      setCategoryChanging(false);
      categoryChangeTimerRef.current = null;
    }, 200);

    return () => {
      if (categoryChangeTimerRef.current) {
        clearTimeout(categoryChangeTimerRef.current);
        categoryChangeTimerRef.current = null;
      }
    };
  }, [selectedCategory]);

  // Stop audio during category change
  useEffect(() => {
    if (categoryChanging) {
      hardStopAudio();
      clearCelebration();
    }
  }, [categoryChanging]);

  // Stop audio when page is hidden/backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Page hidden - stopping all audio");
        hardStopAudio();
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    };

    const handleBlur = () => {
      console.log("Window blur - stopping all audio");
      hardStopAudio();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [hardStopAudio]);

  // Handle keyboard input
  const handleKeyClick = (l: string) => {
    handleInputChange(currentInput + l.toLowerCase());
  };

  const handleBackspace = () => handleInputChange(currentInput.slice(0, -1));
  const handleClear = () => handleInputChange("");

  // Handle navigation with reset
  const handlePrevious = () => {
    resetWordState();
    lastCelebratedWordIdRef.current = null;
    goPrevious();
  };

  const handleNext = () => {
    resetWordState();
    lastCelebratedWordIdRef.current = null;
    goNext();
  };

  // Wrap changeWord to reset celebration tracking
  const handleChangeWord = () => {
    lastCelebratedWordIdRef.current = null;
    resetWordState();
    changeWord();
  };

  // Trigger celebration and image change independently when word is completed
  useEffect(() => {
    if (!wordCompleted || !currentWord) return;

    // Prevent duplicate celebrations for the same word
    if (lastCelebratedWordIdRef.current === currentWord.id) {
      console.log("Already celebrated this word, skipping");
      return;
    }

    console.log("Word completed - triggering independent flows");
    lastCelebratedWordIdRef.current = currentWord.id;
    
    // Trigger celebration immediately (independent event)
    triggerCelebration();
    
    // Change image after fixed delay based on celebration mode
    const isCelebrationOn = getCelebrationEnabled();
    const changeDelay = isCelebrationOn ? 6000 : 4000;
    
    console.log(`Image will change after ${changeDelay}ms (celebration ${isCelebrationOn ? 'ON' : 'OFF'})`);
    
    const imageChangeTimer = setTimeout(() => {
      console.log(`Changing image after ${changeDelay}ms`);
      handleChangeWord();
    }, changeDelay);
    
    return () => clearTimeout(imageChangeTimer);
  }, [wordCompleted, currentWord?.id]);

  const isMobilePortrait = layout === 'mobile-portrait';
  const isMobileLandscape = layout === 'mobile-landscape';
  const isIpadPortrait = layout === 'ipad-portrait';
  const isIpadLandscape = layout === 'ipad-landscape';

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-gradient-to-br from-primary/10 to-secondary/10 relative">
      {/* Cartoon background decorations */}
      <div className="absolute top-8 left-4 w-20 h-20 bg-yellow-300 rounded-full opacity-70 blur-sm"></div>
      <div className="absolute top-32 right-8 w-32 h-32 bg-blue-300 rounded-full opacity-60 blur-lg"></div>
      <div className="absolute bottom-40 left-8 w-24 h-24 bg-pink-300 rounded-full opacity-50 blur-md"></div>
      <div className="absolute bottom-20 right-12 w-28 h-28 bg-green-300 rounded-full opacity-60 blur-lg"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-300 rounded-full opacity-40 blur-md"></div>

      {/* HEADER */}
      <LearningHeader
        categories={categories}
        selectedCategory={selectedCategory}
        pendingCategory={pendingCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* MODE TOGGLE */}
      <div className="flex justify-end gap-2 px-4 py-2">
        <Image className={mode === "image-first" ? "text-primary" : ""} />
        <Switch
          checked={mode === "word-first"}
          onCheckedChange={c => setMode(c ? "word-first" : "image-first")}
        />
        <Type className={mode === "word-first" ? "text-primary" : ""} />
      </div>

      {/* NO WORDS MESSAGE */}
      {(!words.length || !currentWord) && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold text-gray-700">No Words Available</h2>
            <p className="text-gray-500">Add some words in Settings to start learning!</p>
            <Button
              onClick={() => navigate("/settings")}
              className="bg-primary text-white mt-4"
            >
              <Settings className="mr-2 h-4 w-4" />
              Go to Settings
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE PORTRAIT LAYOUT */}
      {words.length > 0 && isMobilePortrait && (
        <>
          <div className="flex-1 flex flex-col items-center gap-4 px-3 pt-4 pb-[280px]">
            <ImageStage
              currentWord={currentWord}
              imageSrc={imageSrc}
              imageKey={imageKey}
              mode={mode}
              wordCompleted={wordCompleted}
              categoryChanging={categoryChanging}
              currentIndex={currentIndex}
              layout={layout}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            <WordStage
              currentInput={currentInput}
              suggestion={suggestion}
              highlightedKey={highlightedKey}
              wordLength={currentWord?.word.length || 0}
              layout={layout}
              onKeyClick={handleKeyClick}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />
          </div>
        </>
      )}

      {/* MOBILE LANDSCAPE LAYOUT */}
      {words.length > 0 && isMobileLandscape && (
        <div className="flex-1 flex flex-row h-full">
          <ImageStage
            currentWord={currentWord}
            imageSrc={imageSrc}
            imageKey={imageKey}
            mode={mode}
            wordCompleted={wordCompleted}
            categoryChanging={categoryChanging}
            currentIndex={currentIndex}
            layout={layout}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <WordStage
            currentInput={currentInput}
            suggestion={suggestion}
            highlightedKey={highlightedKey}
            wordLength={currentWord?.word.length || 0}
            layout={layout}
            onKeyClick={handleKeyClick}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </div>
      )}

      {/* IPAD PORTRAIT LAYOUT */}
      {words.length > 0 && isIpadPortrait && (
        <>
          <div className="flex-1 flex flex-col pb-[280px]">
            <ImageStage
              currentWord={currentWord}
              imageSrc={imageSrc}
              imageKey={imageKey}
              mode={mode}
              wordCompleted={wordCompleted}
              categoryChanging={categoryChanging}
              currentIndex={currentIndex}
              layout={layout}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            <WordStage
              currentInput={currentInput}
              suggestion={suggestion}
              highlightedKey={highlightedKey}
              wordLength={currentWord?.word.length || 0}
              layout={layout}
              onKeyClick={handleKeyClick}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />
          </div>
        </>
      )}

      {/* IPAD LANDSCAPE LAYOUT */}
      {words.length > 0 && isIpadLandscape && (
        <>
          <div className="flex-1 flex flex-row pb-[280px]">
            <ImageStage
              currentWord={currentWord}
              imageSrc={imageSrc}
              imageKey={imageKey}
              mode={mode}
              wordCompleted={wordCompleted}
              categoryChanging={categoryChanging}
              currentIndex={currentIndex}
              layout={layout}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
            <WordStage
              currentInput={currentInput}
              suggestion={suggestion}
              highlightedKey={highlightedKey}
              wordLength={currentWord?.word.length || 0}
              layout={layout}
              onKeyClick={handleKeyClick}
              onBackspace={handleBackspace}
              onClear={handleClear}
            />
          </div>
        </>
      )}

      {/* CELEBRATION LAYER */}
      <CelebrationLayer
        showBalloons={showBalloons}
        balloons={balloons}
        stars={stars}
        confetti={confetti}
        onBalloonPop={handleBalloonPop}
      />
    </div>
  );
};

export default Learning;

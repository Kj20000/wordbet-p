import { useEffect, useState } from "react";
import { getWords } from "@/storage/words";
import { getCategories } from "@/storage/categories";
import { loadImageFile } from "@/storage/files";
import { getImageDisplayMode } from "@/storage/settings";
import { toast } from "sonner";

export interface Word {
  id: string;
  word: string;
  image: string;
  category_id: string | null;
}

export interface Category {
  id: string;
  name: string;
}

export const useWords = () => {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [imageKey, setImageKey] = useState(0);

  // Load words and categories
  useEffect(() => {
    Promise.all([getWords(), getCategories()]).then(
      ([loadedWords, loadedCategories]) => {
        if (!loadedWords.length) {
          toast.error("No words found. Add words in Settings.");
        }
        
        const normalized = loadedWords.map(w => ({
          ...w,
          category_id: w.category_id === "none" ? null : w.category_id
        }));
        
        setAllWords(normalized);
        setCategories(loadedCategories);
      }
    );
  }, []);

  // Filter words by category
  useEffect(() => {
    const mode = getImageDisplayMode();

    const filtered =
      selectedCategory === "all"
        ? allWords
        : allWords.filter(w => w.category_id === selectedCategory);

    let ordered = [...filtered];
    if (mode === "S") ordered.reverse();

    setWords(ordered);
    setCurrentIndex(0);
  }, [selectedCategory, allWords]);

  // Sync currentWord with words array
  useEffect(() => {
    if (words.length === 0) {
      setCurrentWord(null);
      return;
    }
    setCurrentWord(words[currentIndex]);
  }, [words, currentIndex]);

  // Update imageKey when word changes
  useEffect(() => {
    setImageKey(k => k + 1);
  }, [currentWord?.id]);

  // Load image
  useEffect(() => {
    if (!currentWord?.image) {
      setImageSrc("");
      return;
    }
    loadImageFile(currentWord.image)
      .then(setImageSrc)
      .catch(() => setImageSrc(""));
  }, [currentWord]);

  const goPrevious = () => {
    setCurrentIndex(i => (i - 1 + words.length) % words.length);
  };

  const goNext = () => {
    setCurrentIndex(i => (i + 1) % words.length);
  };

  const changeWord = () => {
    setCurrentIndex(i => (i + 1) % words.length);
  };

  return {
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
  };
};

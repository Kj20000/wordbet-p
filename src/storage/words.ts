export type Word = {
  id: string;
  word: string;
  image: string;
  audio?: string; // Optional audio file
  category_id: string | null;
};

const KEY = "words";

export function getWords(): Word[] {
  let words = JSON.parse(localStorage.getItem(KEY) || "[]");
  
  // Add default apple word if no words exist
  if (words.length === 0) {
    const defaultApple: Word = {
      id: "default-apple",
      word: "apple",
      image: "/apple.svg",
      category_id: null
    };
    words.push(defaultApple);
    localStorage.setItem(KEY, JSON.stringify(words));
  }
  
  return words;
}

export function saveWord(word: Word) {
  const words = getWords();
  const existingIndex = words.findIndex(w => w.id === word.id);
  
  if (existingIndex !== -1) {
    // Update existing word
    words[existingIndex] = word;
  } else {
    // Add new word at the beginning
    words.unshift(word);
  }
  
  localStorage.setItem(KEY, JSON.stringify(words));
}

export function deleteWord(id: string) {
  const words = getWords().filter(w => w.id !== id);
  localStorage.setItem(KEY, JSON.stringify(words));
}

/* =========================
   REQUIRED FOR BACKUP/RESTORE
========================= */
export function clearWords() {
  localStorage.removeItem(KEY);
}

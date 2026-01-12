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

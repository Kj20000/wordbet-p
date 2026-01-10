import { openDB } from "idb";

export const imageDB = openDB("typeimage-files", 2, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images");
    }
    if (oldVersion < 2 && !db.objectStoreNames.contains("audio")) {
      db.createObjectStore("audio");
    }
  },
});

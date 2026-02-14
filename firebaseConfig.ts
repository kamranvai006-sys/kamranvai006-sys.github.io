
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyATWNF5R1SxJ2TG6iONpuy7R_OHnJcOeKs",
  authDomain: "red-guyava-earning.firebaseapp.com",
  databaseURL: "https://red-guyava-earning-default-rtdb.firebaseio.com",
  projectId: "red-guyava-earning",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Helper functions
export const dbRef = (path: string) => ref(db, path);

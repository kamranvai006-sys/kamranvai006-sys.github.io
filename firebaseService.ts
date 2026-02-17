
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, Database } from 'firebase/database';
import { UserStatus } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAOChQ1nUytj0K3QLVIIxKbKJcceEPByKM",
  authDomain: "mr-club-51d50.firebaseapp.com",
  databaseURL: "https://mr-club-51d50-default-rtdb.firebaseio.com",
  projectId: "mr-club-51d50",
  storageBucket: "mr-club-51d50.firebasestorage.app",
  messagingSenderId: "563401746590",
  appId: "1:563401746590:web:b081bd0355e315ee69738f",
  measurementId: "G-BLM9XM1F3L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Simple deterministic device ID for demonstration
const getDeviceId = () => {
  let id = localStorage.getItem('sejan_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sejan_device_id', id);
  }
  return id;
};

export const listenToUserStatus = (callback: (status: UserStatus) => void) => {
  const deviceId = getDeviceId();
  const statusRef = ref(db, `DeviceStatus/${deviceId}`);
  
  return onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data === 'kicked' || data === 'blocked') {
      callback(UserStatus.BLOCKED);
    } else {
      callback(UserStatus.ACTIVE);
    }
  }, (error) => {
    console.error("Firebase Error:", error);
    // Default to active if DB fails or path doesn't exist yet
    callback(UserStatus.ACTIVE);
  });
};

export { db };

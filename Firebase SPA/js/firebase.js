// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// 아래 데이터는 본인의 Firebase 프로젝트 설정에서 확인할 수 있습니다.
const firebaseConfig = {
  apiKey: "AIzaSyBLC85NBtPaLOoWyBoSKwexacA6bC4qZX0",
  authDomain: "privatefanbook.firebaseapp.com",
  projectId: "privatefanbook",
  storageBucket: "privatefanbook.appspot.com",
  messagingSenderId: "691166733828",
  appId: "1:691166733828:web:7fb27f2b27fb95304fb751",
};

// Initialize Firebase
// Firebase 각 서비스에 연결하기
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);

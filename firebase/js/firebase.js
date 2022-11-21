// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

// 아래 데이터는 본인의 Firebase 프로젝트 설정에서 확인할 수 있습니다.
const firebaseConfig = {
     apiKey: "AIzaSyB3R79_Smh6G9f07h5ciX58gGpmzgWujvY",
     authDomain: "b3-project-7f458.firebaseapp.com",
     projectId: "b3-project-7f458",
     storageBucket: "b3-project-7f458.appspot.com",
     messagingSenderId: "293398828082",
     appId: "1:293398828082:web:22620af2cd98d684b8582b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
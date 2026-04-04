import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDYjQegtehldj3_eqho0IvANGrtt1UtbM",
  authDomain: "chat-47a5c.firebaseapp.com",
  databaseURL: "https://chat-47a5c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-47a5c",
  storageBucket: "chat-47a5c.firebasestorage.app",
  messagingSenderId: "353763342882",
  appId: "1:353763342882:web:3c0cd5019be34e279da87b",
  measurementId: "G-Y5H3B811XL"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Các dịch vụ cần dùng
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

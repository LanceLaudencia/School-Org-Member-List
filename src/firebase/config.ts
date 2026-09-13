import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA343hREqOXiSv2LDsuiW7WLAFrEs9Ksho",
  authDomain: "school-org-member-list.firebaseapp.com",
  databaseURL:
    "https://school-org-member-list-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "school-org-member-list",
  storageBucket: "school-org-member-list.firebasestorage.app",
  messagingSenderId: "462654728430",
  appId: "1:462654728430:web:113ae45b4ba3890a212bff",
  measurementId: "G-99H5MXGDWM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Realtime Database
export const db = getDatabase(app);
import firebase, { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// import 'firebase/auth';
import Constants from 'expo-constants';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  measurementId: Constants.manifest.extra.measurementId
};


let firebaseApp;

firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();  
export default firebaseApp;
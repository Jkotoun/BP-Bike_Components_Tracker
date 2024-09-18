import firebase, { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// import 'firebase/auth';
import Constants from 'expo-constants';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  // measurementId: Constants.expoConfig.extra.measurementId
};


let firebaseApp;

firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();  
export default firebaseApp;
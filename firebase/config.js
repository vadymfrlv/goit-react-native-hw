import firebase from 'firebase';
// import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCsQKoxl1Uhg6s1kbzZj9mIfv9o1D3B6lE',
  authDomain: 'reactnativeproject-3d158.firebaseapp.com',
  projectId: 'reactnativeproject-3d158',
  storageBucket: 'reactnativeproject-3d158.appspot.com',
  messagingSenderId: '478452631723',
  appId: '1:478452631723:web:ec7735e7fd18ea4f790fee',
  measurementId: 'G-CGHPXZCPC7',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };

//   // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {

//   storageBucket: "reactnativeproject-3d158.appspot.com",
//   messagingSenderId: "478452631723",
//   appId: "1:478452631723:web:85bcd56af4d8e57b790fee",
//   measurementId: "G-3ENGEZBRDB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

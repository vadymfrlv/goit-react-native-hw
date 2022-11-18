import * as firebase from 'firebase';
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

export default firebase.initializeApp(firebaseConfig);

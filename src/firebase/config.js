import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDLQdumSh8CiyM35waWKvBJ9-ZYeEf1SoQ',
  authDomain: 'socialapp-aa643.firebaseapp.com',
  projectId: 'socialapp-aa643',
  storageBucket: 'socialapp-aa643.appspot.com',
  messagingSenderId: '28245295508',
  appId: '1:28245295508:web:bd53cfadb2dffa543a0f81',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

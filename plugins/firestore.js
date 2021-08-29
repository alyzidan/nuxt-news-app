import firebase from 'firebase/app';
import 'firebase/firestore'
if (!firebase.apps.length) {
firebase.initializeApp({
  apiKey: "AIzaSyA9YZEMdoiV8_ay87ordsQo0jy1A0Vy2bw",
  authDomain: "devmeeting-b3694.firebaseapp.com",
  databaseURL: "https://devmeeting-b3694.firebaseio.com",
  projectId: "devmeeting-b3694",
  storageBucket: "devmeeting-b3694.appspot.com",
  messagingSenderId: "295953712678",
  appId: "1:295953712678:web:59d5f1d38db96111e288e7"
})
}else {
   firebase.app(); // if already initialized, use that one
}
firebase.firestore().settings({
        timestampInSnapshots: true
})
const db = firebase.firestore()
export default db
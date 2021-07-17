import firebase from "firebase/app";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB5LCAMSuj_5-oRxiAOZbuOFlm7MLOqFYQ",
    authDomain: "opt-phone.firebaseapp.com",
    projectId: "opt-phone",
    storageBucket: "opt-phone.appspot.com",
    messagingSenderId: "857247116685",
    appId: "1:857247116685:web:5063a85d3ccb81e55761c4",
    measurementId: "G-YV0891HN4Y"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;
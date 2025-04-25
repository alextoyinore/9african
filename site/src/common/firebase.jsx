// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUzDFk3D1nV2qCYnLKYqZga0ICqLj3FS8",
  authDomain: "african-c3658.firebaseapp.com",
  projectId: "african-c3658",
  storageBucket: "african-c3658.firebasestorage.app",
  messagingSenderId: "439124899834",
  appId: "1:439124899834:web:f99bb0c80a9a62645b5643"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth
const provider = new GoogleAuthProvider()

const auth = getAuth()

const authWithGoogle = async () => {
  let user = null

  await signInWithPopup(auth, provider)
  .then((result) => {
    user = result.user
  })
  .catch((err) => {
    console.log(err);
  })
  return user
}

export {
  authWithGoogle, app
}


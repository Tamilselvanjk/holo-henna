import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: 'test-login-67ca5.appspot.com',
  messagingSenderId: '580643630896',
  appId: '1:580643630896:web:7d52b9f9b0e9e9c8a8b8a8',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

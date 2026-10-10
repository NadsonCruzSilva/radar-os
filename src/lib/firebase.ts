import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
}

export const isDemoMode = !firebaseConfig.apiKey || !firebaseConfig.projectId

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (!isDemoMode) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error('Falha ao inicializar Firebase:', error)
  }
}

export { db, auth }

// Auth helpers
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) throw new Error('Firebase não configurado')
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signInGuest(): Promise<User | null> {
  if (!auth) throw new Error('Firebase não configurado')
  const result = await firebaseSignInAnonymously(auth)
  return result.user
}

export async function signInEmail(email: string, pass: string): Promise<User | null> {
  if (!auth) throw new Error('Firebase não configurado')
  const result = await signInWithEmailAndPassword(auth, email, pass)
  return result.user
}

export async function signUpEmail(email: string, pass: string): Promise<User | null> {
  if (!auth) throw new Error('Firebase não configurado')
  const result = await createUserWithEmailAndPassword(auth, email, pass)
  return result.user
}

export async function logOut(): Promise<void> {
  if (!auth) return
  await firebaseSignOut(auth)
}

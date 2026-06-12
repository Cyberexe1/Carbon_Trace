// =============================================================================
// SECTION: Firebase Authentication Service
// Wraps Firebase Auth calls so components never import firebase/auth directly.
// Supported flows:
//   - Email + Password Sign-Up
//   - Email + Password Sign-In
//   - Sign-Out
//   - Auth state observer (onAuthStateChanged)
//
// All functions return a normalized { user, error } shape so callers have
// a consistent API regardless of which auth method was used.
// =============================================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

// --- Helpers ---

/**
 * Normalize a Firebase user object into the minimal shape our app needs.
 * @param {import('firebase/auth').User} firebaseUser
 */
function normalizeUser(firebaseUser) {
  if (!firebaseUser) return null;
  return {
    uid:         firebaseUser.uid,
    name:        firebaseUser.displayName || firebaseUser.email.split('@')[0],
    email:       firebaseUser.email,
    photoURL:    firebaseUser.photoURL || null,
    isAnonymous: firebaseUser.isAnonymous,
  };
}

/**
 * Map Firebase error codes to human-readable messages.
 * @param {Error} err
 */
function friendlyError(err) {
  const map = {
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Only one popup request allowed at a time.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[err.code] || err.message || 'An unexpected error occurred.';
}

// =============================================================================
// SECTION: signUpWithEmail
// Creates a new account and sets the display name from the provided firstName.
// =============================================================================
export async function signUpWithEmail(firstName, lastName, email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name on the Firebase user profile
    await updateProfile(cred.user, {
      displayName: `${firstName} ${lastName}`.trim(),
    });
    return { user: normalizeUser(cred.user), error: null };
  } catch (err) {
    return { user: null, error: friendlyError(err) };
  }
}

// =============================================================================
// SECTION: signInWithEmail
// Signs in an existing user with email + password.
// =============================================================================
export async function signInWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { user: normalizeUser(cred.user), error: null };
  } catch (err) {
    return { user: null, error: friendlyError(err) };
  }
}

// =============================================================================
// SECTION: logOut
// Signs the current user out of Firebase Auth.
// =============================================================================
export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (err) {
    return { error: friendlyError(err) };
  }
}

// =============================================================================
// SECTION: subscribeToAuthChanges
// Registers a callback for auth state changes.
// Returns the unsubscribe function — call it in useEffect cleanup.
// =============================================================================
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(normalizeUser(firebaseUser));
  });
}

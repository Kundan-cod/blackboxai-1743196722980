import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyABC123XYZ456DEF789",
  authDomain: "chatogi-app.firebaseapp.com",
  projectId: "chatogi-app",
  storageBucket: "chatogi-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456xyz789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const googleLoginBtn = document.getElementById('google-login');
const githubLoginBtn = document.getElementById('github-login');
const forgotPasswordLink = document.getElementById('forgot-password');

// Tab switching
loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

function switchTab(tab) {
  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
  }
}

// Email/Password Authentication
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    redirectToApp();
  } catch (error) {
    showError(loginForm, error.message);
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;

  if (password !== confirmPassword) {
    showError(signupForm, 'Passwords do not match');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Additional user profile setup can go here
    redirectToApp();
  } catch (error) {
    showError(signupForm, error.message);
  }
});

// Social Authentication
googleLoginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    redirectToApp();
  } catch (error) {
    showError(loginForm, error.message);
  }
});

githubLoginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    redirectToApp();
  } catch (error) {
    showError(loginForm, error.message);
  }
});

// Password Reset
forgotPasswordLink.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = prompt('Please enter your email address:');
  if (email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
    } catch (error) {
      alert(error.message);
    }
  }
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    redirectToApp();
  }
});

// Helper Functions
function showError(form, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  
  const existingError = form.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  form.appendChild(errorElement);
  setTimeout(() => errorElement.remove(), 5000);
}

function redirectToApp() {
  window.location.href = '/';
}

// Initialize auth UI
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      redirectToApp();
    }
  });
});
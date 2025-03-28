import { getAuth, onAuthStateChanged, getIdToken } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { auth } from './auth.js';
import { initFriendsList } from './friends.js';
import { initChat } from './chat.js';
import { initCallFunctionality } from './call.js';

// Initialize socket connection
const socket = io({
  auth: (cb) => {
    getIdToken(auth.currentUser, true).then(token => {
      cb({ token });
    });
  }
});

// Token refresh handler
const setupTokenRefresh = () => {
  setInterval(async () => {
    if (auth.currentUser) {
      const token = await getIdToken(auth.currentUser, true);
      socket.auth.token = token;
      socket.emit('refresh-token', { token });
    }
  }, 10 * 60 * 1000); // Refresh every 10 minutes
};

// Authentication state handler
const handleAuthState = async (user) => {
  if (!user) {
    window.location.href = '/auth';
    return;
  }

  const token = await getIdToken(user);
  socket.auth.token = token;
  
  // Initialize components
  const chatManager = initChat(socket);
  initFriendsList(chatManager);
  initCallFunctionality(socket);
  setupTokenRefresh();
  
  console.log('Chatogi application initialized');
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, handleAuthState);
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  getDocs,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { firebaseConfig } from './auth.js';

// Initialize Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Message operations
export const MessageService = {
  // Send a new message
  async sendMessage(message) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...message,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse();
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Subscribe to new messages
  subscribeToMessages(conversationId, callback) {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },

  // Search messages
  async searchMessages(conversationId, searchText) {
    // Note: Full-text search requires a more advanced setup
    // This is a basic implementation that filters client-side
    const allMessages = await this.getMessages(conversationId, 500);
    return allMessages.filter(message => 
      message.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }
};
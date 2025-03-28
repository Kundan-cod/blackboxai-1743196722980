import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js';
import { firebaseConfig } from './auth.js';

// Initialize Firebase Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const StorageService = {
  async uploadFile(file, conversationId) {
    try {
      // Create storage reference
      const storageRef = ref(storage, `conversations/${conversationId}/${Date.now()}_${file.name}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        url: downloadURL
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async uploadFiles(files, conversationId) {
    return Promise.all(files.map(file => this.uploadFile(file, conversationId)));
  }
};
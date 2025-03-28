// Sample friends data (would normally come from backend)
const sampleFriends = [
  {
    id: 'friend1',
    name: 'Alex Johnson',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait1',
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: '10:30 AM',
    unread: 2
  },
  {
    id: 'friend2',
    name: 'Maria Garcia',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait2',
    lastMessage: 'Meeting at 3pm',
    lastMessageTime: 'Yesterday',
    unread: 0
  },
  {
    id: 'friend3',
    name: 'Sam Wilson',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait3',
    lastMessage: 'Check out this link!',
    lastMessageTime: 'Monday',
    unread: 1
  }
];

// Initialize friends list functionality
export function initFriendsList(chatManager) {
  const friendsListContainer = document.querySelector('.friends-list');
  
  // Render friends list
  function renderFriendsList(friends) {
    friendsListContainer.innerHTML = '';
    
    friends.forEach(friend => {
      const friendElement = document.createElement('div');
      friendElement.classList.add('friend-item');
      friendElement.dataset.friendId = friend.id;
      
      friendElement.innerHTML = `
        <img src="${friend.avatar}" alt="${friend.name}" class="friend-avatar">
        <div class="friend-info">
          <h3>${friend.name}</h3>
          <p>${friend.lastMessage}</p>
        </div>
        <div class="friend-meta">
          <span class="message-time">${friend.lastMessageTime}</span>
          ${friend.unread > 0 ? `<span class="unread-count">${friend.unread}</span>` : ''}
        </div>
      `;
      
      friendElement.addEventListener('click', () => {
        // Set active state
        document.querySelectorAll('.friend-item').forEach(item => {
          item.classList.remove('active');
        });
        friendElement.classList.add('active');
        
        // Join conversation
        chatManager.joinConversation(friend.id);
        
        // Update chat header
        document.querySelector('.chat-header .user-info h2').textContent = friend.name;
        document.querySelector('.chat-header .user-info .avatar').src = friend.avatar;
      });
      
      friendsListContainer.appendChild(friendElement);
    });
  }
  
  // Initialize with sample data
  renderFriendsList(sampleFriends);
  
  return {
    renderFriendsList
  };
}
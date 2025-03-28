export function initCallFunctionality(socket) {
  const callBtn = document.querySelector('.call-btn');
  const videoBtn = document.querySelector('.video-btn');
  let localStream;
  let peerConnection;

  // Initialize call functionality
  async function setupCall(isVideo) {
    try {
      // Get user media
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo
      });

      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      peerConnection = new RTCPeerConnection(configuration);

      // Add local stream to connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle ICE candidates
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            conversationId: currentConversation
          });
        }
      };

      // Handle remote stream
      peerConnection.ontrack = event => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.controls = true;
        document.querySelector('.messages').appendChild(remoteVideo);
      };

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('call-offer', {
        offer,
        conversationId: currentConversation,
        isVideo
      });

    } catch (error) {
      console.error('Call setup error:', error);
    }
  }

  // End call
  function endCall() {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
    socket.emit('end-call', { conversationId: currentConversation });
  }

  // Event listeners
  callBtn.addEventListener('click', () => {
    if (callBtn.classList.contains('active')) {
      endCall();
      callBtn.classList.remove('active');
    } else {
      setupCall(false);
      callBtn.classList.add('active');
    }
  });

  videoBtn.addEventListener('click', () => {
    if (videoBtn.classList.contains('active')) {
      endCall();
      videoBtn.classList.remove('active');
    } else {
      setupCall(true);
      videoBtn.classList.add('active');
    }
  });

  // Socket event listeners
  socket.on('call-offer', async ({ offer, isVideo }) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      socket.emit('call-answer', {
        answer,
        conversationId: currentConversation
      });
    } catch (error) {
      console.error('Error handling call offer:', error);
    }
  });

  socket.on('call-answer', async ({ answer }) => {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  });

  socket.on('ice-candidate', async ({ candidate }) => {
    try {
      if (candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  });

  socket.on('end-call', () => {
    endCall();
    callBtn.classList.remove('active');
    videoBtn.classList.remove('active');
  });
}
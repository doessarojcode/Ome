import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import LandingPage from './components/LandingPage';
import VideoPlayer from './components/VideoPlayer';
import Chat from './components/Chat';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, waiting, chat
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [userId, setUserId] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  // Initialize Peer and Socket
  useEffect(() => {
    // Generate unique user ID
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(newUserId);

    // Initialize PeerJS
    const peerInstance = new Peer(newUserId, {
      host: 'peerjs.com',
      secure: true,
      port: 443,
    });

    peerInstance.on('open', (id) => {
      console.log('✓ PeerJS connection established. ID:', id);
      setPeerId(id);
    });

    peerInstance.on('call', handleIncomingCall);
    peerInstance.on('error', (error) => {
      console.error('PeerJS error:', error);
    });

    setPeer(peerInstance);

    // Initialize Socket.io
    const socketInstance = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('✓ Connected to socket server');
    });

    socketInstance.on('waiting', (data) => {
      setWaitingMessage(data.message);
      setCurrentPage('waiting');
    });

    socketInstance.on('user_matched', (data) => {
      console.log('✓ User matched:', data);
      setRoomId(data.roomId);
      setRemoteUserId(data.matchedUserId);
      setRemotePeerId(data.peerId);
      setMessages([]);
      setCurrentPage('chat');
    });

    socketInstance.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketInstance.on('user_left', (data) => {
      console.log(data.message);
      alert(data.message);
      handleNextUser();
    });

    socketInstance.on('back_to_queue', (data) => {
      setWaitingMessage(data.message);
      setCurrentPage('waiting');
      setRemoteStream(null);
      setRemoteUserId(null);
    });

    socketInstance.on('report_submitted', (data) => {
      alert(data.message);
    });

    socketInstance.on('user_banned', (data) => {
      alert(data.message);
      setCurrentPage('landing');
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Setup local video stream
  const setupLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
      return null;
    }
  };

  // Handle incoming peer call
  const handleIncomingCall = (call) => {
    console.log('Incoming call from:', call.peer);
    if (localStream) {
      call.answer(localStream);
      call.on('stream', (stream) => {
        console.log('Received remote stream');
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
      setConnection(call);
      peerConnection.current = call;
    }
  };

  // Start video chat
  const handleStartVideo = async () => {
    const stream = await setupLocalVideo();
    if (stream && socket && userId && peerId) {
      socket.emit('join_queue', {
        userId,
        peerId,
      });
    }
  };

  // Make call to remote peer
  useEffect(() => {
    if (
      currentPage === 'chat' &&
      peer &&
      localStream &&
      remotePeerId &&
      !connection
    ) {
      console.log('Calling remote peer:', remotePeerId);
      const call = peer.call(remotePeerId, localStream);

      call.on('stream', (stream) => {
        console.log('Received remote stream');
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      call.on('error', (error) => {
        console.error('Call error:', error);
      });

      call.on('close', () => {
        console.log('Call closed');
        setRemoteStream(null);
      });

      setConnection(call);
      peerConnection.current = call;
    }
  }, [currentPage, peer, localStream, remotePeerId, connection]);

  // Send message
  const handleSendMessage = (message) => {
    if (socket && roomId && userId) {
      const messageData = {
        roomId,
        userId,
        message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, { ...messageData, sender: userId }]);
    }
  };

  // Move to next user
  const handleNextUser = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      setConnection(null);
      peerConnection.current = null;
    }

    setRemoteStream(null);
    setRemoteUserId(null);
    setMessages([]);

    if (socket && roomId && userId && peerId) {
      socket.emit('next_user', {
        roomId,
        userId,
        peerId,
      });
    }
  };

  // Report user
  const handleReportUser = (reason, details) => {
    if (socket && roomId && remoteUserId) {
      socket.emit('report_user', {
        reportedUserId: remoteUserId,
        roomId,
        reason,
        details,
      });
      setTimeout(() => {
        handleNextUser();
      }, 1000);
    }
  };

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage onStartVideo={handleStartVideo} />
      )}

      {currentPage === 'waiting' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-2xl font-semibold mb-2">{waitingMessage}</p>
            <p className="text-gray-400">You'll be connected soon...</p>
          </div>
        </div>
      )}

      {currentPage === 'chat' && (
        <VideoPlayer
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          localStream={localStream}
          remoteStream={remoteStream}
          remoteUserId={remoteUserId}
          onNextUser={handleNextUser}
          onReportUser={handleReportUser}
        >
          <Chat
            messages={messages}
            userId={userId}
            onSendMessage={handleSendMessage}
          />
        </VideoPlayer>
      )}
    </div>
  );
}

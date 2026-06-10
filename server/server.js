import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Waiting room queue to store users looking for a match
const waitingQueue = [];
const activeRooms = new Map(); // Store room information
const userConnections = new Map(); // Map userId to socket info
const reportedUsers = new Set(); // Track reported users

// Utility function to generate unique room IDs
function generateRoomId() {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Try to match two users from the waiting queue
function attemptMatch() {
  if (waitingQueue.length >= 2) {
    const user1 = waitingQueue.shift();
    const user2 = waitingQueue.shift();

    const roomId = generateRoomId();
    const roomData = {
      roomId,
      users: [user1.userId, user2.userId],
      createdAt: new Date(),
      messages: [],
    };

    activeRooms.set(roomId, roomData);

    // Notify both users they've been matched
    io.to(user1.socketId).emit('user_matched', {
      roomId,
      peerId: user2.peerId,
      matchedUserId: user2.userId,
      userCount: 2,
    });

    io.to(user2.socketId).emit('user_matched', {
      roomId,
      peerId: user1.peerId,
      matchedUserId: user1.userId,
      userCount: 2,
    });

    console.log(`✓ Matched users: ${user1.userId} <-> ${user2.userId} in room ${roomId}`);
  }
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`► User connected: ${socket.id}`);

  // User joins waiting queue
  socket.on('join_queue', (data) => {
    const { userId, peerId } = data;
    
    // Check if user was reported
    if (reportedUsers.has(userId)) {
      socket.emit('user_banned', {
        message: 'You have been flagged for safety violations. Please contact support.',
      });
      socket.disconnect();
      return;
    }

    const userEntry = { userId, socketId: socket.id, peerId };
    waitingQueue.push(userEntry);
    userConnections.set(userId, { socketId: socket.id, peerId });

    socket.emit('waiting', {
      message: 'Searching for someone to chat with...',
      queuePosition: waitingQueue.length,
    });

    console.log(`⏳ User ${userId} added to queue. Queue size: ${waitingQueue.length}`);

    // Try to match users
    attemptMatch();
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    const { roomId, userId, message, timestamp } = data;
    const room = activeRooms.get(roomId);

    if (room) {
      // Broadcast message to both users in the room
      io.to(roomId).emit('receive_message', {
        userId,
        message,
        timestamp,
        sender: userId,
      });

      // Store message in room history
      room.messages.push({ userId, message, timestamp });
    }
  });

  // Handle next button - disconnect and find new match
  socket.on('next_user', (data) => {
    const { roomId, userId } = data;
    const room = activeRooms.get(roomId);

    if (room) {
      // Notify the other user
      const otherUserId = room.users.find((id) => id !== userId);
      const otherUser = userConnections.get(otherUserId);

      if (otherUser) {
        io.to(otherUser.socketId).emit('user_left', {
          message: 'User disconnected and moved to next match',
        });
      }

      // Remove room
      activeRooms.delete(roomId);
    }

    // Remove user from connections temporarily to avoid duplicate matching
    userConnections.delete(userId);

    // Re-add to waiting queue after a small delay
    setTimeout(() => {
      if (!userConnections.has(userId)) {
        socket.emit('back_to_queue', {
          message: 'Searching for next user...',
        });

        const userEntry = {
          userId,
          socketId: socket.id,
          peerId: data.peerId,
        };
        waitingQueue.push(userEntry);
        userConnections.set(userId, { socketId: socket.id, peerId: data.peerId });

        attemptMatch();
      }
    }, 500);
  });

  // Handle report user
  socket.on('report_user', (data) => {
    const { reportedUserId, roomId, reason, details } = data;
    
    // Mark user as reported
    reportedUsers.add(reportedUserId);

    // Log report (in production, save to database)
    console.log(`🚩 User reported: ${reportedUserId}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Details: ${details}`);

    socket.emit('report_submitted', {
      message: 'Report submitted. Thank you for keeping our community safe.',
    });

    // Optionally disconnect reported user immediately
    setTimeout(() => {
      const reportedUserConnection = userConnections.get(reportedUserId);
      if (reportedUserConnection) {
        io.to(reportedUserConnection.socketId).emit('user_banned', {
          message: 'Your account has been flagged. Please contact support.',
        });
      }
    }, 500);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`◄ User disconnected: ${socket.id}`);

    // Remove user from waiting queue
    const queueIndex = waitingQueue.findIndex((u) => u.socketId === socket.id);
    if (queueIndex !== -1) {
      const removedUser = waitingQueue.splice(queueIndex, 1)[0];
      console.log(`  Removed ${removedUser.userId} from queue`);
    }

    // Handle active room disconnection
    for (const [roomId, room] of activeRooms.entries()) {
      const userIndex = room.users.findIndex((userId) => {
        const userConn = userConnections.get(userId);
        return userConn && userConn.socketId === socket.id;
      });

      if (userIndex !== -1) {
        const otherUserId = room.users.find((id) => {
          const userConn = userConnections.get(id);
          return userConn && userConn.socketId !== socket.id;
        });

        if (otherUserId) {
          const otherUser = userConnections.get(otherUserId);
          if (otherUser) {
            io.to(otherUser.socketId).emit('user_left', {
              message: 'User disconnected unexpectedly',
            });
          }
        }

        activeRooms.delete(roomId);
      }
    }

    // Clean up user connection
    for (const [userId, conn] of userConnections.entries()) {
      if (conn.socketId === socket.id) {
        userConnections.delete(userId);
      }
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    waitingUsers: waitingQueue.length,
    activeRooms: activeRooms.size,
  });
});

// Statistics endpoint
app.get('/stats', (req, res) => {
  res.json({
    waitingUsers: waitingQueue.length,
    activeRooms: activeRooms.size,
    totalConnections: userConnections.size,
    reportedUsers: reportedUsers.size,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

# OME Video Chat - Development Guide

## 🎯 Quick Start

### First Time Setup

```bash
# Make setup script executable (if on Unix/macOS/Linux)
chmod +x setup.sh

# Run setup
./setup.sh

# Or manually:
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Start Development

```bash
npm run dev
```

This will start both the backend and frontend concurrently using concurrently.

## 📁 Project Structure Explained

```
Ome/
├── server/
│   ├── server.js              # Main Socket.io & Express server
│   │                          # Handles:
│   │                          # - Matchmaking queue
│   │                          # - Socket.io signaling
│   │                          # - Chat message routing
│   │                          # - User reports
│   │
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   └── .env                   # Actual env config (created locally)
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   │   ├── Socket.io connection management
│   │   │   ├── PeerJS initialization
│   │   │   ├── Local stream setup
│   │   │   ├── Route between pages (landing/waiting/chat)
│   │   │   └── Message & event handling
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── LandingPage.jsx
│   │   │   │   └── Welcome screen with feature highlights
│   │   │   │       - Start Video button
│   │   │   │       - Safety disclaimer
│   │   │   │       - Feature cards
│   │   │   │
│   │   │   ├── VideoPlayer.jsx
│   │   │   │   ├── Local video (PiP in bottom-right)
│   │   │   │   ├── Remote video (main display)
│   │   │   │   ├── Control buttons
│   │   │   │   │   - Mute/Unmute
│   │   │   │   │   - Camera on/off
│   │   │   │   │   - Next user
│   │   │   │   │   - Report user
│   │   │   │   └── Report modal
│   │   │   │
│   │   │   └── Chat.jsx
│   │   │       ├── Message display
│   │   │       ├── Message input
│   │   │       └── Timestamp display
│   │   │
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles with Tailwind
│   │
│   ├── index.html             # HTML template
│   ├── package.json           # Client dependencies
│   ├── vite.config.js         # Vite build configuration
│   ├── tailwind.config.js     # Tailwind CSS setup
│   ├── postcss.config.js      # PostCSS plugins
│   ├── .env.example           # Environment template
│   └── .env                   # Actual env config
│
├── package.json               # Root package (for concurrent scripts)
├── .gitignore                 # Git ignore patterns
├── setup.sh                   # Automated setup script
└── README.md                  # Main documentation
```

## 🔄 Data Flow

### 1. User Join Queue
```
Frontend (User clicks "Start Video")
  ↓
setupLocalVideo() - Request media permissions
  ↓
socket.emit('join_queue', {userId, peerId})
  ↓
Backend - Add to waitingQueue
  ↓
attemptMatch() - Check if 2+ users waiting
  ↓
socket.emit('user_matched', {roomId, remotePeerId})
  ↓
Frontend - Display remote video placeholder
```

### 2. WebRTC Connection
```
Frontend (matched user)
  ↓
Call peer.call(remotePeerId, localStream)
  ↓
Remote Frontend - Receives incoming call
  ↓
Call answer(localStream)
  ↓
Both - Exchange WebRTC candidates
  ↓
stream event - Receive remote video
  ↓
Display in <video> element
```

### 3. Chat Message
```
Frontend - User types message
  ↓
socket.emit('send_message', {roomId, userId, message, timestamp})
  ↓
Backend - io.to(roomId).emit('receive_message')
  ↓
Both Frontends - Receive message
  ↓
Update messages state
  ↓
Display in chat component
```

## 🔧 Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment mode (development/production)

### Client (.env)
- `VITE_SOCKET_URL` - Backend socket URL (default: http://localhost:5000)

## 🎛️ Customization

### Change Port Numbers

**Server:**
Edit `server/.env`:
```
PORT=3000
```

**Client:**
Edit `client/vite.config.js`:
```javascript
server: {
  port: 3173,
  host: true,
}
```

### Change Colors/Branding

Edit `client/src/components/LandingPage.jsx`:
- Change `from-blue-600 to-blue-900` classes
- Update app name and description
- Modify feature icons

### Database Integration

To persist reports and statistics:

1. **Install MongoDB driver:**
```bash
cd server
npm install mongoose
```

2. **Create `server/models/Report.js`:**
```javascript
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportedUserId: String,
  reporterUserId: String,
  roomId: String,
  reason: String,
  details: String,
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

export default mongoose.model('Report', reportSchema);
```

3. **Connect in `server/server.js`:**
```javascript
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
```

## 🚨 Common Issues & Solutions

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000  # Find PID
kill -9 <PID>
```

### Permissions Denied (setup.sh)
```bash
chmod +x setup.sh
./setup.sh
```

### WebRTC Connection Fails
- Check browser console for errors
- Verify both clients have cameras
- Check firewall settings
- Try different network

### Socket.io Connection Fails
- Verify backend is running: `curl http://localhost:5000/health`
- Check `VITE_SOCKET_URL` in client/.env
- Check `CLIENT_URL` in server/.env
- Check browser console for CORS errors

## 📊 Debugging

### Enable Socket.io Debug Logging

In `client/src/App.jsx`:
```javascript
const socketInstance = io(SOCKET_SERVER_URL, {
  debug: true,  // Add this
  reconnection: true,
  // ...
});
```

### Check Queue State

Visit: `http://localhost:5000/stats`

### Browser DevTools

- **Console** - Socket and PeerJS logs
- **Network** - Socket.io messages
- **Application** - Local storage/cookies
- **Permissions** - Camera/microphone access

## 🔐 Security During Development

- ✅ Use HTTPS in production
- ✅ Validate all socket inputs
- ✅ Sanitize chat messages
- ✅ Rate limit socket events
- ✅ Use environment variables for secrets
- ✅ Keep dependencies updated

## 🚀 Performance Tips

1. **Lazy load components** - Use React.lazy() for large components
2. **Memoize callbacks** - Use useCallback for socket handlers
3. **Optimize re-renders** - Use React.memo for video components
4. **Compress media** - Adjust video constraints for bandwidth
5. **Monitor bundle size** - Use `npm run build` and check dist/

## 📝 Code Style

The project follows:
- **ESLint** configs (add if needed)
- **Prettier** formatting
- **Component naming** - PascalCase
- **Function naming** - camelCase
- **Constants** - UPPER_SNAKE_CASE

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create PR

---

**Happy coding! 🚀**

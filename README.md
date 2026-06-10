# 🎥 OME - Anonymous Video Chat Application

A real-time anonymous video chat application similar to Omegle, built with Node.js, Express, Socket.io, React, and PeerJS WebRTC.

## 📋 Features

- **Random Matchmaking**: Users are randomly matched with others in a queue
- **Real-time Video Chat**: P2P video streaming using WebRTC (PeerJS)
- **Text Chat**: Send messages during video calls
- **Anonymous**: No account required, completely anonymous
- **Safety Controls**: Mute audio, turn off camera, report users
- **Next Button**: Instantly disconnect and find a new match
- **Report System**: Report inappropriate behavior

## 🏗️ Project Structure

```
Ome/
├── server/
│   ├── server.js           # Main Express + Socket.io server
│   ├── package.json        # Server dependencies
│   └── .env.example        # Environment variables template
├── client/
│   ├── src/
│   │   ├── App.jsx         # Main React app with state management
│   │   ├── main.jsx        # React entry point
│   │   ├── index.css       # Global styles
│   │   └── components/
│   │       ├── LandingPage.jsx   # Welcome page
│   │       ├── VideoPlayer.jsx   # Video display & controls
│   │       └── Chat.jsx          # Text chat sidebar
│   ├── public/             # Static files
│   ├── index.html          # HTML template
│   ├── package.json        # Client dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── postcss.config.js   # PostCSS config
│   └── .env.example        # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Modern browser with WebRTC support
- Camera and microphone permissions

### Installation

#### 1. Clone and Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

#### 2. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

### Running the Application

#### Option 1: Using npm concurrently (Recommended)

Create a root `package.json` in the `Ome` folder:

```bash
cd /workspaces/Ome
npm init -y
npm install -D concurrently
```

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm start\" \"cd client && npm run dev\"",
    "start:server": "cd server && npm start",
    "start:client": "cd client && npm run dev"
  }
}
```

Then run:

```bash
npm run dev
```

#### Option 2: Run Separately (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### In GitHub Codespaces

1. Open the Codespaces terminal
2. Run: `npm install -D concurrently` (in root)
3. Run: `npm run dev`
4. When prompted about port forwarding, accept for both ports 5000 and 5173
5. Open the forwarded URL for the client (port 5173)

The backend will be available at `http://localhost:5000`
The frontend will be available at `http://localhost:5173`

### Docker Compose (Recommended for deployment)

If you want to run both services together with Docker Compose:

```bash
cd /workspaces/Ome
docker compose up --build -d
```

Then open:
- `http://localhost:5173` for the frontend
- `http://localhost:5000` for the backend API

To stop the app:

```bash
docker compose down
```

## 🔧 Configuration

### Backend (.env)
```
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_SOCKET_URL=http://localhost:5000
```

For production, update these URLs to your deployment URLs.

## 🎯 How It Works

### Matchmaking Flow

1. **User connects** → Joins waiting queue
2. **Two users in queue** → Backend matches them
3. **Room created** → Unique room ID generated
4. **Socket.io exchange** → PeerJS IDs shared between users
5. **WebRTC connection** → P2P video stream established
6. **Chat enabled** → Text messages can be sent

### Technical Flow

```
Client A                    Server                    Client B
   |                          |                          |
   └─ join_queue ─────────────→|                          |
   |                          |                          |
   |                          |←────── join_queue ───────┘
   |                          |
   |←─── user_matched ────────┤                          |
   |                          |──── user_matched ───────→|
   |                          |
   └──── PeerJS Call ──────────────────→ answer
   |                          |                          |
   └──── WebRTC Stream ◄─────────────── WebRTC Stream ──┘
   |                          |                          |
   └─ send_message ──────────→|──── receive_message ───→|
   |                          |                          |
   └─ next_user ─────────────→|                          |
```

## 🛡️ Safety Features

### Built-in Protections

1. **Report Button** - Report users for inappropriate behavior
2. **User Banning** - Reported users can be blocked
3. **Mute/Camera Controls** - Users can control their own streams
4. **Anonymous** - No personal information shared
5. **Disclaimer** - Age requirement (18+) on landing page

### Report System

When a user is reported:
- Report stored with timestamp and reason
- User is marked as flagged
- Subsequent connections are rejected for flagged users
- (In production: Save to database, review queue, moderation panel)

## 📦 Dependencies

### Backend
- **express** - Web framework
- **socket.io** - Real-time communication
- **cors** - Cross-origin requests
- **dotenv** - Environment configuration

### Frontend
- **react** - UI framework
- **react-dom** - React rendering
- **peerjs** - WebRTC abstraction
- **socket.io-client** - Socket communication
- **vite** - Build tool
- **tailwindcss** - Styling
- **autoprefixer** - CSS postprocessor

## 🔌 Socket.io Events

### Client → Server

- `join_queue` - Join waiting queue
- `send_message` - Send chat message
- `next_user` - Find next match
- `report_user` - Report inappropriate user

### Server → Client

- `waiting` - User added to queue
- `user_matched` - Match found with peer info
- `receive_message` - Chat message received
- `user_left` - Other user disconnected
- `back_to_queue` - Ready for next match
- `report_submitted` - Report confirmation
- `user_banned` - User flagged/banned

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions
- Try a different browser
- Restart the application

### No Match Found
- Ensure both users are in different browser windows/tabs
- Check server logs for errors
- Verify Socket.io connection is established

### Video Stream Not Loading
- Check WebRTC is supported in your browser
- Verify camera permissions granted
- Check browser console for errors
- Ensure PeerJS server is accessible

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Verify `CLIENT_URL` in server `.env` matches frontend URL
- Check frontend `.env` has correct `VITE_SOCKET_URL`

## 📊 API Endpoints

### Backend REST API

**GET /health**
- Returns server status and queue information
- Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00Z",
  "waitingUsers": 5,
  "activeRooms": 3
}
```

**GET /stats**
- Returns detailed statistics
- Response:
```json
{
  "waitingUsers": 5,
  "activeRooms": 3,
  "totalConnections": 11,
  "reportedUsers": 2
}
```

## 🚀 Deployment

### Environment Variables for Production

**Server (.env)**
```
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Client (.env)**
```
VITE_SOCKET_URL=https://your-backend-domain.com
```

### Recommended Deployment Options

- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages, Firebase Hosting
- **Database**: MongoDB (for storing reports, user stats)
- **Storage**: AWS S3 (for logs)

## 🔒 Security Considerations

For production deployment:

1. **HTTPS Only** - Use SSL/TLS certificates
2. **Rate Limiting** - Prevent abuse
3. **Message Validation** - Sanitize all inputs
4. **CORS Whitelist** - Only allow trusted origins
5. **Environment Variables** - Never commit secrets
6. **Logging** - Monitor for abuse patterns
7. **Database** - Store reports in persistent database
8. **Moderation Panel** - Review flagged users
9. **DDoS Protection** - Use Cloudflare or similar
10. **Terms of Service** - Clear community guidelines

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions:
- Open an GitHub issue
- Check existing documentation
- Review troubleshooting section

## ⚠️ Legal Notice

This application should include:
- Clear Terms of Service
- Privacy Policy
- Age verification (18+)
- Content moderation system
- DMCA take-down procedures
- Legal compliance (GDPR, etc.)

Users must agree to these terms before using the service.

---

**Built with ❤️ using React, Node.js, and WebRTC**
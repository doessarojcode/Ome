# ⚡ Quick Start (5 Minutes)

## Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- Git
- Camera and microphone
- Modern browser (Chrome, Firefox, Safari, Edge)

## Installation

### 1️⃣ Install Dependencies
```bash
cd /workspaces/Ome

# Option A: Automated setup
bash setup.sh

# Option B: Manual setup
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2️⃣ Configure Environment (Optional)
The default configuration works out of the box. Only change if needed:

```bash
# Backend config
cp server/.env.example server/.env

# Frontend config
cp client/.env.example client/.env
```

### 3️⃣ Start the Application

**Option A: Run Both Together (Recommended)**
```bash
npm run dev
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

## 4️⃣ Access the Application

Open your browser and go to: **http://localhost:5173**

**Backend API**: http://localhost:5000

---

## 🧪 Testing It Out

### Single User Testing
1. Open app in one browser tab
2. Click "Start Video"
3. Wait for connection (should show waiting screen)

### Two Users Testing
1. Open app in **two different browser windows** (or incognito windows)
2. Click "Start Video" in both
3. Within ~5 seconds, both should be matched
4. Video streams should appear
5. Type messages in the chat

### Try These Features
- ✅ **Mute**: Click speaker icon (should show as muted)
- ✅ **Camera off**: Click camera icon
- ✅ **Next User**: Click ⤳ Next button
- ✅ **Report User**: Click ⚠️ warning icon
- ✅ **Send Message**: Type and press Enter

---

## 🛠️ Using Interactive Menu

```bash
bash start.sh
```

This opens a menu with options to:
- Install dependencies
- Start development
- Start backend only
- Start frontend only
- Clean and reinstall
- View documentation

---

## 🚀 GitHub Codespaces Setup

1. **Open in Codespaces**: Click green `<> Code` button → Codespaces
2. **Run setup**:
   ```bash
   bash setup.sh
   ```
3. **Start app**:
   ```bash
   npm run dev
   ```
4. **Port forwarding**: Accept when prompted
5. **Open frontend**: Click the provided link

---

## 🐛 Troubleshooting

### Camera/Microphone Permission Denied
- Check browser settings
- Reload page and grant permissions
- Try a different browser

### "Cannot find module" Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### No Match Found
- Ensure you have 2+ clients
- Open in different browser windows (not tabs)
- Check server logs in terminal

### WebRTC Connection Failed
- Check WebRTC is supported: [test.webrtc.org](https://test.webrtc.org)
- Ensure camera/microphone working
- Check firewall settings

---

## 📋 What's Included

### Backend (`/server`)
- 🖥️ Express.js + Socket.io server
- 👥 Matchmaking queue system
- 💬 Real-time chat routing
- 🚨 Report & ban system
- 📊 Health & stats endpoints

### Frontend (`/client`)
- ⚛️ React with Vite
- 🎨 Tailwind CSS styling
- 📹 Local/remote video display
- 💬 Text chat interface
- 🎛️ Media controls (mute, camera)
- ⚠️ Report user modal

### Documentation
- 📖 README - Full guide
- 🏗️ ARCHITECTURE.md - Tech details
- 🚀 DEPLOYMENT.md - Hosting options
- 🧪 TESTING.md - QA procedures
- 📝 DEVELOPMENT.md - Development guide
- ⚖️ Legal docs (Terms, Privacy)

---

## 📊 How It Works

```
┌─────────────────┐         ┌─────────────────┐
│   Browser 1     │         │   Browser 2     │
│  "Start Video"  │         │  "Start Video"  │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────┬───────────────┬───┘
                 │               │
                 ↓               ↓
         ┌─────────────────────────────┐
         │     Socket.io Server        │
         │  (Port 5000)                │
         │  ┌─────────────────────┐    │
         │  │  Waiting Queue:     │    │
         │  │  [User1, User2]     │    │
         │  └─────────────────────┘    │
         │  "Match Found!"             │
         │  Send PeerJS IDs to both    │
         └─────────────────────────────┘
                 ↑               ↑
                 └────┬──────┬───┘
                      │      │
                 (WebRTC)    (Chat)
                      │      │
         ┌────────────┘      └──────────┐
         │                              │
         ↓                              ↓
    Video Stream                   Messages
```

---

## 🎯 Next Steps

After getting it running:

1. **Explore the code**
   - Look at `client/src/App.jsx` for state management
   - Check `server/server.js` for matchmaking logic
   - Review component files for UI

2. **Customize**
   - Change colors in `client/src/components/LandingPage.jsx`
   - Modify video settings in `client/src/App.jsx`
   - Adjust matchmaking speed in `server/server.js`

3. **Deploy**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md) for cloud hosting
   - Choose your platform (Heroku, Vercel, DigitalOcean, etc.)

4. **Enhance**
   - Add database for persistent reports
   - Implement moderation panel
   - Add analytics
   - Support mobile devices

---

## 📞 Need Help?

- 📖 Check [README.md](README.md)
- 🏗️ See [ARCHITECTURE.md](ARCHITECTURE.md)
- 🧪 Review [TESTING.md](TESTING.md)
- 🚀 Visit [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎉 You're All Set!

```
npm run dev

👇 Open browser

http://localhost:5173

✨ Start chatting!
```

---

**Happy video chatting! 🎥**

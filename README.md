
# Medai - The Future of News (MERN Stack)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install express mongoose dotenv cors bcryptjs jsonwebtoken`.
3. Create a `.env` file in `backend/` with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. Start the server: `node server.js`
5. Place your MP4 video files in `backend/uploads/` for streaming.

### 2. Frontend Setup
1. Use the provided Vite + React structure.
2. The `services/api.ts` file points to `http://localhost:5000/api`.
3. If the backend is running, the app will switch from mock data to real data automatically.

### 3. Backend Features
- **Authentication**: JWT Login/Signup.
- **Streaming**: Partial content (Range) requests for smooth video playback.
- **Search**: `/api/videos/search?q=query`
- **User Features**:
  - Watchlist: Add/Remove/Get personal watchlist.
  - History: Track video progress.
- **Social**:
  - Likes: Toggle likes on videos.
  - Comments: Read and write comments on videos.
- **Database**: MongoDB storage for User, Video, and Comment data.

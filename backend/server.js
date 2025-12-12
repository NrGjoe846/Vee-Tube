
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
// This allows uploaded videos and thumbnails to be accessed via http://localhost:5000/uploads/filename
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streamstar', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/studio', require('./routes/studio'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/community', require('./routes/community'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/series', require('./routes/series'));

// Video Streaming Endpoint (Range Requests)
app.get('/api/stream/:filename', (req, res) => {
    const fileName = req.params.filename;
    // Handle external URLs or local files
    if (fileName.startsWith('http')) {
        return res.redirect(fileName);
    }

    const filePath = path.join(__dirname, 'uploads', fileName);
    
    // Check if file exists, if not serve sample for demo purposes
    if (!fs.existsSync(filePath)) {
        return res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

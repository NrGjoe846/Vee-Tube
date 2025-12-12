
const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Video = require('../models/Video');
const { protect } = require('../middleware/auth');

// @route POST /api/playlists
// @desc Create a new playlist
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, isPublic } = req.body;
        const playlist = await Playlist.create({
            user: req.user._id,
            name,
            description,
            isPublic: isPublic || false
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/playlists
// @desc Get current user's playlists
router.get('/', protect, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user._id }).populate('videos');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/playlists/user/:userId
// @desc Get a specific user's PUBLIC playlists
router.get('/user/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ 
            user: req.params.userId,
            isPublic: true
        }).populate('videos');
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/playlists/:id
// @desc Get single playlist
router.get('/:id', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('videos');
        
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        
        // Check permissions: Owner or Public
        if (playlist.user.toString() !== req.user._id.toString() && !playlist.isPublic) {
            return res.status(403).json({ message: 'Private playlist' });
        }
        
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/playlists/:id/videos
// @desc Add video to playlist and update thumbnail if empty
router.post('/:id/videos', protect, async (req, res) => {
    try {
        const { videoId } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId);
            
            // Auto-set thumbnail from first video if missing
            if (!playlist.thumbnail) {
                const video = await Video.findById(videoId);
                if (video) playlist.thumbnail = video.thumbnailUrl;
            }

            await playlist.save();
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/playlists/:id/videos/:videoId
// @desc Remove video from playlist
router.delete('/:id/videos/:videoId', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        playlist.videos = playlist.videos.filter(vid => vid.toString() !== req.params.videoId);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/playlists/:id
// @desc Delete playlist
router.delete('/:id', protect, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await playlist.deleteOne();
        res.json({ message: 'Playlist removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

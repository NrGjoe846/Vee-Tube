
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// @route GET /api/studio/analytics
// @desc Get analytics for the logged-in creator
router.get('/analytics', protect, async (req, res) => {
    try {
        // Find videos uploaded by this user
        const videos = await Video.find({ creator: req.user._id });
        
        const totalVideos = videos.length;
        const totalViews = videos.reduce((acc, vid) => acc + (vid.views || 0), 0);
        const totalLikes = videos.reduce((acc, vid) => acc + (vid.likes.length || 0), 0);
        
        // Mock revenue calculation based on views (e.g., $0.05 per 1000 views)
        const estimatedRevenue = (totalViews / 1000) * 0.05;

        // Get top performing video
        const topVideo = videos.sort((a, b) => b.views - a.views)[0];

        res.json({
            overview: {
                totalVideos,
                totalViews,
                totalLikes,
                estimatedRevenue: estimatedRevenue.toFixed(2)
            },
            videos,
            topVideo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/studio/stream-key
// @desc Get or generate persistent Stream Key
router.get('/stream-key', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+streamKey'); // Select hidden field
        
        if (user.streamKey) {
            return res.json({ streamKey: user.streamKey, rtmpUrl: 'rtmp://live.streamstar.com/app' });
        }

        // Generate new key
        const newKey = `live_${req.user._id}_${crypto.randomBytes(4).toString('hex')}`;
        user.streamKey = newKey;
        await user.save();
        
        res.json({ streamKey: newKey, rtmpUrl: 'rtmp://live.streamstar.com/app' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/studio/stream-key/reset
// @desc Reset Stream Key
router.post('/stream-key/reset', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const newKey = `live_${req.user._id}_${crypto.randomBytes(4).toString('hex')}`;
        user.streamKey = newKey;
        await user.save();
        
        res.json({ streamKey: newKey, rtmpUrl: 'rtmp://live.streamstar.com/app' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/studio/video/:id/process
// @desc Simulate video processing status update (Draft -> Processing -> Published)
router.post('/video/:id/process', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        if (video.creator.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        // Simulate steps
        video.status = 'Processing';
        await video.save();

        // Simulate async completion after 5 seconds
        setTimeout(async () => {
            const v = await Video.findById(req.params.id);
            if (v) {
                v.status = 'Published';
                await v.save();
            }
        }, 5000);

        res.json({ message: 'Processing started', status: 'Processing' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

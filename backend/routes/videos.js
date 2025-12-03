
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { protect } = require('../middleware/auth');

// @route GET /api/videos
// @desc Get all videos organized by categories or plain list
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find({});
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/grouped
// @desc Get videos grouped by categories (Home page format)
router.get('/grouped', async (req, res) => {
    try {
        const videos = await Video.find({});
        
        // Group by category manually or use aggregation
        const categories = {};
        videos.forEach(video => {
            const cat = video.category || 'Latest';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(video);
        });

        const result = Object.keys(categories).map((key, index) => ({
            id: `cat-${index}`,
            title: key,
            movies: categories[key]
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/:id
// @desc Get single video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (video) res.json(video);
        else res.status(404).json({ message: 'Video not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

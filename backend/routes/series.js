
const express = require('express');
const router = express.Router();
const Series = require('../models/Series');
const Video = require('../models/Video');
const { protect, admin } = require('../middleware/auth');

// @route POST /api/series
// @desc Create a new series
router.post('/', protect, async (req, res) => {
    try {
        if (!req.user.isCreator && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, thumbnailUrl, coverUrl, genre, releaseYear, cast } = req.body;
        
        const series = await Series.create({
            title,
            description,
            thumbnailUrl,
            coverUrl,
            genre,
            releaseYear,
            cast,
            creator: req.user._id,
            seasons: []
        });

        res.status(201).json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/series
// @desc Get all series
router.get('/', async (req, res) => {
    try {
        const series = await Series.find({}).sort({ createdAt: -1 });
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/series/:id
// @desc Get single series with episodes populated
router.get('/:id', async (req, res) => {
    try {
        const series = await Series.findById(req.params.id)
            .populate({
                path: 'seasons.episodes.video',
                select: 'title description duration thumbnailUrl views'
            });
            
        if (!series) return res.status(404).json({ message: 'Series not found' });
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/series/:id/season
// @desc Add a season
router.post('/:id/season', protect, async (req, res) => {
    try {
        const { seasonNumber, title } = req.body;
        const series = await Series.findById(req.params.id);

        if (!series) return res.status(404).json({ message: 'Series not found' });
        if (series.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        series.seasons.push({ seasonNumber, title, episodes: [] });
        await series.save();
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/series/:id/season/:seasonNumber/episode
// @desc Add an episode to a season by linking a video ID
router.post('/:id/season/:seasonNumber/episode', protect, async (req, res) => {
    try {
        const { videoId, episodeNumber } = req.body;
        const series = await Series.findById(req.params.id);

        if (!series) return res.status(404).json({ message: 'Series not found' });
        
        const season = series.seasons.find(s => s.seasonNumber === parseInt(req.params.seasonNumber));
        if (!season) return res.status(404).json({ message: 'Season not found' });

        // Verify video exists
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        season.episodes.push({
            episodeNumber,
            video: videoId
        });

        // Sort episodes
        season.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

        await series.save();
        
        // Re-populate for response
        const updatedSeries = await Series.findById(req.params.id)
            .populate('seasons.episodes.video', 'title thumbnailUrl duration');
            
        res.json(updatedSeries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

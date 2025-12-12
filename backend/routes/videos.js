
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User'); // Import User for notifications
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

// @route GET /api/videos/suggest
// @desc Autocomplete suggestions for search
router.get('/suggest', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        // Find up to 10 videos matching title, return only title and id
        const videos = await Video.find(
            { title: { $regex: q, $options: 'i' }, status: 'Published' }
        )
        .select('title _id')
        .limit(10);

        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/search
// @desc Advanced Search with Filters
router.get('/search', async (req, res) => {
    try {
        const { q, genre, language, sort, year } = req.query;
        let query = {};

        // Text Search
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } }
            ];
        }

        // Filters
        if (genre) query.genre = genre;
        if (language) query.language = language;
        if (year) query.year = year;

        // Sorting
        let sortOption = {};
        if (sort === 'newest') sortOption = { createdAt: -1 };
        else if (sort === 'popular') sortOption = { views: -1 };
        else if (sort === 'oldest') sortOption = { createdAt: 1 };
        else sortOption = { createdAt: -1 }; // Default

        const videos = await Video.find(query).sort(sortOption);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/videos
// @desc Create a new video
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl, coverUrl, genre, duration, year, category, language, tags, isFeatured } = req.body;
        
        if (!req.user.isAdmin && !req.user.isCreator) {
            return res.status(403).json({ message: 'Not authorized to upload content' });
        }

        const video = new Video({
            title,
            description,
            videoUrl, 
            thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/600x400',
            coverUrl: coverUrl || 'https://via.placeholder.com/1920x1080',
            genre: genre || ['General'],
            tags: tags || [],
            language: language || 'English',
            duration: duration || '0m',
            year: year || new Date().getFullYear(),
            category: category || 'Latest',
            isOriginal: true,
            isFeatured: (req.user.isAdmin && isFeatured) || false,
            creator: req.user._id,
            status: 'Published' // Default to published for demo
        });

        const createdVideo = await video.save();

        // Notify Subscribers
        // We efficiently update all users who have this creator in their subscribedTo list
        await User.updateMany(
            { subscribedTo: req.user._id },
            {
                $push: {
                    notifications: {
                        message: `New Upload: ${req.user.name} just uploaded "${title}"`,
                        type: 'alert',
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(201).json(createdVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/videos/:id
// @desc Update video details
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, category, genre, tags, language, isFeatured, isTrending, status } = req.body;
        const video = await Video.findById(req.params.id);

        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (req.user.isAdmin || (video.creator && video.creator.toString() === req.user._id.toString())) {
            video.title = title || video.title;
            video.description = description || video.description;
            video.category = category || video.category;
            video.genre = genre || video.genre;
            video.tags = tags || video.tags;
            video.language = language || video.language;
            
            if (status) video.status = status;

            // Only admins can change Featured/Trending status
            if (req.user.isAdmin) {
                if (isFeatured !== undefined) video.isFeatured = isFeatured;
                if (isTrending !== undefined) video.isTrending = isTrending;
            }

            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
             res.status(403).json({ message: 'Not authorized to update this video' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/videos/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        
        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (req.user.isAdmin || (video.creator && video.creator.toString() === req.user._id.toString())) {
            await video.deleteOne();
            res.json({ message: 'Video removed' });
        } else {
            res.status(403).json({ message: 'Not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/grouped
router.get('/grouped', async (req, res) => {
    try {
        // Only show published videos
        const videos = await Video.find({ status: 'Published' });
        
        const categories = {};
        
        // Manual grouping logic for specific frontend rows
        categories['Trending Now'] = videos.filter(v => v.isTrending);
        categories['Featured'] = videos.filter(v => v.isFeatured);
        
        videos.forEach(video => {
            const cat = video.category || 'Latest';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(video);
        });

        const result = Object.keys(categories).map((key, index) => ({
            id: `cat-${index}`,
            title: key,
            movies: categories[key]
        })).filter(c => c.movies.length > 0);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find({ status: 'Published' });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/:id
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('creator', 'name avatar subscribers');
        if (video) res.json(video);
        else res.status(404).json({ message: 'Video not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/:id/related
// @desc Get related videos based on genre/tags
router.get('/:id/related', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Find videos with overlapping genres or tags, excluding self
        const related = await Video.find({
            _id: { $ne: video._id },
            status: 'Published',
            $or: [
                { genre: { $in: video.genre } },
                { category: video.category }
            ]
        }).limit(6);
        
        res.json(related);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/videos/:id/view
router.post('/:id/view', async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/videos/:id/like
router.post('/:id/like', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        const userId = req.user._id;

        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter(id => id.toString() !== userId.toString());
        }
        
        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter(id => id.toString() !== userId.toString());
        } else {
            video.likes.push(userId);
        }
        
        await video.save();
        res.json({ 
            likes: video.likes.length, 
            dislikes: video.dislikes.length, 
            isLiked: video.likes.includes(userId) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/videos/:id/comments
// @desc Get top-level comments
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 }); 
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/videos/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.create({
            user: req.user._id,
            video: req.params.id,
            text
        });
        const populated = await Comment.findById(comment._id).populate('user', 'name avatar');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

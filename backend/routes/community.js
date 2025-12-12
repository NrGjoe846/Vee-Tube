
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route POST /api/community
// @desc Create a community post (Text, Image, or Poll)
router.post('/', protect, async (req, res) => {
    try {
        const { text, imageUrl, type, pollOptions } = req.body;
        
        if (!req.user.isCreator && !req.user.isAdmin) {
             return res.status(403).json({ message: 'Only creators can post to community.' });
        }

        // Validate Poll
        let processedPollOptions = [];
        if (type === 'poll') {
            if (!pollOptions || pollOptions.length < 2) {
                return res.status(400).json({ message: 'Polls must have at least 2 options.' });
            }
            processedPollOptions = pollOptions.map(opt => ({ text: opt, votes: [] }));
        }

        const post = await Post.create({
            creator: req.user._id,
            text,
            imageUrl,
            type: type || 'text',
            pollOptions: processedPollOptions
        });

        const populatedPost = await Post.findById(post._id).populate('creator', 'name avatar');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/community/:id/vote
// @desc Vote on a poll
router.post('/:id/vote', protect, async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.type !== 'poll') return res.status(400).json({ message: 'This post is not a poll' });
        if (optionIndex < 0 || optionIndex >= post.pollOptions.length) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        const userId = req.user._id;

        // Remove existing vote from any option
        post.pollOptions.forEach(option => {
            option.votes = option.votes.filter(id => id.toString() !== userId.toString());
        });

        // Add new vote
        post.pollOptions[optionIndex].votes.push(userId);

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/community/feed
// @desc Get posts from subscribed channels
router.get('/feed', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = await Post.find({ creator: { $in: user.subscribedTo } })
            .populate('creator', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(20);
            
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/community/user/:id
// @desc Get posts by a specific user (Channel Page)
router.get('/user/:id', async (req, res) => {
    try {
        const posts = await Post.find({ creator: req.params.id })
            .populate('creator', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/community/:id/like
// @desc Like a post
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/community/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.creator.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

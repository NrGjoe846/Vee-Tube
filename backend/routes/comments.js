
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Video = require('../models/Video'); // For notification context
const User = require('../models/User'); // For notification context
const { protect } = require('../middleware/auth');

// Simple bad word filter mock
const BAD_WORDS = ['badword', 'spam', 'scam', 'hate'];

const checkProfanity = (text) => {
    return BAD_WORDS.some(word => text.toLowerCase().includes(word));
};

// @route PUT /api/comments/:id
// @desc Edit a comment
router.put('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newText = req.body.text;
        comment.text = newText || comment.text;
        
        if (newText && checkProfanity(newText)) {
            comment.isFlagged = true;
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/comments/:id
// @desc Delete a comment
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Allow owner or Admin to delete
        if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete this comment and any replies
        await Comment.deleteMany({ 
            $or: [
                { _id: req.params.id }, 
                { parentId: req.params.id }
            ] 
        });
        
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/comments/:id/like
// @desc Like/Unlike a comment
router.post('/:id/like', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const userId = req.user._id;
        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.likes.push(userId);
        }

        await comment.save();
        res.json(comment.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/comments/:id/reply
// @desc Reply to a comment
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const parentComment = await Comment.findById(req.params.id).populate('user');
        if (!parentComment) return res.status(404).json({ message: 'Parent comment not found' });

        const { text } = req.body;
        const isFlagged = checkProfanity(text);
        
        const reply = await Comment.create({
            user: req.user._id,
            video: parentComment.video,
            text,
            parentId: parentComment._id,
            isFlagged
        });

        // Notify original commenter
        if (parentComment.user._id.toString() !== req.user._id.toString()) {
             const recipient = await User.findById(parentComment.user._id);
             recipient.notifications.push({
                 message: `${req.user.name} replied to your comment: "${text.substring(0, 20)}..."`,
                 type: 'social'
             });
             await recipient.save();
        }

        const populatedReply = await Comment.findById(reply._id).populate('user', 'name avatar');
        res.status(201).json(populatedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/comments/post/:id
// @desc Add comment to a Community Post (distinct from video comments)
router.post('/post/:id', protect, async (req, res) => {
    try {
        const { text } = req.body;
        const isFlagged = checkProfanity(text);
        
        const comment = await Comment.create({
            user: req.user._id,
            post: req.params.id,
            text,
            isFlagged
        });
        
        const populated = await Comment.findById(comment._id).populate('user', 'name avatar');
        res.status(201).json(populated);
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
});

module.exports = router;

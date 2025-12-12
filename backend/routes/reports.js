
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

// @route POST /api/reports
// @desc Report a video or comment
router.post('/', protect, async (req, res) => {
    try {
        const { targetType, targetId, reason } = req.body;
        
        const report = await Report.create({
            user: req.user._id,
            targetType,
            targetId,
            reason
        });
        
        res.status(201).json({ message: 'Report submitted successfully', reportId: report._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/reports
// @desc Get all reports (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const reports = await Report.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/reports/:id
// @desc Resolve/Update report status (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
    const { status, action } = req.body; // action: 'delete_content', 'dismiss'
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.status = status || report.status;

        if (action === 'delete_content') {
            if (report.targetType === 'Video') {
                await Video.findByIdAndDelete(report.targetId);
            } else if (report.targetType === 'Comment') {
                await Comment.findByIdAndDelete(report.targetId);
            }
        }

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

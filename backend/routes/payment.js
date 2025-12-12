
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// @route POST /api/payment/checkout
// @desc Create a payment intent (Mock)
router.post('/checkout', protect, async (req, res) => {
    const { planId, amount } = req.body;
    // In a real app, this would call Stripe/Razorpay
    // returning a client_secret.
    res.json({
        message: "Payment initiated",
        transactionId: `txn_${crypto.randomBytes(8).toString('hex')}`,
        amount,
        currency: 'USD'
    });
});

// @route POST /api/payment/verify
// @desc Verify payment and upgrade user
router.post('/verify', protect, async (req, res) => {
    const { transactionId, planType, amount } = req.body;
    
    try {
        const user = await User.findById(req.user._id);
        
        // Record Transaction
        await Transaction.create({
            user: user._id,
            amount: amount || 9.99,
            planType: planType || 'Premium',
            status: 'Completed',
            transactionId,
            paymentMethod: 'Mock Card'
        });

        // Update User Plan
        user.isPremium = true;
        user.planType = planType || 'Premium';
        
        // Set expiry (e.g., 30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        user.planExpiry = expiryDate;

        user.notifications.push({
            message: `Your subscription to ${planType} was successful!`,
            type: 'system'
        });

        await user.save();
        res.json({ success: true, isPremium: true, planType: user.planType });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

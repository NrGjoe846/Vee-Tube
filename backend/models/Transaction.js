
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    planType: { type: String, enum: ['Basic', 'Premium', 'VIP'], required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    paymentMethod: { type: String, default: 'Credit Card' },
    transactionId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        productId: Number,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);

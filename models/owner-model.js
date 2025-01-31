const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    fullName : String,
    email: String,
    password: String,
    contact: Number,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product-model'
    }],
    profilePic: String,
    gstin: String,
});

module.exports = mongoose.model('owner', ownerSchema);
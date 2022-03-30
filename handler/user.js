const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({user_id: Number, wallet_address: String})

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
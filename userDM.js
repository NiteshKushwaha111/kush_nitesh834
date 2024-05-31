const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    profile: String,
    technology: String
})

module.exports = mongoose.model('user-datas', userSchema)
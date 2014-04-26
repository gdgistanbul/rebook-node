var mongoose = require('mongoose')

var User = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    google: {}
})

mongoose.model('User', User)
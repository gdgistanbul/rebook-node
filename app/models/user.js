var mongoose = require('mongoose')

var User = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    books: [{bookId: {type: String, ref: "Book"}, amount: Number, _id: false}],
    google: {}
})

mongoose.model('User', User)
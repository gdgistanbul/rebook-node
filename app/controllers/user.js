var mongoose = require('mongoose')
    , User = mongoose.model('User');

exports.signin = function (req, res) {
}

exports.authCallback = function (req, res, next) {
    res.redirect('/')
}

exports.logout = function (req, res) {
    req.logout()
    res.redirect('/')
}


exports.mybooks = function (req, res) {
    User.findById(req.user._id)
        .populate('books.bookId')
        .exec(function (err, user) {
            res.render("my-books", {
                "myBooks": user.books
            });
        })
}

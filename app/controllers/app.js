var mongoose = require('mongoose')
    , Book = mongoose.model('Book');

exports.notFound = function (req, res) {
    res.json({error: 'not found', url: req.originalUrl})
}

exports.index = function (req, res) {
    Book.find({imgName: {$ne: "INF"}})
        .limit(20)
        .exec( function( err, data ) {
            if ( err ) {
                console.log("Couldn't get recent books: " + err);
            }
            res.render('index', {
                "recentBooks": data
            });
        });
}

exports.dashboard = function (req, res) {
    res.render("dashboard", {});
}


exports.boughts = function (req, res) {
    res.render("boughts", {});
}
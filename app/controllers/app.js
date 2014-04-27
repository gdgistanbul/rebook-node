var mongoose = require('mongoose')
    , Book = mongoose.model('Book')
    , url = require('url')
    , Paypal = require('../core/paypal');

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

exports.paypalcallback = function (req, res) {
    var status = req.param.status;

    var page = req.query.page;
    var savedTree = (17*(page/100000)).toFixed(2).toString();
    var token = req.query.token;
    var payerID = req.query.PayerID;
    var user = req.query.u;
    var bookID = req.query.b;
    var paymentID = req.query.pID;

    /*Paypal.execPayment(payerID, pID, function() {

    });*/

    res.render("paypal-" + status, {
        status: status,
        page: page,
        savedTree: savedTree
    });
}
var mongoose = require('mongoose')
    , Book = mongoose.model('Book')
    , User = mongoose.model('User')
    , config = require('config')
    , Paypal = require('../core/paypal')
    , reg = new RegExp(/^\d+$/)

exports.search = function (req, res) {
    var q = req.query.q
    if (reg.test(q) && q.length == 13) {
        Book.findOne({isbn: q}).exec(function (err, result) {
            if (err) {
                res.status(400)
                res.json({error: err.message})
            }
            else {
                res.json(result)
            }
        })
    }
    else {
        Book.search({
                query: {
                    fuzzy_like_this: { like_text: q }
                },
                size: 1 }
            , {
                hydrate: true
            }
            , function (err, result) {
                if (err) {
                    res.status(400)
                    res.json({error: err.message})

                }
                else {
                    res.json(result)
                }
            })
    }
}

exports.categoryBooks = function (req, res) {

    var category = req.params.slug;
    var limit = req.params.limit;
    var q = {category: category}
    if (category === "undefined")
        q = {}
    Book.find(q).limit(limit).skip(0).exec(function (err, data) {
        res.json(data);
    })
}

exports.categories = function (req, res) {
    res.json({
        'aile': 'Aile',
        'akademik': 'Akademik',
        'bilgisayar': 'Bilgisayar',
        'bilim-ve-teknoloji': 'Bilim ve Teknoloji',
        'cocuk': 'Çocuk',
        'din-ve-mioloji': 'Din ve Mitoloji',
        'edebiyat': 'Edebiyat',
        'dunya-edebiyati': 'Dünya Edebiyatı',
        'turk-edebiyati': 'Türk Edebiyatı',
        'yabanci-dil-edebiyati': 'Yabancı Dil',
        'egitim': 'Eğitim',
        'eglence': 'Eğlence',
        'ekonomi': 'Ekonomi',
        'felsefe': 'Felsefe',
        'genel': 'Genel',
        'hobi': 'Hobi',
        'sosyoloji': 'Sosyoloji',
        'islam': 'İslam',
        'müzik': 'Müzik',
        'politika': 'Politika',
        'saglik': 'Sağlık',
        'referans': 'Referans',
        'sanat': 'Sanat',
        'siir': 'Şiir',
        'tarih': 'Tarih'
    })
}

exports.findOne = function (req, res) {
    Book.findOne({_id: req.params.id}).exec(function (err, result) {
        if (err) {
            res.status(400)
            res.json({error: err.message})
        }
        else {
            res.json(result)
        }
    })
}

exports.autocomplete = function (req, res) {
    var keyword = req.params.keyword;
    var regexKeyword = new RegExp(keyword);
    Book.find({title: regexKeyword})
        .limit(20)
        .exec(function (err, data) {
            if (err) {
                console.log("Couldn't get recent books: " + err);
                res.json({
                    "result": false,
                    "data": "Error occured on autocomplete"
                });
            } else {
                console.log(keyword);
                res.json(data);
            }
        });
}

exports.bookdetail = function (req, res) {
    var id = req.params.id;
    Book.findOne({_id: id}, function (err, data) {
        if (err) {
            res.json({"result": false,
                "data": false});
        } else {
            User.findOne({"books.bookId": id}, function(err, userData) {
                if (userData) {
                    var amount = userData.books.filter(function(e) {
                       return e.bookId == id;
                    })[0].amount;
                    Paypal.createPayment(userData.email, amount, data.title, config.paypal.cancel_url, config.paypal.return_url, function(err, result) {
                        console.log(err, result);
                        res.render('book-detail', {
                            "result": true,
                            "url": result,
                            "book": data
                        });
                    });
                } else {
                    res.render('book-detail', {
                        "result": true,
                        "url": null,
                        "book": data
                    });
                }
            });

        }
    })
}

exports.addprice = function (req, res) {
    var bookId = req.body.bookid;
    var userId = req.user._id || '535ca1325dc5a60b004c3f0f';
    var amount = req.body.amount;

    User.findOneAndUpdate({_id: userId, "books.bookId": {$ne: bookId}}, {$addToSet: {books: {bookId: bookId, amount: amount} }}, function (errBook, user) {
        console.log(user);
        if (errBook) {
            res.json({data: "Book not found", type: false});
        } else {
            res.json({data: "Book price saved", type: true});
        }
    });
}
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

exports.categoryBooksRender = function (req, res) {
    var category = req.params.name;
    var limit = req.params.limit || 50;
    var q = {category: category}
    if (category === "undefined")
        q = {}
    Book.find(q).limit(limit).skip(0).exec(function (err, data) {
        res.render('index', {
            "recentBooks": data
        });
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
    var id = req.params.id;
    Book.findOne({_id: id}, function (err, data) {
        if (err) {
            res.json({"result": false,
                "data": false});
        } else {
            User.findOne({"books.bookId": id}, function (err, userData) {
                data = data.toJSON()
                data.amount = -1
                if (userData) {
                    var amount = userData.books.filter(function (e) {
                        return e.bookId == id;
                    })[0].amount;
                    data.amount
                }
                res.json(data)
            });

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
            User.findOne({"books.bookId": id}, function (err, userData) {
                if (userData) {
                    var amount = userData.books.filter(function (e) {
                        return e.bookId == id;
                    })[0].amount;
                    Paypal.createPayment(userData.email, amount, data.title, config.paypal.cancel_url, config.paypal.return_url + "?page=" + data.page + "&u=" + userData._id + "&b=" + data._id, function(err, result) {
                        Book.find({category: data.category}).limit(5).exec(function(err, related) {
                            res.render('book-detail', {
                                "result": true,
                                "url": result,
                                "book": data,
                                "amount": amount,
                                "relatedBooks": related
                            });
                        })
                    });
                } else {
                    Book.find({category: data.category}).limit(5).exec(function(err, related) {
                        res.render('book-detail', {
                            "result": true,
                            "url": null,
                            "book": data,
                            "relatedBooks": related
                        });
                    });
                }
            });

        }
    })
}

exports.addprice = function (req, res) {
    var bookId = req.body.bookid;
    var userId = req.user ? req.user._id : '535ca1325dc5a60b004c3f0f';
    var amount = req.body.amount;
    User.findOneAndUpdate({_id: userId, "books.bookId": {$ne: bookId}}, {$addToSet: {books: {bookId: bookId, amount: amount} }}, function (errBook, user) {
        if (!errBook && user) {
            res.json({data: "Book price saved", type: true});
        } else {
            res.json({data: "Book not found", type: false});
        }
    });
}
var mongoose = require('mongoose')
    , Book = mongoose.model('Book')
    , reg = new RegExp(/^\d+$/)

exports.search = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    var q = req.query.q
    if (reg.test(q) && q.length == 13) {
        Book.findOne({isbn: q}).exec(function (err, result) {
            if (err) {
                res.status(400)
                res.json({error: err})
            }
            else {
                res.json(result)
            }
        })
    }
    else {
        Book.search({query: q}, {hydrate: true}, function (err, results) {
            if (err) {
                res.status(400)
                res.json({error: err})
            }
            else {
                res.json(result)
            }
        })
    }
}

exports.categories = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.json([
        {'aile': 'Aile'},
        {'akademik': 'Akademik'},
        {'bilgisayar': 'Bilgisayar'},
        {'bilim-ve-teknoloji': 'Bilim ve Teknoloji'},
        {'cocuk': 'Çocuk'},
        {'din-ve-mioloji': 'Din ve Mitoloji'},
        {'edebiyat': 'Edebiyat'},
        {'dunya-edebiyati': 'Dünya Edebiyatı'},
        {'turk-edebiyati': 'Türk Edebiyatı'},
        {'yabanci-dil-edebiyati': 'Yabancı Dil'},
        {'egitim': 'Eğitim'},
        {'eglence': 'Eğlence'},
        {'ekonomi': 'Ekonomi'},
        {'felsefe': 'Felsefe'},
        {'genel': 'Genel'},
        {'hobi': 'Hobi'},
        {'sosyoloji': 'Sosyoloji'},
        {'islam': 'İslam'},
        {'müzik': 'Müzik'},
        {'politika': 'Politika'},
        {'saglik': 'Sağlık'},
        {'referans': 'Referans'},
        {'sanat': 'Sanat'},
        {'siir': 'Şiir'},
        {'tarih': 'Tarih'}
    ])
}
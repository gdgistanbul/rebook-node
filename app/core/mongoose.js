var mongoose = require('mongoose')
    , config = require('config')
    , fs = require('fs')
    , models_path = process.cwd() + '/app/models'

mongoose.connect(config.mongodb.url)
var db = mongoose.connection

db.on('error', function (err) {
    console.error('connection error:', err);
})
db.once('open', function callback() {
    console.info('db connection is established');
})

fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js'))
        require(models_path + '/' + file)
})

var Book = mongoose.model('Book')
Book.find().exec(function (err, docs) {
    docs.forEach(function (doc) {
        doc.index()
    })
})
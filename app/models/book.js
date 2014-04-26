var mongoose = require('mongoose')
    , mongoosastic = require('mongoosastic')

var Book = new mongoose.Schema({
    isbn: String,
    title: {type: String, es_indexed: true},
    slug: String,
    description: String,
    publishingDate: String,
    page: String,
    size: String,
    publisher: String,
    author: String,
    imgName: String,
    category: String,
    providers: {
        price: String,
        url: String,
        name: String,
        providerName: String
    }
})

Book.options.toJSON = {
    transform: function (doc, ret, options) {
        'providers'.split(' ')
            .forEach(function (e) {
                delete ret[e]
            })

        ret.description = ret.description.replace(/\r/g, '').replace(/\t/g, '').replace(/\n/g, '');
        return ret;
    }
}

Book.plugin(mongoosastic, {
    index: 'themesearch',
    type: 'books',
    host: 'api.searchbox.io',
    port: '80',
    auth: '780ff67c7d6a2565093817d1aa774000',
    protocol: 'http'
})


mongoose.model('Book', Book, 'books')
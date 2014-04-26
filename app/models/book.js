var mongoose = require('mongoose')

var Book = new mongoose.Schema({
    isbn: String,
    title: String,
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


mongoose.model('Book', Book, 'books')
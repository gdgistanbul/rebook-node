var express = require('express')
    , config = require('config')
    , fs = require('fs')

module.exports = function (app) {

    var controllers = {}
        , controllers_path = process.cwd() + '/app/controllers'
    fs.readdirSync(controllers_path).forEach(function (file) {
        if (file.indexOf('.js') != -1) {
            controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
        }
    })

    var router = express.Router()

    router.route(config.appVerUrl + '/books/search')
        .get(controllers.book.search)

    router.route(config.appVerUrl + '/books/categories')
        .get(controllers.book.categories)

    router.route('*').all(controllers.app.notFound)

    app.use(router)
}
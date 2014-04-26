var express = require('express')
    , config = require('config')
    , fs = require('fs')
    , passport = require('passport')

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

    router.route('/')
        .get(controllers.app.index)

    router.route(config.appVerUrl + '/books/categories')
        .get(controllers.book.categories)

    router.route(config.appVerUrl + '/books/autocomplete/:keyword')
        .get(controllers.book.autocomplete)

    router.route(config.appVerUrl + '/books/category/:slug/:limit')
        .get(controllers.book.categoryBooks)

    router.route(config.appVerUrl + '/books/:id')
        .get(controllers.book.findOne)

    router.route('/bookdetail/:id')
        .get(controllers.book.bookdetail)

    router.route(config.appVerUrl + '/logout')
        .get(controllers.user.logout)

    router.route('/auth/google')
        .get(passport.authenticate('google', { failureRedirect: '/', scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ] }), controllers.user.signin)


    router.route('/auth/google/callback')
        .get(passport.authenticate('google', { failureRedirect: '/'}), controllers.user.authCallback)

    router.route('*').all(controllers.app.notFound)

    app.use(router)
}
var express = require('express')
    , config = require('config')
    , expressSession = require('express-session')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , MongoStore = require('connect-mongo')(express);

module.exports = function (app) {
    app.use(express.static(process.cwd() + '/public'))
    app.use(expressSession({
        secret: 'myHighSecurePassword',
        store: new MongoStore({
            url: config.mongodb.url,
            collection: 'sessions'
        })
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(bodyParser())
    app.set('view engine', 'jade')
    app.set('views', process.cwd() + '/app/views')
    require('./express/router')(app)
}
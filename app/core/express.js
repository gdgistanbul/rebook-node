var express = require('express')
    , config = require('config')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , redis = require('redis')
    , sessionStore = require('connect-redis')(session);

module.exports = function (app) {
    app.use(express.static(process.cwd() + '/public'))
    app.use(cookieParser())
    app.use(session({
        secret: 'myHighSecurePassword',
        store: new sessionStore({url:config.redis.url})
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(bodyParser())
    app.set('view engine', 'jade')
    app.set('views', process.cwd() + '/app/views')
    require('./express/router')(app)
}
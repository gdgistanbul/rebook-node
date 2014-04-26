var express = require('express')

module.exports = function (app) {
    app.use(express.static(process.cwd() + '/public'))
    //app.use(passport.initialize())
    //app.use(bodyParser())
    require('./express/router')(app)
}
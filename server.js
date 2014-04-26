var app = require('express')(),
    config = require('config')

require('./app/core/mongoose')
require('./app/core/passport')()
require('./app/core/express')(app)

app.listen(config.port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('app is ready at : ' + config.port)
})

if (config.status == 'prod')
    process.on('uncaughtException', function (err) {
        console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
    })
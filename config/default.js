module.exports = exports = {
    mongodb: {
        url: process.env.MONGO_URL
    },
    port: process.env.PORT || 1337,
    appVerUrl: '/1',
    redis: {
        url: process.env.REDIS_URL
    },
    google: {
        clientID: '405685396395-h8oa3q3pcjk6v5dkfj0a2k73g3528g8g.apps.googleusercontent.com',
        clientSecret: 'tgUPCfijpn4Uncig7ROp-Wye',
        callbackURL: 'http://localhost:1337/auth/google/callback'
    },
    paypal: {
        client_id: 'AQkquBDf1zctJOWGKWUEtKXm6qVhueUEMvXO_-MCI4DQQ4-LWvkDLIN2fGsd',
        client_secret: 'EL1tVxAjhT7cJimnz5-Nsx9k2reTKSVfErNQF-CmrwJgxRtylkGTKlU4RvrX',
        cancel_url: "http://rebook-node.herokuapp.com/?cancel",
        return_url: "http://rebook-node.herokuapp.com/?success"
    }
}
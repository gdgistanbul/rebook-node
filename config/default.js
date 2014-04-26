module.exports = exports = {
    mongodb: {
        url: process.env.MONGO_URL
    },
    port: process.env.PORT || 1337,
    appVerUrl: '/1',
    redis:{
        url:process.env.REDIS_URL
    }
}
exports.notFound = function (req, res) {
    res.json({error: 'not found', url: req.originalUrl})
}
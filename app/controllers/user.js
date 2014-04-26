exports.signin = function (req, res) {
}

exports.authCallback = function (req, res, next) {
    res.redirect('/')
}

exports.logout = function (req, res) {
    req.logout()
    res.redirect('/')
}

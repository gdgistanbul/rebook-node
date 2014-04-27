var request = require('request')
    , config = require('config')
    , _ = require('underscore')
    , anglicize = require('anglicize')
    , options = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': ''
        }
    }

function PayPal() {
    this.init = function () {
        var authParams = {
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + new Buffer(config.paypal.client_id + ':' + config.paypal.client_secret).toString('base64')
            },
            method : 'POST',
            body: 'grant_type=client_credentials'
        }
        request(authParams, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                body = JSON.parse(body)
                options.headers.Authorization = body.token_type + ' ' + body.access_token
                console.log('Paypal is Ready')
            }
            else
                console.log('Paypal Fail')
        })
    }
}

PayPal.prototype.createPayment = function (email, amount, desc, cancelUrl, returnUrl, cb) {
    var data = {
        "transactions": [
            {
                "amount": {
                    "currency": "USD",
                    "total": amount
                },
                "description": anglicize(desc)
            }
        ],
        "payer": {
            "payment_method": "paypal"
        },
        "intent": "sale",
        "subject": email,
        "redirect_urls": {
            "cancel_url": cancelUrl,
            "return_url": returnUrl
        }
    }

    request(_.extend({
        method: 'POST',
        url: 'https://api.sandbox.paypal.com/v1/payments/payment',
        body: JSON.stringify(data)
    }, options), function (err, response, body) {
        if (!err && response.statusCode == 200) {
            try {
                body = JSON.parse(body)
            }
            catch (a) {
                return cb(new Error('parsing error'))
            }
            var url = body.links.filter(function (e) {
                return e.rel == 'approval_url'
            })[0].href
            cb(null, url)
        } else {
            cb(new Error('parsing error'))
        }
    })
}


PayPal.prototype.execPayment = function (payer_id, payment_id, cb) {
    request(_.extend({
        method: 'POST',
        url: 'https://api.sandbox.paypal.com/v1/payments/payment/' + payment_id + '/execute',
        body: JSON.stringify({payer_id: payer_id})
    }, options), function (err, response, body) {
        if (!err && response.statusCode == 200) {
            try {
                body = JSON.parse(body)
            }
            catch (a) {
                return cb(new Error('parsing error'))
            }
            cb(null, body.state)
        } else {
            cb(new Error('parsing error'))
        }
    })
}

module.exports = exports = new PayPal
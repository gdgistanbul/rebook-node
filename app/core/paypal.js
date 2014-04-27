var request = require('request')
    , _ = require('underscore')
    , options = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': ''
        }
    }

function PayPal() {
    this.init = function () {
        request({
            url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Basic ' + 'AQkquBDf1zctJOWGKWUEtKXm6qVhueUEMvXO_-MCI4DQQ4-LWvkDLIN2fGsd:EL1tVxAjhT7cJimnz5-Nsx9k2reTKSVfErNQF-CmrwJgxRtylkGTKlU4RvrX'.toString('base64')
            },
            body: JSON.stringify({grant_type: 'client_credentials'})
        }, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                body = JSON.parse(body)
                options.headers.Authorization = body.token_type + ' ' + body.access_token
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
                "description": desc
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
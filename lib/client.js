'use strict'

const request = require('request')

const DEV_HOST = 'https://dev.nicepay.co.id'
const PRD_HOST = 'https://api.nicepay.co.id'

const ENDPOINT = {
  REGISTRATION: '/nicepay/direct/v2/registration',
  REGISTER_TRANSACTION: '/nicepay/api/orderRegist.do',
  REQUEST_VIRTUAL_ACCOUNT: '/nicepay/api/onePass.do',
  REQUEST_CONVENIENCE_STORE: '/nicepay/api/onePass.do',
  CHECK_TRANSACTION_STATUS: '/nicepay/api/onePassStatus.do',
  PAYMENT: '/nicepay/direct/v2/payment',
  CANCEL: '/nicepay/direct/v2/cancel',
  CONFIRM_AKULAKU: '/nicepay/api/direct/v2/confirmAkulaku'
}

const PARAM_MAP = {
  'merchantId': 'iMid',
  'merchantToken': 'merchantToken',
  'paymentMethod': 'payMethod',
  'bankCode': 'bankCd',
  'mitraCode': 'mitraCd',
  'currency': 'currency',
  'amount': 'amt',
  'installmentType': 'instmntType',
  'installmentMonth': 'instmntMon',
  'recurrOption': 'recurrOpt',
  'referenceNo': 'referenceNo',
  'productName': 'goodsNm',
  'description': 'description',
  'callbackUrl': 'callBackUrl',
  'notifyUrl': 'dbProcessUrl',
  'billing.name': 'billingNm',
  'billing.phone': 'billingPhone',
  'billing.email': 'billingEmail',
  'billing.address': 'billingAddr',
  'billing.city': 'billingCity',
  'billing.state': 'billingState',
  'billing.postcode': 'billingPostCd',
  'billing.country': 'billingCountry',
  'delivery.name': 'deliveryNm',
  'delivery.phone': 'deliveryPhone',
  'delivery.email': 'deliveryEmail',
  'delivery.address': 'deliveryAddr',
  'delivery.city': 'deliveryCity',
  'delivery.state': 'deliveryState',
  'delivery.postcode': 'deliveryPostCd',
  'delivery.country': 'deliveryCountry',
  'user.ip': 'userIP',
  'user.sessionId': 'userSessionID',
  'user.agent': 'userAgent',
  'user.language': 'userLanguage',
  'taxFreeAmount': 'notaxAmt'
}

function populate (data) {
  var param = {}
  for (var key in data) {
    if (typeof data[key] === 'object') {
      for (var k in data[key]) {
        if (PARAM_MAP[[key, k].join('.')]) {
          param[PARAM_MAP[[key, k].join('.')]] = data[key][k]
        }
      }
    } else if (PARAM_MAP[key]) {
      param[PARAM_MAP[key]] = data[key]
    } else {
      param[key] = data[key]
    }
  }

  return param
}

function parseResult (body) {
  try {
    return body ? JSON.parse(body) : null
  } catch (err) {
    if (err instanceof SyntaxError) {
      return parseResult(body.substr(4))
    }
    return null
  }
}

function Client (devmode) {
  this.host = devmode ? DEV_HOST : PRD_HOST
}

Client.ENDPOINT = ENDPOINT

Client.prototype.request = function (param, cb) {
  var data = populate(param.data)
  var opts = {
    url: this.host + param.endpoint,
    method: 'POST'
  }
  if (param.json) {
    opts.json = true
    opts.body = data
  } else {
    opts.form = data
  }
  return request(opts, function (err, resp, body) {
    if (err) {
      return cb(err)
    }

    var result = param.json ? body : parseResult(body)
    if (result.resultCd !== '0000') {
      return cb({ code: result.resultCd, message: result.resultMsg })
    } else {
      if (typeof result.amount === 'undefined') {
        result.amount = result.amt
      }
      return cb(null, {
        code: result.resultCd,
        message: result.resultMsg,
        data: result
      })
    }
  })
}

module.exports = Client

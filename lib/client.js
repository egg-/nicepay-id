'use strict'

const request = require('request')

const DEV_ENDPOINT = 'https://dev.nicepay.co.id'
const PRD_ENDPOINT = 'https://api.nicepay.co.id'

const URL = {
  REGISTER_TRANSACTION: '/nicepay/api/orderRegist.do'
}

const PARAM_MAP = {
  'merchantId': 'iMid',
  'merchantToken': 'merchantToken',
  'paymentMethod': 'payMethod',
  'currency': 'currency',
  'amount': 'amt',
  'installmentType': 'instmntType',
  'installmentMonth': 'instmntMon',
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
  'user.ip': 'userIP',
  'user.sessionId': 'userSessionID',
  'user.agent': 'userAgent',
  'user.language': 'userLanguage',
  'taxFreeAmount': 'notaxAmt',
  'requestDate': 'reqDt',
  'requestTm': 'reqTm'
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
  console.log(param)

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
  this.endpoint = devmode ? DEV_ENDPOINT : PRD_ENDPOINT
}

Client.prototype.registerTransaction = function (param, cb) {
  return request({
    url: this.endpoint + URL.REGISTER_TRANSACTION,
    method: 'POST',
    form: populate(param.data)
  }, function (err, resp, body) {
    if (err) {
      return cb(err)
    }

    var result = parseResult(body)
    if (result.data.resultCd !== '0000') {
      return cb({
        code: result.data.resultCd,
        message: result.data.resultMsg
      })
    } else {
      return cb(null, {
        txid: result.data.tXid,
        requestUrl: result.data.requestUrl,
        code: result.data.resultCd,
        message: result.data.resultMsg
      })
    }
  })
}

module.exports = Client

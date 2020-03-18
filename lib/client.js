'use strict'

const request = require('request')

const DEV_HOST = 'https://dev.nicepay.co.id'
const PRD_HOST = 'https://api.nicepay.co.id'

const ENDPOINT = {
  REGISTER_TRANSACTION: '/nicepay/api/orderRegist.do',
  REQUEST_VIRTUAL_ACCOUNT: '/nicepay/api/onePass.do',
  CHECK_TRANSACTION_STATUS: '/nicepay/api/onePassStatus.do',
  CANCEL_TRANSACTION: '/nicepay/api/onePassAllCancel.do'
}

const PARAM_MAP = {
  'merchantId': 'iMid',
  'merchantToken': 'merchantToken',
  'paymentMethod': 'payMethod',
  'bankCode': 'bankCd',
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
  return request({
    url: this.host + param.endpoint,
    method: 'POST',
    form: populate(param.data)
  }, function (err, resp, body) {
    if (err) {
      return cb(err)
    }

    var result = parseResult(body)
    if (result.resultCd !== '0000') {
      return cb({ code: result.resultCd, message: result.resultMsg })
    } else {
      return cb(null, {
        code: result.resultCd,
        message: result.resultMsg,
        data: result
      })
    }
  })
}

module.exports = Client

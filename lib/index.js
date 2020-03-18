'use strict'

const sha256 = require('sha256')

const Billing = require('./billing')
const Delivery = require('./delivery')
const Client = require('./client')
const User = require('./user')

/**
 * Constraint
 */
const CONST = {
  PAYMENT_METHOD: {
    CREDIT_CARD: '01',
    VIRTUAL_ACCOUNT: '02',
    CONVENIENCE_STORE: '03',
    CLICK_PAY: '04',
    E_WALLET: '05'
  },
  INSTALLMENT_TYPE: {
    CUSTOMER: 1,
    MERCHANT: 2
  },
  RECURRING_OPT: {
    AUTO: 0, // automatic cancel
    MANUAL: 1, // don't cancel
    NO_TOKEN: 2 // don't make token
  },
  BANK_NAME: {
    BMRI: 'Mandiri',
    IBBK: 'Maybank',
    BBBA: 'Permata',
    CENA: 'BCA',
    BNIN: 'BNI',
    HNBN: 'KEBHanaBank',
    BRIN: 'BRI',
    BNIA: 'CIMBNIAGA',
    BDIN: 'DANAMON'
  },
  CANCEL_TYPE: {
    FULL: 1,
    PARTIAL: 2
  }
}

/**
 * nicepay constructor
 * @param {string} opts
 * @param {string} opts.merchantId
 * @param {string} opts.merchantKey
 * @param {boolean} [opts.dev] set true for development env
 */
function Nicepay (opts) {
  this.checkRequired(opts, ['merchantId', 'merchantKey'])

  this.merchantId = opts.merchantId
  this.merchantKey = opts.merchantKey

  this.client = new Client(opts.dev)

  this.createToken = function (referenceNo, amount) {
    return sha256([opts.merchantId, referenceNo, amount, opts.merchantKey].join(''))
  }
}

Nicepay.prototype.checkRequired = function (data, names) {
  for (var i = 0; i < names.length; i++) {
    if (names[i].indexOf('.') !== -1) {
      var keys = names[i].split('.')
      if (typeof data[keys[0]][keys[1]] === 'undefined') {
        throw Error(names[i] + ' is required.')
      }
    } else if (typeof data[names[i]] === 'undefined') {
      throw Error(names[i] + ' is required.')
    }
  }

  return true
}

/**
 * register credit card transaction
 * @param  {object} param
 * @param {string} param.currency
 * @param {string} param.amount
 * @param {number} [param.installmentType] Nicepay.INSTALLMENT_TYPE
 * @param {number} [param.installmentMonth]
 * @param {string} param.referenceNo merchant order number
 * @param {string} param.productName product name
 * @param {Billing} param.billing
 * @param {string} param.billing.name
 * @param {string} param.billing.phone
 * @param {string} param.billing.email
 * @param {string} [param.billing.address]
 * @param {string} param.billing.city
 * @param {string} param.billing.state
 * @param {string} param.billing.postcode
 * @param {string} param.billing.country
 * @param {User} param.user
 * @param {string} param.user.ip
 * @param {string} [param.user.sessionId]
 * @param {string} [param.user.agent]
 * @param {string} [param.user.language]
 * @param {Cart} [param.cart]
 * @param {Delivery} [param.delivery]
 * @param {string} [param.delivery.name]
 * @param {string} [param.delivery.phone]
 * @param {string} [param.delivery.address]
 * @param {string} [param.delivery.email]
 * @param {string} [param.delivery.city]
 * @param {string} [param.delivery.state]
 * @param {string} [param.delivery.postcode]
 * @param {string} [param.delivery.country]
 * @param {string} param.callbackUrl payment result forward url
 * @param {string} param.notifyUrl payment notification url
 * @param {string} param.description trasaction description
 * @param {number} [param.recurringOption] recurring option code Nicepay.RECURRING_OPT
 * @param {number} [param.vat] vat amount
 * @param {number} [param.fee] service fee
 * @param {number} [param.taxFreeAmount] Tax free amount
 * @param {string} [param.requestDomain] request domain
 * @param {string} [param.requestSeverIp] request server ip
 * @param {string} [param.requestClientVersion] request client version
 */
Nicepay.prototype.registerCreditCardTransaction = function (param, cb) {
  this.checkRequired(param, [
    'currency', 'amount', 'referenceNo', 'productName', 'description',
    'billing.name', 'billing.phone', 'billing.email', 'billing.city', 'billing.state', 'billing.country', 'billing.postcode',
    // 'user',
    'callbackUrl', 'notifyUrl'
  ])

  param.merchantId = this.merchantId
  param.merchantToken = this.createToken(param.referenceNo, param.amount)
  param.paymentMethod = CONST.PAYMENT_METHOD.CREDIT_CARD

  param.installmentType = param.installmentType || CONST.INSTALLMENT_TYPE.CUSTOMER
  param.installmentMonth = param.installmentMonth || 1

  this.client.request({
    endpoint: Client.ENDPOINT.REGISTER_TRANSACTION,
    data: param
  }, function (err, result) {
    cb(err, result)
  })
}

Nicepay.prototype.registerVirtualAccountTransaction = function (param, cb) {
  this.checkRequired(param, [
    'currency', 'amount', 'referenceNo', 'productName', 'description', 'bankCode',
    'billing.name', 'billing.phone', 'billing.email',
    // 'user',
    'callbackUrl', 'notifyUrl'
  ])

  param.merchantId = this.merchantId
  param.merchantToken = this.createToken(param.referenceNo, param.amount)
  param.paymentMethod = CONST.PAYMENT_METHOD.VIRTUAL_ACCOUNT
  param.cartData = JSON.stringify(param.cartData || {})

  this.client.request({
    endpoint: Client.ENDPOINT.REQUEST_VIRTUAL_ACCOUNT,
    data: param
  }, cb)
}

Nicepay.prototype.validateNotification = function (param, cb) {
  var result = {
    tXid: param.tXid,
    merchantToken: param.merchantToken,
    referenceNo: param.referenceNo,
    paymentMethod: param.payMethod,
    amount: param.amt
  }

  if (result.merchantToken !== this.createToken(result.tXid, result.amount)) {
    return cb(null, false)
  }

  return this.client.request({
    endpoint: Client.ENDPOINT.CHECK_TRANSACTION_STATUS,
    data: {
      merchantId: this.merchantId,
      merchantToken: this.createToken(result.referenceNo, result.amount),
      tXid: result.tXid,
      referenceNo: result.referenceNo,
      amount: result.amount
    }
  }, cb)
}

/**
 * request to cancel of transaction.
 * @param {object} param
 * @param {string} param.paymentMethod
 * @param {string} param.tXid
 * @param {number} param.cancelType
 * @param {number} param.amount
 */
Nicepay.prototype.cancelTransaction = function (param, cb) {
  return this.client.request({
    endpoint: Client.ENDPOINT.CANCEL_TRANSACTION,
    data: {
      merchantId: this.merchantId,
      merchantToken: this.createToken(param.tXid, param.amount),
      tXid: param.tXid,
      paymentMethod: param.paymentMethod,
      cancelType: param.cancelType,
      amount: param.amount
    }
  }, cb)
}

module.exports = {
  CONST: CONST,
  create: function (opts) {
    return new Nicepay(opts)
  },
  createBilling: function () {
    return new Billing()
  },
  createUser: function () {
    return new User()
  },
  createDelivery: function () {
    return new Delivery()
  }
}

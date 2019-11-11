// test

var Nicepay = require('./index')

var nicepay = Nicepay.create({
  merchantId: 'IONPAYTEST',
  merchantKey: '33F49GnCMS1mFYlGXisbUDzVf2ATWCl9k3R++d5hDd3Frmuos/XLx8XhXpe+LDYAbpGKZYSwtlyyLOtS/8aD7A==',
  dev: true
})

// CC

// var billing = Nicepay.createBilling()
// billing.setName('billing name')
// billing.setPhone('082123532710')
// billing.setCity('Jakarta')
// billing.setState('Pasar Minggu')
// billing.setPostcode('123456')
// billing.setCountry('ID')
// billing.setEmail('egg@madsq.net')

// var user = Nicepay.createUser()
// user.setIp('127.0.0.1')

// nicepay.registerCreditCardTransaction({
//   currency: 'IDR',
//   amount: 10000,
//   referenceNo: Date.now(),
//   productName: 'TEST ITEM',
//   description: 'this order is test',
//   callbackUrl: 'http://127.0.0.1/pg/nicepay/callback',
//   notifyUrl: 'http://127.0.0.1/pg/nicepay/notify',
//   billing: billing,
//   user: user
// }, function (err, result) {
//   console.log(JSON.stringify(result, null, 2))
// })

// VA
var billing = Nicepay.createBilling()
billing.setName('billing name')
billing.setPhone('082123532710')
// billing.setCity('Jakarta')
// billing.setState('Pasar Minggu')
// billing.setPostcode('123456')
// billing.setCountry('ID')
billing.setEmail('egg@madsq.net')

nicepay.registerVirtualAccountTransaction({
  currency: 'IDR',
  amount: 10000,
  referenceNo: Date.now(),
  productName: 'TEST ITEM',
  description: 'this order is test',
  callbackUrl: 'http://127.0.0.1/pg/nicepay/callback',
  notifyUrl: 'http://127.0.0.1/pg/nicepay/notify',
  billing: billing
}, function (err, result) {
  if (err) {
    return console.error(err)
  }
  console.info(JSON.stringify(result, null, 2))
})

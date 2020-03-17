# nicepay-id

no maintenance plan.

### Sample

```javascript
var nicepay = Nicepay.create({
  merchantId: '',
  merchantKey: '',
  dev: true
})

var user = Nicepay.createUser()
user.setIp(req.body.remoteIp)
user.setAgent(req.body.useragent)
user.setLanguage(req.body.language)

var billing = Nicepay.createBilling()
billing.setName(address.consignee)
billing.setPhone(address.phone)
billing.setEmail(order.user.email)
billing.setAddress(address.address1)
billing.setCity(address.city)
billing.setState(address.area)
billing.setPostcode(address.zipcode)
billing.setCountry(address.country)

var delivery = Nicepay.createDelivery()
delivery.setName(address.consignee)
delivery.setPhone(address.phone)
delivery.setAddress(address.address1)
delivery.setCity(address.city)
delivery.setState(address.area)
delivery.setPostcode(address.zipcode)
delivery.setCountry(address.country)

nicepay.registerVirtualAccountTransaction({
  user: user,
  billing: billing,
  delivery: delivery,
  currency: order.currency,
  referenceNo: order.ord_id,
  bankCode: req.body.bankCode,
  productName: parseProductName(order),
  amount: calcurateTotalAmount(order),
  description: 'Payment of Order No.' + order.ord_id,
  callbackUrl: req.body.callbackUrl,
  notifyUrl: config.nicepay.notifyUrl
}, function (err, result) {
  //
})
```

```javascript
nicepay.validateNotification(req.body, function (err, notification) {
  //
  if (notification === false) {
    // token is not match
    return res.error('common.invalid_token')
  }
})
```

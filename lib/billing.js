'use strict'

/**
 * Billing
 */
function Billing () {
  this.name = ''
  this.phone = ''
  this.email = ''
  this.address = ''
  this.city = ''
  this.state = ''
  this.postcode = ''
  this.country = ''
}

/**
 * set name
 * @param {string} name
 */
Billing.prototype.setName = function (name) {
  this.name = name
}

/**
 * set phone
 * @param {string} phone
 */
Billing.prototype.setPhone = function (phone) {
  this.phone = phone
}

/**
 * set email
 * @param {string} email
 */
Billing.prototype.setEmail = function (email) {
  this.email = email
}

/**
 * set addresss
 * @param {string} address
 */
Billing.prototype.setAddress = function (address) {
  this.address = address
}

/**
 * set city (only credit card)
 * @param {string} city
 */
Billing.prototype.setCity = function (city) {
  this.city = city
}

/**
 * set state (only credit card)
 * @param {string} state
 */
Billing.prototype.setState = function (state) {
  this.state = state
}

/**
 * set postcode (only credit card)
 * @param {string} postcode
 */
Billing.prototype.setPostcode = function (postcode) {
  this.postcode = postcode
}

/**
 * set country (only credit card)
 * @param {string} country
 */
Billing.prototype.setCountry = function (country) {
  this.country = country
}

module.exports = Billing

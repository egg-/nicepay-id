'use strict'

/**
 * Delivery
 */
function Delivery () {
  this.name = ''
  this.phone = ''
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
Delivery.prototype.setName = function (name) {
  this.name = name
}

/**
 * set phone
 * @param {string} phone
 */
Delivery.prototype.setPhone = function (phone) {
  this.phone = phone
}

/**
 * set addresss
 * @param {string} address
 */
Delivery.prototype.setAddress = function (address) {
  this.address = address
}

/**
 * set city
 * @param {string} city
 */
Delivery.prototype.setCity = function (city) {
  this.city = city
}

/**
 * set state
 * @param {string} state
 */
Delivery.prototype.setState = function (state) {
  this.state = state
}

/**
 * set postcode
 * @param {string} postcode
 */
Delivery.prototype.setPostcode = function (postcode) {
  this.postcode = postcode
}

/**
 * set country
 * @param {string} country
 */
Delivery.prototype.setCountry = function (country) {
  this.country = country
}

module.exports = Delivery

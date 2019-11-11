'use strict'

/**
 * User
 */
function User () {
  this.ip = ''
  this.sessionId = ''
  this.agent = ''
  this.language = ''
}

/**
 * set ip
 * @param {string} ip
 */
User.prototype.setIp = function (ip) {
  this.ip = ip
}

/**
 * set session id
 * @param {string} sessionId
 */
User.prototype.setSessionId = function (sessionId) {
  this.sessionId = sessionId
}

/**
 * set user agent information
 * @param {string} agent Mozilla
 */
User.prototype.setAgent = function (agent) {
  this.agent = agent
}

/**
 * set user language
 * @param {string} language
 */
User.prototype.setLanguage = function (language) {
  this.language = language
}

module.exports = User

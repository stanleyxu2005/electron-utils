'use strict'

const {app, protocol} = require('electron')
const path = require('path')

module.exports = (options = {}) => {
  /**
   * By default web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies)
   * are disabled for non standard schemes. So in general if you want to register a custom
   * protocol to replace the http protocol, you have to register it as a standard scheme.
   */
  options.scheme = options.scheme || 'app'
  protocol.registerStandardSchemes([options.scheme], {secure: true})

  app.once('ready', () => {
    const appDir = options.directory || app.getAppPath()
    const offset = options.scheme.length + '://'.length
    const handleRequest = (request, callback) => {
      const filepath = request.url.substr(offset)
      const realpath = path.normalize(`${appDir}/${filepath}`)
      callback(realpath)
    }
    protocol.registerFileProtocol(options.scheme, handleRequest)
  })
}
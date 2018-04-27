'use strict'

const {app, protocol} = require('electron')
const path = require('path')

module.exports = (scheme='app') => {
  /**
   * By default web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies)
   * are disabled for non standard schemes. So in general if you want to register a custom
   * protocol to replace the http protocol, you have to register it as a standard scheme.
   */
  protocol.registerStandardSchemes([scheme], {secure: true})

  app.once('ready', () => {
    const appDir = app.getAppPath()
    const offset = scheme.length + '://'.length
    const handleRequest = (request, callback) => {
      const filepath = request.url.substr(offset)
      const realpath = path.normalize(`${appDir}/${filepath}`)
      callback(realpath)
    }
    protocol.registerFileProtocol(scheme, handleRequest)
  })
}
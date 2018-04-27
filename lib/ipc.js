'use strict'

const _ = require('lodash')
const {ipcMain, ipcRenderer} = require('electron')

module.exports = {

  handleIPCRequest: (method, args = []) => {
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.once(`${method}-reply`, (event, resp) => {
          resp.error ? reject(resp.error) : resolve(resp.result)
        })
        ipcRenderer.send(method, ...args)
      } catch (ex) {
        reject(ex)
      }
    })
  },

  registerIPCHandler: (method, handler) => {
    ipcMain.on(method, async (event, ...args) => {
      const resp = {}
      try {
        resp.result = await handler(...args)
      } catch (ex) {
        resp.error = _.isError(ex) ? ex.message : String(ex)
      }
      event.sender.send(`${method}-reply`, resp)
    })
  }
}
'use strict'

const _ = require('lodash')
const {BrowserWindow} = require('electron')
const registry = {}
const windowDefaults = {
  width: 900, height: 680,
  autoHideMenuBar: true,
  backgroundColor: '#FFF', // https://github.com/electron/electron/issues/10025
  webPreferences: {
    nodeIntegration: false
  }
}

function createOrActivate(name, url, options = {}) {
  const win = get(name)
  return win ?
    activate(win) :
    create(name, url, options)
}

function create(name, url, options = {}) {
  const windowOptions = _.merge({}, windowDefaults, options)
  const win = new BrowserWindow(windowOptions)
  registry[name] = win
  win.on('closed', () => delete registry[name])
  if (process.env.DEBUG) {
    win.webContents.openDevTools()
  }
  if (!/^[a-z]+:\/\//i.test(url)) {
    url = require('url').format({
      protocol: 'file',
      slashes: true,
      pathname: url
    })
  }
  win.loadURL(url)
  return win
}

function get(name) {
  return registry[name]
}

function activate(win) {
  if (_.isString(win)) {
    win = get(win)
  }
  let success = false
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.focus()
    success = true
  }
  return success
}

function setDefaults(value) {
  _.merge(windowDefaults, value)
}

module.exports = {
  get,
  create,
  createOrActivate,
  activate,
  setDefaults
}
'use strict'

const _ = require('lodash')
const {BrowserWindow} = require('electron')
const registry = {}
const defaults = {}

function createOrActivate(name, url, options = {}) {
  const win = get(name)
  return win ?
    activate(win) :
    create(name, url, options)
}

function create(name, url, options = {}) {
  const windowOptions = _.mergeWith({
    width: 900, height: 680,
    icon: defaults.icon,
    title: defaults.title,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      preload: defaults.preload
    }
  }, options)
  const win = new BrowserWindow(windowOptions)
  registry[name] = win
  win.on('closed', () => delete registry[name])
  if (process.env.DEBUG) {
    win.webContents.openDevTools()
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
  if (win.isMinimized()) {
    win.restore()
  }
  win.focus()
}

function setDefaults(value) {
  Object.assign(defaults, value)
}

module.exports = {
  get,
  create,
  createOrActivate,
  activate,
  setDefaults
}
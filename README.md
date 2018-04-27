# Electron-Lib

[![npm version](https://badge.fury.io/js/electron-lib.svg)](http://badge.fury.io/js/electron-lib) 

Some helper functions to accelerate your Electron development work

## Register App Protocol

Why you need to use file protocol or local file path to locate your files? With the follow code, you can use `app://views/welcome/index.html` to locate `file://path/to/app/views/welcome/index.html`

In `app.js`
```javascript
const elib = require('electron-lib')
elib.registerAppProtocol()
```

## Window Creation and Management

```javacript
const elib = require('electron-lib')
const options = {width: 600, height: 400}
elib.windows.createOrActivate('welcome', 'app://views/welcome/index.html', options)
// some time later...
elib.windows.activate('welcome')
```

## IPC Between Browser Window and Main Process

The default ipc methods are too complex. We need just one line

```javascript
// In main process
const elib = require('electron-lib')
elib.ipc.registerIPCHandler('newwin', (url, name) => {
  elib.windows.createOrActivate(name, url, {width: 640, height: 480})
})

// In renderer process (browser window)
ipc.handleIPCRequest('newwin', ['https://github.com/', 'github'])
```
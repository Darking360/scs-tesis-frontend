import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { initializeFirebase } from './push-notification'
import { askForPermissioToReceiveNotifications } from './push-notification'

ReactDOM.render(<App />, document.getElementById('root'))
serviceWorker.register()
initializeFirebase()
askForPermissioToReceiveNotifications()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA


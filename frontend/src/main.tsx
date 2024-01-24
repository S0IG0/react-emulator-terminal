import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import "./style/reset.css"
import "./style/main.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.jsx'
//import LoginPage from './pages/LoginPage.jsx'
//import ChatRoomOption from './components/chatRoomOption.jsx'
//import MsgInput from './components/msgInputField.jsx'
import ChatRoomWindow from './components/chatRoomWindow.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Change the bottom line to test any pages */ }
      <ChatRoomWindow/>
  </React.StrictMode>,
)

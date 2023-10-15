import { BrowserRouter, Routes, Route } from "react-router-dom";
//import LoginPage from "./pages/LoginPage";
import ChatRoomWindow  from './components/chatRoomWindow'

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        {/* Change the bottom line to test any pages */ }
        <Route path="/" element={<ChatRoomWindow isChatRoom = {true}/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

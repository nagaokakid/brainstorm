import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ChatRoomWindow from "../components/chatRoomWindow";
import { useEffect, useState } from "react";
//top element a grid, 4 colms
function MainPage()
{

  const [chatType, setChatType] = useState(1);
  const handleCallBack = (childData) => {
    setChatType(childData);
  }
  const [chatList, setChatList] = useState(1)
  const handleCallBack2 = (childData) => {
    setChatList(childData);
  }
  
  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar userName={["userName"]} />
      </div>
      <div className="main-page-container">
        <NavigationBar handleCallBack={handleCallBack}/>
        <ChatList chats={3} handleCallBack={handleCallBack2}/>
        <ChatRoomWindow window={chatList} chatType={chatType}/>
      </div>
    </div>
  );
}

export default MainPage;

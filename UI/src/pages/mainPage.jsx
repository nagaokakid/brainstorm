import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import { useState } from "react";
import SignalRChatRoom from "../services/chatRoomConnection";
import SignalRDirect from "../services/directMessageConnection";
import AppInfo from "../services/appInfo";

//top element a grid, 4 colms
function MainPage()
{
  const [isUpdated, setIsUpdated] = useState(false)

  // Receive message from SignalR
  function receiveMessage(message)
  {
    AppInfo.addMessage(message)
    setIsUpdated(!isUpdated)
  }

  // Create SignalR connection
  SignalRChatRoom.getInstance(receiveMessage)
  SignalRDirect.getInstance(receiveMessage)

  // Set the default chat type to be "Direct Message List"
  const [chatType, setChatType] = useState("Direct Message List");
  
  // Handle the callback from the NavigationBar component
  const handleCallBack = (childData) =>
  {
    setChatType(childData);
  }
  
  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar />
      </div>
      <div className="main-page-container">
        <NavigationBar handleCallBack={handleCallBack}/>
        <ChatList chatType={chatType} changes= {isUpdated} />
      </div>
    </div>
  );
}

export default MainPage;

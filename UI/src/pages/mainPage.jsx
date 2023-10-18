import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import SignalRChatRoom from "../services/chatRoomConnection";
import SignalRDirect from "../services/directMessageConnection";
import { useState } from "react";
import AppInfo from "../services/appInfo";

//top element a grid, 4 colms
function MainPage()
{
  // If the user is not logged in, redirect to the login page
  if (localStorage.getItem("token") === null || localStorage.getItem("token") !== AppInfo.getToken)
  {
    window.location.href = "/";
  }

  // Set the default chat type to be "Direct Message List"
  const [isUpdated, setIsUpdated] = useState(false);

  // Set the default chat type to be "Direct Message List"
  const [chatType, setChatType] = useState("ChatRoom List");

  // Handle the callback from the NavigationBar component
  const handleCallBack = (childData) => {
    setChatType(childData);
  }

  // Callback function for receiving messages
  function receiveMessage(message) {
    console.log("received message", message);
    AppInfo.addMessage(message);
    setIsUpdated(!isUpdated);
  }

  // Create SignalR connection
  SignalRChatRoom.getInstance().then((x) => {
    x.receiveMessageCallback(receiveMessage);
  });
  
  // SignalRDirect.getInstance();
  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar />
      </div>
      <div className="main-page-container">
        <NavigationBar handleCallBack={handleCallBack} />
        <ChatList chatType={chatType} changes={isUpdated} />
      </div>
    </div>
  );
}

export default MainPage;

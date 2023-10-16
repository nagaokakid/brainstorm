import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ChatRoomWindow from "../components/chatRoomWindow";
import AppInfo  from "../services/appInfo";
import { useEffect, useRef, useState } from "react";
//top element a grid, 4 colms
function MainPage()
{
  const [chatType, setChatType] = useState("Direct Message List");
  const [chatList, setChatList] = useState([{}])
  const [listId, setListId] = useState("Title")
  const headerTitle = useRef("Title");
  
  // Handle the callback from the NavigationBar component
  const handleCallBack = (childData) => {
    setChatType(childData);
  }

  // Update the chat list when the chat type changes
  useEffect(() => {
    if (chatType === "Direct Message List") {
      setChatList(AppInfo.getDirectMessagesList());
    } else if (chatType === "ChatRoom List") {
      setChatList(AppInfo.getChatRoomsList());
    }
  }, [chatType]);

  // Handle the callback from the ChatList component
  const handleCallBack2 = (childData) => {
    setListId(childData);
    headerTitle.current = childData;
  }
  useEffect(() => {
    headerTitle.current = listId;
  }, [listId, chatType]);
  
  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar />
      </div>
      <div className="main-page-container">
        <NavigationBar handleCallBack={handleCallBack}/>
        <ChatList list={chatList} chatType={chatType} handleCallBack={handleCallBack2}/>
        <ChatRoomWindow headerTitle={headerTitle.current} chatType={chatType}/>
      </div>
    </div>
  );
}

export default MainPage;

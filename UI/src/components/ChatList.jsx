/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import ChatRoomWindow from "./chatRoomWindow";
import ChatRoomOption from "./chatRoomOption";
import AppInfo from "../services/appInfo";
import { useEffect, useState } from "react";

function ChatList(props)
{
  const [chatList, setChatList] = useState([{}])
  const [chatId, setChatId] = useState("No Selected Chat")

  // Update the chat list when the chat type changes
  useEffect (() =>
  {
    if (props.chatType === "Direct Message List")
    {
      setChatList(AppInfo.getDirectMessagesList());
    }
    else if (props.chatType === "ChatRoom List")
    {
      console.log("in chatroom list... getChatRoomsList");
      const data = AppInfo.getChatRoomsList()

      setChatList(data);
      console.log("in chatroom list" + data);
      console.log(data);
    }
  }, [props.chatType])

  // Create a chat room option
  const [display, setDisplay] = useState("none")
  

  const handleCreateRoomButton = () =>
  {
    setDisplay("flex")
  }

  // useEffect(() =>
  // {
  //   document.getElementById("OptionContainer").style.display ="none"
  // }, [display])

  return (
    <div className="ChatListContainer">
      <div className="chat-list">
        <h3>{props.chatType}</h3>
        <div className="search-bar">
          <input type="text" placeholder="Search Chats" />
        </div>
        <div className="chats">
          {chatList.map((chat, index) => (
            <div className="chat-item" key={index} onClick={() => setChatId(chat.id)}>
              <div className="chat-details">
                <div className="chat-username">{chat.id}</div>
                <div className="last-message">{chat.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="CreateChatRoomButton" style={ props.chatType === "Direct Message List" ? {display:"none"}:{display:"flex"}}>
          <button onClick={() => handleCreateRoomButton()}>Create Chat Room</button>
        </div>
      </div>
      <div className="ChatWindowContainer">
        <ChatRoomWindow headerTitle={chatId} chatType={props.chatType}/>
      </div>
      <ChatRoomOption style= {display} />
    </div>
  );
}

export default ChatList;

/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import ChatRoomWindow from "./chatRoomWindow";
import ChatRoomOption from "./chatRoomOption";
import AppInfo from "../services/appInfo";
import { useEffect, useState } from "react";

function ChatList(props)
{
  // Set the default chat list to be the Chat room list
  const [chatList, setChatList] = useState(AppInfo.getChatRoomsList)

  // Set the default chat window to be "No Selected Chat"
  const [chatId, setChatId] = useState("No Selected Chat")

  const [chatTitle, setChatTitle] = useState("No Selected Chat")
  
  // Track the display of the chat room option
  const [display, setDisplay] = useState("none")

  // Update the chat list when the chat type changes
  useEffect (() =>
  {
    if (props.chatType === "Direct Message List")
    {
      setChatList(AppInfo.getDirectMessagesList());
    }
    else if (props.chatType === "ChatRoom List")
    {
      setChatList(AppInfo.getChatRoomsList());
      setTimeout(() => {
        console.log("Added a message")
        AppInfo.addMessage({
          "fromUserInfo":
          {
              "userId": "string",
              "firstName": "string",
              "lastName": "string"
          },
          "toUserInfo":
          {
              "userId": "string",
              "firstName": "string",
              "lastName": "string"
          },
          "chatRoomId": "0001",
          "message": "ggwp",
          "timestamp": "2023-10-13T23:35:59.786Z"
      })
      }, 5000);
    }
  }, [props.chatType])

  // Setting the create chat room option to be visible
  const handleCreateRoomButton = (e) =>
  {
    setDisplay(e)
  }

  return (
    <div className="ChatListContainer">
      <div className="chat-list">
        <h3>{props.chatType}</h3>
        <div className="search-bar">
          <input type="text" placeholder="Search Chats" />
        </div>
        <div className="chats">
          {chatList.map((chat, index) => (
            <div className="chat-item" key={index} onClick={() => {setChatTitle(chat.title), setChatId(chat.id)}}>
              <div className="chat-details">
                <div className="chat-title">{chat.title}</div>
                <div className="last-message">{chat.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="CreateChatRoomButton" style={ props.chatType === "Direct Message List" ? {display:"none"}:{display:"flex"}}>
          <button onClick={() => handleCreateRoomButton("flex")}>Create Chat Room</button>
        </div>
      </div>
      <div className="ChatWindowContainer">
        <ChatRoomWindow headerTitle={chatTitle} chatType={props.chatType} chatId={chatId}/>
      </div>
      <ChatRoomOption style= {display} callBack={handleCreateRoomButton} />
    </div>
  );
}

export default ChatList;

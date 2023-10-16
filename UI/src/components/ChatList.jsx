/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import ChatRoomWindow from "./chatRoomWindow";
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
      setChatList(AppInfo.getChatRoomsList());
    }
  }, [props.chatType])

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
      </div>
      <div className="ChatWindowContainer">
        <ChatRoomWindow headerTitle={chatId} chatType={props.chatType}/>
      </div>
    </div>
  );
}

export default ChatList;

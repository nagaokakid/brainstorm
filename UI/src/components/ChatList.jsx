/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import { useState } from "react";
import AppInfo from "../services/appInfo";

function ChatList(props)
{
  const appInfo = new AppInfo();
  const [chatList, setChatList] = useState(() => {
    if (props.chats === 1) {
      return appInfo.getDirectMessagesList();
    }
    else if (props.chats === 2) {
      return appInfo.getChatRoomsList();
    }
    else {
      return [{id:"chat1", lastMessage:"hahahahah"}, {id:"chat2"}, {id:"chat3"}];
    }
  });

  const window = (childData) => {
    props.handleCallBack(childData);
  }

  return (
    <div className="chat-list">
      <h3>{props.chats}</h3> 
      <div className="search-bar">
        <input type="text" placeholder="Search Chats" />
      </div>
      <div className="chats">
        {chatList.map((chat, index) => (
          <div className="chat-item" key={index} onClick={() => window(chat.id)}>
            <div className="chat-details">
              <div className="chat-username">{chat.id}</div>
              <div className="last-message">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;

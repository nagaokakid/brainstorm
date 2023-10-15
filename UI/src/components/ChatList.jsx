import React from "react";
import "../styles/ChatList.css";

const ChatList = ({ chats }) => {
  return (
    <div className="chat-list">
      <h3>Chat</h3> 
      <div className="search-bar">
        <input type="text" placeholder="Search Chats" />
      </div>
      <div className="chats">
        {chats.map((chat, index) => (
          <div className="chat-item" key={index}>
            <div className="chat-details">
              <div className="chat-username">{chat.username}</div>
              <div className="last-message">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

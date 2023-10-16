/* eslint-disable react/prop-types */
import "../styles/ChatList.css";

function ChatList(props)
{
  return (
    <div className="chat-list">
      <h3>Chat</h3> 
      <div className="search-bar">
        <input type="text" placeholder="Search Chats" />
      </div>
      <div className="chats">
        {props.chats.map((chat, index) => (
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
}

export default ChatList;

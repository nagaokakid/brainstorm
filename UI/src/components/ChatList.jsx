/* eslint-disable react/prop-types */
import "../styles/ChatList.css";

function ChatList(props)
{
  return (
    <div className="chat-list">
      <h3>{props.chatType}</h3>
      <div className="search-bar">
        <input type="text" placeholder="Search Chats" />
      </div>
      <div className="chats">
        {props.list.map((chat, index) => (
          <div className="chat-item" key={index} onClick={() => props.handleCallBack(chat.id)}>
            <div className="chat-details">
              <div className="chat-username">{chat.id}</div>
              <div className="last-message">{chat.lastMsg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;

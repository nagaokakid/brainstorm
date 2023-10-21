/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import ChatRoomOption from "./ChatRoomOption";
import AppInfo from "../services/AppInfo";
import { lazy, useEffect, useState, Suspense, useContext } from "react";
import { DataContext, DataDispatchContext } from "../context/dataContext";

/**
 * 
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List"
 * @returns The chat list of the application
 */
function ChatList(props)
{
  const chatRoomInfo = useContext(DataContext)[3];
  const directMessage = useContext(DataContext)[1];
  const chatMessage = useContext(DataContext)[2];
  
  // Lazy load the chat room window component
  const ChatRoomWindow = lazy(() => import("./ChatRoomWindow"));

  // Set the default chat type
  const [chatType, setChatType] = useState(props.chatType);

  // Set the default chat list to be empty list
  const [chatList, setChatList] = useState([]);

  // Track the current selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Set the default display of the create chat room option to be hidden
  const [display, setDisplay] = useState("none");

  // Re-render the chat list when the chat type changes
  useEffect (() =>
  {
    if (props.chatType === "Direct Message List")
    {
      console.log("----> Displaying direct messages list");
      setChatList(AppInfo.getDirectMessagesList());
    }
    else if (props.chatType === "ChatRoom List")
    {
      console.log("----> Displaying chat rooms list");
      setChatList(AppInfo.getChatRoomsList());
    }
  }, [props.chatType, chatRoomInfo, chatMessage, directMessage]);

  // Set the chat id and chat title when a chat is selected
  const handleChatOnClick = (chat) =>
  {
    console.log("Selected a chat");
    setSelectedChat(chat);
    setChatType(props.chatType);
  }

  // Set the display of the create chat room option
  const handleCreateRoomButton = (e) =>
  {
    setDisplay(e)
  }

  return (
    <div className="ChatListContainer">
      <div className="chat-list">
        <h3 className="ChatListTitle">{props.chatType}</h3>
        <div className="search-bar">
          <input type="text" placeholder="Search Chats" />
        </div>
        <div className="chats">
          {chatList.map((chat, index) => (
            <div className="chat-item" key={index} onClick={() => handleChatOnClick(chat)}>
              <div className="chat-details">
                <div className="chat-title">{chat.title ?? chat.user2.firstName+" "+chat.user2.lastName}</div>
                <div className="last-message">{chat.description ?? chat.directMessages.slice(-1)[0].message}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="CreateChatRoomButton" style={ props.chatType === "Direct Message List" ? {display:"none"}:{display:"flex"}}>
          <button onClick={() => handleCreateRoomButton("flex")}>Create Chat Room</button>
        </div>
      </div>
      <div className="ChatWindowContainer">
        { selectedChat && (
        <Suspense fallback={"Loading...."}>
          <ChatRoomWindow chatType={chatType} chat={selectedChat} />
        </Suspense>
        )}
      </div>
      <ChatRoomOption style= {display} callBackFunction={handleCreateRoomButton} />
    </div>
  );
}

export default ChatList;

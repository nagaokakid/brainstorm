/* eslint-disable react/prop-types */
import "../styles/ChatList.css";
import ChatRoomWindow from "./chatRoomWindow";
import ChatRoomOption from "./chatRoomOption";
import AppInfo from "../services/appInfo";
import { useEffect, useState } from "react";

function ChatList(props)
{
  // Set the default chat list to be the Chat room list
  const [chatList, setChatList] = useState([]);

  // Track the current selected chat
  const [chatId, setChatId] = useState("");

  const [chatTitle, setChatTitle] = useState("");
  
  // Track the display of the chat room option
  const [display, setDisplay] = useState("none");

  const [memberList, setMemberList] = useState();

  // Update the chat list when the chat type changes
  useEffect (() =>
  {
    if (props.chatType === "Direct Message List")
    {
      console.log("direct chat list object");
      console.log(AppInfo.getDirectMessagesList());
      setChatList(AppInfo.getDirectMessagesList());
    }
    else if (props.chatType === "ChatRoom List")
    {
      setChatList(AppInfo.getChatRoomsList());
    }
  }, [props.chatType]);

  // Setting the create chat room option to be visible
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
            <div className="chat-item" key={index} onClick={() => {
              console.log("chat ----");
              console.log(chat);
              setChatTitle(chat.title ?? chat.user2.firstName), setChatId(chat.id ?? chat.user2.userId), setMemberList(chat.members ?? null)}}>
              <div className="chat-details">
                <div className="chat-title">{chat.title ?? chat.user2.firstName}</div>
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
        <ChatRoomWindow headerTitle={chatTitle} chatType={props.chatType} chatId={chatId} memberList={memberList} />
      </div>
      <ChatRoomOption style= {display} callBack={handleCreateRoomButton} />
    </div>
  );
}

export default ChatList;

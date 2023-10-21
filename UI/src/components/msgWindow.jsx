/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "../styles/MsgWindow.css";
import MessageBox from "./MsgBox";
import AppInfo from "../services/AppInfo";
import MessageInput from "./MsgInputField";
import SignalRChatRoom from "../services/ChatRoomConnection";
import SignalRDirect from "../services/DirectMessageConnection";
import { DataContext, DataDispatchContext } from "../context/dataContext";
import { useEffect, useState, useContext } from "react";

/**
 * 
 * @param {*} chatId Either the chat room id or the direct message to_user id
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List"
 * @returns 
 */
function MsgWindow(props)
{
  const chatMessage = useContext(DataContext)[2];
  const directMessage = useContext(DataContext)[1];
  const setChatMessage = useContext(DataDispatchContext)[2];
  const setDirectMessage = useContext(DataDispatchContext)[1];

  // Set the message to the display
  const [messages, setMessages] = useState(props.chatId === "" ? [] : AppInfo.getListHistory(props.chatId, props.chatType));

  // Receive message callback
  async function receiveMessage(msg)
  {
    console.log("----> Receive a message callback in MsgWindow", msg);
    AppInfo.addChatRoomMessage(msg);
    setChatMessage(!chatMessage);
    // setMessages([...messages, msg]);
  }

  // Set the receive message callback
  // useEffect(() =>
  // {
  //   if (props.chatType === "Direct Message List")
  //   {
  //     SignalRDirect.getInstance().then((value) => value.setReceiveDirectMessageCallback(receiveMessage));
  //   }
  //   else if (props.chatType === "ChatRoom List")
  //   {
  //     SignalRChatRoom.getInstance().then((value) => value.setReceiveChatRoomMessageCallback(receiveMessage));
  //   }
  // }, [props.chatType]);

  
  // Set the message list when the chat id changes
  useEffect(() =>
  {
    // SignalRChatRoom.getInstance().then((value) => value.setReceiveChatRoomMessageCallback(receiveMessage));
    setMessages(props.chatId === "" ? [] : AppInfo.getListHistory(props.chatId, props.chatType));
  }, [props.chatId, chatMessage, directMessage]);

  return (
    <div className="MsgWindowContainer">
      <div className="MsgSection">
        {messages.map((e, index) => (
          <MessageBox message={e.message} key={index} user={e.fromUserInfo ? e.fromUserInfo.userId : null} />
        ))}
      </div>
      <div className='InputSection'>
        <MessageInput chatType={props.chatType} chatId={props.chatId} />
      </div>
    </div>
  );
}

export default MsgWindow;

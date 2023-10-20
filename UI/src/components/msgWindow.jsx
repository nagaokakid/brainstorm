/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import MessageBox from "./msgBox";
import AppInfo from "../services/appInfo";
import SignalRChatRoom from "../services/chatRoomConnection";

function MsgWindow(props) {
  // Set the message to the display
  const [messages, setMessages] = useState(props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType));
  //   const [count, setCount] = useState(
  //     AppInfo.loginRegisterResponse.chatRooms[0].messages.length
  //   );
  async function receiveChatRoomMsg(msg) {
    console.log("----> Receive chatroom message callback in MsgWindow", msg)
    setMessages([...messages, msg])
  }

  SignalRChatRoom.getInstance().then((value) =>
    value.receiveMessageCallback(receiveChatRoomMsg)
  );
  console.log(props.chatId);

  useEffect(() => {
    console.log("........log use effect");

    // setMessages(
    //   props.chatId === "" ? [] : AppInfo.getList(props.chatId, props.chatType)
    // );
  }, [props.chatId, props.chatType]);

  return (
    <div className="msgWindowContainer">
      {messages.map((e, index) => (
        <MessageBox message={e.message} key={index} />
      ))}
    </div>
  );
}

export default MsgWindow;

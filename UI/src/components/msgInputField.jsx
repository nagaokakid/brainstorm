/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import "../styles/MsgInputField.css";
import AppInfo from "../services/AppInfo";
import emailIcon from "../assets/email.png";
import SignalRDirect from "../services/DirectMessageConnection";
import { useEffect, useState } from "react";
import SignalRChatRoom from "../services/ChatRoomConnection";

/**
 * 
 * @param {*} chatType The type of chat list to be displayed; either "Direct Message List" or "ChatRoom List"
 * @param {*} chatId Either the chat room id or the direct message to_user id 
 * @returns 
 */
function MsgInputField(props)
{
  // Set the default state of the text
  const [text, setText] = useState("");

  // Send message
  const handleSend = () =>
  {
    // check if text is empty
    if (!text) return;

    if (props.chatType === "Direct Message List")
    {
      // create message object
      const msg = {
        user1: AppInfo.getCurrentFriendlyUserInfo(),
        user2: {userId:props.chatId, },
        messages: [{message:text}],
      };
      SignalRDirect.getInstance().then( async (value) =>
      {
        await value.sendMessage(msg);
        console.log("----> Sent Direct Message");
      });
    }
    else if (props.chatType === "ChatRoom List")
    {
      // create message object
      const msg = {
        fromUserInfo: AppInfo.getCurrentFriendlyUserInfo(),
        chatRoomId: props.chatId,
        message: text,
      };
      SignalRChatRoom.getInstance().then( async (value) =>
      {
        await value.sendChatRoomMessage(msg);
        console.log("----> Sent Chat Room Message");
      });
    }

    setText("");
  };

  // Send message on enter key
  const handleKey = (e) =>
  {
    if (e.code === "Enter" || e.code === "NumpadEnter")
    {
      handleSend();
    }
  };

  // Clean the input bar when the chat id changes
  useEffect(() =>
  {
    setText("");
  }, [props.chatId]);

  return (
    <div className="MsgInputContainer">
      <input
        type="text"
        id=""
        placeholder="Enter Message here..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <div className="send">
        <button onClick={handleSend}>
          <img src={emailIcon} alt="Send" />
        </button>
      </div>
    </div>
  );
}

export default MsgInputField;

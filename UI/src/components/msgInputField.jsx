import { useEffect, useState } from "react";
import emailIcon from "../assets/email.png";
import "../styles/msgInputField.css";
import AppInfo from "../services/appInfo";
import SignalRChatRoom from "../services/chatRoomConnection";

function msgInputField(props) {
  const [text, setText] = useState("");

  // Send message
  const handleSend = () => {
    // check if text is empty
    if (!text) return;

    // send message
    if (false) {
      // create message object
      const msg = {
        fromUserInfo: AppInfo.getCurrentFriendlyUserInfo(),
        toUserInfo: [props.chatId],
        message: text,
        timestamp: Date.now().toString(),
      };
      connection.sendMessage(msg);
    } else {
        // {
        //     "fromUserInfo": {
        //       "userId": "string",
        //       "firstName": "string",
        //       "lastName": "string"
        //     },
        //     "chatRoomId": "string",
        //     "message": "string",
        //     "timestamp": "2023-10-18T04:40:53.386Z"
        //   }
      const msg = {
        fromUserInfo: AppInfo.getCurrentFriendlyUserInfo(),
        chatRoomId: props.chatId,
        message: text,
        timestamp: Date.UTC(Date.now)
      };
      SignalRChatRoom.getInstance().then(async (x) => {
        console.log("Sending message " + msg);
        await x.sendChatRoomMessage(JSON.stringify(msg));
        console.log("Sent Message");
      });
    }

    setText("");
  };

  // Send message on enter key
  const handleKey = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      handleSend();
    }
  };

  useEffect(() => {
    setText("");
  }, [props.chatId, props.connection]);

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

export default msgInputField;

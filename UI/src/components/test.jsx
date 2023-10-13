import React, { useState } from "react";
import SignalRDirect from "../services/directMessageConnection";
import * as signalR from "@microsoft/signalr";

function TestSignalR() {
  const [messages, setMessages] = useState("");
  function receiveMessage(msg) {
    console.log("In receive message callback");
    console.log(msg);
    setMessages(msg)
  }
  function receiveChatHistory(history) {
    console.log(history);
    setMessages(history)
  }
  const directMsg = SignalRDirect.getInstance(receiveMessage, receiveChatHistory);

  return (
    <>
      <button
        onClick={() => {
          console.log("clicked join direct");
          directMsg.join();
          directMsg.sendMessage({
            fromuserinfo: { userid: "123" },
            touserinfo: { userid: "123" },
            message: "Hello... wow!!!!",
          });
          directMsg.getChatHistory({ fromId: "123", toId: "123" });
        }}
      >
        Join Direct Messaging Service
      </button>
      <div>{messages.message}</div>
    </>
  );
}

export default TestSignalR;

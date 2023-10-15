import React from "react";
import "../styles/MainPage.css";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import HeaderNavBar from "../components/HeaderNavBar";
import MemberList from "../components/MemberList";
//top element a grid, 4 colms
function MainPage() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <HeaderNavBar userName={["userName"]} />
      <div className="main-page-container">
        <NavigationBar />
        <ChatList chats={["Chat 1", "Chat 2", "Chat 3"]} />
      </div>
    </div>
  );
}

export default MainPage;

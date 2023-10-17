import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import { useState } from "react";
import AppInfo from "../services/appInfo";
//top element a grid, 4 colms
function MainPage()
{
  // If the user is not logged in, redirect to the login page
  // if (localStorage.getItem("token") === null || localStorage.getItem("token") !== AppInfo.getToken)
  // {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("username");
  //   window.location.href = "/";
  // }

  // Set the default chat type to be "Direct Message List"
  const [chatType, setChatType] = useState("Direct Message List");

  // Handle the callback from the NavigationBar component
  const handleCallBack = (childData) =>
  {
    setChatType(childData);
  }

  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar />
      </div>
      <div className="main-page-container">
        <NavigationBar handleCallBack={handleCallBack} />
        <ChatList chatType={chatType} />
      </div>
    </div>
  );
}

export default MainPage;

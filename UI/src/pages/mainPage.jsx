import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import AppInfo from "../services/AppInfo";
import ApiService from "../services/ApiService";
import { useState } from "react";

/**
 * 
 * @returns The main page of the application
 */
function MainPage()
{
  // If the user is not logged in, redirect to the login page
  if (localStorage.getItem("token") === null || localStorage.getItem("token") !== AppInfo.getToken)
  {
    // window.location.href = "/";
  }

  // Set the default chat type to be "Direct Message List"
  const [chatType, setChatType] = useState("ChatRoom List");

  // Handle the callback from the NavigationBar component
  const handleCallBack = (childData) =>
  {
    setChatType(childData);
  }

  const apiservice = new ApiService();
  apiservice.buildCallBack();

  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar />
      </div>
      <div className="main-page-container">
        <NavigationBar callBackFunction={handleCallBack} />
        <ChatList chatType={chatType} />
      </div>
    </div>
  );
}

export default MainPage;

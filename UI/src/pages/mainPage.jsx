import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import AppInfo from "../services/AppInfo";
import ApiService from "../services/ApiService";
import { useEffect, useState, useContext  } from "react";
import { DataContext, DataDispatchContext } from "../context/dataContext";

/**
 * 
 * @returns The main page of the application
 */
function MainPage()
{
  
  var setChatMessage = useContext(DataDispatchContext)[2];
  var setDirectMessage = useContext(DataDispatchContext)[1];
  var chatMessage = useContext(DataContext)[2];
  var directMessage = useContext(DataContext)[1];
  
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

  function render()
  {
    var run1 = (e) =>
    {
      console.log("----> Render chat callback", e);
      setChatMessage(!chatMessage);
    }
    var run2 = (e) =>
    {
      console.log("----> Render direct callback", e);
      setDirectMessage(!directMessage);
    }
    run1(chatMessage)
    run2(directMessage)
    console.log("----> Render callback");
  }

  useEffect(() =>
  {
    console.log("----> Build callback");
    const apiservice = new ApiService();
    apiservice.buildCallBack(render);
  }, []);

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

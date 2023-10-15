import React from "react";
import "../styles/NavigationBar.css"; 

const NavigationBar = () => {
  return (
    <div className="navigation-bar">
        
      <button className="nav-button">Chats</button>
      <button className="nav-button">Chatrooms</button>
      <button className="nav-button">History</button>
      <button className="nav-button">Settings</button>
    </div>
  );
};

export default NavigationBar;

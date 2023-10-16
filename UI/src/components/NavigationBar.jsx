/* eslint-disable react/prop-types */
import "../styles/NavigationBar.css"; 

function NavigationBar(props)
{
  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={() => props.handleCallBack("Direct Message List")}>Direct Message</button>
      <button className="nav-button" onClick={() => props.handleCallBack("ChatRoom List")}>Chat Rooms</button>
      <button className="nav-button">BrainStorm Session History</button>
      <button className="nav-button">Settings</button>
    </div>
  );
}

export default NavigationBar;

/* eslint-disable react/prop-types */
import "../styles/NavigationBar.css"; 

function NavigationBar(props)
{
  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={() => props.handleCallBack("Direct Message List")}>Direct Message</button>
      <button className="nav-button" onClick={() => props.handleCallBack("ChatRoom List")}>Chat Rooms</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button>
    </div>
  );
}

export default NavigationBar;

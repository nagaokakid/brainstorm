/* eslint-disable react/prop-types */
import "../styles/NavigationBar.css";
import { useNavigate } from 'react-router-dom';

function NavigationBar(props)
{
  const navigate = useNavigate();

  // Log out the user
  function logOut()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/")
  }

  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={() => props.handleCallBack("ChatRoom List")}>Chat Rooms</button>
      <button className="nav-button" onClick={() => props.handleCallBack("Direct Message List")}>Direct Message</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button>
      <button className="nav-button" onClick={() => logOut()}>Logout</button>
    </div>
  );
}

export default NavigationBar;

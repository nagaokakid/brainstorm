/* eslint-disable react/prop-types */
import "../styles/NavigationBar.css";
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @param {*} callBackFunction The callback function to handle the chat type
 * @returns The navigation bar of the application
 */
function NavigationBar(props)
{
  const navigate = useNavigate();

  /**
   * Logs the user out of the application and remove the token from the local storage
   */
  function logOut()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  }

  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={() => props.callBackFunction("ChatRoom List")}>Chat Rooms</button>
      <button className="nav-button" onClick={() => props.callBackFunction("Direct Message List")}>Direct Message</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>BrainStorm Session History</button>
      <button className="nav-button" onClick={() => alert("Not available at the moment")}>Settings</button>
      <button className="nav-button" onClick={() => logOut()}>Logout</button>
    </div>
  );
}

export default NavigationBar;

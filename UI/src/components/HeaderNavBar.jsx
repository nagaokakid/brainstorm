import "../styles/HeaderNavBar.css";

/**
 * 
 * @returns The header navigation bar of the application
 */
function HeaderNavBar()
{
  return (
    <div className="header-nav-bar">
      {/* To-do: Add refresh function in the website name*/}
      <div className="user-name">BRAINSTORM</div>
      <div className="nav-icons">
        <button className="new-message-button" onClick={() => alert("Not available at the moment")}>New Message</button>
        <button className="notifications-icon" onClick={() => alert("Not available at the moment")}>Notifications</button>
        <button className="picture-button" onClick={() => alert("Not available at the moment")}>User Picture</button>
      </div>
    </div>
  );
}

export default HeaderNavBar;

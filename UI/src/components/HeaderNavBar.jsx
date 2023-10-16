import "../styles/HeaderNavBar.css";

function HeaderNavBar()
{
  return (
    <div className="header-nav-bar">
      {/* To-do: Add refresh function in the website name*/}
      <div className="user-name">BRAINSTORM</div>
      <div className="nav-icons">
        <button className="new-message-button">New Message</button>
        <button className="notifications-icon">Notifications</button>
        <button className="picture-button">User Picture</button>
      </div>
    </div>
  );
}

export default HeaderNavBar;

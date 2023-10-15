/* eslint-disable react/prop-types */
import "../styles/NavigationBar.css"; 

function NavigationBar(props)
{

  const handleCallBack = (type) => 
  {
    return () => {
      props.handleCallBack(type);
    };
  }

  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={handleCallBack(1)}>Chats</button>
      <button className="nav-button" onClick={handleCallBack(2)}>Chatrooms</button>
      <button className="nav-button">History</button>
      <button className="nav-button">Settings</button>
    </div>
  );
}

export default NavigationBar;

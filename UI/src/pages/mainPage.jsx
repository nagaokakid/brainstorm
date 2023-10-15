import "../styles/MainPage.css";
import HeaderNavBar from "../components/HeaderNavBar";
import NavigationBar from "../components/NavigationBar";
import ChatList from "../components/ChatList";
import ChatRoomWindow from "../components/chatRoomWindow";
//top element a grid, 4 colms
function MainPage()
{
  
  return (
    <div className="App">
      <div className="headerNavContainer">
        <HeaderNavBar userName={["userName"]} />
      </div>
      <div className="main-page-container">
        <NavigationBar />
        <ChatList chats={["Chat 1", "Chat 2", "Chat 3"]} />
        <ChatRoomWindow />
      </div>
    </div>
  );
}

export default MainPage;

import { createSignalRContext } from 'react-signalr/signalr';
import MessageWindow from './msgWindow';
import MessageInput from './msgInput';


function chatRoomWindow()
{
    const SignalRContext = createSignalRContext();
    const { token } = "";

    return (
        <SignalRContext.Provider
            connectEnabled = { token }
            accessTokenFactory = { () => token }
            dependencies = { [token] } //remove previous connection and create a new connection if changed
            url={ "https://localhost:3001/" }
        >
            <div className="ChatRoomWindowContainer">
                <MessageWindow context = {SignalRContext}/>
                <MessageInput />
            </div>
        </SignalRContext.Provider>
    );
}

export default chatRoomWindow;
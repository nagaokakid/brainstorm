import '../styles/CreateRoomCustomize.css'
import ApiService from '../services/ApiService';
import { useEffect, useState } from 'react';

interface CreateRoomCustomizeProps {
    style: { display: string },
}

function CreateRoomCustomize(props: CreateRoomCustomizeProps) {
    const [style, setStyle] = useState({} as { display: string }); // Set the style of the component
    const [errorMsg, setErrorMsg] = useState("" as string); // Set the error message
    const [errorDisplay, setErrorDisplay] = useState({ display: "none" }); // Set the error display

    /**
     * Prevent the child from being clicked
     * @param e 
     */
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    /**
     * Handle the create room button
     */
    async function handleCreateRoomButton() {
        setErrorDisplay({ display: "none" });
        const chatRoomName = (document.getElementById('chatRoomName') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (chatRoomName) {
            await ApiService.CreateChatRoom(chatRoomName, description);
            (document.getElementById('chatRoomName') as HTMLInputElement).value = '';
            (document.getElementById('description') as HTMLInputElement).value = '';
            setStyle({ display: "none" });
        } else {
            setErrorMsg("Please enter a chat room name");
            setErrorDisplay({ display: "block" });
        }
    }

    useEffect(() => {
        setStyle(props.style);
    }, [props.style]);

    return (
        <div className='OptionContainer' style={style} onClick={() => setStyle({ display: "none" })}>
            <div className='WindowSection' onClick={handleChildClick}>
                <div className='WindowSectionTitle'>
                    <h3 className='WindowSectionTitleText'>Create Chat Room</h3>
                </div>
                <div className='WindowSectionContent'>
                    <div className='WindowSectionContentText'>
                        <p className='WindowSectionContentText'>Create a chat room to chat with your friends!</p>
                    </div>
                    <input type="text" id='chatRoomName' placeholder='Chat Room Name' />
                    <input type="text" id='description' placeholder='Description' />
                    <button className='submitButton' onClick={() => handleCreateRoomButton()}>Create</button>
                </div>
                <h5 className='ErrorMsg' style={errorDisplay}>{errorMsg}</h5>
            </div>
        </div>
    );
}

export default CreateRoomCustomize;

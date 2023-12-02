import { useEffect, useState } from 'react';
import { DisplayTypes, ErrorMessages } from '../models/EnumObjects';
import ApiService from '../services/ApiService';
import '../styles/CreateRoomCustomize.css';

/*
    *  CreateRoomCustomize.tsx 
    * -------------------------
    *  This component is the create room customize of the chat page.
    *  It contains the create room form.
    *  -----------------------------------------------------------------------
    * Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 1.0
*/

interface CreateRoomCustomizeProps {
    style: { display: DisplayTypes },
    render: React.Dispatch<React.SetStateAction<boolean>>,
}

function CreateRoomCustomize(props: CreateRoomCustomizeProps) {
    const [style, setStyle] = useState({} as { display: DisplayTypes }); // Set the style of the component
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty); // Set the error message
    const [errorDisplay, setErrorDisplay] = useState({ display: DisplayTypes.None }); // Set the error display

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
        setErrorDisplay({ display: DisplayTypes.None });
        const chatRoomName = (document.getElementById('chatRoomName') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (chatRoomName) {
            await ApiService.CreateChatRoom(chatRoomName, description);
            (document.getElementById('chatRoomName') as HTMLInputElement).value = '';
            (document.getElementById('description') as HTMLInputElement).value = '';
            setStyle({ display: DisplayTypes.None });
            props.render(prev => !prev);
        } else {
            setErrorMsg(ErrorMessages.FormIncomplete);
            setErrorDisplay({ display: DisplayTypes.Block });
        }
    }

    useEffect(() => {
        setStyle(props.style);
    }, [props.style]);

    return (
        <div className='OptionContainer' style={style} onClick={() => setStyle({ display: DisplayTypes.None })}>
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
                    <div>

                        <button className='CancelButton' onClick={() => {
                            (document.getElementById("chatRoomName") as HTMLInputElement).value = "";
                            (document.getElementById("description") as HTMLInputElement).value = "";
                            setStyle({ display: DisplayTypes.None })
                        }
                        }>Cancel</button>
                        <button className='SubmitButton' onClick={() => handleCreateRoomButton()}>Create</button>
                    </div>
                </div>
                <h5 className='ErrorMsg' style={errorDisplay}>{errorMsg}</h5>
            </div>
        </div>
    );
}

export default CreateRoomCustomize;

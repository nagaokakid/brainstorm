import { MDBInput } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useEffect, useState } from 'react';
import { DisplayTypes, ErrorMessages } from '../models/EnumObjects';
import ApiService from '../services/ApiService';
import '../styles/CreateRoomCustomize.css';

interface CreateRoomCustomizeProps {
    style: { display: DisplayTypes },
    render: React.Dispatch<React.SetStateAction<boolean>>,
}

/**
*  CreateRoomCustomize.tsx 
* -------------------------
*  This component is the create room customize of the chat page.
*  It contains the create room form.
*  -----------------------------------------------------------------------
* Authors:  Mr. Yee Tsung (Jackson) Kao & Mr. Roland Fehr
*/
function CreateRoomCustomize(props: CreateRoomCustomizeProps) {
    const [chatRoomInfo, setChatRoomInfo] = useState({} as { chatRoomName: string, description: string }); // Set the chat room info
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
        const button = document.getElementById('SubmitButton') as HTMLButtonElement;

        if (chatRoomInfo.chatRoomName !== '' && chatRoomInfo.description !== '') {
            button.disabled = true; // Disable the button to prevent multiple clicks
            await ApiService.CreateChatRoom(chatRoomInfo.chatRoomName, chatRoomInfo.description);
            handleCancelButton();
        } else {
            setErrorMsg(ErrorMessages.FormIncomplete);
            setErrorDisplay({ display: DisplayTypes.Block });
        }
    }

    /**
     * Handle the cancel button
     */
    function handleCancelButton() {
        setChatRoomInfo({ chatRoomName: '', description: '' });
        (document.getElementById('CreateChatRoomForm') as HTMLFormElement).reset();
        setStyle({ display: DisplayTypes.None });
        props.render(prev => !prev);
    }

    /**
     * Handle the changed event
     * @param e 
     */
    function handleChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setChatRoomInfo(prev => ({ ...prev, [id]: value }));
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
                    <form id='CreateChatRoomForm'>
                        <MDBInput wrapperClass='mb-4' label='Chat Room Name' id='chatRoomName' type='text' autoComplete='off' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Description' id='description' type='text' autoComplete='off' onChange={handleChanged} />
                    </form>
                    <div>
                        <button className='CancelButton' onClick={handleCancelButton}>Cancel</button>
                        <button className='SubmitButton' id='SubmitButton' onClick={handleCreateRoomButton}>Create</button>
                    </div>
                </div>
                <h5 className='ErrorMsg' style={errorDisplay}>{errorMsg}</h5>
            </div>
        </div>
    );
}

export default CreateRoomCustomize;

import {
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayTypes, ErrorMessages } from '../models/EnumObjects';
import { chatRoomObject, directMessageObject } from '../models/TypesDefine';
import ApiService from '../services/ApiService';
import UserInfo from '../services/UserInfo';
import '../styles/GuestForm.css';

/**
 * GuestForm.tsx
 * -------------------------
 * This is the Guest form component.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
*/
function GuestForm() {
    const navigate = useNavigate()
    const [input, setInput] = useState({ ChatRoomCode: '' }) // This handle the state of the input
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty) // This store the error message
    const [errorDisplay, setErrorDisplay] = useState(DisplayTypes.None) // This handle the error message display

    /**
     * This will keep track the input and update the state
     * @param value
     */
    function handleChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const code = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: code } });
    }

    /**
     * This will handle the enter key press
     * @param value
     */
    function handleKey(value: React.KeyboardEvent<HTMLInputElement>) {
        if (value.key === 'Enter' || value.key === 'NumpadEnter') {
            handleGuestJoin();
        }
    }

    /**
     * This will verify the input and handle the request to the server
     */
    async function handleGuestJoin() {
        setErrorDisplay(DisplayTypes.None)
        
        if (input.ChatRoomCode) {
            const button = document.getElementById('join') as HTMLButtonElement;
            button.disabled = true; // Disable the button to prevent spamming

            // Check if the code is valid
            ApiService.IsJoinCodeValid(input.ChatRoomCode).then((response) => {
                if (response) {
                    // Create a temp user to store the information
                    const tempUser = {
                        userInfo: {
                            userId: "0",
                            firstName: "Guest",
                            lastName: "",
                            isGuest: true,
                            firstRoom: input.ChatRoomCode,
                        },
                        token: "",
                        chatRooms: [] as chatRoomObject[],
                        directMessages: [] as directMessageObject[],
                    }
                    UserInfo.setCurrentUser(tempUser);
                    UserInfo.updateUser(true);
                    navigate('/main');
                } else {
                    button.disabled = false;
                    setErrorMsg(ErrorMessages.InvalidCode);
                    setErrorDisplay(DisplayTypes.Block)
                }
            });
        } else {
            setErrorMsg(ErrorMessages.FormIncomplete);
            setErrorDisplay(DisplayTypes.Block);
        }
    }

    return (
        <div className='GuestCodeContainer'>
            <MDBInput wrapperClass='mb-4' label='Chat room Code' id='ChatRoomCode' type='text' autoComplete='off' onChange={handleChange} onKeyDown={handleKey} />
            <MDBBtn className="mb-4 w-100" id='join' onClick={handleGuestJoin}>Join Chat Room</MDBBtn>
            <h5 className='ErrorMsg' style={{ display: errorDisplay }}>{errorMsg}</h5>
        </div>
    );
}

export default GuestForm;
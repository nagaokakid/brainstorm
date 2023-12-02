import {
    MDBBtn
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayTypes, ErrorMessages } from '../models/EnumObjects';
import { chatRoomObject, directMessageObject } from '../models/TypesDefine';
import ApiService from '../services/ApiService';
import UserInfo from '../services/UserInfo';
import '../styles/GuestForm.css';

function GuestForm() {
    const navigate = useNavigate()
    const [input, setInput] = useState({ code: '' }) // This handle the state of the input
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
     * This will verify the input and handle the request to the server
     */
    async function RequestHandle() {
        setErrorDisplay(DisplayTypes.None)
        const button = document.getElementById('join') as HTMLButtonElement;

        if (input.code) {
            button.disabled = true; // Disable the button to prevent spamming
            
            ApiService.IsJoinCodeValid(input.code).then((response) => {
                if (response) {
                    const tempUser = {
                        userInfo: {
                            userId: "0",
                            firstName: "Guest",
                            lastName: "",
                            isGuest: true,
                            firstRoom: input.code,
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
            <input className='ChatRoomCode' id='ChatRoomCode' placeholder='Chat Room Code' type="text" onChange={handleChange} />
            <MDBBtn className="mb-4 w-100" id='join' onClick={() => RequestHandle()}>Join Chat Room</MDBBtn>
            <h5 className='ErrorMsg' style={{ display: errorDisplay }}>{errorMsg}</h5>
        </div>
    );
}

export default GuestForm;
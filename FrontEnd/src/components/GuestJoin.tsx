import '../styles/GuestJoin.css';
import ApiService from '../services/ApiService';
import UserInfo from '../services/UserInfo';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
    MDBInput,
    MDBBtn
} from 'mdb-react-ui-kit'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function GuestJoin() {

    const navigate = useNavigate()
    const [input, setInput] = useState({ code: '' })

    /**
     * This will keep track the input and update the state
     * @param value This will handle the change of the input
     */
    function handleChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const code = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: code } });
    }

    //This will verify the input and handle the request to the server
    async function RequestHandle() {
        const button = document.getElementById('join') as HTMLButtonElement;
        const code = input.code;

        if (code) {
            button.disabled = true;
            ApiService.IsJoinCodeValid(code).then((response) => {
                if (response) {
                    UserInfo.loginRegisterResponse =
                    {
                        userInfo: {
                            userId: "0",
                            firstName: "Guest",
                            lastName: "",
                            isGuest: true,
                            firstRoom: code
                        },
                        token: "",
                        chatRooms: [],
                        directMessages: []
                    }
                    UserInfo.setupUser();
                    navigate('/main')
                }
                else {
                    button.disabled = false;
                    alert("Invalid Code")
                }
            });
        } else {
            alert("Please complete the form");
        }
    }

    return (
        <div className='GuestCodeContainer'>
            <MDBInput wrapperClass='mb-4' label='Chat Room Code' id='code' type='text' onChange={handleChange} />
            <MDBBtn className="mb-4 w-100" id='join' onClick={() => RequestHandle()}>Join Chat Room</MDBBtn>
        </div>
    );
}

export default GuestJoin;
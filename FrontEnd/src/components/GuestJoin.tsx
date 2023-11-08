import '../styles/GuestJoin.css';
import ApiService from '../services/ApiService';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
    MDBInput,
    MDBBtn
} from 'mdb-react-ui-kit'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserInfo from '../services/UserInfo';

function GuestJoin() {

    const navigate = useNavigate()

    const [input, setInput] = useState({ code: '' })

    function handleChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const code = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: code } });
    }

    //This will verify the input and handle the request to the server
    async function RequestHandle() {
        const button = document.getElementById('join') as HTMLButtonElement;

        // Create an Object of the apiService
        const apiService = ApiService
        const code = input.code;

        if (code) {
            button.disabled = true;
            apiService.IsJoinCodeValid(code).then((response) => {
                if (response) {
                    UserInfo.loginRegisterResponse =
                    {
                        userInfo: {
                            userId: "00000000-0000-0000-0000-000000000000",
                            firstName: "Guest",
                            lastName: "",
                            isGuest: true,
                            firstRoom: code
                        },
                        token: "",
                        chatRooms: [],
                        directMessages: []
                    }
                    navigate('/main')
                }
                else {
                    button.disabled = false;
                    alert("Invalid Code")
                }
            });
        }
        else {
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
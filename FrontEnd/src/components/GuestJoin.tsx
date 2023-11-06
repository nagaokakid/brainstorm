import '../styles/GuestJoin.css';
import ApiService from '../services/ApiService';
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
            apiService.GuestJoin(code).then((response) => {
                button.disabled = false;
                if (response) {
                    navigate('/mainPage')
                }
                else {
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
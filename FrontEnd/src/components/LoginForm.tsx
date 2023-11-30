import '../styles/LoginForm.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
    MDBContainer,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBBtn,
    MDBInput
} from 'mdb-react-ui-kit'
import ApiService from '../services/ApiService';
import { loginObject } from '../models/TypesDefine';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogRes() {
    const navigate = useNavigate();
    const [justifyActive, setJustifyActive] = useState('tab1'); // Store the state of the tabs
    const [input, setInput] = useState({} as loginObject); // This handle the state of the inputs; Username, Password, Re-Password, First Name, Last Name
    const [errorMsg, setErrorMsg] = useState('' as string); // This store the error message
    const [errorDisplay, setErrorDisplay] = useState('none' as string); // This handle the error message display

    // This will handle the tabs and change the state
    function handleJustifyClick(value: string) {
        if (value === justifyActive) { // if the tab is already active, do nothing
            return;
        }

        setInput({} as loginObject); // Reset the input state
        setJustifyActive(value); // if the tab is not active, change the state
        setErrorDisplay('none'); // Hide the error message
    }

    /**
     * This will keep track of the inputs and update the state
     * @param value
     */
    function handleChanged(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: info } });
    }

    /**
     * This will handle the enter key press
     * @param value
     */
    function handleKey(value: React.KeyboardEvent<HTMLInputElement>) {
        if (value.code === "Enter" || value.code === "NumpadEnter") { // Detect if the key pressed is the enter key or the numpad enter key
            if (justifyActive === 'tab1') {
                handleLogin();
            } else {
                handleRegister();
            }
        }
    }

    /**
     * This will handle the login request
     */
    function handleLogin() {
        setErrorDisplay('none'); // Hide the error message
        const button = (document.getElementById('login') as HTMLButtonElement); // Get the button element

        if (!input.Username || !input.Password) { // Check if the input is empty
            setErrorMsg('Please complete the form'); // Apply the correct error message
            setErrorDisplay('block'); // Display the error message
        } else {
            button.disabled = true; // Disable the button

            ApiService.Login(input).then((resp) => {
                button.disabled = false; // Enable the button

                if (resp) { // login success
                    navigate('/main');
                } else if (resp === false) {
                    setErrorMsg('Account does not exist'); // Apply the correct error message
                    setErrorDisplay('block'); // Display the error message
                } else {
                    setErrorMsg('Failed to login'); // Apply the correct error message
                    setErrorDisplay('block'); // Display the error message
                }
            });
        }
    }

    /**
     * This will handle the register request
     */
    function handleRegister() {
        setErrorDisplay('none'); // Hide the error message
        const button = (document.getElementById('register') as HTMLButtonElement); // Get the button element

        if (!input.Username || !input.Password || !input.RePassword || !input.FirstName || !input.LastName) { // Check if the input is empty
            setErrorMsg('Please complete the form'); // Apply the correct error message
            setErrorDisplay('block'); // Display the error message
        } else if (input.Password != input.RePassword) {
            setErrorMsg('Passwords do not match'); // Apply the correct error message
            setErrorDisplay('block'); // Display the error message
        } else {
            button.disabled = true; // Disable the button

            ApiService.Register(input).then((resp) => {
                button.disabled = false; // Enable the button

                if (resp) { // register success
                    navigate('/main');
                } else if (resp === false) {
                    setErrorMsg('Duplicated account'); // Apply the correct error message
                    setErrorDisplay('block'); // Display the error message
                } else {
                    setErrorMsg('Failed to create account'); // Apply the correct error message
                    setErrorDisplay('block'); // Display the error message
                }
            });
        }
    }

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column">
            <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            <MDBTabsContent>
                <MDBTabsPane show={justifyActive === 'tab1'}>
                    <h3 className='SignInTitle'>Sign In:</h3>
                    <MDBInput wrapperClass='mb-4' label='Username' id='Username' type='text' onChange={handleChanged} />
                    <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' onChange={handleChanged} onKeyDown={handleKey} />
                    <MDBBtn className="mb-4 w-100" id='login' onClick={() => handleLogin()}>Sign in</MDBBtn>
                </MDBTabsPane>
                <MDBTabsPane show={justifyActive === 'tab2'}>
                    <h3 className='RegisterTitle'>Create Account:</h3>
                    <MDBInput wrapperClass='mb-4' label='Username' id='Username' type='text' onChange={handleChanged} />
                    <MDBInput wrapperClass='mb-4' label='First Name' id='FirstName' type='text' onChange={handleChanged} />
                    <MDBInput wrapperClass='mb-4' label='Last Name' id='LastName' type='text' onChange={handleChanged} />
                    <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' onChange={handleChanged} />
                    <MDBInput wrapperClass='mb-4' label='Re-Password' id='RePassword' type='password' onChange={handleChanged} onKeyDown={handleKey} />
                    <MDBBtn className="mb-4 w-100" id='register' onClick={() => handleRegister()}>Sign up</MDBBtn>
                </MDBTabsPane>
                <h5 className='ErrorMsg' style={{ display: errorDisplay }}>{errorMsg}</h5>
            </MDBTabsContent>
        </MDBContainer>
    )
}

export default LogRes
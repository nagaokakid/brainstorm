import {
    MDBBtn,
    MDBContainer,
    MDBInput,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayTypes, ErrorMessages, KeyDown, TabTypes } from '../models/EnumObjects';
import { loginObject } from '../models/TypesDefine';
import ApiService from '../services/ApiService';
import '../styles/LoginForm.css';

/**
 * LoginForm.tsx
 * -------------------------
 * This is the login form component.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
*/
function LoginForm() {
    const navigate = useNavigate();
    const [justifyActive, setJustifyActive] = useState(TabTypes.LoginTab); // Store the state of the tabs
    const [input, setInput] = useState({} as loginObject); // This handle the state of the inputs; Username, Password, Re-Password, First Name, Last Name
    const [errorMsg, setErrorMsg] = useState(ErrorMessages.Empty); // This store the error message
    const [errorDisplay, setErrorDisplay] = useState(DisplayTypes.None); // This handle the error message display

    /**
     * This will handle the tab click
     * @param value The tab that is clicked
     */
    function handleJustifyClick(value: TabTypes) {
        if (value === justifyActive) { // If the tab is already active, do nothing
            return;
        }

        // Clear the input form
        (document.getElementById('LoginForm') as HTMLFormElement).reset();
        (document.getElementById('RegisterForm') as HTMLFormElement).reset();

        // Clear the input state
        Object.keys(input).forEach((key) => {
            setInput((prev: typeof input) => { return { ...prev, [key]: '' } });
        });
        setJustifyActive(value); // Switch the tab
        setErrorDisplay(DisplayTypes.None); // Hide the error message
    }

    /**
     * This will keep track of the inputs and update the state
     * @param value
     */
    function handleInputChange(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: info } }); // Update the state
    }

    /**
     * This will handle the enter key press
     * @param value
     */
    function handleKey(value: React.KeyboardEvent<HTMLInputElement>) {
        if (value.code === KeyDown.Enter || value.code === KeyDown.NumpadEnter) { // Detect if the key pressed is the enter key or the numpad enter key
            if (justifyActive === TabTypes.LoginTab) { //Based on the tab, call the correct function
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
        setErrorDisplay(DisplayTypes.None); // Hide the error message

        if (!input.username || !input.password) { // Check if the input is empty
            setErrorMsg(ErrorMessages.FormIncomplete);
            setErrorDisplay(DisplayTypes.Block);
        } else {
            const button = (document.getElementById('login') as HTMLButtonElement); // Get the button element
            button.disabled = true; // Disable the button to prevent multiple request

            ApiService.Login(input).then((resp) => {
                button.disabled = false; // Enable the button

                if (resp) { // login success
                    navigate('/main');
                    return;
                } else if (resp === false) {
                    setErrorMsg(ErrorMessages.AccountNotFound);
                } else { // Only when the server is down
                    setErrorMsg(ErrorMessages.FailedToLogin);
                }

                setErrorDisplay(DisplayTypes.Block); // Display the error message
            });
        }
    }

    /**
     * This will handle the register request
     */
    function handleRegister() {
        setErrorDisplay(DisplayTypes.None); // Hide the error message

        if (!input.username || !input.password || !input.rePassword || !input.firstName || !input.lastName) { // Check if the input is empty
            setErrorMsg(ErrorMessages.FormIncomplete);
        } else if (input.password != input.rePassword) {
            setErrorMsg(ErrorMessages.PasswordNotMatch);
        } else {
            const button = (document.getElementById('register') as HTMLButtonElement); // Get the button element
            button.disabled = true; // Disable the button to prevent multiple request

            ApiService.Register(input).then((resp) => {
                button.disabled = false; // Enable the button

                if (resp) { // register success
                    navigate('/main');
                    return;
                } else if (resp === false) {
                    setErrorMsg(ErrorMessages.DuplicatedAccount); // Apply the correct error message
                } else {
                    setErrorMsg(ErrorMessages.FailedToRegister); // Apply the correct error message
                }
            });
        }

        setErrorDisplay(DisplayTypes.Block); // Display the error message
    }

    return (
        <MDBContainer className="p-3 my-5 d-flex flex-column">
            <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick(TabTypes.LoginTab)} active={justifyActive === TabTypes.LoginTab}>
                        Login
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleJustifyClick(TabTypes.RegisterTab)} active={justifyActive === TabTypes.RegisterTab}>
                        Register
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            <MDBTabsContent>
                <MDBTabsPane show={justifyActive === TabTypes.LoginTab}>
                    <h3 className='signin-title'>Sign In:</h3>
                    <form className='login-form' id='LoginForm'>
                        <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' autoComplete='off' onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' onChange={handleInputChange} onKeyDown={handleKey} />
                    </form>
                    <MDBBtn className="mb-4 w-100" id='login' onClick={handleLogin}>Sign in</MDBBtn>
                </MDBTabsPane>
                <MDBTabsPane show={justifyActive === TabTypes.RegisterTab}>
                    <h3 className='register-title'>Create Account:</h3>
                    <form className='register-form' id='RegisterForm'>
                        <MDBInput wrapperClass='mb-4' label='Username' id='username' type='text' autoComplete='off' onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='First name' id='firstName' type='text' autoComplete='off' onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Last name' id='lastName' type='text' autoComplete='off' onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='password' type='Password' onChange={handleInputChange} />
                        <MDBInput wrapperClass='mb-4' label='Repeat Password' id='rePassword' type='Password' onChange={handleInputChange} onKeyDown={handleKey} />
                    </form>
                    <MDBBtn className="mb-4 w-100" id='register' onClick={handleRegister}>Sign up</MDBBtn>
                </MDBTabsPane>
                <h5 className='error-msg' style={{ display: errorDisplay }}>{errorMsg}</h5>
            </MDBTabsContent>
        </MDBContainer>
    )
}

export default LoginForm
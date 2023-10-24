import '../styles/LogRes.css';
import ApiService from '../services/ApiService';
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @returns The login and register page of the application
 */
function LogRes() {
    const navigate = useNavigate();

    //  Store the state of the tabs
    const [justifyActive, setJustifyActive] = useState('tab1');

    // This handle the state of the inputs; Username, Password, Re-Password, First Name, Last Name
    const [input, setInput] = useState({
        Username: '',
        Password: '',
        RePassword: '',
        FirstName: '',
        LastName: ''
    });

    // This will handle the tabs and change the state
    function handleJustifyClick(value: string) {
        if (value === justifyActive) {
            return;
        }

        setJustifyActive(value);
    }

    // This will keep track of the inputs and update the state
    function handleChanged(value: React.ChangeEvent<HTMLInputElement>) {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev: typeof input) => { return { ...prev, [id]: info } });
    }

    /**
     * This will handle the login request
     */
    function handleLogin() {
        const apiService = ApiService;

        if (input.Username == "" || input.Password == "") {
            alert("Please complete the form");
        }
        else {
            apiService.Login(input.Username, input.Password).then((resp) => {
                // To-Do: Handle the response and create UI for different responses
                if (resp.ok) {
                    // if good
                    console.log("Navigating to main page");
                    navigate('/main');
                }
                else {
                    // if error
                    alert('Account does not exist');
                }
            });
        }
    }

    /**
     * This will handle the register request
     */
    function handleRegister() {
        const apiService = ApiService;

        if (input.Username == "" || input.Password == "" || input.RePassword == "" || input.FirstName == "" || input.LastName == "") {
            alert("Please complete the form");
        }
        else if (input.Password != input.RePassword) {
            alert("Passwords do not match");
        }
        else {
            apiService.Register(input.Username, input.Password, input.FirstName, input.LastName).then((resp) => {

                // To-Do: Handle the response and create UI for different responses
                if (resp.ok) {
                    console.log("Navigating to main page");
                    navigate('/main');

                } else {
                    alert('Unable to create account with the given information');
                }
            });
        }
    }

    return (
        <>
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
                        <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' onChange={handleChanged} />
                        <MDBBtn className="mb-4 w-100" onClick={() => handleLogin()}>Sign in</MDBBtn>
                    </MDBTabsPane>
                    <MDBTabsPane show={justifyActive === 'tab2'}>
                        <h3 className='RegisterTitle'>Create Account:</h3>
                        <MDBInput wrapperClass='mb-4' label='Username' id='Username' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='First Name' id='FirstName' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Last Name' id='LastName' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Re-Password' id='RePassword' type='password' onChange={handleChanged} />
                        <MDBBtn className="mb-4 w-100" onClick={() => handleRegister()}>Sign up</MDBBtn>
                    </MDBTabsPane>
                </MDBTabsContent>
            </MDBContainer>
        </>
    )
}

export default LogRes
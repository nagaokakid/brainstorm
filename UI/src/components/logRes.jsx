import { useState } from 'react';
import ApiService from '../services/apiService';
import '../styles/LogRes.css';
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
import { useNavigate } from 'react-router-dom';

function LogRes()
{
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
    const handleJustifyClick = (value) =>
    {
        if (value === justifyActive)
        {
            return;
        }

        setJustifyActive(value);
    }
    
    // This will keep track of the inputs and update the state
    const handleChanged = (value) =>
    {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev) => { return {...prev, [id]: info} });
    }
    
    // This will verify the form and handle the request to the server
    const RequestHandle = async (value) =>
    {
        // Create an Object of the apiService
        const apiService = new ApiService();
        if (value === 1)
        {
            if (input.Username == "" || input.Password == "")
            {
                alert("Please complete the form");
            }
            else
            {
                var response = await apiService.Login(input.Username, input.Password);

                // To-Do: Handle the response and create UI for different responses
                if (response.ok)
                {
                    // if good
                    console.log("Navigating to main page");
                    navigate('/main');
                }
                else
                {
                    // if error
                    alert('Something went wrong');
                }
            }
        }
        else if (value === 2)
        {
            if (input.Username == "" || input.Password == "" || input.RePassword == "" || input.FirstName == "" || input.LastName == "")
            {
                alert("Please complete the form");
            }
            else if (input.Password != input.RePassword)
            {
                alert("Passwords do not match");
            }
            else
            {
                const resp = await apiService.Register(input.Username, input.Password, input.FirstName, input.LastName);

                // To-Do: Handle the response and create UI for different responses
                if(resp.ok)
                {
                    console.log("Navigating to main page");
                    navigate('/main');

                } else
                {
                    alert('Something went wrong');
                }
            }
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
                        <MDBBtn className="mb-4 w-100" onClick={() => RequestHandle(1)}>Sign in</MDBBtn>
                    </MDBTabsPane>
                    <MDBTabsPane show={justifyActive === 'tab2'}>
                        <h3 className='RegisterTitle'>Create Account:</h3>
                        <MDBInput wrapperClass='mb-4' label='Username' id='Username' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='First Name' id='FirstName' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Last Name' id='LastName' type='text' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' onChange={handleChanged} />
                        <MDBInput wrapperClass='mb-4' label='Re-Password' id='RePassword' type='password' onChange={handleChanged} />
                        <MDBBtn className="mb-4 w-100" onClick={() => RequestHandle(2)}>Sign up</MDBBtn>
                    </MDBTabsPane>
                </MDBTabsContent>
            </MDBContainer>
        </>
    )
}

export default LogRes
import {Login, Register} from '../services/apiService'
import { useState } from 'react';
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

function LogRes()
{

    //This handle the state of the tabs; Login or Register
    const [justifyActive, setJustifyActive] = useState('tab1');
    const handleJustifyClick = (value) =>
    {
        if (value === justifyActive)
        {
            return;
        }
        setJustifyActive(value)
    }

    //This handle the state of the inputs; Username, Password, Re-Password, First Name, Last Name
    const [input, setInput] = useState({
        Username: '',
        Password: '',
        RePassword: '',
        FirstName: '',
        LastName: ''
    });
    //This will keep track of the inputs and update the state
    const handleChanged = (value) =>
    {
        const id = value.target.id;
        const info = value.target.value;
        setInput((prev) => { return {...prev, [id]: info} });
    }

    //This will verify the form and handle the request to the server
    const RequestHandle = async (value) =>
    {
        if (value === 1)
        {
            if (input.Username == "" || input.Password == "")
            {
                alert("Please complete the form");
                return;
            }
            else
            {
                var response = await Login(input.Username, input.Password)
                if(response.ok){
                    // if good
                    console.log('Success:', data);
                } else{
                    // if error
                    console.error('Error:', error);
                }
            }
        }
        else if (value === 2)
        {
            if (input.Username == "" || input.Password == "" || input.RePassword == "" || input.FirstName == "" || input.LastName == "")
            {
                alert("Please complete the form");
                return;
            }
            else if
            (input.Password != input.RePassword)
            {
                alert("Passwords do not match");
                return;
            }
            else
            {
                const resp = await Register(input.Username, input.Password, input.FirstName, input.LastName)
                if(resp.ok){
                    console.log('Success:', data);

                } else{
                    console.error('Error:', error);
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
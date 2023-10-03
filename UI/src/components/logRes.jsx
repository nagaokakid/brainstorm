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

    const [justifyActive, setJustifyActive] = useState('tab1');
    const handleJustifyClick = (value) =>
    {
        if (value === justifyActive)
        {
            return;
        }
        setJustifyActive(value)
    }

    const RequestHandle = (value) =>
    {
        const Email = document.getElementById('Email').value;
        const Id = document.getElementById('Id').value;
        const Password = document.getElementById('Password').value;
        const RePassword = document.getElementById('RePassword').value;
        if (value === 1)
        {
            if (Email, Password === "")
            {
                alert("Please complete the form");
                return;
            }
            else
            {
                fetch('',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email, Password }),
                }).then(response => response.json()).then(data =>
                    {
                        console.log('Success:', data);
                    }).catch((error) =>
                    {
                        console.error('Error:', error);
                    });
            }
        }
        else if (value === 2)
        {
            if (Email, Id, Password, RePassword === "")
            {
                alert("Please complete the form");
                return;
            }
            else if
            (Password !== RePassword)
            {
                alert("Password and Re-Password are not the same");
                return;
            }
            else
            {
                fetch('',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email, Id, Password}),
                }).then(response => response.json()).then(data =>
                    {
                        console.log('Success:', data);
                    }).catch((error) =>
                    {
                        console.error('Error:', error);
                    });
            }
        }
    }

    return (
        <>
            <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
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
                        <MDBInput wrapperClass='mb-4' label='Email address' id='Email' type='email' />
                        <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' />
                        <MDBBtn className="mb-4 w-100" onClick={() => RequestHandle(1)}>Sign in</MDBBtn>
                    </MDBTabsPane>
                    <MDBTabsPane show={justifyActive === 'tab2'}>
                        <h3 className='RegisterTitle'>Create Account:</h3>
                        <MDBInput wrapperClass='mb-4' label='Email address' id='Email' type='email' />
                        <MDBInput wrapperClass='mb-4' label='Username' id='Id' type='text' />
                        <MDBInput wrapperClass='mb-4' label='Password' id='Password' type='password' />
                        <MDBInput wrapperClass='mb-4' label='Re-Password' id='RePassword' type='password' />
                        <MDBBtn className="mb-4 w-100" onClick={() => RequestHandle(2)}>Sign up</MDBBtn>
                    </MDBTabsPane>
                </MDBTabsContent>
            </MDBContainer>
        </>
    )
}

export default LogRes
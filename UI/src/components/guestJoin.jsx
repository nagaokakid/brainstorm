/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate } from 'react-router-dom';
import '../styles/GuestJoin.css';
import ApiService from '../services/ApiService';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit'

function guestJoin()
{
  const navigate = useNavigate()
  //This will verify the input and handle the request to the server
  const RequestHandle = async () =>
  {
    // Create an Object of the apiService
    const apiService = new ApiService()
    const code = document.getElementById('code').value;
    if (code != "")
    {
      var response = await apiService.GuestJoin(code)
      
      if (response.ok)
      {
        navigate('/mainPage')
      }
      else
      {
        alert("Invalid Code")
      }
    }
    else
    {
      alert("Please complete the form");
    }
  }

  return (
    <div className='GuestCodeContainer'>
      <MDBInput wrapperClass='mb-4' label='Chat Room Code' id='code' type='text' />
      <MDBBtn className="mb-4 w-100" onClick={() => RequestHandle()}>Join Chat Room</MDBBtn>
    </div>
  );
}

export default guestJoin;
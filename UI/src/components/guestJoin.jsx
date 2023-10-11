import '../styles/guestJoin.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit'

function guestJoin()
{

  //This will verify the input and handle the request to the server
  const RequestHandle = () =>
  {
    const code = document.getElementById('code').value;
    if (code != "")
    {
      fetch('http://localhost:3001/api/GuestJoin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: code })
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "Success") {
            console.log(data);
          }
          else {
            alert(data.status);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    else
    {
      alert("Please complete the form");
      return;
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
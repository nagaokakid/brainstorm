import { useNavigate } from 'react-router-dom';
import '../styles/CreateBrainStormCustomize.css';

interface CreateBrainStormCustomizeProps {
    style: string;
}

function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {

    const Navigate = useNavigate();

    function handleCreateClick() {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (name === "" || description === "") {
            alert("Please fill in all the fields");
            return;
        } else {
            (document.getElementById('name') as HTMLInputElement).value = "";
            (document.getElementById('description') as HTMLInputElement).value = "";

            // Navigate("/BrainStorm")
        }
    }

    return (
        <div className='CreateBrainStormCustomizeWindow' style={{ display: props.style }}>
            <div className='BSinfoWindow'>
                <h1>Create Brain Storm</h1>
                <input type="text" id='name' placeholder='Name'/>
                <input type="text" id="description" placeholder='Description'/>
                <button onClick={handleCreateClick}>Create</button>
            </div>
        </div>
    );
}

export default CreateBrainStormCustomize;
import '../styles/CreateBrainStormCustomize.css';

interface CreateBrainStormCustomizeProps {
    style: string;
}

function CreateBrainStormCustomize(props: CreateBrainStormCustomizeProps) {

    function handleCreateClick() {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
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
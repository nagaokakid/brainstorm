import ApiService from '../services/ApiService';
import '../styles/CreateRoomCustomize.css'

interface CreateRoomCustomizeProps {
    callBackFunction: (e: string) => void;
    style: string;
}

/**
 * 
 * @param {*} callBackFunction The function to be called when an option is selected
 * @param {*} style The style of the component
 * @returns 
 */
function CreateRoomCustomize(props: CreateRoomCustomizeProps) {
    // Set the component to be hidden and pass back the selected option
    function handleOptionClick(e: string) {
        props.callBackFunction(e)
    }

    // Prevent the child from being clicked
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    async function handleCreateRoomButton() {
        const chatRoomName = (document.getElementById('chatRoomName') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (chatRoomName) {
            const apiService = ApiService;
            await apiService.CreateChatRoom(chatRoomName, description)
            handleOptionClick("none")
        }
        else {
            alert("Please enter a chat room name")
        }
    }

    return (
        <div className='OptionContainer' style={{ display: props.style }} onClick={() => handleOptionClick("none")}>
            <div className='WindowSection' onClick={handleChildClick}>
                <div className='WindowSectionTitle'>
                    <h3 className='WindowSectionTitleText'>Create Chat Room</h3>
                </div>
                <div className='WindowSectionContent'>
                    <div className='WindowSectionContentText'>
                        <p className='WindowSectionContentText'>Create a chat room to chat with your friends!</p>
                    </div>
                    <input type="text" id='chatRoomName' placeholder='Chat Room Name' />
                    <input type="text" id='description' placeholder='Description' />
                    <button className='submitButton' onClick={() => handleCreateRoomButton()}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoomCustomize;

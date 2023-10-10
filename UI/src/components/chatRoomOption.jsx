import '../styles/chatRoomOption.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import icon1 from '../assets/chat-bubble.png'

function chatRoomOption() {
    const buttunHandler = (selected) => { }
    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-primary" onClick={() => buttunHandler(1)}>
                <img className='btn-icon' src={icon1} alt="" />
                Create Chat Room
            </button>
            <button type="button" className="btn btn-primary" onClick={() => buttunHandler(2)}><a>456</a></button>
        </div>
    );
}

export default chatRoomOption;

import '../styles/chatRoomOption.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import icon1 from '../assets/chat-bubble.png'
import icon2 from '../assets/meeting.png'
import GuestJoin from './guestJoin'

function chatRoomOption(props) {
    const buttonHandler = (selected) => { }
    return (
        <div className='OptionContainer' style={ {display : props.style}}>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-primary" onClick={() => buttonHandler(1)}>
                    <img className='btn-icon' src={icon1} alt="" />
                    Create Chat Room
                </button>
                <button type="button" className="btn btn-primary" onClick={() => buttonHandler(2)}>
                    <img className='btn-icon' src={icon2} alt="" />
                    <GuestJoin />
                </button>
            </div>
        </div>
    );
}

export default chatRoomOption;

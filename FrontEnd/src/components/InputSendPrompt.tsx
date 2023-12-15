import '../styles/InputSendPrompt.css';
import addIdeaIcon from "../assets/addIdeasIcon.png"

interface InputSendPromptProps {
    sendFunction: (e: string) => void,
    input: boolean,
}

/**
 * InputSendPrompt.tsx 
 * -------------------------
 * This component is the input and send button of the brain storm page.
 * -----------------------------------------------------------------------
 * Author:  Mr. Yee Tsung (Jackson) Kao
 */
function InputSendPrompt(props: InputSendPromptProps) {

    /**
     * Send the message
     */
    function handleSendClick() {
        const input = document.querySelector('.InputSection') as HTMLInputElement;
        if (input.value === "") {
            return;
        }
        props.sendFunction(input.value);
        input.value = "";
    }

    /**
     * Send the message
     * @param e The key down event
     */
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            handleSendClick();
        }
    }

    return (
        <div className="input-send-container">
            <input className="input-section" type="text" placeholder="Enter Ideas here..." onKeyDown={handleKeyDown} disabled={props.input}></input>
            <button className="send-section" onClick={handleSendClick} disabled={props.input}><img className='AddIdeaIcon_CSS' src={addIdeaIcon} width={60}/></button>
        </div>
    );
}

export default InputSendPrompt;
import '../styles/InputSendPrompt.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
/*
    * InputSendPrompt.tsx 
    * -------------------------
    * This component is the input and send button of the brain storm page.
    * -----------------------------------------------------------------------
    * Author:  Mr. Yee Tsung (Jackson) Kao 
    * Date Created:  01/12/2023
    * Last Modified: 01/12/2023
    * Version: 1.0
*/
interface InputSendPromptProps {
    sendFunction: (e: string) => void,
    input: boolean,
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
        <div className="InputSendContainer">
            <input className="InputSection" type="text" placeholder="Enter Ideas here..." onKeyDown={handleKeyDown} disabled={props.input}></input>
            <button className="SendSection" onClick={handleSendClick} disabled={props.input}> <FontAwesomeIcon icon={faPlus} title="Add Idea" /> </button>
        </div>
    );
}



export default InputSendPrompt;
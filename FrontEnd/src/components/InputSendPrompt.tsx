import '../styles/InputSendPrompt.css';

interface InputSendPromptProps {
    sendFunction: (e: string) => void
}

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
            <input className="InputSection" type="text" placeholder="Enter Ideas here..." onKeyDown={handleKeyDown}></input>
            <button className="SendSection" onClick={handleSendClick}>Send</button>
        </div>
    );
}

export default InputSendPrompt;
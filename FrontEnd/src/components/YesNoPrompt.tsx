import '../styles/YesNoPrompt.css';

interface YesNoPromptProps {
    content: string,
    display: string,
    yesFunction: () => void,
    displayFunction: (e: string) => void,
}

function YesNoPrompt(props: YesNoPromptProps) {

    // Set the component to be hidden and pass back the selected option
    function handleOptionClick(e: string) {
        props.displayFunction(e);
    }

    // Prevent the child from being clicked
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    return (
        <div className="YNBGSection" style={{ display: props.display }} onClick={() => handleOptionClick("none")}>
            <div className="YNContentWindow" onClick={handleChildClick}>
                <p>{props.content}</p>
                <button onClick={props.yesFunction}>Yes</button>
                <button onClick={() => handleOptionClick("none")}>No</button>
            </div>
        </div>
    );
}

export default YesNoPrompt;
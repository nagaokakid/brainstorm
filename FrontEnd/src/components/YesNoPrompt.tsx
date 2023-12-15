import '../styles/YesNoPrompt.css';

interface YesNoPromptProps {
    display: string,
    yesFunction: () => void,
    displayFunction: (e: string) => void,
}

/**
 * YesNoPrompt.tsx 
 * -------------------------
 * This component is the yes no prompt.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr& Mr. Yee Tsung (Jackson) Kao
 */
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
        <div className="prompt-section-container" style={{ display: props.display }} onClick={() => handleOptionClick("none")}>
            <div className="prompt-window" onClick={handleChildClick}>
                <p className='leave-warning'>{"Leave Session?"}</p>
                <p className='warning-content' style={{ color: "red" }}>{"Warning: Users will not be able to rejoin this session."}</p>
                <div className='leave-button-container'>
                    <button className='no-btn' onClick={() => handleOptionClick("none")}>Cancel</button>
                    <button className='yes-btn' onClick={props.yesFunction}>Exit</button>
                </div>
            </div>
        </div>
    );
}

export default YesNoPrompt;
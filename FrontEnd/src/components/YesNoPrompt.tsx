import '../styles/YesNoPrompt.css';

/*
 * YesNoPrompt.tsx 
 * -------------------------
 * This component is the yes no prompt.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr& Mr. Yee Tsung (Jackson) Kao
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
*/
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
                <p className='Leave'>{props.content}</p>
                <div>
                    <button className='YesBtn' onClick={props.yesFunction}>Yes</button>
                    <button className='NoBtn' onClick={() => handleOptionClick("none")}>No</button>
                </div>
            </div>
        </div>
    );
}

export default YesNoPrompt;
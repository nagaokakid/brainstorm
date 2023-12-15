import '../../styles/VoteResult.css';
import Idea from "../../models/Idea";

interface prop {
    idea: Idea;
}

/**
 * VoteResult.tsx 
 * -------------------------
 * This component is the idea box of the voting page.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr & Mr. Yee Tsung (Jackson) Kao
 */
const VoteResult = ({ idea }: prop) => {
    return (
        <div className='idea-result-box'>
            <div className='idea-thought'>{idea.thought}</div>
            <div className='idea-button'>
                <div className='like'>Likes: {idea.likes}</div>
            </div>
        </div>
    );
};

export default VoteResult;

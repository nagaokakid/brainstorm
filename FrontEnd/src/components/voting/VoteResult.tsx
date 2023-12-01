import '../../styles/VoteResult.css';
import Idea from "../../models/Idea";

/*
 * VoteResult.tsx 
 * -------------------------
 * This component is the idea box of the voting page.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr & Mr. Yee Tsung (Jackson) Kao
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
*/

interface prop {
    idea: Idea;
}

const VoteResult = ({ idea }: prop) => {
    return (
        <div className='IdeaResultBox'>
            <div className='IdeaThought'>{idea.thought}</div>
            <div className='IdeaButton'>
                <div className='Like'>Likes: {idea.likes}</div>
            </div>
        </div>
    );
};

export default VoteResult;

import '../../styles/VoteIdea.css'
import Idea from '../../models/Idea'
import UserInfo from '../../services/UserInfo'
import likeIcon from '../../assets/like.png'
import dislikeIcon from '../../assets/dislike.png'

/*
 * VoteIdea.tsx 
 * -------------------------
 * This component is the idea box of the voting page.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr & Mr. Yee Tsung (Jackson) Kao
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
 */

interface props {
    idea: Idea
}

const VoteIdea = ({ idea }: props) => {
    function clickedLike() {
        UserInfo.addLikes(idea.id)
    }

    function clickedDislike() {
        UserInfo.addDislikes(idea.id)
    }

    return (
        <div className='IdeaBox'>
            <div className='IdeaThought'>{idea.thought}</div>
            <div className='IdeaButton'>
                <button className='LikeIdea' onClick={clickedLike}>
                    <img src={likeIcon} height={20}/>
                </button>
                <button className='DislikeIdea' onClick={clickedDislike}>
                    <img src={dislikeIcon} height={20}/>
                </button>
            </div>
        </div>
    )
}

export default VoteIdea
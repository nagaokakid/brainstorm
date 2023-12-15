import '../../styles/VoteIdea.css'
import Idea from '../../models/Idea'
import UserInfo from '../../services/UserInfo'
import likeIcon from '../../assets/like.png'
import dislikeIcon from '../../assets/dislike.png'

interface props {
    idea: Idea
}

/**
 * VoteIdea.tsx 
 * -------------------------
 * This component is the idea box of the voting page.
 * -----------------------------------------------------------------------
 * Authors:  Mr. Roland Fehr & Mr. Yee Tsung (Jackson) Kao
 */
const VoteIdea = ({ idea }: props) => {
    function clickedLike() {
        UserInfo.addLikes(idea.id)
    }

    function clickedDislike() {
        UserInfo.addDislikes(idea.id)
    }

    return (
        <div className='idea-box'>
            <div className='idea-thought'>{idea.thought}</div>
            <div className='idea-button'>
                <button className='like-idea' onClick={clickedLike}>
                    <img src={likeIcon} height={20} />
                </button>
                <button className='dislike-idea' onClick={clickedDislike}>
                    <img src={dislikeIcon} height={20} />
                </button>
            </div>
        </div>
    )
}

export default VoteIdea
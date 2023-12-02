import { useState, useEffect } from 'react';
import UserInfo from '../services/UserInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/RecycleBin.css';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';


interface RecycleBinProps {
    content: string[];
    style: { display: string };
}

function RecycleBin(props: RecycleBinProps) {
    const [style, setStyle] = useState(props.style); // Set the style of the component
    const [restoredIdea, setRestoreIdea] = useState([] as string[])

    function handleRestoreIdeaButton(position: number, idea: string) {
        setRestoreIdea(current=> [...current, idea]);
        UserInfo.addNewIdea(idea);
        props.content.splice(position, 1);
    }

    useEffect(() => {
        setStyle(props.style);
      }, [props.style]);

      
  return (
    <div className="RecycleBin" style={style}>
        <h1>Deleted Ideas:  </h1>
        {props.content.map((idea, index) => {
                return (
                    <div className="DeletedItem" key={index}>
                        {idea}
                        <button className='RestoreButton' onClick={() => handleRestoreIdeaButton(index, idea)}>
                            <FontAwesomeIcon icon={faUndo} title="Restore idea" />
                        </button>
                    </div>
                );
            })}

        <button className="CloseBtn" id="close" onClick={() => setStyle({ display: "none" })}>
        <FontAwesomeIcon icon={faTimes} title="Close" />
        </button>   
        
    </div>
  )
}

export default RecycleBin;
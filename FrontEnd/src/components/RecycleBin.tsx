import { useState, useEffect } from "react";
import UserInfo from "../services/UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/RecycleBin.css";
import { faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { DeletedItemProps } from "../pages/BrainStormPage";

interface RecycleBinProps {
  deletedIdeaList: DeletedItemProps[];
  localIdeaList: string[];
  style: { display: string };
  restoreContentFunction: (ideasList: string[]) => void;
  updateDeleteIdeaListFunction: (items: DeletedItemProps[]) => void;
}

function RecycleBin(props: RecycleBinProps) {
  const [style, setStyle] = useState(props.style); // Set the style of the component
  const disbaleRestoreBtn =
    props.deletedIdeaList.length === 0 ||
    !props.deletedIdeaList.some((item) => item.isChecked === true);

  function handleRestoreIdeaButton(position: number, idea: string) {
    props.restoreContentFunction([...props.localIdeaList, idea]);
    UserInfo.addNewIdea(idea);
    props.deletedIdeaList.splice(position, 1);
  }

  function handleCheckboxChange(idea: string) {
    const updatedList = props.deletedIdeaList.map((item) =>
      item.idea === idea ? { ...item, isChecked: !item.isChecked } : item
    );
    props.updateDeleteIdeaListFunction(updatedList);
  }

  function handleRestoreSelectedIdeas(items: DeletedItemProps[]) {
    const selectedIdeas = items
      .filter((item) => item.isChecked)
      .map((i) => i.idea);
    props.restoreContentFunction([...props.localIdeaList, ...selectedIdeas]);
    selectedIdeas.map((idea) => UserInfo.addNewIdea(idea));
    props.updateDeleteIdeaListFunction(items.filter((item) => !item.isChecked));
  }

  useEffect(() => {
    setStyle(props.style);
  }, [props.style]);

  return (
    <div className="RecycleBin" style={style}>
      <div className="RecycleBinPopup">
        <div className="PopupHeader">
          <h1>Deleted Ideas</h1>
          <button
            className="CloseBtn"
            id="close"
            onClick={() => setStyle({ display: "none" })}
          >
            <FontAwesomeIcon icon={faTimes} title="Close" />
          </button>
        </div>
        {props.deletedIdeaList.length > 0 ? (
          <div className="DeletedItemsWrapper">
            <div className="DeletedItems">
              {props.deletedIdeaList.map((item, index) => {
                return (
                  <div className="DeletedItem" key={index}>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleCheckboxChange(item.idea)}
                    />
                    <p>{item.idea}</p>
                    <button
                      className="RestoreButton"
                      onClick={() => handleRestoreIdeaButton(index, item.idea)}
                    >
                      <FontAwesomeIcon icon={faUndo} title="Restore idea" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="RestoreAllBtn"
              disabled={disbaleRestoreBtn}
              onClick={() => {
                handleRestoreSelectedIdeas(props.deletedIdeaList);
              }}
            >
              Restore
            </button>
          </div>
        ) : (
          <h2>No Deleted Items</h2>
        )}
      </div>
    </div>
  );
}

export default RecycleBin;

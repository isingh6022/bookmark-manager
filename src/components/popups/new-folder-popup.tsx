import { PopupElementsRefCSS } from '@proj-const';
import { AppDispatchType, add, popup } from '@proj-state';
import { CreatedEvent, NewFolderPopup } from '@proj-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const NewFolderPopupComponent: React.FC<NewFolderPopup> = ({ parentChain, parentNode }) => {
  const [newName, setNewName] = useState('');
  const dispatch = useDispatch<AppDispatchType>();

  const closePopup = () => dispatch(popup(null));
  const createFolder = () => {
    const newNode: CreatedEvent['payload'] = {
      id: '', // placeholder
      title: newName,
      index: 0,
      parentId: parentNode.id
    };
    dispatch(add(newNode));
    closePopup();
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') createFolder();
    if (e.key === 'Escape') closePopup();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  parentChain = [...parentChain];
  parentChain.pop();

  return (
    <div id={PopupElementsRefCSS.NEW_FOL_CONT_ID}>
      <div>
        <p>Creating a new folder within "{parentNode.title}" </p>
        <p>
          <span>Location</span>: {parentChain.map((node) => node.title).join(' > ')}
        </p>
      </div>
      <div>
        <input type="text" {...{ onKeyDown, onChange }} autoFocus />
      </div>
      <div>
        <button onClick={createFolder}>Create</button>
        <button onClick={closePopup}>Cancel</button>
      </div>
    </div>
  );
};

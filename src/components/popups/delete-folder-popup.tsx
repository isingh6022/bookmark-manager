import { AppDispatchType, popup, rmv } from '@proj-state';
import { DeleteFolderPopup } from '@proj-types';
import { useDispatch } from 'react-redux';

export const DeleteFolderPopupComponent: React.FC<DeleteFolderPopup> = ({
  node,
  parentChain,
  folderStats
}) => {
  const dispatch = useDispatch<AppDispatchType>();

  parentChain = [...parentChain];
  parentChain.pop();

  const close = () => {
    dispatch(popup(null));
  };
  const deleteFn = () => {
    dispatch(rmv(node.id));
    close();
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>: {node.title}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>: {parentChain.map((parent) => parent.title).join(' > ')}</td>
          </tr>
          <tr>
            <td>Contents</td>
            <td>
              : {folderStats.nFol} Folders and {folderStats.nBkm} Bookmarks
            </td>
          </tr>
        </tbody>
      </table>
      <div>Are you sure you want to delete this folder?</div>

      <button onClick={deleteFn}>Delete</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

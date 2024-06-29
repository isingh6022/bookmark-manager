import { useDispatch } from 'react-redux';
import { AppDispatchType, page, setCurrNode, showNode } from '@proj-state';
import { PopupElementsRefCSS } from '@proj-const';
import { NodeType, Pages, PropertiesPopup } from '@proj-types';
import { BkmIco } from '../middle/bookmark-page/node-bookmark-icon.js';
import { BsFolder } from '../project-icons.js';

export const PropertiesPopupComponent: React.FC<PropertiesPopup> = ({
  node,
  parentChain,
  folderStats
}) => {
  const dispatch = useDispatch<AppDispatchType>();
  const isBkm = node.type === NodeType.BKM;

  parentChain = [...parentChain];
  parentChain.pop();
  parentChain.reverse();

  return (
    <div>
      <h1>
        {isBkm ? <BkmIco url={node.url} /> : <BsFolder />}
        {node.title}
      </h1>
      <table>
        <tbody>
          <tr>
            <td>Date</td>
            <td>{new Date(node.dateAdded).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>{parentChain.map((parent) => parent.title).join(' > ')}</td>
          </tr>
          {isBkm ? (
            <tr>
              <td>url</td>
              <td>{node.url}</td>
            </tr>
          ) : (
            <tr>
              <td>Contents</td>
              <td>
                Folders :<BsFolder /> {folderStats.nFol} | Bookmarks: <BkmIco url={node.url} />{' '}
                {folderStats.nBkm}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={PopupElementsRefCSS.POPUP_BTN_CONT_ID}>
        <button
          onClick={() => {
            dispatch(setCurrNode(node.parentId));
            dispatch(page({ page: Pages.BKM_FOLDER, folder: node.parentId }));
          }}
        >
          Open Parent Folder
        </button>
        {/* <button
          onClick={() => {
            dispatch(showNode({ id: node.id, showInParent: true }));
          }}
        >
          Show in parent folder
        </button>
        <button
          onClick={() => {
            dispatch(showNode({ id: node.id, showInParent: false }));
          }}
        >
          Show in home folder
        </button> */}
      </div>
    </div>
  );
};

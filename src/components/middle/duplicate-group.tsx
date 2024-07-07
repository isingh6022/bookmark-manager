import { BookmarkTreeDataNode } from '@proj-types';
import { BkmIco } from './bookmark-page/node-bookmark-icon.js';
import { MinorElementsRefCSS } from '@proj-const';

type NodeAndParentChain = { node: BookmarkTreeDataNode; parentChain: BookmarkTreeDataNode[] };

const DuplicateNodeLink: React.FC<{ node: BookmarkTreeDataNode }> = ({ node }) => {
  return (
    <a href={node.url} className={MinorElementsRefCSS.DUP_NOD_LINK}>
      <BkmIco url={node.url || ''} />
      {node.title}
    </a>
  );
};

const DuplicateNodeParentChain: React.FC<{ parents: BookmarkTreeDataNode[] }> = ({ parents }) => {
  let parentChain: string = '';

  if (parents.length > 2) {
    parentChain = parents[parents.length - 2]!.title;
    for (let i = parents.length - 3; i > 0; i--) {
      parentChain += ' >> ' + parents[i]!.title;
    }
  }

  return <span className={MinorElementsRefCSS.DUP_NOD_PARENT_CHAIN}>{parentChain}</span>;
};

const DuplicateNode: React.FC<{
  nodeAndSel: [NodeAndParentChain, boolean];
  addRmvNode: (id: string, val: boolean) => void;
}> = ({ nodeAndSel, addRmvNode }) => {
  return (
    <div className={MinorElementsRefCSS.DUP_NOD}>
      <input
        type="checkbox"
        id={nodeAndSel[0].node.id}
        onChange={(e) => {
          addRmvNode(nodeAndSel[0].node.id, e.target.checked);
        }}
        checked={nodeAndSel[1]}
      />
      <DuplicateNodeParentChain parents={(nodeAndSel[0] as any).parentChain} /> ::
      <DuplicateNodeLink {...{ node: nodeAndSel[0].node }} />
    </div>
  );
};

const DuplicateGroup: React.FC<{
  nodesAndSel: [NodeAndParentChain, boolean][];
  addRmvNode: (id: string, val: boolean) => void;
}> = ({ nodesAndSel, addRmvNode }) => {
  return (
    <div className={MinorElementsRefCSS.DUP_NOD_GROUP}>
      {nodesAndSel.map((nodeAndSel) => (
        <DuplicateNode {...{ nodeAndSel, addRmvNode }} key={`dup-nod-${nodeAndSel[0].node.id}`} />
      ))}
    </div>
  );
};

export { DuplicateGroup };

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BookmarkTreeDataNode } from '@proj-types';
import { ComponentRefCSS, PageRefCSS } from '@proj-const';
import { AppDispatchType, rmv, getDuplicates } from '@proj-state';
import { FiRefreshCcw } from '../project-icons.js';
import { DuplicateGroup } from './duplicate-group.js';

type NodeAndParentChain = { node: BookmarkTreeDataNode; parentChain: BookmarkTreeDataNode[] };

export const DuplicatesPage: React.FC<any> = (props) => {
  const [nodeGroups, setNodeGroups] = useState([] as NodeAndParentChain[][]);
  const [currNodes, setCurrNodes] = useState([] as BookmarkTreeDataNode[]);
  const dispatch = useDispatch<AppDispatchType>();

  const [selectedNodes, setSelectedNodes] = useState(new Set<string>());

  const addRmvNode = (id: string, val: boolean) => {
    val ? selectedNodes.add(id) : selectedNodes.delete(id);

    setSelectedNodes(new Set<string>(selectedNodes));
  };
  const invertSel = () => {
    let newSel = new Set<string>();
    for (let ng of nodeGroups) {
      for (let nodeInfo of ng) {
        !selectedNodes.has(nodeInfo.node.id) && newSel.add(nodeInfo.node.id);
      }
    }
    setSelectedNodes(newSel);
  };
  const selectFirsts = () => {
    let newSel = new Set<string>();
    for (let ng of nodeGroups) {
      newSel.add(ng[0]!.node.id);
    }
    setSelectedNodes(newSel);
  };
  const selectLasts = () => {
    let newSel = new Set<string>();
    for (let ng of nodeGroups) {
      newSel.add(ng[ng.length - 1]!.node.id);
    }
    setSelectedNodes(newSel);
  };

  const loadDuplicates = () => {
    getDuplicates().then((nodes) => {
      let allNodes = [] as BookmarkTreeDataNode[],
        changed = false;
      for (let nodeGroup of nodes)
        allNodes.push(...nodeGroup.map((nodeAndParent) => nodeAndParent.node));

      allNodes.sort((a, b) => {
        if (a.title < b.title) return 1;
        else return a.title === b.title ? 0 : -1;
      });
      changed = allNodes.length !== currNodes.length;
      if (!changed)
        for (let i = 0; i < allNodes.length; i++) {
          if (!currNodes[i] || allNodes[i]!.id !== currNodes[i]!.id) {
            changed = true;
            break;
          }
        }

      if (!changed) return;

      setNodeGroups(nodes);
      setCurrNodes(allNodes);
    });
  };

  useEffect(() => {
    loadDuplicates();
  });

  return (
    <div id={PageRefCSS.DUPLICATES_CONT_ID}>
      <div id={ComponentRefCSS.DUP_CONTROLS}>
        <span
          onClick={() => {
            setSelectedNodes(new Set<string>());
            loadDuplicates();
          }}
        >
          <FiRefreshCcw />
        </span>
        <span onClick={selectFirsts}>Select Firsts</span>
        <span onClick={selectLasts}>Select Lasts</span>
        <span onClick={invertSel}>Invert Selection</span>
        <span
          id={ComponentRefCSS.DUP_DELETE_BTN}
          onClick={(e) => {
            const selectedNodeList = Array.from(selectedNodes);

            for (let nodeId of selectedNodeList) {
              dispatch(rmv(nodeId));
            }
            loadDuplicates();
          }}
        >
          Delete Selected
        </span>
      </div>
      <div id="node-groups">
        {nodeGroups.map((nodes) => (
          <DuplicateGroup
            {...{
              nodesAndSel: nodes.map((nodeAndParentChain) => [
                nodeAndParentChain,
                selectedNodes.has(nodeAndParentChain.node.id)
              ]),
              addRmvNode
            }}
            key={`dup-gr-${nodes[0]!.node.id}`}
          />
        ))}
      </div>
    </div>
  );
};

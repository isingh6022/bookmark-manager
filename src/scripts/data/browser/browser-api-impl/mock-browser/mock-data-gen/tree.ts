import { BrowserBkmNode } from '@proj-types';
import { NodeGenerator } from './node-gen.js';

function generateTree(totalNodeCount: number, nestedFraction = 0.76): BrowserBkmNode {
  let allNodes: BrowserBkmNode[] = [],
    rootNode = NodeGenerator.getRandomNode(true);

  for (let i = 1; i < totalNodeCount; i++) {
    allNodes.push(NodeGenerator.getRandomNode());
  }

  rootNode.children = allNodes;
  childrenToTree([rootNode], nestedFraction);

  return rootNode;
}

function childrenToTree(children: BrowserBkmNode[], nestedFraction: number) {
  distributeChildren(children, nestedFraction);

  for (let child of children) {
    child.children?.length && childrenToTree(child.children, nestedFraction);
  }
}

function distributeChildren(nodes: BrowserBkmNode[], nestedFraction: number): void {
  let nNested = Math.floor(nodes.length * nestedFraction),
    nestedNodes: BrowserBkmNode[] = nodes.splice(0, nNested),
    topNodes: BrowserBkmNode[] = nodes,
    topFolders: BrowserBkmNode[] = [];

  topNodes.forEach((node) => !node.url && topFolders.push(node));
  if (!nNested || !topFolders.length) {
    nodes.push(...nestedNodes);
    return;
  }

  let nEach = Math.ceil(nNested / topFolders.length);
  let splits: number[] = [0],
    nextSplit = 0;

  while (nextSplit !== nestedNodes.length) {
    nextSplit += nEach;
    nextSplit = nextSplit <= nestedNodes.length ? nextSplit : nestedNodes.length;

    splits.push(nextSplit);
  }

  for (let i = 0, j = splits.length - 1; i < topFolders.length && j >= 1; i++, j--) {
    topFolders[i]!.children = nestedNodes.slice(splits[j - 1], splits[j]);
  }
}

export { generateTree };

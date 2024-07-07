interface OrderedNodeWithId<K> {
  readonly mapId: K;
  setIndex(i: number): void;
}

class OrderedMap<K, V extends OrderedNodeWithId<K>> {
  private _idToIndex = new Map<K, number>();
  private _nodeArray: V[] = [];

  // Following code is copied just to avoid imports in this file.
  static deleteArrayIndices(arr: any[], indices: number[]): void {
    if (!indices.length) return;

    let delCount = 1,
      nextDelIndex = indices[delCount];
    indices.sort((a, b) => a - b);

    for (let i = indices[delCount - 1] || Infinity; i < arr.length; i++) {
      let j = i + delCount;
      while (j === nextDelIndex) {
        delCount++, j++, (nextDelIndex = indices[delCount]);
      }

      arr[i] = arr[j];
    }
    arr.splice(arr.length - delCount, delCount);
  }

  constructor(nodeArray: V[] = []) {
    this.resetToNewValues(nodeArray);
  }
  resetToNewValues(nodeArray: V[] = []) {
    let i = 0;

    nodeArray
      .reverse()
      .filter((val) => {
        let valid = val && (val.mapId || val.mapId === 0 || val.mapId === ''),
          isAleadyPresent = valid && this._idToIndex.has(val.mapId);
        valid && !isAleadyPresent && this._idToIndex.set(val.mapId, 0);

        return valid && !isAleadyPresent;
      })
      .reverse()
      .forEach((val) => {
        val.setIndex(i);
        this._idToIndex.set(val.mapId, i++);
        this._nodeArray.push(val);
      });
  }

  has(idOrNode: K | V): boolean {
    return this._idToIndex.has(this._toMapId(idOrNode));
  }

  private _isNode(val: K | V): val is V {
    return !!(val && ((<any>val).mapId || (<any>val).mapId === 0 || (<any>val).mapId === ''));
  }
  private _toMapId(nodeOrId: K | V): K {
    return this._isNode(nodeOrId) ? nodeOrId.mapId : nodeOrId;
  }
  private _toNode(nodeOrId: K | V): V | null {
    return this._isNode(nodeOrId)
      ? nodeOrId
      : (this.has(nodeOrId) && this._nodeArray[this._getIndexForAvailableNode(nodeOrId)]) || null;
  }

  /**
   * Following method assumes that a node corresponding to given id is available.
   *
   * @param id
   * @returns The index of the element with given id.
   */
  private _getIndexForAvailableNode(id: K): number {
    // let index = this._idToIndex.get(id);
    // if (!index && index !== 0) {
    //   throw 'The node with given id is not actually available.';
    // }
    // return index;
    return <number>this._idToIndex.get(id);
  }
  private _indexInRange(index: number | undefined): boolean {
    return index || index == 0 ? index >= 0 && index < this.length : false;
  }
  private _addToArrAtIndex(node: V, index: number): number {
    return this._indexInRange(index)
      ? (this._nodeArray.splice(index, 0, node), index)
      : this._nodeArray.push(node) - 1;
  }
  private _addMultipleToArrAtIndex(nodes: V[], index: number): number {
    return this._indexInRange(index)
      ? (this._nodeArray.splice(index, 0, ...nodes), index)
      : this._nodeArray.push(...nodes) - nodes.length;
  }
  private _rmvFromNodeArr(startI: number, endI: number = 0): void {
    endI = endI || startI + 1;

    if (startI < this.length)
      for (let i = startI; i < endI; i++) {
        (<V>this._nodeArray[i]).setIndex(-1);
      }
    this._nodeArray.splice(startI, endI - startI);
  }
  private _updateIndices(index: number): void {
    let node: V;

    if (this._indexInRange(index))
      for (; index < this.length; index++) {
        node = this._nodeArray[index]!;

        this._idToIndex.set(node.mapId, index);
        node.setIndex(index);
      }
  }

  getById(id: K): V | undefined {
    return this._nodeArray[this._getIndexForAvailableNode(id)];
  }
  getByIndex(index: number): V | undefined {
    return this._nodeArray[index];
  }

  add(node: V, index?: number): void {
    this.has(node)
      ? (index || index === 0) && this.setIndex(node, index)
      : this._updateIndices(this._addToArrAtIndex(node, index || 0));
  }
  addAll(nodes: V[], index?: number) {
    index = this._indexInRange(index) ? index || 0 : this.length;
    this._updateIndices(
      this._addMultipleToArrAtIndex(
        nodes.filter((node) => !this.has(node)),
        index
      )
    );
  }

  del(nodeOrId: V | K): V | null {
    if (!this.has(nodeOrId)) return null;

    let node = <V>this._toNode(nodeOrId);
    let i = this._getIndexForAvailableNode(node.mapId);
    this._rmvFromNodeArr(i);
    this._idToIndex.delete(node.mapId);

    this._updateIndices(i);

    return node;
  }

  /**
   * Efficient if there are a large number of nodes and a considerable
   * number is to be deleted.
   */
  delAll(nodesOrIds: (V | K)[]) {
    let rmvNodes = new Set(nodesOrIds.map((nodeOrId) => this._toMapId(nodeOrId))),
      rmvIndices: number[] = [],
      i = 0;

    this._idToIndex.clear();
    this._nodeArray.forEach((node, i) => {
      if (rmvNodes.has(node.mapId)) {
        node.setIndex(-1);
        rmvIndices.push(i);
      }
    });
    OrderedMap.deleteArrayIndices(this._nodeArray, rmvIndices);
    this._updateIndices(0);
  }
  clear() {
    this._nodeArray.forEach((node) => node.setIndex(-1));
    this._idToIndex.clear();
    this._nodeArray.splice(0, this.length);
  }

  /**
   * Sets the index of a node. If the new index is more then total elements,
   * the node is moved to the end.
   *
   * @param nodeOrId Node or id of the node whose index is to be set.
   * @param index New index of the node
   */
  setIndex(nodeOrId: V | K, index: number) {
    let node = this._toNode(nodeOrId),
      currI = this.length;

    if (node) {
      if (this.has(node)) {
        let currI = this._getIndexForAvailableNode(node.mapId);
        this._rmvFromNodeArr(currI);
      }
      let newI = this._addToArrAtIndex(node, index);
      this._updateIndices(newI < currI ? newI : currI);
    }
  }

  toArray(): V[] {
    return [...this._nodeArray];
  }
  get length(): number {
    return this._nodeArray.length;
  }
  mapChildrenInOrder<T>(cb: (node: V) => T): T[] {
    return this._nodeArray.map((node) => cb(node));
  }
  forEachChildInOrder<T>(cb: (node: V, index: number) => T): void {
    this._nodeArray.forEach((node, index) => cb(node, index));
  }
}

export { OrderedMap };

import { SUBFOLDER_HEIGHT_CHANGE_DELAY } from '@proj-const';
import { Util } from '@proj-scripts';
import { Flow } from '@proj-types';
import React, { useEffect, useRef, useState } from 'react';

interface NodeChildrenColumn {
  childElements: React.JSX.Element[];
  columnCount?: number;
  columnIndex?: number;
  animateHeight?: boolean;
  collapse?: boolean;
  flowDirection?: Flow;
  isRootCol?: boolean;
  hasOddSubFolChildren?: boolean;
}

const ZeroHt = '0';
const updateHeightFn = (() => {
  let timeoutRef = setTimeout(() => {}, 0);

  return (element: HTMLDivElement, childCount: number, collapse: boolean) => {
    clearTimeout(timeoutRef);
    element.style.height = Util.misc.getSubFolContainerHt(element, childCount);
    element.style.overflow = 'visible';

    if (collapse) {
      timeoutRef = setTimeout(() => {
        if (element) {
          element.style.height = ZeroHt;
          timeoutRef = setTimeout(() => {
            element.style.overflow = 'hidden';
          }, SUBFOLDER_HEIGHT_CHANGE_DELAY);
        }
      }, 0);
    } else {
      timeoutRef = setTimeout(() => {
        if (element) {
          element.style.height = 'auto';
        }
      }, SUBFOLDER_HEIGHT_CHANGE_DELAY);
    }
  };
})();

/**
 * ColumnNodeContent receives all children of a node, but renderes only the relevant ones.
 * EG: It renders every 4th child starting from 3rd if columnCount is 4 and its index is 3.
 */
export const NodeChildrenColumn: React.FC<NodeChildrenColumn> = ({
  childElements,
  columnCount = 1,
  columnIndex = 0,
  animateHeight = false,
  collapse = false,
  flowDirection = Flow.COL,
  isRootCol,
  hasOddSubFolChildren
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const childElementsForThisColumn =
      columnIndex === 0 && columnCount === 1
        ? childElements
        : Util.nodeIndices.getNodeListForCol(
            flowDirection,
            childElements,
            columnIndex,
            columnCount
          ),
    className = Util.nodeIndices.getNodeChildrenColClass(
      flowDirection,
      columnIndex,
      columnCount,
      !!isRootCol,
      !!hasOddSubFolChildren
    );

  useEffect(() => {
    /** Doing this outside the component should be fine considering the different cases.
     */
    animateHeight && ref.current && updateHeightFn(ref.current, childElements.length, collapse);
  }, [animateHeight, collapse]);

  return (
    <div {...{ className, ref, style: animateHeight ? { height: 0 } : {} }}>
      {...childElementsForThisColumn}
    </div>
  );
};

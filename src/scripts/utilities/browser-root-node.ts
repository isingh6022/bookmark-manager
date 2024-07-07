import { BrowserBkmNode } from '@proj-types';
import { ROOT_NODE_CONSTANTS } from '@proj-const';

/**
 * The root nodes returned by the browser are to be added to an
 * instance of the following class as children before they are
 * processed by the application.
 */
export class DefaultBrowserRootNode implements BrowserBkmNode {
  get index(): number {
    return 0;
  }
  private _dateAdded = new Date();
  get dateAdded(): number {
    return this._dateAdded.getTime();
  }
  get title(): string {
    return 'ROOT';
  }
  get id(): string {
    return ROOT_NODE_CONSTANTS.id;
  }
  get parentId(): undefined {
    return undefined;
  }

  get children(): BrowserBkmNode[] {
    return this._children;
  }

  constructor(private _children: BrowserBkmNode[]) {}
}

import { MockStorage } from './mock-storage-api.js';
import { MockBookmarks } from './mock-bookmarks.js';

export class MockBrowser {
  static readonly bookmarks = MockBookmarks;
  static readonly storage = MockStorage;
}

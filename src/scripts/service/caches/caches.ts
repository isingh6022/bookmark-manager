import { BookmarkCache as BkmCache } from './bookmark-cache/bookmark-cache.js';
import { TransientStateCache as TransientCache } from './transient-state-cache.js';
import { SettingsCache as SettCache } from './settings-cache.js';
import { IconsCache as IcoCache } from './icons-cache.js';

export const BookmarkCache = BkmCache.instance;
export const TransientStateCache = TransientCache.instance;
export const SettingsCache = SettCache.instance;
export const IconsCache = IcoCache.instance;

export const BookmarkCacheReadonly = BkmCache.instance.readonly;
export const TransientStateCacheReadonly = TransientCache.instance.readonly;
export const SettingsCacheReadonly = SettCache.instance.readonly;
export const IconsCacheReadonly = IcoCache.instance.readonly;

// For testing with mock data.
// setTimeout(
//   () =>
//     console.log(
//       BookmarkCache,
//       (BookmarkCache as any)._rootNode._childNodes._children,
//       (BookmarkCache as any)._rootNode._childNodes._children._nodeArray[1].children
//     ),
//   600
// );

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

var BKM_CACHE_DEBUG;
declare global {
  var BKM_CACHE_DEBUG: any; // for debugging only - else browser doesn't have access to caches.
}

// For testing with mock data.
if (BUILD_MODE === 'development') {
  // Used only while debugging by the mock-browser api.
  setTimeout(() => {
    window['BKM_CACHE_DEBUG'] = BookmarkCache;
  }, 600);
}

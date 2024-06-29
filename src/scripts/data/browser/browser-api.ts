import { BrowserType, BrowserAPIs } from '@proj-types';
import { getChromeAPIs } from './browser-api-impl/chrome-api.js';
import { getMockAPIs } from './browser-api-impl/mock-browser-api.js';

let browserType: BrowserType = BrowserType.CHROME;

if (BUILD_MODE === 'development') {
  browserType = BrowserType.MOCK;
}

export const BROWSER = browserType === BrowserType.CHROME ? getChromeAPIs() : getMockAPIs();

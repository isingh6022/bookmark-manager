import { BrowserType, BrowserAPIs } from '@proj-types';
import { getChromeAPIs } from './browser-api-impl/chrome-api.js';
import { getMockAPIs } from './browser-api-impl/mock-browser-api.js';

let browserType: BrowserType = BUILD_MODE === 'development' ? BrowserType.MOCK : BrowserType.CHROME;

export const BROWSER = browserType === BrowserType.CHROME ? getChromeAPIs() : getMockAPIs();

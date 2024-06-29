import { BrowserType, BrowserAPIs } from '@proj-types';
import { getChromeAPIs } from './browser-api-impl/chrome-api.js';
import { getMockAPIs } from './browser-api-impl/mock-browser-api.js';

const browserType: BrowserType = <any>BrowserType.CHROME;

let browser: BrowserAPIs;

if (browserType === BrowserType.CHROME) {
  browser = getChromeAPIs();
} else {
  browser = getMockAPIs();
}

export const BROWSER = browser;

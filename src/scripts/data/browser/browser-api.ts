import { BROWSER_TYPE, BrowserAPIs } from '@proj-types';
import { getChromeAPIs } from './browser-api-impl/chrome-api.js';
import { getMockAPIs } from './browser-api-impl/mock-browser-api.js';

const browserType: BROWSER_TYPE = <any>BROWSER_TYPE.Chrome;

let browser: BrowserAPIs;

if (browserType === BROWSER_TYPE.Chrome) {
  browser = getChromeAPIs();
} else {
  browser = getMockAPIs();
}

export const BROWSER = browser;

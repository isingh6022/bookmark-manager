import { Provider } from 'react-redux';

import { STORE } from '@proj-state';
import { Page } from './Page.js';
import { DragDrop } from './util-components/DragDrop.js';
import { PopupComponent } from './popups/Popup.js';

export const App: React.FC<any> = () => {
  return (
    <Provider store={STORE}>
      <div id="theme-container">
        <Page />
        <DragDrop />
        <PopupComponent />
      </div>
    </Provider>
  );
};

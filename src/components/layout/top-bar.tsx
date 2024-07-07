import { PropsWithChildren } from 'react';

import { GenericClassCSS, LayoutRefCSS } from '@proj-const';

export const TopBar: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <div id={LayoutRefCSS.TOP_BAR_ID} className={GenericClassCSS.FLEX_ROW_CENTER_NOWRAP}>
    {children}
  </div>
);

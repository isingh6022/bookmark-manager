import { LayoutRefCSS } from '@proj-const';
import { PropsWithChildren } from 'react';

export const LeftSidebar: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <div id={LayoutRefCSS.SIDEBAR_LT_ID}>
      <div>{children}</div>
    </div>
  );
};

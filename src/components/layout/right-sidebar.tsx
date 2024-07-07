import { LayoutRefCSS } from '@proj-const';
import { PropsWithChildren } from 'react';

export const RightSidebar: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return <div id={LayoutRefCSS.SIDEBAR_RT_ID}>{children}</div>;
};

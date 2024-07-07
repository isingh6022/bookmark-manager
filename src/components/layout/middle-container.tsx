import { LayoutRefCSS } from '@proj-const';
import { PropsWithChildren } from 'react';

export const MiddleContainer: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return <div id={LayoutRefCSS.MIDDLE_CONT_ID}>{children}</div>;
};

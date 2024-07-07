import { WarnPopup } from '@proj-types';

export const WarnPopupComponent: React.FC<WarnPopup> = (popup) => {
  return <div>{popup.message}</div>;
};

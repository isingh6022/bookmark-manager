import { InfoPopup } from '@proj-types';

export const InfoPopupComponent: React.FC<InfoPopup> = (popup) => {
  return <div>{popup.message}</div>;
};

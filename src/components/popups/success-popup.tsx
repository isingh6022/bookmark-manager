import { SuccessPopup } from '@proj-types';

export const SuccessPopupComponent: React.FC<SuccessPopup> = (popup) => {
  return <div>{popup.message}</div>;
};

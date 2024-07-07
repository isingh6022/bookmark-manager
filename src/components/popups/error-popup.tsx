import { ErrorPopup } from '@proj-types';

export const ErrorPopupComponent: React.FC<ErrorPopup> = (popup) => {
  return <div>{popup.message}</div>;
};

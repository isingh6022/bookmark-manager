import { LayoutProps } from '@proj-types';
import { LayoutRefCSS } from '@proj-const';
import { useEffect } from 'react';

type LytProps = React.PropsWithChildren<LayoutProps>;

export const Layer: React.FC<React.PropsWithChildren<LytProps>> = ({
  closeLayerOnClick,
  classes,
  bgColor,
  children
}) => {
  let style = bgColor ? { backgroundColor: bgColor } : {},
    className = LayoutRefCSS.OVR_LAY + (classes ? ` ${classes}` : '');

  const closeOnEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeLayerOnClick) {
      window.removeEventListener('keydown', closeOnEsc);
      closeLayerOnClick();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', closeOnEsc);
    return () => window.removeEventListener('keydown', closeOnEsc);
  }, []);

  return (
    <div {...{ style, className }} onClick={() => closeLayerOnClick && closeLayerOnClick()}>
      {children}
    </div>
  );
};

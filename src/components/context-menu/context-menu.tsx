import { LayoutRefCSS } from '@proj-const';
import { Util } from '@proj-scripts';
import { CtxMenuOption, Position } from '@proj-types';

const CtxMenuEl: React.FC<{
  menuOptions: CtxMenuOption;
  closeMenu: () => void;
}> = ({ menuOptions, closeMenu }) => (
  <div {...{ onClick: (e) => (e.stopPropagation(), menuOptions.onClick(), closeMenu()) }}>
    {menuOptions.title}
  </div>
);

export const CtxMenu: React.FC<{
  position: Position;
  options: CtxMenuOption[];
  closeMenu: () => void;
}> = ({ position, options, closeMenu }) => {
  closeMenu = Util.ctxMenu.decorateCloseMenuMethod(closeMenu);

  return (
    <div
      id={LayoutRefCSS.CTX_MENU_ID}
      className={Util.ctxMenu.ctxMenuPosn(position.x, position.y, options.length)}
      style={{ top: position.y, left: position.x }}
    >
      {options.map((menuOptions) => (
        <CtxMenuEl {...{ menuOptions, closeMenu, key: menuOptions.title }} />
      ))}
    </div>
  );
};

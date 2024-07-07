import React from 'react';
import { useSelector } from 'react-redux';
import { PAGES } from '@proj-types';
import { BookmarkPage, DuplicatesPage } from './middle/pages.js';
import { UnknownPageType } from '@proj-scripts';
import { RootStateType } from '@proj-state';
import { Layer } from './layout/layer.js';
import { LeftSidebar } from './layout/left-sidebar.js';
import { MiddleContainer } from './layout/middle-container.js';
import { RightSidebar } from './layout/right-sidebar.js';
import { TopBar } from './layout/top-bar.js';
import { FolderPins } from './left/folder-pin.js';
import { RightSideInfoDiv } from './right/right-side-info.js';
import { ActionButtons } from './top/action-buttons.js';
import { AddressBar } from './top/address-bar.js';
import { PageButtons } from './top/page-buttons.js';
import { StateButtons } from './top/state-buttons.js';

const stateSelectorPage = (state: RootStateType): PAGES => state.transient.currPage;

export const Page: React.FC<any> = () => {
  const page = useSelector(stateSelectorPage);
  let pageComponent: React.JSX.Element;

  switch (page) {
    case PAGES.bkmFolder:
    case PAGES.recent:
      pageComponent = <BookmarkPage />;
      break;
    case PAGES.duplicates:
      pageComponent = <DuplicatesPage />;
      break;
    default:
      throw new UnknownPageType('Page Component', page + '');
  }

  return (
    <Layer>
      <TopBar>
        <PageButtons />
        <AddressBar />
        <ActionButtons />
        <StateButtons />
      </TopBar>
      <LeftSidebar>
        <FolderPins />
      </LeftSidebar>
      <MiddleContainer>{pageComponent}</MiddleContainer>
      <RightSidebar>
        <RightSideInfoDiv />
      </RightSidebar>
    </Layer>
  );
};

import { Key, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ComponentRefCSS,
  GenericClassCSS,
  MinorElementsRefCSS,
  SRH_REQ_DELAY,
  TIPS
} from '@proj-const';
import { BookmarkTreeDataNode, PAGES } from '@proj-types';
import {
  setCurrNode,
  page,
  AppDispatchType,
  RootStateType,
  ReduxSelectorForArrOfElements,
  searchNodes,
  deselectAll
} from '@proj-state';
import { BsHouseFill, BsChevronRight, BsXCircleFill, BsSearch } from '../project-icons.js';

const SearchInput: React.FC<{
  query: string;
  setQuery: (q: string) => void;
  folderId: string;
  exitSrhMode: () => void;
}> = ({ query, setQuery, folderId, exitSrhMode }) => {
  let timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const dispatch = useDispatch<AppDispatchType>();
  const setQ = (q: string) => {
    setQuery(q);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => dispatch(searchNodes(q)), SRH_REQ_DELAY);
  };
  const closeInput = (e: React.KeyboardEvent) => e.code === 'Escape' && exitSrhMode();

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      dispatch(searchNodes(''));
    };
  }, []);

  return (
    <input
      id="search-input"
      type="text"
      value={query}
      onKeyDown={closeInput}
      onChange={(e) => setQ(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      autoFocus
      autoComplete="off"
    />
  );
};

const AddressBarElement: React.FC<
  React.PropsWithChildren<{ id: string; name: string; text?: boolean; finalEl?: boolean }>
> = ({ id, name, text, finalEl, children = null }) => {
  const dispatch = useDispatch<AppDispatchType>();
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setCurrNode(id));
    dispatch(page({ page: PAGES.bkmFolder, folder: id }));
    dispatch(deselectAll());
  };

  return (
    <div {...{ onClick, className: MinorElementsRefCSS.ADDR_BAR_ADDR_ELEM }}>
      <span className={text ? MinorElementsRefCSS.ADD_BAR_TEXT_CONT : ''}>{children ?? name}</span>
      {
        // prettier-ignore
        finalEl ? '' :<span><BsChevronRight /></span>
      }
    </div>
  );
};

const stateSelectorAddressBar = new ReduxSelectorForArrOfElements(
  (state: RootStateType): [BookmarkTreeDataNode, BookmarkTreeDataNode[], PAGES] => [
    state.bookmarks.currNode,
    state.bookmarks.currNodeParentChain,
    state.transient.currPage
  ]
).selector;
export const AddressBar: React.FC<any> = () => {
  let [currNode, addrInfo, currPage] = useSelector(stateSelectorAddressBar);
  let finalElement = true;

  const [query, setQuery] = useState('');
  const [srhMode, setSrhMode] = useState(false);
  const home = (addrInfo = [...addrInfo]).pop();
  const isBkmPage = currPage === PAGES.bkmFolder;

  !isBkmPage && srhMode && setSrhMode(false);

  const onClick = (e: React.MouseEvent) => {
    if (isBkmPage) {
      e.stopPropagation();
      setQuery('');
      setSrhMode(!srhMode);
    }
  };
  const exitSrhMode = () => srhMode && setSrhMode(false);
  let [content, srhIcon] = srhMode
    ? [
        <SearchInput {...{ query, setQuery, folderId: currNode.id, exitSrhMode }} />,
        <span title={TIPS.EXIT_SEARCH}>
          <BsXCircleFill onClick={onClick} />
        </span>
      ]
    : [
        <div onClick={onClick} id={MinorElementsRefCSS.ADDR_BAR_ELEM_CONT_ID}>
          {(isBkmPage ? addrInfo : []).map((loc) => {
            let finalEl = finalElement;
            finalElement = false;
            return (
              <AddressBarElement
                id={loc.id}
                name={loc.title}
                key={loc.id}
                text={true}
                finalEl={finalEl}
              />
            );
          })}
          <AddressBarElement id={home!.id} name={'home'}>
            <span title={TIPS.HOME} id={MinorElementsRefCSS.ADDR_BAR_HOME_BTN_ID}>
              <BsHouseFill />
            </span>
          </AddressBarElement>
        </div>,
        <span title={TIPS.SEARCH}>
          <BsSearch />
        </span>
      ];

  return (
    <div id={ComponentRefCSS.ADDR_BAR_ID} className={GenericClassCSS.FLEX_ROW_CENTER_NOWRAP}>
      {content}
      <span id={MinorElementsRefCSS.ADDR_BAR_BTN_ID} onClick={onClick}>
        {srhIcon}
      </span>
    </div>
  );
};

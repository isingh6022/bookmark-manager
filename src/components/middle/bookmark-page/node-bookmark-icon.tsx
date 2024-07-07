// import { useState } from 'react';
import { LOCAL_LINK_INFO } from '@proj-const';
import { BsLink45Deg, BsInfoCircle } from '../../project-icons.js';
import { Util } from '@proj-scripts';

// const BkmIco: React.FC<{ url: string }> = ({ url }) => {
//     let [err, setErr] = useState(false);

//     return err || Util.misc.isLocalUrl(url) ? (
//       <BsLink45Deg />
//     ) : (
//       <img src={BROWSER.actions.getBkmIconSrc(url)} onError={() => setErr(true)} />
//     );
//   };

const BkmIco: React.FC<{ url: string }> = ({ url }) => {
  return Util.misc.isLocalUrl(url) || true ? (
    /* {<BsLink45Deg /> */ <BsInfoCircle title={LOCAL_LINK_INFO} />
  ) : (
    // <img src={BROWSER.actions.getBkmIconSrc(url)} />
    ''
  );
};

export { BkmIco };

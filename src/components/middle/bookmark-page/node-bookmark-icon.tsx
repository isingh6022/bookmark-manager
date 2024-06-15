import { useState } from 'react';
import { LOCAL_LINK_INFO } from '@proj-const';
import { Util } from '@proj-scripts';
import { BsLink45Deg, FiGlobe } from '../../project-icons.js';

const BkmIco: React.FC<{ url: string }> = ({ url }) => {
  let [err, setErr] = useState(false);

  return Util.misc.isLocalUrl(url) || err ? (
    /* {<BsLink45Deg /> */ <FiGlobe title={LOCAL_LINK_INFO} />
  ) : (
    <img onError={() => setErr(true)} src={Util.misc.getBrowserIconUrl(url)} />
  );
};

export { BkmIco };

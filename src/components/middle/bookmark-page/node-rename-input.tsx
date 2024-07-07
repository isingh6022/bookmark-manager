import { useRef, useState } from 'react';

export const NodeRenameInput: React.FC<{
  title: string;
  renameBlur: (newTitle: string) => void;
}> = ({ title, renameBlur }) => {
  const [val, setVal] = useState(title);
  const ref = useRef<HTMLInputElement>(null);

  const postChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    renameBlur(e.target.value);
  };
  const checkEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      ref.current && ref.current.blur();
    }
  };
  return (
    <input
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={checkEnter}
      onBlur={postChange}
      autoFocus
    />
  );
};

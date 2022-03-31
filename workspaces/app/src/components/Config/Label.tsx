import type { FC } from 'react';

const Label:FC<{ text: string }> = ({ text }) => (
  <span
    style={{
      position: 'absolute',
      top: '-5px',
      fontSize: '11px',
    }}
  >
    Key: {text}
  </span>
);

export default Label;

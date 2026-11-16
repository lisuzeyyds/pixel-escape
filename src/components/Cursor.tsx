import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

/** 站 0 结尾那只鼠标指针：它把坏点带出了开机画面 */
export const Cursor: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [286, 322, 352, 360], [1150, 1858, 1892, 1980], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [286, 322, 352, 360], [1180, 1012, 1052, 1180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [284, 292], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={46}
      height={52}
      viewBox="0 0 23 26"
      style={{ position: 'absolute', left: x, top: y, opacity, zIndex: 60 }}
    >
      <path
        d="M1 1 L1 19 L5.6 14.8 L8.6 21.6 L11.6 20.3 L8.7 13.8 L15 13.6 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
};

import React from 'react';

/** CRT 扫描线 + 暗角，压在每一站画面上，负责“这是屏幕里”的味道 */
export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.22 }) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 4px)',
          opacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
};

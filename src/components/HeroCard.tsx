import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { samplePixel } from '../constants';

/**
 * 结尾那张「英雄牌」：坏点踩着它冲向镜头。
 * 它跟着像素的曲线走，所以镜头推近时牌和红点是一起大的。
 */
export const HeroCard: React.FC<{ offset?: number; from?: number }> = ({
  offset = 0,
  from = 786,
}) => {
  const frame = useCurrentFrame() + offset;

  if (frame < from) return null;

  const { x, y, size } = samplePixel(frame);
  const opacity = interpolate(frame, [from, from + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const w = size * 4.4;
  const h = w * 1.42;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h * 0.52,
        width: w,
        height: h,
        borderRadius: Math.max(4, w * 0.03),
        transform: 'rotate(-7deg)',
        opacity,
        background: 'linear-gradient(160deg, #B31E2E 0%, #8C1220 100%)',
        border: `${Math.max(1, w * 0.008)}px solid rgba(255,255,255,0.8)`,
        boxShadow: `0 ${w * 0.04}px ${w * 0.1}px rgba(0,0,0,0.35)`,
        overflow: 'hidden',
        zIndex: 49,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: w * 0.045,
          border: `1px solid rgba(255,255,255,0.32)`,
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 3px, rgba(255,255,255,0) 3px 9px)',
        }}
      />
    </div>
  );
};

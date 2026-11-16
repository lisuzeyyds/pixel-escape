import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { FONT, SAMPLE_FRAMES } from './constants';
import { PixelLayer } from './layers/PixelLayer';
import { Station00Boot } from './scenes/Station00Boot';
import { Station01XP } from './scenes/Station01XP';

/** 站与站之间那一下白闪，让“钻进去”的推镜成立 */
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [352, 362, 374], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{ background: '#FFFFFF', opacity, zIndex: 80, pointerEvents: 'none' }}
    />
  );
};

/**
 * 主片：站 0 + 站 1，30 秒。
 * 结构就是提案里那句话——场景一场场地换，像素图层一直没换。
 */
export const PixelEscape: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000000', fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={360} name="00 开机">
        <Station00Boot />
      </Sequence>

      <Sequence from={360} durationInFrames={SAMPLE_FRAMES - 360} name="01 XP 桌面">
        <Station01XP />
      </Sequence>

      {/* 唯一跨场景的图层 */}
      <PixelLayer />

      <CutFlash />
    </AbsoluteFill>
  );
};

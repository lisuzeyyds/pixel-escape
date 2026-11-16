import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { FPS, HEIGHT, SAMPLE_FRAMES, WIDTH } from './constants';
import { PixelEscape } from './PixelEscape';
import { PixelLayer } from './layers/PixelLayer';
import { Station00Boot } from './scenes/Station00Boot';
import { Station01XP } from './scenes/Station01XP';

/** 单站预览也要带上像素图层，否则看不到它的走位 */
const BootPreview: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Station00Boot />
    <PixelLayer />
  </AbsoluteFill>
);

const XPPreview: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Station01XP />
    <PixelLayer offset={360} />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PixelEscape"
        component={PixelEscape}
        durationInFrames={SAMPLE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Station00-Boot"
        component={BootPreview}
        durationInFrames={360}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Station01-XP"
        component={XPPreview}
        durationInFrames={SAMPLE_FRAMES - 360}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

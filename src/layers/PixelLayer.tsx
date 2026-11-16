import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SIGNAL, samplePixel } from '../constants';

/**
 * 顶层像素图层：全片唯一一个「跨场景」的东西。
 * 它不认识场景，只认识自己的关键帧曲线，所以剪辑点永远切不断它。
 *
 * offset 用于单独预览某一站时把绝对帧号对齐。
 */
export const PixelLayer: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const frame = useCurrentFrame() + offset;
  const { x, y, size } = samplePixel(frame);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: SIGNAL,
        // 一点点辉光，只为在全黑和全亮两种底上都看得见
        boxShadow: `0 0 ${size * 0.8}px rgba(255, 36, 49, 0.55)`,
        zIndex: 50,
      }}
    />
  );
};

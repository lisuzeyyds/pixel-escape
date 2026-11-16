import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from 'remotion';
import { BadPixelDialog } from '../components/BadPixelDialog';
import { Cursor } from '../components/Cursor';
import { Scanlines } from '../components/Scanlines';

/** 站 0 · 开机｜0:00 – 0:12｜黑屏、CRT 上电、一条白线展开、一只坏点弹窗 */
export const Station00Boot: React.FC = () => {
  const frame = useCurrentFrame();

  // 上电：先一条水平亮线，再纵向撑满
  const beamX = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const beamOpacity = interpolate(frame, [0, 3, 12, 22], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const screenY = interpolate(frame, [16, 40], [0.004, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const screenOpacity = interpolate(frame, [14, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 显像管稳定后的轻微呼吸感
  const flicker = 0.97 + 0.03 * Math.sin(frame / 2.2);

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050506',
          transform: `scaleY(${screenY})`,
          opacity: screenOpacity * flicker,
          overflow: 'hidden',
        }}
      >
        {/* 显像管里的余光 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(90% 70% at 50% 55%, rgba(26,32,44,0.9) 0%, rgba(3,3,5,1) 72%)',
          }}
        />
        <BadPixelDialog />
        <Scanlines opacity={0.3} />
      </div>

      {/* 那条白线 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          width: '100%',
          height: 5,
          marginTop: -2,
          background: '#FFFFFF',
          transform: `scaleX(${beamX})`,
          transformOrigin: 'center',
          opacity: beamOpacity,
          boxShadow: '0 0 40px 8px rgba(255,255,255,0.75)',
        }}
      />

      {/* 一条慢慢下移的场同步暗带 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: 120,
          top: ((frame * 2.4) % 1400) - 120,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,0.045) 50%, rgba(0,0,0,0) 100%)',
          opacity: interpolate(frame, [30, 60], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      <Cursor />

      {/* 开机瞬间的那一下衍射光 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFFFFF',
          opacity: interpolate(frame, [0, 2, 10], [0, 0.14, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.02 }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${random(`d-${i}`) * 100}%`,
              top: `${random(`e-${i}`) * 100}%`,
              width: 2,
              height: 2,
              background: '#fff',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

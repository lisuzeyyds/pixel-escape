import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from '../constants';

const TITLE = '检测到 1 个坏点，是否忽略？';

/** 站 0 的那只弹窗：两个按钮都叫「忽略」 */
export const BadPixelDialog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({ frame: frame - 96, fps, config: { damping: 200 }, durationInFrames: 18 });
  const leave = interpolate(frame, [286, 304], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const typed = Math.round(
    interpolate(frame, [112, 158], [0, TITLE.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 470,
        top: 360,
        width: 760,
        background: '#C3C3C3',
        borderTop: '2px solid #FFFFFF',
        borderLeft: '2px solid #FFFFFF',
        borderRight: '2px solid #4A4A4A',
        borderBottom: '2px solid #4A4A4A',
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        transform: `scale(${0.94 + 0.06 * appear})`,
        opacity: appear * leave,
        fontFamily: FONT,
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          height: 46,
          margin: 4,
          background: 'linear-gradient(90deg, #000080 0%, #1084D0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 0 14px',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 22, letterSpacing: 1 }}>系统提示</span>
        <div
          style={{
            width: 30,
            height: 26,
            background: '#C3C3C3',
            borderTop: '2px solid #FFFFFF',
            borderLeft: '2px solid #FFFFFF',
            borderRight: '2px solid #4A4A4A',
            borderBottom: '2px solid #4A4A4A',
            color: '#111',
            fontSize: 18,
            lineHeight: '24px',
            textAlign: 'center',
          }}
        >
          ×
        </div>
      </div>

      {/* 正文 */}
      <div style={{ display: 'flex', gap: 26, padding: '30px 34px 22px' }}>
        <div
          style={{
            flex: '0 0 auto',
            width: 62,
            height: 62,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #FF6A6A, #C00000)',
            border: '3px solid #8A0000',
            color: '#fff',
            fontSize: 44,
            fontWeight: 700,
            lineHeight: '60px',
            textAlign: 'center',
          }}
        >
          !
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.5,
            color: '#101010',
            letterSpacing: 1,
            minHeight: 90,
          }}
        >
          {TITLE.slice(0, typed)}
          <span style={{ opacity: typed < TITLE.length ? 0.35 : 0 }}>▍</span>
        </div>
      </div>

      {/* 两个一模一样的按钮 */}
      <div style={{ display: 'flex', gap: 22, justifyContent: 'flex-end', padding: '0 34px 30px' }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 150,
              height: 52,
              background: '#C3C3C3',
              borderTop: '3px solid #FFFFFF',
              borderLeft: '3px solid #FFFFFF',
              borderRight: '3px solid #4A4A4A',
              borderBottom: '3px solid #4A4A4A',
              outline: i === 0 ? '2px dotted #222' : 'none',
              outlineOffset: -8,
              fontSize: 26,
              color: '#111',
              lineHeight: '48px',
              textAlign: 'center',
              letterSpacing: 6,
            }}
          >
            忽略
          </div>
        ))}
      </div>
    </div>
  );
};

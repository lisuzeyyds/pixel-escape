import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CardCascade } from '../components/CardCascade';
import { DesktopIcon } from '../components/DesktopIcon';
import { HeroCard } from '../components/HeroCard';
import { Minesweeper } from '../components/Minesweeper';
import { Scanlines } from '../components/Scanlines';

const ICONS = [
  { kind: 'computer' as const, label: '我的电脑', top: 106, delay: 4 },
  { kind: 'bin' as const, label: '回收站', top: 226, delay: 10 },
  { kind: 'mine' as const, label: '扫雷', top: 346, delay: 16 },
  { kind: 'cards' as const, label: '纸牌', top: 466, delay: 22 },
];

/** 站 1 · XP 桌面｜0:12 – 0:30｜蓝天草地、回收站、扫雷、卡牌瀑布 */
export const Station01XP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 推镜入场：从上一个画面的“钻进去”里拉开
  const enter = interpolate(frame, [0, 40], [1.22, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 踩雷时的整屏抖动
  const shake =
    frame >= 340 && frame < 360
      ? interpolate(frame, [340, 352, 360], [16, 6, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const sx = (random(`sx-${Math.floor(frame / 2)}`) - 0.5) * shake;
  const sy = (random(`sy-${Math.floor(frame / 2)}`) - 0.5) * shake;

  // 坏点被拖进回收站时，桶跟着晃
  const binShake =
    frame >= 96 && frame <= 128
      ? Math.sin((frame - 96) / 2.4) * interpolate(frame, [96, 128], [7, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <AbsoluteFill style={{ background: '#3A7BD5', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${enter}) translate(${sx}px, ${sy}px)`,
        }}
      >
        {/* 蓝天 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, #1857C4 0%, #3C86DE 32%, #7DB9F0 58%, #C9E4FA 68%)',
          }}
        />
        {/* 云 */}
        {[
          { x: 1180, y: 130, s: 1.15, d: 0.3 },
          { x: 1520, y: 250, s: 0.8, d: 0.22 },
          { x: 700, y: 210, s: 0.6, d: 0.16 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x + frame * c.d,
              top: c.y,
              width: 320 * c.s,
              height: 90 * c.s,
              borderRadius: '50%',
              background:
                'radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0.55) 70%, rgba(255,255,255,0) 100%)',
              filter: 'blur(2px)',
            }}
          />
        ))}
        {/* 草地 */}
        <div
          style={{
            position: 'absolute',
            left: -120,
            right: -120,
            top: 640,
            bottom: -220,
            borderRadius: '50% 50% 0 0 / 28% 34% 0 0',
            background:
              'radial-gradient(80% 100% at 45% 0%, #8FC24A 0%, #63A02F 42%, #3F7220 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 646,
            height: 26,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))',
            filter: 'blur(6px)',
          }}
        />

        {/* 桌面图标 */}
        {ICONS.map((icon) => (
          <div
            key={icon.label}
            style={{
              position: 'absolute',
              left: 110,
              top: icon.top,
              transform:
                icon.kind === 'bin'
                  ? `rotate(${binShake}deg)`
                  : `scale(${spring({
                      frame: frame - icon.delay,
                      fps,
                      config: { damping: 13, mass: 0.7 },
                    })})`,
            }}
          >
            <DesktopIcon kind={icon.kind} label={icon.label} x={0} y={0} />
          </div>
        ))}

        <Minesweeper explodeAt={340} />

        <Sequence from={380} durationInFrames={160}>
          <CardCascade />
        </Sequence>

        <HeroCard offset={360} />

        <Scanlines opacity={0.1} />
      </AbsoluteFill>

      {/* 任务栏 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 86,
          background: 'linear-gradient(180deg, #3E8EF7 0%, #245EDC 18%, #1E52C8 100%)',
          borderTop: '1px solid rgba(255,255,255,0.55)',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 186,
            height: 74,
            marginLeft: 6,
            borderRadius: '0 22px 22px 0',
            background: 'linear-gradient(180deg, #57BE4C 0%, #2E8B27 60%, #226C1D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#FFFFFF',
            fontSize: 30,
            fontWeight: 600,
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(0,0,0,0.45)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  background: i % 3 === 0 ? '#F5D14E' : '#FFFFFF',
                }}
              />
            ))}
          </div>
          开始
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            marginRight: 22,
            color: '#EAF2FF',
            fontSize: 24,
            letterSpacing: 1,
          }}
        >
          22:41
        </div>
      </div>
    </AbsoluteFill>
  );
};

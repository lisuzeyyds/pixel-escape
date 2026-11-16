import React from 'react';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from 'remotion';

const COUNT = 88;

const CARDS = new Array(COUNT).fill(0).map((_, i) => ({
  left: random(`x-${i}`) * 2000 - 60,
  // 延迟铺满整段结尾，不能 1 秒就落完
  delay: random(`d-${i}`) * 118,
  rot0: (random(`r-${i}`) - 0.5) * 46,
  spin: (random(`s-${i}`) - 0.5) * 420,
  dur: 54 + random(`t-${i}`) * 34,
  scale: 0.66 + random(`k-${i}`) * 0.6,
}));

/**
 * 站 1 的出口：纸牌通关后的卡牌瀑布。
 * 用确定性的 random(seed) 保持每次渲染完全一致。
 */
export const CardCascade: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {CARDS.map((card, i) => {
        const local = frame - card.delay;
        if (local < 0) return null;

        const p = interpolate(local, [0, card.dur], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.quad),
        });
        if (p >= 1) return null;

        const y = -260 + p * 1520;
        const rot = card.rot0 + p * card.spin;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: card.left,
              top: y,
              width: 104,
              height: 148,
              borderRadius: 7,
              transform: `rotate(${rot}deg) scale(${card.scale})`,
              background:
                'linear-gradient(160deg, #B31E2E 0%, #8C1220 100%)',
              border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.35)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 8,
                border: '1px solid rgba(255,255,255,0.35)',
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 3px, rgba(255,255,255,0) 3px 9px)',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

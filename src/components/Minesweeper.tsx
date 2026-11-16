import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from '../constants';

const SIZE = 9;
const CELL = 40;

/** 布雷是固定的，才能保证每一次渲染、每一帧都爆炸在同一格 */
const MINES: Array<[number, number]> = [
  [7, 4],
  [2, 6],
  [5, 8],
  [8, 1],
  [3, 2],
  [6, 0],
  [0, 3],
  [4, 7],
  [1, 1],
];

const FLAGS: Array<[number, number]> = [
  [8, 1],
  [2, 6],
  [5, 8],
];

const isMine = (c: number, r: number) => MINES.some(([mc, mr]) => mc === c && mr === r);

const adjacent = (c: number, r: number) => {
  let n = 0;
  for (let dc = -1; dc <= 1; dc++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (dc === 0 && dr === 0) continue;
      const nc = c + dc;
      const nr = r + dr;
      if (nc < 0 || nr < 0 || nc >= SIZE || nr >= SIZE) continue;
      if (isMine(nc, nr)) n++;
    }
  }
  return n;
};

const NUM_COLOR: Record<number, string> = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export const Minesweeper: React.FC<{ explodeAt: number }> = ({ explodeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const boom = frame - explodeAt;
  const exploding = boom >= 0;

  // 从像素跳进去开始，格子一点点被点开，直到踩雷
  const revealedBudget = Math.round(
    interpolate(frame, [236, explodeAt], [0, 74], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const flash = exploding
    ? interpolate(boom, [0, 1, 6], [0.5, 0.26, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const fireR = exploding
    ? interpolate(boom, [0, 9], [110, 360], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const fireO = exploding
    ? interpolate(boom, [0, 3, 16], [1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const ringR = exploding
    ? interpolate(boom, [0, 16], [44, 420], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  let cellIndex = 0;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 300,
          width: 380,
          background: '#C3C3C3',
          borderTop: '2px solid #FFFFFF',
          borderLeft: '2px solid #FFFFFF',
          borderRight: '2px solid #3C3C3C',
          borderBottom: '2px solid #3C3C3C',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
          fontFamily: FONT,
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px 0 12px',
            background: 'linear-gradient(90deg, #0058EE 0%, #3F8CF3 60%, #0058EE 100%)',
            color: '#FFFFFF',
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          <span>扫雷</span>
          <span
            style={{
              width: 26,
              height: 24,
              background: 'linear-gradient(180deg, #F2674E, #D0361F)',
              border: '1px solid #fff',
              borderRadius: 3,
              fontSize: 16,
              lineHeight: '22px',
              textAlign: 'center',
            }}
          >
            ×
          </span>
        </div>

        <div style={{ fontSize: 15, color: '#111', padding: '4px 12px' }}>游戏(G)　帮助(H)</div>

        {/* 计数器 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 14px',
            borderTop: '2px solid #8A8A8A',
            borderBottom: '2px solid #8A8A8A',
          }}
        >
          <div
            style={{
              background: '#000',
              color: '#FF3B30',
              fontFamily: 'monospace',
              fontSize: 24,
              padding: '0 8px',
              letterSpacing: 3,
            }}
          >
            009
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 4,
              background: 'radial-gradient(circle at 40% 35%, #FFE68A, #E8B62C)',
              border: '2px solid #8A6A10',
            }}
          />
          <div
            style={{
              background: '#000',
              color: '#FF3B30',
              fontFamily: 'monospace',
              fontSize: 24,
              padding: '0 8px',
              letterSpacing: 3,
            }}
          >
            000
          </div>
        </div>

        {/* 雷区 */}
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {Array.from({ length: SIZE }).map((_, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {Array.from({ length: SIZE }).map((__, c) => {
                const mine = isMine(c, r);
                const flagged = FLAGS.some(([fc, fr]) => fc === c && fr === r);
                const isBoomCell = c === 7 && r === 4;
                const revealed = mine
                  ? isBoomCell && exploding
                  : cellIndex++ < revealedBudget;

                const pop = revealed
                  ? spring({
                      frame: frame - (236 + (cellIndex / 74) * (explodeAt - 236)),
                      fps,
                      config: { damping: 200 },
                      durationInFrames: 8,
                    })
                  : 0;

                return (
                  <div
                    key={c}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: revealed ? '#BEBEBE' : '#C3C3C3',
                      borderTop: revealed ? '1px solid #8A8A8A' : '2px solid #FFFFFF',
                      borderLeft: revealed ? '1px solid #8A8A8A' : '2px solid #FFFFFF',
                      borderRight: revealed ? '1px solid #8A8A8A' : '2px solid #808080',
                      borderBottom: revealed ? '1px solid #8A8A8A' : '2px solid #808080',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 700,
                      color: NUM_COLOR[adjacent(c, r)] ?? '#111',
                      boxSizing: 'border-box',
                      transform: revealed ? `scale(${0.86 + 0.14 * pop})` : 'none',
                    }}
                  >
                    {revealed && !mine ? adjacent(c, r) || '' : null}
                    {!revealed && flagged ? (
                      <div style={{ position: 'relative', width: 26, height: 26 }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: 12,
                            top: 0,
                            width: 2,
                            height: 24,
                            background: '#111',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: 2,
                            top: 1,
                            width: 0,
                            height: 0,
                            borderTop: '7px solid transparent',
                            borderBottom: '7px solid transparent',
                            borderLeft: '14px solid #E0243A',
                          }}
                        />
                      </div>
                    ) : null}
                    {isBoomCell && exploding ? (
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle at 35% 30%, #5A5A5A, #0A0A0A)',
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 爆炸：火球 + 冲击波 */}
      {exploding ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 1100 - fireR,
              top: 602 - fireR,
              width: fireR * 2,
              height: fireR * 2,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #FFFFFF 0%, #FFD24A 14%, #FF8A1E 36%, #F03A0E 56%, rgba(190,20,10,0.5) 72%, rgba(190,20,10,0) 86%)',
              opacity: fireO,
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 1100 - fireR * 0.62,
              top: 602 - fireR * 0.62,
              width: fireR * 1.24,
              height: fireR * 1.24,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #FFFFFF 0%, #FFE98A 22%, #FFB030 44%, #FF5A18 62%, rgba(255,36,49,0) 82%)',
              opacity: fireO,
              zIndex: 41,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 1100 - ringR,
              top: 602 - ringR,
              width: ringR * 2,
              height: ringR * 2,
              borderRadius: '50%',
              border: '5px solid rgba(255,244,214,0.5)',
              opacity: fireO * 0.7,
              zIndex: 39,
            }}
          />
        </>
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFFDF6',
          opacity: flash,
          zIndex: 30,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

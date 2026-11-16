import React from 'react';

export type IconKind = 'computer' | 'bin' | 'mine' | 'cards';

const Glyph: React.FC<{ kind: IconKind }> = ({ kind }) => {
  if (kind === 'computer') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 10,
            width: 68,
            height: 52,
            borderRadius: 5,
            background: 'linear-gradient(160deg, #F4F6F8, #A8B4C2)',
            border: '1px solid #7C8794',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 6,
              width: 56,
              height: 38,
              borderRadius: 2,
              background: 'linear-gradient(150deg, #2F7BD8, #8FD0FF)',
              boxShadow: 'inset 0 0 12px rgba(255,255,255,0.55)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 61,
            width: 20,
            height: 8,
            background: 'linear-gradient(180deg, #C9D1DA, #8794A3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 68,
            width: 48,
            height: 7,
            borderRadius: 3,
            background: 'linear-gradient(180deg, #E4E9EF, #9AA6B4)',
          }}
        />
      </div>
    );
  }

  if (kind === 'bin') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 18,
            width: 52,
            height: 58,
            borderRadius: '6px 6px 10px 10px',
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.42) 0 6px, rgba(140,170,190,0.32) 6px 12px)',
            border: '2px solid rgba(255,255,255,0.75)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            width: 60,
            height: 14,
            borderRadius: 7,
            background: 'rgba(236,246,252,0.9)',
            border: '2px solid rgba(255,255,255,0.9)',
          }}
        />
      </div>
    );
  }

  if (kind === 'mine') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: 22,
            top: 22,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 34% 30%, #6C7480, #1B1E24 70%)',
            boxShadow: '0 0 2px #000',
          }}
        />
        {[0, 45, 90, 135].map((deg) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              left: 12,
              top: 40,
              width: 60,
              height: 4,
              background: '#22262D',
              transform: `rotate(${deg}deg)`,
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: 20,
          width: 44,
          height: 60,
          borderRadius: 5,
          background: '#F7F9FB',
          border: '1px solid #8A96A4',
          transform: 'rotate(-11deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 16,
          width: 44,
          height: 60,
          borderRadius: 5,
          background: '#FFFFFF',
          border: '1px solid #8A96A4',
          transform: 'rotate(9deg)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 15,
            width: 14,
            height: 14,
            background: '#E0243A',
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    </div>
  );
};

export const DesktopIcon: React.FC<{ kind: IconKind; label: string; x: number; y: number; delay?: number }> = ({
  kind,
  label,
  x,
  y,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 120, textAlign: 'center' }}>
    <div style={{ position: 'relative', width: 84, height: 84, margin: '0 auto' }}>
      <Glyph kind={kind} />
    </div>
    <div
      style={{
        marginTop: 4,
        fontSize: 22,
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadow: '1px 1px 3px rgba(0,0,0,0.85)',
      }}
    >
      {label}
    </div>
  </div>
);

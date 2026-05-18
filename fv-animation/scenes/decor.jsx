// scenes/decor.jsx
// 共通の装飾要素：電話フレーム、グリッド背景、シールドアイコン、
// パーティクル、浮遊UIチップ、スキャンライン。

// ── 電話フレーム ──
// 内側スクリーンに children を表示
function PhoneFrame({ width = 320, height = 660, glow = 0, screenScale = 1, children, tilt = 0 }) {
  const radius = 48;
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: 'transparent',
      padding: 0,
      boxShadow: 'none',
      transform: `rotate(${tilt}deg)`,
      transformStyle: 'preserve-3d',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: radius,
        overflow: 'hidden',
        position: 'relative',
        background: 'transparent',
      }}>
        <div style={{
          width: '100%', height: '100%',
          transform: `scale(${screenScale})`,
          transformOrigin: 'center',
        }}>
          {children}
        </div>
        {/* ノッチ */}
        <div style={{
          position: 'absolute', top: 8, left: '50%',
          transform: 'translateX(-50%)',
          width: 90, height: 24,
          background: 'rgba(0,0,0,0.92)',
          borderRadius: 14,
          zIndex: 100,
        }}/>
      </div>
    </div>
  );
}

// ── グリッド背景（サイバー） ──
function CyberGrid({ progress = 1, hue = 220 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(30,136,255,0.16) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30,136,255,0.16) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      maskImage: `radial-gradient(ellipse at 50% 50%, black ${progress * 70}%, transparent ${progress * 100}%)`,
      WebkitMaskImage: `radial-gradient(ellipse at 50% 50%, black ${progress * 70}%, transparent ${progress * 100}%)`,
      opacity: progress,
      pointerEvents: 'none',
    }}/>
  );
}

// ── 中央放射光 ──
function Radial({ intensity = 1, color = '30,136,255', size = 800 }) {
  return (
    <div style={{
      position: 'absolute',
      left: '50%', top: '50%',
      width: size, height: size,
      transform: 'translate(-50%, -50%)',
      background: `radial-gradient(circle, rgba(${color},${intensity * 0.6}) 0%, rgba(${color},0) 60%)`,
      pointerEvents: 'none',
      mixBlendMode: 'screen',
    }}/>
  );
}

// ── シールドアイコン ──
function Shield({ size = 80, progress = 1, locked = true }) {
  const path = "M50 5 L90 18 L90 50 Q90 80 50 95 Q10 80 10 50 L10 18 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{
      filter: `drop-shadow(0 0 ${20 * progress}px rgba(30,136,255,${progress * 0.9}))`,
    }}>
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5da9ff"/>
          <stop offset="100%" stopColor="#1e88ff"/>
        </linearGradient>
      </defs>
      <path d={path}
        fill="url(#shieldGrad)"
        opacity={progress}
        stroke="#fff" strokeWidth="1.5"
      />
      {locked ? (
        <g opacity={progress}>
          <rect x="38" y="44" width="24" height="20" rx="3" fill="#fff"/>
          <path d="M42 44 V36 a8 8 0 0 1 16 0 V44" stroke="#fff" strokeWidth="3" fill="none"/>
        </g>
      ) : (
        <g opacity={progress}>
          <rect x="38" y="44" width="24" height="20" rx="3" fill="#fff"/>
          <path d="M42 44 V36 a8 8 0 0 1 16 0" stroke="#fff" strokeWidth="3" fill="none"/>
        </g>
      )}
    </svg>
  );
}

// ── パーティクル爆発 ──
function ParticleBurst({ progress = 0, count = 24, color = '#1e88ff', maxRadius = 220 }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 2) * 0.1;
      return {
        angle,
        speed: 0.7 + Math.random() * 0.5,
        size: 2 + Math.random() * 4,
      };
    });
  }, [count]);
  if (progress <= 0 || progress >= 1) return null;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: 0, height: 0,
      pointerEvents: 'none',
    }}>
      {particles.map((p, i) => {
        const r = progress * p.speed * maxRadius;
        const x = Math.cos(p.angle) * r;
        const y = Math.sin(p.angle) * r;
        const op = (1 - progress) * 0.9;
        return (
          <div key={i} style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: color,
            left: x, top: y,
            opacity: op,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}/>
        );
      })}
    </div>
  );
}

// ── 浮遊UIチップ（背景の装飾要素） ──
function FloatingChip({ x, y, scale = 1, depth = 0, kind = 'shield', delay = 0 }) {
  const t = useTime();
  const float = Math.sin((t + delay) * 1.5) * 6 * (1 + depth);
  const blur = depth * 2;
  const opacity = 0.45 - depth * 0.15;

  const content = {
    shield: <ShieldChip />,
    lock: <LockChip />,
    code: <CodeChip />,
    fingerprint: <FpChip />,
    devices: <DevicesChip />,
    encrypted: <EncryptedChip />,
  }[kind];

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(-50%, -50%) translateY(${float}px) scale(${scale})`,
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: 'none',
    }}>
      {content}
    </div>
  );
}

function ChipCard({ children, accent = '#1e88ff' }) {
  return (
    <div style={{
      padding: '10px 14px',
      background: 'transparent',
      backdropFilter: 'none',
      border: `1px solid ${accent}40`,
      borderRadius: 10,
      color: '#cfe3ff',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 11,
      letterSpacing: '0.06em',
      boxShadow: 'none',
      whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
    </div>
  );
}

function ShieldChip() {
  return <ChipCard><Shield size={14} progress={1}/> SECURE</ChipCard>;
}
function LockChip() {
  return <ChipCard accent="#5da9ff">🔒 AES-256</ChipCard>;
}
function CodeChip() {
  return <ChipCard>0x4F7A · 0x9B2C</ChipCard>;
}
function FpChip() {
  return <ChipCard>● ● ● ● ● ●</ChipCard>;
}
function DevicesChip() {
  return <ChipCard accent="#7ab8ff">DEVICE 01 · 02 · 03</ChipCard>;
}
function EncryptedChip() {
  return <ChipCard>ENCRYPTED ✓</ChipCard>;
}

// ── スキャンライン ──
function Scanlines({ opacity = 0.08 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(255,255,255,${opacity}) 0px,
        rgba(255,255,255,${opacity}) 1px,
        transparent 1px,
        transparent 4px
      )`,
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    }}/>
  );
}

// ── 同心リング波 ──
function RingPulse({ progress = 0, color = '30,136,255', maxRadius = 380 }) {
  if (progress <= 0 || progress >= 1) return null;
  const r = progress * maxRadius;
  const op = (1 - progress) * 0.7;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: r * 2, height: r * 2,
      marginLeft: -r, marginTop: -r,
      borderRadius: '50%',
      border: `2px solid rgba(${color},${op})`,
      boxShadow: `0 0 30px rgba(${color},${op * 0.7}), inset 0 0 30px rgba(${color},${op * 0.5})`,
      pointerEvents: 'none',
    }}/>
  );
}

// ── キャッチコピー ──
function Caption({ text, accent = false, size = 36 }) {
  const { localTime, duration } = useSprite();
  const inDur = 0.35;
  const outDur = 0.35;
  const exitStart = duration - outDur;
  let opacity = 1, ty = 0;
  if (localTime < inDur) {
    const t = Easing.easeOutCubic(localTime / inDur);
    opacity = t; ty = (1 - t) * 14;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic((localTime - exitStart) / outDur);
    opacity = 1 - t; ty = -t * 8;
  }
  return (
    <div style={{
      opacity,
      transform: `translateY(${ty}px)`,
      textAlign: 'center',
      fontFamily: '"Hiragino Sans", "Noto Sans JP", "SF Pro Display", system-ui, sans-serif',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.02em',
      color: accent ? '#5da9ff' : '#fff',
      textShadow: 'none',
      lineHeight: 1.3,
    }}>
      {text}
    </div>
  );
}

Object.assign(window, {
  PhoneFrame, CyberGrid, Radial, Shield,
  ParticleBurst, FloatingChip, RingPulse,
  Scanlines, Caption,
});

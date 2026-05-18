// scenes/home-screen.jsx
// Android ホーム画面 — 銀河背景、時計、アプリアイコングリッド、ナビバー。

function HomeScreen({ revealProgress = 1 }) {
  // revealProgress: 0..1 — 各要素の段階的フェードイン用
  const r = (n) => Math.max(0, Math.min(1, (revealProgress - n) / 0.2));
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      color: '#fff',
    }}>
      {/* 銀河背景 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 30% 28%, rgba(180,150,255,0.45), transparent 45%),
          radial-gradient(ellipse at 70% 22%, rgba(255,180,210,0.3), transparent 50%),
          radial-gradient(ellipse at 50% 70%, rgba(255,200,140,0.2), transparent 55%),
          radial-gradient(ellipse at 50% 30%, rgba(80,40,140,0.6), transparent 65%),
          linear-gradient(180deg, #0a0612 0%, #1a0e26 60%, #1c1410 100%)
        `,
      }}/>
      {/* 星 */}
      <Stars count={60} />

      {/* ステータスバー（システム） */}
      <div style={{
        position: 'relative', zIndex: 1,
        height: 36, padding: '8px 22px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 14, fontWeight: 600,
      }}>
        <span>16:27</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <SignalDotsHome />
          <WifiHome />
          <BatteryHome pct={90} />
        </div>
      </div>

      {/* スマモ仮想OS用ステータスバー */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '8px 14px 0',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: 'rgba(255,255,255,0.7)',
        opacity: r(0.0),
      }}>
        <span style={{ display: 'flex', gap: 6 }}>
          16:27
          <span>🔕</span>
          <span style={{ color: '#1e88ff' }}>◇</span>
        </span>
        <span style={{ display: 'flex', gap: 6 }}>
          <span>↔</span>
          <span>⚡</span>
        </span>
      </div>

      {/* 時計 */}
      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', marginTop: 36,
        opacity: r(0.05),
        transform: `translateY(${(1 - r(0.05)) * 12}px)`,
      }}>
        <div style={{
          fontSize: 96, fontWeight: 200,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.95)',
          fontFamily: '"SF Pro Display", system-ui, sans-serif',
          lineHeight: 1,
        }}>16:27</div>
        <div style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.55)',
          marginTop: 6,
          letterSpacing: '0.05em',
        }}>4月15日(水)</div>
      </div>

      {/* アプリグリッド */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 90,
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: 22,
        padding: '0 22px',
      }}>
        {APP_ICONS.map((app, i) => (
          <AppIcon
            key={i}
            {...app}
            revealAt={r(0.15 + i * 0.04)}
          />
        ))}
      </div>

      {/* Dock */}
      <div style={{
        position: 'absolute', left: 22, right: 22, bottom: 38,
        zIndex: 1,
        height: 56,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: 16,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 14px',
        opacity: r(0.5),
        transform: `translateY(${(1 - r(0.5)) * 20}px)`,
      }}>
        {DOCK_ICONS.map((app, i) => (
          <DockIcon key={i} {...app} />
        ))}
      </div>

      {/* ナビバー */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 6,
        zIndex: 1,
        height: 28,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        opacity: r(0.6),
      }}>
        <NavBack /><NavHome /><NavRecent />
      </div>
    </div>
  );
}

const APP_ICONS = [
  { color: '#3a3f4a', symbol: '📁', label: 'ファイル' },
  { color: '#1e88ff', symbol: '🛡', label: 'Sec' },
  { color: '#e63946', symbol: '✉', label: 'Mail' },
  { color: '#264653', symbol: '🌐', label: 'Web' },
  { color: '#2a9d8f', symbol: '⌚', label: '時計' },
  { color: '#7b2cbf', symbol: '🎵', label: 'Music' },
  { color: '#f4a261', symbol: '📷', label: 'Camera' },
  { color: '#43aa8b', symbol: '💬', label: 'Chat' },
];

const DOCK_ICONS = [
  { color: '#229ED9', symbol: '✈' },   // Telegram
  { color: '#06C755', symbol: 'L' },   // LINE
  { color: '#FF6B35', symbol: '🦁' },  // Brave
  { color: '#34A853', symbol: '▶' },   // Play
];

function AppIcon({ color, symbol, label, revealAt = 1 }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      opacity: revealAt,
      transform: `translateY(${(1 - revealAt) * 12}px) scale(${0.85 + 0.15 * revealAt})`,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `linear-gradient(160deg, ${color} 0%, rgba(0,0,0,0.5) 130%), ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontSize: 22,
      }}>
        <span style={{ filter: 'saturate(1.2)' }}>{symbol}</span>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{label}</div>
    </div>
  );
}

function DockIcon({ color, symbol }) {
  return (
    <div style={{
      width: 42, height: 42, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700,
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      fontSize: 18,
    }}>{symbol}</div>
  );
}

function Stars({ count = 60 }) {
  const stars = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 60,
      r: Math.random() * 1.4 + 0.3,
      o: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 2 + 1,
      delay: Math.random() * 3,
    }));
  }, [count]);
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o}>
          <animate attributeName="opacity" values={`${s.o};${s.o * 0.2};${s.o}`}
            dur={`${s.tw}s`} begin={`${s.delay}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

function NavBack() {
  return <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="#fff" strokeWidth="1.4" fill="none"/></svg>;
}
function NavHome() {
  return <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>;
}
function NavRecent() {
  return <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>;
}

function SignalDotsHome() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11">
      <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#fff"/>
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#fff"/>
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#fff"/>
      <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#fff" opacity="0.3"/>
    </svg>
  );
}
function WifiHome() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" style={{ marginLeft: 4 }}>
      <path d="M8 11.5l-1.5-1.5a2.12 2.12 0 0 1 3 0L8 11.5zM5 8.5a4.24 4.24 0 0 1 6 0M2 5.5a8.49 8.49 0 0 1 12 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function BatteryHome({ pct = 90 }) {
  return (
    <div style={{
      marginLeft: 4,
      width: 32, height: 14,
      borderRadius: 4,
      background: '#fff',
      color: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700,
      position: 'relative',
    }}>
      {pct}
      <div style={{
        position: 'absolute', right: -2, top: 4, width: 2, height: 6,
        background: '#fff', borderRadius: 1,
      }}/>
    </div>
  );
}

Object.assign(window, { HomeScreen });

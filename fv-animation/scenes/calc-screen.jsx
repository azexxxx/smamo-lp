// scenes/calc-screen.jsx
// 電卓UI — スマモの偽装画面。ボタングリッドはスクショに合わせた配色。

const CALC_KEYS = [
  ['⌫', 'AC', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['+/−', '0', '·', '='],
];

// 単一キー
function CalcKey({ label, isOp, highlight, scale = 1, subtle = false }) {
  const isAC = label === 'AC';
  const baseBg = isOp ? '#eef2f7' : '#ffffff';
  const baseColor = isOp ? '#5b7a99' : '#3a587a';
  const glow = 'none';
  return (
    <div style={{
      width: 72, height: 72,
      borderRadius: '50%',
      background: baseBg,
      color: baseColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"SF Pro Display", -apple-system, system-ui, sans-serif',
      fontSize: isAC ? 22 : 28,
      fontWeight: 400,
      boxShadow: glow,
      transform: `scale(${scale})`,
      transition: 'box-shadow 80ms linear',
      opacity: subtle ? 0.55 : 1,
    }}>
      {label}
    </div>
  );
}

// 電卓画面まるごと。activeKey: 押下中のラベル / acPulse: AC強調回数(0..3) / display: 表示数値文字列
function CalcScreen({ display = '0', activeKey = null, acHighlight = false, dim = 0, operator = null }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f4f6fa',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      filter: dim > 0 ? `brightness(${1 - dim * 0.5})` : 'none',
    }}>
      {/* ステータスバー */}
      <div style={{
        height: 36, padding: '8px 22px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"SF Pro Display", system-ui, sans-serif',
        fontSize: 14, color: '#0a0a0a', fontWeight: 600,
      }}>
        <span>13:27</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <SignalDots />
          <WifiIcon />
          <BatteryPill pct={90} />
        </div>
      </div>

      {/* タイトル */}
      <div style={{
        textAlign: 'center', padding: '14px 0 8px',
        fontFamily: '"SF Pro Display", system-ui, sans-serif',
        fontSize: 16, color: '#222',
      }}>電卓</div>

      {/* 表示エリア */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: '0 32px 14px',
        fontFamily: '"SF Pro Display", system-ui, sans-serif',
        fontSize: 84, fontWeight: 300,
        color: '#0a0a0a',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        position: 'relative',
      }}>
        {operator && (
          <div style={{
            position: 'absolute', right: 32, top: 28,
            fontSize: 26, color: '#0a0a0a',
            fontWeight: 400,
          }}>{operator}</div>
        )}
        {display}
      </div>

      {/* キーグリッド */}
      <div style={{
        padding: '0 22px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        justifyItems: 'center',
      }}>
        {CALC_KEYS.flat().map((k, i) => {
          const isOp = ['⌫', 'AC', '%', '÷', '×', '−', '+', '='].includes(k);
          const active = activeKey === k;
          const highlight = (k === 'AC' && acHighlight);
          return (
            <CalcKey
              key={i}
              label={k}
              isOp={isOp}
              highlight={highlight}
              scale={active ? 0.92 : 1}
            />
          );
        })}
      </div>
    </div>
  );
}

// アイコン
function SignalDots() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11">
      <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#0a0a0a"/>
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#0a0a0a"/>
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#0a0a0a"/>
      <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#0a0a0a" opacity="0.3"/>
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" style={{ marginLeft: 4 }}>
      <path d="M8 11.5l-1.5-1.5a2.12 2.12 0 0 1 3 0L8 11.5zM5 8.5a4.24 4.24 0 0 1 6 0M2 5.5a8.49 8.49 0 0 1 12 0" stroke="#0a0a0a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function BatteryPill({ pct = 90 }) {
  return (
    <div style={{
      marginLeft: 4,
      width: 32, height: 14,
      borderRadius: 4,
      background: '#0a0a0a',
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700,
      position: 'relative',
    }}>
      {pct}
      <div style={{
        position: 'absolute', right: -2, top: 4, width: 2, height: 6,
        background: '#0a0a0a', borderRadius: 1,
      }}/>
    </div>
  );
}

Object.assign(window, { CalcScreen, CalcKey });

// scenes/security-break.jsx
// 電卓→デバイス画面の間に挟む「セキュリティ突破」演出。
// ロックアイコン → 解錠 → グリーンチェック → 突破フラッシュ。

function SecurityBreak({ progress = 0 }) {
  // progress 0..1
  // 0–0.25: ロック（閉）登場、シールドリング描画
  // 0.25–0.5: パスコード認証中（ドット流れる）
  // 0.5–0.7: ロック解除アニメーション（南京錠の柱がポップ）
  // 0.7–1.0: グリーンチェック → 突破フラッシュ
  if (progress <= 0 || progress >= 1) return null;

  const phase = progress;
  const lockShow = phase < 0.7 ? Math.min(1, phase / 0.15) : Math.max(0, 1 - (phase - 0.7) / 0.15);
  const unlockAnim = Math.max(0, Math.min(1, (phase - 0.45) / 0.25));
  const checkShow = phase > 0.65 ? Math.min(1, (phase - 0.65) / 0.15) : 0;
  const checkExit = phase > 0.92 ? (phase - 0.92) / 0.08 : 0;
  const ringScan = Math.min(1, phase / 0.5);
  const finalFlash = phase > 0.7 ? Math.min(1, (phase - 0.7) / 0.1) - Math.max(0, (phase - 0.85) / 0.15) : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 70,
      background: `radial-gradient(circle, rgba(5,12,24,${0.5 + phase * 0.3}) 0%, rgba(5,12,24,${0.2 + phase * 0.4}) 50%, transparent 80%)`,
    }}>
      {/* 中央スタック */}
      <div style={{
        position: 'relative',
        width: 220, height: 220,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* シールドリング（外側スキャン） */}
        <svg width="220" height="220" viewBox="0 0 220 220" style={{
          position: 'absolute', inset: 0,
        }}>
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5da9ff"/>
              <stop offset="100%" stopColor="#1e88ff"/>
            </linearGradient>
          </defs>
          {/* 外周リング */}
          <circle cx="110" cy="110" r="100"
            fill="none" stroke="rgba(30,136,255,0.3)" strokeWidth="1.5"/>
          {/* 走査リング（円弧） */}
          <circle cx="110" cy="110" r="100"
            fill="none" stroke="url(#ringGrad)" strokeWidth="3"
            strokeDasharray={`${ringScan * 628} 628`}
            transform="rotate(-90 110 110)"
            style={{ filter: 'drop-shadow(0 0 8px #1e88ff)' }}/>
          {/* 内周破線 */}
          <circle cx="110" cy="110" r="80"
            fill="none" stroke="rgba(93,169,255,0.5)" strokeWidth="1"
            strokeDasharray="3 4"
            style={{ transformOrigin: '110px 110px', animation: 'smamoSpinSlow 4s linear infinite' }}/>
        </svg>

        {/* ロック → 解錠 → チェック */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{
          position: 'relative',
          opacity: lockShow,
          filter: `drop-shadow(0 0 ${20 * lockShow}px rgba(30,136,255,${lockShow * 0.9}))`,
        }}>
          <defs>
            <linearGradient id="lockGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5da9ff"/>
              <stop offset="100%" stopColor="#1e88ff"/>
            </linearGradient>
          </defs>
          {/* シールド本体 */}
          <path d="M60 10 L100 22 L100 56 Q100 88 60 108 Q20 88 20 56 L20 22 Z"
            fill="url(#lockGrad)"
            stroke="#fff" strokeWidth="1.5"/>
          {/* 南京錠 ボディ */}
          <rect x="44" y="56" width="32" height="28" rx="4" fill="#fff"/>
          {/* 南京錠 柱（unlockAnim で持ち上がる） */}
          <path d={
            unlockAnim < 1
              ? `M48 56 V48 a12 12 0 0 1 24 0 V56`
              : `M48 56 V44 a12 12 0 0 1 24 -4 V42`
          }
            fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"
            transform={`translate(0 ${-unlockAnim * 8}) rotate(${unlockAnim * 12} 60 50)`}/>
          {/* 鍵穴 */}
          <circle cx="60" cy="68" r="3" fill="#1e88ff"/>
          <rect x="59" y="68" width="2" height="8" fill="#1e88ff"/>
        </svg>

        {/* グリーンチェック（解錠後に被せる） */}
        {checkShow > 0 && (
          <svg width="120" height="120" viewBox="0 0 120 120" style={{
            position: 'absolute',
            opacity: Math.max(0, checkShow - checkExit),
            transform: `scale(${0.6 + checkShow * 0.5})`,
            filter: `drop-shadow(0 0 30px rgba(62,224,127,${checkShow * 0.9}))`,
          }}>
            <circle cx="60" cy="60" r="46" fill="#3ee07f" opacity="0.95"/>
            <path d="M40 62 L54 76 L82 46"
              fill="none" stroke="#0a2818" strokeWidth="8"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="80"
              strokeDashoffset={80 - Math.min(1, checkShow * 1.4) * 80}/>
          </svg>
        )}

        {/* 認証ドットの周回 */}
        {phase > 0.2 && phase < 0.7 && (
          <div style={{
            position: 'absolute', width: 200, height: 200,
            animation: 'smamoSpin 1.5s linear infinite',
          }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              const x = Math.cos(a) * 100 + 100;
              const y = Math.sin(a) * 100 + 100;
              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: x, top: y,
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#5da9ff',
                  boxShadow: '0 0 10px #1e88ff',
                  marginLeft: -3, marginTop: -3,
                  opacity: 0.4 + (i / 6) * 0.6,
                }}/>
              );
            })}
          </div>
        )}
      </div>

      {/* テキストラベル */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: '24%',
        textAlign: 'center',
        color: phase < 0.7 ? '#5da9ff' : '#3ee07f',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 13,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        fontWeight: 700,
        textShadow: phase < 0.7
          ? '0 0 12px rgba(30,136,255,0.9)'
          : '0 0 12px rgba(62,224,127,0.9)',
        opacity: phase > 0.05 && phase < 0.95 ? 1 : 0,
      }}>
        {phase < 0.45 ? 'AUTHENTICATING…'
          : phase < 0.65 ? 'VERIFYING KEY…'
          : 'ACCESS GRANTED'}
      </div>

      {/* 全画面フラッシュ */}
      {finalFlash > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle, rgba(255,255,255,${finalFlash * 0.85}) 0%, rgba(62,224,127,${finalFlash * 0.5}) 25%, rgba(30,136,255,${finalFlash * 0.3}) 50%, transparent 70%)`,
        }}/>
      )}
    </div>
  );
}

Object.assign(window, { SecurityBreak });

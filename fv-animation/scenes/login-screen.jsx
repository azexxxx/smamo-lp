// scenes/login-screen.jsx
// スマモのログイン画面（ダーク）。アクセントは #1E88FF。

function LoginScreen({ pwLength = 0, buttonPressed = false, unlocked = false }) {
  const dots = '●'.repeat(Math.min(pwLength, 8));
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0c1018',
      display: 'flex', flexDirection: 'column',
      color: '#fff',
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ステータスバー */}
      <div style={{
        height: 36, padding: '8px 22px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 14, fontWeight: 600,
      }}>
        <span>16:27</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <SignalDotsDark />
          <WifiIconDark />
          <BatteryPillDark pct={90} />
        </div>
      </div>

      {/* ヘッダー */}
      <div style={{
        padding: '18px 24px 0',
        display: 'flex', alignItems: 'center',
        position: 'relative',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M14 4l-7 7 7 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{
          position: 'absolute', left: 0, right: 0, textAlign: 'center',
          fontSize: 19, fontWeight: 600,
        }}>ログイン</div>
      </div>

      {/* フォーム */}
      <div style={{ padding: '40px 26px 0' }}>
        <Field
          label="メールアドレス"
          value="test6@gmail.com"
          focused={false}
        />
        <Field
          label="パスワード"
          value={dots}
          focused={true}
          showCaret={pwLength === 0}
          showEye
          mono
        />

        {/* ログインボタン */}
        <button style={{
          width: '100%',
          marginTop: 26,
          padding: '16px 0',
          background: unlocked
            ? 'linear-gradient(180deg, #5da9ff 0%, #1e88ff 100%)'
            : '#1e88ff',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontSize: 16, fontWeight: 700,
          fontFamily: 'inherit',
          transform: buttonPressed ? 'scale(0.97)' : 'scale(1)',
          boxShadow: unlocked
            ? '0 0 40px rgba(30,136,255,0.7), 0 0 0 2px rgba(30,136,255,0.3)'
            : 'none',
          transition: 'transform 80ms, box-shadow 200ms',
          cursor: 'pointer',
        }}>
          ログイン
        </button>

        <div style={{
          textAlign: 'center', marginTop: 18,
          fontSize: 13, color: 'rgba(255,255,255,0.6)',
        }}>
          アカウントをお持ちでない場合 <span style={{ color: '#1e88ff', fontWeight: 600 }}>新規登録</span>
        </div>
        <div style={{
          textAlign: 'center', marginTop: 22,
          fontSize: 13, color: 'rgba(255,255,255,0.85)',
        }}>
          パスワードを忘れた場合
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, focused, showCaret, showEye, mono }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        height: 50,
        borderRadius: 10,
        background: '#1a1f2a',
        border: focused ? '1.5px solid #fff' : '1px solid #2a2f3c',
        padding: '0 14px',
        display: 'flex', alignItems: 'center',
        position: 'relative',
      }}>
        <span style={{
          fontFamily: mono ? 'JetBrains Mono, ui-monospace, monospace' : 'inherit',
          fontSize: 15,
          letterSpacing: mono ? '0.1em' : 'normal',
          color: '#fff',
        }}>{value}</span>
        {showCaret && (
          <span style={{
            display: 'inline-block',
            width: 1.5, height: 18,
            background: '#fff',
            marginLeft: 2,
            animation: 'smamoCaret 1s steps(2) infinite',
          }}/>
        )}
        {showEye && (
          <svg width="20" height="20" viewBox="0 0 20 20" style={{ marginLeft: 'auto' }} fill="none">
            <path d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#9aa3b2" strokeWidth="1.4"/>
            <circle cx="10" cy="10" r="2" stroke="#9aa3b2" strokeWidth="1.4"/>
            <line x1="3" y1="3" x2="17" y2="17" stroke="#9aa3b2" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </div>
  );
}

function SignalDotsDark() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11">
      <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#fff"/>
      <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#fff"/>
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#fff"/>
      <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#fff" opacity="0.3"/>
    </svg>
  );
}
function WifiIconDark() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" style={{ marginLeft: 4 }}>
      <path d="M8 11.5l-1.5-1.5a2.12 2.12 0 0 1 3 0L8 11.5zM5 8.5a4.24 4.24 0 0 1 6 0M2 5.5a8.49 8.49 0 0 1 12 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function BatteryPillDark({ pct = 90 }) {
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

Object.assign(window, { LoginScreen });

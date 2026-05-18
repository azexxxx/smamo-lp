// scenes/line-screens.jsx
// プライベートLINE（iOS）と仕事用LINE（Android）のトーク画面。

function LineScreen({ mode = 'private', scrollOffset = 0 }) {
  // mode: 'private' (iOS, 家族・友達) / 'work' (Android, 取引先)
  const isWork = mode === 'work';
  const headerBg = isWork ? '#06C755' : '#06C755';
  const messages = isWork ? WORK_MESSAGES : PRIVATE_MESSAGES;
  const title = isWork ? '田中部長' : 'あいちゃん 💛';
  const subtitle = isWork ? '取引先' : '';

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#8da9c4',
      backgroundImage: isWork
        ? 'linear-gradient(180deg, #8a9bb0 0%, #6a7d92 100%)'
        : 'linear-gradient(180deg, #b8d4e8 0%, #8da9c4 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Hiragino Sans", "Noto Sans JP", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 該当OSのステータスバー */}
      {isWork ? <AndroidStatusBar/> : <IOSStatusBarLocal/>}

      {/* LINEヘッダー */}
      <div style={{
        background: headerBg,
        padding: '8px 14px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
        color: '#fff',
      }}>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <path d="M14 4l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: isWork ? '#3a4a5c' : '#ffb3d9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700,
          color: isWork ? '#fff' : '#7a3050',
        }}>
          {isWork ? '田' : 'あ'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, opacity: 0.85 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 18 }}>📞</span>
          <span style={{ fontSize: 18 }}>📹</span>
          <span style={{ fontSize: 18 }}>≡</span>
        </div>
      </div>

      {/* タイムスタンプ */}
      <div style={{
        textAlign: 'center', padding: '10px 0',
        fontSize: 11, color: 'rgba(255,255,255,0.85)',
        fontWeight: 500,
      }}>
        {isWork ? '今日 13:25' : '今日 13:22'}
      </div>

      {/* メッセージリスト */}
      <div style={{
        flex: 1,
        padding: '0 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
        transform: `translateY(${-scrollOffset}px)`,
        transition: 'transform 200ms',
      }}>
        {messages.map((m, i) => (
          <Message key={i} {...m}/>
        ))}
      </div>

      {/* 入力バー */}
      <div style={{
        background: '#fff',
        padding: '8px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 22, color: '#666' }}>＋</span>
        <span style={{ fontSize: 22, color: '#666' }}>📷</span>
        <div style={{
          flex: 1,
          height: 32,
          background: '#f0f0f0',
          borderRadius: 16,
          padding: '0 14px',
          display: 'flex', alignItems: 'center',
          fontSize: 13, color: '#999',
        }}>
          メッセージを入力
        </div>
        <span style={{ fontSize: 22, color: '#666' }}>😊</span>
      </div>

      {/* OS別のフッター */}
      {isWork ? (
        <div style={{
          height: 28, background: '#000',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          color: '#fff', fontSize: 14,
        }}>
          <span>◀</span>
          <span>●</span>
          <span>■</span>
        </div>
      ) : (
        <div style={{
          height: 16, display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: '#fff',
        }}>
          <div style={{ width: 120, height: 4, borderRadius: 2, background: '#0a0a0a' }}/>
        </div>
      )}
    </div>
  );
}

const PRIVATE_MESSAGES = [
  { text: 'おはよう〜🌸', from: 'them' },
  { text: '今日のお昼どうする？', from: 'them' },
  { text: 'パスタ食べたい！', from: 'me', readBy: '既読' },
  { text: 'いいね！駅前のお店？', from: 'them' },
  { text: 'うん、12時集合で🍝', from: 'me', readBy: '既読' },
  { text: '了解✨', from: 'them' },
];

const WORK_MESSAGES = [
  { text: '先日の見積書、確認しました。', from: 'them' },
  { text: '修正点を3点送ります。', from: 'them' },
  { text: '承知しました。', from: 'me', readBy: '既読' },
  { text: '本日中に対応いたします。', from: 'me', readBy: '既読' },
  { text: 'よろしくお願いします。', from: 'them' },
  { text: '会議は明日14時で。', from: 'them' },
];

function Message({ text, from, readBy }) {
  const me = from === 'me';
  return (
    <div style={{
      display: 'flex',
      flexDirection: me ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 6,
    }}>
      <div style={{
        maxWidth: '70%',
        background: me ? '#85e063' : '#fff',
        color: '#0a0a0a',
        padding: '8px 12px',
        borderRadius: 16,
        fontSize: 13,
        lineHeight: 1.4,
      }}>
        {text}
      </div>
      {me && readBy && (
        <div style={{
          fontSize: 9, color: 'rgba(255,255,255,0.85)',
          marginBottom: 2,
        }}>
          {readBy}<br/>13:24
        </div>
      )}
    </div>
  );
}

function IOSStatusBarLocal() {
  return (
    <div style={{
      height: 36, padding: '8px 22px 0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: '"SF Pro Display", system-ui, sans-serif',
      fontSize: 14, color: '#0a0a0a', fontWeight: 600,
      background: '#fff',
    }}>
      <span>13:24</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill="#0a0a0a"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="#0a0a0a"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="#0a0a0a"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="#0a0a0a" opacity="0.3"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" style={{ marginLeft: 4 }}>
          <path d="M8 11.5l-1.5-1.5a2.12 2.12 0 0 1 3 0L8 11.5zM5 8.5a4.24 4.24 0 0 1 6 0M2 5.5a8.49 8.49 0 0 1 12 0" stroke="#0a0a0a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{
          marginLeft: 4, width: 32, height: 14, borderRadius: 4,
          background: '#0a0a0a', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, position: 'relative',
        }}>
          90
          <div style={{
            position: 'absolute', right: -2, top: 4, width: 2, height: 6,
            background: '#0a0a0a', borderRadius: 1,
          }}/>
        </div>
      </div>
    </div>
  );
}

function AndroidStatusBar() {
  return (
    <div style={{
      height: 28, padding: '6px 14px 0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 12, fontWeight: 600, color: '#fff',
      background: 'transparent',
    }}>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        16:27
        <span style={{ fontSize: 10 }}>🔕</span>
      </span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="14" height="10" viewBox="0 0 14 10">
          <rect x="0" y="6" width="2.5" height="4" fill="#fff"/>
          <rect x="3.5" y="4" width="2.5" height="6" fill="#fff"/>
          <rect x="7" y="2" width="2.5" height="8" fill="#fff"/>
          <rect x="10.5" y="0" width="2.5" height="10" fill="#fff"/>
        </svg>
        <span style={{ fontSize: 11 }}>90%</span>
      </div>
    </div>
  );
}

Object.assign(window, { LineScreen, AndroidStatusBar });

// scenes/android-home.jsx
// Androidホーム画面（実画像ベース）。LINEドックアイコン位置にタップ演出。

function AndroidHome({ tapping = false, tapProgress = 0, revealProgress = 1 }) {
  // 画像サイズ 856x1856。LINEドックアイコン中心: 横 50% / 縦 92%
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
    }}>
      <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.androidHome) || "assets/android-home.jpg"} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        opacity: revealProgress,
        transform: `scale(${0.96 + revealProgress * 0.04})`,
      }}/>

      {/* 解放時のグロー */}
      {revealProgress < 1 ? null : null}

      {/* LINEアイコンタップ */}
      {tapping && (
        <TapHighlight
          x="50%" y="86%"
          size={56}
          progress={tapProgress}
        />
      )}
    </div>
  );
}

Object.assign(window, { AndroidHome });

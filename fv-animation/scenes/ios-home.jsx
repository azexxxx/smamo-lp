// scenes/ios-home.jsx
// iPhoneホーム画面（実画像ベース）。電卓アプリ位置にタップ演出を重ねる。

function IOSHome({ tapping = false, tapProgress = 0 }) {
  // 計算機アイコンの位置: 画像内 (右下のグリッド最終列、4行目)
  // 画像サイズ 868x1880。1:1正方形フレームに合わせて縦カバー表示。
  // フレーム上での比率位置（画像の見え方ベース）:
  //   計算機アイコン中心: 横 87% / 縦 50%
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
    }}>
      <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.iosHome) || "assets/ios-home.jpg"} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      }}/>

      {/* 計算機アイコンのタップ演出 */}
      {tapping && (
        <TapHighlight
          x="84%" y="49%"
          size={58}
          progress={tapProgress}
        />
      )}
    </div>
  );
}

// タップ波紋＋ハイライト
function TapHighlight({ x, y, size = 64, progress = 0 }) {
  // progress 0..1 で：
  //   0–0.3 リング拡大＋アイコン縮小
  //   0.3–0.7 アイコン光る
  //   0.7–1.0 全体フラッシュ
  const ringP = 0;
  const flash = 0;
  const ringSize = size + ringP * 60;
  const ringOp = (1 - ringP) * 0.9;
  const iconScale = progress < 0.3
    ? 1 - progress / 0.3 * 0.12
    : 0.88 + Math.min(1, (progress - 0.3) / 0.4) * 0.12;

  return (
    <>
      {/* 波紋リング */}
      <div style={{
        position: 'absolute',
        left: x, top: y,
        width: ringSize, height: ringSize,
        marginLeft: -ringSize / 2, marginTop: -ringSize / 2,
        borderRadius: '50%',
        border: 'none',
        boxShadow: 'none',
        pointerEvents: 'none',
      }}/>
      {/* アイコンハイライト（指のタップ感） */}
      <div style={{
        position: 'absolute',
        left: x, top: y,
        width: size, height: size,
        marginLeft: -size / 2, marginTop: -size / 2,
        borderRadius: 14,
        background: `rgba(255,255,255,${progress < 0.4 ? progress / 0.4 * 0.25 : 0.25 - (progress - 0.4) * 0.4})`,
        boxShadow: 'none',
        transform: `scale(${iconScale})`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}/>
      {/* タップ指先（小さい円） */}
      {progress < 0.5 && (
        <div style={{
          position: 'absolute',
          left: x, top: y,
          width: 36, height: 36,
          marginLeft: -18, marginTop: -18,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: 'none',
          opacity: 1 - progress / 0.5,
          transform: `scale(${1 - progress / 0.5 * 0.3})`,
          pointerEvents: 'none',
        }}/>
      )}
      {/* 全画面フラッシュ */}
      {flash > 0 ? null : null}
    </>
  );
}

Object.assign(window, { IOSHome, TapHighlight });

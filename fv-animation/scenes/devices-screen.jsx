// scenes/devices-screen.jsx
// スマモのデバイス一覧画面（実画像ベース）。

function DevicesScreen({ selectedIndex = -1, selectProgress = 0 }) {
  // 画像内の device1(2) 行: 縦 約 22%
  // 画像内の device1   行: 縦 約 32%
  const rows = [
    { y: '20%' },
    { y: '30%' },
  ];
  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
    }}>
      <img src={(typeof window !== 'undefined' && window.__resources && window.__resources.devicesList) || "assets/devices.jpg"} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      }}/>

      {/* 選択ハイライト */}
      {selectedIndex >= 0 && rows[selectedIndex] && (
        <DeviceTapHighlight y={rows[selectedIndex].y} progress={selectProgress}/>
      )}
    </div>
  );
}

function DeviceTapHighlight({ y, progress }) {
  const glow = 0;
  const flash = 0;
  return (
    <>
      <div style={{
        position: 'absolute',
        left: '5%', right: '5%',
        top: y,
        height: '7%',
        marginTop: '-3.5%',
        borderRadius: 14,
        border: 'none',
        boxShadow: 'none',
        background: 'transparent',
        pointerEvents: 'none',
      }}/>
      {/* タップの指 */}
      {progress < 0.5 && (
        <div style={{
          position: 'absolute',
          left: '50%', top: y,
          width: 38, height: 38,
          marginLeft: -19, marginTop: -19,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: 'none',
          opacity: 1 - progress / 0.5,
          pointerEvents: 'none',
        }}/>
      )}
      {flash > 0 ? null : null}
    </>
  );
}

Object.assign(window, { DevicesScreen });

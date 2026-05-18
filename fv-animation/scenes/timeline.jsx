// scenes/timeline.jsx
// スマモのストーリー（v3：18秒・1:1・ループ・全体スロー化）
//
// セグメント（秒）:
//  0.0–3.0   S1 プライベートLINE（あいちゃん）
//  3.0–4.4   S2 戻る → iPhoneホーム遷移
//  4.4–6.4   S3 iOSホーム → 電卓アプリにタップ
//  6.4–8.6   S4 電卓を普通に使う（2+2=4）
//  8.6–10.4  S5 AC×3 → パスワード入力
// 10.4–11.6  S6 シールドが一瞬光る（電卓→デバイス遷移）
// 11.6–13.4  S7 デバイス一覧 → device1(2) を選択
// 13.4–15.4  S8 Androidホーム解放 → LINEタップ
// 15.4–17.4  S9 仕事用LINE
// 17.4–18.0  S10 ループ繋ぎ

const T = {
  S1: [0.0, 3.0],
  S2: [3.0, 4.4],
  S3: [4.4, 6.4],
  S4: [6.4, 8.6],
  S5: [8.6, 10.4],
  S6: [10.4, 11.6],
  S7: [11.6, 13.4],
  S8: [13.4, 15.4],
  S9: [15.4, 17.4],
  S10: [17.4, 18.0],
};

function inSeg(time, [a, b]) { return time >= a && time < b; }
function localProgress(time, [a, b]) {
  return Math.max(0, Math.min(1, (time - a) / (b - a)));
}

const CALC_TAPS = [
  // S4: 2+2=4 を普通に押す
  { t: 6.80, key: '2' },
  { t: 7.30, key: '+' },
  { t: 7.80, key: '2' },
  { t: 8.30, key: '=' },
  // S5: AC×3 → パスワード
  { t: 8.70, key: 'AC' },
  { t: 8.95, key: 'AC' },
  { t: 9.20, key: 'AC' },
  { t: 9.55, key: '1' },
  { t: 9.80, key: '9' },
  { t: 10.05, key: '8' },
  { t: 10.25, key: '4' },
];

function activeKeyAt(time, dur = 0.18) {
  for (const tap of CALC_TAPS) {
    if (time >= tap.t && time < tap.t + dur) return tap.key;
  }
  return null;
}

function calcDisplay(time) {
  if (time < 6.80) return '0';
  if (time < 7.30) return '2';
  if (time < 7.80) return '2';   // + 押した直後も 2 のまま
  if (time < 8.30) return '2';   // 2 を押す
  if (time < 8.70) return '4';   // = で答え
  return '0';
}

function calcOperator(time) {
  // 表示中の演算子（薄く右上に見せる）
  if (time >= 7.30 && time < 8.30) return '+';
  return null;
}

function SmamoTimeline() {
  const time = useTime();

  const inS1 = inSeg(time, T.S1);
  const inS2 = inSeg(time, T.S2);
  const inS3 = inSeg(time, T.S3);
  const inS4 = inSeg(time, T.S4);
  const inS5 = inSeg(time, T.S5);
  const inS6 = inSeg(time, T.S6);
  const inS7 = inSeg(time, T.S7);
  const inS8 = inSeg(time, T.S8);
  const inS9 = inSeg(time, T.S9);
  const inS10 = inSeg(time, T.S10);

  const p1 = localProgress(time, T.S1);
  const p2 = localProgress(time, T.S2);
  const p3 = localProgress(time, T.S3);
  const p5 = localProgress(time, T.S5);
  const p6 = localProgress(time, T.S6);
  const p7 = localProgress(time, T.S7);
  const p8 = localProgress(time, T.S8);
  const p10 = localProgress(time, T.S10);

  // ── 画面の可視性 ──
  let privateLineOpacity = 0, privateLineScale = 1;
  if (inS1) {
    privateLineOpacity = p1 < 0.08 ? p1 / 0.08 : 1;
    if (p1 > 0.92) privateLineOpacity = 1 - (p1 - 0.92) / 0.08 * 0.3;
  } else if (inS2 && p2 < 0.4) {
    privateLineOpacity = Math.max(0, 1 - p2 / 0.4);
    privateLineScale = 1 - p2 / 0.4 * 0.06;
  } else if (inS10) {
    privateLineOpacity = Math.min(1, p10 * 1.6);
    privateLineScale = 0.96 + p10 * 0.04;
  }

  let iosHomeOpacity = 0, iosHomeScale = 1;
  if (inS2 && p2 > 0.3) {
    const t = Easing.easeOutCubic((p2 - 0.3) / 0.7);
    iosHomeOpacity = Math.min(1, t * 1.6);
    iosHomeScale = 1.06 - t * 0.06;
  } else if (inS3) {
    iosHomeOpacity = 1;
    if (p3 > 0.7) {
      const z = (p3 - 0.7) / 0.3;
      iosHomeScale = 1 + z * 0.08;
      if (p3 > 0.88) iosHomeOpacity = Math.max(0, 1 - (p3 - 0.88) / 0.12);
    }
  }

  let calcOpacity = 0, calcScale = 1;
  if (inS3 && p3 > 0.85) {
    calcOpacity = (p3 - 0.85) / 0.15;
    calcScale = 0.94 + ((p3 - 0.85) / 0.15) * 0.06;
  } else if (inS4 || inS5) {
    calcOpacity = 1;
  } else if (inS6 && p6 < 0.5) {
    calcOpacity = Math.max(0, 1 - p6 / 0.5);
    calcScale = 1 + p6 / 0.5 * 0.04;
  }

  let devicesOpacity = 0, devicesScale = 1;
  if (inS6 && p6 > 0.55) {
    devicesOpacity = Math.min(1, (p6 - 0.55) / 0.35);
    devicesScale = 0.96 + devicesOpacity * 0.04;
  } else if (inS7) {
    devicesOpacity = p7 < 0.8 ? 1 : Math.max(0, 1 - (p7 - 0.8) / 0.2);
  }

  let androidOpacity = 0, androidReveal = 0, androidScale = 1;
  if (inS7 && p7 > 0.7) {
    androidOpacity = Math.min(1, (p7 - 0.7) / 0.3);
    androidReveal = androidOpacity;
    androidScale = 0.96 + androidOpacity * 0.04;
  } else if (inS8) {
    androidOpacity = 1;
    androidReveal = 1;
    if (p8 > 0.8) {
      const z = (p8 - 0.8) / 0.2;
      androidOpacity = Math.max(0, 1 - z);
    }
  }

  let workLineOpacity = 0, workLineScale = 1;
  if (inS8 && p8 > 0.88) {
    workLineOpacity = Math.min(1, (p8 - 0.88) / 0.12);
    workLineScale = 0.96 + workLineOpacity * 0.04;
  } else if (inS9) {
    workLineOpacity = 1;
    if (p10 > 0) workLineOpacity = 1;
  } else if (inS10) {
    workLineOpacity = Math.max(0, 1 - p10 * 1.6);
  }

  // ── タップ ──
  const iosTapping = inS3 && p3 > 0.3;
  const iosTapProgress = iosTapping ? Math.min(1, (p3 - 0.3) / 0.55) : 0;

  const deviceSelectedIdx = inS7 && p7 > 0.25 && p7 < 0.85 ? 0 : -1;
  const deviceSelectProgress = inS7 ? Math.min(1, Math.max(0, (p7 - 0.25) / 0.45)) : 0;

  const androidTapping = inS8 && p8 > 0.35 && p8 < 0.95;
  const androidTapProgress = inS8 ? Math.min(1, Math.max(0, (p8 - 0.35) / 0.5)) : 0;

  const activeKey = activeKeyAt(time);
  const acHighlight = inS5 && p5 < 0.4
    && (Math.floor((time - T.S5[0]) * 8) % 2 === 0);
  const display = calcDisplay(time);

  // ── シールド一瞬光る演出（テキストなし、画面切替なし） ──
  // S6全体で：シールドアイコンが電卓上に重なって光る → フェードアウト
  const shieldFlash = 0;

  // フレームグロー
  const frameGlow = 0;

  // 背景
  const cyber = 0;

  return (
    <>
      <BackgroundLayer cyber={cyber}/>

      <div style={{
        position: 'absolute', left: '50%', top: -14,
        transform: 'translateX(-50%)',
        zIndex: 5,
      }}>
        <PhoneFrame width={298} height={632} glow={frameGlow}>
          <div style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent' }}>
            {privateLineOpacity > 0 && (
              <ScreenLayer opacity={privateLineOpacity} scale={privateLineScale}>
                <LineScreen mode="private"/>
              </ScreenLayer>
            )}
            {iosHomeOpacity > 0 && (
              <ScreenLayer opacity={iosHomeOpacity} scale={iosHomeScale}>
                <IOSHome tapping={iosTapping} tapProgress={iosTapProgress}/>
              </ScreenLayer>
            )}
            {calcOpacity > 0 && (
              <ScreenLayer opacity={calcOpacity} scale={calcScale}>
                <CalcScreen
                  display={display}
                  activeKey={activeKey}
                  acHighlight={acHighlight}
                  operator={calcOperator(time)}
                />
              </ScreenLayer>
            )}
            {devicesOpacity > 0 && (
              <ScreenLayer opacity={devicesOpacity} scale={devicesScale}>
                <DevicesScreen
                  selectedIndex={deviceSelectedIdx}
                  selectProgress={deviceSelectProgress}
                />
              </ScreenLayer>
            )}
            {androidOpacity > 0 && (
              <ScreenLayer opacity={androidOpacity} scale={androidScale}>
                <AndroidHome
                  tapping={androidTapping}
                  tapProgress={androidTapProgress}
                  revealProgress={androidReveal}
                />
              </ScreenLayer>
            )}
            {workLineOpacity > 0 && (
              <ScreenLayer opacity={workLineOpacity} scale={workLineScale}>
                <LineScreen mode="work"/>
              </ScreenLayer>
            )}

            {/* シンプルなシールド光演出 */}
            {shieldFlash > 0.05 && (
              <ShieldFlash intensity={shieldFlash}/>
            )}
          </div>
        </PhoneFrame>
      </div>

      <CaptionLayer/>
    </>
  );
}

// 画面に被せる、シールドが一瞬光るだけの演出
function ShieldFlash({ intensity = 1 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      background: `radial-gradient(circle, rgba(30,136,255,${intensity * 0.35}) 0%, rgba(30,136,255,${intensity * 0.15}) 40%, transparent 70%)`,
      zIndex: 50,
    }}>
      <Shield size={130 + intensity * 30} progress={intensity} locked={false}/>
    </div>
  );
}

function ScreenLayer({ opacity, scale = 1, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    }}>
      {children}
    </div>
  );
}

function BackgroundLayer({ cyber }) {
  return null;
}

function CaptionLayer() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: -72,
      zIndex: 20,
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <Sprite start={0.5} end={2.8}>
        <Caption text="ふだん使いの、いつものスマホ。" size={18}/>
      </Sprite>
      <Sprite start={4.7} end={6.4}>
        <Caption text="でも、電卓には秘密がある。" size={18} accent/>
      </Sprite>
      <Sprite start={8.8} end={10.4}>
        <Caption text="電卓画面でパスワードを入力。" size={18} accent/>
      </Sprite>
      <Sprite start={11.8} end={13.4}>
        <Caption text="あなただけの、もう一台へ。" size={18}/>
      </Sprite>
      <Sprite start={13.6} end={15.4}>
        <Caption text="仕事用 Android、起動。" size={18}/>
      </Sprite>
      <Sprite start={15.6} end={17.4}>
        <Caption text="1台で、2つのLINE。" size={18} accent/>
      </Sprite>
    </div>
  );
}

Object.assign(window, { SmamoTimeline });

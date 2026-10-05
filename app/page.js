"use client";

import { useState } from "react";
import MyokoCard from "@/components/MyokoCard";
import MapPanel from "@/components/MapPanel";

const spot = {
  title: "妙高高原",
  area: "MYOKO KOGEN",
  number: "CARD 01",
  coordinates: [138.177, 36.87],
  description:
    "山の稜線と水辺に映る空。カードを手に、妙高高原の静かな景色を探しに行こう。",
};

export default function Home() {
  const [cardOpen, setCardOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ページの先頭へ">
          <span className="brand-mark" aria-hidden="true">妙</span>
          <span>
            <strong>妙高カードマップ</strong>
            <small>カードから広がる、妙高めぐり</small>
          </span>
        </a>
        <button className="header-cta" onClick={() => scrollTo("map")}>地図をひらく</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-copy">
          <p className="eyebrow">MYOKO CARD × DIGITAL MAP</p>
          <h1>
            一枚のカードから、<br />
            <span>妙高を歩きたくなる。</span>
          </h1>
          <p className="lead">
            気になった風景をスマホの裏へ。カードの場所をデジタルマップで見つけて、次の妙高へ出かけよう。
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo("card")}>カードを見る</button>
            <button className="text-button" onClick={() => scrollTo("map")}>地図から探す <span>↗</span></button>
          </div>
          <div className="hero-note">
            <span className="note-dot" />
            <p><strong>PROTOTYPE 01</strong>　妙高高原をカードにしました</p>
          </div>
        </div>

        <div className="hero-visual" aria-label="妙高高原カードのプレビュー">
          <div className="logo-sticker">
            <img src="/campaign-logo.png" alt="妙高、好きになりました。カードから広がる、妙高めぐり" />
          </div>
          <div className="hero-card-wrap">
            <MyokoCard compact onClick={() => setCardOpen(true)} />
          </div>
          <p className="tap-hint"><span>↗</span> タップしてカードを拡大</p>
        </div>
      </section>

      <section className="card-section" id="card">
        <div className="section-heading">
          <p className="eyebrow green">THE FIRST CARD</p>
          <h2>妙高高原を、<br />持ち歩く。</h2>
          <p>
            景色の印象を主役にした、スマートフォンの背面に入るカード。表面は「この場所へ行ってみたい」と感じる入口です。
          </p>
          <dl className="card-specs">
            <div><dt>場所</dt><dd>妙高高原</dd></div>
            <div><dt>テーマ</dt><dd>山・水辺・空</dd></div>
            <div><dt>ナビゲーター</dt><dd>妙高市キャラクター</dd></div>
          </dl>
          <button className="primary-button dark" onClick={() => setCardOpen(true)}>カード表面を拡大</button>
        </div>
        <div className="card-stage">
          <div className="stage-ring" />
          <MyokoCard onClick={() => setCardOpen(true)} />
          <span className="stage-label label-one">PHOTO</span>
          <span className="stage-label label-two">PLACE</span>
          <span className="stage-label label-three">DISCOVERY</span>
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="map-heading">
          <div>
            <p className="eyebrow light">FROM CARD TO PLACE</p>
            <h2>カードの景色を、<br />地図で見つける。</h2>
          </div>
          <p>
            カード裏面のQRコードから、この画面へ。撮影エリアの位置や見どころを確認できる体験を想定しています。
          </p>
        </div>
        <MapPanel spot={spot} onShowCard={() => setCardOpen(true)} />
      </section>

      <section className="journey-section">
        <p className="eyebrow green">HOW IT WORKS</p>
        <h2>小さなカードが、<br />次の行き先をつくる。</h2>
        <div className="journey-grid">
          <article><span>01</span><h3>選ぶ</h3><p>気になった妙高の風景を、カードとして選ぶ。</p></article>
          <article><span>02</span><h3>読み取る</h3><p>カード裏面のQRコードから、デジタルマップへ。</p></article>
          <article><span>03</span><h3>めぐる</h3><p>地図で場所を知り、実際の妙高を訪れてみる。</p></article>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark small">妙</span><strong>妙高、好きになりました。</strong></div>
        <p>カードから広がる、妙高めぐり｜デジタルマップ プロトタイプ</p>
      </footer>

      {cardOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="妙高高原カード拡大表示" onClick={() => setCardOpen(false)}>
          <button className="modal-close" aria-label="閉じる" onClick={() => setCardOpen(false)}>×</button>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <MyokoCard />
          </div>
        </div>
      )}
    </main>
  );
}

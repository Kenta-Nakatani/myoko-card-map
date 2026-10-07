"use client";

import { useEffect, useRef, useState } from "react";
import MyokoCard from "@/components/MyokoCard";
import MapPanel from "@/components/MapPanel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;
const spot = {
  title: "妙高高原", area: "新潟県 妙高市", number: "01",
  coordinates: [138.177, 36.87],
  description: "山と水辺に空が映る、妙高高原の風景。カードの写真を眺めながら、周辺の位置を地図で確かめてみてください。",
};
const seasons = [
  { name: "春", image: "/season-spring.png", alt: "春の妙高に咲くカタクリ", caption: "足元に、春の色。" },
  { name: "夏", image: "/season-summer.png", alt: "緑豊かな夏の妙高高原と水辺", caption: "緑と水辺の、妙高高原。" },
  { name: "秋", image: "/season-autumn.png", alt: "紅葉に染まる秋の妙高の湿原", caption: "山の景色が、色づく季節。" },
  { name: "冬", image: "/season-winter.png", alt: "雪に包まれた冬の妙高山", caption: "雪に包まれる、山の輪郭。" },
];

export default function Home() {
  const [season, setSeason] = useState(1);
  const [cardOpen, setCardOpen] = useState(false);
  const dialog = useRef(null);
  const current = seasons[season];
  useEffect(() => {
    if (!cardOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, [cardOpen]);

  return (
    <>
      <a className="skip-link" href="#main">本文へ移動</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ページの先頭へ"><img src={asset("/campaign-logo.png")} alt="妙高、好きになりました。" width="210" height="100" /></a>
        <nav aria-label="ページ内メニュー"><a href="#seasons">四季の景色</a><a className="header-map" href="#map">地図を見る <span aria-hidden="true">↗</span></a></nav>
      </header>
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img className="hero-photo" src={asset("/season-summer.png")} alt="緑豊かな妙高高原の水辺" fetchPriority="high" />
          <div className="hero-content"><p className="section-label">新潟県・妙高市</p><h1 id="hero-title">カードの先に、<br />妙高の景色。</h1><p className="hero-description">手元の一枚から、気になった場所へ。<br />写真と地図で、妙高をめぐる。</p><a className="button light" href="#map">カードの場所を地図で見る <span aria-hidden="true">↗</span></a></div>
          <a className="hero-scroll" href="#seasons">四季の景色へ <span aria-hidden="true">↓</span></a><span className="hero-location">妙高高原 ／ 夏の風景</span>
        </section>
        <section className="seasons-section section-wrap" id="seasons" aria-labelledby="seasons-title">
          <div className="section-intro"><p className="section-label">01 ／ 妙高の四季</p><h2 id="seasons-title">季節が変わる。<br />景色も変わる。</h2><p>花の咲く春、緑の夏、紅葉の秋、雪の冬。<br className="desktop-break" />同じ妙高でも、季節ごとに違う表情があります。</p></div>
          <div className="season-viewer"><div className="season-controls" role="group" aria-label="見たい季節を選ぶ">{seasons.map((item, index) => <button key={item.name} type="button" aria-pressed={season === index} aria-controls="season-photo" onClick={() => setSeason(index)}><span className="season-number" aria-hidden="true">0{index + 1}</span>{item.name}</button>)}</div><figure id="season-photo"><img src={asset(current.image)} alt={current.alt} loading="lazy" width="1200" height="750" /><figcaption aria-live="polite"><span>{current.name}の妙高</span><span>{current.caption}</span></figcaption></figure></div>
        </section>
        <section className="map-section" id="map" aria-labelledby="map-title"><div className="section-wrap"><div className="map-heading"><div><p className="section-label">02 ／ カードから地図へ</p><h2 id="map-title">この景色は、どこに？</h2></div><p>地図の「01」を選ぶと、カードの情報を確認できます。<br />まずは妙高高原の位置を見てみましょう。</p></div><MapPanel spot={spot} onShowCard={() => setCardOpen(true)} /></div></section>
        <section className="card-section section-wrap" id="card" aria-labelledby="card-title"><div className="card-stage"><MyokoCard onClick={() => setCardOpen(true)} /><p>カードをタップして拡大</p></div><div className="card-copy"><p className="section-label">03 ／ 手元に残る風景</p><h2 id="card-title">妙高を、持ち歩く。</h2><p>気になった風景を、スマートフォンの背面へ。<br />カード裏面のQRコードが、景色と場所をつなぎます。</p><dl className="card-specs"><div><dt>カード</dt><dd>01 ／ 妙高高原</dd></div><div><dt>風景</dt><dd>山・水辺・空</dd></div><div><dt>使い方</dt><dd>QRを読み取って、地図で場所を確認</dd></div></dl><button className="button" type="button" onClick={() => setCardOpen(true)}>カードを大きく見る <span aria-hidden="true">↗</span></button></div></section>
        <section className="guide-section" aria-labelledby="guide-title"><div className="section-wrap"><p className="section-label">カードの楽しみ方</p><h2 id="guide-title">一枚から、次の行き先へ。</h2><ol className="guide-list"><li><span>01</span><h3>風景を選ぶ</h3><p>気になった妙高の景色を、手元のカードに。</p></li><li><span>02</span><h3>場所を知る</h3><p>QRを読み取り、地図と写真を見比べる。</p></li><li><span>03</span><h3>出かけてみる</h3><p>気になった場所を、次の妙高めぐりのきっかけに。</p></li></ol></div></section>
      </main>
      <footer><div><strong>妙高、好きになりました。</strong><p>カードから広がる、妙高めぐり</p></div><a href="#top">ページの先頭へ ↑</a></footer>
      {cardOpen && <dialog ref={dialog} className="card-dialog" aria-label="妙高高原カード拡大表示" onCancel={() => setCardOpen(false)} onClose={() => setCardOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setCardOpen(false); }}><button className="modal-close" type="button" onClick={() => setCardOpen(false)} autoFocus aria-label="カード拡大を閉じる">閉じる ×</button><MyokoCard /></dialog>}
    </>
  );
}

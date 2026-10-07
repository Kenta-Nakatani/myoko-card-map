"use client";

import { useEffect, useRef, useState } from "react";
import MyokoCard from "@/components/MyokoCard";
import MapPanel from "@/components/MapPanel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;
const storageKey = "myoko-card-collection-v1";
const cards = [
  { id: "01", title: "妙高高原", subtitle: "新潟県・妙高市 ／ イモリ池", image: "/myoko-kogen.jpg", alt: "山と水辺に空が映る妙高高原の風景", description: "山と水辺、そこに映る空。お気に入りの景色から、妙高をめぐろう。", ready: true, hasMap: true, mapTitle: "妙高高原・イモリ池", coordinates: [138.17495544011348, 36.86665932452338] },
  { id: "02", title: "まちなかぷらす", subtitle: "妙高のまちなかへ", image: "/machinaka-exterior.png", alt: "まちなかぷらすの建物の外観", description: "建物の外観と、明るい店内の風景をご紹介します。", ready: true, hasMap: true, coordinates: [138.25236321131223, 37.02609500621803], secondImage: "/machinaka-interior.png", secondAlt: "テーブルとカウンターがあるまちなかぷらすの店内", secondCaption: "店内の風景" },
  { id: "03", title: "かんずり", subtitle: "お店と、妙高の味", image: "/kanzuri-shop.png", alt: "唐辛子のオブジェが並ぶかんずりのお店", description: "お店の風景と、かんずりの一瓶をご紹介します。", ready: true, hasMap: true, coordinates: [138.26897622886597, 37.03011861770585], secondImage: "/kanzuri-product.png", secondAlt: "かんずりの瓶入り商品", secondCaption: "かんずりの一瓶" },
  { id: "04", title: "和光", subtitle: "お店と、お菓子の風景", image: "/wako-exterior.png", alt: "和光菓子店の外観", description: "お店の外観と、ショーケースに並ぶお菓子をご紹介します。", ready: true, hasMap: true, coordinates: [138.252215015007, 37.02447811132342], secondImage: "/wako-sweets.png", secondAlt: "和光のショーケースに並ぶお菓子", secondCaption: "ショーケースのお菓子" },
];
const seasons = [
  { name: "春", location: "斐太歴史の里", note: "森林セラピーロード", image: "/season-spring.png", alt: "春の妙高に咲くカタクリ", caption: "足元に、春の色。" },
  { name: "夏", location: "いもり池", image: "/season-summer.png", alt: "緑豊かな夏の妙高高原と水辺", caption: "緑と水辺の、妙高高原。" },
  { name: "秋", location: "火打山", note: "日本百名山・花の百名山", image: "/season-autumn.png", alt: "紅葉に染まる秋の妙高の湿原", caption: "山の景色が、色づく季節。" },
  { name: "冬", location: "妙高市内スキー場", image: "/season-winter.png", alt: "雪に包まれた冬の妙高山", caption: "雪に包まれる、山の輪郭。" },
];

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === "map" ? <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z" /><path d="M9 3v16M15 5v16" /></> : name === "book" ? <><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z" /><path d="M12 5v15" /></> : <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="m7 15 4-5 3 3 3-2M8 18h8" /><circle cx="16" cy="7" r="1" /></>}</svg>;
}

export default function Home() {
  const [view, setView] = useState("card");
  const [season, setSeason] = useState(1);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedId, setSelectedId] = useState("01");
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(null);
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const current = seasons[season];
  const selectedCard = cards.find((card) => card.id === selectedId) || cards[0];
  const saved = savedIds.includes(selectedCard.id);

  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (Array.isArray(stored)) setSavedIds(stored.filter((id) => cards.some((card) => card.id === id && card.ready))); } catch { /* Storage can be unavailable on some devices. */ }
    setLoaded(true);
    function readHash() { setView(location.hash === "#map" ? "map" : location.hash === "#book" ? "book" : "card"); }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const element = dialogRef.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, [modal]);

  function navigate(next) {
    setView(next);
    location.hash = next === "card" ? "top" : next;
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  function openCard(id) { setSelectedId(id); setMessage(""); navigate("card"); }

  function saveCard() {
    if (!selectedCard.ready) return;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const existing = Array.isArray(stored) ? stored.filter((id) => cards.some((card) => card.id === id && card.ready)) : savedIds;
      const next = [...new Set([...existing, ...savedIds, selectedCard.id])];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSavedIds(next);
      setMessage(`${selectedCard.title}を、ずかんに追加しました。`);
    } catch { setMessage("このブラウザでは保存できませんでした。保存設定をご確認ください。"); }
  }

  return <div className="pocket-app">
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className="pocket-header"><button className="pocket-brand" onClick={() => navigate("card")} aria-label="カードの画面へ"><img src={asset("/campaign-logo.png")} alt="妙高、好きになりました。 カードから広がる、妙高めぐり" width="960" height="508" /></button><button className="help-button" aria-label="使い方を見る" onClick={() => setModal("help")}>?</button></header>
    <main id="main" className={`pocket-main view-${view}`}>
      {view === "card" && <section className="pocket-home" aria-labelledby="page-title">
        <p className="eyebrow">MYOKO CARD {selectedCard.id}</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>一枚から、妙高へ。</h1><p className="intro-line">手元の風景を、もう少し知ってみる。</p>
        <div className="pocket-card-stage">{selectedCard.ready ? <><MyokoCard card={selectedCard} onClick={() => setModal("card")} /><span className="card-stage-caption">カードをタップして、ポップアップで見る</span></> : <div className="planned-card"><Icon name="card" /><p>写真を準備しています</p><strong>{selectedCard.title}</strong></div>}</div>
        <div className="pocket-card-info"><span className="small-label">{selectedCard.subtitle}</span><h2>{selectedCard.title}</h2><p>{selectedCard.description || "写真と紹介文がそろったら、ここからご紹介します。"}</p></div>
        <div className="home-actions">{selectedCard.hasMap ? <button className="pocket-button sunshine" onClick={() => navigate("map")}><Icon name="map" />この場所を地図で見る<span aria-hidden="true">↗</span></button> : <p className="pending-location">{selectedCard.ready ? "お店の場所は、確認でき次第ご案内します。" : "掲載準備中"}</p>}<button className="pocket-button outline" disabled={!loaded || saved || !selectedCard.ready} onClick={saveCard}><Icon name="book" />{!selectedCard.ready ? "掲載まで、もう少し" : saved ? "ずかんに保存済み" : "ずかんに保存する"}{saved && <span aria-hidden="true">✓</span>}</button></div>
        <p role="status" className="save-status">{message}</p><p className="device-note">保存したカードは、このブラウザで見返せます。</p>
        {selectedCard.id === "01" && <section className="pocket-seasons" aria-labelledby="season-title"><p className="eyebrow">季節の便り</p><h2 id="season-title">同じ妙高、ちがう表情。</h2><div className="pocket-season-tabs" role="group" aria-label="見たい季節を選ぶ">{seasons.map((item, index) => <button key={item.name} aria-pressed={index === season} onClick={() => setSeason(index)}>{item.name}</button>)}</div><figure><img src={asset(current.image)} alt={`${current.location}：${current.alt}`} width="900" height="550" loading="lazy" /><figcaption aria-live="polite"><strong className="season-location">{current.location}</strong>{current.note && <span className="season-location-note">（{current.note}）</span>}<span className="season-caption">{current.caption}</span></figcaption></figure></section>}
        {selectedCard.secondImage && <section className="shop-gallery" aria-labelledby="gallery-title"><p className="eyebrow">もう少し、見てみる。</p><h2 id="gallery-title">{selectedCard.secondCaption}</h2>{selectedCard.id === "02" && <figure><img src={asset(selectedCard.image)} alt={selectedCard.alt} loading="lazy" /><figcaption>外観の風景</figcaption></figure>}<figure><img src={asset(selectedCard.secondImage)} alt={selectedCard.secondAlt} loading="lazy" /><figcaption>{selectedCard.secondCaption}</figcaption></figure></section>}
      </section>}
      {view === "map" && <section aria-labelledby="page-title" className="pocket-map-page"><p className="eyebrow">景色に、会いに。</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>妙高の地図</h1><p className="intro-line">番号や場所の名前から、カードの場所を見てみよう。</p><p className="map-gesture-hint">指2本で地図を移動。右上の＋／−で拡大・縮小できます。</p><MapPanel spots={cards} activeId={selectedId} onSelect={setSelectedId} onShowCard={() => setModal("card")} /></section>}
      {view === "book" && <section aria-labelledby="page-title" className="pocket-book"><p className="eyebrow">私の、小さな旅の記録。</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>妙高ずかん</h1><p className="collection-count" aria-live="polite">{savedIds.length}<span> / {cards.length} 枚</span></p><p className="intro-line">保存したカードと、これから出会う場所。</p><div className="collection-grid">{cards.map((card) => <button key={card.id} className={`collection-item ${savedIds.includes(card.id) ? "collected" : "uncollected"}`} onClick={() => openCard(card.id)} aria-label={`${card.title}${card.ready ? "のカードを見る" : "の掲載予定を見る"}`}>{card.image ? <img src={asset(card.image)} alt={card.alt} /> : <div className="empty-card"><Icon name="card" /><span>写真を準備中</span></div>}<div><span>{card.id} ／ {savedIds.includes(card.id) ? "保存済み" : card.ready ? "保存できます" : "掲載予定"}</span><h2>{card.title}</h2><p>{card.ready ? "カードを見る →" : "もう少し、お待ちください →"}</p></div></button>)}</div><p className="collection-note">風景も、お店も。気になった一枚を保存して、<br />あなただけの妙高ずかんに。</p><p className="device-note">このブラウザに保存されます。閲覧データを削除すると、保存記録も消えます。</p></section>}
    </main>
    <nav className="pocket-nav" aria-label="メインメニュー">{[{ id: "card", label: "カード" }, { id: "map", label: "地図" }, { id: "book", label: "ずかん" }].map((item) => <button key={item.id} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><Icon name={item.id} /><span>{item.label}</span></button>)}</nav>
    {modal && <dialog className={`pocket-dialog ${modal === "card" ? "card-dialog" : "help-dialog"} ${modal === "card" && ["03", "04"].includes(selectedCard.id) ? "shop-card-dialog" : ""}`} ref={dialogRef} aria-label={modal === "card" ? `${selectedCard.title}カード拡大表示` : "妙高カードの楽しみ方"} onCancel={() => setModal(null)} onClose={() => setModal(null)} onClick={(event) => { if (event.target === event.currentTarget) setModal(null); }}><button className="modal-close" autoFocus onClick={() => setModal(null)} aria-label="閉じる">閉じる ×</button>{modal === "card" ? <MyokoCard card={selectedCard} /> : <><p className="eyebrow">ようこそ、妙高へ。</p><h2>カードから、<br />景色に出会う。</h2><ol><li><strong>カードを眺める</strong><p>手元の一枚から、お気に入りの風景へ。</p></li><li><strong>場所を知る</strong><p>地図で、イモリ池の位置を確かめる。</p></li><li><strong>ずかんに残す</strong><p>カードを保存して、この端末で見返す。</p></li></ol><button className="pocket-button sunshine" onClick={() => setModal(null)}>はじめる →</button></>}</dialog>}
  </div>;
}

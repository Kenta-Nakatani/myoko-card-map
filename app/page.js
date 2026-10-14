"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MyokoCard from "@/components/MyokoCard";
import MapPanel from "@/components/MapPanel";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;
const storageKey = "myoko-card-collection-v2";
function readCollection() {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || "{}"); return value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).filter(([id, date]) => cards.some((card) => card.id === id) && typeof date === "string" && !Number.isNaN(Date.parse(date)))) : {}; } catch { return {}; }
}
function directions(card) { return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(card.coordinates[1] + "," + card.coordinates[0]); }
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
  const [collection, setCollection] = useState({});
  const [qrCardId, setQrCardId] = useState(null);
  const [registeredId, setRegisteredId] = useState(null);
  const [invalidLink, setInvalidLink] = useState(false);
  const [selectedId, setSelectedId] = useState("01");
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(null);
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const current = seasons[season];
  const selectedCard = cards.find((card) => card.id === selectedId) || cards[0];
  const savedIds = Object.keys(collection);
  const saved = savedIds.includes(selectedCard.id);
  const canRegister = loaded && qrCardId === selectedCard.id;
  const nextCards = cards.filter((card) => !savedIds.includes(card.id) && card.id !== selectedCard.id).sort((a, b) => Math.hypot(a.coordinates[0] - selectedCard.coordinates[0], a.coordinates[1] - selectedCard.coordinates[1]) - Math.hypot(b.coordinates[0] - selectedCard.coordinates[0], b.coordinates[1] - selectedCard.coordinates[1]));

  useEffect(() => {
    setCollection(readCollection());
    function readLocation() {
      const params = new URLSearchParams(location.search);
      const id = params.get("card");
      const valid = cards.some((card) => card.id === id);
      setInvalidLink(id !== null && !valid);
      if (valid) setSelectedId(id);
      if (valid && params.get("source") === "qr") setQrCardId(id);
      setView(location.hash === "#map" ? "map" : location.hash === "#book" ? "book" : "card");
    }
    readLocation();
    setLoaded(true);
    window.addEventListener("hashchange", readLocation);
    window.addEventListener("popstate", readLocation);
    return () => { window.removeEventListener("hashchange", readLocation); window.removeEventListener("popstate", readLocation); };
  }, []);

  useEffect(() => {
    if (!modal) return;
    const element = dialogRef.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, [modal]);

  function navigate(next, id = selectedId) {
    setView(next);
    setSelectedId(id);
    history.pushState(null, "", location.pathname + "?card=" + id + "#" + (next === "card" ? "top" : next));
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  const selectMapCard = useCallback((id) => { setSelectedId(id); history.replaceState(null, "", location.pathname + "?card=" + id + "#map"); }, []);

  function openCard(id) { setMessage(""); setRegisteredId(null); navigate("card", id); }

  function saveCard() {
    if (!canRegister || saved) return;
    try {
      const next = { ...readCollection(), ...collection, [selectedCard.id]: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(next));
      setCollection(next);
      setRegisteredId(selectedCard.id);
      setMessage(selectedCard.title + "のカードを図鑑に登録しました。");
    } catch { setMessage("登録できませんでした。このブラウザの保存設定をご確認ください。"); }
  }

  return <div className="pocket-app">
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className="pocket-header"><button className="pocket-brand" onClick={() => navigate("card")} aria-label="カードの画面へ"><img src={asset("/campaign-logo.png")} alt="妙高、好きになりました。 カードから広がる、妙高めぐり" width="960" height="508" /></button><button className="help-button" aria-label="使い方を見る" onClick={() => setModal("help")}>?</button></header>
    <main id="main" className={`pocket-main view-${view}`}>{invalidLink && <p className="link-notice" role="alert">このカード番号は見つかりません。図鑑から場所を選ぶか、カードのQRをもう一度読み取ってください。</p>}
      {view === "card" && <section className="pocket-home" aria-labelledby="page-title">
        <p className="eyebrow">MYOKO CARD {selectedCard.id}</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>一枚から、妙高へ。</h1><p className="intro-line">現地でカードを受け取って、あなただけの図鑑へ。</p>{canRegister && !saved && <p className="qr-arrival">{selectedCard.title}のカードを読み取りました。<br />下の「図鑑に登録する」で1枚を残せます。</p>}
        <div className="pocket-card-stage">{selectedCard.ready ? <><MyokoCard card={selectedCard} onClick={() => setModal("card")} /><span className="card-stage-caption">カードをタップして、ポップアップで見る</span></> : <div className="planned-card"><Icon name="card" /><p>写真を準備しています</p><strong>{selectedCard.title}</strong></div>}</div>
        <div className="pocket-card-info"><span className="small-label">{selectedCard.subtitle}</span><h2>{selectedCard.title}</h2><p>{selectedCard.description || "写真と紹介文がそろったら、ここからご紹介します。"}</p></div>
        <div className="home-actions">
          {saved ? <p className="registered-label">✓ 図鑑に登録済み · {new Date(collection[selectedCard.id]).toLocaleDateString("ja-JP")}</p> : canRegister ? <button className="pocket-button sunshine" disabled={!loaded} onClick={saveCard}><Icon name="book" />図鑑に登録する</button> : <div className="registration-hint"><strong>このカードは、まだ未登録です。</strong><p>現地で受け取った紙のカードのQRから登録できます。</p></div>}
          <button className="pocket-button outline" onClick={() => navigate("map")}><Icon name="map" />この場所を地図で見る</button>
          <a className="pocket-button outline" href={directions(selectedCard)} target="_blank" rel="noreferrer">ここへの行き方 ↗</a>
        </div>
        <p role="status" className="save-status">{message}</p>
        {registeredId === selectedCard.id && <section className="registration-success" aria-label="登録後の案内"><p className="collection-count">{savedIds.length}<span> / 4 枚</span></p><h2>{savedIds.length === 4 ? "4枚がそろいました。" : "次は、どこに行ってみる？"}</h2><p>{savedIds.length === 4 ? "集めた妙高のカードを、図鑑で見返してみましょう。" : "気になる場所を選んで、次の一枚へ。"}</p>{nextCards.slice(0,2).map((card) => <button className="next-place" key={card.id} onClick={() => openCard(card.id)}><img src={asset(card.image)} alt="" /><span>{card.title}を見る →</span></button>)}<button className="pocket-button outline" onClick={() => navigate("book")}>図鑑を見る</button></section>}
        <p className="device-note">登録記録はこのブラウザに残ります。以前の試作の保存記録とは別に記録します。</p><p className="distribution-note">カードの配布場所・時間は現在準備中です。</p>

        {selectedCard.id === "01" && <section className="pocket-seasons" aria-labelledby="season-title"><p className="eyebrow">季節の便り</p><h2 id="season-title">同じ妙高、ちがう表情。</h2><div className="pocket-season-tabs" role="group" aria-label="見たい季節を選ぶ">{seasons.map((item, index) => <button key={item.name} aria-pressed={index === season} onClick={() => setSeason(index)}>{item.name}</button>)}</div><figure><img src={asset(current.image)} alt={`${current.location}：${current.alt}`} width="900" height="550" loading="lazy" /><figcaption aria-live="polite"><strong className="season-location">{current.location}</strong>{current.note && <span className="season-location-note">（{current.note}）</span>}<span className="season-caption">{current.caption}</span></figcaption></figure></section>}
        {selectedCard.secondImage && <section className="shop-gallery" aria-labelledby="gallery-title"><p className="eyebrow">もう少し、見てみる。</p><h2 id="gallery-title">{selectedCard.secondCaption}</h2>{selectedCard.id === "02" && <figure><img src={asset(selectedCard.image)} alt={selectedCard.alt} loading="lazy" /><figcaption>外観の風景</figcaption></figure>}<figure><img src={asset(selectedCard.secondImage)} alt={selectedCard.secondAlt} loading="lazy" /><figcaption>{selectedCard.secondCaption}</figcaption></figure></section>}
      </section>}
      {view === "map" && <section aria-labelledby="page-title" className="pocket-map-page"><p className="eyebrow">景色に、会いに。</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>妙高の地図</h1><p className="intro-line">番号や場所の名前から、カードの場所を見てみよう。</p><p className="map-gesture-hint">指2本で地図を移動。右上の＋／−で拡大・縮小できます。</p><MapPanel spots={cards} activeId={selectedId} onSelect={selectMapCard} onShowCard={() => setModal("card")} /></section>}
      {view === "book" && <section aria-labelledby="page-title" className="pocket-book"><p className="eyebrow">私の、小さな旅の記録。</p><h1 id="page-title" ref={headingRef} tabIndex={-1}>妙高ずかん</h1><p className="collection-count" aria-live="polite">{savedIds.length}<span> / {cards.length} 枚</span></p><p className="intro-line">紙のカードのQRを読んで、4枚を集めよう。</p><div className="collection-grid">{cards.map((card) => <button key={card.id} className={`collection-item ${savedIds.includes(card.id) ? "collected" : "uncollected qr-unregistered"}`} onClick={() => openCard(card.id)} aria-label={`${card.title}${card.ready ? "のカードを見る" : "の掲載予定を見る"}`}>{card.image ? <img src={asset(card.image)} alt={card.alt} /> : <div className="empty-card"><Icon name="card" /><span>写真を準備中</span></div>}<div><span>{card.id} ／ {savedIds.includes(card.id) ? "登録済み" : card.ready ? "未登録" : "掲載予定"}</span><h2>{card.title}</h2><p>{savedIds.includes(card.id) ? new Date(collection[card.id]).toLocaleDateString("ja-JP") + " 登録" : "紹介を見る →"}</p></div></button>)}</div><p className="collection-note">紹介はどなたでも見られます。<br />現地で受け取ったカードのQRから、図鑑に登録できます。</p><p className="device-note">同じブラウザで見返せます。閲覧データを削除すると登録記録も消えます。登録数は訪問の証明ではありません。</p></section>}
    </main>
    <nav className="pocket-nav" aria-label="メインメニュー">{[{ id: "card", label: "カード" }, { id: "map", label: "地図" }, { id: "book", label: "ずかん" }].map((item) => <button key={item.id} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><Icon name={item.id} /><span>{item.label}</span></button>)}</nav>
    {modal && <dialog className={`pocket-dialog ${modal === "card" ? "card-dialog" : "help-dialog"} ${modal === "card" && ["03", "04"].includes(selectedCard.id) ? "shop-card-dialog" : ""}`} ref={dialogRef} aria-label={modal === "card" ? `${selectedCard.title}カード拡大表示` : "妙高カードの楽しみ方"} onCancel={() => setModal(null)} onClose={() => setModal(null)} onClick={(event) => { if (event.target === event.currentTarget) setModal(null); }}><button className="modal-close" autoFocus onClick={() => setModal(null)} aria-label="閉じる">閉じる ×</button>{modal === "card" ? <MyokoCard card={selectedCard} /> : <><p className="eyebrow">ようこそ、妙高へ。</p><h2>カードから、<br />景色に出会う。</h2><ol><li><strong>カードを眺める</strong><p>手元の一枚から、お気に入りの風景へ。</p></li><li><strong>場所を知る</strong><p>気になる場所の紹介と行き方を確認する。</p></li><li><strong>QRから登録する</strong><p>紙のカードのQRを読み、図鑑に登録。次の場所を選んでみよう。</p></li></ol><button className="pocket-button sunshine" onClick={() => setModal(null)}>はじめる →</button></>}</dialog>}
  </div>;
}

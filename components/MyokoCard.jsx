const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;

export default function MyokoCard({ compact = false, onClick, card }) {
  const title = card?.title || "妙高高原";
  const number = card?.id || "01";
  const Element = onClick ? "button" : "div";
  return (
    <Element
      className={`myoko-card ${compact ? "compact" : ""} ${title.length > 5 ? "long-title" : ""}`}
      onClick={onClick}
      aria-label={onClick ? `${title}カードを拡大表示` : `${title}カード`}
      type={onClick ? "button" : undefined}
    >
      <img className="card-photo" src={asset(card?.image || "/myoko-kogen.jpg")} alt={card?.alt || "山と水辺に空が映る妙高高原の風景"} />
      <span className="card-shade" />
      <span className="card-topline">
        <span>{title}</span>
        <span>{number}</span>
      </span>
      <span className="card-title">
        <small>新潟県 妙高市</small>
        <strong>{title}</strong>
      </span>
      {(!card || card.id === "01") && <span className="mascot-sticker">
        <img src={asset("/myoko-mascot.png")} alt="妙高市のキャラクター" />
      </span>}
    </Element>
  );
}

export default function MyokoCard({ compact = false, onClick }) {
  return (
    <button
      className={`myoko-card ${compact ? "compact" : ""}`}
      onClick={onClick}
      aria-label="妙高高原カードを拡大表示"
      type="button"
    >
      <img className="card-photo" src="/myoko-kogen.jpg" alt="山と水辺に空が映る妙高高原の風景" />
      <span className="card-shade" />
      <span className="card-topline">
        <span>MYOKO KOGEN</span>
        <span>01</span>
      </span>
      <span className="card-title">
        <small>新潟県 妙高市</small>
        <strong>妙高高原</strong>
        <em>空を映す、水辺の時間。</em>
      </span>
      <span className="mascot-sticker">
        <img src="/myoko-mascot.png" alt="妙高市のキャラクター" />
      </span>
      <span className="card-footer-line">
        <span>妙高、好きになりました。</span>
        <span>MYOKO CARD</span>
      </span>
    </button>
  );
}

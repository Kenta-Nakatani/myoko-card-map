import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata = {
  title: "妙高、好きになりました。｜妙高カードマップ",
  description: "カードから広がる、妙高めぐり。妙高高原カードとデジタルマップのプロトタイプ。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

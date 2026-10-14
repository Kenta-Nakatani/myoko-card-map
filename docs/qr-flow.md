# QRから図鑑登録の試作（2026-10-14）

カードを受け取る→QRから該当カードを開く→登録→次の場所を選ぶ→地図アプリで行き方を確認する流れ。

ローカル確認用URL:
- 妙高高原: http://localhost:3001/myoko-card-map/?card=01&source=qr
- まちなかぷらす: http://localhost:3001/myoko-card-map/?card=02&source=qr
- かんずり: http://localhost:3001/myoko-card-map/?card=03&source=qr
- 和光: http://localhost:3001/myoko-card-map/?card=04&source=qr

公開用QRは、公開後に同じパスとクエリを公開ドメインで使う。印刷前に4リンクを実機で確認する。
通常の紹介は ?card=番号。QRの入口だけ source=qr を付ける。
登録は明示ボタンで行う。読み取りだけでは自動登録しない。
登録日を myoko-card-collection-v2 に保存。旧v1の保存データは移行・削除せず、別記録とする。
QR URLは共有・再現できるため訪問の証明ではない。GPS認証やログインは追加しない。
カード配布場所・営業時間は未確定なので準備中と表示。位置情報は提供された4座標を使用。
端末間同期はなく、同じブラウザで再表示する。閲覧データ削除で記録は消える。

試作のためGitHub・公開サイトは更新していない。紙カードの表裏の印刷データ、実際の配布運用は別途作成・確定する。
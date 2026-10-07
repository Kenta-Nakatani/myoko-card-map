# 妙高カードマップ ver1

元の `myoko-card-map-main` を引き継いだ改良版です。

## 起動

Node.jsとpnpmを利用します。

```sh
pnpm install --frozen-lockfile
pnpm dev --port 3001
```

プレビュー: http://localhost:3001/

## 公開用ビルド

PowerShellの場合:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/myoko-card-map'
pnpm build
```

GitHub Actionsの既存ワークフローも、このベースパスでビルドします。
`out`の中身をGitHub Pagesの配信ルートに配置します。公開URLに`out/index.html`は含めません。

## 今回の変更

- 写真を主役にしたトップ画面と、常に使える地図への導線
- 四季の写真切り替え
- 地図の地点選択とカード情報の連動、全体表示への復帰
- スマホの読みやすさ、地図とページのスクロールの分離
- ネイティブdialogによるカード拡大、Esc・フォーカス管理

## 掲載内容

写真・カード画像・市境データは元サイトの素材を引き継ぎました。
掲載地点は元サイトの仮座標 `[138.177, 36.87]` です。
実際の撮影場所の確認が必要なため、経路案内や新しい観光地点は追加していません。

公開サイト: https://kenta-nakatani.github.io/myoko-card-map/

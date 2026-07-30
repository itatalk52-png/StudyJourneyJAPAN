# Study Journey JAPAN Ver.1.3 Official

学習時間を旅の進捗に変える、学生向け学習継続Webアプリです。

## Ver.1.3の主な機能

- 学習タイマー（1分＝1ポイント）
- 10分ごとのバッジ獲得
- 沖縄県・鹿児島県のコレクション
- 日本地図の進捗表示
- 初回参加者登録
- Google Apps Script＋Googleスプレッドシートへの学習時間保存
- 週間ランキング表示
- PWA対応（スマートフォンのホーム画面へ追加可能）

## GitHubへ登録するファイル

このフォルダの中身を、リポジトリの最上位に置いてください。
`index.html`と`Assets`フォルダが同じ階層にある状態が正しい構成です。

```text
StudyJourneyJAPAN/
├── index.html
├── style.css
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── Assets/
│   ├── badges/
│   └── maps/
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## GitHub Desktopでの反映

1. GitHub Desktopで `StudyJourneyJAPAN` を開く
2. `Show in Finder` を押す
3. このフォルダの中身を、表示されたリポジトリフォルダへコピーする
4. GitHub DesktopのSummaryへ `Study Journey JAPAN Ver.1.3 Official` と入力する
5. `Commit to main` を押す
6. `Push origin` を押す

## Cloudflare Pagesの設定

- Framework preset: None
- Build command: 空欄
- Build output directory: `/` または空欄
- Production branch: `main`

Cloudflare PagesでGitHubリポジトリを接続すると、以後はGitHubへPushするたびに自動更新されます。

## データ連携

アプリは、設定済みのGoogle Apps Script Webアプリへ接続します。Apps Scriptの公開範囲は、テスト参加者がログインなしで使う場合、アクセス可能なユーザーを「全員」に設定してください。

## 現在の試作範囲

バッジ画像と地図のカラー表示は、現時点で沖縄県と鹿児島県まで実装しています。47都道府県・470バッジへの拡張を前提とした試験運用版です。

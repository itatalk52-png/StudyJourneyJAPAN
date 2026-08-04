# Ver.1.7.4 正式リリース版 更新ガイド

この版は、固定のスプレッドシートIDをコードへ書かず、`setupSheet`を初回実行したときに、開いているスプレッドシートを自動登録します。これにより「Illegal spreadsheet id or key」を防ぎます。

## 1. Apps Scriptを更新

1. Study Journey JAPANのGoogleスプレッドシートを開く
2. 「拡張機能」→「Apps Script」
3. 現在のコードをすべて削除
4. `AppsScript_Code.gs`の内容をすべて貼り付ける
5. 保存する
6. 関数選択から `setupSheet` を選び、「実行」
7. 実行ログに「実行完了」と表示されることを確認

`setupSheet`の初回実行時に、現在のスプレッドシートIDがスクリプトプロパティへ自動保存されます。コード1行目を手作業で変更する必要はありません。

## 2. Apps Scriptを再デプロイ

1. 「デプロイ」→「デプロイを管理」
2. 既存ウェブアプリの鉛筆マーク
3. バージョンで「新バージョン」を選択
4. 説明に `Study Journey JAPAN Ver.1.7.4 Official Release` と入力
5. 「デプロイ」

新しいデプロイを別に作らず、既存デプロイを更新してください。URLは変わりません。

## 3. GitHub側を更新

1. GitHub Desktopで `Repository` → `Show in Finder`
2. Ver.1.7.4フォルダ内のアプリファイル一式を、リポジトリ直下へ上書き
3. `Assets`フォルダも上書き
4. Summaryに `Study Journey JAPAN Ver.1.7.4 Official Release`
5. `Commit to main`
6. `Push origin`

## 4. 公開ページを確認

数分待ってから公開URLを開き、Macでは `command + shift + R` で強制再読み込みします。

確認項目：

- 濃いグリーンのシンプルなカレンダーアイコン
- 月曜日始まりの当月カレンダー
- タイマー、ランキング、ポイント
- メダル、連続学習、エール
- 「指定された処理が見つかりません」が出ない

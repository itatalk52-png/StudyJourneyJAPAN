Study Journey JAPAN Ver.2.2.5 Beta11 Final

最終修正:
- rankingV2のtodayMinutesを各Friendsカードへ直接反映
- rankingV2のtodayRankをTODAY RANKINGへ直接反映
- 全ランキング行を数値として正規化
- todayMinutes / todayRankを含まない古いキャッシュを使用しない
- rankingV2以外のキャッシュを使用しない
- 一番上の自分カードと一覧内カードを同じAPIデータで表示
- PAUSEボタンは指定色 #B30000、影なしのフラット表示を維持

Apps Script:
Beta10でrankingV2をすでにデプロイ済みの場合、再更新は必須ではありません。
ただしZIP内のAppsScript_Code.gsはBeta10対応版を同梱しています。

アプリ:
StudyJourneyJAPANへ上書きし、Commit to main → Push originしてください。

Study Journey JAPAN Ver.2.2.5 Beta10 RankingV2 Today Fix

根本修正:
- 新しい rankingV2 API を追加
- 全学生について todayMinutes と todayRank を必ずJSONへ含める
- Friends画面は旧rankingではなく rankingV2 のみを使用
- 旧Apps Scriptが返った場合は0分表示にせず、更新が必要だと明示
- 日別学習記録と学習送信履歴をユーザーIDごとに一括集計
- 一番上の自分カードとランキング内カードのデータ源を統一
- 古いFriendsキャッシュを完全に破棄

重要:
1. AppsScript_Code.gsを本番Apps Scriptへ貼り替える
2. 既存デプロイを「新しいバージョン」でデプロイ
3. アプリ側をStudyJourneyJAPANへ上書き
4. Commit to main → Push origin

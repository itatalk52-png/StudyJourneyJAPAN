const SPREADSHEET_PROPERTY_KEY = 'STUDY_JOURNEY_SPREADSHEET_ID';
const SHEET_NAME = 'ユーザー';
const CHEER_SHEET_NAME = 'エール履歴';
const DAILY_SHEET_NAME = '日別学習記録';
const BADGE_SHEET_NAME = 'バッジ取得履歴';
const MISSION_SHEET_NAME = '問題演習履歴';
const STUDY_RECORD_SHEET_NAME = '学習送信履歴';
const CORRECTION_SHEET_NAME = '学習時間修正履歴';
const AVATAR_FOLDER_NAME = 'Study Journey JAPAN Icons';
const TIMEZONE = 'Asia/Tokyo';
const DORMANT_HOURS = 72;
const RESTART_BONUS_HOURS = 24;

const HEADERS = [
  'ユーザーID','ニックネーム','学部','学科','メールアドレス',
  '今週の学習分数','累計学習分数','現在地','更新日時','週ID','アイコンURL',
  'エールポイント','最終学習日時','登録日時','メダルポイント','連続学習ポイント','連続ボーナス到達日数'
];
const CHEER_HEADERS = ['エールID','送信者ID','受信者ID','送信日時','獲得ポイント','ありがとう日時','再開ボーナス付与日時'];
const DAILY_HEADERS = ['ユーザーID','日付','学習分数','メダル','メダルポイント','更新日時','連続ボーナスポイント'];
const BADGE_HEADERS = ['バッジ取得ID','ユーザーID','通算バッジ番号','取得日時','取得時通算学習分数'];
const MISSION_HEADERS = ['記録ID','ユーザーID','科目','問題ID','回転','理解度','獲得ポイント','更新日時'];
const STUDY_RECORD_HEADERS = ['記録ID','ユーザーID','学習日','学習分数','受信日時'];
const CORRECTION_HEADERS = ['修正ID','ユーザーID','学習日','修正前秒数','修正後秒数','減少秒数','修正日時'];

function doGet(e) {
  try {
    setupSheet();
    const p = (e && e.parameter) || {};
    const action = String(p.action || 'ranking');
    if (action === 'ranking') return jsonResponse({success:true, ranking:getRanking(cleanText(p.userId)), inbox:getInbox(cleanText(p.userId))});
    if (action === 'calendar') return jsonResponse(getCalendar(cleanText(p.userId), cleanText(p.month)));
    if (action === 'correctionRecords') return jsonResponse(getCorrectionRecords(cleanText(p.userId)));
    if (action === 'correctionHistory') return jsonResponse(getCorrectionHistory(cleanText(p.userId)));
    if (action === 'sync' || action === 'login') return jsonResponse(getSyncData(cleanText(p.userId)));
    if (action === 'missionSync') return jsonResponse(getMissionSync(cleanText(p.userId)));
    if (action === 'health') return jsonResponse({success:true, message:'Study Journey JAPAN API Ver.2.2.0 Safety Update is working.'});
    return jsonResponse({success:false, message:'指定された処理が見つかりません。'});
  } catch (error) { return errorResponse(error); }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    setupSheet();
    const params = (e && e.parameter) || {};
    const action = String(params.action || '');
    if(['register','addStudy','correctStudyTime','sendCheer','thankCheer','saveMission'].includes(action)){
      invalidateRankingCache();
    }
    if (action === 'register') return jsonResponse(registerUser(params));
    if (action === 'login') return jsonResponse(getSyncData(cleanText(params.userId)));
    if (action === 'addStudy') return jsonResponse(addStudyTime(params));
    if (action === 'correctStudyTime') return jsonResponse(correctStudyTime(params));
    if (action === 'sendCheer') return jsonResponse(sendCheer(params));
    if (action === 'thankCheer') return jsonResponse(thankCheer(params));
    if (action === 'saveMission') return jsonResponse(saveMission(params));
    return jsonResponse({success:false, message:'指定された処理が見つかりません。'});
  } catch (error) { return errorResponse(error); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}

function setupSheet() {
  const ss = getSpreadsheet();
  let users = ss.getSheetByName(SHEET_NAME);
  if (!users) users = ss.insertSheet(SHEET_NAME);
  users.getRange(1,1,1,HEADERS.length).setValues([HEADERS]); users.setFrozenRows(1);
  let cheers = ss.getSheetByName(CHEER_SHEET_NAME);
  if (!cheers) cheers = ss.insertSheet(CHEER_SHEET_NAME);
  cheers.getRange(1,1,1,CHEER_HEADERS.length).setValues([CHEER_HEADERS]); cheers.setFrozenRows(1);
  let daily = ss.getSheetByName(DAILY_SHEET_NAME);
  if (!daily) daily = ss.insertSheet(DAILY_SHEET_NAME);
  daily.getRange(1,1,1,DAILY_HEADERS.length).setValues([DAILY_HEADERS]); daily.setFrozenRows(1); daily.getRange('B:B').setNumberFormat('@');
  let badges = ss.getSheetByName(BADGE_SHEET_NAME);
  if (!badges) badges = ss.insertSheet(BADGE_SHEET_NAME);
  badges.getRange(1,1,1,BADGE_HEADERS.length).setValues([BADGE_HEADERS]); badges.setFrozenRows(1);
  let missions = ss.getSheetByName(MISSION_SHEET_NAME);
  if (!missions) missions = ss.insertSheet(MISSION_SHEET_NAME);
  missions.getRange(1,1,1,MISSION_HEADERS.length).setValues([MISSION_HEADERS]); missions.setFrozenRows(1);

  let studyRecords = ss.getSheetByName(STUDY_RECORD_SHEET_NAME);
  if (!studyRecords) studyRecords = ss.insertSheet(STUDY_RECORD_SHEET_NAME);
  studyRecords.getRange(1,1,1,STUDY_RECORD_HEADERS.length).setValues([STUDY_RECORD_HEADERS]);
  studyRecords.setFrozenRows(1);
  studyRecords.getRange('A:C').setNumberFormat('@');
  let corrections = ss.getSheetByName(CORRECTION_SHEET_NAME);
  if (!corrections) corrections = ss.insertSheet(CORRECTION_SHEET_NAME);
  corrections.getRange(1,1,1,CORRECTION_HEADERS.length).setValues([CORRECTION_HEADERS]); corrections.setFrozenRows(1);

  const lastRow = users.getLastRow();
  if (lastRow >= 2) {
    const rows = users.getRange(2,1,lastRow-1,HEADERS.length).getValues(); let changed = false;
    rows.forEach(row => {
      if (row[0] && !row[13]) { row[13] = row[8] instanceof Date ? row[8] : new Date(); changed = true; }
      [11,14,15,16].forEach(i=>{ if(row[i]===''||row[i]==null){row[i]=0;changed=true;} });
    });
    if (changed) users.getRange(2,1,rows.length,HEADERS.length).setValues(rows);
  }
}

function registerUser(params) {
  let userId=cleanText(params.userId); const nickname=cleanText(params.nickname), faculty=cleanText(params.faculty), department=cleanText(params.department), teacherEmail=cleanText(params.teacherEmail);
  if(!nickname)throw new Error('ニックネームを入力してください。');
  const sheet=getUserSheet();
  if(!userId) userId=generateUniqueUserId(sheet);
  const rowNumber=findUserRow(sheet,userId), now=new Date();
  // Ver.1.9.0ではプロフィール画像は端末内だけに保存し、クラウド同期しません。
  const avatarUrl=''; const avatarWarning='';
  if(rowNumber){sheet.getRange(rowNumber,2,1,4).setValues([[nickname,faculty,department,teacherEmail]]);sheet.getRange(rowNumber,9).setValue(now);sheet.getRange(rowNumber,11).setValue(avatarUrl);return{success:true,isNewUser:false,userId,avatarUrl,avatarWarning};}
  sheet.appendRow([userId,nickname,faculty,department,teacherEmail,0,0,'沖縄県',now,getCurrentWeekId(),avatarUrl,0,'',now,0,0,0]);
  return{success:true,isNewUser:true,userId,avatarUrl,avatarWarning};
}

function addStudyTime(params) {
  const userId=cleanText(params.userId);
  const minutes=Math.floor(Number(params.minutes));
  const currentPrefecture=cleanText(params.currentPrefecture)||'沖縄県';
  const studyDate=normalizeDateString(params.studyDate)||todayString();
  const recordId=cleanText(params.recordId);

  if(!userId)throw new Error('ユーザーIDがありません。');
  if(!recordId)throw new Error('学習記録IDがありません。アプリを最新版に更新してください。');
  if(!Number.isFinite(minutes)||minutes<=0)throw new Error('学習時間が正しくありません。');
  if(minutes>1440)throw new Error('一度に登録できる学習時間は1,440分までです。');

  const sheet=getUserSheet();
  const rowNumber=findUserRow(sheet,userId);
  if(!rowNumber)throw new Error('ユーザー登録が確認できません。プロフィールを保存し直してください。');

  const recordSheet=getStudyRecordSheet();
  if(findStudyRecordRow(recordSheet,recordId)){
    return buildStudyResponse(userId,rowNumber,{
      success:true,
      duplicate:true,
      addedMinutes:0,
      studyDate,
      currentPrefecture
    });
  }

  const values=sheet.getRange(rowNumber,1,1,HEADERS.length).getValues()[0];
  const currentWeekId=getCurrentWeekId();
  const studyWeekId=getWeekIdForDate(studyDate);

  let weeklyMinutes=cellDateString(values[9])===currentWeekId
    ? Number(values[5])||0
    : 0;
  let totalMinutes=Number(values[6])||0;
  const oldTotalMinutes=totalMinutes;

  if(studyWeekId===currentWeekId){
    weeklyMinutes+=minutes;
  }
  totalMinutes+=minutes;

  const now=new Date();
  const newBadges=recordNewBadges(userId,oldTotalMinutes,totalMinutes,now);

  sheet.getRange(rowNumber,6,1,5).setValues([
    [weeklyMinutes,totalMinutes,currentPrefecture,now,currentWeekId]
  ]);
  sheet.getRange(rowNumber,13).setValue(now);

  recordSheet.appendRow([recordId,userId,studyDate,minutes,now]);

  const dailyResult=addDailyMinutes(userId,studyDate,minutes,now);
  let medalPoints=Number(sheet.getRange(rowNumber,15).getValue())||0;
  if(dailyResult.pointsAdded){
    medalPoints+=dailyResult.pointsAdded;
    sheet.getRange(rowNumber,15).setValue(medalPoints);
  }

  const streakResult=awardStreakBonus(userId,rowNumber);
  const restartBonusCount=awardRestartBonuses(userId,now);
  SpreadsheetApp.flush();

  return buildStudyResponse(userId,rowNumber,{
    success:true,
    duplicate:false,
    addedMinutes:minutes,
    studyDate,
    studyWeekId,
    currentWeekId,
    currentPrefecture,
    medal:dailyResult.medal,
    dayMinutes:dailyResult.minutes,
    medalPointsAdded:dailyResult.pointsAdded,
    streak:streakResult.streak,
    streakBonusAdded:streakResult.pointsAdded,
    restartBonusCount,
    newBadges
  });
}

function buildStudyResponse(userId,rowNumber,extra){const sheet=getUserSheet(),row=sheet.getRange(rowNumber,1,1,HEADERS.length).getValues()[0],weeklyMinutes=cellDateString(row[9])===getCurrentWeekId()?Number(row[5])||0:0,totalMinutes=Number(row[6])||0,cheerPoints=Number(row[11])||0,medalPoints=Number(row[14])||0,streakPoints=Number(row[15])||0,missionPoints=getMissionPoints(userId),streak=calculateCurrentStreak(userId);return Object.assign({success:true,weeklyMinutes,totalMinutes,cheerPoints,medalPoints,streakPoints,missionPoints,totalPoints:totalMinutes+cheerPoints+medalPoints+streakPoints+missionPoints,streak,badgeCount:Math.floor(totalMinutes/10),newBadges:[]},extra||{});}
function getStudyRecordSheet(){
  return getSpreadsheet().getSheetByName(STUDY_RECORD_SHEET_NAME);
}

function findStudyRecordRow(sheet,recordId){
  if(!recordId||sheet.getLastRow()<2)return 0;
  const finder=sheet.getRange(2,1,sheet.getLastRow()-1,1)
    .createTextFinder(recordId)
    .matchEntireCell(true)
    .findNext();
  return finder?finder.getRow():0;
}
function getCorrectionSheet(){return getSpreadsheet().getSheetByName(CORRECTION_SHEET_NAME);}
function getCorrectionRecords(userId){if(!userId)return{success:false,message:'ユーザーIDがありません。'};const s=getDailySheet(),last=s.getLastRow(),records=[];if(last>=2)s.getRange(2,1,last-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(cleanText(r[0])===userId){const d=cellDateString(r[1]),m=Number(r[2])||0;if(d&&m>0)records.push({studyDate:d,seconds:m*60})}});records.sort((a,b)=>b.studyDate.localeCompare(a.studyDate));return{success:true,records:records.slice(0,90)}}
function getCorrectionHistory(userId){const s=getCorrectionSheet(),last=s.getLastRow(),history=[];if(last>=2)s.getRange(2,1,last-1,CORRECTION_HEADERS.length).getValues().forEach(r=>{if(cleanText(r[1])===userId)history.push({correctionId:cleanText(r[0]),studyDate:cellDateString(r[2]),beforeSeconds:Number(r[3])||0,afterSeconds:Number(r[4])||0,reducedSeconds:Number(r[5])||0,correctedAt:formatDate(r[6])})});history.sort((a,b)=>String(b.correctedAt).localeCompare(String(a.correctedAt)));return{success:true,history:history.slice(0,100)}}
function findCorrectionRow(sheet,id){if(!id||sheet.getLastRow()<2)return 0;const f=sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();return f?f.getRow():0}
function correctStudyTime(p){const userId=cleanText(p.userId),studyDate=normalizeDateString(p.studyDate),afterSeconds=Math.floor(Number(p.correctedSeconds)),id=cleanText(p.correctionId);if(!userId||!studyDate||!id)throw new Error('修正情報が不足しています。');const cs=getCorrectionSheet();if(findCorrectionRow(cs,id)){const ur=findUserRow(getUserSheet(),userId);return buildStudyResponse(userId,ur,{success:true,duplicate:true})}const ds=getDailySheet(),dr=findDailyRow(ds,userId,studyDate);if(!dr)throw new Error('その日の学習記録が見つかりません。');const row=ds.getRange(dr,1,1,DAILY_HEADERS.length).getValues()[0],beforeMinutes=Number(row[2])||0,beforeSeconds=beforeMinutes*60;if(afterSeconds<0||afterSeconds>=beforeSeconds)throw new Error('現在より短い時間を指定してください。');const afterMinutes=Math.floor(afterSeconds/60),now=new Date();ds.getRange(dr,3,1,4).setValues([[afterMinutes,medalForMinutes(afterMinutes),medalPointsForMinutes(afterMinutes),now]]);cs.appendRow([id,userId,studyDate,beforeSeconds,afterSeconds,beforeSeconds-afterSeconds,now]);recalculateUserStudyTotals(userId);recalculateUserMedalPoints(userId);const ur=findUserRow(getUserSheet(),userId);return buildStudyResponse(userId,ur,{success:true,studyDate,beforeSeconds,afterSeconds,reducedSeconds:beforeSeconds-afterSeconds})}
function recalculateUserStudyTotals(userId){const d=getDailySheet(),last=d.getLastRow(),week=getCurrentWeekId();let total=0,weekly=0;if(last>=2)d.getRange(2,1,last-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(cleanText(r[0])===userId){const m=Number(r[2])||0,totalDate=cellDateString(r[1]);total+=m;if(getWeekIdForDate(totalDate)===week)weekly+=m}});const u=getUserSheet(),row=findUserRow(u,userId);if(row){u.getRange(row,6).setValue(weekly);u.getRange(row,7).setValue(total);u.getRange(row,9).setValue(new Date());u.getRange(row,10).setValue(week)}}
function recalculateUserMedalPoints(userId){const d=getDailySheet(),last=d.getLastRow();let total=0;if(last>=2)d.getRange(2,1,last-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(cleanText(r[0])===userId)total+=Number(r[4])||0});const u=getUserSheet(),row=findUserRow(u,userId);if(row)u.getRange(row,15).setValue(total)}

function addDailyMinutes(userId,dateString,minutes,now){
  const sheet=getDailySheet(), row=findDailyRow(sheet,userId,dateString); let oldMinutes=0,oldPoints=0;
  if(row){const v=sheet.getRange(row,1,1,DAILY_HEADERS.length).getValues()[0];oldMinutes=Number(v[2])||0;oldPoints=Number(v[4])||0;}
  const newMinutes=oldMinutes+minutes, medal=medalForMinutes(newMinutes), newPoints=medalPointsForMinutes(newMinutes), pointsAdded=Math.max(0,newPoints-oldPoints);
  if(row)sheet.getRange(row,3,1,4).setValues([[newMinutes,medal,newPoints,now]]);else sheet.appendRow([userId,dateString,newMinutes,medal,newPoints,now,0]);
  return{minutes:newMinutes,medal,pointsAdded,newPoints};
}
function medalForMinutes(m){return m>=120?'gold':m>=60?'silver':m>=10?'bronze':'';}
function medalPointsForMinutes(m){return m>=120?50:m>=60?30:m>=10?10:0;}

function awardStreakBonus(userId,userRow){
  const streak=calculateCurrentStreak(userId), users=getUserSheet(), daily=getDailySheet(), today=todayString(), dailyRow=findDailyRow(daily,userId,today); let pointsAdded=0;
  if(streak>0 && streak%10===0 && dailyRow){const already=Number(daily.getRange(dailyRow,7).getValue())||0;if(!already){pointsAdded=100;daily.getRange(dailyRow,7).setValue(pointsAdded);users.getRange(userRow,16).setValue((Number(users.getRange(userRow,16).getValue())||0)+pointsAdded);}}
  return{streak,pointsAdded,milestone:Math.floor(streak/10)*10};
}

function sendCheer(params){
  const senderId=cleanText(params.senderId),recipientId=cleanText(params.recipientId);if(!senderId||!recipientId)throw new Error('ユーザー情報が確認できません。');if(senderId===recipientId)throw new Error('自分自身にはエールを送れません。');
  const users=getUserSheet(),senderRow=findUserRow(users,senderId),recipientRow=findUserRow(users,recipientId);if(!senderRow||!recipientRow)throw new Error('参加者情報が見つかりません。');if(hasCheeredToday(senderId,recipientId))throw new Error('同じ相手へのエールは1日1回までです。');
  const recipientValues=users.getRange(recipientRow,1,1,HEADERS.length).getValues()[0],dormant=isDormantRow(recipientValues,new Date()),points=dormant?0.2:0.1,now=new Date(),cheerId=Utilities.getUuid();
  getCheerSheet().appendRow([cheerId,senderId,recipientId,now,points,'','']);const senderPoints=(Number(users.getRange(senderRow,12).getValue())||0)+points;users.getRange(senderRow,12).setValue(senderPoints);return{success:true,cheerId,points,dormant,senderCheerPoints:senderPoints};
}
function thankCheer(params){
  const userId=cleanText(params.userId),cheerId=cleanText(params.cheerId);if(!userId||!cheerId)throw new Error('エール情報が確認できません。');const cheers=getCheerSheet(),row=findCheerRow(cheers,cheerId);if(!row)throw new Error('エールが見つかりません。');
  const values=cheers.getRange(row,1,1,CHEER_HEADERS.length).getValues()[0];if(String(values[2])!==userId)throw new Error('このエールには返信できません。');if(values[5])throw new Error('すでに「ありがとう😊」を送りました。');
  const users=getUserSheet(),userRow=findUserRow(users,userId);if(!userRow)throw new Error('参加者情報が見つかりません。');const points=Number(values[4])||0.1;cheers.getRange(row,6).setValue(new Date());const newPoints=(Number(users.getRange(userRow,12).getValue())||0)+points;users.getRange(userRow,12).setValue(newPoints);return{success:true,points,cheerPoints:newPoints};
}
function awardRestartBonuses(recipientId,now){const cheers=getCheerSheet(),lastRow=cheers.getLastRow();if(lastRow<2)return 0;const rows=cheers.getRange(2,1,lastRow-1,CHEER_HEADERS.length).getValues(),cutoff=new Date(now.getTime()-RESTART_BONUS_HOURS*3600000),users=getUserSheet();let count=0;rows.forEach((row,i)=>{const sentAt=row[3];if(String(row[2])===recipientId&&sentAt instanceof Date&&sentAt>=cutoff&&sentAt<=now&&!row[6]){const senderRow=findUserRow(users,String(row[1]));if(senderRow){users.getRange(senderRow,12).setValue((Number(users.getRange(senderRow,12).getValue())||0)+0.1);cheers.getRange(i+2,7).setValue(now);count++;}}});return count;}


function generateUniqueUserId(sheet){
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(let attempt=0;attempt<30;attempt++){
    let code='SJ-';
    const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,Utilities.getUuid()+new Date().getTime()+Math.random());
    for(let i=0;i<6;i++) code+=alphabet.charAt((bytes[i]&255)%alphabet.length);
    if(!findUserRow(sheet,code))return code;
  }
  throw new Error('IDを発行できませんでした。もう一度お試しください。');
}
function recordNewBadges(userId,oldMinutes,newMinutes,now){
  const oldCount=Math.floor(Math.max(0,oldMinutes)/10),newCount=Math.floor(Math.max(0,newMinutes)/10);
  if(newCount<=oldCount)return[];
  const sheet=getBadgeSheet(),rows=[];
  for(let n=oldCount+1;n<=newCount;n++)rows.push([Utilities.getUuid(),userId,n,now,n*10]);
  if(rows.length)sheet.getRange(sheet.getLastRow()+1,1,rows.length,BADGE_HEADERS.length).setValues(rows);
  return rows.map(r=>({badgeNumber:r[2],acquiredAt:formatDate(r[3]),totalMinutes:r[4]}));
}
function ensureBadgeHistory(userId,totalMinutes){
  const expected=Math.floor(Math.max(0,totalMinutes)/10),sheet=getBadgeSheet(),last=sheet.getLastRow();let existing={};
  if(last>=2)sheet.getRange(2,1,last-1,BADGE_HEADERS.length).getValues().forEach(r=>{if(String(r[1])===userId)existing[Number(r[2])]=true;});
  const rows=[],now=new Date();for(let n=1;n<=expected;n++)if(!existing[n])rows.push([Utilities.getUuid(),userId,n,now,n*10]);
  if(rows.length)sheet.getRange(sheet.getLastRow()+1,1,rows.length,BADGE_HEADERS.length).setValues(rows);
}
function getBadgeHistory(userId){
  const sheet=getBadgeSheet(),last=sheet.getLastRow();if(last<2)return[];
  return sheet.getRange(2,1,last-1,BADGE_HEADERS.length).getValues().filter(r=>String(r[1])===userId).sort((a,b)=>Number(a[2])-Number(b[2])).map(r=>({badgeNumber:Number(r[2])||0,acquiredAt:formatDate(r[3]),totalMinutes:Number(r[4])||0}));
}
function getSyncData(userId){
  if(!userId)throw new Error('Study Journey IDを入力してください。');
  const users=getUserSheet(),row=findUserRow(users,userId);if(!row)throw new Error('このIDは見つかりませんでした。入力内容をご確認ください。');
  const v=users.getRange(row,1,1,HEADERS.length).getValues()[0],weekId=getCurrentWeekId(),weekly=cellDateString(v[9])===weekId?Number(v[5])||0:0,total=Number(v[6])||0;
  ensureBadgeHistory(userId,total);
  const daily=getDailySheet(),dailyRows=[];if(daily.getLastRow()>=2)daily.getRange(2,1,daily.getLastRow()-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(String(r[0])===userId)dailyRows.push({date:cellDateString(r[1]),minutes:Number(r[2])||0,medal:String(r[3]||''),medalPoints:Number(r[4])||0,streakBonusPoints:Number(r[6])||0});});
  return{success:true,profile:{userId:String(v[0]),nickname:String(v[1]||''),faculty:String(v[2]||''),department:String(v[3]||''),teacherEmail:String(v[4]||'')},sync:{weeklyMinutes:weekly,totalMinutes:total,currentPrefecture:String(v[7]||'沖縄県'),cheerPoints:Number(v[11])||0,medalPoints:Number(v[14])||0,streakPoints:Number(v[15])||0,missionPoints:getMissionPoints(userId),missionRecords:getMissionRecords(userId),currentStreak:calculateCurrentStreak(userId),todayMinutes:(getDailyRecord(userId,todayString())||{}).minutes||0,badgeCount:Math.floor(total/10),badgeHistory:getBadgeHistory(userId),dailyRecords:dailyRows,updatedAt:formatDate(v[8])}};
}

function rankingCacheKey(){
  return 'ranking-base-v2-all-today-'+todayString()+'-'+getCurrentWeekId();
}
function invalidateRankingCache(){
  CacheService.getScriptCache().remove(rankingCacheKey());
}
function buildMissionPointsByUser(){
  const result={};
  const sheet=getMissionSheet();
  const last=sheet.getLastRow();
  if(last<2)return result;

  const rows=sheet.getRange(2,1,last-1,MISSION_HEADERS.length).getValues();
  const problemRounds={};

  rows.forEach(row=>{
    const userId=cleanText(row[1]);
    const subject=cleanText(row[2]);
    const problemId=cleanText(row[3]);
    const round=Number(row[4])||0;
    const level=cleanText(row[5]);

    if(!userId||!problemId||problemId.startsWith('__')||![1,2,3].includes(round))return;
    result[userId]=(Number(result[userId])||0)+missionLevelPoints(level);

    const key=userId+'|'+subject+'|'+problemId;
    if(!problemRounds[key])problemRounds[key]={};
    problemRounds[key][round]=level;
  });

  Object.keys(problemRounds).forEach(key=>{
    const rounds=problemRounds[key];
    if([1,2,3].every(round=>['triangle','circle','double'].includes(rounds[round]))){
      const userId=key.split('|')[0];
      result[userId]=(Number(result[userId])||0)+100;
    }
  });
  return result;
}
function buildTodayMinutesByUser(){
  const result={};
  const sheet=getDailySheet();
  const last=sheet.getLastRow();
  if(last<2)return result;

  const range=sheet.getRange(2,1,last-1,DAILY_HEADERS.length);
  const values=range.getValues();
  const display=range.getDisplayValues();
  const today=todayString();

  values.forEach((row,index)=>{
    const shown=display[index]||[];

    // Always prefer the raw sheet value. Date cells are returned as Date objects,
    // so this avoids locale-specific display strings such as "2026年8月6日".
    const userId=cleanText(row[0]||shown[0]);
    const studyDate=cellDateString(row[1]||shown[1]);
    const minutes=Number(row[2])||Number(shown[2])||0;

    if(!userId||studyDate!==today)return;
    result[userId]=(Number(result[userId])||0)+minutes;
  });

  return result;
}

function buildTodayMinutesFromStudyRecords(){
  const result={};
  const sheet=getStudyRecordSheet();
  if(!sheet)return result;

  const last=sheet.getLastRow();
  if(last<2)return result;

  const range=sheet.getRange(2,1,last-1,STUDY_RECORD_HEADERS.length);
  const values=range.getValues();
  const display=range.getDisplayValues();
  const today=todayString();

  values.forEach((row,index)=>{
    const shown=display[index]||[];
    const userId=cleanText(row[1]||shown[1]);
    const studyDate=cellDateString(row[2]||shown[2]);
    const minutes=Number(row[3])||Number(shown[3])||0;

    if(!userId||studyDate!==today||minutes<=0)return;
    result[userId]=(Number(result[userId])||0)+minutes;
  });

  return result;
}

function buildAuthoritativeTodayMinutesByUser(){
  const daily=buildTodayMinutesByUser();
  const records=buildTodayMinutesFromStudyRecords();
  const result={};
  const ids=new Set(Object.keys(daily).concat(Object.keys(records)));

  ids.forEach(userId=>{
    const dailyMinutes=Number(daily[userId])||0;
    const recordMinutes=Number(records[userId])||0;

    // The daily aggregate reflects corrections, so prefer it when present.
    // Study records are used as a reliable fallback for users missing from the daily table.
    result[userId]=dailyMinutes>0?dailyMinutes:recordMinutes;
  });

  return result;
}

function getViewerCheeredRecipients(viewerId){
  const result={};
  if(!viewerId)return result;
  const sheet=getCheerSheet();
  const last=sheet.getLastRow();
  if(last<2)return result;

  const today=todayString();
  const rows=sheet.getRange(2,1,last-1,CHEER_HEADERS.length).getValues();
  rows.forEach(row=>{
    const senderId=cleanText(row[1]);
    const recipientId=cleanText(row[2]);
    const date=cellDateString(row[3]);
    if(senderId===viewerId&&recipientId&&date===today)result[recipientId]=true;
  });
  return result;
}
function getRankingBase(){
  const sheet=getUserSheet();
  const lastRow=sheet.getLastRow();
  if(lastRow<2)return[];

  const currentWeekId=getCurrentWeekId();
  const now=new Date();
  const today=todayString();
  const values=sheet.getRange(2,1,lastRow-1,HEADERS.length).getValues();
  const missionPointsByUser=buildMissionPointsByUser();
  const todayByUser=buildAuthoritativeTodayMinutesByUser();

  const ranking=values.filter(row=>cleanText(row[0])).map(row=>{
    const userId=cleanText(row[0]);
    const weekly=cellDateString(row[9])===currentWeekId?Number(row[5])||0:0;
    const totalMinutes=Number(row[6])||0;
    const cheerPoints=Number(row[11])||0;
    const medalPoints=Number(row[14])||0;
    const streakPoints=Number(row[15])||0;
    const missionPoints=Number(missionPointsByUser[userId])||0;
    const todayMinutes=Number(todayByUser[userId])||0;
    const dormant=isDormantRow(row,now);

    return{
      userId,
      nickname:String(row[1]||''),
      faculty:String(row[2]||''),
      department:String(row[3]||''),
      weeklyMinutes:weekly,
      todayMinutes,
      totalMinutes,
      totalPoints:totalMinutes+cheerPoints+medalPoints+streakPoints+missionPoints,
      cheerPoints,
      medalPoints,
      streakPoints,
      missionPoints,
      currentPrefecture:String(row[7]||'沖縄県'),
      updatedAt:formatDate(row[8]),
      avatarUrl:String(row[10]||''),
      dormant,
      cheerValue:dormant?0.2:0.1,
      rankingDate:today
    };
  });

  const pointOrder=ranking.slice().sort((a,b)=>b.totalPoints-a.totalPoints||a.nickname.localeCompare(b.nickname,'ja'));
  let previousPoints=null,previousRank=0;
  pointOrder.forEach((user,index)=>{
    const rank=previousPoints!==null&&user.totalPoints===previousPoints?previousRank:index+1;
    user.pointRank=rank;
    previousPoints=user.totalPoints;
    previousRank=rank;
  });

  const weeklyOrder=ranking.slice().sort((a,b)=>b.weeklyMinutes-a.weeklyMinutes||b.totalPoints-a.totalPoints||a.nickname.localeCompare(b.nickname,'ja'));
  let previousWeekly=null,previousWeeklyRank=0;
  weeklyOrder.forEach((user,index)=>{
    const rank=previousWeekly!==null&&user.weeklyMinutes===previousWeekly?previousWeeklyRank:index+1;
    user.weeklyRank=rank;
    previousWeekly=user.weeklyMinutes;
    previousWeeklyRank=rank;
  });

  const todayOrder=ranking.filter(user=>user.todayMinutes>0).sort((a,b)=>b.todayMinutes-a.todayMinutes||b.totalPoints-a.totalPoints||a.nickname.localeCompare(b.nickname,'ja'));
  let previousToday=null,previousTodayRank=0;
  todayOrder.forEach((user,index)=>{
    const rank=previousToday!==null&&user.todayMinutes===previousToday?previousTodayRank:index+1;
    user.todayRank=rank;
    previousToday=user.todayMinutes;
    previousTodayRank=rank;
  });
  ranking.forEach(user=>{if(!user.todayRank)user.todayRank=0;});

  ranking.sort((a,b)=>b.weeklyMinutes-a.weeklyMinutes||b.totalPoints-a.totalPoints||a.nickname.localeCompare(b.nickname,'ja'));
  const base=ranking.map(user=>Object.assign({rank:user.weeklyRank},user));
  return base;
}
function getRanking(viewerId){
  const cheered=getViewerCheeredRecipients(viewerId);
  return getRankingBase().map(user=>Object.assign({},user,{apiVersion:'2.2.5-beta9-database-today',
    cheeredToday:!!cheered[user.userId]
  }));
}
function getInbox(userId){
  if(!userId)return[];
  const cheers=getCheerSheet();
  const lastRow=cheers.getLastRow();
  if(lastRow<2)return[];

  const userSheet=getUserSheet();
  const userLast=userSheet.getLastRow();
  const nicknameById={};
  if(userLast>=2){
    userSheet.getRange(2,1,userLast-1,2).getDisplayValues().forEach(row=>{
      const id=cleanText(row[0]);
      if(id)nicknameById[id]=String(row[1]||'仲間');
    });
  }

  return cheers.getRange(2,1,lastRow-1,CHEER_HEADERS.length).getValues()
    .filter(row=>cleanText(row[2])===userId&&!row[5])
    .sort((a,b)=>new Date(b[3]).getTime()-new Date(a[3]).getTime())
    .slice(0,20)
    .map(row=>({
      cheerId:String(row[0]),
      senderNickname:nicknameById[cleanText(row[1])]||'仲間',
      points:Number(row[4])||0.1,
      sentAt:formatDate(row[3])
    }));
}

function getCalendar(userId,month){
  if(!userId)throw new Error('ユーザー情報がありません。');const normalized=/^\d{4}-\d{2}$/.test(month)?month:todayString().slice(0,7),daily=getDailySheet(),lastRow=daily.getLastRow(),records=[];
  if(lastRow>=2){daily.getRange(2,1,lastRow-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(String(r[0])===userId&&cellDateString(r[1]).slice(0,7)===normalized)records.push({date:cellDateString(r[1]),minutes:Number(r[2])||0,medal:String(r[3]||''),points:Number(r[4])||0});});}
  const [y,m]=normalized.split('-').map(Number),daysInMonth=new Date(y,m,0).getDate(),counts={gold:0,silver:0,bronze:0};records.forEach(r=>{if(counts[r.medal]!=null)counts[r.medal]++;});
  const complete=records.filter(r=>r.medal).length===daysInMonth;
  const streak=calculateCurrentStreak(userId),today=todayString(),todayRecord=getDailyRecord(userId,today),todayMinutes=todayRecord?todayRecord.minutes:0;
  const userRow=findUserRow(getUserSheet(),userId),user=userRow?getUserSheet().getRange(userRow,1,1,HEADERS.length).getValues()[0]:[];
  return{success:true,month:normalized,records,counts,complete,daysInMonth,currentStreak:streak,todayQualified:todayMinutes>=10,todayMinutes,medalPoints:Number(user[14])||0,streakPoints:Number(user[15])||0};
}
function calculateCurrentStreak(userId){
  const sheet=getDailySheet(),lastRow=sheet.getLastRow();if(lastRow<2)return 0;const set={};sheet.getRange(2,1,lastRow-1,DAILY_HEADERS.length).getValues().forEach(r=>{if(String(r[0])===userId&&Number(r[2])>=10)set[cellDateString(r[1])]=true;});
  let d=new Date();let key=Utilities.formatDate(d,TIMEZONE,'yyyy-MM-dd');if(!set[key]){d=new Date(d.getTime()-86400000);key=Utilities.formatDate(d,TIMEZONE,'yyyy-MM-dd');}
  let streak=0;while(set[key]){streak++;d=new Date(d.getTime()-86400000);key=Utilities.formatDate(d,TIMEZONE,'yyyy-MM-dd');}return streak;
}
function getDailyRecord(userId,date){const sheet=getDailySheet(),row=findDailyRow(sheet,userId,date);if(!row)return null;const r=sheet.getRange(row,1,1,DAILY_HEADERS.length).getValues()[0];return{date:cellDateString(r[1]),minutes:Number(r[2])||0,medal:String(r[3]||''),points:Number(r[4])||0};}

function isDormantRow(row,now){const basis=row[12] instanceof Date?row[12]:(row[13] instanceof Date?row[13]:null);return!!basis&&now.getTime()-basis.getTime()>=DORMANT_HOURS*3600000;}
function hasCheeredToday(senderId,recipientId){if(!senderId||!recipientId||senderId===recipientId)return false;const sheet=getCheerSheet(),lastRow=sheet.getLastRow();if(lastRow<2)return false;const today=todayString(),rows=sheet.getRange(2,1,lastRow-1,CHEER_HEADERS.length).getValues();return rows.some(r=>String(r[1])===senderId&&String(r[2])===recipientId&&r[3] instanceof Date&&Utilities.formatDate(r[3],TIMEZONE,'yyyy-MM-dd')===today);}
function saveAvatar(dataUrl,userId){const match=String(dataUrl).match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);if(!match)throw new Error('アイコン画像の形式が正しくありません。');const bytes=Utilities.base64Decode(match[2]);if(bytes.length>500000)throw new Error('アイコン画像が大きすぎます。');const mimeType=match[1],extension=mimeType==='image/png'?'png':mimeType==='image/webp'?'webp':'jpg',folder=getAvatarFolder(),safeId=userId.replace(/[^a-zA-Z0-9_-]/g,'_'),existing=folder.getFiles();while(existing.hasNext()){const f=existing.next();if(f.getName().indexOf(safeId+'.')===0)f.setTrashed(true);}const file=folder.createFile(Utilities.newBlob(bytes,mimeType,safeId+'.'+extension));try{file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);return{avatarUrl:'https://drive.google.com/thumbnail?id='+file.getId()+'&sz=w256',warning:''};}catch(e){return{avatarUrl:'',warning:'Google Driveの共有制限により、アイコンはこの端末内だけに保存されました。'};}}
function getAvatarFolder(){const folders=DriveApp.getFoldersByName(AVATAR_FOLDER_NAME);return folders.hasNext()?folders.next():DriveApp.createFolder(AVATAR_FOLDER_NAME);}
function findUserRow(sheet,userId){const lastRow=sheet.getLastRow();if(lastRow<2)return null;const ids=sheet.getRange(2,1,lastRow-1,1).getDisplayValues();for(let i=0;i<ids.length;i++)if(String(ids[i][0])===userId)return i+2;return null;}
function findCheerRow(sheet,cheerId){const lastRow=sheet.getLastRow();if(lastRow<2)return null;const ids=sheet.getRange(2,1,lastRow-1,1).getDisplayValues();for(let i=0;i<ids.length;i++)if(String(ids[i][0])===cheerId)return i+2;return null;}
function findDailyRow(sheet,userId,date){const lastRow=sheet.getLastRow();if(lastRow<2)return null;const rows=sheet.getRange(2,1,lastRow-1,2).getValues();for(let i=0;i<rows.length;i++)if(String(rows[i][0])===userId&&cellDateString(rows[i][1])===date)return i+2;return null;}
function getBadgeSheet(){return getSpreadsheet().getSheetByName(BADGE_SHEET_NAME);}
function getSpreadsheet(){const props=PropertiesService.getScriptProperties();let id=props.getProperty(SPREADSHEET_PROPERTY_KEY);if(!id){const active=SpreadsheetApp.getActiveSpreadsheet();if(!active)throw new Error('スプレッドシートとの接続設定がありません。スプレッドシートからApps Scriptを開き、setupSheetを一度実行してください。');id=active.getId();props.setProperty(SPREADSHEET_PROPERTY_KEY,id);}return SpreadsheetApp.openById(id);}function getUserSheet(){return getSpreadsheet().getSheetByName(SHEET_NAME);}function getCheerSheet(){return getSpreadsheet().getSheetByName(CHEER_SHEET_NAME);}function getDailySheet(){return getSpreadsheet().getSheetByName(DAILY_SHEET_NAME);}
function getCurrentWeekId(){const now=new Date(),day=Number(Utilities.formatDate(now,TIMEZONE,'u')),monday=new Date(now.getTime()-(day-1)*86400000);return Utilities.formatDate(monday,TIMEZONE,'yyyy-MM-dd');}
function getWeekIdForDate(dateString){
  const normalized=normalizeDateString(dateString);
  if(!normalized)return getCurrentWeekId();
  const parts=normalized.split('-').map(Number);
  const date=new Date(parts[0],parts[1]-1,parts[2],12,0,0);
  const day=date.getDay()===0?7:date.getDay();
  date.setDate(date.getDate()-(day-1));
  return Utilities.formatDate(date,TIMEZONE,'yyyy-MM-dd');
}
function todayString(){return Utilities.formatDate(new Date(),TIMEZONE,'yyyy-MM-dd');}function cellDateString(v){if(v instanceof Date)return Utilities.formatDate(v,TIMEZONE,'yyyy-MM-dd');const s=String(v||'').trim().replace(/[年月\/\.]/g,'-').replace(/日/g,'').replace(/-+/g,'-');const m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);return m?m[1]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[3]).padStart(2,'0'):s.slice(0,10);}function normalizeDateString(v){const s=String(v||'');return/^\d{4}-\d{2}-\d{2}$/.test(s)?s:'';}function cleanText(v){return String(v||'').trim().slice(0,200);}function formatDate(v){return v instanceof Date?Utilities.formatDate(v,TIMEZONE,'yyyy-MM-dd HH:mm:ss'):'';}function jsonResponse(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}function errorResponse(error){return jsonResponse({success:false,message:error&&error.message?error.message:'処理中にエラーが発生しました。'});}


function getMissionSheet(){return getSpreadsheet().getSheetByName(MISSION_SHEET_NAME);}
function getMissionRecords(userId){if(!userId)return[];const s=getMissionSheet(),last=s.getLastRow();if(last<2)return[];return s.getRange(2,1,last-1,MISSION_HEADERS.length).getValues().filter(r=>String(r[1])===userId).map(r=>({subject:String(r[2]),problemId:String(r[3]),round:Number(r[4])||1,level:String(r[5]||'circle'),points:Number(r[6])||0,updatedAt:formatDate(r[7])}));}
function missionLevelPoints(level){if(level==='triangle')return 5;if(level==='circle')return 15;if(level==='double')return 35;return 0;}
function getMissionPoints(userId){const records=getMissionRecords(userId).filter(r=>r.problemId&&!String(r.problemId).startsWith('__')&&[1,2,3].includes(Number(r.round)));let total=records.reduce((sum,r)=>sum+missionLevelPoints(String(r.level||'')),0);const keys=[...new Set(records.map(r=>`${r.subject}|${r.problemId}`))];keys.forEach(key=>{const [subject,problemId]=key.split('|');const complete=[1,2,3].every(round=>records.some(r=>r.subject===subject&&r.problemId===problemId&&Number(r.round)===round&&['triangle','circle','double'].includes(r.level)));if(complete)total+=100;});return total;}
function getMissionSync(userId){if(!userId)throw new Error('ユーザー情報がありません。');return{success:true,records:getMissionRecords(userId),missionPoints:getMissionPoints(userId)};}
function findMissionRow(sheet,userId,subject,problemId,round){const last=sheet.getLastRow();if(last<2)return null;const rows=sheet.getRange(2,1,last-1,5).getDisplayValues();for(let i=0;i<rows.length;i++)if(rows[i][1]===userId&&rows[i][2]===subject&&rows[i][3]===problemId&&Number(rows[i][4])===round)return i+2;return null;}
function saveMission(params){const userId=cleanText(params.userId),subject=cleanText(params.subject),problemId=cleanText(params.problemId),round=Math.floor(Number(params.round)),level=cleanText(params.level);if(!userId||!['commercial','industrial'].includes(subject)||!problemId||round<1||round>3||!['none','triangle','circle','double'].includes(level))throw new Error('問題演習の記録が正しくありません。');if(!findUserRow(getUserSheet(),userId))throw new Error('ユーザー登録が確認できません。');const sheet=getMissionSheet(),row=findMissionRow(sheet,userId,subject,problemId,round),now=new Date(),recordPoints=missionLevelPoints(level);if(row)sheet.getRange(row,6,1,3).setValues([[level,recordPoints,now]]);else sheet.appendRow([Utilities.getUuid(),userId,subject,problemId,round,level,recordPoints,now]);SpreadsheetApp.flush();return{success:true,missionPoints:getMissionPoints(userId),missionRecords:getMissionRecords(userId)};}

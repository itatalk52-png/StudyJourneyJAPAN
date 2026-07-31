const SPREADSHEET_PROPERTY_KEY = 'STUDY_JOURNEY_SPREADSHEET_ID';
const SHEET_NAME = 'ユーザー';
const CHEER_SHEET_NAME = 'エール履歴';
const DAILY_SHEET_NAME = '日別学習記録';
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

function doGet(e) {
  try {
    setupSheet();
    const p = (e && e.parameter) || {};
    const action = String(p.action || 'ranking');
    if (action === 'ranking') return jsonResponse({success:true, ranking:getRanking(cleanText(p.userId)), inbox:getInbox(cleanText(p.userId))});
    if (action === 'calendar') return jsonResponse(getCalendar(cleanText(p.userId), cleanText(p.month)));
    if (action === 'health') return jsonResponse({success:true, message:'Study Journey JAPAN API Ver.1.8.0 is working.'});
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
    if (action === 'register') return jsonResponse(registerUser(params));
    if (action === 'addStudy') return jsonResponse(addStudyTime(params));
    if (action === 'sendCheer') return jsonResponse(sendCheer(params));
    if (action === 'thankCheer') return jsonResponse(thankCheer(params));
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
  const userId=cleanText(params.userId), nickname=cleanText(params.nickname), faculty=cleanText(params.faculty), department=cleanText(params.department), teacherEmail=cleanText(params.teacherEmail);
  if(!userId)throw new Error('ユーザーIDがありません。'); if(!nickname)throw new Error('ニックネームを入力してください。');
  const sheet=getUserSheet(), rowNumber=findUserRow(sheet,userId), now=new Date(); let avatarUrl=rowNumber?String(sheet.getRange(rowNumber,11).getValue()||''):'';
  let avatarWarning='';if(String(params.removeAvatar)==='true')avatarUrl='';else if(params.avatarData){const saved=saveAvatar(params.avatarData,userId);avatarUrl=saved.avatarUrl;avatarWarning=saved.warning||'';}
  if(rowNumber){sheet.getRange(rowNumber,2,1,4).setValues([[nickname,faculty,department,teacherEmail]]);sheet.getRange(rowNumber,9).setValue(now);sheet.getRange(rowNumber,11).setValue(avatarUrl);return{success:true,isNewUser:false,userId,avatarUrl,avatarWarning};}
  sheet.appendRow([userId,nickname,faculty,department,teacherEmail,0,0,'沖縄県',now,getCurrentWeekId(),avatarUrl,0,'',now,0,0,0]);
  return{success:true,isNewUser:true,userId,avatarUrl,avatarWarning};
}

function addStudyTime(params) {
  const userId=cleanText(params.userId), minutes=Math.floor(Number(params.minutes)), currentPrefecture=cleanText(params.currentPrefecture)||'沖縄県';
  const studyDate=normalizeDateString(params.studyDate)||todayString();
  if(!userId)throw new Error('ユーザーIDがありません。'); if(!Number.isFinite(minutes)||minutes<=0)throw new Error('学習時間が正しくありません。'); if(minutes>1440)throw new Error('一度に登録できる学習時間は1,440分までです。');
  const sheet=getUserSheet(), rowNumber=findUserRow(sheet,userId); if(!rowNumber)throw new Error('ユーザー登録が確認できません。プロフィールを保存し直してください。');
  const values=sheet.getRange(rowNumber,1,1,HEADERS.length).getValues()[0], currentWeekId=getCurrentWeekId();
  let weeklyMinutes=String(values[9]||'')===currentWeekId?Number(values[5])||0:0, totalMinutes=Number(values[6])||0;
  weeklyMinutes+=minutes; totalMinutes+=minutes; const now=new Date();
  sheet.getRange(rowNumber,6,1,5).setValues([[weeklyMinutes,totalMinutes,currentPrefecture,now,currentWeekId]]); sheet.getRange(rowNumber,13).setValue(now);

  const dailyResult=addDailyMinutes(userId,studyDate,minutes,now);
  let medalPoints=Number(sheet.getRange(rowNumber,15).getValue())||0;
  if(dailyResult.pointsAdded){medalPoints+=dailyResult.pointsAdded;sheet.getRange(rowNumber,15).setValue(medalPoints);}
  const streakResult=awardStreakBonus(userId,rowNumber);
  const restartBonusCount=awardRestartBonuses(userId,now);
  const cheerPoints=Number(sheet.getRange(rowNumber,12).getValue())||0, streakPoints=Number(sheet.getRange(rowNumber,16).getValue())||0;
  SpreadsheetApp.flush();
  return{success:true,addedMinutes:minutes,studyDate,weeklyMinutes,totalMinutes,cheerPoints,medalPoints,streakPoints,totalPoints:totalMinutes+cheerPoints+medalPoints+streakPoints,restartBonusCount,currentPrefecture,medal:dailyResult.medal,dayMinutes:dailyResult.minutes,medalPointsAdded:dailyResult.pointsAdded,streak:streakResult.streak,streakBonusAdded:streakResult.pointsAdded};
}

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
  const recipientValues=users.getRange(recipientRow,1,1,HEADERS.length).getValues()[0],dormant=isDormantRow(recipientValues,new Date()),points=dormant?10:5,now=new Date(),cheerId=Utilities.getUuid();
  getCheerSheet().appendRow([cheerId,senderId,recipientId,now,points,'','']);const senderPoints=(Number(users.getRange(senderRow,12).getValue())||0)+points;users.getRange(senderRow,12).setValue(senderPoints);return{success:true,cheerId,points,dormant,senderCheerPoints:senderPoints};
}
function thankCheer(params){
  const userId=cleanText(params.userId),cheerId=cleanText(params.cheerId);if(!userId||!cheerId)throw new Error('エール情報が確認できません。');const cheers=getCheerSheet(),row=findCheerRow(cheers,cheerId);if(!row)throw new Error('エールが見つかりません。');
  const values=cheers.getRange(row,1,1,CHEER_HEADERS.length).getValues()[0];if(String(values[2])!==userId)throw new Error('このエールには返信できません。');if(values[5])throw new Error('すでに「ありがとう😊」を送りました。');
  const users=getUserSheet(),userRow=findUserRow(users,userId);if(!userRow)throw new Error('参加者情報が見つかりません。');const points=Number(values[4])||5;cheers.getRange(row,6).setValue(new Date());const newPoints=(Number(users.getRange(userRow,12).getValue())||0)+points;users.getRange(userRow,12).setValue(newPoints);return{success:true,points,cheerPoints:newPoints};
}
function awardRestartBonuses(recipientId,now){const cheers=getCheerSheet(),lastRow=cheers.getLastRow();if(lastRow<2)return 0;const rows=cheers.getRange(2,1,lastRow-1,CHEER_HEADERS.length).getValues(),cutoff=new Date(now.getTime()-RESTART_BONUS_HOURS*3600000),users=getUserSheet();let count=0;rows.forEach((row,i)=>{const sentAt=row[3];if(String(row[2])===recipientId&&sentAt instanceof Date&&sentAt>=cutoff&&sentAt<=now&&!row[6]){const senderRow=findUserRow(users,String(row[1]));if(senderRow){users.getRange(senderRow,12).setValue((Number(users.getRange(senderRow,12).getValue())||0)+5);cheers.getRange(i+2,7).setValue(now);count++;}}});return count;}

function getRanking(viewerId){
  const sheet=getUserSheet(),lastRow=sheet.getLastRow();if(lastRow<2)return[];const currentWeekId=getCurrentWeekId(),now=new Date(),values=sheet.getRange(2,1,lastRow-1,HEADERS.length).getValues();
  const ranking=values.filter(r=>String(r[0]||'')).map(r=>{const weekly=String(r[9]||'')===currentWeekId?Number(r[5])||0:0,cheerPoints=Number(r[11])||0,medalPoints=Number(r[14])||0,streakPoints=Number(r[15])||0,dormant=isDormantRow(r,now);return{userId:String(r[0]),nickname:String(r[1]||''),faculty:String(r[2]||''),department:String(r[3]||''),weeklyMinutes:weekly,totalMinutes:Number(r[6])||0,totalPoints:(Number(r[6])||0)+cheerPoints+medalPoints+streakPoints,cheerPoints,medalPoints,streakPoints,currentPrefecture:String(r[7]||'沖縄県'),updatedAt:formatDate(r[8]),avatarUrl:String(r[10]||''),dormant,cheerValue:dormant?10:5,cheeredToday:viewerId?hasCheeredToday(viewerId,String(r[0])):false};});
  ranking.sort((a,b)=>b.weeklyMinutes-a.weeklyMinutes||b.totalPoints-a.totalPoints||a.nickname.localeCompare(b.nickname,'ja'));return ranking.map((u,i)=>Object.assign({rank:i+1},u));
}
function getInbox(userId){if(!userId)return[];const cheers=getCheerSheet(),lastRow=cheers.getLastRow();if(lastRow<2)return[];const users=getUserSheet(),rows=cheers.getRange(2,1,lastRow-1,CHEER_HEADERS.length).getValues();return rows.filter(r=>String(r[2])===userId&&!r[5]).sort((a,b)=>b[3]-a[3]).slice(0,20).map(r=>{const senderRow=findUserRow(users,String(r[1]));return{cheerId:String(r[0]),senderNickname:senderRow?String(users.getRange(senderRow,2).getValue()||'仲間'):'仲間',points:Number(r[4])||5,sentAt:formatDate(r[3])};});}

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
function getSpreadsheet(){const props=PropertiesService.getScriptProperties();let id=props.getProperty(SPREADSHEET_PROPERTY_KEY);if(!id){const active=SpreadsheetApp.getActiveSpreadsheet();if(!active)throw new Error('スプレッドシートとの接続設定がありません。スプレッドシートからApps Scriptを開き、setupSheetを一度実行してください。');id=active.getId();props.setProperty(SPREADSHEET_PROPERTY_KEY,id);}return SpreadsheetApp.openById(id);}function getUserSheet(){return getSpreadsheet().getSheetByName(SHEET_NAME);}function getCheerSheet(){return getSpreadsheet().getSheetByName(CHEER_SHEET_NAME);}function getDailySheet(){return getSpreadsheet().getSheetByName(DAILY_SHEET_NAME);}
function getCurrentWeekId(){const now=new Date(),day=Number(Utilities.formatDate(now,TIMEZONE,'u')),monday=new Date(now.getTime()-(day-1)*86400000);return Utilities.formatDate(monday,TIMEZONE,'yyyy-MM-dd');}
function todayString(){return Utilities.formatDate(new Date(),TIMEZONE,'yyyy-MM-dd');}function cellDateString(v){if(v instanceof Date)return Utilities.formatDate(v,TIMEZONE,'yyyy-MM-dd');const s=String(v||'').trim().replace(/\//g,'-');const m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);return m?m[1]+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[3]).padStart(2,'0'):s.slice(0,10);}function normalizeDateString(v){const s=String(v||'');return/^\d{4}-\d{2}-\d{2}$/.test(s)?s:'';}function cleanText(v){return String(v||'').trim().slice(0,200);}function formatDate(v){return v instanceof Date?Utilities.formatDate(v,TIMEZONE,'yyyy-MM-dd HH:mm:ss'):'';}function jsonResponse(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}function errorResponse(error){return jsonResponse({success:false,message:error&&error.message?error.message:'処理中にエラーが発生しました。'});}

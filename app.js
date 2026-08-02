const API_URL='https://script.google.com/macros/s/AKfycby2SNa8Fx258tUi3UUDVHNGAqOWg80VYx3I5dSavJnhpMbJaNV-TidNYUh9PxhNnr-fNw/exec';
const DATA={"prefectures":[{"id":"01_okinawa","key":"okinawa","name":"沖縄県","reading":"おきなわけん","badges":[{"name":"首里城","file":"01_shurijo.png"},{"name":"美ら海水族館","file":"02_churaumi_aquarium.png"},{"name":"沖縄そば","file":"03_okinawa_soba.png"},{"name":"紅いもタルト","file":"04_beniimo_tart.png"},{"name":"タコライス","file":"05_taco_rice.png"},{"name":"南国フルーツ","file":"06_tropical_fruits.png"},{"name":"琉球ガラス","file":"07_ryukyu_glass.png"},{"name":"もずく","file":"08_mozuku.png"},{"name":"古宇利大橋","file":"09_kouri_bridge.png"},{"name":"竹富島","file":"10_taketomi_island.png"}]},{"id":"02_kagoshima","key":"kagoshima","name":"鹿児島県","reading":"かごしまけん","badges":[{"name":"桜島","file":"01_sakurajima.png"},{"name":"鹿児島城跡","file":"02_kagoshima_castle.png"},{"name":"黒豚しゃぶしゃぶ","file":"03_kurobuta_shabushabu.png"},{"name":"知覧武家屋敷庭園","file":"04_chiran_samurai_garden.png"},{"name":"屋久島","file":"05_yakushima.png"},{"name":"出水麓","file":"06_izumi_fumoto.png"},{"name":"さつまいも","file":"07_satsumaimo.png"},{"name":"長島","file":"08_nagashima.png"},{"name":"霧島高原","file":"09_kirishima_highlands.png"},{"name":"芋焼酎","file":"10_imo_shochu.png"}]},{"id":"03_miyazaki","key":"miyazaki","name":"宮崎県","reading":"みやざきけん","badges":[{"name":"サンメッセ日南","file":"01_badge.png"},{"name":"高千穂峡","file":"02_badge.png"},{"name":"チキン南蛮","file":"03_badge.png"},{"name":"青島","file":"04_badge.png"},{"name":"宮崎マンゴー","file":"05_badge.png"},{"name":"鵜戸神宮","file":"06_badge.png"},{"name":"地鶏の炭焼き","file":"07_badge.png"},{"name":"霧島連山","file":"08_badge.png"},{"name":"都井岬の野生馬","file":"09_badge.png"},{"name":"冷し汁","file":"10_badge.png"}]},{"id":"04_oita","key":"oita","name":"大分県","reading":"おおいたけん","badges":[{"name":"別府地獄めぐり","file":"01_badge.png"},{"name":"別府温泉街","file":"02_badge.png"},{"name":"とり天","file":"03_badge.png"},{"name":"地獄蒸し","file":"04_badge.png"},{"name":"りゅうきゅう丼","file":"05_badge.png"},{"name":"かぼす","file":"06_badge.png"},{"name":"高崎山のさる","file":"07_badge.png"},{"name":"豊後二見ヶ浦","file":"08_badge.png"},{"name":"杵臼城跡","file":"09_badge.png"},{"name":"ざびえる","file":"10_badge.png"}]},{"id":"05_kumamoto","key":"kumamoto","name":"熊本県","reading":"くまもとけん","badges":[{"name":"熊本城","file":"01_badge.png"},{"name":"阿蘇山","file":"02_badge.png"},{"name":"馬肉","file":"03_badge.png"},{"name":"からし蓮根","file":"04_badge.png"},{"name":"黒川温泉","file":"05_badge.png"},{"name":"天草のイルカ","file":"06_badge.png"},{"name":"あか牛のステーキ","file":"07_badge.png"},{"name":"水天寺成趣園","file":"08_badge.png"},{"name":"通潤橋","file":"09_badge.png"},{"name":"熊本ラーメン","file":"10_badge.png"}]},{"id":"06_nagasaki","key":"nagasaki","name":"長崎県","reading":"ながさきけん","badges":[{"name":"稲佐山の夜景","file":"01_badge.png"},{"name":"大浦天主堂","file":"02_badge.png"},{"name":"長崎ちゃんぽん","file":"03_badge.png"},{"name":"カステラ","file":"04_badge.png"},{"name":"出島","file":"05_badge.png"},{"name":"グラバー園","file":"06_badge.png"},{"name":"ハウステンボス","file":"07_badge.png"},{"name":"長崎くんち","file":"08_badge.png"},{"name":"軍艦島","file":"09_badge.png"},{"name":"長崎のびわ","file":"10_badge.png"}]},{"id":"07_saga","key":"saga","name":"佐賀県","reading":"さがけん","badges":[{"name":"唐津城","file":"01_badge.png"},{"name":"虹の松原","file":"02_badge.png"},{"name":"佐賀牛","file":"03_badge.png"},{"name":"有田焼","file":"04_badge.png"},{"name":"嬉野温泉","file":"05_badge.png"},{"name":"有明海のり","file":"06_badge.png"},{"name":"呼子のいか","file":"07_badge.png"},{"name":"唐津くんち","file":"08_badge.png"},{"name":"嬉野茶","file":"09_badge.png"},{"name":"村岡屋の丸ぼうろ","file":"10_badge.png"}]},{"id":"08_fukuoka","key":"fukuoka","name":"福岡県","reading":"ふくおかけん","badges":[{"name":"太宰府天満宮","file":"01_badge.png"},{"name":"福岡タワー","file":"02_badge.png"},{"name":"博多ラーメン","file":"03_badge.png"},{"name":"明太子","file":"04_badge.png"},{"name":"中洲屋台","file":"05_badge.png"},{"name":"もつ鍋","file":"06_badge.png"},{"name":"福岡城跡","file":"07_badge.png"},{"name":"柳川の川下り","file":"08_badge.png"},{"name":"桜井二見ヶ浦 夫婦岩","file":"09_badge.png"},{"name":"ごぼう天うどん","file":"10_badge.png"}]},{"id":"09_ehime","key":"ehime","name":"愛媛県","reading":"えひめけん","badges":[{"name":"道後温泉","file":"01_dogo_onsen.png"},{"name":"松山城","file":"02_matsuyama_castle.png"},{"name":"しまなみ海道","file":"03_shimanami_kaido.png"},{"name":"愛媛みかん","file":"04_ehime_mikan.png"},{"name":"今治タオル","file":"05_imabari_towel.png"},{"name":"宇和島鯛めし","file":"06_uwajima_taimeshi.png"},{"name":"内子の町並み","file":"07_uchiko_townscape.png"},{"name":"じゃこ天","file":"08_jakoten.png"},{"name":"亀老山展望公園","file":"09_kirosan_observatory.png"},{"name":"伊予柑","file":"10_iyokan.png"}]},{"id":"10_kochi","key":"kochi","name":"高知県","reading":"こうちけん","badges":[{"name":"桂浜","file":"01_katsurahama.png"},{"name":"かつおのたたき","file":"02_katsuo_tataki.png"},{"name":"高知城","file":"03_kochi_castle.png"},{"name":"仁淀川","file":"04_niyodo_river.png"},{"name":"佐川の町並み","file":"05_sakawa_townscape.png"},{"name":"馬路村のゆず","file":"06_umaji_yuzu.png"},{"name":"四国カルスト","file":"07_shikoku_karst.png"},{"name":"どろめ（生しらす）","file":"08_dorome.png"},{"name":"よさこい祭り","file":"09_yosakoi_festival.png"},{"name":"四万十川","file":"10_shimanto_river.png"}]},{"id":"11_kagawa","key":"kagawa","name":"香川県","reading":"かがわけん","badges":[{"name":"瀬戸大橋","file":"01_seto_bridge.png"},{"name":"讃岐うどん","file":"02_sanuki_udon.png"},{"name":"高松城","file":"03_takamatsu_castle.png"},{"name":"栗林公園","file":"04_ritsurin_garden.png"},{"name":"小豆島オリーブ公園","file":"05_shodoshima_olive_park.png"},{"name":"金刀比羅宮（石段）","file":"06_konpira_stairs.png"},{"name":"骨付鳥","file":"07_honetsukidori.png"},{"name":"飯野山（讃岐富士）","file":"08_iinoyama.png"},{"name":"エンジェルロード","file":"09_angel_road.png"},{"name":"小豆島オリーブ","file":"10_shodoshima_olives.png"}]}]};

// Japan map coordinates (percent of the complete map image).
// Route order and badge availability are independent from this table.
const CURRENT_MAPS={
  "沖縄県":   {file:"okinawa.png",   pin:{x:50.0,y:55.0}, national:{x:19.0,y:92.0}},
  "鹿児島県": {file:"kagoshima.png", pin:{x:32.0,y:50.0}, national:{x:29.0,y:73.0}},
  "宮崎県":   {file:"miyazaki.png",   pin:{x:62.0,y:50.0}, national:{x:32.5,y:67.0}},
  "大分県":   {file:"oita.png",       pin:{x:64.0,y:17.0}, national:{x:33.5,y:61.5}},
  "熊本県":   {file:"kumamoto.png",   pin:{x:40.0,y:30.0}, national:{x:28.5,y:64.5}},
  "長崎県":   {file:"nagasaki.png",   pin:{x:15.0,y:24.0}, national:{x:23.0,y:66.0}},
  "佐賀県":   {file:"saga.png",       pin:{x:22.0,y:12.0}, national:{x:26.0,y:61.5}},
  "福岡県":   {file:"fukuoka.png",    pin:{x:35.0,y:8.0},  national:{x:29.5,y:58.5}}
};
const CURRENT_MAP_BASE="Assets/maps/current/";

const STORAGE_KEY='sjj_state_v9_cloud';
const OLD_STORAGE_KEYS=['sjj_state_v8_1_timer','sjj_state_v8_calendar','sjj_state_v7_cheers','sjj_state_v6_multi','sjj_state_v5_multi'];
const PROFILE_KEY='sjj_profile_v2';
const OLD_PROFILE_KEY='sjj_profile_v1';
const defaultState={totalSeconds:0,running:false,sessionStartSeconds:0,activeLastAccountedAt:0,pendingStudySeconds:0,pendingDailySeconds:{},serverWeeklyMinutes:0,serverTotalMinutes:0,cheerPoints:0,medalPoints:0,streakPoints:0,missionPoints:0,currentStreak:0,todayQualified:false,todayServerMinutes:0,badgeHistory:[],lastCloudSync:''};
let storedState=localStorage.getItem(STORAGE_KEY);
if(!storedState) for(const key of OLD_STORAGE_KEYS){storedState=localStorage.getItem(key);if(storedState)break;}
let state=Object.assign({},defaultState,JSON.parse(storedState||'{}'));if(!state.pendingDailySeconds||typeof state.pendingDailySeconds!=='object')state.pendingDailySeconds={};if((state.pendingStudySeconds||0)>0&&!Object.values(state.pendingDailySeconds).some(Number))state.pendingDailySeconds[localDateKey()]=state.pendingStudySeconds;
let profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||localStorage.getItem(OLD_PROFILE_KEY)||'null');
let interval=null,selectedPref=0,mapViewMode='current',syncing=false,pendingAvatarData='',calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
const pageTitles={home:'Home',timer:'Timer',mission:'Mission',collection:'Journey Collection',map:'Journey Map',friends:'Journey Friends'};

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function saveProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}
function normalizeJourneyId(value=''){return value.trim().toUpperCase().replace(/\s+/g,'');}
function initials(name=''){return [...name.trim()].slice(0,2).join('').toUpperCase()||'SJ';}
function localDateKey(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
function formatTime(s){const h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor((s%3600)/60)).padStart(2,'0'),sec=String(s%60).padStart(2,'0');return `${h}:${m}:${sec}`;}
function formatStudyDuration(minutes){const total=Math.max(0,Math.floor(Number(minutes)||0));const hours=Math.floor(total/60),mins=total%60;return hours>0?`${hours}時間${String(mins).padStart(2,'0')}分`:`${mins}分`;}
function formatPoints(value){const n=Math.round((Number(value)||0)*10)/10;return Number.isInteger(n)?String(n):n.toFixed(1);}
function unlockedCount(){return Math.min(DATA.prefectures.reduce((n,p)=>n+p.badges.length,0),Math.floor(state.totalSeconds/600));}
function currentPrefecture(){const index=Math.min(DATA.prefectures.length-1,Math.floor(unlockedCount()/10));return DATA.prefectures[index]?.name||'沖縄県';}
function toast(message,type='ok'){const el=document.getElementById('syncToast');el.textContent=message;el.className=`sync-toast show ${type}`;clearTimeout(el._t);el._t=setTimeout(()=>el.className='sync-toast',3500);}
function showScreen(name){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.dataset.screen===name));document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===name));document.getElementById('pageTitle').textContent=pageTitles[name];if(name==='friends')loadRanking();window.scrollTo({top:0,behavior:'smooth'});}
async function apiPost(params){const body=new URLSearchParams(params);const r=await fetch(API_URL,{method:'POST',body,cache:'no-store'});if(!r.ok)throw new Error(`通信エラー (${r.status})`);const data=await r.json();if(!data.success)throw new Error(data.message||'処理に失敗しました');return data;}
function avatarMarkup(url,name,extraClass=''){return url?`<div class="avatar ${extraClass}"><img src="${escapeAttr(url)}" alt="${escapeAttr(name)}のアイコン"></div>`:`<div class="avatar ${extraClass}">${initials(name)}</div>`;}
function applyAvatar(el,url,name){el.innerHTML='';if(url){const img=document.createElement('img');img.src=url;img.alt=`${name||''}のアイコン`;img.onerror=()=>{el.textContent=initials(name);};el.appendChild(img);}else{el.textContent=initials(name);}}

async function register(event){
  event.preventDefault();
  const btn=document.getElementById('registerSubmit'),msg=document.getElementById('registerMessage');
  btn.disabled=true;msg.textContent='登録しています…';
  try{
    const isNew=!profile?.userId;
    const candidate={userId:profile?.userId||'',nickname:document.getElementById('nicknameInput').value.trim(),faculty:document.getElementById('facultyInput').value.trim(),department:document.getElementById('departmentInput').value.trim(),teacherEmail:document.getElementById('teacherEmailInput').value.trim(),avatarLocal:pendingAvatarData||profile?.avatarLocal||''};
    const result=await apiPost({action:'register',userId:candidate.userId,nickname:candidate.nickname,faculty:candidate.faculty,department:candidate.department,teacherEmail:candidate.teacherEmail});
    candidate.userId=result.userId;profile=candidate;pendingAvatarData='';saveProfile();updateProfileUI();document.getElementById('registerDialog').close();
    await loadCloudState(false);
    if(isNew){document.getElementById('issuedId').textContent=profile.userId;document.getElementById('idDialog').showModal();}
    else toast('プロフィールを更新しました');
  }catch(e){msg.textContent='登録できませんでした：'+e.message;}finally{btn.disabled=false;}
}
async function loginWithId(){
  const btn=document.getElementById('loginSubmit'),msg=document.getElementById('loginMessage'),userId=normalizeJourneyId(document.getElementById('loginIdInput').value);
  if(!userId){msg.textContent='Study Journey IDを入力してください。';return;}
  btn.disabled=true;msg.textContent='記録を読み込んでいます…';
  try{const data=await fetchCloudState(userId);const localAvatar=profile?.userId===userId?(profile.avatarLocal||''):'';profile={...data.profile,avatarLocal:localAvatar};saveProfile();applyCloudData(data.sync);updateProfileUI();document.getElementById('registerDialog').close();toast('続きからスタートできます！');await Promise.all([loadRanking(),loadCalendar(false)]);}catch(e){msg.textContent=e.message;}finally{btn.disabled=false;}
}
async function fetchCloudState(userId){const r=await fetch(`${API_URL}?action=sync&userId=${encodeURIComponent(userId)}&_=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`通信エラー (${r.status})`);const data=await r.json();if(!data.success)throw new Error(data.message||'同期に失敗しました');return data;}
function applyCloudData(cloud){
  const pending=Object.values(state.pendingDailySeconds||{}).reduce((sum,v)=>sum+Number(v||0),0);
  state.serverWeeklyMinutes=Number(cloud.weeklyMinutes)||0;state.serverTotalMinutes=Number(cloud.totalMinutes)||0;state.cheerPoints=Number(cloud.cheerPoints)||0;state.medalPoints=Number(cloud.medalPoints)||0;state.streakPoints=Number(cloud.streakPoints)||0;state.missionPoints=Number(cloud.missionPoints)||0;state.currentStreak=Number(cloud.currentStreak)||0;state.todayServerMinutes=Number(cloud.todayMinutes)||0;state.badgeHistory=Array.isArray(cloud.badgeHistory)?cloud.badgeHistory:[];state.lastCloudSync=cloud.updatedAt||'';
  if(!state.running)state.totalSeconds=state.serverTotalMinutes*60+pending;
  save();renderAll();
}
async function loadCloudState(showToast=true){if(!profile?.userId)return;try{if(state.running)reconcileRunningTime();const data=await fetchCloudState(profile.userId);profile={...data.profile,avatarLocal:profile.avatarLocal||''};saveProfile();applyCloudData(data.sync);updateProfileUI();if(showToast)toast('最新の記録に同期しました');}catch(e){if(showToast)toast('同期できませんでした：'+e.message,'error');}}
function openProfile(){
  const keepButton=document.getElementById('profileKeepButton');
  if(profile){
    document.getElementById('registerTitle').textContent='プロフィール確認';
    document.getElementById('registerIntro').textContent='現在の登録内容です。変更がなければ「プロフィールはそのまま」を押してください。';
    document.getElementById('nicknameInput').value=profile.nickname||'';
    document.getElementById('facultyInput').value=profile.faculty||'';
    document.getElementById('departmentInput').value=profile.department||'';
    document.getElementById('teacherEmailInput').value=profile.teacherEmail||'';
    document.getElementById('currentIdBox').hidden=false;
    document.getElementById('currentUserId').textContent=profile.userId;
    document.getElementById('loginExisting').hidden=true;
    document.getElementById('registerSubmit').textContent='プロフィールを更新';
    keepButton.hidden=false;
  }else{
    document.getElementById('registerTitle').textContent='参加者登録';
    document.getElementById('registerIntro').textContent='初めての方はプロフィールを登録してください。IDは自動で発行されます。';
    document.getElementById('nicknameInput').value='';
    document.getElementById('facultyInput').value='';
    document.getElementById('departmentInput').value='';
    document.getElementById('teacherEmailInput').value='';
    document.getElementById('currentIdBox').hidden=true;
    document.getElementById('loginExisting').hidden=false;
    document.getElementById('registerSubmit').textContent='IDを発行して旅をはじめる';
    keepButton.hidden=true;
  }
  pendingAvatarData='';
  document.getElementById('avatarClearButton').dataset.remove='false';
  updateAvatarPreview(profile?.avatarLocal||'',profile?.nickname||'');
  document.getElementById('avatarInput').value='';
  document.getElementById('registerMessage').textContent='';
  document.getElementById('loginMessage').textContent='';
  document.getElementById('registerDialog').showModal();
}
function updateProfileUI(){const ownAvatar=profile?.avatarLocal||'';applyAvatar(document.getElementById('profileBtn'),ownAvatar,profile?.nickname);applyAvatar(document.querySelector('.avatar.big'),ownAvatar,profile?.nickname);}
function updateAvatarPreview(url,name){applyAvatar(document.getElementById('avatarPreview'),url,name);}
function clearAvatarSelection(){pendingAvatarData='';document.getElementById('avatarInput').value='';document.getElementById('avatarClearButton').dataset.remove='true';updateAvatarPreview('',document.getElementById('nicknameInput').value);document.getElementById('registerMessage').textContent='アイコン選択を解除しました。画像なしで登録できます。';}
async function handleAvatarFile(event){const file=event.target.files?.[0],msg=document.getElementById('registerMessage');if(!file)return;if(!file.type.startsWith('image/')){msg.textContent='画像ファイルを選んでください。';return;}if(file.size>8*1024*1024){msg.textContent='画像は8MB以下にしてください。';return;}try{msg.textContent='画像を準備しています…';pendingAvatarData=await compressImage(file,256,0.82);updateAvatarPreview(pendingAvatarData,document.getElementById('nicknameInput').value);msg.textContent='アイコンを選択しました。登録ボタンで保存されます。';}catch(e){pendingAvatarData='';msg.textContent='画像を読み込めませんでした。別の画像をお試しください。';}}
function compressImage(file,maxSize,quality){return new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{try{const size=Math.min(img.width,img.height),sx=(img.width-size)/2,sy=(img.height-size)/2,canvas=document.createElement('canvas');canvas.width=maxSize;canvas.height=maxSize;canvas.getContext('2d').drawImage(img,sx,sy,size,size,0,0,maxSize,maxSize);URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/jpeg',quality));}catch(e){reject(e);}};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('image error'));};img.src=url;});}

async function syncPendingMinutes(){if(!profile||syncing)return;const entries=Object.entries(state.pendingDailySeconds||{}).map(([date,seconds])=>({date,minutes:Math.floor(Number(seconds||0)/60)})).filter(x=>x.minutes>0).sort((a,b)=>a.date.localeCompare(b.date));if(!entries.length)return;syncing=true;const total=entries.reduce((a,b)=>a+b.minutes,0);toast(`${total}分を記録しています…`);let lastData=null;try{for(const item of entries){const data=await apiPost({action:'addStudy',userId:profile.userId,minutes:String(item.minutes),studyDate:item.date,currentPrefecture:currentPrefecture()});state.pendingDailySeconds[item.date]=Math.max(0,Number(state.pendingDailySeconds[item.date]||0)-item.minutes*60);lastData=data;if(data.medalPointsAdded)toast(`${medalLabel(data.medal)}を獲得しました！ +${data.medalPointsAdded}pt 🎉`);if(data.streakBonusAdded)toast(`連続学習${data.streak}日目！ +${data.streakBonusAdded}pt 🎉`);}state.pendingStudySeconds=Object.values(state.pendingDailySeconds).reduce((a,b)=>a+Number(b||0),0);if(lastData){state.serverWeeklyMinutes=Number(lastData.weeklyMinutes)||0;state.serverTotalMinutes=Number(lastData.totalMinutes)||0;state.cheerPoints=Number(lastData.cheerPoints)||0;state.medalPoints=Number(lastData.medalPoints)||0;state.streakPoints=Number(lastData.streakPoints)||0;state.currentStreak=Number(lastData.streak)||0;if(Array.isArray(lastData.newBadges)&&lastData.newBadges.length)state.badgeHistory=[...(state.badgeHistory||[]),...lastData.newBadges];state.totalSeconds=state.serverTotalMinutes*60+state.pendingStudySeconds;}save();toast(`${total}分をランキングとカレンダーへ反映しました`);await Promise.all([loadRanking(),loadCalendar(false)]);}catch(e){toast('記録の送信に失敗しました。次回停止時に再送します：'+e.message,'error');}finally{syncing=false;renderAll();}}
function addElapsedSeconds(startMs,endMs){
  let seconds=Math.max(0,Math.floor((endMs-startMs)/1000));
  if(!seconds)return 0;
  let cursor=startMs,remaining=seconds;
  while(remaining>0){
    const d=new Date(cursor),nextMidnight=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime();
    const segment=Math.min(remaining,Math.max(1,Math.ceil((nextMidnight-cursor)/1000)));
    const key=localDateKey(d);
    state.pendingDailySeconds[key]=(Number(state.pendingDailySeconds[key])||0)+segment;
    cursor+=segment*1000;
    remaining-=segment;
  }
  state.totalSeconds+=seconds;
  state.pendingStudySeconds=Object.values(state.pendingDailySeconds).reduce((a,b)=>a+Number(b||0),0);
  return seconds;
}
function reconcileRunningTime(){
  if(!state.running)return 0;
  const now=Date.now();
  if(!Number(state.activeLastAccountedAt)){state.activeLastAccountedAt=now;save();return 0;}
  const added=addElapsedSeconds(Number(state.activeLastAccountedAt),now);
  if(added){state.activeLastAccountedAt=Number(state.activeLastAccountedAt)+added*1000;save();}
  return added;
}
function startTimerLoop(){
  clearInterval(interval);
  interval=setInterval(()=>{reconcileRunningTime();renderAll();},1000);
}
function toggleTimer(){
  if(!profile){openProfile();return;}
  if(!state.running){
    state.running=true;
    state.sessionStartSeconds=state.totalSeconds;
    state.activeLastAccountedAt=Date.now();
    save();
    startTimerLoop();
  }else{
    reconcileRunningTime();
    state.running=false;
    state.activeLastAccountedAt=0;
    clearInterval(interval);
    interval=null;
    state.sessionStartSeconds=state.totalSeconds;
    save();
    const minutes=Math.floor((state.pendingStudySeconds||0)/60);
    if(minutes>0)syncPendingMinutes();
    else toast('1分未満の記録も保持しています。合計1分でランキングに加算されます');
  }
  renderAll();
}

async function sendCheer(recipientId,nickname,button){if(!profile)return openProfile();button.disabled=true;try{const data=await apiPost({action:'sendCheer',senderId:profile.userId,recipientId});state.cheerPoints=Number(data.senderCheerPoints)||state.cheerPoints;save();toast(`${nickname}さんにエールを送りました🎉 +${data.points}pt`);await loadRanking();}catch(e){toast(e.message,'error');button.disabled=false;}}
async function thankCheer(cheerId,button){button.disabled=true;try{const data=await apiPost({action:'thankCheer',userId:profile.userId,cheerId});state.cheerPoints=Number(data.cheerPoints)||state.cheerPoints;save();toast(`ありがとう😊 +${data.points}pt`);await loadRanking();}catch(e){toast(e.message,'error');button.disabled=false;}}
function renderInbox(items){const box=document.getElementById('cheerInbox');box.innerHTML='';if(!items?.length){box.hidden=true;return;}box.hidden=false;items.forEach(item=>{const row=document.createElement('div');row.className='cheer-notice';row.innerHTML=`<strong>🎉 ${escapeHtml(item.senderNickname)}さんからエールが届きました😄</strong><button type="button">ありがとう😊</button>`;row.querySelector('button').onclick=e=>thankCheer(item.cheerId,e.currentTarget);box.appendChild(row);});}

let collectionRenderKey='';
function renderCollection(force=false){const unlocked=unlockedCount(),key=`${selectedPref}:${unlocked}`;if(!force&&key===collectionRenderKey)return;collectionRenderKey=key;const p=DATA.prefectures[selectedPref];[...document.getElementById('prefTabs').children].forEach((b,i)=>b.classList.toggle('active',i===selectedPref));document.getElementById('prefReading').textContent=p.reading;document.getElementById('prefTitle').textContent=p.name;const prefUnlocked=Math.max(0,Math.min(10,unlocked-selectedPref*10));document.getElementById('prefCount').textContent=`${prefUnlocked} / 10`;document.getElementById('collectionProgress').textContent=`${unlocked} / ${DATA.prefectures.reduce((n,x)=>n+x.badges.length,0)}`;const grid=document.getElementById('badgeGrid');grid.innerHTML='';p.badges.forEach((badge,i)=>{const globalIndex=selectedPref*10+i,isUnlocked=globalIndex<unlocked,btn=document.createElement('button');btn.className='badge-card'+(isUnlocked?'':' locked');const path=`Assets/badges/${p.id}/${badge.file}`;btn.innerHTML=`<div class="badge-wrap"><img src="${path}" alt="${isUnlocked?badge.name:'未取得バッジ'}"><div class="lock-icon">?</div></div><small>${String(i+1).padStart(2,'0')}</small><strong>${isUnlocked?badge.name:'未取得'}</strong>`;if(isUnlocked)btn.onclick=()=>openBadge(path,p.name,badge.name);grid.appendChild(btn);});}
const dialog=document.getElementById('badgeDialog');function openBadge(path,pref,name){document.getElementById('dialogImage').src=path;document.getElementById('dialogPref').textContent=pref;document.getElementById('dialogName').textContent=name;dialog.showModal();}
function updateCurrentLocationMarker(pin,prefName){
  if(!pin)return;
  const avatarUrl=profile?.avatarLocal||profile?.avatarUrl||'';
  pin.innerHTML='';
  if(avatarUrl){
    const img=document.createElement('img');
    img.src=avatarUrl;
    img.alt=`${profile?.nickname||''}の現在地アイコン`;
    img.onerror=()=>{
      pin.innerHTML='';
      const fallback=document.createElement('span');
      fallback.textContent=initials(profile?.nickname||'SJ');
      pin.appendChild(fallback);
    };
    pin.appendChild(img);
  }else{
    const fallback=document.createElement('span');
    fallback.textContent=initials(profile?.nickname||'SJ');
    pin.appendChild(fallback);
  }
  pin.setAttribute('title',`現在地：${prefName}`);
  pin.setAttribute('aria-label',`現在地：${prefName}`);
}
function setMapImage(image,pin,prefName,isNational){
  if(!image||!pin)return;
  const config=CURRENT_MAPS[prefName]||CURRENT_MAPS["沖縄県"];
  if(isNational){
    image.src=`${CURRENT_MAP_BASE}japan.png`;
    image.alt=`日本全体の地図。現在地は${prefName}`;
    pin.style.left=`${config.national.x}%`;
    pin.style.top=`${config.national.y}%`;
  }else{
    image.src=`${CURRENT_MAP_BASE}${config.file}`;
    image.alt=`${prefName}周辺の地図`;
    pin.style.left=`${config.pin.x}%`;
    pin.style.top=`${config.pin.y}%`;
  }
  updateCurrentLocationMarker(pin,prefName);
}
function updateMap(){
  const unlocked=unlockedCount();
  const prefIndex=Math.min(Math.floor(unlocked/10),Math.max(0,DATA.prefectures.length-1));
  const currentPref=DATA.prefectures[prefIndex]?.name||'沖縄県';
  const prefProgress=Math.max(0,Math.min(10,unlocked-prefIndex*10));
  const isNational=mapViewMode==='national';

  setMapImage(
    document.getElementById('mainMapImage'),
    document.getElementById('mainCurrentLocationPin'),
    currentPref,
    isNational
  );
  setMapImage(
    document.getElementById('homeCurrentMapImage'),
    document.getElementById('homeCurrentLocationPin'),
    currentPref,
    false
  );

  document.getElementById('mapViewport').classList.toggle('national',isNational);
  document.getElementById('mapViewTitle').textContent=isNational?'日本全体':'現在地周辺';
  document.getElementById('mapViewToggle').textContent=isNational?'📍 現在地へ戻る':'🗾 日本全体を見る';
  document.getElementById('mapCaption').textContent=isNational
    ?`日本全体の地図に${currentPref}の現在位置を表示しています。`
    :`${currentPref}周辺の専用地図を表示しています。`;

  document.getElementById('mapCurrentPref').textContent=currentPref;
  document.getElementById('mapCurrentText').textContent=`${currentPref}の10個の思い出を集めましょう。`;
  document.getElementById('mapCurrentProgressLabel').textContent=`${currentPref}の進捗`;
  document.getElementById('mapCurrentProgress').textContent=`${prefProgress} / 10`;
  document.getElementById('mapPrefProgressFill').style.width=`${prefProgress*10}%`;

  const nextPref=DATA.prefectures[prefIndex+1]?.name;
  document.getElementById('mapNextText').textContent=nextPref
    ?`あと${10-prefProgress}個で${nextPref}へ`
    :'北海道のゴールを目指しましょう';

  document.getElementById('homeMapCurrentPref').textContent=currentPref;
  document.getElementById('homeMapPrefProgress').textContent=`${prefProgress} / 10`;
  document.getElementById('homeMapCaption').textContent=`現在地：${currentPref}`;
}
function renderAll(){const unlocked=unlockedCount(),mins=Math.floor(state.totalSeconds/60),pending=Math.floor((state.pendingStudySeconds||0)/60),todayPending=Math.floor(Number((state.pendingDailySeconds||{})[localDateKey()]||0)/60),todayTotal=(Number(state.todayServerMinutes)||0)+todayPending,weeklyMinutes=(Number(state.serverWeeklyMinutes)||0)+pending,studyPoints=(Number(state.serverTotalMinutes)||0)+pending,cheerPoints=Number(state.cheerPoints)||0,medalPoints=Number(state.medalPoints)||0,streakPoints=Number(state.streakPoints)||0,missionPoints=Number(state.missionPoints)||0,totalPoints=studyPoints+cheerPoints+medalPoints+streakPoints+missionPoints,flat=DATA.prefectures.flatMap(p=>p.badges.map(b=>b.name));document.getElementById('homeTimer').textContent=formatTime(state.totalSeconds);document.getElementById('timerDisplay').textContent=formatTime(state.totalSeconds);document.getElementById('todayMinutes').textContent=`${todayTotal} min`;document.getElementById('weekMinutes').textContent=`${weeklyMinutes} min`;
const weeklyRankEl=document.getElementById('weeklyRank');
if(weeklyRankEl&&!weeklyRankEl.dataset.loaded)weeklyRankEl.textContent='今週の勉強時間ランク --位';document.getElementById('totalPoints').textContent=`${formatPoints(totalPoints)} pt`;
const pointRankEl=document.getElementById('pointRank');
if(pointRankEl&&!pointRankEl.dataset.loaded)pointRankEl.textContent='ポイントランク --位';document.getElementById('sessionPoints').textContent=`${todayTotal} pt`;document.getElementById('timerTotalPoints').textContent=`${formatPoints(totalPoints)} pt`;document.getElementById('homeProgressText').textContent=`${unlocked} / 470 Memories`;document.getElementById('mapProgress').textContent=`${unlocked} / 470 Memories`;document.getElementById('homeProgressFill').style.width=`${unlocked/470*100}%`;document.getElementById('nextDestination').textContent=flat[Math.min(unlocked,flat.length-1)];const rem=10-(mins%10||0);document.getElementById('nextBadgeText').textContent=unlocked>=flat.length?'追加バッジを準備中':`あと${rem}分`;document.getElementById('homeStart').textContent=state.running?'PAUSE':'START';document.getElementById('timerStart').textContent=state.running?'PAUSE':'START';const pref=currentPrefecture();document.getElementById('currentChip').textContent=`現在地：${pref}`;document.getElementById('myJourneyText').textContent=`${pref}・${unlocked} Memories`;document.getElementById('myJourneyMinutes').textContent=formatStudyDuration(weeklyMinutes);document.getElementById('myJourneyPoints').textContent=`${formatPoints(totalPoints)} pt`;document.getElementById('pendingSync').textContent=pending>0?`未同期 ${pending}分（${pending}pt）`:'同期済み';renderStreakBanner(todayTotal);renderCollection();updateMap();}
async function loadRanking(){const status=document.getElementById('rankingStatus'),list=document.getElementById('friendsList');status.textContent='読み込み中…';try{const userId=profile?.userId||'';const r=await fetch(`${API_URL}?action=ranking&userId=${encodeURIComponent(userId)}&_=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`通信エラー (${r.status})`);const data=await r.json();if(!data.success)throw new Error(data.message||'取得に失敗しました');renderRanking(data.ranking||[]);renderInbox(data.inbox||[]);status.textContent=`${data.ranking.length}人が今週の旅に参加中`;}catch(e){status.textContent='ランキングを取得できませんでした';list.innerHTML=`<div class="empty-ranking">${escapeHtml(e.message)}<br>Apps Scriptの最新版がデプロイされているか確認してください。</div>`;}}
function renderRanking(rows){const list=document.getElementById('friendsList');list.innerHTML='';if(!rows.length){list.innerHTML='<div class="empty-ranking">まだランキング記録がありません。<br>タイマーを合計1分以上動かして停止すると反映されます。</div>';return;}rows.forEach(row=>{const mine=profile&&row.userId===profile.userId;if(mine){
  state.serverWeeklyMinutes=Number(row.weeklyMinutes)||0;
  state.serverTotalMinutes=Number(row.totalMinutes)||0;
  state.cheerPoints=Number(row.cheerPoints)||0;
  state.medalPoints=Number(row.medalPoints)||0;
  state.streakPoints=Number(row.streakPoints)||0;
  if(!state.running)state.totalSeconds=state.serverTotalMinutes*60+(Number(state.pendingStudySeconds)||0);
  save();
  renderAll();
  const weeklyRankEl=document.getElementById('weeklyRank');
  if(weeklyRankEl){
    weeklyRankEl.textContent=`今週の勉強時間ランク ${Number(row.weeklyRank)||'-'}位`;
    weeklyRankEl.dataset.loaded='true';
  }
  const pointRankEl=document.getElementById('pointRank');
  if(pointRankEl){
    pointRankEl.textContent=`ポイントランク ${Number(row.pointRank)||'-'}位`;
    pointRankEl.dataset.loaded='true';
  }
}const div=document.createElement('div');div.className='friend-row'+(mine?' mine':'');const totalPoints=Number(row.totalPoints)||0;const action=mine?'':`<button type="button" class="cheer-btn ${row.dormant?'dormant':''}" ${row.cheeredToday?'disabled':''}>${row.cheeredToday?'送信済み':`エールを送る🎉 +${row.cheerValue}pt`}</button>`;div.innerHTML=`<span class="rank-no">${Number(row.rank)||'-'}</span>${avatarMarkup(row.avatarUrl,row.nickname)}<div><strong>${escapeHtml(row.nickname)}${mine?'（あなた）':''}</strong><small>${escapeHtml(row.currentPrefecture||'沖縄県')} ${row.faculty?'・'+escapeHtml(row.faculty):''}</small><div class="points-breakdown">学習 ${Number(row.totalMinutes)||0}pt・問題 ${Number(row.missionPoints)||0}pt・メダル ${Number(row.medalPoints)||0}pt・連続 ${Number(row.streakPoints)||0}pt・エール ${formatPoints(row.cheerPoints)}pt</div></div><span class="friend-score"><span class="weekly-time-label">今週の簿記勉強時間</span><strong>${formatStudyDuration(row.weeklyMinutes)}</strong><small>${formatPoints(totalPoints)} pt</small></span>${action}`;const btn=div.querySelector('.cheer-btn');if(btn&&!btn.disabled)btn.onclick=()=>sendCheer(row.userId,row.nickname,btn);list.appendChild(div);});}
function medalLabel(medal){return medal==='gold'?'金メダル':medal==='silver'?'銀メダル':medal==='bronze'?'銅メダル':'メダル';}
function medalImage(medal){return medal?`Assets/medals/${medal}.png`:'';}
function renderStreakBanner(todayMinutes){const el=document.getElementById('streakBanner'),streak=Number(state.currentStreak)||0;if(todayMinutes>=10)el.textContent=`連続学習 ${Math.max(1,streak)}日目🎉`;else if(streak>0)el.textContent=`あと${Math.max(0,10-todayMinutes)}分で連続学習 ${streak+1}日目`;else el.textContent=`あと${Math.max(0,10-todayMinutes)}分で連続学習1日目`;}
async function openCalendar(){if(!profile){openProfile();return;}calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);document.getElementById('calendarDialog').showModal();await syncPendingMinutes();await loadCalendar(true);}
async function loadCalendar(showLoading=true){if(!profile)return;const grid=document.getElementById('calendarGrid');if(showLoading)grid.innerHTML='<div class="calendar-loading">読み込み中…</div>';try{const r=await fetch(`${API_URL}?action=calendar&userId=${encodeURIComponent(profile.userId)}&month=${monthKey(calendarMonth)}&_=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw new Error(`通信エラー (${r.status})`);const data=await r.json();if(!data.success)throw new Error(data.message||'取得に失敗しました');state.currentStreak=Number(data.currentStreak)||0;state.todayQualified=!!data.todayQualified;state.todayServerMinutes=Number(data.todayMinutes)||0;state.medalPoints=Number(data.medalPoints)||0;state.streakPoints=Number(data.streakPoints)||0;save();renderCalendar(data);renderAll();}catch(e){grid.innerHTML=`<div class="calendar-error">${escapeHtml(e.message)}</div>`;}}
function renderCalendar(data){const [year,month]=data.month.split('-').map(Number),first=new Date(year,month-1,1),days=Number(data.daysInMonth)||new Date(year,month,0).getDate(),byDate=Object.fromEntries((data.records||[]).map(r=>[r.date,r])),monthNames=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];document.getElementById('calendarTitle').innerHTML=`<span class="calendar-month-en">${monthNames[month-1]}</span><span class="calendar-year-number">${year}</span><span class="calendar-month-number">${String(month).padStart(2,'0')}</span>`;const grid=document.getElementById('calendarGrid');grid.innerHTML='';const mondayOffset=(first.getDay()+6)%7;for(let i=0;i<mondayOffset;i++){const blank=document.createElement('div');blank.className='calendar-day empty';grid.appendChild(blank);}for(let day=1;day<=days;day++){const date=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,rec=byDate[date],cell=document.createElement('div'),weekday=(new Date(year,month-1,day).getDay()+6)%7;cell.className='calendar-day'+(weekday===5?' saturday':'')+(weekday===6?' sunday':'')+(date===localDateKey()?' today':'');cell.innerHTML=`<span class="calendar-date">${day}</span>${rec&&rec.medal?`<img class="calendar-medal" src="${medalImage(rec.medal)}" alt="${medalLabel(rec.medal)}"><small class="calendar-minutes">${rec.minutes}分</small>`:''}`;grid.appendChild(cell);}const todayMinutes=Number(data.todayMinutes)||0,streak=Number(data.currentStreak)||0,todayQualified=!!data.todayQualified;document.getElementById('calendarStreak').textContent=todayQualified?`連続学習 ${Math.max(1,streak)}日目🎉`:streak>0?`あと${Math.max(0,10-todayMinutes)}分で連続学習 ${streak+1}日目`:`あと${Math.max(0,10-todayMinutes)}分で連続学習1日目`;let goal='';if(todayMinutes<10)goal=`今日はあと${10-todayMinutes}分で銅メダル🥉`;else if(todayMinutes<60)goal=`今日はあと${60-todayMinutes}分で銀メダル🥈`;else if(todayMinutes<120)goal=`今日はあと${120-todayMinutes}分で金メダル🥇`;else goal='今日は金メダルを獲得しました🥇';document.getElementById('calendarTodayGoal').textContent=goal;const c=data.counts||{};document.getElementById('calendarSummary').innerHTML=`<div><span>金メダル</span><strong>${Number(c.gold)||0}枚</strong></div><div><span>銀メダル</span><strong>${Number(c.silver)||0}枚</strong></div><div><span>銅メダル</span><strong>${Number(c.bronze)||0}枚</strong></div><div><span>連続ボーナス</span><strong>${Number(data.streakPoints)||0}pt</strong></div>`;const complete=document.getElementById('calendarComplete');complete.hidden=!data.complete;complete.textContent=data.complete?`🏆 ${month}月コンプリート！` : '';}
function changeCalendarMonth(delta){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+delta,1);loadCalendar();}
function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(s=''){return escapeHtml(s);}

document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>showScreen(b.dataset.target));document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>showScreen(b.dataset.nav));document.getElementById('homeStart').onclick=toggleTimer;document.getElementById('timerStart').onclick=toggleTimer;document.getElementById('profileBtn').onclick=openProfile;document.getElementById('calendarBtn').onclick=openCalendar;document.getElementById('calendarPrev').onclick=()=>changeCalendarMonth(-1);document.getElementById('calendarNext').onclick=()=>changeCalendarMonth(1);document.querySelector('.calendar-close').onclick=()=>document.getElementById('calendarDialog').close();document.getElementById('registerForm').addEventListener('submit',register);document.getElementById('profileKeepButton').onclick=()=>{document.getElementById('registerDialog').close();showScreen('home');toast('プロフィールはそのまま引き継がれています');};document.getElementById('loginSubmit').onclick=loginWithId;document.getElementById('loginIdInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loginWithId();}});document.getElementById('copyIdButton').onclick=async()=>{try{await navigator.clipboard.writeText(profile.userId);toast('IDをコピーしました');}catch(e){toast('IDを長押ししてコピーしてください','error');}};document.getElementById('closeIdButton').onclick=()=>document.getElementById('idDialog').close();document.getElementById('avatarInput').addEventListener('change',handleAvatarFile);document.getElementById('avatarClearButton').addEventListener('click',clearAvatarSelection);document.getElementById('refreshRanking').onclick=async()=>{await syncPendingMinutes();await loadRanking();};
const tabs=document.getElementById('prefTabs');DATA.prefectures.forEach((p,i)=>{const b=document.createElement('button');b.textContent=p.name;b.onclick=()=>{selectedPref=i;renderCollection(true);};tabs.appendChild(b);});
document.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});document.getElementById('mapViewToggle').onclick=()=>{mapViewMode=mapViewMode==='current'?'national':'current';updateMap();};
if(state.running){
  reconcileRunningTime();
  startTimerLoop();
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.running){reconcileRunningTime();renderAll();startTimerLoop();}});
window.addEventListener('pageshow',()=>{if(state.running){reconcileRunningTime();renderAll();startTimerLoop();}});
window.addEventListener('beforeunload',()=>{if(state.running)reconcileRunningTime();});
updateProfileUI();renderAll();showScreen('home');if(!profile)setTimeout(openProfile,400);else{loadCloudState(false).finally(()=>{loadRanking();loadCalendar(false);syncPendingMinutes();});}

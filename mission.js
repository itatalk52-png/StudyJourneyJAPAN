
const MISSION_STORAGE_KEY='sjj_mission_cache_v4';
const MISSION_PENDING_KEY='sjj_mission_pending_v1';
const MISSION_FAVORITE_KEY='sjj_mission_favorites_v1';
const MISSION_LEVELS=['none','triangle','circle','double'];
const MISSION_LEVEL_DISPLAY={
  none:'',
  triangle:'△',
  circle:'○',
  double:'👍✨✨✨'
};
const MISSION_LEVEL_POINTS={none:0,triangle:5,circle:10,double:20};

let missionSubject='commercial';
let missionFilter='all';
let missionRecords={};
let missionFavorites={};
let missionPending={};
let missionSyncing=false;
let openLevelMenuKey='';

function safeJson(text,fallback={}){
  try{return JSON.parse(text)||fallback}catch(e){return fallback}
}
function missionKey(subject,id,round){return `${subject}|${id}|${round}`;}
function favoriteKey(subject,id){return `${subject}|${id}`;}
function missionSubjectData(){return (window.MISSION_DATA&&MISSION_DATA[missionSubject])||[];}
function missionUserId(){return (typeof profile!=='undefined'&&profile?.userId)?String(profile.userId):'guest';}
function missionScopedKey(base){return `${base}:${missionUserId()}`;}

function missionLocalLoad(){
  const scoped=missionScopedKey(MISSION_STORAGE_KEY);
  missionRecords=safeJson(localStorage.getItem(scoped),{});
  if(!Object.keys(missionRecords).length){
    const migrationKeys=[
      missionScopedKey('sjj_mission_cache_v3'),
      missionScopedKey('sjj_mission_cache_v2'),
      'sjj_mission_cache_v3',
      'sjj_mission_cache_v2'
    ];
    for(const key of migrationKeys){
      const legacy=safeJson(localStorage.getItem(key),{});
      if(Object.keys(legacy).length){
        missionRecords=legacy;
        localStorage.setItem(scoped,JSON.stringify(legacy));
        break;
      }
    }
  }
  missionFavorites=safeJson(localStorage.getItem(missionScopedKey(MISSION_FAVORITE_KEY)),safeJson(localStorage.getItem(MISSION_FAVORITE_KEY),{}));
  missionPending=safeJson(localStorage.getItem(missionScopedKey(MISSION_PENDING_KEY)),{});
  normalizeLegacyRecords();
  restoreMissionPoints();
  updateMissionSyncStatus();
}
function missionLocalSave(){
  localStorage.setItem(missionScopedKey(MISSION_STORAGE_KEY),JSON.stringify(missionRecords));
}
function missionPendingSave(){
  localStorage.setItem(missionScopedKey(MISSION_PENDING_KEY),JSON.stringify(missionPending));
  updateMissionSyncStatus();
}
function saveFavorites(){
  localStorage.setItem(missionScopedKey(MISSION_FAVORITE_KEY),JSON.stringify(missionFavorites));
}
function pendingMissionCount(){return Object.keys(missionPending||{}).length;}
function updateMissionSyncStatus(){
  const node=document.getElementById('missionSyncStatus');
  if(!node)return;
  const count=pendingMissionCount();
  node.classList.remove('synced','pending','syncing');
  if(missionSyncing){node.textContent='↻ 同期中';node.classList.add('syncing');}
  else if(count){node.textContent=`⬆ 未同期 ${count}件`;node.classList.add('pending');}
  else{node.textContent='☁ 同期済み';node.classList.add('synced');}
}
function normalizeLegacyRecords(){
  Object.keys(missionRecords).forEach(key=>{
    const old=missionRecords[key];
    if(!old||typeof old!=='object')return;
    old.level=MISSION_LEVELS.includes(old.level)?old.level:'none';
    if(typeof old.solved!=='boolean')old.solved=old.level!=='none';
    old.awarded=old.awarded||{};
    if(old.level==='triangle')old.awarded.triangle=true;
    if(old.level==='circle'){old.awarded.triangle=true;old.awarded.circle=true;}
    if(old.level==='double'){old.awarded.triangle=true;old.awarded.circle=true;old.awarded.double=true;}
  });
}
function recordFor(subject,id,round,create=true){
  const key=missionKey(subject,id,round);
  if(!missionRecords[key]&&create){
    missionRecords[key]={solved:false,level:'none',awarded:{},updatedAt:''};
  }
  return missionRecords[key]||null;
}
function recordsFor(subject,id){
  return [1,2,3].map(round=>recordFor(subject,id,round));
}
function isFavorite(subject,id){return !!missionFavorites[favoriteKey(subject,id)];}
function toggleFavorite(subject,id){
  const key=favoriteKey(subject,id);
  if(missionFavorites[key])delete missionFavorites[key];
  else missionFavorites[key]=true;
  saveFavorites();
  renderMission();
}
function currentMissionPoints(){let total=0;const keys=new Set();Object.entries(missionRecords).forEach(([key,rec])=>{if(key.startsWith('_')||!rec)return;const [subject,id,roundText]=key.split('|'),round=Number(roundText);if(![1,2,3].includes(round))return;keys.add(`${subject}|${id}`);if(rec.level==='triangle')total+=5;else if(rec.level==='circle')total+=15;else if(rec.level==='double')total+=35;});keys.forEach(key=>{const [subject,id]=key.split('|');if([1,2,3].every(round=>{const rec=recordFor(subject,id,round,false);return rec&&['triangle','circle','double'].includes(rec.level)}))total+=100;});return total;}
function restoreMissionPoints(){state.missionPoints=currentMissionPoints();if(typeof save==='function')save();}
function addMissionPoints(amount,message=''){
  if(!amount)return;
  state.missionPoints=(Number(state.missionPoints)||0)+amount;
  if(typeof save==='function')save();
  if(typeof renderAll==='function')renderAll();
  if(message&&typeof toast==='function')toast(message);
}
function awardLevelMilestone(rec,level){
  if(level==='none'||rec.awarded[level])return 0;
  rec.awarded[level]=true;
  return MISSION_LEVEL_POINTS[level];
}
function bonusKey(subject,id){return `${subject}|${id}|complete3`;}
function checkThreeRoundBonus(subject,id){
  const complete=recordsFor(subject,id).every(rec=>rec.solved&&rec.level!=='none');
  missionRecords._bonuses=missionRecords._bonuses||{};
  const key=bonusKey(subject,id);
  if(complete&&!missionRecords._bonuses[key]){
    missionRecords._bonuses[key]=true;
    addMissionPoints(100,'🔥 3回転コンプリート！ +100pt');
  }
}
function queueMissionChange(subject,id,round,level){
  const key=missionKey(subject,id,round);
  missionPending[key]={subject,problemId:id,round:Number(round),level,updatedAt:new Date().toISOString()};
  missionPendingSave();
}
function overlayPendingMissionRecords(target){
  Object.values(missionPending||{}).forEach(change=>{
    const level=MISSION_LEVELS.includes(change.level)?change.level:'none';
    target[missionKey(change.subject,change.problemId,Number(change.round))]={
      solved:level!=='none',level,awarded:{},updatedAt:change.updatedAt||''
    };
  });
  return target;
}
async function flushMissionPending(){
  if(missionSyncing||!profile?.userId||typeof apiPost!=='function'||!navigator.onLine)return;
  const entries=Object.entries(missionPending||{});
  if(!entries.length){updateMissionSyncStatus();return;}
  missionSyncing=true;updateMissionSyncStatus();
  try{
    for(const [key,change] of entries){
      const result=await apiPost({
        action:'saveMission',userId:profile.userId,subject:change.subject,
        problemId:change.problemId,round:String(change.round),level:change.level
      });
      delete missionPending[key];
      missionPendingSave();
      if(Array.isArray(result.missionRecords))applyMissionCloudRecords(result.missionRecords,false);
      state.missionPoints=Number(result.missionPoints)||currentMissionPoints();
    }
    if(typeof save==='function')save();
    if(typeof renderAll==='function')renderAll();
    renderMission();
    if(typeof loadRanking==='function')await loadRanking();
  }catch(error){
    if(typeof toast==='function')toast('MISSIONを端末に保存しました。通信回復後に同期します。','error');
  }finally{
    missionSyncing=false;updateMissionSyncStatus();
  }
}
async function syncMissionRecordToCloud(subject,id,round,level){
  queueMissionChange(subject,id,round,level);
  await flushMissionPending();
}
function setUnderstanding(subject,id,round,newLevel){
  const before=currentMissionPoints(),rec=recordFor(subject,id,round),normalized=MISSION_LEVELS.includes(newLevel)?newLevel:'none';
  rec.level=normalized;rec.solved=normalized!=='none';rec.updatedAt=new Date().toISOString();
  missionLocalSave();state.missionPoints=currentMissionPoints();
  const diff=state.missionPoints-before;
  if(typeof save==='function')save();if(typeof renderAll==='function')renderAll();
  if(diff>0&&typeof toast==='function')toast(`MISSIONが進みました！ +${diff}pt`);
  else if(diff<0&&typeof toast==='function')toast(`問題ポイントを${Math.abs(diff)}pt修正しました`);
  openLevelMenuKey='';renderMission();syncMissionRecordToCloud(subject,id,round,normalized);
}
function missionTimestamp(value){
  const time=Date.parse(value||'');
  return Number.isFinite(time)?time:0;
}
function applyMissionCloudRecords(records,render=true){
  const local={...missionRecords};
  const cloud={};
  (records||[]).forEach(record=>{
    if(!record||!['commercial','industrial'].includes(record.subject)||!record.problemId||![1,2,3].includes(Number(record.round)))return;
    const level=MISSION_LEVELS.includes(record.level)?record.level:'none';
    cloud[missionKey(record.subject,record.problemId,Number(record.round))]={
      solved:level!=='none',level,awarded:{},updatedAt:record.updatedAt||''
    };
  });

  const merged={...local};
  Object.entries(cloud).forEach(([key,cloudRecord])=>{
    const pending=missionPending[key];
    if(pending)return;
    const localRecord=local[key];
    if(!localRecord||missionTimestamp(cloudRecord.updatedAt)>=missionTimestamp(localRecord.updatedAt)){
      merged[key]=cloudRecord;
    }
  });

  // Recover records that exist only on this device by scheduling them for upload.
  Object.entries(local).forEach(([key,localRecord])=>{
    if(key.startsWith('_')||cloud[key]||missionPending[key]||!localRecord)return;
    const [subject,problemId,roundText]=key.split('|');
    const round=Number(roundText);
    if(!['commercial','industrial'].includes(subject)||!problemId||![1,2,3].includes(round))return;
    const level=MISSION_LEVELS.includes(localRecord.level)?localRecord.level:'none';
    if(level!=='none'){
      missionPending[key]={subject,problemId,round,level,updatedAt:localRecord.updatedAt||new Date().toISOString()};
    }
  });

  missionRecords=overlayPendingMissionRecords(merged);
  missionLocalSave();
  missionPendingSave();
  state.missionPoints=currentMissionPoints();
  if(typeof save==='function')save();
  updateMissionSyncStatus();
  if(render){if(typeof renderAll==='function')renderAll();renderMission();}
}
window.applyMissionCloudRecords=applyMissionCloudRecords;
function missionStats(){
  const list=missionSubjectData();
  const solvedProblems=list.filter(problem=>recordsFor(missionSubject,problem.id).some(rec=>rec.solved)).length;
  const solvedRounds=list.reduce((sum,problem)=>sum+recordsFor(missionSubject,problem.id).filter(rec=>rec.solved).length,0);
  return{
    total:list.length,
    solvedProblems,
    solvedRounds,
    remaining:list.length-solvedProblems,
    percent:list.length?Math.round(solvedProblems/list.length*100):0,
    points:currentMissionPoints()
  };
}
function problemMatchesFilter(problem){
  const records=recordsFor(missionSubject,problem.id);
  if(missionFilter==='unstarted')return !records.some(rec=>rec.solved);
  if(missionFilter==='review')return records.some(rec=>rec.level==='triangle');
  if(missionFilter==='master')return records[2]?.level==='double';
  if(missionFilter==='favorite')return isFavorite(missionSubject,problem.id);
  return true;
}

function openChapterKeys(){
  return [...document.querySelectorAll('.mission-chapter[open]')]
    .map(node=>node.dataset.chapterKey)
    .filter(Boolean);
}
function closeMissionLevelPortal(){
  document.querySelectorAll('.mission-level-portal').forEach(node=>node.remove());
  openLevelMenuKey='';
}
function positionMissionLevelPortal(portal,anchor){
  const rect=anchor.getBoundingClientRect();
  const margin=8;
  const width=Math.min(210,window.innerWidth-24);
  portal.style.width=`${width}px`;
  portal.style.left=`${Math.max(12,Math.min(window.innerWidth-width-12,rect.left+rect.width/2-width/2))}px`;

  const portalHeight=portal.offsetHeight||190;
  const roomBelow=window.innerHeight-rect.bottom;
  const top=roomBelow>=portalHeight+margin
    ? rect.bottom+margin
    : Math.max(12,rect.top-portalHeight-margin);
  portal.style.top=`${top}px`;
}
function openMissionLevelPortal(problem,round,rec,anchor){
  closeMissionLevelPortal();
  const portal=document.createElement('div');
  portal.className='mission-level-portal';
  portal.setAttribute('role','menu');
  [
    ['triangle','△'],
    ['circle','○'],
    ['double','👍✨✨✨'],
    ['none','未解答']
  ].forEach(([level,label])=>{
    const option=document.createElement('button');
    option.type='button';
    option.className=`mission-level-option ${rec.level===level?'selected':''}`;
    option.textContent=label;
    option.onclick=event=>{
      event.stopPropagation();
      setUnderstanding(missionSubject,problem.id,round,level);
      closeMissionLevelPortal();
    };
    portal.appendChild(option);
  });
  document.body.appendChild(portal);
  requestAnimationFrame(()=>positionMissionLevelPortal(portal,anchor));
  window.setTimeout(()=>{
    const dismiss=event=>{
      if(!portal.contains(event.target)&&event.target!==anchor){
        closeMissionLevelPortal();
        document.removeEventListener('pointerdown',dismiss,true);
      }
    };
    document.addEventListener('pointerdown',dismiss,true);
  },0);
}

function problemStatus(records){
  if(records[2]?.level==='double')return {type:'master',label:'🏆 MASTER'};
  if(records.some(rec=>rec.solved))return {type:'challenge',label:'🔥 チャレンジ中'};
  return {type:'none',label:''};
}
function createLevelMenu(problem,round,rec){
  const menu=document.createElement('div');
  const key=missionKey(missionSubject,problem.id,round);
  menu.className=`mission-level-menu ${openLevelMenuKey===key?'open':''}`;
  menu.setAttribute('aria-hidden',openLevelMenuKey===key?'false':'true');

  [
    ['triangle','△'],
    ['circle','○'],
    ['double','👍✨✨✨'],
    ['none','未解答']
  ].forEach(([level,label])=>{
    const option=document.createElement('button');
    option.type='button';
    option.className=`mission-level-option ${rec.level===level?'selected':''}`;
    option.textContent=label;
    option.onclick=event=>{
      event.stopPropagation();
      setUnderstanding(missionSubject,problem.id,round,level);
    };
    menu.appendChild(option);
  });
  return menu;
}
function renderMission(){
  const previouslyOpen=openChapterKeys();
  const commercial=missionSubject==='commercial';
  const list=missionSubjectData();
  const stats=missionStats();

  document.getElementById('missionKicker').textContent=commercial?'COMMERCIAL BOOKKEEPING':'INDUSTRIAL BOOKKEEPING';
  document.getElementById('missionTitle').textContent=commercial?'COM. MISSION':'IND. MISSION';
  document.getElementById('missionJapanese').textContent=commercial?'商業簿記':'工業簿記';
  document.getElementById('missionProgressText').textContent=`${stats.solvedProblems} / ${stats.total}問`;
  document.getElementById('missionPercent').textContent=`${stats.percent}%`;
  document.getElementById('missionProgressFill').style.width=`${stats.percent}%`;
  document.getElementById('missionSolvedCount').textContent=`${stats.solvedRounds}回`;
  document.getElementById('missionPointCount').textContent=`${typeof formatPoints==='function'?formatPoints(stats.points):stats.points} pt`;
  document.getElementById('missionRemainingCount').textContent=`${stats.remaining}問`;

  document.querySelectorAll('[data-mission-switch]').forEach(button=>{
    button.classList.toggle('active',button.dataset.missionSwitch===missionSubject);
  });

  const chapters={};
  list.forEach(problem=>(chapters[problem.chapter]||(chapters[problem.chapter]=[])).push(problem));
  const root=document.getElementById('missionChapters');
  root.innerHTML='';

  Object.entries(chapters).forEach(([chapter,problems],chapterIndex)=>{
    const shown=problems.filter(problemMatchesFilter);
    if(!shown.length)return;

    const completed=problems.filter(problem=>recordsFor(missionSubject,problem.id).some(rec=>rec.solved)).length;
    const details=document.createElement('details');
    details.className='mission-chapter';
    details.dataset.chapterKey=String(chapter);
    if(previouslyOpen.includes(String(chapter))||chapterIndex===0||missionFilter!=='all')details.open=true;
    details.innerHTML=`
      <summary>
        <div class="mission-chapter-head">
          <div class="mission-chapter-name">
            <strong>${chapter==='補論'?'補論':`Chapter ${chapter}`}</strong>
            <small>${completed} / ${problems.length}問${completed===problems.length?'・COMPLETE':''}</small>
            <div class="chapter-mini-track"><div style="width:${problems.length?completed/problems.length*100:0}%"></div></div>
          </div>
          <span class="chapter-complete-message">${completed===problems.length?'全問題チャレンジすごい!! 😄':'＋'}</span>
        </div>
      </summary>
      <div class="mission-problems"></div>`;

    const box=details.querySelector('.mission-problems');

    shown.forEach(problem=>{
      const records=recordsFor(missionSubject,problem.id);
      const status=problemStatus(records);
      const row=document.createElement('div');
      row.className='mission-problem';
      row.setAttribute('role','group');

      const head=document.createElement('div');
      head.className='mission-problem-head';

      const main=document.createElement('div');
      main.className='mission-problem-main static';
      main.innerHTML=`
        <span class="mission-problem-id">${typeof escapeHtml==='function'?escapeHtml(problem.id):problem.id}</span>
        <span class="mission-problem-title">${typeof escapeHtml==='function'?escapeHtml(problem.title):problem.title}</span>`;
      head.appendChild(main);

      const favorite=document.createElement('button');
      favorite.type='button';
      favorite.className=`mission-favorite ${isFavorite(missionSubject,problem.id)?'active':''}`;
      favorite.textContent='★';
      favorite.title='お気に入り';
      favorite.onclick=event=>{event.stopPropagation();toggleFavorite(missionSubject,problem.id);};
      head.appendChild(favorite);
      row.appendChild(head);

      if(status.label){
        const statusLine=document.createElement('div');
        statusLine.className=`mission-status mission-status-${status.type}`;
        statusLine.textContent=status.label;
        row.appendChild(statusLine);
      }

      const rounds=document.createElement('div');
      rounds.className='mission-rounds';

      [1,2,3].forEach(round=>{
        const rec=records[round-1];
        const wrap=document.createElement('div');
        wrap.className='mission-round-wrap';

        const button=document.createElement('button');
        button.type='button';
        button.className=`mission-round round-${round} ${rec.solved?'done':''}`;
        button.textContent=`${round}回転目`;
        button.setAttribute('aria-expanded',openLevelMenuKey===missionKey(missionSubject,problem.id,round)?'true':'false');
        button.onclick=event=>{
          event.preventDefault();
          event.stopPropagation();
          openMissionLevelPortal(problem,round,rec,button);
        };
        wrap.appendChild(button);

        const selected=document.createElement('div');
        selected.className=`mission-selected-level level-${rec.level}`;
        selected.textContent=MISSION_LEVEL_DISPLAY[rec.level];
        selected.setAttribute('aria-label',rec.level==='none'?'未解答':`理解度 ${MISSION_LEVEL_DISPLAY[rec.level]}`);
        wrap.appendChild(selected);

        
        rounds.appendChild(wrap);
      });

      row.appendChild(rounds);
      box.appendChild(row);
    });

    root.appendChild(details);
  });
}
async function loadMissionRecordsFromCloud(){
  if(!profile?.userId||!navigator.onLine)return;
  missionSyncing=true;updateMissionSyncStatus();
  try{
    const response=await fetch(`${API_URL}?action=missionSync&userId=${encodeURIComponent(profile.userId)}&_=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`通信エラー (${response.status})`);
    const data=await response.json();
    if(!data.success)throw new Error(data.message||'MISSIONの取得に失敗しました');
    applyMissionCloudRecords(data.records||[],false);
    state.missionPoints=Number(data.missionPoints)||currentMissionPoints();
    if(typeof save==='function')save();
    if(typeof renderAll==='function')renderAll();
    renderMission();
  }catch(error){
    if(typeof toast==='function')toast('端末に保存したMISSIONを表示しています','error');
  }finally{
    missionSyncing=false;updateMissionSyncStatus();
  }
}
async function openMission(subject){
  missionSubject=subject;
  missionFilter='all';
  openLevelMenuKey='';
  document.querySelectorAll('[data-mission-filter]').forEach(button=>{
    button.classList.toggle('active',button.dataset.missionFilter==='all');
  });
  if(typeof showScreen==='function')showScreen('mission');
  missionLocalLoad();
  restoreMissionPoints();
  renderMission();
  await loadMissionRecordsFromCloud();
  await flushMissionPending();
}
function missionCloudLoad(){
  missionLocalLoad();restoreMissionPoints();renderMission();flushMissionPending();
}

missionLocalLoad();
if(Array.isArray(window.__pendingMissionCloudRecords)){
  applyMissionCloudRecords(window.__pendingMissionCloudRecords,false);
  delete window.__pendingMissionCloudRecords;
}
window.addEventListener('online',()=>flushMissionPending());
window.addEventListener('pageshow',()=>{missionLocalLoad();flushMissionPending();});
setTimeout(()=>flushMissionPending(),500);

document.querySelectorAll('[data-mission]').forEach(button=>{
  button.onclick=()=>openMission(button.dataset.mission);
});
document.querySelectorAll('[data-mission-switch]').forEach(button=>{
  button.onclick=()=>{
    missionSubject=button.dataset.missionSwitch;
    closeMissionLevelPortal();
    renderMission();
  };
});
const backButton=document.querySelector('.mission-back');
if(backButton)backButton.onclick=()=>showScreen('home');
document.querySelectorAll('[data-mission-filter]').forEach(button=>{
  button.onclick=()=>{
    missionFilter=button.dataset.missionFilter;
    closeMissionLevelPortal();
    document.querySelectorAll('[data-mission-filter]').forEach(item=>item.classList.toggle('active',item===button));
    renderMission();
  };
});

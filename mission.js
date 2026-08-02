
const MISSION_STORAGE_KEY='sjj_mission_cache_v2';
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
let openLevelMenuKey='';

function safeJson(text,fallback={}){
  try{return JSON.parse(text)||fallback}catch(e){return fallback}
}
function missionKey(subject,id,round){return `${subject}|${id}|${round}`;}
function favoriteKey(subject,id){return `${subject}|${id}`;}
function missionSubjectData(){return (window.MISSION_DATA&&MISSION_DATA[missionSubject])||[];}

function missionLocalLoad(){
  missionRecords=safeJson(localStorage.getItem(MISSION_STORAGE_KEY),{});
  missionFavorites=safeJson(localStorage.getItem(MISSION_FAVORITE_KEY),{});
  normalizeLegacyRecords();
  restoreMissionPoints();
}
function missionLocalSave(){
  localStorage.setItem(MISSION_STORAGE_KEY,JSON.stringify(missionRecords));
}
function saveFavorites(){
  localStorage.setItem(MISSION_FAVORITE_KEY,JSON.stringify(missionFavorites));
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
function awardedTotal(){
  let total=0;
  Object.entries(missionRecords).forEach(([key,rec])=>{
    if(key.startsWith('_')||!rec||!rec.awarded)return;
    if(rec.awarded.triangle)total+=5;
    if(rec.awarded.circle)total+=10;
    if(rec.awarded.double)total+=20;
  });
  const bonuses=missionRecords._bonuses||{};
  total+=Object.keys(bonuses).filter(key=>bonuses[key]).length*100;
  return total;
}
function restoreMissionPoints(){
  const total=awardedTotal();
  state.missionPoints=Math.max(Number(state.missionPoints)||0,total);
  if(typeof save==='function')save();
}
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
function setUnderstanding(subject,id,round,newLevel){
  const rec=recordFor(subject,id,round);
  const normalized=MISSION_LEVELS.includes(newLevel)?newLevel:'none';
  rec.level=normalized;
  rec.solved=normalized!=='none';
  rec.updatedAt=new Date().toISOString();

  const points=awardLevelMilestone(rec,normalized);
  if(points){
    const label=MISSION_LEVEL_DISPLAY[normalized];
    addMissionPoints(points,`${label} 理解度を記録しました！ +${points}pt`);
  }

  missionLocalSave();
  checkThreeRoundBonus(subject,id);
  missionLocalSave();
  openLevelMenuKey='';
  renderMission();
}
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
    points:Number(state.missionPoints)||0
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
function openMission(subject){
  missionSubject=subject;
  missionFilter='all';
  openLevelMenuKey='';
  document.querySelectorAll('[data-mission-filter]').forEach(button=>{
    button.classList.toggle('active',button.dataset.missionFilter==='all');
  });
  if(typeof showScreen==='function')showScreen('mission');
  restoreMissionPoints();
  renderMission();
}
function missionCloudLoad(){
  restoreMissionPoints();
  renderMission();
}

missionLocalLoad();

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

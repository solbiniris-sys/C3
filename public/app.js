// WATERLINE 엔진. 콘텐츠는 data/*.js 에만 추가하세요.
(()=>{
const D=window.DATA,$=id=>document.getElementById(id);
const STATS={hp:['💪','체력'],str:['🏋','근력'],agi:['🏊','민첩'],int:['📚','지력'],hand:['🖐','손재주'],charm:['✨','매력'],emp:['💗','공감'],will:['🔥','의지'],obs:['👁','관찰'],luck:['🍀','운']};
const POOL=40,SMIN=1,SMAX=10,SEASONS=['🌸 물안개의 봄','☀️ 투명한 여름','🍂 서늘한 가을','❄️ 살얼음 겨울'];
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const other=s=>s==='a'?'b':'a';
let S=null,me=localStorage.wl_slot,code=localStorage.wl_code||'',inGame=false,lastRoll=0,T=null,busy=false;
const tpl=(t,s)=>(Array.isArray(t)?t[Math.min(relTier(S.rel),t.length-1)]:t).replace(/\{나\}/g,S.players[s].name).replace(/\{상대\}/g,(S.players[other(s)]||{name:'상대'}).name).replace(/\{펫\}/g,S.pet.name);

async function api(m,b){const r=await fetch('/api/room/'+encodeURIComponent(code)+(m==='GET'&&S&&inGame?'?v='+S.v:''),{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});return{s:r.status,j:await r.json()}}
// 최신 상태를 받아 변경 후 저장. 버전 충돌 시 재시도(두 브라우저 동시 조작 대응)
async function mutate(fn){for(let i=0;i<6;i++){const r=await api('GET');const cur=r.s===404?null:(r.j.same?S:r.j);
 const c2=cur?structuredClone(cur):null;if(c2){c2.npc=c2.npc||{};c2.chat=c2.chat||[];c2.day=c2.day||1;c2.acted=c2.acted||{a:false,b:false};c2.count=c2.count||{};c2.rooms=c2.rooms||{};c2.weather=c2.weather||'맑음';c2.rainDays=c2.rainDays||0;if(c2.pet.bond===undefined)c2.pet.bond=30}const n=fn(c2);if(!n)return false;const w=await api('PUT',{v:cur?cur.v:0,state:n});if(w.s===200){S=w.j;render();return true}}return false}

function log(s,who,text,kind){const p=who==='gm'?null:s.players[who];s.logs.push({who,name:p?p.name:'GM',emoji:p?p.emoji:'🎲',text,kind:kind||'',t:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});if(s.logs.length>300)s.logs.shift()}
function addItem(s,k,n){s.items[k]=(s.items[k]||0)+n;if(s.items[k]<=0)delete s.items[k]}
function fxApply(s,slot,fx){if(!fx)return;const p=s.players[slot];
 if(fx.hp)p.hp=clamp(p.hp+fx.hp,0,p.maxHp);if(fx.stress)p.stress=clamp(p.stress+fx.stress);
 if(fx.rel)s.rel=clamp(s.rel+fx.rel);if(fx.money)s.money=Math.max(0,s.money+fx.money);
 for(const k in fx.stat||{})p.stats[k]=(p.stats[k]||0)+fx.stat[k];
 for(const k in fx.item||{})addItem(s,k,fx.item[k]);if(fx.flag)s.flags[fx.flag]=1;s.npc=s.npc||{};for(const k in fx.npc||{})s.npc[k]=clamp((s.npc[k]||0)+fx.npc[k],-50,100);if(fx.pet)s.pet.bond=clamp((s.pet.bond||0)+fx.pet);for(const k in fx.room||{})repairRoom(s,fx.room[k])}
function repairRoom(s,n){s.rooms=s.rooms||{};const r=D.rooms.find(x=>(!x.unlock||s.flags[x.unlock])&&(s.rooms[x.id]||0)<x.need);if(!r)return;s.rooms[r.id]=(s.rooms[r.id]||0)+n;if(s.rooms[r.id]>=r.need){s.flags['room_'+r.id]=1;log(s,'gm',`🏠 ${r.name} 수리가 끝났다!`)}}
const sIdx=s=>Math.floor(((s.day||1)-1)/12)%4;
const relTier=r=>r<25?0:r<45?1:r<65?2:r<85?3:4;
const relLabel=r=>r<25?'소원함':r<45?'어색함':r<65?'친함':r<85?'신뢰':'깊은 유대';
const WEA=[['비','비','안개','맑음'],['맑음','맑음','폭우','비'],['안개','비','맑음','안개'],['눈','눈','맑음','결빙']];
const SHARED=['rel','money','item','flag','npc','pet','room'];
function fxBoth(s,fx){if(!fx)return;fxApply(s,'a',fx);if(s.players.b){const f={...fx};SHARED.forEach(k=>delete f[k]);fxApply(s,'b',f)}}
function eligible(s,tags,slot){const ev=tags==='evening';return D.scenarios.filter(c=>(ev?c.joint&&c.tags.includes('evening'):(!c.joint||c.free)&&c.tags.some(g=>tags.includes(g)))&&s.ch>=(c.ch?c.ch[0]:1)&&s.ch<=(c.ch?c.ch[1]:5)&&!(c.once&&s.done.includes(c.id))&&(!c.season||c.season.includes(sIdx(s)))&&(!c.weather||c.weather===s.weather)&&(!c.when||c.when(s,slot)))}
// 두 사람이 모두 행동해야 하루가 끝나고, 저녁 공동 사건이 열린다
function tick(s,slot){slot=slot||me;s.acted=s.acted||{a:false,b:false};s.acted[slot]=true;if(!(s.players.a&&s.players.b)||(s.acted.a&&s.acted.b))endDay(s);stressCheck(s)}
function endDay(s){s.acted={a:false,b:false};s.tick++;const pool=eligible(s,'evening');s.day=(s.day||1)+1;s.farm.forEach(f=>{if(f&&f.remain>0)f.remain--});
 if((s.day-1)%12===0)log(s,'gm',`🗓 계절이 바뀌었다: ${SEASONS[sIdx(s)]}`);
 s.weather=WEA[sIdx(s)][Math.floor(Math.random()*4)];s.rainDays=/비|폭우/.test(s.weather)?(s.rainDays||0)+1:0;
 log(s,'gm',`🌅 ${s.day}일차 아침. 날씨: ${s.weather}`);
 if(pool.length&&Math.random()<.7){const c=pool[Math.floor(Math.random()*pool.length)];s.pending={sid:c.id,scene:c.start,joint:true,votes:{}};log(s,'gm',`🌙 [저녁 사건] ${c.title} — 두 사람의 선택이 필요하다.`,'dice')}}
function stressCheck(s){
 if(s.tick%12===0)log(s,'gm',`🗓 계절이 바뀌었다: ${SEASONS[Math.floor(s.tick/12)%4]}`);
 ['a','b'].forEach(k=>{const p=s.players[k];if(p&&p.stress>=100){p.hp=clamp(p.hp-30,0,p.maxHp);p.stress=50;log(s,'gm',`⚠️ ${p.name}이(가) 과로로 앓아누웠다!`)}})}
function meets(s,slot,r){if(!r)return true;const p=s.players[slot];
 if(r.trait&&!p.traits.includes(r.trait))return false;if(r.rel&&s.rel<r.rel)return false;if(r.relMax!==undefined&&s.rel>r.relMax)return false;
 if(r.money&&s.money<r.money)return false;if(r.npc&&((s.npc||{})[r.npc[0]]||0)<r.npc[1])return false;if(r.pet&&s.pet.bond<r.pet)return false;if(r.flag&&!s.flags[r.flag])return false;if(r.stat&&p.stats[r.stat[0]]<r.stat[1])return false;return true}
const scn=id=>D.scenarios.find(x=>x.id===id);

// ---------- 게임 행동 ----------
function doActivity(id){mutate(s=>{if(s.pending||s.over||(s.acted&&s.acted[me]))return null;const a=D.activities.find(x=>x.id===id),p=s.players[me];
 if(!p||p.hp<(a.cost.hp||0)){alert('기력이 부족합니다. 휴식이나 음식이 필요합니다.');return null}
 p.hp=clamp(p.hp-(a.cost.hp||0),0,p.maxHp);s.count=s.count||{};s.count[a.id]=(s.count[a.id]||0)+1;p.stress=clamp(p.stress+(a.cost.stress||0));fxApply(s,me,a.fx);
 let t=tpl(a.texts[0],me);
 if(a.loot){let tot=a.loot.reduce((x,y)=>x+y[1],0),r=Math.random()*tot,it=a.loot[0][0];for(const[n,w]of a.loot){if((r-=w)<0){it=n;break}}addItem(s,it,1);t+=` [${it}]을(를) 얻었다!`}
 log(s,'gm',`${a.icon} ${t}`);
 const pool=eligible(s,a.tags,me);
 if(pool.length&&Math.random()<a.evt){const c=pool[Math.floor(Math.random()*pool.length)];s.pending=c.joint?{sid:c.id,scene:c.start,joint:true,votes:{},actor:me}:{sid:c.id,scene:c.start,actor:me,check:null};log(s,'gm',`🎲 [사건] ${c.title} — ${p.name}의 선택이 필요하다.`,'dice')}
 else tick(s);return s})}
function vote(ci){mutate(s=>{const pd=s.pending;if(!pd||!pd.joint||pd.votes[me]!==undefined)return null;pd.votes[me]=ci;const sc=scn(pd.sid),sn=sc.scenes[pd.scene];
 log(s,'gm',`✅ ${s.players[me].name}이(가) 선택을 마쳤다.`);const two=s.players.a&&s.players.b;
 if(two&&(pd.votes.a===undefined||pd.votes.b===undefined))return s;
 const va=pd.votes.a??pd.votes.b,vb=pd.votes.b??pd.votes.a,same=va===vb,res=same?(sn.choices[va].same||sn.same):sn.diff;
 if(two)log(s,'gm',`${s.players.a.name}: “${tpl(sn.choices[va].t,'a')}” / ${s.players.b.name}: “${tpl(sn.choices[vb].t,'a')}”`);
 const ch=same&&(sn.choices[va].check||sn.check);
 if(ch){const o=sn.choices[va];pd.stage='roll';pd.check=ch;pd.rolls={};pd.res={ok:o.ok||sn.ok,fail:o.fail||sn.fail};log(s,'gm',`🎲 GM: 협동 판정! ${STATS[ch.stat][1]} 난이도 ${ch.dc}. 각자 굴려 높은 쪽을 채택한다.`,'dice');return s}
 log(s,'gm',tpl(res.text,'a'),'dice');fxBoth(s,res.fx);if(sc.once)s.done.push(sc.id);s.pending=null;if(pd.actor)tick(s,pd.actor);return s})}
function petAssist(s,stat){const sp=D.animals.find(a=>a.id===s.pet.species)||{},pe=D.personalities.find(x=>x.id===s.pet.pers)||{},bd=s.pet.bond||0;let b=0,why=[];
 if(sp.skill===stat){b+=1+Math.floor(bd/40);why.push(sp.name)}
 if(pe.stat===stat&&bd>=30){b+=1;why.push(pe.name)}
 if(s.pet.smart&&bd>=60){b+=1;why.push('말을 알아듣는 지능')}return{b,why}}
function petDesc(){const sp=D.animals.find(a=>a.id===S.pet.species),pe=D.personalities.find(x=>x.id===S.pet.pers);return[sp&&sp.name,pe&&pe.name,S.pet.smart&&'말을 알아듣는'].filter(Boolean).join('·')}
async function rollJoint(){const d20=1+Math.floor(Math.random()*20);await playDice({d20},true);
 mutate(s=>{const pd=s.pending;if(!pd||pd.stage!=='roll'||pd.rolls[me])return null;const p=s.players[me],ch=pd.check,pa=petAssist(s,ch.stat),bonus=(p.stats[ch.stat]||0)+pa.b,total=d20+bonus;
 pd.rolls[me]={d20,total};s.roll={id:Date.now(),slot:me,d20,bonus,total,dc:ch.dc,stat:ch.stat};
 log(s,'gm',`🎲 ${p.name}: d20(${d20}) + ${STATS[ch.stat][1]}(${bonus}${pa.b?', 🐾+'+pa.b:''}) = ${total}`,'dice');
 if(s.players.a&&s.players.b&&!(pd.rolls.a&&pd.rolls.b))return s;
 const best=Object.values(pd.rolls).reduce((x,y)=>y.total>x.total?y:x),ok=best.d20===20?true:best.d20===1?false:best.total>=ch.dc;
 log(s,'gm',`${ok?'▶ 성공':'▶ 실패'} (채택 ${best.total} vs ${ch.dc})`,'dice');const res=ok?pd.res.ok:pd.res.fail;log(s,'gm',tpl(res.text,'a'),'dice');fxBoth(s,res.fx);
 if(scn(pd.sid).once)s.done.push(pd.sid);s.pending=null;if(pd.actor)tick(s,pd.actor);return s})}
function finish(s,sc,pd,res){fxApply(s,pd.actor,res.fx);if(res.text)log(s,'gm',tpl(res.text,pd.actor));
 if(res.next&&sc.scenes[res.next]){pd.scene=res.next;pd.check=null}else{if(sc.once)s.done.push(sc.id);s.pending=null;tick(s)}return s}
function choose(ci){mutate(s=>{const pd=s.pending;if(!pd||pd.actor!==me||pd.check!==null)return null;const sc=scn(pd.sid),c=sc.scenes[pd.scene].choices[ci];
 if(!meets(s,me,c.req)){alert('조건을 만족하지 못합니다.');return null}
 if(c.check){pd.check=ci;log(s,'gm',`🎲 GM: ${STATS[c.check.stat][1]} 판정! 난이도 ${c.check.dc}. 직접 주사위를 굴려라.`,'dice');return s}
 return finish(s,sc,pd,c)})}
async function rollDice(){const d20=1+Math.floor(Math.random()*20);await playDice({d20},true);
 mutate(s=>{const pd=s.pending;if(!pd||pd.check===null||pd.actor!==me)return null;const sc=scn(pd.sid),c=sc.scenes[pd.scene].choices[pd.check],p=s.players[me];
 const pa=petAssist(s,c.check.stat),bonus=(p.stats[c.check.stat]||0)+pa.b,total=d20+bonus,ok=d20===1?false:d20===20?true:total>=c.check.dc;
 s.roll={id:Date.now(),slot:me,d20,bonus,total,dc:c.check.dc,ok,stat:c.check.stat};
 log(s,'gm',`🎲 ${p.name}: d20(${d20}) + ${STATS[c.check.stat][1]}(${bonus}${pa.b?', 🐾'+pa.why.join('·')+' +'+pa.b:''}) = ${total} vs ${c.check.dc} → ${d20===20?'대성공!':d20===1?'대실패!':ok?'성공':'실패'}`,'dice');
 return finish(s,sc,pd,ok?c.ok:c.fail)})}
function playDice(r,mine){return new Promise(res=>{const el=$('dice');el.style.display='flex';
 el.innerHTML=`<div class="d spin" id="dv">?</div><div id="dt" style="margin-top:14px;font-size:1.2rem"></div>`;
 const dv=$('dv'),iv=setInterval(()=>dv.textContent=1+Math.floor(Math.random()*20),60);
 setTimeout(()=>{clearInterval(iv);dv.className='d'+(r.d20===20?' crit':r.d20===1?' fumble':'');dv.textContent=r.d20;
  $('dt').textContent=r.d20===20?'대성공!':r.d20===1?'대실패...':(r.ok===undefined?'':`합계 ${r.total} vs ${r.dc}`);
  setTimeout(()=>{el.style.display='none';res()},1400)},1300)})}
function plant(i,k){mutate(s=>{const it=D.items[k];if(s.money<it.cost)return null;s.money-=it.cost;s.farm[i]={crop:k,remain:it.grow};return s});closeShop()}
function harvest(i){mutate(s=>{const f=s.farm[i];if(!f||f.remain>0)return null;addItem(s,f.crop,1);s.farm[i]=null;log(s,'gm',`🌾 ${f.crop}을(를) 수확했다.`);return s})}
function eat(k){mutate(s=>{if(!s.items[k])return null;addItem(s,k,-1);const it=D.items[k];fxApply(s,me,{hp:it.hp,stress:it.stress});log(s,'gm',`🍽 ${s.players[me].name}이(가) ${k}을(를) 먹었다.`);return s})}
function sell(k){mutate(s=>{if(!s.items[k])return null;addItem(s,k,-1);s.money+=D.items[k].sell;log(s,'gm',`💰 ${k} 판매 +${D.items[k].sell}G`);return s})}
function spend(k){mutate(s=>{const p=s.players[me];if(!p.pts)return null;p.pts--;p.stats[k]++;return s})}
function advance(){if(!confirm('시간을 도약합니다. 계속할까요?'))return;mutate(s=>{if(s.pending)return null;
 if(s.ch>=5){const e=D.endings.find(e=>e.check(s));s.over=e.id;log(s,'gm',`🏁 [엔딩: ${tpl(e.name,"a")}] ${tpl(e.text,'a')}`);return s}
 s.ch++;['a','b'].forEach(k=>{const p=s.players[k];if(p){p.maxHp+=10;p.hp=p.maxHp;p.pts=(p.pts||0)+3}});
 log(s,'gm',`⏳ 챕터 ${s.ch} (${D.chapters[s.ch-1].age}): ${tpl(D.chapters[s.ch-1].intro,'a')} 성장 포인트 +3`);return s})}
const fmt=t=>esc(t).replace(/\*(.+?)\*/g,'<i>$1</i>');
const nowT=()=>new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
let tab='log',spk='me',seen=0;
function setTab(t){tab=t;render()}function setSpk(v){spk=v}
// 오른쪽 패널: 📖 진행·역극(GM 로그 + 자캐/펫/지문 발화) / 💬 세션 채팅(플레이어끼리 OOC 대화)
function rightPanel(){const nc=(S.chat||[]).length;if(tab==='chat')seen=nc;const un=tab==='chat'?0:nc-seen;
 const tb=(k,l)=>`<button style="flex:1;border:0;border-radius:0;${tab===k?'background:#2c7771;color:#fff':''}" onclick="WL.tab('${k}')">${l}</button>`;
 const head=`<div style="display:flex;border-bottom:1px solid #ddd">${tb('log','📖 진행·역극')}${tb('chat','💬 세션 채팅'+(un>0?` <span class="tag" style="background:#c0392b;color:#fff">${un}</span>`:''))}</div>`;
 const body=tab==='log'?`<div id="log">${S.logs.map(l=>`<div class="m ${l.who==='gm'?(l.kind||'gm'):''}"><small>${l.emoji} ${esc(l.name)} ${l.t}</small><br><div>${l.text}</div></div>`).join('')}</div>`
  :`<div id="log">${(S.chat||[]).map(c=>`<div class="m" style="text-align:${c.who===me?'right':'left'}"><small>${c.emoji} ${esc(c.name)} ${c.t}</small><br><div style="background:${c.who===me?'#dff3ee':'#fffdf8'};text-align:left">${c.text}</div></div>`).join('')||'<small>아직 대화가 없습니다. 플레이어끼리 편하게 이야기하세요.</small>'}</div>`;
 const sel=tab==='log'?`<select style="width:auto" onchange="WL.spk(this.value)"><option value="me" ${spk==='me'?'selected':''}>🧒 자캐</option><option value="pet" ${spk==='pet'?'selected':''}>🐾 ${esc(S.pet.name)}</option><option value="narr" ${spk==='narr'?'selected':''}>📜 지문</option></select>`:'';
 return head+body+`<div style="padding:10px;display:flex;gap:8px">${sel}<input id="chat" placeholder="${tab==='chat'?'플레이어끼리 대화 (OOC)':'*행동* 대사 · /주사위'}" onkeydown="if(event.key==='Enter')WL.send()"><button class="p" onclick="WL.send()">전송</button></div>`}
function send(){const i=$('chat'),t=i.value.trim();if(!t)return;i.value='';const T0=tab,K=spk;
 mutate(s=>{const p=s.players[me];
  if(T0==='chat'){s.chat=s.chat||[];s.chat.push({who:me,name:p.name,emoji:p.emoji,text:fmt(t),t:nowT()});if(s.chat.length>300)s.chat.shift();return s}
  if(/^\/(주사위|roll)/.test(t))log(s,'gm',`🎲 ${p.name}의 자유 굴림: d100 = ${1+Math.floor(Math.random()*100)}`,'dice');
  else if(K==='pet')s.logs.push({who:'x',name:s.pet.name,emoji:'🐾',text:fmt(t),kind:'',t:nowT()});
  else if(K==='narr')s.logs.push({who:'x',name:'지문',emoji:'📜',text:'<i>'+esc(t)+'</i>',kind:'',t:nowT()});
  else log(s,me,fmt(t));return s})}
function openShop(i){const b=document.createElement('div');b.id='shop';b.style.cssText='position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:40';
 b.innerHTML=`<div class="box" style="max-width:380px;width:100%"><h3>🌱 씨앗 상점</h3>${Object.entries(D.items).filter(([k,v])=>v.grow).map(([k,v])=>`<div class="box" style="display:flex;justify-content:space-between"><span><b>${k}</b> ${v.cost}G<br><small>${v.desc} (${v.grow}턴)</small></span><button ${S.money<v.cost?'disabled':''} onclick="WL.plant(${i},'${k}')">심기</button></div>`).join('')}<button style="width:100%" onclick="WL.closeShop()">닫기</button></div>`;document.body.appendChild(b)}
function closeShop(){const s=$('shop');if(s)s.remove()}

// ---------- 접속 / 캐릭터 시트 ----------
async function enter(slot){code=$('code').value.trim();if(!code)return alert('방 코드를 입력하세요.');
 const r=await api('GET');if(r.s===404){if(slot!=='a')return alert('없는 방입니다. 1P가 먼저 만들어야 합니다.');S=null}else S=r.j;
 if(S&&S.players[slot]){start(slot);return}
 T={slot,create:!S,name:'',emoji:'🧒',stats:Object.fromEntries(Object.keys(STATS).map(k=>[k,SMIN])),traits:[],petName:'',species:D.animals[0].id,pers:D.personalities[0].id};sheet()}
function pts(){return POOL+Object.keys(STATS).length*SMIN-Object.values(T.stats).reduce((a,b)=>a+b,0)}
function sheet(){T.name=$('nm')?$('nm').value:T.name;T.petName=$('pn')?$('pn').value:T.petName;
 $('app').innerHTML=`<div class="setup"><div class="box"><h2>캐릭터 시트 (${T.slot==='a'?'1P':'2P'})</h2>
 <input id="nm" placeholder="이름" maxlength="12" value="${esc(T.name)}"><div style="margin:8px 0"><select id="em" onchange="WL.T.emoji=this.value">${'🧒👧👦🧑🐣🌊🦊🐚'.match(/./gu).map(e=>`<option ${e===T.emoji?'selected':''}>${e}</option>`).join('')}</select></div>
 <textarea rows=3 placeholder='외형 · 배경 · 말투 · 비밀 등 자캐 설정' onchange='WL.T.pf=this.value' style='margin-bottom:8px'>${esc(T.pf||'')}</textarea><b>스탯 배분 (남은 포인트 ${pts()})</b>${Object.entries(STATS).map(([k,[i,n]])=>`<div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0">${i} ${n}<span><button onclick="WL.adj('${k}',-1)">-</button> <b>${T.stats[k]}</b> <button onclick="WL.adj('${k}',1)">+</button></span></div>`).join('')}
 <b>성향 (최대 2)</b><div>${D.traits.map(t=>`<span class="tag ${T.traits.includes(t)?'on':''}" style="cursor:pointer" onclick="WL.tr('${t}')">${t}</span>`).join('')}</div>
 ${T.create?`<hr><b>거대 변이동물</b><input id="pn" placeholder="이름" value="${esc(T.petName)}"><select onchange="WL.T.species=this.value">${D.animals.map(a=>`<option value="${a.id}" ${a.id===T.species?'selected':''}>${a.name} — ${a.desc}</option>`).join('')}</select><select onchange="WL.T.pers=this.value">${D.personalities.map(x=>`<option value="${x.id}" ${x.id===T.pers?'selected':''}>${x.name} — ${x.desc}</option>`).join('')}</select>`:''}
 <button class="p" style="width:100%;margin-top:12px" onclick="WL.submitSheet()">시작</button></div></div>`}
function adj(k,d){T.name=$('nm').value;if(T.petName!==undefined&&$('pn'))T.petName=$('pn').value;const v=T.stats[k]+d;if(v<SMIN||v>SMAX||(d>0&&pts()<=0))return;T.stats[k]=v;sheet()}
function tr(t){T.name=$('nm').value;if($('pn'))T.petName=$('pn').value;const a=T.traits;T.traits=a.includes(t)?a.filter(x=>x!==t):a.length<2?[...a,t]:a;sheet()}
async function submitSheet(){T.name=$('nm').value.trim()||(T.slot==='a'?'아이1':'아이2');if($('pn'))T.petName=$('pn').value.trim()||'보호자';
 const ok=await mutate(s=>{if(!s){s={v:0,code,ch:1,tick:0,money:100,rel:50,players:{a:null,b:null},npc:{},pet:{name:T.petName,species:T.species,bond:30,pers:T.pers,smart:Math.random()<.1},farm:[null,null,null,null],items:{},logs:[],pending:null,day:1,acted:{a:false,b:false},count:{},rooms:{},weather:'맑음',rainDays:0,flags:{},done:[],roll:null,over:false}}
 if(s.players[T.slot])return null;const hp=50+T.stats.hp*5;s.players[T.slot]={name:T.name,emoji:T.emoji,traits:T.traits,stats:{...T.stats},hp,maxHp:hp,stress:0,pts:0,profile:T.pf||''};
 log(s,'gm',`✨ ${T.name}이(가) 저택에 합류했다. (챕터 1 — ${D.chapters[0].age})`);if(T.create&&s.pet.smart)log(s,'gm',`🐾 ${s.pet.name}은(는) 사람의 말을 거의 알아듣는 드문 개체다!`,'dice');return s});
 if(ok||S)start(T.slot)}
function start(slot){me=slot;localStorage.wl_slot=slot;localStorage.wl_code=code;inGame=true;seen=(S.chat||[]).length;lastRoll=S.roll?S.roll.id:0;render()}

// ---------- 렌더 ----------
function sheetHtml(k){const p=S.players[k];if(!p)return`<div class="box">⏳ ${k==='a'?'1P':'2P'} 대기 중… (방 코드: <b>${esc(code)}</b>)</div>`;
 const hp=p.hp/p.maxHp*100,mine=k===me;
 return`<div class="box" style="border:2px solid ${mine?'#16a085':'#eee'}"><b>${p.emoji} ${esc(p.name)}${mine?' (나)':''}</b> ${p.traits.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
 <div style="font-size:.8rem;margin-top:6px">기력 ${p.hp}/${p.maxHp}</div><div class="bar"><i style="width:${hp}%;background:${hp>50?'#2ecc71':hp>20?'#f39c12':'#e74c3c'}"></i></div>
 <div style="font-size:.8rem">스트레스 ${p.stress}%</div><div class="bar"><i style="width:${p.stress}%;background:#8e44ad"></i></div>
 <div class="g g4" style="margin-top:8px">${Object.entries(STATS).map(([s,[i,n]])=>`<div>${i}${n}<br><b>${p.stats[s]}</b>${mine&&p.pts?`<br><button style="padding:0 6px" onclick="WL.spend('${s}')">+</button>`:''}</div>`).join('')}</div>${mine&&p.pts?`<small>성장 포인트 ${p.pts}</small>`:''}${p.profile?`<details><summary>프로필</summary><small>${esc(p.profile).replace(/\n/g,'<br>')}</small></details>`:''}</div>`}
function render(){if(!S||!inGame)return;const ci=$('chat'),cv=ci?ci.value:'',cf=document.activeElement===ci;
 if(S.roll&&S.roll.id!==lastRoll){lastRoll=S.roll.id;if(S.roll.slot!==me)playDice(S.roll)}
 let L='';
 if(S.over){const e=D.endings.find(x=>x.id===S.over);L=`<div class="box"><h2>🏁 ${tpl(e.name,"a")}</h2><p>${esc(tpl(e.text,'a'))}</p></div>`}
 else if(S.pending&&S.pending.joint){const pd=S.pending,sc=scn(pd.sid),sn=sc.scenes[pd.scene],voted=pd.votes[me]!==undefined;
  if(pd.stage==='roll'){const c=pd.check;L=`<div class="box scene"><span class="tag on">🎲 협동 판정</span><h3>${sc.title}</h3><p>${STATS[c.stat][1]} 판정 (난이도 ${c.dc}) — 각자 굴려 높은 결과를 채택한다.</p>${pd.rolls[me]?'<p>⏳ 상대를 기다리는 중…</p>':`<button class="p choice" onclick="WL.rollJoint()">🎲 d20 굴리기</button>`}</div>`}else
  L=`<div class="box scene"><span class="tag on">${sc.free?'🎭 둘만의 장면':'🌙 저녁 사건 (공동 선택)'}</span><h3>${sc.title}</h3><p>${esc(tpl(sn.text,me))}</p>${sc.free?'<small>💬 <b>진행·역극 탭</b>에서 자유롭게 역극하세요. 끝나면 장면의 마무리 분위기를 고릅니다. (같은 분위기면 그 결과, 다르면 어긋난 결과)</small>':''}`+(voted?`<p>⏳ 상대의 선택을 기다리는 중…</p>`:sn.choices.map((c,i)=>`<button class="choice" ${meets(S,me,c.req)?'':'disabled'} onclick="WL.vote(${i})">${esc(tpl(c.t,me))}</button>`).join(''))+`</div>`}
 else if(S.pending){const pd=S.pending,sc=scn(pd.sid),scene=sc.scenes[pd.scene],mine=pd.actor===me,c=pd.check!==null?scene.choices[pd.check]:null;
  L=`<div class="box scene"><span class="tag on">🎲 GM의 시련</span><h3>${sc.title}</h3><p>${esc(tpl(scene.text,pd.actor))}</p>`+
  (c?(mine?`<button class="p choice" onclick="WL.roll()">🎲 ${STATS[c.check.stat][1]} 판정 — d20 굴리기 (난이도 ${c.check.dc})</button>`:`<p>🎲 ${esc(S.players[pd.actor].name)}이(가) 주사위를 굴리는 중…</p>`):
  mine?scene.choices.map((c,i)=>`<button class="choice" ${meets(S,me,c.req)?'':'disabled'} onclick="WL.choose(${i})">${esc(tpl(c.t,me))}${c.check?` <small>[${STATS[c.check.stat][1]} 판정 ${c.check.dc}]</small>`:''}</button>`).join(''):`<p>⏳ ${esc(S.players[pd.actor].name)}이(가) 고민 중…</p>`)+`</div>`}
 else{const my=S.players[me];
  L=`<div class="box"><b>📌 ${S.day||1}일차 · ${S.weather||'맑음'}</b><div style="font-size:.85rem;margin-top:4px">${['a','b'].map(k=>S.players[k]?`${(S.acted||{})[k]?'☑':'☐'} ${esc(S.players[k].name)}의 오늘 행동`:'').join('<br>')}<br>☐ 저녁 — 함께 하루를 마무리한다</div></div>${sheetHtml('a')}${sheetHtml('b')}<div class="box"><b>🏠 저택</b>${D.rooms.map(r=>{const ok=!r.unlock||S.flags[r.unlock],v=(S.rooms||{})[r.id]||0;return`<div style="font-size:.85rem">${ok?(v>=r.need?'✅':'🔧'):'🔒'} ${r.name}${ok?' '+v+'/'+r.need:''}</div>`}).join('')}</div><div class="box"><b>🤝 관계</b><div style='font-size:.85rem'>🐾 ${esc(S.pet.name)} (${petDesc()}) 유대 <b>${S.pet.bond}</b>${Object.entries(D.npcs).map(([k,n])=>`<br>${n.name}(${n.role}) <b>${(S.npc||{})[k]||0}</b>`).join('')}</div></div><div class="box"><b>행동</b> ${(S.acted||{})[me]?'<small>오늘은 이미 행동했다. 상대를 기다리는 중…</small>':''}<div class="g g2" style="margin-top:6px">${D.activities.map(a=>`<button ${(S.acted||{})[me]?'disabled':''} title="${esc(D.locations[a.loc].desc)}" onclick="WL.act('${a.id}')">${a.icon} ${a.name}<br><small>${D.locations[a.loc].name}</small></button>`).join('')}</div></div>
  <div class="box"><b>🌱 텃밭</b><div class="g g4" style="margin-top:6px">${S.farm.map((f,i)=>!f?`<button onclick="WL.shop(${i})">빈 밭</button>`:f.remain>0?`<div>${f.crop}<br>${f.remain}턴</div>`:`<button class="p" onclick="WL.harvest(${i})">수확 ${f.crop}</button>`).join('')}</div></div>
  <div class="box"><b>🎒 가방</b>${Object.entries(S.items).map(([k,n])=>`<div style="display:flex;justify-content:space-between;margin-top:5px"><span>${k} x${n}</span><span><button onclick="WL.sell('${k}')">팔기</button> <button class="p" onclick="WL.eat('${k}')">먹기</button> <button onclick="WL.giftMenu('${k}')">🎁</button></span></div>`).join('')||'<small>비어 있음</small>'}</div>`}
 $('app').innerHTML=`<div class="top"><div><b>WATERLINE</b> · 방 ${esc(code)}<br><small>챕터 ${S.ch} (${D.chapters[S.ch-1].age}) · ${SEASONS[sIdx(S)]} · ${S.day||1}일차 · 유대 ${relLabel(S.rel)}(${S.rel}) · 🐾 ${esc(S.pet.name)}</small></div>
 <div><b>${S.money}G</b> <button onclick="WL.slots()">💾</button> ${!S.over&&!S.pending?`<button onclick="WL.advance()">⏳ 시간 도약</button>`:''}</div></div>
 <div class="main"><div class="left">${L}</div><div class="right">${rightPanel()}</div></div>`;
 const n=$('chat');n.value=cv;if(cf)n.focus();const lg=$('log');lg.scrollTop=lg.scrollHeight}
function home(){$('app').innerHTML=`<div class="setup"><div class="box"><h1>WATERLINE</h1><p>물에 잠긴 저택의 2인 협동 TRPG 샌드박스</p><input id="code" placeholder="방 코드" value="${esc(code)}">
 <div class="g g2" style="margin-top:10px"><button class="p" onclick="WL.enter('a')">1P (방 만들기/재접속)</button><button onclick="WL.enter('b')">2P (참가/재접속)</button></div></div></div>`}
setInterval(async()=>{if(!inGame||busy)return;try{const r=await api('GET');if(r.s===200&&!r.j.same&&!$('dice').style.display.includes('flex')){S=r.j;render()}}catch(e){}},1500);
async function slots(){const list=await (await fetch('/api/room/'+encodeURIComponent(code)+'/slots')).json();const b=document.createElement('div');b.id='shop';b.style.cssText='position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:40';
 b.innerHTML=`<div class="box" style="max-width:380px;width:100%"><h3>💾 세이브 슬롯</h3>${[1,2,3].map(n=>{const m=list[n];return`<div class="box" style="display:flex;justify-content:space-between;align-items:center"><span>SLOT ${n}<br><small>${m?m.day+'일차 · 챕터 '+m.ch:'비어 있음'}</small></span><span><button onclick="WL.saveSlot(${n})">저장</button> <button ${m?'':'disabled'} onclick="WL.loadSlot(${n})">불러오기</button></span></div>`}).join('')}<button style="width:100%" onclick="WL.closeShop()">닫기</button></div>`;document.body.appendChild(b)}
async function saveSlot(n){await fetch(`/api/room/${encodeURIComponent(code)}/slot/${n}`,{method:'POST'});closeShop();slots()}
async function loadSlot(n){if(!confirm('현재 진행이 덮어써집니다. 계속할까요?'))return;await fetch(`/api/room/${encodeURIComponent(code)}/load/${n}`,{method:'POST'});closeShop()}
function giftMenu(k){closeShop();const b=document.createElement('div');b.id='shop';b.style.cssText='position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:40';
 const po=S.players[other(me)],tg=[po?['p','💞 '+po.name]:null,['pet','🐾 '+S.pet.name],...Object.entries(D.npcs).map(([id,n])=>[id,n.name+' ('+n.role+')'])].filter(Boolean);
 b.innerHTML=`<div class="box" style="max-width:380px;width:100%"><h3>🎁 ${k}을(를) 누구에게?</h3><small>하루 한 번. 좋아하는 물건이면 효과가 두 배.</small>${tg.map(([t,n])=>`<button style="width:100%;margin-top:6px" onclick="WL.gift('${k}','${t}')">${esc(n)}</button>`).join('')}<button style="width:100%;margin-top:10px" onclick="WL.closeShop()">닫기</button></div>`;document.body.appendChild(b)}
function gift(k,t){closeShop();mutate(s=>{if(!s.items[k])return null;s.gifts=s.gifts||{};if(s.gifts[me]===s.day){alert('선물은 하루에 한 번만 줄 수 있습니다.');return null}
 const it=D.items[k],pn=s.players[me].name;let g=Math.max(2,Math.round((it.sell||10)/10)),to,like=false;
 if(t==='p'){to=(s.players[other(me)]||{name:'상대'}).name;s.rel=clamp(s.rel+g)}
 else if(t==='pet'){to=s.pet.name;if(/송어|게|장어|수프/.test(k)){g*=2;like=true}s.pet.bond=clamp(s.pet.bond+g)}
 else{const n=D.npcs[t];to=n.name;if((n.likes||[]).includes(k)){g*=2;like=true}s.npc[t]=clamp((s.npc[t]||0)+g,-50,100)}
 addItem(s,k,-1);s.gifts[me]=s.day;log(s,'gm',`🎁 ${pn}이(가) ${to}에게 ${k}을(를) 선물했다. ${like?'매우 기뻐한다! ':''}(호감 +${g})`,'dice');return s})}
window.WL={giftMenu,gift,tab:setTab,spk:setSpk,rollJoint,slots,saveSlot,loadSlot,vote,T:null,enter,adj,tr,submitSheet,act:doActivity,choose,roll:rollDice,plant,harvest,shop:openShop,closeShop,eat,sell,spend,advance,send};
Object.defineProperty(WL,'T',{get:()=>T,set:v=>T=v});
home();
})();

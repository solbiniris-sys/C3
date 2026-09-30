let ws,S,me,ROOM,PW,I,dead=0,loc0=null,MK='say';
const $=i=>document.getElementById(i),send=o=>ws&&ws.readyState===1&&ws.send(JSON.stringify(o));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=(k,v)=>{try{return v==null?localStorage.getItem(k):localStorage.setItem(k,v)}catch{}};
$('room').value=st('room')||'';
function join(role){ROOM=$('room').value.trim();if(!ROOM)return;PW=$('pw').value;me=role;st('room',ROOM);connect()}
function connect(){ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host);
 ws.onopen=()=>send({type:'join',room:ROOM,role:me,pw:PW,cfg:{title:$('c-title').value,A:$('c-A').value,B:$('c-B').value,D:$('c-D').value}});
 ws.onmessage=e=>{const m=JSON.parse(e.data);
  if(m.type==='init'){I=m.d;$('login').hidden=true;$('game').hidden=false}
  else if(m.type==='deny'){dead=1;alert(m.t);location.reload()}
  else if(m.type==='kick'){dead=1;alert('다른 곳에서 같은 캐릭터로 접속했어요.')}
  else if(m.type==='roll'){dice(m)}
  else if(m.type==='state'){S=m.s;draw()}};
 ws.onclose=()=>{if(!dead)setTimeout(connect,2000)}}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{$('game').dataset.v=b.dataset.v;document.querySelectorAll('#nav button').forEach(x=>x.classList.toggle('on',x===b));$('log').scrollTop=1e9});
document.querySelectorAll('#modes button').forEach(b=>b.onclick=()=>{MK=b.dataset.k;document.querySelectorAll('#modes button').forEach(x=>x.classList.toggle('on',x===b));$('t').placeholder={say:'말한다',act:'행동이나 분위기를 적는다',mind:'속마음 (상대에게도 보여요)'}[MK]});
function say(){const t=$('t').value.trim();if(t){send({type:'chat',k:MK,t});$('t').value=''}}
$('t').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();say()}};
const N=k=>S.cfg[k],rc=h=>/대성공\)$/.test(h)?'v3':/대실패\)$/.test(h)?'v0':/ 성공\)$/.test(h)?'v2':/ 실패\)$/.test(h)?'v1':'';
function draw(){const c=S.cfg,p=S.p[me];document.title=c.title;$('ti').textContent=c.title;
 $('game').dataset.slot=S.per;$('game').dataset.tide=S.tide;$('when').textContent=`${I.chap[S.ch].n} · ${I.chap[S.ch].age} (${Math.min(S.cd,S.len)}/${S.len}일) · ${I.seasons[S.season].split(' - ')[0]} ${S.day}일 · ${I.slots[S.per]} · ${S.tide} · ${S.wx||'맑음'}`;
 $('hud').innerHTML=`<span class="coin">🪙 ${p.coin}</span><span>🪨 ${p.mat}</span><span class="en">${Array.from({length:12},(_,i)=>`<i class="${i<p.en?'f':''}"></i>`).join('')}</span>`;
 const L=$('log'),bot=L.scrollTop+L.clientHeight>=L.scrollHeight-80;
 L.innerHTML=S.log.map(l=>{const t=esc(l.t),[h,...r]=t.split('\n'),w=l.who?N(l.who):'';
  if(l.k==='say')return`<div class="say ${l.who}"><b>${w}</b><p>${t}</p></div>`;
  if(l.k==='act')return`<div class="act">${w}: ${t}</div>`;
  if(l.k==='mind')return`<div class="mind"><b>${w}의 속마음</b>${t}</div>`;
  if(l.k==='roll')return`<div class="roll ${rc(h)}"><small>${h}</small>${r.join('\n')}</div>`;
  if(l.k==='ev')return`<div class="evlog"><b>${h}</b>${r.join('\n')}</div>`;
  if(l.k==='day')return`<div class="dayl">${t}</div>`;
  if(l.k==='duo')return`<div class="duo">${t}</div>`;
  return`<div class="${l.k}">${t}</div>`}).join('');if(bot)L.scrollTop=1e9;
 const e=S.evd;$('evbox').innerHTML=e?`<div class="ev"><h4>${esc(e.title)}</h4>`+(e.c.map((o,i)=>`<button onclick="send({type:'pick',i:${i}})">${esc(o[0])}<em>${o[1]} · 난이도 ${o[2]}</em></button>`).join(''))+'</div>':'';
 chatUI();setupUI();dayUI();houseUI();townUI();recUI()}
function dayUI(){const p=S.p[me],ev=!!S.evd,w=S.pick[me],chip=k=>`<span class="chip ${k}">${N(k)} ${!S.on[k]?'자리 비움':S.pick[k]?'선택 완료':'고민 중'}</span>`;
 let h=`<div class="chips">${chip('A')}${chip('B')}</div>`;
 if(ev)h+='<p class="wait">사건이 진행 중이에요. 마무리된 뒤에 움직일 수 있어요.</p>';
 else if(w){const a=I.loc[w[0]].a.find(a=>a.i===w[1]);h+=`<p class="wait">${I.loc[w[0]].n} - ${esc(a.n.replace('{D}',N('D')))}<br>상대를 기다리는 중이에요. 같은 곳이면 둘이 마주쳐요.</p><button onclick="send({type:'cancel'})">다시 고르기</button>`}
 else if(!loc0||(I.loc[loc0].ch&&!I.loc[loc0].ch.includes(S.ch))){loc0=null;const tile=([k,v])=>`<button class="tile" onclick="loc0='${k}';dayUI()"><span>${v.e}</span><b>${v.n}</b><small>${v.d}</small></button>`,E=Object.entries(I.loc).filter(([k,v])=>!v.ch||v.ch.includes(S.ch));
  h+=`<div class="zone up"><h3>물 위</h3><div class="tiles">${E.filter(x=>!x[1].u).map(tile).join('')}</div></div><div class="waterline"></div><div class="zone down"><h3>물 아래</h3><div class="tiles">${E.filter(x=>x[1].u).map(tile).join('')}</div></div>`}
 else{const v=I.loc[loc0];h+=`<button class="back" onclick="loc0=null;dayUI()">‹ 다른 곳으로</button><div class="banner" style="background:linear-gradient(${LG[loc0]||'#c98a7c,#6b4a5a'})"><span>${v.e}</span><span>${v.e}</span><span>${v.e}</span><div><h2>${v.n}</h2><small>${v.d}</small></div></div>`+v.a.filter(a=>!a.g||p.st[a.g[0]]>=a.g[1]).map(a=>{const r=a.s==='rest',mod=r?0:p.st[a.s]+p.boost,dc=a.dc-(S.tide==='간조'&&['canal','deep','lib'].includes(loc0)?1:0),pr=r?0:Math.min(95,Math.max(5,(21-(dc-mod))*5)),closed=a.sl&&!a.sl.includes(S.per),lock=a.g&&p.st[a.g[0]]<a.g[1],bad=closed||lock||!p.ready||(!r&&p.en<a.e)||(a.c<0&&p.coin<-a.c);
   return`<button class="ac" ${bad?'disabled':''} onclick="send({type:'go',l:'${loc0}',i:${a.i}})"><b>${esc(a.n.replaceAll('{D}',N('D')))}${a.g?`<u>✦ ${a.g[0]} 특기</u>`:''}${closed?`<u>${a.sl.map(x=>I.slots[x]).join('·')}에만</u>`:''}</b>${r?`<span>에너지 +${a.e}</span>`:`<span>${a.s} +${mod}</span><span>난이도 ${dc}</span><span>에너지 -${a.e}</span><em>성공 ${pr}%</em>`}${a.c?`<span>${a.c>0?'+':''}${a.c}🪙</span>`:''}${a.m?`<span>+${a.m}🪨</span>`:''}</button>`}).join('')}
 $('day').innerHTML=h}
function houseUI(){const p=S.p[me];$('house').innerHTML=`<div class="dad"><span class="big">🐋</span><div><b>${esc(N('D'))}</b><div class="bar"><i style="width:${S.dad}%"></i></div><small>애정 ${S.dad}/100 · 저택 온기 ${S.comfort}</small></div><button onclick="send({type:'feed'})" ${p.coin<15?'disabled':''}>간식 15🪙</button></div>
 <h3>저택 손보기 <small class="dim">온기 4마다 하루 에너지 +1</small></h3>`+I.rooms.map((r,i)=>{const lv=S.room[i];return`<div class="rm"><b>${r}</b><span class="lv">${'●'.repeat(lv)}${'○'.repeat(3-lv)}</span>${lv<3?`<button onclick="send({type:'up',i:${i}})" ${p.coin<30*(lv+1)||p.mat<2*(lv+1)?'disabled':''}>${30*(lv+1)}🪙 ${2*(lv+1)}🪨</button>`:'<em>완성</em>'}</div>`}).join('')+
 `${S.cd>S.len?`<button class="go wide" onclick="send({type:'vote'})">${S.votes.includes(me)?'동의 취소':'다음 장으로 넘어가기'} (${S.votes.length}/2)</button>`:`<p class="dim">다음 장까지 ${S.len-S.cd+1}일 · 굵직한 사건 ${S.mj}/20</p>`}<h3>마음</h3><div class="dad"><span class="big">🫶</span><div><b>${N('A')} · ${N('B')}</b><div class="bar"><i style="width:${S.bond}%"></i></div><small>유대 ${S.bond}/100 · ${BS[BS.map((x,i)=>S.bond>=i*20).lastIndexOf(true)]}</small></div><button onclick="send({type:'gift'})" ${p.coin<25?'disabled':''}>선물 25🪙</button></div>`}
function recUI(){if($('rec').contains(document.activeElement)&&document.activeElement.tagName==='INPUT')return;$('rec').innerHTML=['A','B'].map(k=>`<div class="pc ${k}"><b>${esc(N(k))}</b><small class="dim">${esc(S.p[k].bio||'')}</small><p>${title(k)} ${tendency(k)}</p>${I.S.map(s=>`<div class="st"><span>${s}</span><i><b style="width:${S.p[k].st[s]/15*100}%"></b></i><em>${S.p[k].st[s]}</em></div>`).join('')}</div>`).join('')+
 `<h3>수집 도감 ${S.col.length}/${S.colN}</h3><div class="al">${S.col.map(esc).join(' · ')||'<span class="dim">행동하다 보면 물건을 발견해요.</span>'}</div><h3>추억 앨범</h3>`+(S.album.map(x=>`<div class="al">${I.seasons[x.s].split(' - ')[0]} ${x.d}일 · ${esc(x.t)}</div>`).join('')||'<p class="dim">사건을 겪으면 여기에 쌓여요.</p>')+
 `<h3>이름 바꾸기</h3><div class="cfg">${[['title','제목'],['A','A'],['B','B'],['D','커다란 가족']].map(([k,l])=>`<label>${l}<input id="s-${k}" value="${esc(S.cfg[k])}" maxlength="12"></label>`).join('')}<button onclick="send({type:'cfg',cfg:{title:s('title'),A:s('A'),B:s('B'),D:s('D')}})">저장</button></div>
 <h3>보관</h3><button onclick="location.href='/export/'+encodeURIComponent(ROOM)+'?pw='+encodeURIComponent(PW)">이야기 저장 (txt)</button>`}
const s=k=>$('s-'+k).value;

function townUI(){$('town2').innerHTML='<h3>이웃들</h3>'+I.npcs.map((n,i)=>`<div class="rm"><b>${n[0]}<small class="dim"> ${n[1]}</small></b><span class="lv">${'♥'.repeat(S.npc[i])}${'♡'.repeat(10-S.npc[i])}</span><button onclick="send({type:'ngift',i:${i}})" ${S.p[me].coin<20||(S.gd||{})[i]===S.t?'disabled':''}>선물 20🪙</button></div>`).join('')+'<p class="dim">장소에서 이야기를 나누면 가까워져요.</p>'}
function title(k){const t=Object.entries(S.p[k].tn).sort((a,b)=>b[1]-a[1]);return t.length&&t[0][1]>=8?`「${t[0][0]}${t[0][1]>=25?' 그 자체':' 쪽으로 자란'} 아이」`:''}
function tendency(k){const t=Object.entries(S.p[k].tn).sort((a,b)=>b[1]-a[1]);return t.length?`지금까지는 <b>${t[0][0]}</b>한 모습이에요`+(t[1]?` (${t[1][0]} 기질도 보여요)`:''):'아직 어떤 아이인지 정해지지 않았어요'}
let SD=null;function setupUI(){const el=$('setup'),q=S.p[me];if(q.ready&&q.pts>0)return allocUI(q);if(q.ready){el.hidden=true;SD=null;return}if(el.contains(document.activeElement)&&document.activeElement.tagName==='TEXTAREA')return;
 if(!SD)SD={...q.st};const left=30-I.S.reduce((a,s)=>a+SD[s],0);el.hidden=false;
 el.innerHTML=`<div class="card"><h2>${esc(N(me))}의 시작</h2><p class="dim">성격은 정해져 있지 않아요. 30점을 나누고, 어떤 아이인지는 플레이하며 만들어 가요.</p>`+I.S.map(s=>`<div class="sr"><b>${s}</b><button onclick="sd('${s}',-1)" ${SD[s]<=1?'disabled':''}>-</button><em>${SD[s]}</em><button onclick="sd('${s}',1)" ${SD[s]>=9||left<=0?'disabled':''}>+</button></div>`).join('')+`<label>나를 한 줄로 (선택)<textarea id="bio" rows="2" maxlength="120" placeholder="예: 말수는 적지만 눈치가 빠름"></textarea></label><p>남은 점수 ${left}</p><button class="go" ${left?'disabled':''} onclick="send({type:'setup',st:SD,bio:$('bio').value})">이 모습으로 시작</button></div>`}
function sd(s,d){SD[s]+=d;setupUI()}

const LG={home:'#4f8f95,#1f4a5c',canal:'#6fb0c8,#2c7f8a',market:'#7cbfae,#2f6f6f',black:'#2c4a6a,#0b1e30',dock:'#8fc4cc,#3f7f8f',deep:'#2c7f8a,#0a2a38',lib:'#5f8fa0,#1f4256',shallow:'#a8e0d4,#4fa8a8',school:'#a8d0c8,#5f8f8a',work:'#7fa8a0,#35606a',guild:'#8fb8b0,#456a70',manor:'#5f7f9a,#1c2c44',city:'#b8d8e0,#5f8fa8'};
let AD=null;function allocUI(q){const el=$('setup');if(!AD)AD=Object.fromEntries(I.S.map(s=>[s,0]));const used=I.S.reduce((x,s)=>x+AD[s],0),left=q.pts-used;el.hidden=false;
 el.innerHTML=`<div class="card"><h2>${esc(N(me))} · ${I.chap[S.ch].age}</h2><p class="dim">새 시기가 시작됐어요. 추가 능력치 ${q.pts}점을 나눠 주세요. 능력치가 높을수록 새로운 행동이 열려요.</p>`+I.S.map(s=>`<div class="sr"><b>${s} <small class="dim">${q.st[s]}</small></b><button onclick="ad('${s}',-1)" ${AD[s]<=0?'disabled':''}>-</button><em>+${AD[s]}</em><button onclick="ad('${s}',1)" ${left<=0||q.st[s]+AD[s]>=15?'disabled':''}>+</button></div>`).join('')+`<p>남은 점수 ${left}</p><button class="go" onclick="send({type:'alloc',st:AD});AD=null">확정</button></div>`}
function ad(s,d){AD[s]+=d;allocUI(S.p[me])}
let DQ=[],DB=0;function dice(m){DQ.push(m);if(!DB)dnext()}
function dnext(){const m=DQ.shift(),el=$('dice');if(!m){el.hidden=true;DB=0;return}DB=1;el.hidden=false;el.className='';const c=$('cube');$('dinfo').textContent=`${N(m.w)} · ${m.t} (${m.s})`;$('dres').textContent='';let n=0;const iv=setInterval(()=>c.textContent=1+Math.floor(Math.random()*20),60);
 setTimeout(()=>{clearInterval(iv);c.textContent=m.d;el.className='r'+({대성공:3,성공:2,실패:1,대실패:0})[m.res];$('dres').textContent=`${m.res}  (d20 ${m.d}${m.mod?' + '+m.mod:''})`},900);setTimeout(dnext,2600)}

const BS=['서먹한 사이','함께 자란 사이','서로의 그림자','없어선 안 될 사람','가장 오랜 가족'];

let seenCC=0;function csay(){const t=$('ct').value.trim();if(t){send({type:'ooc',t});$('ct').value=''}}
$('ct').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();csay()}};
function chatUI(){const C=$('clog'),bot=C.scrollTop+C.clientHeight>=C.scrollHeight-60,on=$('game').dataset.v==='chat';C.innerHTML=S.chat.map(c=>`<div class="cb ${c.who===me?'me':''} ${c.dice?'dc':''}"><small>${esc(N(c.who))}</small><p>${esc(c.t)}</p></div>`).join('');if(bot||on)C.scrollTop=1e9;if(on)seenCC=S.cc;const n=S.cc-seenCC;$('bd').hidden=on||n<=0;$('bd').textContent=n}
document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>{if(S&&b.dataset.v==='chat'){seenCC=S.cc;chatUI()}}));

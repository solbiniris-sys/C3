const express=require('express'),http=require('http'),{WebSocketServer}=require('ws'),fs=require('fs'),cr=require('crypto');
const D=require('./data'),E=require('./events'),app=express();app.use(express.static(__dirname+'/public'));app.get('/health',(q,s)=>s.send('ok'));
const srv=http.createServer(app),wss=new WebSocketServer({server:srv});
const F=(process.env.DATA_DIR||__dirname)+'/save.json';let R={},tm;   // Railway: Volume을 /data에 붙이고 DATA_DIR=/data
try{R=JSON.parse(fs.readFileSync(F))}catch{}
const save=()=>{clearTimeout(tm);tm=setTimeout(()=>fs.writeFile(F,JSON.stringify(R),()=>{}),400)};
process.on('SIGTERM',()=>{try{fs.writeFileSync(F,JSON.stringify(R))}catch{}process.exit(0)});
const H=x=>cr.createHash('sha256').update('tt:'+x).digest('hex');
const rand=n=>1+Math.floor(Math.random()*n),pk=a=>a[rand(a.length)-1],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const nm=s=>String(s||'').trim().slice(0,12),NS=D.slots.length;
const P=()=>({st:Object.fromEntries(D.S.map(s=>[s,5])),xp:{},tn:{},en:10,coin:30,mat:0,boost:0,ready:0,bio:'',pts:0});
const mk=c=>({cfg:{title:nm(c.title)||'A와 B',A:nm(c.A)||'A',B:nm(c.B)||'B',D:nm(c.D)||'아빠'},ch:0,cd:1,mj:0,votes:[],nv:[],t:1,day:1,per:0,season:0,wx:'맑음',col:[],gd:{},tide:'만조',bond:10,dad:10,room:[0,0,0,0,0],npc:[0,0,0,0,0],crop:[0,0,0,0,0],log:[],pick:{},ev:null,seen:[],album:[],p:{A:P(),B:P()}});
const socks=c=>[...wss.clients].filter(w=>w.room===c&&w.readyState===1),online=c=>['A','B'].filter(k=>socks(c).some(w=>w.role===k));
const fill=(r,t,p)=>String(t).replaceAll('{A}',r.cfg.A).replaceAll('{B}',r.cfg.B).replaceAll('{D}',r.cfg.D).replaceAll('{P}',p?r.cfg[p]:'');
const add=(r,k,t,who)=>{r.log.push({k,who,t:fill(r,t,who)});if(r.log.length>500)r.log.shift()};
const comfort=r=>r.room.reduce((a,b)=>a+b,0),evOf=r=>E.get(String(r.ev),r.ch),okLoc=(r,l)=>!D.loc[l].ch||D.loc[l].ch.includes(r.ch),gate=(p,a)=>!a.g||p.st[a.g[0]]>=a.g[1];
const push=c=>{const r=R[c];save();const on={};online(c).forEach(k=>on[k]=1);const e=r.ev==null?null:evOf(r);
 socks(c).forEach(w=>w.send(JSON.stringify({type:'state',s:{...r,pw:0,seen:0,log:r.log.slice(-150),chat:(r.chat||[]).slice(-150),cc:r.cc||0,pick:{A:!!r.pick.A,B:!!r.pick.B},on,comfort:comfort(r),colN:D.COLN,len:D.chap[r.ch].len,evd:e&&{title:fill(r,e[0]),t:fill(r,e[1]),c:e[2].map(o=>[fill(r,o[0]),o[1],o[2]])}}})))};
const grow=(r,k,s,n)=>{const p=r.p[k],old={...p.st};p.xp[s]=(p.xp[s]||0)+n;if(p.xp[s]>=5&&p.st[s]<15){p.xp[s]=0;p.st[s]++;add(r,'sys',`{P}의 ${s}이(가) ${p.st[s]}(으)로 자랐다.`,k);unlock(r,k,old)}};
const ST=[[0,'서먹한 사이'],[20,'함께 자란 사이'],[40,'서로의 그림자'],[60,'없어선 안 될 사람'],[80,'가장 오랜 가족']],sg=b=>ST.filter(x=>b>=x[0]).length-1;
const bondd=(r,d)=>{const o=sg(r.bond);r.bond=cl(r.bond+d,0,100);if(sg(r.bond)>o)add(r,'sys',`[유대] 두 사람은 이제 '${ST[sg(r.bond)][1]}'.`)},
 unlock=(r,k,old)=>{const p=r.p[k];for(const l in D.loc)if(!D.loc[l].ch||D.loc[l].ch.includes(r.ch))for(const a of D.loc[l].a)if(a.g&&p.st[a.g[0]]>=a.g[1]&&old[a.g[0]]<a.g[1])add(r,'sys',`✦ {P}에게 새로운 할 일이 생겼다: ${D.loc[l].n} - ${fill(r,a.n)}`,k)},tn=(p,t,n)=>{if(t)p.tn[t]=(p.tn[t]||0)+(n||1)};
const rl=(c,k,s,x,t)=>socks(c).forEach(w=>w.send(JSON.stringify({type:'roll',w:k,s,d:x.d,mod:x.mod,res:x.res,t}))),roll=(r,k,s,dc)=>{const p=r.p[k],d=rand(20),mod=p.st[s]+p.boost,ok=d===20||(d>1&&d+mod>=dc);p.boost=0;return{d,mod,ok,res:d===20?'대성공':d===1?'대실패':ok?'성공':'실패'}};
function resolve(c){const r=R[c],on=online(c);if(r.ev!=null||!on.length||on.some(k=>!r.pick[k]))return;
 add(r,'day',`${D.seasons[r.season].split(' - ')[0]} ${r.day}일 - ${D.slots[r.per]} (${r.tide})`);
 for(const k of on){const[l,i]=r.pick[k],a=D.loc[l].a[i],p=r.p[k],name=fill(r,a.n);if(!okLoc(r,l)||!gate(p,a))continue;
  if(a.s==='rest'){p.en=Math.min(12,p.en+a.e);p.coin=Math.max(0,p.coin+a.c);tn(p,a.tn);add(r,'roll',`${D.loc[l].n} / {P} - ${name}\n${fill(r,a.ok,k)}`,k);continue}
  const dc=a.dc+(r.wx==='비'&&['canal','market','dock','shallow'].includes(l)?1:0)-(r.tide==='간조'&&['canal','deep','lib'].includes(l)?1:0)+(r.per===0&&l==='deep'?1:0),x=roll(r,k,a.s,dc);p.en-=a.e;grow(r,k,a.s,x.ok?2:1);
  if(x.ok){p.coin+=a.c;p.earn=(p.earn||0)+Math.max(0,a.c);p.mat+=a.m;const cp=(D.col[l]||[]).filter(n=>!r.col.includes(n));if(cp.length&&Math.random()<.22){const n=pk(cp);r.col.push(n);p.coin+=15;add(r,'sys',`✦ 수집품 발견! 「${n}」 (도감 ${r.col.length}/${D.COLN})`)}tn(p,a.tn);if(a.dad)r.dad=cl(r.dad+a.dad,0,100)}
  rl(c,k,a.s,x,D.loc[l].n+' - '+name);add(r,'roll',`${D.loc[l].n} / {P} - ${name} (${a.s} d20=${x.d}+${x.mod} 난이도 ${dc} ${x.res})\n${fill(r,x.ok?a.ok:a.no,k)}`,k);
  if(a.npc!=null&&x.ok){const n=D.npcs[a.npc];r.npc[a.npc]=cl(r.npc[a.npc]+1,0,10);add(r,'npc',`${n[0]}: ${n[2][Math.min(2,Math.floor(r.npc[a.npc]/4))]}`)}}
 if(Math.random()<.5)add(r,'gm',pk(E.SL[r.per]));
 if(on.length===2&&r.pick.A[0]===r.pick.B[0]){bondd(r,2);add(r,'duo',pk(D.duo))}else add(r,'gm',pk(D.chap[r.ch].amb.concat(D.amb)));
 r.pick={};
 if(++r.per>=NS){r.per=0;r.day++;r.cd++;r.t++;r.tide=pk(['만조','간조']);r.wx=pk(['맑음','맑음','흐림','비','안개']);const b=Math.floor(comfort(r)/3);for(const k in r.p)r.p[k].en=D.chap[r.ch].en+b;
  if(r.day>7){add(r,'sys',`[계절 결산] ${r.cfg.A}: 번 돈 ${r.p.A.earn||0}원 · ${r.cfg.B}: 번 돈 ${r.p.B.earn||0}원 · 도감 ${r.col.length}/${D.COLN} · 저택 온기 ${comfort(r)}`);r.p.A.earn=0;r.p.B.earn=0;r.day=1;r.season=(r.season+1)%4;add(r,'sys','계절이 바뀐다. '+D.seasons[r.season])}
  add(r,'sys',`새 하루가 밝았다. 오늘은 ${r.tide}, 날씨는 ${r.wx}${r.wx==='비'?' (야외 난이도 +1)':''}. ${b?'집이 포근해 에너지가 +'+b+' 늘었다.':''}`);if(r.day===7&&r.cd<D.chap[r.ch].len)r.ev='fest';if(r.mj<E.MAJOR&&r.cd>=(r.mj+1)*3&&r.ev==null){r.ev='m'+r.mj++}if(r.cd===D.chap[r.ch].len+1)add(r,'sys','이 장의 시간이 흘렀다. 두 사람이 동의하면 다음 장으로 넘어간다. (저택 탭)')}
 for(let i=0;i<5&&r.ev==null;i++)for(const k of[4,8])if(r.npc[i]>=k/2&&!r.nv.includes(i+'_'+(k/4-1))){r.nv.push(i+'_'+(k/4-1));r.ev='n'+i+'_'+(k/4-1)}
 if(r.ev==null&&Math.random()<.35){let q=[...Array(E.MINOR).keys()].map(i=>'g'+i).concat(D.ev.map((e,i)=>'c'+i)).filter(i=>!r.seen.includes(i));if(!q.length){r.seen=[];q=['g0']}r.ev=pk(q);r.seen.push(r.ev)}
 if(r.ev!=null)add(r,'ev','[사건] '+fill(r,evOf(r)[0])+'\n'+fill(r,evOf(r)[1]));
 push(c)}
wss.on('connection',ws=>{ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return}
 if(m.type==='join'){const c=String(m.room||'').slice(0,20);if(!c||!['A','B'].includes(m.role))return;const pw=String(m.pw||'');
  if(pw.length<4)return ws.send(JSON.stringify({type:'deny',t:'비밀번호는 4자 이상이어야 해요.'}));
  if(R[c]&&R[c].pw!==H(pw))return ws.send(JSON.stringify({type:'deny',t:'세션 코드나 비밀번호가 맞지 않아요.'}));
  if(!R[c]){R[c]=mk(m.cfg||{});R[c].pw=H(pw);add(R[c],'sys','물 위와 물 아래의 경계에 선 오래된 저택. 두 아이와 커다란 {D}이(가) 눈을 떴다.')}
  Object.assign(R[c],{col:R[c].col||[],gd:R[c].gd||{},wx:R[c].wx||'맑음',chat:R[c].chat||[]});socks(c).forEach(w=>{if(w!==ws&&w.role===m.role){w.send(JSON.stringify({type:'kick'}));w.role=null;w.close()}});
  ws.room=c;ws.role=m.role;ws.send(JSON.stringify({type:'init',d:{S:D.S,tn:D.tn,slots:D.slots,seasons:D.seasons,rooms:D.rooms,npcs:D.npcs.map(n=>[n[0],n[1]]),chap:D.chap.map(c=>({n:c.n,age:c.age,len:c.len})),loc:Object.fromEntries(Object.entries(D.loc).map(([k,v])=>[k,{n:v.n,e:v.e,u:v.u,d:v.d,ch:v.ch||null,a:v.a.map((a,i)=>({n:a.n,s:a.s,dc:a.dc,e:a.e,c:a.c,m:a.m,sl:a.sl||null,g:a.g||null,i}))}]))}}));push(c);resolve(c);return}
 const c=ws.room,r=R[c],me=ws.role;if(!r||!me)return;const p=r.p[me];
 if(m.type==='ooc'){const t=String(m.t||'').slice(0,500).trim();if(!t)return;r.chat=r.chat||[];r.cc=(r.cc||0)+1;const d=/^\/(?:r|roll)\s+(\d{1,2})d(\d{1,4})\s*([+-]\d{1,4})?$/i.exec(t);
  if(d){const n=+d[1],f=+d[2],md=+(d[3]||0),v=Array.from({length:n},()=>rand(f));r.chat.push({who:me,t:`🎲 ${n}d${f}${d[3]||''} = [${v.join(', ')}]${md?(md>0?' +':' ')+md:''} → ${v.reduce((a,b)=>a+b,0)+md}`,dice:1})}else r.chat.push({who:me,t});if(r.chat.length>300)r.chat.shift()}
 else if(m.type==='chat'){const t=String(m.t||'').slice(0,600).trim();if(t)add(r,['say','act','mind'].includes(m.k)?m.k:'say',t,me)}
 else if(m.type==='cfg'){for(const k of['title','A','B','D']){const v=nm(m.cfg&&m.cfg[k]);if(v)r.cfg[k]=v}}
 else if(m.type==='setup'){const st={};let sum=0;for(const s of D.S){const v=Math.round(+(m.st||{})[s]);if(!(v>=1&&v<=9))return;st[s]=v;sum+=v}if(sum>30)return;if(!p.ready){p.st=st;unlock(r,me,Object.fromEntries(D.S.map(x=>[x,0])))}p.ready=1;p.bio=String(m.bio||'').slice(0,120);add(r,'sys','{P}의 이야기가 시작되었다.',me)}
 else if(m.type==='bio'){p.bio=String(m.bio||'').slice(0,120)}
 else if(m.type==='go'&&r.ev==null&&p.ready){const a=D.loc[m.l]&&D.loc[m.l].a[m.i];if(!a||!okLoc(r,m.l)||!gate(p,a)||(a.sl&&!a.sl.includes(r.per)))return;
  if(a.s!=='rest'&&p.en<a.e)return;if(a.c<0&&p.coin<-a.c)return;r.pick[me]=[m.l,m.i];push(c);resolve(c);return}
 else if(m.type==='vote'&&r.cd>D.chap[r.ch].len){const i=r.votes.indexOf(me);i<0?r.votes.push(me):r.votes.splice(i,1);if(r.votes.length===2&&r.ch===3){r.votes=[];const t=k=>Object.entries(r.p[k].tn).sort((a,b)=>b[1]-a[1])[0];add(r,'sys',`[에필로그] ${r.cfg.A}은(는) ${t('A')?t('A')[0]+'한':'자기만의'} 어른이, ${r.cfg.B}은(는) ${t('B')?t('B')[0]+'한':'자기만의'} 어른이 되었다. 추억 ${r.album.length}개, 유대는 '${ST[sg(r.bond)][1]}'. 이야기는 계속된다.`);r.cd=1;r.mj=0}else if(r.votes.length===2&&r.ch<3){r.votes=[];add(r,'sys',`[${D.chap[r.ch].n} 끝] 함께한 추억 ${r.album.length}개 / 유대 ${r.bond}`);r.ch++;r.cd=1;r.mj=0;r.day=1;r.per=0;r.pick={};r.ev=null;for(const k in r.p)r.p[k].pts=4;add(r,'sys',D.chap[r.ch].n+' ('+D.chap[r.ch].age+')\n'+D.chap[r.ch].intro+'\n새로운 시기를 맞아 능력치 4점을 나눠 가질 수 있다.')}}
 else if(m.type==='alloc'&&p.pts>0){let sum=0;const q={};for(const k of D.S){const v=Math.round(+(m.st||{})[k]||0);if(v<0)return;q[k]=v;sum+=v}if(sum>p.pts)return;const old={...p.st};for(const k of D.S)p.st[k]=Math.min(15,p.st[k]+q[k]);unlock(r,me,old);p.pts-=sum;if(sum)add(r,'sys','{P}이(가) 새로운 시기를 준비하며 능력치를 다졌다.',me)}
 else if(m.type==='cancel')delete r.pick[me];
 else if(m.type==='pick'&&r.ev!=null){const e=evOf(r),o=e[2][m.i];if(!o)return;const x=roll(r,me,o[1],o[2]);rl(c,me,o[1],x,fill(r,e[0]));if(x.ok&&o[9]&&p.st[o[1]]<15){const old={...p.st};p.st[o[1]]++;unlock(r,me,old);add(r,'sys',`{P}의 ${o[1]}이(가) 이번 일로 ${p.st[o[1]]}(으)로 올랐다.`,me)}
  bondd(r,(x.ok?o[5]:o[6])+(x.d===20?1:0));if(x.ok){p.coin+=o[7];tn(p,o[8])}grow(r,me,o[1],2);r.album.push({s:r.season,d:r.day,t:fill(r,e[0])+' / '+r.cfg[me]+' - '+fill(r,o[0])});
  add(r,'roll',`${fill(r,e[0])} / {P} - ${fill(r,o[0])} (${o[1]} d20=${x.d}+${x.mod} 난이도 ${o[2]} ${x.res})\n${fill(r,x.ok?o[3]:o[4],me)}`,me);r.ev=null;push(c);resolve(c);return}
 else if(m.type==='up'){const i=m.i|0,lv=r.room[i];if(lv==null||lv>=3)return;const cc=30*(lv+1),cm=2*(lv+1);if(p.coin<cc||p.mat<cm)return;p.coin-=cc;p.mat-=cm;r.room[i]++;add(r,'sys',`{P}이(가) ${D.rooms[i]}을(를) 손봤다. (Lv.${r.room[i]})`,me);r.album.push({s:r.season,d:r.day,t:`${D.rooms[i]} Lv.${r.room[i]}`})}
 else if(m.type==='plant'){const i=m.i|0;if(i<2+r.room[3]&&!r.crop[i]&&p.mat>=1){p.mat--;r.crop[i]=r.t+2;add(r,'sys','{P}이(가) 수중 정원에 물꽃 씨앗을 심었다.',me)}}
 else if(m.type==='harvest'){const i=m.i|0;if(r.crop[i]&&r.t>=r.crop[i]){r.crop[i]=0;p.coin+=35;p.mat++;add(r,'sys','{P}이(가) 활짝 핀 물꽃을 거두었다. (+35원, 재료 +1)',me)}}
 else if(m.type==='ngift'){const i=m.i|0;if(i>=0&&i<5&&p.coin>=20&&r.gd[i]!==r.t){p.coin-=20;r.gd[i]=r.t;r.npc[i]=cl(r.npc[i]+1,0,10);add(r,'sys',`{P}이(가) ${D.npcs[i][0]}에게 작은 선물을 건넸다.`,me)}}
 else if(m.type==='feed'&&p.coin>=15){p.coin-=15;r.dad=cl(r.dad+5,0,100);add(r,'sys','{P}이(가) {D}에게 좋아하는 간식을 먹였다.',me)}
 else if(m.type==='gift'&&p.coin>=25){p.coin-=25;bondd(r,3);add(r,'sys',`{P}이(가) ${r.cfg[me==='A'?'B':'A']}에게 작은 선물을 건넸다.`,me)}
 push(c)});
 ws.on('close',()=>{if(ws.room&&R[ws.room])push(ws.room)})});
app.get('/export/:c',(q,s)=>{const r=R[q.params.c];if(!r||r.pw!==H(q.query.pw))return s.status(404).end();s.set({'Content-Type':'text/plain; charset=utf-8','Content-Disposition':'attachment; filename=session.txt'});s.send(r.log.map(l=>(l.who?r.cfg[l.who]+': ':'')+l.t).join('\n\n'))});
srv.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('listening'));

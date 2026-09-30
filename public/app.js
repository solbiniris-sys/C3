(() => {
const KEY='waterline_v90_save';
const traitPool=['호기심','신중함','낙천적','조용함','고집','다정함','장난기','몽상가','꼼꼼함','독립적','사교적','섬세함'];
const petTraits=['온순함','장난꾸러기','충직함','탐구심','느긋함','대담함','먹보','경계심','애교쟁이','자유로운 영혼','영리함','물 좋아함'];
const weather=['맑은 수면','잔잔한 안개','짧은 비','수로의 바람','높은 수위','유리 같은 오후','흐린 하늘','따뜻한 물안개'];
const moods=['느긋한 아침','시장이 북적이는 날','운하가 조용한 날','물이 유난히 맑은 날','빗소리가 큰 날','상인들이 바쁜 날','학교가 일찍 끝나는 날','배가 많이 다니는 날'];
const places=[['저택','집','가족과 지내고 집을 돌본다.'],['시장','시장','식량을 사거나 사람들과 어울린다.'],['선착장','선착장','배와 변이동물을 구경하고 물길을 탄다.'],['구주거구','주거구','골목을 걷고 주민들과 이야기를 나눈다.'],['기록관','기록관','오래된 도시 기록을 찾아본다.'],['역','역','사람과 화물을 구경한다.']];
const events={
 daily:[
  {id:'market_craving',title:'시장에 가고 싶은 아침',text:'오늘은 시장 쪽이 유난히 시끄럽다. 누군가가 먼저 외출 이야기를 꺼냈다.',tags:['social'],choices:[{t:'모두 데리고 시장에 간다',fx:{money:-3,moodA:3,moodB:3,relAB:2,place:'시장'}},{t:'오늘은 집에서 같이 보낸다',fx:{moodA:4,moodB:4,relAB:3}},{t:'한 사람만 데리고 간다',fx:{money:-2,moodA:3,moodB:-1}}]},
  {id:'greenhouse',title:'온실의 첫 열매',text:'온실 한쪽에서 작고 단단한 열매가 익었다. 누가 먼저 발견했는지로 작은 논쟁이 벌어졌다.',tags:['home'],choices:[{t:'둘이 함께 수확한다',fx:{food:3,relAB:3}},{t:'누가 먼저 발견했는지 가린다',fx:{relAB:-2,moodA:2,moodB:2}},{t:'거대동물에게 맡긴다',fx:{petMood:3,relAP:1,relBP:1}}]},
  {id:'rain',title:'갑작스러운 비',text:'낮이 되자 수면 위로 빗줄기가 쏟아진다. 오늘의 이동이 조금 불편해졌다.',tags:['weather'],choices:[{t:'창가에서 비를 구경한다',fx:{moodA:3,moodB:3}},{t:'배를 타고 짧게 나간다',fx:{water:-1,petEnergy:-2,moodA:4,moodB:4}},{t:'집을 정리한다',fx:{house:3}}]},
  {id:'animal_friend',title:'낯선 변이동물',text:'선착장 근처에서 주인을 잃은 작은 변이동물이 계속 따라온다.',tags:['city','pet'],choices:[{t:'주인을 찾아본다',fx:{rep:3,relAP:1}},{t:'먹이를 조금 나눠준다',fx:{food:-1,relAP:2}},{t:'거리에서 조심스럽게 지켜본다',fx:{relAP:1}}]},
  {id:'pie',title:'식은 사과파이',text:'누군가가 아침 식탁에 작은 사과파이를 놓아두었다. 누가 가져왔는지는 아무도 모른다.',tags:['home'],choices:[{t:'같이 먹는다',fx:{food:2,moodA:3,moodB:3,relAB:2}},{t:'보관한다',fx:{food:3}},{t:'거대동물에게 한 조각 준다',fx:{petMood:4,relAP:2,relBP:2}}]},
  {id:'map',title:'접힌 도시 지도',text:'서재 책 사이에서 오래된 수로 지도가 미끄러져 나왔다. 지도 한 구석에 집의 선착장이 표시되어 있다.',tags:['discover'],choices:[{t:'지도에 표시를 추가한다',fx:{discover:1}},{t:'아이들과 같이 살펴본다',fx:{relAB:2,discover:1}},{t:'다시 책 사이에 넣는다',fx:{discover:1}}]},
  {id:'late_train',title:'13분 늦은 시계',text:'역의 큰 시계가 이상하게도 늘 13분 늦어 있다. 오늘도 그대로다.',tags:['discover'],choices:[{t:'역무원에게 묻는다',fx:{rep:1,discover:1}},{t:'시간을 맞춰본다',fx:{discover:1}},{t:'그냥 지나친다',fx:{}}]},
  {id:'boat',title:'빈 배',text:'저녁 무렵, 아무도 타지 않은 작은 배가 저택 선착장에 부딪혔다.',tags:['chain'],choices:[{t:'배를 묶어 둔다',fx:{pending:'boat',discover:1}},{t:'안에 무엇이 있는지 확인한다',fx:{pending:'boat',discover:2}},{t:'물길로 다시 밀어낸다',fx:{}}]},
  {id:'letter',title:'젖은 편지',text:'현관 우편함에서 주소 없는 편지 한 통을 발견했다. 봉투에는 푸른 방수 왁스가 묻어 있다.',tags:['chain'],choices:[{t:'바로 읽는다',fx:{pending:'letter',discover:1}},{t:'말려서 보관한다',fx:{pending:'letter',discover:1}},{t:'아이들과 함께 읽는다',fx:{pending:'letter',discover:2,relAB:2}}]},
  {id:'barrel',title:'떠내려온 나무바구니',text:'수로 가장자리에 낡은 나무바구니 하나가 걸려 있다. 이상하게도 아주 최근에 만들어진 흔적이 있다.',tags:['chain'],choices:[{t:'집으로 가져온다',fx:{pending:'basket',discover:2}},{t:'선착장에 보관한다',fx:{pending:'basket',discover:1}},{t:'그대로 둔다',fx:{}}]}
 ],
 city:[
  {id:'merchant',title:'상인의 부탁',text:'시장 상인이 짐 하나를 옮겨 달라고 부탁한다. 거대동물이 끌 수 있을 만한 크기다.',tags:['social'],choices:[{t:'도와준다',fx:{money:7,petEnergy:-3,rep:2,relAP:1}},{t:'아이들과 같이 돕는다',fx:{money:7,petEnergy:-2,relAB:2,rep:2}},{t:'정중히 거절한다',fx:{}}]},
  {id:'market_game',title:'물빛 카드판',text:'시장 구석에서 작은 카드판이 열린다. 오늘은 운이 좋아 보인다.',tags:['mini'],choices:[{t:'카드 놀이를 한다',fx:{mini:true}},{t:'구경만 한다',fx:{}}]},
  {id:'waterman',title:'수로의 사공',text:'사공이 오늘은 물살이 다르다고 말한다. 수면 아래쪽에서 뭔가 움직였다고 한다.',tags:['discover'],choices:[{t:'무엇을 봤는지 묻는다',fx:{discover:1,rep:1}},{t:'아이들에게 물어본다',fx:{relAB:2,discover:1}},{t:'오늘은 그냥 돌아간다',fx:{}}]}
 ],
 follow:[
  {id:'boat_follow',title:'빈 배의 주인',text:'며칠 전 저택에 닿았던 빈 배에 작은 금속표가 달려 있었다. 오늘 시장에서 같은 표를 단 사람이 나타났다.',tags:['follow'],choices:[{t:'말을 걸어본다',fx:{discover:2,rep:2,pendingDone:'boat'}},{t:'아이들에게 먼저 알려준다',fx:{relAB:2,discover:1,pendingDone:'boat'}},{t:'아직은 모른 척한다',fx:{pending:'boat2'}}]},
  {id:'letter_follow',title:'편지의 다음 문장',text:'말려 둔 편지를 다시 펼쳤다. 물에 번졌던 글자가 조금씩 읽힌다. "두 개의 바구니는…"',tags:['follow'],choices:[{t:'끝까지 읽는다',fx:{discover:3,pendingDone:'letter'}},{t:'아이들에게 보여준다',fx:{discover:2,relAB:3,pendingDone:'letter'}},{t:'다시 접어 둔다',fx:{pending:'letter2'}}]},
  {id:'basket_follow',title:'나무바구니의 표시',text:'바구니 바닥에서 아주 작은 문양이 드러났다. 기록관에서 본 오래된 표식과 닮았다.',tags:['follow'],choices:[{t:'기록관으로 가져간다',fx:{place:'기록관',discover:3,pendingDone:'basket'}},{t:'집에 보관한다',fx:{discover:2,pendingDone:'basket'}},{t:'거대동물에게 보여준다',fx:{relAP:3,discover:2,pendingDone:'basket'}}]}
 ]
};
let S=load()||null, setup={a:'',b:'',pet:'',traits:{a:[],b:[],pet:[]}};
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(!x)return null;
 const d=initDefaults();
 Object.keys(d).forEach(k=>{if(x[k]===undefined||x[k]===null)x[k]=d[k]});
 x.names={...d.names,...(x.names||{})}; x.traits={...d.traits,...(x.traits||{})};
 x.tastes={a:{...d.tastes.a,...(x.tastes?.a||{})},b:{...d.tastes.b,...(x.tastes?.b||{})},pet:{...d.tastes.pet,...(x.tastes?.pet||{})}};
 x.npcs={...d.npcs,...(x.npcs||{})}; x.unlocks={...d.unlocks,...(x.unlocks||{})}; x.placeVisits={...d.placeVisits,...(x.placeVisits||{})};
 x.story={...d.story,...(x.story||{})}; x.dice={...d.dice,...(x.dice||{})};
 return x}catch(e){localStorage.removeItem(KEY);return null}}
function initDefaults(){return {goal:'오늘은 어떤 하루가 될까?',names:{a:'A',b:'B',pet:'거대동물'},traits:{a:[],b:[],pet:[]},pending:[],done:[],logs:[],lastOutcome:null,lastEvent:null,lastChemistry:'',npcs:{'마르타':0,'루카':0,'엘리오':0},tastes:{a:{likes:['물놀이','사과'],dislikes:['시장']},b:{likes:['시장','종이배'],dislikes:['비']},pet:{likes:['물놀이','말린고기'],dislikes:['큰 소리']}},collection:[],placeVisits:{'저택':0,'시장':0,'선착장':0,'구주거구':0,'기록관':0,'역':0},unlocks:{시장:0,선착장:0,구주거구:0,기록관:0,역:0},story:{clues:[],threads:[],chapters:[]},activeRequests:[],todayScenes:[],dice:{total:0,success:0,fail:0}}}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function logLabel(x){const a=nm('a'),b=nm('b'),p=nm('pet');return String(x).replace(/\bA\b/g,a).replace(/\bB\b/g,b).replace(/거대동물/g,p)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function clamp(n){return Math.max(0,Math.min(100,n))}
function nm(k){return S?.names?.[k]||({a:'A',b:'B',pet:'거대동물'}[k])}
function traitTags(k){return (S?.traits?.[k]||[]).map(esc).join(' · ')}
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
function initState(){return {day:1,turn:0,phase:'day',weather:weather[0],mood:moods[0],money:40,food:12,water:12,house:70,rep:0,discover:0,place:'저택',goal:'오늘은 셋 중 한 명의 기분을 크게 바꿔보자.',names:{a:setup.a.trim()||'A',b:setup.b.trim()||'B',pet:setup.pet.trim()||'거대동물'},traits:{a:[...setup.traits.a],b:[...setup.traits.b],pet:[...setup.traits.pet]},moodA:70,moodB:70,petMood:75,energyA:80,energyB:80,petEnergy:85,relAB:55,relAP:60,relBP:60,pending:[],done:[],logs:['새로운 하루가 시작되었다.'],lastEvent:null,lastOutcome:null,lastChemistry:'',miniWins:0,miniLosses:0,dice:{total:0,success:0,fail:0},
 tastes:{a:{likes:['물놀이','사과'],dislikes:['시장']},b:{likes:['시장','종이배'],dislikes:['비']},pet:{likes:['물놀이','말린고기'],dislikes:['큰 소리']}},
 npcs:{'마르타':0,'루카':0,'엘리오':0},collection:[],placeVisits:{'저택':0,'시장':0,'선착장':0,'구주거구':0,'기록관':0,'역':0},unlocks:{시장:0,선착장:0,구주거구:0,기록관:0,역:0},story:{clues:[],threads:[],chapters:[]},activeRequests:[],todayScenes:[]}}
function traitHas(k,t){return S.traits[k]?.includes(t)}
function relationshipLabel(v){return v>=80?'아주 가까움':v>=60?'편안함':v>=40?'무난함':v>=20?'어색함':'멀어짐'}
function comboText(k){const ts=S.traits[k];if(ts.includes('장난기')&&ts.includes('사교적'))return '사건 제조기';if(ts.includes('신중함')&&ts.includes('섬세함'))return '작은 계획가';if(ts.includes('다정함')&&ts.includes('꼼꼼함'))return '살뜰한 돌봄꾼';if(ts.includes('호기심')&&ts.includes('독립적'))return '혼자 떠나는 탐험가';if(ts.includes('조용함')&&ts.includes('몽상가'))return '느린 관찰자';if(ts.includes('고집')&&ts.includes('낙천적'))return '잘 안 꺾이는 낙천가';if(ts.includes('경계심')&&ts.includes('충직함'))return '집의 감시자';if(ts.includes('물 좋아함')&&ts.includes('탐구심'))return '물길 탐험가';if(ts.includes('온순함')&&ts.includes('애교쟁이'))return '포근한 식구';return '저마다의 방식으로 살아가는 아이'}
function setupView(){document.getElementById('app').innerHTML=`<main class="shell"><section class="paper setup"><div class="sub">WATERLINE · 물가의 집</div><h1>오래된 저택에서,<br>오늘을 살아갑니다.</h1><p class="lead">수면 위와 아래가 이어진 도시의 가장자리. 방수된 오래된 저택에서 두 아이와 거대한 변이동물이 살아간다. 이름과 성향을 정하고, 그들이 어떤 가족이 될지 직접 만들어 보자.</p><div class="formgrid"><div class="field"><label>A의 이름</label><small>게임 안에서는 설정한 이름으로만 표시됩니다.</small><input id="na" maxlength="12" placeholder="A"></div><div class="field"><label>B의 이름</label><small>원하면 그냥 A / B로 둘 수도 있어요.</small><input id="nb" maxlength="12" placeholder="B"></div><div class="field full"><label>거대 변이동물의 이름</label><small>이 집에서 함께 사는 커다란 식구.</small><input id="np" maxlength="12" placeholder="이름을 정해주세요"></div>${traitPicker('a','A',traitPool)}${traitPicker('b','B',traitPool)}${traitPicker('pet','거대동물',petTraits)}</div><div id="setupMsg" class="notice"></div><button class="primary start" id="start">이 집에서 살아가기 시작</button></section></main>`;
['na','nb','np'].forEach(id=>document.getElementById(id).addEventListener('input',e=>setup[{na:'a',nb:'b',np:'pet'}[id]]=e.target.value));document.getElementById('start').type='button';document.getElementById('start').onclick=()=>{
 const pools={a:traitPool,b:traitPool,pet:petTraits};
 for(const k of ['a','b','pet']){if(!setup.traits[k].length)setup.traits[k]=pools[k].slice(0,3);else if(setup.traits[k].length<3){for(const t of pools[k])if(!setup.traits[k].includes(t)&&setup.traits[k].length<3)setup.traits[k].push(t)}}
 S=initState();refreshRequests();save();render();
};
}
function traitPicker(k,label,list){return `<div class="field"><label>${label}의 성향 <span class="pill">3개 선택</span></label><div class="traits" id="traits-${k}">${list.map(t=>`<button type="button" class="trait" data-k="${k}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="limit">${k==='pet'?'온순함, 탐구심, 물 좋아함 등':'성격을 3개 조합하세요.'}</div></div>`}
function bindTraitButtons(){document.querySelectorAll('.trait').forEach(b=>b.onclick=()=>{const k=b.dataset.k,t=b.dataset.t;let arr=setup.traits[k];if(arr.includes(t)){arr=arr.filter(x=>x!==t)}else if(arr.length<3)arr=[...arr,t];setup.traits[k]=arr;document.querySelectorAll(`.trait[data-k="${k}"]`).forEach(x=>x.classList.toggle('selected',arr.includes(x.dataset.t)))})}
const oldSetup=setupView;setupView=function(){oldSetup();bindTraitButtons()};
function applyFx(f){if(f.money)S.money=Math.max(0,S.money+f.money);if(f.food)S.food=Math.max(0,S.food+f.food);if(f.water)S.water=Math.max(0,S.water+f.water);if(f.house)S.house=clamp(S.house+f.house);if(f.rep)S.rep+=f.rep;if(f.discover)S.discover+=f.discover;['moodA','moodB','petMood','energyA','energyB','petEnergy','relAB','relAP','relBP'].forEach(k=>{if(f[k])S[k]=clamp(S[k]+f[k])});if(f.pending){if(!S.pending.includes(f.pending))S.pending.push(f.pending)}if(f.pendingDone){S.pending=S.pending.filter(x=>x!==f.pendingDone);S.done.push(f.pendingDone)}if(f.place)S.place=f.place;if(f.mini)openMini();}
function eligiblePending(){return S.pending.map(id=>({boat:'boat_follow',letter:'letter_follow',basket:'basket_follow',key:'key_follow'}[id])).filter(Boolean)}
const extraEvents=[
['school_boat','학교 가는 배','수로를 건너는 작은 배가 저택 앞을 지나간다. 아이들이 창가로 달려간다.',['daily','family'],[['같이 손을 흔든다',{moodA:3,moodB:3,relAB:1}],['배가 사라질 때까지 본다',{discover:1,moodA:2,moodB:2}],['오늘은 늦지 않게 준비한다',{energyA:2,energyB:2}]]],
['river_market','물 위의 임시 시장','오늘은 작은 배들이 모여 물 위에서 장을 연다.',['city'],[['구경한다',{money:-2,moodA:4,moodB:4}],['먹을 것을 산다',{money:-4,food:5,moodA:3,moodB:3}],['상인에게 말을 건다',{rep:2,discover:1}]]],
['old_key','학교 가방 속 열쇠','아이의 가방에서 낡은 황동 열쇠 하나가 나왔다. 누구의 것인지 모른다.',['discover','chain'],[['아이에게 어디서 났는지 묻는다',{discover:2,relAB:2,pending:'key'}],['기록관에서 확인한다',{discover:3,pending:'key'}],['일단 보관한다',{pending:'key'}]]],
['greenhouse_bug','온실의 작은 소동','온실 한쪽에서 작은 수중생물이 화분 사이를 헤집고 있다.',['home'],[['조심스럽게 내보낸다',{house:1,moodA:2,moodB:2}],['관찰한다',{discover:1,relAB:1}],['거대동물에게 맡긴다',{relAP:2,relBP:2,petMood:3}]]],
['night_oar','밤의 노 젓는 소리','잠들기 직전, 멀리서 노가 물을 가르는 소리가 들린다.',['discover'],[['창문을 연다',{discover:1,moodA:-1}],['그냥 듣는다',{relAB:1}],['다음 날 기억해 둔다',{discover:1}]]],
['bread_delivery','예고 없는 빵','아침에 문 앞에 따뜻한 빵 봉지가 놓여 있다.',['home'],[['함께 먹는다',{food:4,moodA:4,moodB:4,relAB:2}],['누가 보냈는지 찾아본다',{rep:1,discover:1}],['반은 보관한다',{food:3,moodA:2}]]],
['lost_map','길 잃은 관광객','구주거구에서 길을 잃은 사람이 저택으로 가는 길을 묻는다.',['city','social'],[['직접 데려다준다',{rep:3,energyA:-2,energyB:-2}],['지도만 알려준다',{rep:1}],['아이들에게 길을 설명하게 한다',{relAB:2,rep:2}]]],
['ferry_race','즉석 배 경주','선착장에서 아이들이 작은 배를 띄워 경주하고 있다.',['city','play'],[['구경한다',{moodA:3,moodB:3}],['참가한다',{moodA:5,moodB:5,energyA:-3,energyB:-3}],['거대동물과 응원한다',{petMood:4,relAP:2,relBP:2}]]],
['window_fog','창문의 물안개','밤새 낀 물안개가 창문에 이상한 모양을 남겼다.',['home','discover'],[['그림처럼 남겨둔다',{discover:1,moodA:2,moodB:2}],['닦아낸다',{house:2}],['아이들과 의미를 붙여본다',{relAB:2,discover:1}]]],
['old_recipe','낡은 요리책','주방 서랍 깊은 곳에서 오래된 수로 도시 요리책이 발견됐다.',['home'],[['새 요리를 해본다',{food:2,moodA:5,moodB:5,relAB:2}],['책만 읽어본다',{discover:1}],['거대동물에게도 먹을 수 있는지 찾아본다',{relAP:1,food:1}]]],
['dock_rope','끊어진 계류줄','선착장의 계류줄 한 가닥이 낡아 있다. 오늘 수위가 높다.',['home','weather'],[['직접 고친다',{house:4,energyA:-2}],['시장에 새 줄을 사러 간다',{money:-3,house:7}],['일단 배를 옮긴다',{discover:1,relAP:1}]]],
['library_blank','비어 있는 장부','기록관에서 특정 연도의 장부 몇 장이 통째로 비어 있다.',['discover'],[['사서에게 묻는다',{rep:2,discover:2}],['빈 페이지를 복사한다',{discover:2}],['오늘은 돌아간다',{}]]],
['animal_school','학교 앞의 변이동물','학교 앞에서 아이들이 길들여진 변이동물과 함께 모여 있다.',['city','family'],[['구경한다',{moodA:4,moodB:4}],['아이에게 어떤 동물인지 묻는다',{discover:1,relAB:2}],['거대동물과 인사시킨다',{relAP:3,relBP:3,petMood:4}]]],
['rain_puddle','커다란 물웅덩이','비가 그친 뒤 저택 앞에 작은 물길이 생겼다. 아이들이 신나 보인다.',['weather','family'],[['같이 논다',{moodA:6,moodB:6,relAB:3,energyA:-2,energyB:-2}],['집에 들어오라고 한다',{house:1,relAB:-1}],['거대동물이 먼저 들어간다',{petMood:5,moodA:3,moodB:3}]]],
['market_rumor','시장의 소문','상인들 사이에서 오래된 저택 이야기가 잠깐 오간다. 정확한 내용은 들리지 않는다.',['city','discover'],[['자세히 묻는다',{rep:1,discover:2}],['아이들에게 말하지 않는다',{relAB:-1,relAB:-1}],['같이 들어본다',{relAB:2,discover:1}]]],
['quiet_lunch','조용한 점심','오늘은 이상할 만큼 조용하다. 누구도 먼저 말을 꺼내지 않는다.',['family'],[['각자 쉬게 한다',{moodA:2,moodB:2,petMood:2}],['같이 식사한다',{food:-1,relAB:3,moodA:3,moodB:3}],['작은 이야기를 시작한다',{relAB:2,relAB:2,relAB:2}]]],
['pet_water','물가의 낮잠','거대동물이 수면 가까이에 몸을 길게 뻗고 낮잠을 잔다.',['pet'],[['옆에 앉는다',{relAP:3,petMood:4}],['아이들을 부른다',{relAP:2,relBP:2,moodA:3,moodB:3}],['깨우지 않는다',{petEnergy:5,petMood:3}]]],
['school_note','학교에서 온 쪽지','아이의 주머니에서 짧은 쪽지가 나온다. 내용은 별것 아닌데 날짜가 적혀 있다.',['family','discover'],[['무슨 일인지 묻는다',{relAB:3,discover:1}],['둘이 먼저 이야기하게 둔다',{relAB:3}],['쪽지를 보관한다',{discover:1}]]],
['ferry_ticket','낡은 승선권','선착장 바닥에서 오래된 승선권 하나를 주웠다. 뒷면에 집과 비슷한 문양이 있다.',['discover'],[['기록관으로 가져간다',{discover:3,rep:1}],['집에 보관한다',{discover:2}],['물에 띄워 보낸다',{discover:1}]]],
['rain_leak','천장의 작은 누수','비가 세게 내리자 천장 한쪽에서 물방울이 떨어진다.',['home','weather'],[['양동이를 받친다',{house:-1}],['직접 수리한다',{house:5,energyA:-3}],['수리공을 부른다',{money:-6,house:8,rep:1}]]]
];
extraEvents.forEach(([id,title,text,tags,chs])=>events.daily.push({id,title,text,tags,choices:chs.map(([t,fx])=>({t,fx}))}));
events.follow.push({id:'key_follow',title:'열쇠가 맞는 문',text:'며칠 전 발견한 황동 열쇠를 들고 저택을 둘러보다가, 평소에는 눈에 띄지 않던 작은 자물쇠를 발견했다.',tags:['follow','discover'],choices:[{t:'열쇠를 맞춰본다',fx:{discover:3,house:2,pendingDone:'key'}},{t:'아이들과 함께 찾는다',fx:{discover:2,relAB:3,pendingDone:'key'}},{t:'아직은 열지 않는다',fx:{pending:'key2'}}]});
function tasteHas(k,item){return S.tastes?.[k]?.likes?.includes(item)}
function tasteDislikes(k,item){return S.tastes?.[k]?.dislikes?.includes(item)}
function unlockPlace(p){if(p==='저택')return;const n=(S.placeVisits[p]||0)+1;S.placeVisits[p]=n;if(S.unlocks[p]!==undefined)S.unlocks[p]=Math.min(3,Math.floor(n/3));}
function addStoryClue(text,thread='도시의 흔적'){if(!S.story.clues.includes(text)){S.story.clues.push(text);S.story.threads.push(thread);S.logs.unshift(`${S.day}일 · 단서 발견 · ${text}`)}}
function npcScene(name){const v=S.npcs[name]||0;const lines={
 '마르타':v>=6?`${name}는 이제 아이들이 오면 먼저 빵을 꺼내 놓는다. 오늘은 말하지 않아도 무슨 부탁이 있는지 알아챘다.`:v>=3?`${name}가 멀리서 손을 흔들었다. 시장에 올 때마다 얼굴을 알아보는 모양이다.`:`${name}가 시장에서 물건을 정리하고 있다. 아직은 서로 이름만 아는 사이다.`,
 '루카':v>=6?`${name}는 배의 밧줄을 묶으며 이 집의 선착장에 대해 아는 이야기를 들려주겠다고 했다.`:v>=3?`${name}가 수로 건너편에서 먼저 인사를 건넸다.`:`${name}가 배를 손질하다 잠깐 눈을 마주쳤다.`,
 '엘리오':v>=6?`${name}는 기록관 안쪽의 서랍 하나를 몰래 보여 주었다. 이제는 낯선 방문객으로 취급하지 않는다.`:v>=3?`${name}가 기록관에서 찾은 자료를 한 장 건네주었다.`:`${name}가 기록관에서 바쁜 손으로 인사를 받아주었다.`};return lines[name]}
function seedRequests(){const pool=[
 ['마르타','시장에 들르면 말린 과일 한 봉지를 가져다 달라고 했다.','식량'],
 ['루카','저택 선착장의 계류줄 상태를 봐달라고 했다.','집'],
 ['엘리오','오래된 승선권을 발견하면 기록관으로 가져와 달라고 했다.','단서']
 ];S.activeRequests=shuffle(pool).slice(0,2)}
function refreshRequests(){seedRequests();}
function traitReaction(kind,e,fx={}){const t=S.traits[kind]||[];if(t.includes('호기심')&&e.tags.includes('discover'))fx.discover=(fx.discover||0)+1;if(t.includes('꼼꼼함')&&e.tags.includes('home'))fx.house=(fx.house||0)+1;if(t.includes('다정함')&&e.tags.includes('family')){fx.moodA=(fx.moodA||0)+1;fx.moodB=(fx.moodB||0)+1;}if(t.includes('사교적')&&e.tags.includes('social'))fx.rep=(fx.rep||0)+1;if(t.includes('장난기')&&e.tags.includes('play')){fx.moodA=(fx.moodA||0)+2;fx.moodB=(fx.moodB||0)+2;}if(t.includes('신중함')&&e.tags.includes('weather'))fx.house=(fx.house||0)+1;if(t.includes('섬세함')&&e.tags.includes('family'))fx.relAB=(fx.relAB||0)+1;if(t.includes('독립적')&&e.tags.includes('discover'))fx.energyA=(fx.energyA||0)+1;return fx}
function traitPetReaction(e,fx={}){const t=S.traits.pet||[];if(t.includes('물 좋아함')&&e.tags.includes('weather')){fx.petMood=(fx.petMood||0)+2;fx.petEnergy=(fx.petEnergy||0)+1}if(t.includes('먹보')&&e.tags.includes('home')&&S.food>0)fx.petMood=(fx.petMood||0)+1;if(t.includes('경계심')&&e.tags.includes('discover'))fx.relAP=(fx.relAP||0)+1;fx.relBP=(fx.relBP||0)+1;if(t.includes('애교쟁이')&&e.tags.includes('family')){fx.moodA=(fx.moodA||0)+1;fx.moodB=(fx.moodB||0)+1}return fx}
function traitConflict(){const a=S.traits.a||[],b=S.traits.b||[];let fx={};if(a.includes('고집')&&b.includes('신중함'))fx.relAB=-1;if(a.includes('장난기')&&b.includes('조용함'))fx.relAB=-1;if(a.includes('다정함')&&b.includes('섬세함'))fx.relAB=1;if(a.includes('사교적')&&b.includes('독립적'))fx.relAB=0;return fx}
function locationEvents(){
 const L={
  '저택':[{id:'mansion_attic',title:'젖은 발자국',text:`다락으로 이어지는 계단에 아직 마르지 않은 발자국이 남아 있다. ${nm('a')}는 먼저 올라가려 하고, ${nm('b')}는 난간을 살핀다.`,tags:['home','story'],risk:true,choices:[{t:'둘이 함께 따라간다',fx:{discover:2,relAB:2}},{t:'거대동물을 먼저 보낸다',fx:{relAP:2,relBP:1,discover:1}},{t:'오늘은 내려온다',fx:{moodA:1,moodB:1}}]}],
  '시장':[{id:'market_vendor',title:'붉은 우산 아래의 상인',text:`평소 보지 못했던 상인이 붉은 우산 아래에서 젖은 장부를 말리고 있다. ${nm('b')}가 장부의 표식을 알아본 듯 멈춰 선다.`,tags:['market','story'],risk:true,choices:[{t:'장부를 살펴본다',fx:{discover:2,rep:1}},{t:'상인에게 묻는다',fx:{rep:2}},{t:'아이들이 먼저 말을 걸게 한다',fx:{relAB:2,discover:1}}]},{id:'market_work',title:'급한 배달',text:'상인이 오늘 안에 건네야 하는 작은 상자를 들고 서 있다. 보수는 꽤 괜찮다.',tags:['market','work'],risk:true,choices:[{t:'배달을 맡는다',fx:{money:6,energyA:-2,energyB:-2}},{t:'거대동물과 함께 옮긴다',fx:{money:8,petEnergy:-4,relAP:2,relBP:2}},{t:'정중히 사양한다',fx:{rep:1}}]}],
  '선착장':[{id:'dock_whistle',title:'물 아래에서 난 휘파람',text:`선착장 아래에서 짧은 휘파람 소리가 들린다. ${nm('pet')}가 귀를 세우고 물을 바라본다.`,tags:['dock','story'],risk:true,choices:[{t:'소리를 따라간다',fx:{discover:2,petEnergy:-3}},{t:'거대동물의 반응을 살핀다',fx:{relAP:2,relBP:1}},{t:'배 위에서 기다린다',fx:{discover:1}}]},{id:'dock_fishing',title:'물이 빠진 틈',text:'수위가 잠깐 낮아지며 돌계단 아래가 드러났다. 먹을 만한 것과 낡은 물건이 함께 보인다.',tags:['dock','resource'],risk:true,choices:[{t:'아래로 내려간다',fx:{food:3,discover:1}},{t:'거대동물에게 살펴보게 한다',fx:{food:2,relAP:2,petEnergy:-2}},{t:'아이들끼리 의견을 듣는다',fx:{relAB:2}}]}],
  '구주거구':[{id:'resident_laundry',title:'물 위에 걸린 빨래',text:`붉은 벽돌 건물 사이로 빨래가 걸려 있다. ${nm('a')}가 낯선 이웃과 눈이 마주친다.`,tags:['residential','social'],risk:false,choices:[{t:'인사를 건넨다',fx:{rep:2}},{t:'아이들이 먼저 인사한다',fx:{rep:2,relAB:1}},{t:'조용히 지나간다',fx:{}}]},{id:'residential_alley',title:'막다른 골목의 문',text:'평소에는 지나치던 좁은 골목 끝에 물빛 타일로 된 문이 있다. 문 아래로 물이 흐른다.',tags:['residential','story'],risk:true,choices:[{t:'문을 살펴본다',fx:{discover:2}},{t:'주민에게 물어본다',fx:{rep:1,discover:1}},{t:'다음에 다시 온다',fx:{pending:'alley',discover:1}}]}],
  '기록관':[{id:'archive_missing',title:'빠진 한 장',text:`도시 수몰 기록의 한 장만 정교하게 잘려 있다. ${nm('b')}가 페이지 가장자리의 물자국을 알아본다.`,tags:['archive','story'],risk:true,choices:[{t:'잘린 자리를 조사한다',fx:{discover:3}},{t:'사서에게 보여준다',fx:{rep:2,discover:2}},{t:'둘이 추측해 본다',fx:{relAB:3,discover:1}}]},{id:'archive_locked',title:'잠긴 서가',text:'서가 뒤에서 금속성 소리가 났다. 열쇠구멍은 오래된 저택의 것과 닮았다.',tags:['archive','story'],risk:true,choices:[{t:'열쇠를 꺼내 본다',fx:{discover:4}},{t:'기록관에 맡긴다',fx:{rep:2,discover:2}},{t:'일단 기억해 둔다',fx:{pending:'archive',discover:1}}]}],
  '역':[{id:'station_ticket',title:'목적지가 없는 승차권',text:'역 바닥에 젖은 승차권이 하나 떨어져 있다. 목적지 칸만 비어 있다.',tags:['station','story'],risk:true,choices:[{t:'표를 살펴본다',fx:{discover:2}},{t:'역무원에게 건넨다',fx:{rep:2}},{t:'아이들에게 추측하게 한다',fx:{relAB:2,discover:1}}]},{id:'station_job',title:'늦은 짐',text:'마지막 배편의 짐이 아직 플랫폼에 남아 있다. 주인을 찾지 못하면 폐기된다고 한다.',tags:['station','work'],risk:true,choices:[{t:'짐을 옮긴다',fx:{money:5,energyA:-2}},{t:'주인을 찾아본다',fx:{rep:2,discover:1}},{t:'아이들과 단서를 찾는다',fx:{relAB:2,discover:2}}]}]};
 return L[S.place]||[];
}
function pickEvent(){let pool=[];const follows=eligiblePending();if(follows.length&&Math.random()<.55)pool.push(...events.follow.filter(e=>follows.includes(e.id)));pool.push(...events.daily);pool.push(...locationEvents());if(S.place!=='저택')pool.push(...events.city.filter(e=>!e.tags.includes('market')||S.place==='시장'));if(traitHas('a','호기심')||traitHas('b','호기심')||traitHas('pet','탐구심'))pool.push(events.daily.find(e=>e.id==='map'));const recent=S.logs.slice(0,10).join(' ');let candidates=pool.filter(e=>!recent.includes(e.title));if(!candidates.length)candidates=pool;return candidates[Math.floor(Math.random()*candidates.length)]}
function startEvent(force=false){if(!force&&S.lastEvent)return;S.lastOutcome=null;S.lastEvent=pickEvent();S.logs.unshift(`${S.day}일 · ${S.lastEvent.title}`);save()}
function action(title,desc,fn){S.lastOutcome=null;if(S.turn>=8){toast('오늘의 행동을 모두 사용했어요.');return}S.lastChemistry='';const before={money:S.money,food:S.food,water:S.water,house:S.house,rep:S.rep,discover:S.discover,moodA:S.moodA,moodB:S.moodB,petMood:S.petMood,energyA:S.energyA,energyB:S.energyB,petEnergy:S.petEnergy,relAB:S.relAB,relAP:S.relAP,relBP:S.relBP};S.turn++;fn();const fx={};Object.keys(before).forEach(k=>{const d=S[k]-before[k];if(d)fx[k]=d});if(!S.lastChemistry)S.lastChemistry='';const text=S.lastChemistry||'평범한 행동이었지만 오늘의 하루에 작은 흔적을 남겼다.';S.lastOutcome={title:title,text:text,changes:changeSummary(fx)};S.logs.unshift(`${S.day}일 · ${title}`);if(Math.random()<0.24)spontaneous();if(S.turn>=8)endDay();else{if(!S.lastEvent&&Math.random()<.35)startEvent();save();render()}}
function spontaneous(){const a=S.traits.a,b=S.traits.b,p=S.traits.pet;let text='';const options=[];if(a.includes('장난기'))options.push(()=>{S.moodA=clamp(S.moodA+3);S.relAB=clamp(S.relAB+1);text=`${nm('a')}가 ${nm('b')}에게 작은 장난을 쳤다.`});if(b.includes('꼼꼼함'))options.push(()=>{S.house=clamp(S.house+2);text=`${nm('b')}가 아무도 부탁하지 않았는데 방 한쪽을 정리했다.`});if(p.includes('먹보')&&S.food>0)options.push(()=>{S.food--;S.petMood=clamp(S.petMood+5);text=`${nm('pet')}가 식료품 바구니 근처에서 얌전히 기다리고 있었다.`});if(p.includes('경계심'))options.push(()=>{text=`${nm('pet')}가 현관 쪽을 바라보다가 다시 자리에 앉았다.`});if(a.includes('호기심'))options.push(()=>{S.discover+=1;collectionAdd('낡은 단추');text=`${nm('a')}가 평소 지나치던 작은 물건 하나를 발견했다.`});if(b.includes('몽상가'))options.push(()=>{S.moodB=clamp(S.moodB+3);text=`${nm('b')}가 창밖의 수면을 보며 혼자 이야기를 만들고 있었다.`});if(a.includes('다정함')&&b.includes('섬세함'))options.push(()=>{S.relAB=clamp(S.relAB+2);text=`${nm('a')}가 말없이 ${nm('b')}의 곁에 앉았다.`});if(p.includes('애교쟁이'))options.push(()=>{S.petMood=clamp(S.petMood+3);S.relAP=clamp(S.relAP+1);S.relBP=clamp(S.relBP+1);text=`${nm('pet')}가 ${nm('a')}와 ${nm('b')} 사이를 오가며 장난을 걸었다.`});if(Math.random()<.18){const n=Object.keys(S.npcs)[Math.floor(Math.random()*3)];S.npcs[n]++;text=`길에서 ${n}을 만났다. ${n}은 ${nm('a')}와 ${nm('b')}를 알아보는 눈치였다.`}if(!options.length)options.push(()=>{S.relAB=clamp(S.relAB+1);text=`오늘 ${nm('a')}와 ${nm('b')}는 잠깐 같은 이야기를 했다.`});options[Math.floor(Math.random()*options.length)]();S.logs.unshift(`${S.day}일 · ${text}`)}
function dailyGoal(){const goals=[`오늘은 ${nm('a')}와 ${nm('b')}가 함께 웃는 장면을 하나 만들자.`,`오늘은 식량을 ${Math.max(1,S.food-1)} 이상 남겨 보자.`,`오늘은 도시에서 새로운 사람을 한 명 만나 보자.`,`오늘은 ${nm('pet')}와 물길을 한 번 거닐어 보자.`,`오늘은 아무도 예상하지 못한 일을 하나 만들어 보자.`,`오늘은 오래된 저택에서 새로운 흔적을 하나 찾아보자.`,`오늘은 ${nm('a')}가 좋아하는 일을 해보자.`,`오늘은 ${nm('b')}가 좋아하는 일을 해보자.`,`오늘은 새로운 물건을 하나 수집해 보자.`];return goals[Math.floor(Math.random()*goals.length)]}
function endDay(){const scene=eveningScene();S.logs.unshift(`${S.day}일 밤 · ${scene}`);S.food=Math.max(0,S.food-2);S.water=Math.max(0,S.water-2);S.energyA=clamp(S.energyA-8);S.energyB=clamp(S.energyB-8);S.petEnergy=clamp(S.petEnergy-6);if(S.food===0){S.moodA=clamp(S.moodA-8);S.moodB=clamp(S.moodB-8)}if(S.water===0){S.house=clamp(S.house-5)}S.day++;S.turn=0;S.phase='day';S.weather=weather[Math.floor(Math.random()*weather.length)];S.mood=moods[Math.floor(Math.random()*moods.length)];S.place='저택';S.lastEvent=null;S.lastChemistry=scene;S.lastOutcome=null;S.goal=dailyGoal();refreshRequests();S.todayScenes=[];save();render();toast(`새로운 하루 · DAY ${S.day}`)}
function eveningScene(){const nA=nm('a'),nB=nm('b'),p=nm('pet');if(S.relAB>=80)return `${nA}와 ${nB}는 하루 동안 있었던 일을 한참 이야기했다. ${p}는 그 옆에서 조용히 잠들었다.`;if(S.relAB<35)return `${nA}와 ${nB}는 사소한 일로 조금 어색해졌다. ${p}가 둘 사이에 몸을 눕혔다.`;if(S.relAP>=80&&S.relBP>=80)return `${p}가 두 아이 사이를 오가며 오늘 있었던 일을 확인하는 듯했다.`;if(traitHas('a','장난기')&&traitHas('b','낙천적'))return `${nA}가 시작한 장난에 ${nB}가 웃음을 터뜨렸다. ${p}까지 꼬리를 쳤다.`;return `${nA}와 ${nB}는 식탁에서 조용히 하루를 정리했다. ${p}는 발치에 누워 있었다.`}
function surpriseResolve(e,c){
 const fx={...(c.fx||{})}, roll=Math.random(); let tone='';
 const A=S.traits.a||[],B=S.traits.b||[],P=S.traits.pet||[];
 const curious=A.includes('호기심')||B.includes('호기심')||P.includes('탐구심');
 const careful=A.includes('신중함')||B.includes('신중함')||P.includes('경계심');
 const playful=A.includes('장난기')||B.includes('장난기')||P.includes('장난꾸러기');
 const social=A.includes('사교적')||B.includes('사교적');
 if(roll<.10&&curious){fx.discover=(fx.discover||0)+1;tone=`그런데 ${nm('a')}가 지나치려던 곳에서 작은 흔적 하나를 발견했다.`}
 else if(roll<.18&&playful){fx.moodA=(fx.moodA||0)+2;fx.moodB=(fx.moodB||0)+2;tone='별것 아닌 일이었는데, 결국 웃음이 터졌다.'}
 else if(roll<.25&&social){fx.rep=(fx.rep||0)+1;tone='돌아가려는 순간 누군가 먼저 말을 걸었다. 생각보다 오래 이야기를 나눴다.'}
 else if(roll<.31&&careful){fx.house=(fx.house||0)+1;tone='서두르지 않은 덕분에 놓칠 뻔한 작은 위험을 피했다.'}
 else if(roll>.94){if(e.tags.includes('city'))fx.money=(fx.money||0)+2;if(e.tags.includes('family'))fx.relAB=(fx.relAB||0)+1;tone='돌아오는 길에 뜻밖의 작은 행운이 따라왔다.'}
 else tone='예상했던 것과는 조금 달랐지만, 이상하게도 나쁘지는 않았다.';
 return {fx,tone};
}
function choose(i){const e=S.lastEvent;if(!e)return;const c=e.choices[i];S.lastEvent=null;const r=surpriseResolve(e,c);const fx=r.fx;
 if(e.risk){S.pendingChoice={title:e.title,choice:c,fx,tone:r.tone};renderDice(e,c);return;}
 finishChoice(e,c,fx,r.tone);}
function changeSummary(fx){const out=[];const names={money:'돈',food:'식량',water:'물',house:'집 상태',rep:'평판',discover:'발견',moodA:nm('a')+' 기분',moodB:nm('b')+' 기분',petMood:nm('pet')+' 기분',energyA:nm('a')+' 체력',energyB:nm('b')+' 체력',petEnergy:nm('pet')+' 체력',relAB:nm('a')+' ↔ '+nm('b'),relAP:nm('a')+' ↔ '+nm('pet'),relBP:nm('b')+' ↔ '+nm('pet')};Object.keys(names).forEach(k=>{if(fx[k])out.push(`${names[k]} ${fx[k]>0?'+':''}${fx[k]}`)});return out.slice(0,5)}
function finishChoice(e,c,fx,tone){traitReaction('a',e,fx);traitReaction('b',e,fx);traitPetReaction(e,fx);applyFx(fx);if(e.tags.includes('family'))applyFx(traitConflict());const chem=chemistryLine(e);if(chem){S.lastChemistry=chem;S.logs.unshift(`${S.day}일 · ${chem}`)}S.lastOutcome={title:c.t,text:tone,changes:changeSummary(fx)};S.logs.unshift(`${S.day}일 · ${c.t} — ${tone}`);save();render()}
function chemistryLine(e){const a=nm('a'),b=nm('b'),p=nm('pet');const A=S.traits.a||[],B=S.traits.b||[],P=S.traits.pet||[];if(A.includes('장난기')&&B.includes('조용함')){S.relAB=clamp(S.relAB+(Math.random()<.5?1:-1));return `${a}가 장난을 걸었고 ${b}는 잠깐 못마땅한 표정을 지었지만 결국 웃었다.`}if(A.includes('다정함')&&B.includes('섬세함'))return `${a}가 말없이 ${b}에게 먼저 필요한 것을 건넸다. ${b}는 아무 말 없이 받아들였다.`;if(A.includes('호기심')&&B.includes('신중함'))return `${a}가 먼저 다가가려 하자 ${b}가 한 번 더 주변을 살폈다. 둘은 결국 함께 움직였다.`;if(P.includes('애교쟁이'))return `${p}가 두 아이 사이에 몸을 밀어 넣었다. 둘 다 결국 ${p}를 쓰다듬었다.`;if(P.includes('경계심'))return `${p}가 먼저 낯선 기척을 알아차렸고, ${a}와 ${b}가 동시에 그쪽을 돌아봤다.`;return ''}
function renderDice(e,c){const back=document.createElement('div');back.className='modalback';back.innerHTML=`<div class="modal paper dice"><span class="tag">위험 판정</span><h4>${esc(e.title)}</h4><p>${esc(c.t)} — 이번 선택은 운과 성향에 맡겨야 한다.</p><div class="dicebox"><div class="die" id="die">?</div><div class="rollcopy">D6 + 숨은 보정</div></div><button class="primary" id="rollDice">주사위를 굴린다</button></div>`;document.body.appendChild(back);document.getElementById('rollDice').onclick=()=>{const btn=document.getElementById('rollDice');btn.disabled=true;const d=Math.floor(Math.random()*6)+1;document.getElementById('die').textContent=d;setTimeout(()=>{const careful=(S.traits.a||[]).includes('신중함')||(S.traits.b||[]).includes('신중함')||(S.traits.pet||[]).includes('경계심');const curious=(S.traits.a||[]).includes('호기심')||(S.traits.b||[]).includes('호기심')||(S.traits.pet||[]).includes('탐구심');const bonus=(careful?1:0)+(curious&&e.tags.includes('discover')?1:0);const total=d+bonus;let tone,fx={...(S.pendingChoice.fx||{})};if(total>=6){S.dice.success++;tone=`주사위 ${d} · 보정 +${bonus}. 무사히 해냈다. 그런데 예상 밖의 흔적 하나가 남았다.`;fx.discover=(fx.discover||0)+(Math.random()<.45?1:0)}else if(total>=4){S.dice.total++;tone=`주사위 ${d} · 보정 +${bonus}. 해내긴 했지만 대가가 따랐다.`;fx.energyA=(fx.energyA||0)-2;fx.energyB=(fx.energyB||0)-1}else{S.dice.fail++;tone=`주사위 ${d} · 보정 +${bonus}. 일이 꼬였다. 다음 선택에 영향을 줄 만한 일이 생겼다.`;fx.house=(fx.house||0)-3;fx.moodA=(fx.moodA||0)-3;fx.moodB=(fx.moodB||0)-3}S.pendingChoice=null;back.remove();finishChoice(e,c,fx,tone)},700)}}

function doRoom(type){action(type,'',()=>{
 if(type==='취향 따라가기'){const candidates=[];if(tasteHas('a','사과'))candidates.push('사과를 찾아 시장에 들렀다.');if(tasteHas('b','시장'))candidates.push(`${nm('b')}가 시장의 소란스러운 분위기를 꽤 마음에 들어 했다.`);const text=candidates[Math.floor(Math.random()*candidates.length)]||`${nm('a')}와 ${nm('b')}가 서로 좋아하는 것을 이야기했다.`;S.moodA=clamp(S.moodA+3);S.moodB=clamp(S.moodB+3);S.relAB=clamp(S.relAB+2);S.lastChemistry=text;return}
 if(type==='거대동물 따라가기'){S.petEnergy=clamp(S.petEnergy-2);S.petMood=clamp(S.petMood+5);S.relAP=clamp(S.relAP+2);S.relBP=clamp(S.relBP+2);if(Math.random()<.45){collectionAdd('물빛 조개');addStoryClue('거대동물이 알고 있는 물길이 따로 있다.','거대동물의 기억')}S.lastChemistry=`${nm('pet')}가 먼저 물길을 골랐고 ${nm('a')}와 ${nm('b')}가 뒤따랐다.`;return}
 if(type==='이웃 부탁 확인'){const req=S.activeRequests[0];if(!req){S.lastChemistry='오늘은 특별한 부탁이 없다.';return}const [n,text,kind]=req;S.npcs[n]=(S.npcs[n]||0)+1;if(kind==='식량'){S.food+=2;S.rep+=2}else if(kind==='집'){S.house=clamp(S.house+4);S.rep+=2}else{S.discover+=2;addStoryClue('오래된 승선권에 저택과 같은 문양이 있다.','수몰 이전의 도시')}S.lastChemistry=`${n}의 부탁을 ${nm('a')}와 ${nm('b')}가 함께 처리했다. ${npcScene(n)}`;S.activeRequests.shift();return}
 if(type==='시장 식량 구매'){if(S.money<4){toast('돈이 부족하다.');S.turn=Math.max(0,S.turn-1);return}S.money-=4;S.food+=5;S.placeVisits['시장']++;S.npcs['마르타']++;S.lastChemistry=`${nm('b')}가 장바구니를 들고 앞장섰고 ${nm('a')}는 가격을 하나하나 확인했다.`;return}
 if(type==='시장 일 돕기'){S.money+=5;S.rep+=1;S.npcs['루카']++;S.relAB=clamp(S.relAB+1);S.lastChemistry=`${nm('a')}와 ${nm('b')}가 상인의 짐을 나눠 들었다. 누가 더 많이 들었는지는 끝까지 의견이 갈렸다.`;return}
 if(type==='시장 구경'){S.npcs['마르타']++;S.moodA=clamp(S.moodA+2);S.moodB=clamp(S.moodB+2);S.rep+=1;S.npcs['마르타']++;if(Math.random()<.45)startEvent(true);return}
 if(type==='선착장 채집'){S.placeVisits['선착장']++;S.petEnergy=clamp(S.petEnergy-2);if(Math.random()<.62){S.food+=3;collectionAdd('물빛 조개');S.lastChemistry=`${nm('pet')}가 물속에서 무언가를 먼저 찾아냈다.`}else{S.energyA=clamp(S.energyA-3);S.energyB=clamp(S.energyB-2);S.lastChemistry='물이 갑자기 흔들려 서둘러 돌아왔다.'}return}
 if(type==='선착장 배 구경'){S.moodA=clamp(S.moodA+2);S.moodB=clamp(S.moodB+2);S.relAP=clamp(S.relAP+1);S.relBP=clamp(S.relBP+1);collectionAdd('낡은 승차권');return}
 if(type==='선착장 낚시'){if(Math.random()<.55){S.food+=3;S.lastChemistry=`${nm('pet')}가 낚싯줄이 움직일 때마다 물가를 두드렸다.`}else{S.petEnergy=clamp(S.petEnergy-2);S.lastChemistry='낚싯줄은 한참 동안 움직이지 않았다.'}return}
 if(type==='주거구 심부름'){const n=Object.keys(S.npcs)[Math.floor(Math.random()*3)];S.npcs[n]++;if(Math.random()<.55){S.money+=4;S.rep+=2;S.lastChemistry=`${n}의 부탁을 ${nm('a')}와 ${nm('b')}가 함께 해결했다.`}else{S.food+=2;S.rep+=1;S.lastChemistry=`${n}이 고맙다며 저장식품을 건넸다.`}return}
 if(type==='주거구 골목놀이'){S.moodA=clamp(S.moodA+4);S.moodB=clamp(S.moodB+4);S.relAB=clamp(S.relAB+2);S.rep+=1;return}
 if(type==='기록관 조사'){S.discover+=2;S.placeVisits['기록관']++;if(Math.random()<.35){collectionAdd('수몰 도시 지도');S.pending.push('archive')}return}
 if(type==='기록관 정리'){S.money+=2;S.rep+=2;S.discover+=1;S.npcs['엘리오']++;return}
 if(type==='역 짐일'){S.money+=4;S.energyA=clamp(S.energyA-2);S.rep+=1;S.npcs['루카']++;return}
 if(type==='역 사람 구경'){S.discover++;S.rep++;collectionAdd('목적지 없는 승차권');if(Math.random()<.3)startEvent(true);return}
 if(type==='온실 돌보기'){S.food+=2;S.house=clamp(S.house+2);S.lastChemistry=`${nm('b')}가 물을 주는 동안 ${nm('a')}가 익은 열매를 발견했다.`;return}

 if(type.includes('식사')){
  if(S.food>0){S.food--;S.moodA=clamp(S.moodA+4);S.moodB=clamp(S.moodB+4);S.relAB=clamp(S.relAB+2);S.petMood=clamp(S.petMood+1)}else toast('식량이 부족하다.');
 }else if(type.includes('A와 B')){
  S.relAB=clamp(S.relAB+4);S.moodA=clamp(S.moodA+3);S.moodB=clamp(S.moodB+3);
 }else if(type.includes('A와 거대동물')){
  S.relAP=clamp(S.relAP+4);S.moodA=clamp(S.moodA+2);S.petMood=clamp(S.petMood+3);S.petEnergy=clamp(S.petEnergy-2);
 }else if(type.includes('B와 거대동물')){
  S.relBP=clamp(S.relBP+4);S.moodB=clamp(S.moodB+2);S.petMood=clamp(S.petMood+3);S.petEnergy=clamp(S.petEnergy-2);
 }else if(type.includes('둘만')){
  S.relAB=clamp(S.relAB+5);S.moodA=clamp(S.moodA+2);S.moodB=clamp(S.moodB+2);
 }else if(type.includes('정리')){S.house=clamp(S.house+6);S.relAB=clamp(S.relAB+1)}
 else if(type.includes('온실')){S.food++;S.house=clamp(S.house+1);S.relAB=clamp(S.relAB+1)}
 else if(type.includes('시장 식량 구매')){if(S.money>=4){S.money-=4;S.food+=5;S.relAB=clamp(S.relAB+1)}else{toast('돈이 부족하다.');S.turn=Math.max(0,S.turn-1)}}
 else if(type.includes('시장 일 돕기')){S.money+=5;S.rep+=1;S.relAB=clamp(S.relAB+1)}
 else if(type.includes('선착장 채집')){S.petEnergy=clamp(S.petEnergy-2);if(Math.random()<0.6)S.food+=3;else{S.energyA=clamp(S.energyA-3);S.energyB=clamp(S.energyB-2)}}
 else if(type.includes('선착장 배 구경')){S.petMood=clamp(S.petMood+3);S.relAP=clamp(S.relAP+1);S.relBP=clamp(S.relBP+1)}
 else if(type.includes('주거구 심부름')){S.money+=3;S.rep+=2;S.relAB=clamp(S.relAB+1)}
 else if(type.includes('기록관 조사')){S.discover+=2;if(Math.random()<0.3)S.pending.push('archive')}
 else if(type.includes('역 짐일')){S.money+=4;S.energyA=clamp(S.energyA-2);S.rep+=1}
 else if(type.includes('산책')){S.petEnergy=clamp(S.petEnergy-3);S.petMood=clamp(S.petMood+6);S.relAP=clamp(S.relAP+2);S.relBP=clamp(S.relBP+2)}
 else if(type==='같이 요리'){if(S.food<2){toast('식량이 부족하다.');S.turn=Math.max(0,S.turn-1);return}S.food-=2;S.moodA=clamp(S.moodA+5);S.moodB=clamp(S.moodB+5);S.relAB=clamp(S.relAB+3);S.house=clamp(S.house+1);S.lastChemistry=`${nm('a')}가 재료를 손질하는 동안 ${nm('b')}가 옆에서 맛을 보았다. ${nm('pet')}는 떨어지는 것을 기다리고 있었다.`}
 else if(type==='종이배 경주'){S.relAB=clamp(S.relAB+(Math.random()<.5?3:1));S.moodA=clamp(S.moodA+4);S.moodB=clamp(S.moodB+4);S.lastChemistry=`${nm('a')}와 ${nm('b')}가 누가 더 멀리 보내는지 겨뤘다. ${nm('pet')}가 마지막 배를 물에서 건져 왔다.`}
 else if(type==='물놀이'){S.petEnergy=clamp(S.petEnergy-3);S.petMood=clamp(S.petMood+8);S.moodA=clamp(S.moodA+5);S.moodB=clamp(S.moodB+5);S.relAP=clamp(S.relAP+2);S.relBP=clamp(S.relBP+2)}
 else if(type==='저택 탐색'){S.discover+=1;S.house=clamp(S.house-1);if(Math.random()<.3)S.pending.push('archive');S.lastChemistry=`${nm('a')}와 ${nm('b')}가 오래된 방의 문을 열어 보려다 결국 ${nm('pet')}에게 먼저 냄새를 맡게 했다.`}
 else if(type==='가족 산책'){S.energyA=clamp(S.energyA-2);S.energyB=clamp(S.energyB-2);S.petEnergy=clamp(S.petEnergy-3);S.relAB=clamp(S.relAB+2);S.relAP=clamp(S.relAP+2);S.relBP=clamp(S.relBP+2);S.lastChemistry=`세 식구가 수로를 따라 걸었다. ${nm('a')}와 ${nm('b')}는 앞서 걷고 ${nm('pet')}는 뒤를 따라왔다.`}
 else if(type==='A와 이야기'){S.moodA=clamp(S.moodA+5);S.relAB=clamp(S.relAB+2);S.discover+=traitHas('a','섬세함')?1:0;S.lastChemistry=`${nm('a')}가 오늘 있었던 일을 이야기했다. 평소보다 말이 길었다.`}
 else if(type==='B와 이야기'){S.moodB=clamp(S.moodB+5);S.relAB=clamp(S.relAB+2);S.discover+=traitHas('b','섬세함')?1:0;S.lastChemistry=`${nm('b')}가 아무렇지 않은 척 숨겨 둔 이야기를 꺼냈다.`}
 else if(type==='시장 구경'){S.npcs['마르타']++;S.moodA=clamp(S.moodA+2);S.moodB=clamp(S.moodB+2);S.rep+=1;if(Math.random()<.35)startEvent(true)}
 else if(type==='선착장 낚시'){if(Math.random()<.55){S.food+=3;S.lastChemistry=`${nm('pet')}가 낚싯줄이 움직일 때마다 물가를 두드렸다.`}else{S.petEnergy=clamp(S.petEnergy-2);S.lastChemistry='낚싯줄은 한참 동안 움직이지 않았다.'}}
 else if(type==='주거구 골목놀이'){S.moodA=clamp(S.moodA+4);S.moodB=clamp(S.moodB+4);S.relAB=clamp(S.relAB+2);S.rep+=1}
 else if(type==='기록관 정리'){S.money+=2;S.rep+=2;S.discover+=1}
 else if(type==='역 사람 구경'){S.discover+=1;S.rep+=1;if(Math.random()<.3)startEvent(true)}
 else if(type==='A와 B 장난'){S.moodA=clamp(S.moodA+4);S.moodB=clamp(S.moodB+(Math.random()<.65?5:-2));S.relAB=clamp(S.relAB+(Math.random()<.7?3:-1));S.lastChemistry=`${nm('a')}가 ${nm('b')}에게 장난을 걸었다. ${nm('b')}의 반응은 생각보다 예상하기 어려웠다.`;if(Math.random()<.25)startEvent(true)}
 else if(type==='B와 A 이야기'){S.moodA=clamp(S.moodA+2);S.moodB=clamp(S.moodB+5);S.relAB=clamp(S.relAB+3);S.lastChemistry=`${nm('b')}가 먼저 말을 꺼냈고 ${nm('a')}는 의외로 끝까지 들어주었다.`}
 else if(type==='A와 거대동물'){S.relAP=clamp(S.relAP+4);S.petMood=clamp(S.petMood+5);S.moodA=clamp(S.moodA+3);S.lastChemistry=`${nm('a')}가 ${nm('pet')}의 등을 타고 물길을 한 바퀴 돌았다.`}
 else if(type==='오늘의 심부름'){const jobs=[()=>{S.money+=4;S.rep+=2;S.lastChemistry=`${nm('a')}와 ${nm('b')}가 이웃의 무거운 상자를 함께 옮겼다.`},()=>{S.food+=2;S.rep+=1;S.lastChemistry=`${nm('b')}가 이웃에게서 직접 만든 저장식품을 받아왔다.`},()=>{S.discover+=1;S.rep+=1;S.lastChemistry=`${nm('pet')}가 심부름 도중 길을 먼저 찾아냈다.`}];jobs[Math.floor(Math.random()*jobs.length)]();if(Math.random()<.3)startEvent(true)}
 else if(type==='오늘의 놀이'){const games=['종이배 경주','물놀이'];const g=games[Math.floor(Math.random()*games.length)];if(g==='종이배 경주'){S.moodA=clamp(S.moodA+5);S.moodB=clamp(S.moodB+5);S.relAB=clamp(S.relAB+2);S.lastChemistry=`${nm('a')}와 ${nm('b')}가 종이배를 띄웠고 ${nm('pet')}가 결승선을 정했다.`}else{S.moodA=clamp(S.moodA+5);S.moodB=clamp(S.moodB+5);S.petMood=clamp(S.petMood+6);S.relAP=clamp(S.relAP+2);S.relBP=clamp(S.relBP+2);S.lastChemistry=`셋이 물가에서 놀다가 결국 ${nm('pet')}가 모두를 물에 빠뜨렸다.`}}
 else if(type==='물빛 카드'){openMini();}

 })}

function travel(place){
 if(!S||S.turn>=8){toast('오늘은 더 움직일 수 없다.');return}
 if(S.place===place){toast(`지금은 ${place}에 있다.`);return}
 S.turn++;S.place=place;S.placeVisits[place]=(S.placeVisits[place]||0)+1;unlockPlace(place);S.lastOutcome=null;
 if(place==='선착장'){S.petEnergy=clamp(S.petEnergy-1)}
 if(place==='기록관'){S.discover++}
 if(place==='시장'){S.relAB=clamp(S.relAB+1)}
 S.logs.unshift(`${S.day}일 · ${place}으로 이동`);
 // 이동 자체가 새로운 장면을 열 수 있게 한다. 결과는 이동 후에만 공개.
 if(Math.random()<0.45) startEvent(true);
 if(S.turn>=8) endDay(); else {save();render();toast(`${place}에 도착했다.`)}
}

function openMini(){renderMini();}
function renderMini(){const back=document.createElement('div');back.className='modalback';back.innerHTML=`<div class="modal paper mini"><h4>물빛 카드</h4><p>둘 중 한 장을 고른다. 각 카드의 숫자 합에서 일의 자리만 비교한다. 오늘은 한 번 더 할 수 있다.</p><div class="cards"><div class="sidecard">내 카드<div class="number" id="mine">?</div></div><div class="sidecard">상대 카드<div class="number" id="housecard">?</div></div></div><div class="choices"><button class="choice" id="draw1"><b>왼쪽 카드를 고른다</b><small>작은 숫자와 큰 숫자 사이의 운을 믿는다.</small></button><button class="choice" id="draw2"><b>오른쪽 카드를 고른다</b><small>조금 더 모험적인 선택.</small></button></div><div class="footer-actions"><button class="secondary" id="closeMini">그만두기</button></div></div>`;document.body.appendChild(back);document.getElementById('closeMini').onclick=()=>back.remove();function play(choice){const mine=choice===1?Math.floor(Math.random()*6)+1:Math.floor(Math.random()*6)+4;const other=Math.floor(Math.random()*10);document.getElementById('mine').textContent=mine;document.getElementById('housecard').textContent=other;setTimeout(()=>{if(mine>other){S.money+=5;S.miniWins++;toast('이겼다. +5');}else if(mine===other){toast('무승부.');}else{S.money=Math.max(0,S.money-2);S.miniLosses++;toast('아쉽다. -2');}S.logs.unshift(`${S.day}일 · 물빛 카드 결과`);save();back.remove();if(S.turn>=8)endDay();else render()},500)}document.getElementById('draw1').onclick=()=>play(1);document.getElementById('draw2').onclick=()=>play(2)}
function render(){if(!S){setupView();return}const e=S.lastEvent;document.getElementById('app').innerHTML=`<main class="shell"><div class="topbar"><div><div class="logo">WATERLINE</div><div class="sub">물가의 집 · ${esc(S.weather)} · ${esc(S.mood)}</div></div><div class="clock"><div class="sub">DAY</div><b>${S.day}</b><div class="sub">${S.turn}/8 행동</div></div></div><div class="layout"><section><div class="hero"><div class="hero-copy"><h2>도시의 가장자리, 오래된 저택</h2><p>${esc(S.place)} · 물길과 돌다리가 이어지는 하루</p></div><div class="mansion"></div></div><div class="stats"><div class="stat"><small>돈</small><b>${S.money}</b></div><div class="stat"><small>식량</small><b>${S.food}</b></div><div class="stat"><small>물</small><b>${S.water}</b></div><div class="stat"><small>집 상태</small><b>${S.house}</b></div><div class="stat"><small>도시 평판</small><b>${S.rep}</b></div></div><div class="card" style="margin-top:12px">${e?eventHtml(e):`<div class="event"><span class="tag">오늘의 목표</span><h2>${esc(S.goal||'오늘은 어떤 하루가 될까?')}</h2><p>${esc(nm('a'))}와 ${esc(nm('b'))}는 저택에서 하루를 시작했다. ${esc(nm('pet'))}는 이미 물가를 살피고 있다.</p></div>`}${S.lastOutcome?outcomeHtml(S.lastOutcome):''}<div style="margin-top:14px"><div class="section-head"><h3>지금 할 수 있는 일</h3><span class="muted">행동 ${S.turn}/8 · 매일 후보가 바뀜</span></div><div class="actions">${actionButtons()}</div></div></div>${pendingHtml()}${storyHtml()}</section><aside><div class="card"><h3>가족</h3><div class="family">${personHtml('a',S.moodA,S.energyA)}${personHtml('b',S.moodB,S.energyB)}${personHtml('pet',S.petMood,S.petEnergy)}</div></div><div class="card chemistry-card" style="margin-top:12px"><h3>오늘 본 장면</h3><div class="chemistry">${esc(S.lastChemistry||`${nm('a')}와 ${nm('b')}는 각자 하루를 보내고 있다. ${nm('pet')}가 두 사람 사이를 오간다.`)}</div></div><div class="card" style="margin-top:12px"><h3>서로의 거리</h3><div class="log"><div class="logitem">${nm('a')} ↔ ${nm('b')} <b>${relationshipLabel(S.relAB)}</b><br><span class="muted">${S.relAB}/100</span></div><div class="logitem">${nm('a')} ↔ ${nm('pet')} <b>${relationshipLabel(S.relAP)}</b></div><div class="logitem">${nm('b')} ↔ ${nm('pet')} <b>${relationshipLabel(S.relBP)}</b></div></div></div><div class="card" style="margin-top:12px"><h3>오늘의 장소</h3><div class="actions">${places.map(p=>`<button class="action place-btn ${S.place===p[0]?'current-place':''}" data-place="${p[0]}" ${S.turn>=8?'disabled':''}><b>${p[1]}</b><small>${S.place===p[0]?'지금 여기 있다 · ':''}${p[2]}</small></button>`).join('')}</div></div><div class="card" style="margin-top:12px"><h3>오늘의 부탁</h3>${S.activeRequests.length?S.activeRequests.map((r,i)=>`<div class="pending"><b>${r[0]}</b><br>${r[1]}</div>`).join(''):'<div class="muted">오늘은 부탁이 없다.</div>'}<button class="secondary request-btn" id="requestBtn">부탁을 확인한다</button></div><div class="card" style="margin-top:12px"><h3>도시 사람들</h3><div class="log">${Object.entries(S.npcs).map(([n,v])=>`<div class="logitem"><b>${n}</b> · ${v>=5?'가까운 이웃':v>=2?'얼굴을 익힌 사이':'아직 낯선 사람'}</div>`).join('')}</div></div><div class="card" style="margin-top:12px"><h3>수집한 물건</h3><div class="collection">${S.collection.length?S.collection.map(x=>`<span class="pill">${esc(x)}</span>`).join(' '):'<span class="muted">아직 특별한 물건이 없다.</span>'}</div></div><div class="card" style="margin-top:12px"><h3>최근 기록</h3><div class="log">${S.logs.slice(0,8).map(x=>`<div class="logitem">${esc(logLabel(x))}</div>`).join('')}</div></div><div class="card" style="margin-top:12px"><h3>가족의 취향</h3><div class="log"><div class="logitem">${nm('a')} · 좋아함 ${S.tastes.a.likes.join(', ')} · 싫어함 ${S.tastes.a.dislikes.join(', ')}</div><div class="logitem">${nm('b')} · 좋아함 ${S.tastes.b.likes.join(', ')} · 싫어함 ${S.tastes.b.dislikes.join(', ')}</div><div class="logitem">${nm('pet')} · 좋아함 ${S.tastes.pet.likes.join(', ')} · 싫어함 ${S.tastes.pet.dislikes.join(', ')}</div></div></div><div class="footer-actions"><button class="secondary" onclick="newGame()">새 게임</button></div></aside></div></main>`;bindChoices();}
function eventHtml(e){return `<div class="event"><span class="tag">${e.tags.includes('follow')?'이어지는 일':e.tags.includes('story')?'이야기':e.tags.includes('market')?'시장':e.tags.includes('dock')?'선착장':e.tags.includes('archive')?'기록관':e.tags.includes('station')?'역':e.tags.includes('residential')?'구주거구':'오늘의 사건'}</span><h2>${esc(e.title)}</h2><p>${esc(e.text)}</p><div class="choices">${e.choices.map((c,i)=>`<button class="choice" data-i="${i}"><b>${esc(c.t)}</b><small>무슨 일이 일어날지는 알 수 없다.</small></button>`).join('')}</div></div>`}
function choiceHint(f){return '무슨 일이 일어날지는 알 수 없다.'}
function bindChoices(){document.querySelectorAll('.choice[data-i]').forEach(b=>b.onclick=()=>choose(+b.dataset.i));const rb=document.getElementById('requestBtn');if(rb)rb.onclick=()=>{doRoom('이웃 부탁 확인')};document.querySelectorAll('.place-btn[data-place]').forEach(b=>b.onclick=()=>travel(b.dataset.place));document.querySelectorAll('.dynamic-action[data-room]').forEach(b=>b.onclick=()=>doRoom(b.dataset.room));}
function personHtml(k,m,e){return `<div class="person"><div class="personline"><b>${esc(nm(k))}</b><span class="pill">${comboText(k)}</span></div><div class="traitsline">${traitTags(k)}</div><div class="meter"><i style="width:${m}%"></i></div><div class="traitsline">기분 ${m} · 체력 ${e}</div></div>`}

function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function actionButtons(){
 const dis=S.turn>=8?'disabled':'';
 const common=[
  ['A와 B가 몰래 이야기한다','둘만의 이야기가 어디로 흘러갈지는 알 수 없다.','A와 B 이야기'],
  ['A가 B에게 장난을 건다','분위기가 좋아질 수도, 엉뚱하게 꼬일 수도 있다.','A와 B 장난'],
  ['B가 A에게 오늘 일을 묻는다','평소 하지 않던 이야기가 나올 수도 있다.','B와 A 이야기'],
  ['거대동물과 수로를 걷는다','물가에서 뜻밖의 것을 발견할 수도 있다.','가족 산책'],
  ['셋이서 요리한다','식량을 쓰지만 저녁이 조금 달라진다.','같이 요리'],
  ['저택의 닫힌 곳을 찾아본다','오래된 집은 아직 모든 방을 보여주지 않았다.','저택 탐색'],
  ['종이배 경주를 한다','누가 이길지는 중요하지 않다. 아마도.','종이배 경주'],
  ['물빛 카드를 한 판 한다','돈을 걸고 운을 시험한다.','물빛 카드'],
  ['거대동물과 둘이 시간을 보낸다','오늘은 그 녀석의 이야기를 들어본다.','A와 거대동물'],
  ['셋이 물가에서 논다','평범한 오후가 이상하게 시끄러워질 수 있다.','물놀이']
 ];
 if(tasteHas('a','사과')||tasteHas('b','시장')) common.push(['좋아하는 것을 찾아 나선다','누구의 취향을 따라갈지 고른다.','취향 따라가기']);
 if(tasteHas('pet','물놀이')) common.push(['거대동물이 가고 싶은 곳을 따라간다','오늘은 녀석이 먼저 길을 정하게 둔다.','거대동물 따라가기']);
 let place=locationActionButtons(true).replaceAll('onclick="doRoom(\'','data-room="').replaceAll('\')"','"');
 // location buttons are rendered separately below; common deck is deliberately reshuffled each render.
 let pool=shuffle(common.slice()).slice(0,4).map(x=>`<button class="action dynamic-action" data-room="${esc(x[2])}" ${dis}><b>${esc(x[0])}</b><small>${esc(x[1])}</small></button>`);
 const loc=locationActionButtons(true);
 const locBtns=loc?loc.match(/<button[\s\S]*?<\/button>/g)||[]:[];
 if(locBtns.length) pool.push(locBtns[Math.floor(Math.random()*locBtns.length)]);
 // One extra contextual activity makes every day feel less identical.
 if(Math.random()<0.5) pool.push(`<button class="action dynamic-action" data-room="오늘의 심부름" ${dis}><b>오늘의 심부름을 찾아본다</b><small>누군가의 부탁이 하루를 바꿀 수도 있다.</small></button>`);
 else pool.push(`<button class="action dynamic-action" data-room="오늘의 놀이" ${dis}><b>작은 놀이를 시작한다</b><small>${nm('a')}와 ${nm('b')}가 하고 싶은 걸 정한다.</small></button>`);
 return pool.join('');
}
function outcomeHtml(o){return `<div class="outcome-card"><span class="tag">방금 일어난 일</span><div class="outcome-title">${esc(o.title)}</div><div class="outcome-text">${esc(o.text)}</div>${o.changes?.length?`<div class="outcome-changes">${o.changes.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}</div>`}
function locationActionButtons(forDeck=false){
 const dis=S.turn>=8?'disabled':''; const p=S.place; let out=[];
 if(p==='시장'){
  out.push(`<button class="action place-action" onclick="doRoom('시장 식량 구매')" ${dis}><b>시장 장보기</b><small>식량과 시장 물건을 살펴본다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('시장 일 돕기')" ${dis}><b>상인 일을 돕는다</b><small>일거리를 찾아 보상과 평판을 얻는다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('시장 구경')" ${dis}><b>시장 구경</b><small>사람과 소문을 구경한다.</small></button>`);
 } else if(p==='선착장'){
  out.push(`<button class="action place-action" onclick="doRoom('선착장 채집')" ${dis}><b>물가에서 채집</b><small>먹을 것을 찾는다. 뜻밖의 일이 생길 수 있다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('선착장 배 구경')" ${dis}><b>배와 변이동물 구경</b><small>수로의 움직임을 살핀다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('선착장 낚시')" ${dis}><b>낚싯줄을 드리운다</b><small>잡히는 것은 알 수 없다.</small></button>`);
 } else if(p==='구주거구'){
  out.push(`<button class="action place-action" onclick="doRoom('주거구 심부름')" ${dis}><b>이웃의 심부름</b><small>무슨 부탁을 받게 될지는 그때 알 수 있다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('주거구 골목놀이')" ${dis}><b>골목 돌아보기</b><small>주민과 아이들이 모인 곳을 찾아본다.</small></button>`);
 } else if(p==='기록관'){
  out.push(`<button class="action place-action" onclick="doRoom('기록관 조사')" ${dis}><b>기록 조사</b><small>오래된 기록을 직접 찾아본다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('기록관 정리')" ${dis}><b>기록 정리 일을 돕는다</b><small>보상은 적지만 기록관에서 신뢰를 쌓는다.</small></button>`);
 } else if(p==='역'){
  out.push(`<button class="action place-action" onclick="doRoom('역 짐일')" ${dis}><b>짐을 옮긴다</b><small>작은 일거리를 찾아본다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('역 사람 구경')" ${dis}><b>사람들을 지켜본다</b><small>누가 어디로 가는지 관찰한다.</small></button>`);
 } else if(p==='저택'){
  out.push(`<button class="action place-action" onclick="doRoom('온실 돌보기')" ${dis}><b>온실 돌보기</b><small>식량을 조금 얻고 집을 돌본다.</small></button>`);
  out.push(`<button class="action place-action" onclick="doRoom('저택 탐색')" ${dis}><b>저택을 더 살펴본다</b><small>오래된 집에는 아직 열리지 않은 곳이 있다.</small></button>`);
 }
 return forDeck?out:out.join('');
}

function storyHtml(){return `<div class="card story-card" style="margin-top:12px"><div class="section-head"><h3>이야기의 흔적</h3><span class="muted">${S.story.clues.length}개</span></div>${S.story.clues.length?S.story.clues.slice(0,6).map(x=>`<div class="story-clue">${esc(x)}</div>`).join(''):'<div class="muted">아직 이어지는 이야기가 없다. 도시를 돌아다니다 보면 흔적이 쌓인다.</div>'}</div>`}
function pendingHtml(){return S.pending.length?`<div class="card" style="margin-top:12px"><h3>아직 끝나지 않은 일</h3>${S.pending.map(x=>`<div class="pending">${x==='boat'?'빈 배가 남긴 흔적':x==='letter'?'젖은 편지의 다음 문장':x==='basket'?'나무바구니의 출처':x==='key'?'황동 열쇠가 맞는 곳':'계속 마음에 걸리는 일'}<br><span class="muted">며칠 뒤 후속 사건이 나타날 수 있습니다.</span></div>`).join('')}</div>`:''}
function newGame(){if(confirm('현재 진행을 지우고 새로 시작할까요?')){localStorage.removeItem(KEY);S=null;setup={a:'',b:'',pet:'',traits:{a:[],b:[],pet:[]}};setupView()}}
window.travel=travel;window.doRoom=doRoom;window.newGame=newGame;
if(S)render();else setupView();
})();

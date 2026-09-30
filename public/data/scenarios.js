// ★ 시나리오 추가법: DATA.scenarios.push({...}) 또는 배열에 항목 추가.
// tags: 활동 tags와 겹치면 후보 / ch:[최소,최대] 챕터 / once: 1회성 / when(S,slot): 추가 조건
// scenes[키]={text,choices:[{t, req:{trait,rel,money,stat:['int',8]}, check:{stat,dc}, ok:{text,fx,next}, fail:{...}}]}
// 판정 없는 선택지는 text/fx/next를 바로 씀. fx: hp,stress,rel,money,stat:{},item:{},flag
// 텍스트 치환: {나} {상대} {펫}
DATA.chapters=[
 {age:'7세',intro:'물안개 낀 아침, 저택의 아이들은 아직 작다. {펫}의 등이 세상에서 가장 넓은 침대다.'},
 {age:'11세',intro:'아이들은 수면 아래 학교에 다니기 시작한다. 호기심이 자란다.'},
 {age:'15세',intro:'사춘기. 서로에게도, 저택에게도 말하지 못한 비밀이 생긴다.'},
 {age:'19세',intro:'저택을 떠날지 지킬지 고민해야 할 나이가 됐다.'},
 {age:'23세',intro:'독립의 시기. 마지막 계절이 온다.'}
];
DATA.scenarios=[
{id:'roof',title:'지붕의 구멍',tags:['manor'],start:'s0',scenes:{s0:{
 text:'서재 천장에 난 구멍으로 빗물이 쏟아진다. {나} 혼자서는 버겁다.',choices:[
 {t:'혼자 널빤지를 들어 막는다',check:{stat:'str',dc:12},ok:{text:'괴력으로 막았다! 기운은 빠졌지만 무사하다.',fx:{stress:-10,hp:-10}},fail:{text:'널빤지를 놓쳐 발등을 찧었다.',fx:{stress:20,hp:-20}}},
 {t:'{상대}에게 도움을 청한다 (유대 40+)',req:{rel:40},text:'둘이 힘을 합쳐 기둥을 세웠다.',fx:{rel:10,stress:-10,hp:-5}}]}}},
{id:'safe',title:'창고의 금고',tags:['manor','study'],start:'s0',scenes:{s0:{
 text:'창고 깊은 곳에 톱니바퀴 자물쇠가 달린 낡은 금고가 있다.',choices:[
 {t:'구조를 파악해 해제한다',check:{stat:'int',dc:11},ok:{text:'딸깍! 수몰 전의 금화가 쏟아진다.',fx:{money:100,stat:{int:1}}},fail:{text:'용수철이 튀어 손을 베였다.',fx:{stress:15,hp:-5}}},
 {t:'손재주로 조심스럽게 분해한다',req:{trait:'손재주'},text:'안전하게 열고 귀중품을 챙겼다.',fx:{money:50,stress:-5}}]}}},
{id:'vendor',title:'마르타의 제안',tags:['market'],start:'s0',scenes:{
 s0:{text:'상인 마르타가 속삭인다. "저택에서 나온 물건이라며? 좋은 값에 쳐줄게."',choices:[
  {t:'매력으로 값을 올린다',check:{stat:'charm',dc:11},ok:{text:'마르타가 혀를 내둘렀다.',fx:{money:80},next:'s1'},fail:{text:'되레 바가지를 썼다.',fx:{money:-20,stress:10}}},
  {t:'정중히 거절한다',text:'마르타는 어깨를 으쓱했다.',fx:{stress:-3}}]},
 s1:{text:'마르타가 덤으로 수국 뿌리를 건넨다. 받을까?',choices:[{t:'받는다',text:'수국 하나를 얻었다.',fx:{item:{'수국':1}}},{t:'사양한다',text:'빚은 지지 않기로 했다.',fx:{rel:2}}]}}},
{id:'undercurrent',title:'수중 통로의 급류',tags:['under'],ch:[2,5],start:'s0',scenes:{s0:{
 text:'갑자기 통로 안쪽에서 물살이 거세진다. {펫}이(가) 불안하게 운다.',choices:[
 {t:'헤엄쳐 버틴다',check:{stat:'agi',dc:13},ok:{text:'물살을 타고 빠져나왔다!',fx:{stat:{agi:1},stress:-5}},fail:{text:'휩쓸려 크게 지쳤다.',fx:{hp:-25,stress:15}}},
 {t:'{펫}의 감각을 믿고 따른다',check:{stat:'obs',dc:10},ok:{text:'{펫}이(가) 안전한 길을 찾았다.',fx:{rel:3}},fail:{text:'길을 잃고 한참 헤맸다.',fx:{hp:-10,stress:10}}}]}}},
{id:'keeper',title:'오르빈 노인의 이야기',tags:['pier'],ch:[3,5],once:true,start:'s0',scenes:{s0:{
 text:'선착장 지기 오르빈이 저택의 옛 주인에 대해 입을 연다. "너희 바구니는… 우연이 아니었다."',choices:[
 {t:'끝까지 캐묻는다',check:{stat:'will',dc:12},ok:{text:'노인이 옛 기록의 위치를 알려준다.',fx:{stat:{int:2},flag:'know_origin'}},fail:{text:'노인이 입을 닫아버렸다.',fx:{stress:10}}},
 {t:'듣지 않는다',text:'아직은 알고 싶지 않다.',fx:{stress:-5}}]}}}

,{id:'sister',title:'고아원의 편지',tags:['market','town'],ch:[3,5],once:true,when:(s)=>s.flags.know_origin,start:'s0',scenes:{s0:{
 text:'광장에서 낯익은 수녀복이 다가온다. "오래 찾았단다… 바구니 속 두 아이를."',choices:[
 {t:'용기를 내어 이야기를 듣는다',check:{stat:'will',dc:12},ok:{text:'수녀는 눈물을 삼키며 당신들의 출생을 조금 들려준다.',fx:{npc:{sister:20},flag:'sister_met',rel:8}},fail:{text:'심장이 뛰어 그 자리를 피했다.',fx:{stress:20}}},
 {t:'{펫}의 뒤에 숨는다',text:'{펫}이(가) 낮게 울며 수녀를 가로막았다.',fx:{pet:5,stress:-5}}]}}}
,{id:'school1',title:'수중 학교의 첫 시험',tags:['school'],ch:[2,3],start:'s0',scenes:{s0:{
 text:'세이라 선생이 물속 칠판 앞에서 말한다. "오늘은 지도 읽기 시험이다."',choices:[
 {t:'차분히 풀이한다',check:{stat:'int',dc:11},ok:{text:'만점! 세이라가 흐뭇하게 고개를 끄덕였다.',fx:{npc:{teacher:8},stat:{int:1}}},fail:{text:'절반쯤 틀렸다. 수업 후 남게 됐다.',fx:{stress:10,npc:{teacher:2}}}},
 {t:'옆자리 친구 답안을 곁눈질한다',check:{stat:'charm',dc:13},ok:{text:'들키지 않았다. 다만 마음이 찝찝하다.',fx:{stress:5}},fail:{text:'세이라에게 들켜 크게 혼났다.',fx:{npc:{teacher:-8},stress:15}}}]}}}
,{id:'teacherhome',title:'세이라의 초대',tags:['school'],ch:[3,5],when:s=>(s.npc.teacher||0)>=20,once:true,start:'s0',scenes:{s0:{
 text:'세이라가 서재 열쇠를 건넨다. "너희 저택 지하에 옛 기록이 있을 거다. 같이 찾아볼래?"',choices:[
 {t:'함께 지하 기록실을 뒤진다',check:{stat:'obs',dc:12},ok:{text:'벽 속에서 저택의 소유권 문서를 찾았다!',fx:{flag:'deed',npc:{teacher:10},money:50}},fail:{text:'먼지만 잔뜩 뒤집어썼다.',fx:{hp:-10}}},
 {t:'정중히 사양한다',text:'세이라는 아쉬워하며 열쇠를 거두었다.',fx:{}}]}}}
,{id:'fever',title:'열병',tags:['manor','pier','under'],start:'s0',scenes:{s0:{
 text:'{나}의 이마가 불덩이다. 하렌 의사를 부르러 가야 한다.',choices:[
 {t:'{펫}의 등을 타고 의원까지 달린다',check:{stat:'agi',dc:10},ok:{text:'하렌이 진료를 보고 약을 지어주었다.',fx:{hp:15,npc:{doctor:8},pet:3}},fail:{text:'길이 엇갈렸다. 밤새 앓았다.',fx:{hp:-20,stress:15}}},
 {t:'{상대}가 곁에서 간호한다 (유대 30+)',req:{rel:30},text:'밤새 찬 수건을 갈아준 덕에 열이 내렸다.',fx:{rel:8,hp:5}}]}}}
,{id:'boatrumor',title:'티모의 소문',tags:['canal','town'],start:'s0',scenes:{s0:{
 text:'곤돌라 사공 티모가 노를 저으며 속삭인다. "수문 밑에서 보물 지도가 나왔대."',choices:[
 {t:'흥정으로 정보를 캐낸다',check:{stat:'charm',dc:11},ok:{text:'티모가 지도 조각의 위치를 알려주었다.',fx:{npc:{boatman:8},item:{'조개 편지':1}}},fail:{text:'괜히 곤돌라 삯만 더 냈다.',fx:{money:-15}}},
 {t:'농담으로 받아넘긴다',text:'둘이 한참 웃었다.',fx:{npc:{boatman:3},stress:-10}}]}}}
,{id:'storm',title:'폭풍의 밤',tags:['manor','pet'],start:'s0',scenes:{s0:{
 text:'천둥이 치자 {펫}이(가) 불안하게 몸을 웅크린다.',choices:[
 {t:'곁에 앉아 다독인다',check:{stat:'emp',dc:9},ok:{text:'{펫}이(가) 서서히 진정하고 품에 머리를 묻었다.',fx:{pet:8,stress:-10}},fail:{text:'{펫}이(가) 놀라 가구를 넘어뜨렸다.',fx:{pet:-2,stress:10}}},
 {t:'{상대}와 함께 이불을 덮어준다',req:{rel:30},text:'셋이 붙어 잠든 밤.',fx:{pet:5,rel:5,stress:-15}}]}}}
,{id:'shipwreck',title:'난파선의 잔해',tags:['under'],ch:[2,5],start:'s0',scenes:{s0:{
 text:'수중 통로 끝에서 오래된 난파선 잔해가 나타났다.',choices:[
 {t:'선실 안으로 들어가 수색한다',check:{stat:'agi',dc:13},ok:{text:'상자 안에서 옛 은수저와 금화를 찾았다!',fx:{item:{'오래된 은수저':1},money:80}},fail:{text:'숨이 차 급히 되돌아왔다.',fx:{hp:-20,stress:10}}},
 {t:'{펫}의 후각으로 안전한 곳만 뒤진다',check:{stat:'obs',dc:10},ok:{text:'{펫}이(가) 숨은 상자를 가리켰다.',fx:{money:40,pet:3}},fail:{text:'허탕이었다.',fx:{stress:5}}}]}}}
,{id:'festival',title:'수면 축제',tags:['town','market','canal'],start:'s0',scenes:{s0:{
 text:'광장에 등불을 띄우는 축제가 열렸다. 노래 경연에 나가볼까?',choices:[
 {t:'무대에 오른다',check:{stat:'charm',dc:12},ok:{text:'박수갈채! 상금과 함께 이름이 알려졌다.',fx:{money:60,stat:{charm:1},npc:{vendor:5}}},fail:{text:'음이탈… 그래도 {펫}만은 박수를 쳤다.',fx:{stress:10,pet:2}}},
 {t:'등불만 띄우고 구경한다',text:'등불에 소원을 적었다. 마음이 가벼워졌다.',fx:{stress:-15}}]}}}
,{id:'vendor2',title:'마르타의 외상',tags:['market'],start:'s0',scenes:{s0:{
 text:'마르타가 절박한 얼굴이다. "돈을 빌려줄 수 있겠니? 이번 달만 좀…"',choices:[
 {t:'50G를 빌려준다',req:{money:50},text:'마르타가 고개를 숙였다. "꼭 갚으마."',fx:{money:-50,npc:{vendor:15},flag:'vendor_debt'}},
 {t:'매몰차게 거절한다',text:'마르타는 씁쓸히 돌아섰다.',fx:{npc:{vendor:-10},stress:5}}]}}}
,{id:'quarrel',title:'말다툼',tags:['manor','study'],ch:[3,5],start:'s0',scenes:{s0:{
 text:'사소한 일로 {나}와 {상대}의 언성이 높아졌다.',choices:[
 {t:'먼저 사과한다',check:{stat:'will',dc:10},ok:{text:'어색한 침묵 뒤, 둘은 함께 웃었다.',fx:{rel:8,stress:-10}},fail:{text:'사과가 오히려 불을 붙였다.',fx:{rel:-8,stress:15}}},
 {t:'{펫}에게 중재를 맡긴다',text:'{펫}이(가) 둘 사이에 코를 들이밀었다.',fx:{pet:3,rel:2}}]}}}
,{id:'ownermemory',title:'옛 주인의 초상',tags:['manor','study'],ch:[2,5],once:true,start:'s0',scenes:{s0:{
 text:'다락에서 먼지 덮인 초상화를 발견했다. 눈매가 낯익다.',choices:[
 {t:'뒷면의 글귀를 조사한다',check:{stat:'int',dc:12},ok:{text:'뒷면에 바구니에 관한 기록이 있었다.',fx:{flag:'know_origin',stat:{int:1}}},fail:{text:'글씨가 번져 읽을 수 없다.',fx:{stress:5}}},
 {t:'그냥 덮어둔다',text:'아직은 궁금해하지 않기로 했다.',fx:{}}]}}}

// ── 세계 상태 연동 사건 ──
,{id:'noise',title:'지하에서 들리는 소리',tags:['manor','under'],once:true,when:s=>s.rainDays>=3,start:'s0',scenes:{s0:{
 text:'비가 사흘째 그치지 않는다. 지하에서 이상한 소리가 들린다.',choices:[
 {t:'등불을 들고 내려가 조사한다',check:{stat:'obs',dc:12},ok:{text:'무너진 벽 뒤에서 오래된 수로가 드러났다! (지하 수로 해금)',fx:{flag:'waterway_found',stat:{obs:1}}},fail:{text:'물이 차올라 연장을 잃고 도망쳤다.',fx:{stress:10,hp:-10,flag:'lost_tool'}}},
 {t:'{펫}에게 먼저 내려가 보게 한다',check:{stat:'emp',dc:11},ok:{text:'{펫}이(가) 벽 한쪽을 긁으며 짖었다. 수로 입구였다.',fx:{flag:'waterway_found',pet:5}},fail:{text:'{펫}이(가) 겁을 먹고 돌아왔다.',fx:{pet:-2}}}]}}}
,{id:'attickey',title:'다락의 열쇠',tags:['manor'],once:true,when:s=>s.flags.room_study,start:'s0',scenes:{s0:{
 text:'서재를 정리하다 낡은 열쇠고리를 발견했다. 다락 문의 자물쇠와 맞을 듯하다.',choices:[
 {t:'자물쇠를 조심스럽게 연다',check:{stat:'hand',dc:12},ok:{text:'먼지 낀 다락에서 은수저 한 벌을 발견했다.',fx:{item:{'오래된 은수저':1},flag:'attic_key'}},fail:{text:'열쇠가 부러졌다.',fx:{stress:10}}}]}}}
,{id:'frozen',title:'얼어붙은 수면',tags:['canal','pier'],season:[3],weather:'결빙',start:'s0',scenes:{s0:{
 text:'운하 수면이 살얼음으로 덮였다. 건너편 시장까지 곤돌라가 다니지 못한다.',choices:[
 {t:'얼음 위를 조심스럽게 건넌다',check:{stat:'agi',dc:12},ok:{text:'무사히 건너 시장에서 이득을 봤다.',fx:{money:50}},fail:{text:'얼음이 깨져 물에 빠졌다.',fx:{hp:-20,stress:10}}},
 {t:'저택으로 돌아가 장작을 정리한다',text:'따뜻한 아궁이 앞에서 시간을 보냈다.',fx:{stress:-10,stat:{hand:1}}}]}}}
,{id:'cub',title:'새끼 변이동물',tags:['pet','pier'],season:[0],once:true,start:'s0',scenes:{s0:{
 text:'봄 물안개 속에서 어린 변이수달이 홀로 울고 있다.',choices:[
 {t:'다가가 마음을 읽어본다',check:{stat:'emp',dc:11},ok:{text:'새끼가 품에 안겼고, {펫}이(가) 흐뭇하게 지켜봤다.',fx:{pet:8,flag:'cub'}},fail:{text:'새끼가 도망쳤다.',fx:{stress:5}}},
 {t:'못 본 척한다',text:'마음이 무거웠다.',fx:{stress:8}}]}}}
// ── 저녁 공동 사건 (둘의 선택이 같으면 same, 다르면 diff. 선택지에 same을 넣으면 그 선택 전용 결과) ──
,{id:'dinner',title:'저녁 식사',joint:true,tags:['evening'],start:'s0',scenes:{s0:{
 text:'긴 하루가 끝났다. 저녁은 어떻게 할까?',choices:[
 {t:'수프를 함께 끓이자',same:{text:'둘이 부엌에서 나란히 요리했다. 웃음소리가 저택을 채웠다.',fx:{rel:5,stress:-15,hp:10}}},
 {t:'남은 빵으로 조용히 때우자',same:{text:'말없이 빵을 나눠 먹었다. 그것만으로도 충분한 밤이다.',fx:{rel:2,stress:-5}}}],
 diff:{text:'한 명은 냄비를, 다른 한 명은 빵을 들었다. 어색한 웃음이 오갔다.',fx:{rel:-1,stress:-5}}}}}
,{id:'bedtime',title:'잠들기 전에',joint:true,tags:['evening'],start:'s0',scenes:{s0:{
 text:'침대에 누웠지만 잠이 오지 않는다.',choices:[
 {t:'바구니 이야기를 꺼내본다',same:{text:'둘은 자신들이 어디서 왔는지 밤새 이야기했다.',fx:{rel:8,stress:-10}}},
 {t:'{펫}의 등에 기대어 잔다',same:{text:'{펫}의 숨소리가 자장가가 되었다.',fx:{pet:5,stress:-15}}}],
 diff:{text:'한 명은 말을 걸었고 한 명은 이미 잠든 척했다.',fx:{rel:-2,stress:5}}}}}
,{id:'rainnight',title:'빗소리',joint:true,tags:['evening'],weather:'비',start:'s0',scenes:{s0:{
 text:'창밖에서 굵은 빗소리가 들린다.',choices:[
 {t:'창가에서 빗소리를 듣는다',same:{text:'둘은 오랫동안 말없이 창밖을 바라보았다.',fx:{rel:4,stress:-10}}},
 {t:'물이 새는 곳을 점검한다',same:{text:'함께 물받이를 놓고 저택의 구멍을 막았다.',fx:{rel:3,stat:{hand:1},room:{auto:1}}}}],
 diff:{text:'한 명은 창가에, 한 명은 양동이를 들고 있었다.',fx:{rel:0}}}}}
,{id:'winter',title:'겨울 난방',joint:true,tags:['evening'],season:[3],start:'s0',scenes:{s0:{
 text:'장작이 부족하다. 밤새 어떻게 버틸까?',choices:[
 {t:'장작을 사러 나간다',same:{text:'꽁꽁 언 시장에서 장작을 사 왔다.',fx:{money:-20,rel:3,stress:5}}},
 {t:'담요를 모아 {펫}에게 기댄다',same:{text:'셋이 담요 속에서 뭉쳐 따뜻한 밤을 보냈다.',fx:{pet:6,rel:5,stress:-10}}}],
 diff:{text:'한 명은 나갔고 한 명은 남았다. 나간 쪽이 더 춥게 보냈다.',fx:{hp:-10,rel:-2}}}}}
,{id:'lostitem',title:'수달의 유실물',joint:true,tags:['evening'],ch:[2,5],start:'s0',scenes:{s0:{
 text:'낮에 건진 반짝이는 장신구가 식탁 위에 놓여 있다.',choices:[
 {t:'내다 팔자',same:{text:'시장에 팔아 용돈을 벌었다.',fx:{money:60}}},
 {t:'우리가 간직하자',same:{text:'장신구를 서랍 속에 소중히 넣어두었다. 둘만의 비밀이다.',fx:{rel:7,flag:'keepsake'}}}],
 diff:{text:'의견이 엇갈려 장신구는 식탁 위에 그대로 남았다.',fx:{rel:-3}}}}}

// ── 협동 판정 저녁 사건 (같은 선택 + check → 각자 굴려 높은 쪽 채택. 펫 보조 자동 적용) ──
,{id:'leak',title:'새는 천장',joint:true,tags:['evening'],weather:'비',start:'s0',scenes:{s0:{
 text:'서재 천장에서 물이 새기 시작했다. 밤새 두면 책이 다 젖는다.',choices:[
 {t:'함께 널빤지를 덧댄다',check:{stat:'hand',dc:11},ok:{text:'둘이 힘을 모아 구멍을 막았다. 뿌듯한 밤이다.',fx:{rel:6,room:{auto:1},stat:{hand:1}}},fail:{text:'물이 계속 샜다. 양동이로 밤을 새웠다.',fx:{rel:1,stress:15,hp:-10}}},
 {t:'양동이로 받고 내일 고치자',same:{text:'양동이를 놓고 잠들었다. 소리는 자장가가 되었다.',fx:{stress:-5}}}],
 diff:{text:'한 명은 널빤지를, 한 명은 양동이를 들고 서로를 쳐다봤다.',fx:{rel:-1,stress:5}}}}}
,{id:'thief',title:'사라진 수프',joint:true,tags:['evening'],when:s=>s.pet.pers==='glutton',start:'s0',scenes:{s0:{
 text:'식탁 위 수프 냄비가 텅 비어 있다. {펫}이(가) 입가를 핥으며 시치미를 뗀다.',choices:[
 {t:'따끔하게 혼낸다',same:{text:'{펫}이(가) 시무룩해졌지만 다시는 안 그러겠다는 눈빛이다.',fx:{pet:-2,stress:-3}}},
 {t:'웃어넘긴다',same:{text:'{펫}의 꼬리가 신나게 흔들렸다.',fx:{pet:4,rel:2,stress:-10}}}],
 diff:{text:'한 명은 화를 내고 한 명은 웃었다. {펫}이(가) 눈치를 살폈다.',fx:{pet:0,rel:-1}}}}}
,{id:'guest',title:'낯선 손님',joint:true,tags:['evening'],when:s=>s.pet.pers==='timid',start:'s0',scenes:{s0:{
 text:'낯선 방문객의 목소리에 {펫}이(가) 침대 밑으로 숨어버렸다.',choices:[
 {t:'함께 달래러 간다',check:{stat:'emp',dc:10},ok:{text:'{펫}이(가) 천천히 나와 두 사람의 손에 코를 비볐다.',fx:{pet:8,rel:4}},fail:{text:'{펫}이(가) 더 깊이 숨었다. 밤새 낑낑댔다.',fx:{pet:-2,stress:10}}},
 {t:'혼자 두고 손님을 맞는다',same:{text:'손님은 곧 돌아갔고, {펫}은(는) 스스로 나왔다.',fx:{pet:1}}}],
 diff:{text:'한 명이 달래러 가고 한 명이 문을 열었다. 어수선한 저녁이었다.',fx:{rel:0,stress:5}}}}}

// ── 🎭 둘만의 장면 (free:true) — 판정 없이 채팅에서 자유롭게 역극, 끝에 분위기 선택.
//    text/t 를 5개짜리 배열로 쓰면 관계 단계(소원함·어색함·친함·신뢰·깊은 유대)별로 달라짐 ──
,{id:'talk',title:'서재의 밤 이야기',joint:true,free:true,tags:['together','evening'],start:'s0',scenes:{s0:{
 text:['서재에 단둘이 남았다. 서로 눈을 마주치기가 어렵다.','촛불 아래 서재. 어색한 침묵이 흐른다.','촛불 아래 서재. 편안한 침묵 속에 이야기가 이어진다.','촛불 아래 서재. 어떤 말이든 꺼낼 수 있을 것 같다.','촛불 아래 서재. 말하지 않아도 마음이 전해지는 밤이다.'],
 choices:[
 {t:'진지하고 솔직한 분위기로 마무리',same:{text:['짧은 몇 마디였지만 큰 진전이다.','조심스러운 고백이 오갔다.','속마음을 털어놓자 마음이 한결 가벼워졌다.','서로의 두려움을 처음으로 이야기했다.','밤새 이어진 이야기 끝에, 더는 혼자가 아니라고 느꼈다.'],fx:{rel:6,stress:-10}}},
 {t:'장난스럽고 가벼운 분위기로 마무리',same:{text:['웃음이 어색함을 조금 풀어주었다.','서툰 농담에 겨우 웃음이 터졌다.','시시콜콜한 농담에 배꼽을 잡았다.','서로의 흉내를 내며 한참을 웃었다.','눈만 마주쳐도 웃음이 터지는 밤이었다.'],fx:{rel:4,stress:-15}}}],
 diff:{text:'한 명은 진지했고 한 명은 웃어넘기려 했다. 분위기가 어긋났다.',fx:{rel:-2,stress:5}}}}}
,{id:'canalwalk',title:'운하 산책',joint:true,free:true,tags:['together','evening'],start:'s0',scenes:{s0:{
 text:'저물녘 운하를 따라 걷는다. 수면에 등불이 하나둘 켜진다. (자유롭게 역극하세요)',
 choices:[
 {t:'조용히 걷다 돌아온다',same:{text:'말없이 걸었지만 발걸음은 같은 박자였다.',fx:{rel:4,stress:-10}}},
 {t:'{펫}과(와) 함께 뛰어다닌다',same:{text:'물보라를 일으키며 셋이 한참을 뛰었다.',fx:{rel:3,pet:4,stress:-15}}}],
 diff:{text:'한 명은 천천히, 한 명은 앞서 달렸다. 서로를 기다리느라 산책이 길어졌다.',fx:{rel:0}}}}}
,{id:'secret',title:'둘만의 비밀',joint:true,free:true,tags:['together'],when:s=>s.rel>=50,start:'s0',scenes:{s0:{
 text:['','','다락 구석에 앉아 {나}이(가) 말을 꺼낸다. "사실… 아무에게도 말 못 한 게 있어."','{나}이(가) 오래 숨겨온 이야기를 털어놓으려 한다.','{나}이(가) 눈을 감고 오래 품어온 비밀을 꺼낸다. 이 사람이라면 괜찮다.'],
 choices:[
 {t:'끝까지 들어주며 마무리',same:{text:'비밀은 둘만의 것이 되었다.',fx:{rel:10,stress:-15,flag:'shared_secret'}}},
 {t:'서로 아직은 말하지 못하고 마무리',same:{text:'말은 삼켰지만 기다려주겠다는 마음은 전해졌다.',fx:{rel:3,stress:-5}}}],
 diff:{text:'한 명은 털어놓으려 했고, 한 명은 아직 준비가 되지 않았다. 어색한 침묵이 흘렀다.',fx:{rel:-2,stress:8}}}}}
,{id:'estranged',title:'서먹한 저녁',joint:true,free:true,tags:['together','evening'],when:s=>s.rel<40,start:'s0',scenes:{s0:{
 text:['식탁 위에 침묵이 내려앉았다. 누가 먼저 입을 열까?','요즘 둘 사이가 서먹하다. 오늘은 무슨 말이든 해볼까?'],
 choices:[
 {t:'먼저 다가가 사과하는 분위기로 마무리',same:{text:'어색하지만 진심이 담긴 한마디가 얼음을 깼다.',fx:{rel:10,stress:-10}}},
 {t:'각자 시간을 갖는 분위기로 마무리',same:{text:'거리를 두기로 했지만 문은 닫히지 않았다.',fx:{rel:1,stress:-5}}}],
 diff:{text:'한 명은 손을 내밀었고 한 명은 등을 돌렸다. 마음이 쓰라렸다.',fx:{rel:-4,stress:12}}}}}
];

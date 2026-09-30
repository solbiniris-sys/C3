// tags로 시나리오 풀과 연결. fx.pet / fx.npc 사용 가능
DATA.activities=[
 {id:'repair',name:'저택 보수',icon:'🛠',loc:'manor',cost:{hp:15,stress:10},fx:{stat:{str:1},room:{auto:1}},tags:['manor'],evt:.35,texts:['{나}이(가) 무너진 벽돌을 다시 쌓았다.']},
 {id:'study',name:'서재 탐색',icon:'📖',loc:'manor',cost:{hp:10,stress:5},fx:{stat:{int:1}},tags:['manor','study'],evt:.35,texts:['{나}이(가) 옛 가문의 기록을 읽었다.']},
 {id:'cook',name:'요리',icon:'🍲',loc:'manor',cost:{hp:10,stress:-10},fx:{stat:{hand:1},item:{'수프':1}},tags:['manor','pet'],evt:.2,texts:['{나}이(가) 부엌에서 수프를 끓였다.']},
 {id:'market',name:'시장 방문',icon:'💰',loc:'market',cost:{hp:15,stress:0},fx:{money:30,stat:{charm:1}},tags:['market'],evt:.4,texts:['{나}이(가) 배 위 상인들과 흥정했다.']},
 {id:'stroll',name:'광장 산책',icon:'⛲',loc:'square',cost:{hp:10,stress:-10},fx:{stat:{obs:1}},tags:['town','market'],evt:.45,texts:['{나}이(가) 젖은 돌바닥 광장을 거닐었다.']},
 {id:'boat',name:'곤돌라 타기',icon:'🌉',loc:'canal',cost:{hp:10,stress:-10},fx:{money:-10,npc:{boatman:2}},tags:['canal','town'],evt:.45,texts:['{나}이(가) 곤돌라를 타고 운하를 건넜다.']},
 {id:'fish',name:'낚시',icon:'🎣',loc:'pier',cost:{hp:15,stress:-5},fx:{},tags:['pier'],evt:.25,loot:[['녹슨 회중시계',15],['은빛송어',35],['보따리게',25],['유리뱀장어',10],['수달의 유실물',15]],texts:['{나}이(가) 선착장에서 낚싯줄을 드리웠다.']},
 {id:'dive',name:'잠수 수색',icon:'🤿',loc:'under',cost:{hp:20,stress:5},fx:{stat:{agi:1}},tags:['under'],evt:.5,loot:[['수달의 유실물',20],['벽돌이끼',25],['조개 편지',15],['오래된 은수저',5],['녹슨 회중시계',35]],texts:['{나}이(가) {펫}의 도움으로 수중 통로를 탐색했다.']},
 {id:'school',name:'수중 학교 수업',icon:'🏫',loc:'school',cost:{hp:15,stress:10},fx:{stat:{int:1,will:1},npc:{teacher:2}},tags:['school'],evt:.5,texts:['{나}이(가) 물빛 어른대는 교실에서 수업을 들었다.']},
 {id:'ride',name:'펫과 유영',icon:'🐾',loc:'under',cost:{hp:10,stress:-15},fx:{pet:3,stat:{agi:1}},tags:['pet','under'],evt:.3,texts:['{나}이(가) {펫}의 등을 타고 물길을 가로질렀다.']},
 {id:'job',name:'잡일 알바',icon:'📦',loc:'market',cost:{hp:20,stress:10},fx:{money:50},tags:['market','pier'],evt:.3,texts:['{나}이(가) 짐 나르는 일을 도와 품삯을 받았다.']},
 {id:'together',name:'함께 시간 보내기',icon:'💞',loc:'manor',cost:{hp:5,stress:-10},fx:{rel:2},tags:['together'],evt:1,texts:['{나}이(가) {상대}에게 다가갔다.']},
 {id:'rest',name:'휴식',icon:'💤',loc:'manor',cost:{hp:-40,stress:-30},fx:{pet:1},tags:[],evt:0,texts:['{펫}이(가) 꼬리로 {나}을(를) 감싸 안았다.']}
];

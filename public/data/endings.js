// 스탯이 아니라 '무엇을 했는가'(플래그·수리한 방·활동 횟수·관계)로 엔딩 결정. 위에서부터 첫 참이 채택.
const rooms=S=>Object.keys(S.flags).filter(k=>k.startsWith('room_')).length,cnt=(S,k)=>(S.count||{})[k]||0;
DATA.endings=[
 {id:'origin',name:'바구니의 진실',check:S=>S.flags.know_origin&&S.flags.sister_met&&S.rel>=60,text:'뿌리를 알게 된 아이들은 서로의 손을 잡고 새 물길로 나아간다.'},
 {id:'restored',name:'다시 사람이 사는 집',check:S=>rooms(S)>=5&&S.flags.deed,text:'모든 방에 불이 켜졌다. 저택은 다시 이름 있는 가문의 집이 되었다.'},
 {id:'bond',name:'{펫}의 등 위에서',check:S=>S.pet.bond>=85&&cnt(S,'ride')>=5,text:'{펫}과(와) 수많은 물길을 함께 달린 아이들은, 그 등 위에서 바다를 향한다.'},
 {id:'cub',name:'물가의 작은 가족',check:S=>S.flags.cub&&S.pet.bond>=60,text:'저택 안뜰에는 어린 수달이 뛰놀고, 두 아이는 그 곁에 남기로 했다.'},
 {id:'waterway',name:'옛 수로의 지도',check:S=>S.flags.waterway_found&&cnt(S,'dive')>=6,text:'지하 수로 끝에서 두 사람은 옛 도시의 지도를 완성했다.'},
 {id:'market',name:'수상 상단',check:S=>(S.npc.vendor||0)>=40&&cnt(S,'market')>=6&&S.money>=800,text:'마르타의 이름으로 두 사람은 수상 시장에 자기 배를 띄웠다.'},
 {id:'school',name:'물빛 교실의 교사',check:S=>(S.npc.teacher||0)>=30&&cnt(S,'school')>=6,text:'세이라의 뒤를 이어, 한 아이는 수중 학교 교단에 선다.'},
 {id:'apart',name:'갈라진 물길',check:S=>S.rel<25,text:'두 사람은 각자의 물길로 흩어졌다. 저택엔 {펫}만 남았다.'},
 {id:'default',name:'물안개 너머로',check:()=>true,text:'아이들은 훌륭하게 자라, {펫}에게 인사하고 저택을 나선다.'}
];

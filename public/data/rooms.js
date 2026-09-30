// 저택 방: need=수리에 필요한 '수리' 활동 횟수, unlock=필요한 플래그(방 수리 완료 시 room_방id 플래그 생성)
DATA.rooms=[
 {id:'living',name:'거실',need:2},
 {id:'kitchen',name:'주방',need:2},
 {id:'study',name:'서재',need:3},
 {id:'basement',name:'지하 저장고',need:3,unlock:'room_kitchen'},
 {id:'attic',name:'다락',need:4,unlock:'room_study'},
 {id:'waterway',name:'지하 수로',need:4,unlock:'waterway_found'}
];

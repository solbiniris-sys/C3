// NPC 추가: id → 시나리오 fx:{npc:{id:+n}} / req:{npc:['id',n]} 로 호감도 연동
DATA.traits=['호기심','신중함','낙천적','조용함','고집','다정함','장난기','몽상가','꼼꼼함','독립적','사교적','손재주','직감','협상가','겁많음','책벌레'];
DATA.npcs={
 keeper:{name:'오르빈',role:'선착장 지기',desc:'말수 적은 노인. 저택의 옛 주인을 안다.'},
 vendor:{name:'마르타',role:'수상 시장 상인',desc:'수다스러운 고물 장수.'},
 teacher:{name:'세이라',role:'수중 학교 교사',desc:'엄격하지만 아이들을 잊지 않는다.'},
 doctor:{name:'하렌',role:'동네 의사',desc:'변이동물 진료까지 보는 피곤한 의사.'},
 boatman:{name:'티모',role:'곤돌라 소년',desc:'또래 뱃사공. 소문에 밝다.'},
 sister:{name:'고아원 수녀',role:'옛 보호자',desc:'두 아이를 찾고 있을지도 모른다.'}
};
// 선물 취향 (likes에 든 아이템은 호감 두 배)
Object.assign(DATA.npcs.keeper,{likes:['은빛송어','오래된 은수저']});
Object.assign(DATA.npcs.vendor,{likes:['수국','보따리게']});
Object.assign(DATA.npcs.teacher,{likes:['조개 편지','바다포도']});
Object.assign(DATA.npcs.doctor,{likes:['수프','달빛해초']});
Object.assign(DATA.npcs.boatman,{likes:['유리뱀장어','은빛송어']});
Object.assign(DATA.npcs.sister,{likes:['수국','물토마토']});

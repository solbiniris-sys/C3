(() => {
// ==========================================
// WATERLINE: 2-PLAYER CO-OP RP SANDBOX
// (Cocoforia + Princess Maker + Stardew Valley + TRPG)
// ==========================================

const DEFAULT_IMG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiPj88L3RleHQ+PC9zdmc+";

// 계절 & 조석(Tide) 시스템 (세계관 독창적 규칙)
const SEASONS = ['🌸 물안개의 봄', '☀️ 수위가 높은 여름', '🍂 서늘한 바람의 가을', '❄️ 수면이 어는 겨울'];
const TIDES = ['🌊 만조 (수위 상승: 낚시/채집 보너스)', '🪨 간조 (수위 하락: 유적 탐사 보너스)'];

// 농사 작물 데이터 (세계관 반영)
const SEEDS = {
    '은빛 산소초': { cost: 15, time: 2, crop: '은빛 산소초', sell: 30, healHp: 10, healStr: 10, desc: '잠수 시 산소를 공급해주는 신비한 해초. (2턴)' },
    '동굴당근': { cost: 20, time: 3, crop: '동굴당근', sell: 45, healHp: 15, healStr: 15, desc: '햇빛 없이 습기로 자라는 붉은 당근. (3턴)' },
    '물수국': { cost: 40, time: 5, crop: '물수국', sell: 100, healHp: 20, healStr: 40, desc: '스트레스(수몰병) 치료에 탁월한 꽃. (5턴)' },
    '아스터의 눈물': { cost: 80, time: 8, crop: '마력 결정', sell: 250, healHp: 50, healStr: 50, desc: '고대 엔진의 마력을 먹고 자라는 결정. (8턴)' }
};

// 낚시 물고기 데이터
const FISH_DB = [
    { name: '낡은 나침반', sell: 5, chance: 15, healHp: 0, healStr: 5, msg: '작동하지 않는 고대의 나침반이다.' },
    { name: '피라미', sell: 10, chance: 35, healHp: 5, healStr: 5, msg: '팔딱거리는 피라미! 저녁 반찬이다.' },
    { name: '은빛송어', sell: 25, chance: 25, healHp: 15, healStr: 10, msg: '반짝거리는 은빛 송어를 낚았다!' },
    { name: '변이꽃게', sell: 50, chance: 15, healHp: 25, healStr: 15, msg: '집게발이 흉포한 변이 꽃게를 잡았다.' },
    { name: '유령해파리', sell: 80, chance: 7, healHp: 10, healStr: 40, msg: '투명하고 아름다운 해파리... 마음이 편안해진다.' },
    { name: '전설의 수룡', sell: 300, chance: 3, healHp: 100, healStr: 100, msg: '우와아악!! 전설 속에 나오던 수룡의 새끼를 낚았어!!' }
];

// TRPG 몬스터 도감
const ENEMIES = [
    { name: '오염된 톱니거북', hp: 60, atk: 12, ac: 10, reward: 35, desc: '단단한 등껍질을 가진 거대한 돌연변이 거북입니다.' },
    { name: '심해의 그림자', hp: 55, atk: 18, ac: 12, reward: 45, desc: '물안개 속에서 일렁이는 미지의 촉수 괴수입니다.' },
    { name: '고대 기계 파수꾼', hp: 100, atk: 22, ac: 14, reward: 90, desc: '수몰 이전 도시를 지키던 낡은 수중 골렘입니다.' },
    { name: '심연의 포식자', hp: 150, atk: 28, ac: 16, reward: 250, desc: '수로 가장 깊은 곳에서 눈을 뜬 거대한 재앙입니다!' }
];

// 상점 아이템
const SHOP_ITEMS = [
    { id: 'oxygen_tank', name: '고대 산소통', price: 60, desc: '수몰병(스트레스)을 치료합니다. (스트레스 -50)', type: 'stress', val: -50 },
    { id: 'book', name: '방수된 고서', price: 70, desc: '고대 지식이 담긴 책입니다. (지력 +25)', type: 'int', val: 25 },
    { id: 'perfume', name: '물안개 향수', price: 70, desc: '매혹적인 향기가 납니다. (매력 +25)', type: 'charm', val: 25 },
    { id: 'sword', name: '사공의 작살', price: 80, desc: '전투용으로 개조된 작살입니다. (체력 +30)', type: 'hp', val: 30 },
    { id: 'ring', name: '수국 은반지', price: 100, desc: '둘이 함께 나누어 낍니다. (유대감 대폭 상승)', type: 'rel', val: 30 }
];

let S = null;
let roomCodeInput = "water_coop_01";
let tempSetup = {
    names: { a: '', b: '', pet: '', sys: '시스템' },
    images: { a: DEFAULT_IMG, b: DEFAULT_IMG, pet: DEFAULT_IMG, sys: DEFAULT_IMG }
};

// --- 공통 유틸리티 ---
function getSaveKey() { return `waterline_room_${S ? S.roomCode : roomCodeInput}`; }
function save() { if (S) localStorage.setItem(getSaveKey(), JSON.stringify(S)); }
function load(code) {
    try { const data = localStorage.getItem(`waterline_room_${code}`); return data ? JSON.parse(data) : null; } 
    catch (e) { return null; }
}

function initState(code) {
    return {
        roomCode: code,
        month: 1, turn: 0, tide: 0, // 0: 만조, 1: 간조
        money: 100, // 초기 자금
        names: { ...tempSetup.names, sys: '시스템(GM)' },
        images: { ...tempSetup.images },
        stats: {
            a: { hp: 50, int: 50, charm: 50, stress: 0, rel: 50, sick: false },
            b: { hp: 50, int: 50, charm: 50, stress: 0, rel: 50, sick: false }
        },
        farm: [null, null, null, null],
        items: {}, 
        logs: [],
        combat: null,
        gameOver: false
    };
}

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function clamp(n) { return Math.max(0, Math.min(999, n)); }
function getSeason() { return SEASONS[Math.floor((S.month - 1) / 3) % 4]; }
function rollDice(sides) { return Math.floor(Math.random() * sides) + 1; }

// --- TRPG 롤플레잉 로그 시스템 ---
function addLog(speakerKey, text, isTrpg = false) {
    const name = S.names[speakerKey] || speakerKey;
    const img = S.images[speakerKey] || DEFAULT_IMG;
    S.logs.push({ name, img, text, isTrpg });
}

window.handleImageUpload = function(event, key) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        tempSetup.images[key] = e.target.result;
        const preview = document.getElementById(`preview-${key}`);
        if(preview) preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.loadRoom = function() {
    const code = document.getElementById('roomCode').value.trim();
    if (!code) { alert('방 코드를 입력해주세요.'); return; }
    roomCodeInput = code;
    const loaded = load(code);
    if (loaded) { 
        S = loaded; 
        if(!S.farm) S.farm = [null, null, null, null]; 
        if(!S.items) S.items = {};
        if(S.tide === undefined) S.tide = 0;
        if(S.combat === undefined) S.combat = null;
        render(); 
    } else { alert('해당 코드로 저장된 데이터가 없습니다.'); }
};

window.startNewRoom = function() {
    const code = document.getElementById('roomCode').value.trim();
    if (!code) { alert('방 코드를 입력해주세요.'); return; }
    roomCodeInput = code;
    tempSetup.names.a = document.getElementById('na').value.trim() || 'Player 1';
    tempSetup.names.b = document.getElementById('nb').value.trim() || 'Player 2';
    tempSetup.names.pet = document.getElementById('np').value.trim() || '보호자(짐승)';
    
    S = initState(code);
    addLog('sys', `[방 코드: ${code}] 주사위와 농사, 그리고 두 사람의 유대가 빛나는 수몰 도시 생존기가 시작되었습니다.`);
    save(); render();
};

function setupView() {
    document.getElementById('app').innerHTML = `
    <main class="shell" style="max-width: 850px;">
        <section class="paper setup">
            <div class="sub">WATERLINE · 2-Player CO-OP TRPG & Farming</div>
            <h1 style="font-size:28px;">수면 아래 완벽한 방주,<br>짐승이 품은 두 아이.</h1>
            <p class="lead" style="font-size:0.95rem;"><b>2인 1조 생명줄 시스템</b>과 <b>조석(Tide) 현상</b>이 추가되었습니다.<br>서로의 턴을 공유하는 '합동 스케줄'로 유대감을 쌓고, TRPG 턴제 전투에서 서로를 지켜내세요.</p>
            
            <div class="field full" style="background:#eef0e5; border:1px solid #b7cec7;">
                <label>세션 방 코드 (자동 저장 및 불러오기 가능)</label>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <input id="roomCode" placeholder="예: trpg_coop_01" value="${roomCodeInput}" style="flex:1;">
                    <button class="secondary" onclick="loadRoom()">이어하기 (불러오기)</button>
                </div>
            </div>

            <div class="formgrid">
                <div class="field full">
                    <h3 style="margin:0 0 15px 0; border-bottom:1px solid #ccc; padding-bottom:5px;">캐릭터 설정 및 프로필 이미지 첨부 (TRPG 토큰용)</h3>
                    ${characterSetupHtml('a', '첫 번째 아이 (Player 1)')}
                    ${characterSetupHtml('b', '두 번째 아이 (Player 2)')}
                    ${characterSetupHtml('pet', '거대동물 (수호자)')}
                    ${characterSetupHtml('sys', '시스템 / 게임마스터(GM)', true)}
                </div>
            </div>
            <button class="primary start" onclick="startNewRoom()" style="margin-top: 20px; width:100%; font-size:1.1rem;">생명줄 묶고 이야기 시작하기</button>
        </section>
    </main>`;
}

function characterSetupHtml(key, label, hideNameInput = false) {
    return `
    <div style="display:flex; gap:15px; align-items:center; margin-bottom:20px; background:#fffdf8; padding:10px; border-radius:8px; border:1px solid #e5dece;">
        <img id="preview-${key}" src="${tempSetup.images[key]}" style="width:60px; height:60px; border-radius:8px; object-fit:cover; border:1px solid #ccc;">
        <div style="flex:1;">
            <label style="font-size:0.9rem; font-weight:bold; color:#17332f;">${label}</label>
            ${hideNameInput ? '' : `<input id="n${key}" maxlength="12" placeholder="캐릭터 이름 입력" style="margin-top:5px; padding:6px; width:100%; box-sizing:border-box;">`}
            <input type="file" accept="image/*" onchange="handleImageUpload(event, '${key}')" style="margin-top:8px; font-size:0.8rem; width:100%;">
        </div>
    </div>`;
}

// --- 턴 및 상태 이상 시스템 (수몰병) ---
function endTurn(turnsConsumed = 1) {
    S.turn += turnsConsumed;
    
    // 작물 성장
    S.farm.forEach(f => { if (f && f.remain > 0) f.remain -= turnsConsumed; });

    if (S.turn >= 4) { 
        S.month++; S.turn = 0;
        S.tide = S.month % 2; // 달마다 만조/간조 교체
        const newSeason = getSeason();
        const tideText = TIDES[S.tide];
        
        addLog('sys', `--- 🗓️ ${S.month}개월 차 (${newSeason}) 가 밝았습니다 ---`);
        addLog('sys', `🌊 이번 달의 조류: ${tideText}`);
        
        if (S.month > 24) { S.gameOver = true; evaluateEnding(); }
    }
    save(); render();
}

function checkStress(targetKey) {
    const st = S.stats[targetKey];
    if (st.stress >= 100 && !st.sick) {
        st.sick = true;
        addLog('sys', `⚠️ [수몰병 발병] ${S.names[targetKey]}이(가) 극심한 스트레스로 인해 '수몰병(심해의 환각)'에 걸렸습니다!`);
        addLog(targetKey, `숨이... 막혀. 주변에 물이 가득 차오르는 것 같아...!`);
        return true;
    }
    return false;
}

// --- 스케줄 시스템 (개별 & 합동) ---
window.doSchedule = function(targetKey, actionType) {
    if (S.gameOver || S.combat) return;
    
    // 수몰병(Sick) 상태면 행동 불가
    if (S.stats[targetKey].sick && actionType !== '휴식') {
        alert(`${S.names[targetKey]}는 수몰병에 걸려 앓고 있습니다. '휴식'을 취하거나 상점의 '고대 산소통'이 필요합니다.`);
        return;
    }

    const st = S.stats[targetKey];
    const tName = S.names[targetKey];
    let logText = "";
    
    if (actionType === '수중탐험') {
        if (Math.random() < 0.3) { startCombat(targetKey); return; } // TRPG 전투 발생
        st.hp += 10; st.stress += 15;
        logText = `수중 구역을 탐험하며 체력을 단련했습니다. (체력 +10, 스트레스 +15)`;
        addLog(targetKey, `물살을 가르는 건 꽤 힘들어. 하지만 강해진 기분이야.`);
    } else if (actionType === '기록관공부') {
        st.int += 10; st.stress += 15;
        logText = `기록관에서 고대의 마법진을 해독했습니다. (지력 +10, 스트레스 +15)`;
        addLog(targetKey, `이 문자는 이런 뜻이었구나! 눈은 아프지만 뿌듯해.`);
    } else if (actionType === '시장알바') {
        st.charm += 5; S.money += 25; st.stress += 15;
        logText = `시장에서 사람들을 응대하며 돈을 벌었습니다. (매력 +5, 가문 재화 +25, 스트레스 +15)`;
        addLog(targetKey, `어서 오세요! 신선한 물건 보고 가세요!`);
    } else if (actionType === '선착장낚시') {
        // 만조일 때 낚시 보너스
        let chanceBonus = S.tide === 0 ? 10 : 0; 
        st.hp += 3; st.stress -= 10; 
        const roll = Math.random() * 100 - chanceBonus;
        let caught = FISH_DB[0];
        let cumulative = 0;
        for (let f of FISH_DB) {
            cumulative += f.chance;
            if (roll <= cumulative) { caught = f; break; }
        }
        S.items[caught.name] = (S.items[caught.name] || 0) + 1;
        logText = `낚시를 즐겼습니다. 🎣 [${caught.name}] 획득! (스트레스 -10)`;
        addLog(targetKey, caught.msg);
    } else if (actionType === '휴식') {
        st.stress = Math.max(0, st.stress - 40); S.money -= 10;
        if (st.sick && st.stress < 50) {
            st.sick = false; // 스트레스가 50 이하로 떨어지면 병 완치
            addLog('sys', `✨ ${tName}의 수몰병이 호전되었습니다!`);
            addLog(targetKey, `이제 숨쉬기가 한결 편해졌어... 고마워.`);
        } else {
            addLog('pet', `(부드러운 숨소리를 내며 ${tName}의 이불을 덮어줍니다.)`);
        }
        logText = `거대동물의 곁에서 푹 쉬었습니다. (스트레스 대폭 감소, 재화 -10)`;
    }

    addLog('sys', `[개별 스케줄] ${logText}`);
    checkStress(targetKey);
    endTurn(1);
};

// 🤝 2인 합동 스케줄 (턴 2개 소모)
window.doCoopSchedule = function(actionType) {
    if (S.gameOver || S.combat) return;
    if (S.turn > 2) { alert('합동 스케줄은 남은 행동력이 2 이상일 때만 가능합니다.'); return; }
    if (S.stats.a.sick || S.stats.b.sick) { alert('수몰병에 걸린 사람이 있어 합동 행동이 불가능합니다.'); return; }

    let logText = "";
    
    if (actionType === '심해잠수') {
        // 간조일 때 탐사 보너스
        let exploreBonus = S.tide === 1 ? 2 : 1; 
        if (Math.random() < 0.4) { startCombat('a'); return; } // 전투 발생률 높음
        
        S.stats.a.hp += 15; S.stats.b.hp += 15; 
        S.stats.a.stress += 20; S.stats.b.stress += 20;
        S.stats.a.rel += 10; S.stats.b.rel += 10;
        S.money += (30 * exploreBonus);
        
        logText = `생명줄을 묶고 심해 유적을 공동 탐사했습니다! (양쪽 체력 +15, 스트레스 +20, 유대감 +10, 재화 +${30*exploreBonus})`;
        addLog('a', `내가 먼저 내려갈게, 위에서 줄을 잘 잡아줘!`);
        addLog('b', `걱정 마, 내 손은 절대 안 놓칠 테니까!`);
    } else if (actionType === '밤샘해독') {
        S.stats.a.int += 15; S.stats.b.int += 15; 
        S.stats.a.stress += 20; S.stats.b.stress += 20;
        S.stats.a.rel += 10; S.stats.b.rel += 10;
        logText = `등을 맞대고 고문서를 밤샘 해독했습니다. (양쪽 지력 +15, 스트레스 +20, 유대감 +10)`;
        addLog('a', `이 문단 해석 좀 도와줄래? 너무 복잡해.`);
        addLog('b', `아, 그건 고대 수어문법이야. 이렇게 풀면 돼.`);
    } else if (actionType === '함께휴식') {
        if (S.money < 20) { alert('가문 재화가 부족합니다 (20G 필요).'); return; }
        S.money -= 20;
        S.stats.a.stress = Math.max(0, S.stats.a.stress - 50); S.stats.b.stress = Math.max(0, S.stats.b.stress - 50);
        S.stats.a.rel += 20; S.stats.b.rel += 20;
        logText = `맛있는 것을 나눠 먹으며 깊은 대화를 나눴습니다. (양쪽 스트레스 -50, 유대감 +20, 재화 -20)`;
        addLog('a', `우리 진짜 최고의 팀인 것 같아. 안 그래?`);
        addLog('b', `당연하지. 앞으로도 계속 내 등 뒤를 부탁해!`);
    }

    addLog('sys', `[🤝 합동 스케줄 완료] ${logText}`);
    checkStress('a'); checkStress('b');
    endTurn(2); // 턴 2개 소모
};

// --- TRPG 2인 협력 전투 시스템 ---
window.startCombat = function(finderKey) {
    const enemyTmpl = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
    S.combat = {
        name: enemyTmpl.name,
        hp: enemyTmpl.hp, maxHp: enemyTmpl.hp,
        atk: enemyTmpl.atk, ac: enemyTmpl.ac,
        reward: enemyTmpl.reward, desc: enemyTmpl.desc,
        aggro: finderKey // 적이 현재 타겟팅하는 대상
    };
    addLog('sys', `⚠️ [전투 발생] 탐험 중 괴물과 조우했습니다! 생명줄을 당겨 서로를 도우세요.`, true);
    save(); render();
};

window.doCombatAction = function(actorKey, actionType) {
    const st = S.stats[actorKey];
    const enemy = S.combat;
    const partnerKey = actorKey === 'a' ? 'b' : 'a';
    
    let d20 = rollDice(20);
    let logText = ""; let dmg = 0;

    // 공격 판정
    if (actionType === '물리') {
        const mod = Math.floor(st.hp / 10);
        const total = d20 + mod;
        if (d20 === 20) { 
            dmg = rollDice(6) + rollDice(6) + mod + 15;
            logText = `⚔️ [물리 공격] 🎲대성공(20)! ${enemy.name}에게 ${dmg}의 엄청난 피해!`;
        } else if (total >= enemy.ac) {
            dmg = rollDice(6) + mod + 5;
            logText = `⚔️️ [물리 공격] (🎲${d20}+${mod}=${total}) 명중! ${dmg}의 피해.`;
        } else {
            logText = `⚔️ [물리 공격] (🎲${d20}+${mod}=${total}) 빗나갔습니다!`;
        }
    } else if (actionType === '전술') {
        const mod = Math.floor(st.int / 10);
        const total = d20 + mod;
        if (total >= (enemy.ac + 2)) { 
            dmg = rollDice(10) + mod + 20; 
            logText = `🔮 [전술 마법] (🎲${d20}+${mod}=${total}) 약점 간파! ${enemy.name}에게 ${dmg}의 치명적 마법 피해!`;
        } else {
            logText = `🔮 [전술 마법] (🎲${d20}+${mod}=${total}) 마법이 흩어졌습니다.`;
        }
    } else if (actionType === '협동마법') {
        // 유대(Rel) 스탯을 공격력 보정치로 사용하는 2인 합동기
        if (st.rel < 50) { alert("유대감이 50 이상이어야 사용 가능합니다."); return; }
        const mod = Math.floor(st.rel / 5);
        // 주사위 2개를 굴려 높은 값 적용 (Advantage)
        const d20_1 = rollDice(20); const d20_2 = rollDice(20);
        d20 = Math.max(d20_1, d20_2);
        const total = d20 + mod;
        
        if (total >= enemy.ac) {
            dmg = rollDice(12) + rollDice(12) + mod + 10;
            logText = `🤝 [유대: 합동 전술] (🎲Adv: ${d20}+${mod}=${total}) 두 사람의 완벽한 호흡! ${enemy.name}에게 ${dmg}의 파멸적 피해!!`;
        } else {
            logText = `🤝 [유대: 합동 전술] (🎲Adv: ${d20}+${mod}=${total}) 호흡이 어긋나 공격이 빗나갔습니다!`;
        }
    } else if (actionType === '감싸기') {
        // 적의 어그로를 자신에게 돌리고 파트너와의 유대감 상승
        enemy.aggro = actorKey;
        st.rel += 5; S.stats[partnerKey].rel += 5;
        logText = `🛡️ [보호] ${S.names[actorKey]}이(가) 앞을 가로막아 어그로를 끌었습니다! (유대감 상승)`;
        addLog(actorKey, `물러서! 이 녀석은 내가 맡을게!`, true);
    }

    enemy.hp -= dmg;
    if (actionType !== '감싸기') addLog(actorKey, logText, true);

    // 승패 판정
    if (enemy.hp <= 0) {
        S.money += enemy.reward;
        addLog('sys', `🎉 [전투 승리] ${enemy.name}을(를) 물리치고 ${enemy.reward}G를 얻었습니다!`, true);
        S.combat = null;
        endTurn(1); 
    } else {
        // 적의 반격 (어그로 대상에게)
        const targetKey = enemy.aggro;
        const enemyDmg = Math.max(1, enemy.atk + rollDice(6) - 5);
        const stressDmg = Math.floor(enemyDmg / 2);
        
        S.stats[targetKey].stress += stressDmg;
        S.stats[targetKey].hp = Math.max(0, S.stats[targetKey].hp - Math.floor(enemyDmg / 3));
        
        addLog('sys', `🩸 [반격] ${enemy.name}이(가) ${S.names[targetKey]}을(를) 타격! 스트레스 +${stressDmg}, 체력 감소!`, true);
        
        if (S.stats[targetKey].stress >= 100) {
             addLog('sys', `💀 [전투 패배] ${S.names[targetKey]}이(가) 공포를 견디지 못하고 기절했습니다! 황급히 철수합니다.`, true);
             S.combat = null;
             S.money = Math.max(0, S.money - 50); // 병원비
             S.stats[targetKey].stress = 60;
             S.stats[targetKey].sick = true;
             addLog('sys', `⚠️ [수몰병 발병] 극심한 공포 여파로 수몰병에 걸렸습니다.`);
             endTurn(1);
        }
    }
    save(); render();
};

window.fleeCombat = function() {
    addLog('sys', `🏃 [도주] 전투를 포기하고 도망쳤습니다. 도망치다 돈 15G를 흘렸습니다.`, true);
    S.money = Math.max(0, S.money - 15);
    S.combat = null;
    endTurn(1);
};

// --- 농사 및 상호작용 (스타듀밸리) ---
window.openSeedShop = function(slotIndex) {
    if (S.combat) return; 
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'seedModal';
    let html = `
        <div class="modal paper" style="background:#f4f0e6; max-width:400px;">
            <h3 style="font-family:'Gowun Batang'; font-size:20px; margin:0 0 10px 0; color:#2c7771;">🌱 수경 텃밭 씨앗 상점</h3>
            <p style="font-size:0.85rem; color:#555; margin-bottom:15px;">가문 재화: <b>${S.money}G</b><br>빈 텃밭에 심습니다. (턴 소모 없음)</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
    `;
    Object.keys(SEEDS).forEach(key => {
        const item = SEEDS[key]; const canBuy = S.money >= item.cost;
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px; border-radius:8px; border:1px solid #ccc;">
                <div>
                    <div style="font-weight:bold; color:#17332f;">${key} 씨앗 <span style="color:#d4af37; font-size:0.8rem;">(${item.cost}G)</span></div>
                    <div style="font-size:0.75rem; color:#666;">${item.desc}</div>
                </div>
                <button class="primary" style="padding:5px 10px; font-size:0.8rem; background:#2c7771; border:none;" ${canBuy ? `onclick="plantSeed(${slotIndex}, '${key}')"` : 'disabled'}>심기</button>
            </div>
        `;
    });
    html += `</div><button class="secondary" style="width:100%; margin-top:15px;" onclick="document.getElementById('seedModal').remove()">닫기</button></div>`;
    back.innerHTML = html; document.body.appendChild(back);
};

window.plantSeed = function(slotIndex, seedKey) {
    const seed = SEEDS[seedKey];
    if (S.money < seed.cost) return;
    S.money -= seed.cost;
    S.farm[slotIndex] = { key: seedKey, remain: seed.time, crop: seed.crop };
    addLog('sys', `[농사] 텃밭에 '${seedKey} 씨앗'을 심었습니다! (${seed.time}턴 후 수확)`);
    document.getElementById('seedModal').remove(); save(); render();
};

window.harvestCrop = function(slotIndex) {
    const cropData = S.farm[slotIndex];
    if (!cropData || cropData.remain > 0) return;
    const cropName = cropData.crop;
    S.items[cropName] = (S.items[cropName] || 0) + 1;
    S.farm[slotIndex] = null;
    addLog('sys', `[수확] 텃밭에서 탐스러운 '${cropName}'을(를) 수확하여 가방에 넣었습니다.`);
    save(); render();
};

window.consumeItem = function(itemName, target) {
    if (!S.items[itemName] || S.items[itemName] <= 0) return;
    let itemData = Object.values(SEEDS).find(s => s.crop === itemName);
    if (!itemData) itemData = FISH_DB.find(f => f.name === itemName);
    if (!itemData) return;

    S.items[itemName] -= 1;
    if (S.items[itemName] === 0) delete S.items[itemName];

    const st = S.stats[target];
    if (itemData.healHp) st.hp += itemData.healHp;
    if (itemData.healStr) st.stress = Math.max(0, st.stress - itemData.healStr);

    addLog('sys', `[아이템] ${S.names[target]}이(가) '${itemName}'을(를) 섭취했습니다. (체력 +${itemData.healHp||0}, 스트레스 -${itemData.healStr||0})`);
    addLog(target, `냠냠... 기운이 펄펄 나는걸?`);
    save(); render();
};

window.sellItem = function(itemName) {
    if (!S.items[itemName] || S.items[itemName] <= 0) return;
    let itemData = Object.values(SEEDS).find(s => s.crop === itemName);
    if (!itemData) itemData = FISH_DB.find(f => f.name === itemName);
    if (!itemData) return;

    S.items[itemName] -= 1;
    if (S.items[itemName] === 0) delete S.items[itemName];
    S.money += itemData.sell;
    addLog('sys', `[판매] '${itemName}'을(를) 팔아 ${itemData.sell}G를 벌었습니다.`);
    save(); render();
};

window.openShop = function() {
    if (S.combat) return;
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'shopModal';
    let html = `
        <div class="modal paper" style="background:#f4f0e6; max-width:500px;">
            <h3 style="font-family:'Gowun Batang'; font-size:22px; margin:0 0 10px 0; color:#8a5145;">⛵ 떠돌이 상인의 나룻배</h3>
            <p style="font-size:0.9rem; color:#555; margin-bottom:20px;">가문 재화 <b>(${S.money}G)</b>로 귀중한 아이템을 선물하세요.<br>(수몰병에 걸린 아이는 '고대 산소통'이 필요합니다.)</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
    `;
    SHOP_ITEMS.forEach(item => {
        const canBuy = S.money >= item.price;
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px; border-radius:8px; border:1px solid #ccc;">
                <div>
                    <div style="font-weight:bold; color:#17332f;">${item.name} <span style="color:#d4af37; font-size:0.85rem;">(${item.price}G)</span></div>
                    <div style="font-size:0.8rem; color:#666;">${item.desc}</div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="primary" style="padding:5px 10px; font-size:0.8rem;" ${canBuy ? `onclick="buyShopItem('${item.id}', 'a')"` : 'disabled'}>${esc(S.names.a)}에게</button>
                    <button class="primary" style="padding:5px 10px; font-size:0.8rem;" ${canBuy ? `onclick="buyShopItem('${item.id}', 'b')"` : 'disabled'}>${esc(S.names.b)}에게</button>
                </div>
            </div>`;
    });
    html += `</div><button class="secondary" style="width:100%; margin-top:20px;" onclick="document.getElementById('shopModal').remove()">상점 나가기</button></div>`;
    back.innerHTML = html; document.body.appendChild(back);
};

window.buyShopItem = function(itemId, target) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (S.money < item.price) return;
    
    S.money -= item.price;
    if (item.type === 'stress') {
        S.stats[target].stress = Math.max(0, S.stats[target].stress + item.val);
        if (S.stats[target].sick) {
            S.stats[target].sick = false;
            addLog('sys', `✨ [완치] ${S.names[target]}의 수몰병이 깨끗이 나았습니다!`);
        }
    }
    else if (item.type === 'rel') { S.stats.a.rel += item.val; S.stats.b.rel += item.val; } 
    else S.stats[target][item.type] += item.val;
    
    addLog('sys', `[상점] ${S.names[target]}에게 특별한 선물 '${item.name}'을(를) 주었습니다! 스탯이 오릅니다.`);
    document.getElementById('shopModal').remove();
    save(); render(); openShop();
};

function evaluateEnding() {
    const a = S.stats.a; const b = S.stats.b;
    const sumHp = a.hp + b.hp; const sumInt = a.int + b.int;
    const sumCharm = a.charm + b.charm; const avgRel = (a.rel + b.rel) / 2;
    let endTitle = ""; let endDesc = "";

    if (avgRel < 40) {
        endTitle = "각자의 길로"; endDesc = "두 아이는 성장했지만 서로 서먹해져 각자의 길을 떠났습니다. 집은 짐승만이 홀로 지킵니다.";
    } else if (sumInt > 300 && sumHp > 200) {
        endTitle = "심해의 고고학자 콤비"; endDesc = "도시 수몰의 진실을 완벽히 해독해내어 존경받는 학자이자 영웅이 되었습니다.";
    } else if (sumCharm > 300 && S.money > 500) { 
        endTitle = "수몰 도시의 거물 상단주"; endDesc = "농사와 낚시, 매력으로 상단을 이끌어 수몰 도시 제일의 부호가 되었습니다.";
    } else if (sumHp > 350) {
        endTitle = "무적의 수호대"; endDesc = "압도적인 전투력과 전술 마법으로 수로 괴물들을 토벌하는 전설의 수호대가 되었습니다.";
    } else {
        endTitle = "붉은 벽돌집의 다정한 일상"; endDesc = "거창한 업적은 없지만, 서로를 깊이 아끼며 텃밭을 일구는 따뜻한 일상을 보냅니다.";
    }
    addLog('sys', `[엔딩 도달: ${endTitle}] ${endDesc}`);
    addLog('a', `정말 긴 시간이었네. 우리 여기까지 왔어!`);
    addLog('b', `응, 계속 이 집에서 너와 함께 할 수 있어서 기뻐.`);
    addLog('pet', `크루루룽... (장성한 아이들을 보며 만족스럽게 낮게 웁니다.)`);
}

// 롤플레잉 입력 처리
window.submitCustomLog = function() {
    const speaker = document.getElementById('customSpeaker').value;
    const text = document.getElementById('customLogInput').value.trim();
    if (!text) return;
    addLog(speaker, text, false);
    document.getElementById('customLogInput').value = '';
    save(); render();
};
window.handleInputEnter = function(e) { if (e.key === 'Enter') submitCustomLog(); };

// --- 렌더링 ---
function render() {
    if (!S) { setupView(); return; }
    const currentSeason = getSeason();
    const tideText = TIDES[S.tide];

    const logHtml = S.logs.map(log => {
        const isSys = log.name.includes('시스템');
        const color = isSys ? '#666' : '#8a5145';
        let bg = isSys ? '#e5dece' : '#fffdf8';
        let border = '1px solid #d8cfbd';
        
        if (log.isTrpg) {
            bg = '#2c3e50'; color = '#ecf0f1'; border = '2px solid #e74c3c';
        }

        return `
        <div style="display:flex; gap:12px; margin-bottom:15px; align-items:flex-start;">
            <img src="${log.img}" style="width:45px; height:45px; border-radius:8px; object-fit:cover; border:1px solid #ccc; flex-shrink:0;">
            <div style="flex:1;">
                <div style="font-weight:bold; font-size:0.85rem; color:${color}; margin-bottom:4px;">${esc(log.name)}</div>
                <div style="background:${bg}; color:${log.isTrpg ? 'white' : '#333'}; padding:10px 14px; border-radius:0 12px 12px 12px; border:${border}; font-size:0.95rem; line-height:1.5; display:inline-block; max-width:100%; word-break:break-all;">
                    ${esc(log.text)}
                </div>
            </div>
        </div>`;
    }).join('');

    let leftPanelHtml = "";

    if (S.combat) {
        // --- 전투 UI (유대 협력기 추가) ---
        const c = S.combat;
        const hpPercent = Math.max(0, (c.hp / c.maxHp) * 100);
        leftPanelHtml = `
            <div style="background:#1e272e; color:white; padding:20px; border-radius:12px; border:2px solid #e74c3c; display:flex; flex-direction:column; height:100%;">
                <h3 style="margin-top:0; color:#ff7675; border-bottom:1px solid #555; padding-bottom:10px;">⚠️️ 전투 돌입! TRPG 주사위 굴림</h3>
                <div style="text-align:center; margin-bottom:20px; background:#2f3640; padding:15px; border-radius:8px;">
                    <h2 style="margin:5px 0; color:#ff9f43;">${c.name}</h2>
                    <p style="color:#aaa; font-size:0.9rem; margin-bottom:10px;">${c.desc}</p>
                    <p style="color:#e74c3c; font-size:0.8rem; margin-bottom:10px;">🎯 현재 어그로 타겟: ${esc(S.names[c.aggro])}</p>
                    <div style="background:#555; border-radius:10px; height:15px; overflow:hidden; width:100%; border:1px solid #222;">
                        <div style="background:#e84118; width:${hpPercent}%; height:100%; transition:width 0.3s;"></div>
                    </div>
                    <div style="margin-top:5px; font-weight:bold; color:#ecf0f1;">HP: ${c.hp} / ${c.maxHp} | 공격력: ${c.atk} | 방어도(AC): ${c.ac}</div>
                </div>
                
                <div style="flex:1; display:flex; flex-direction:column; gap:12px; overflow-y:auto;">
                    <!-- A 액션 -->
                    <div style="background:#2f3640; padding:12px; border-radius:8px; border-left:4px solid #3498db;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <b style="color:#3498db;">${esc(S.names.a)}의 턴</b>
                        </div>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <button onclick="doCombatAction('a', '물리')" style="flex:1; padding:8px; background:#e74c3c; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">⚔️ 물리 타격</button>
                            <button onclick="doCombatAction('a', '전술')" style="flex:1; padding:8px; background:#9b59b6; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🔮 전술 마법</button>
                            <button onclick="doCombatAction('a', '교란')" style="flex:1; padding:8px; background:#f1c40f; color:#333; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">✨ 매력 교란</button>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button onclick="doCombatAction('a', '협동마법')" style="flex:2; padding:8px; background:#1abc9c; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🤝 유대: 합동 전술 (Advantage)</button>
                            <button onclick="doCombatAction('a', '감싸기')" style="flex:1; padding:8px; background:#34495e; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🛡️ 감싸기</button>
                        </div>
                    </div>
                    
                    <!-- B 액션 -->
                    <div style="background:#2f3640; padding:12px; border-radius:8px; border-left:4px solid #2ecc71;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <b style="color:#2ecc71;">${esc(S.names.b)}의 턴</b>
                        </div>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <button onclick="doCombatAction('b', '물리')" style="flex:1; padding:8px; background:#e74c3c; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">⚔️ 물리 타격</button>
                            <button onclick="doCombatAction('b', '전술')" style="flex:1; padding:8px; background:#9b59b6; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🔮 전술 마법</button>
                            <button onclick="doCombatAction('b', '교란')" style="flex:1; padding:8px; background:#f1c40f; color:#333; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">✨ 매력 교란</button>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button onclick="doCombatAction('b', '협동마법')" style="flex:2; padding:8px; background:#1abc9c; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🤝 유대: 합동 전술 (Advantage)</button>
                            <button onclick="doCombatAction('b', '감싸기')" style="flex:1; padding:8px; background:#34495e; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">🛡️ 감싸기</button>
                        </div>
                    </div>
                    
                    <div style="margin-top:auto; display:flex; gap:10px;">
                        <button onclick="fleeCombat()" style="flex:1; padding:10px; background:#7f8c8d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">🏃 도주 (돈 15G 상실)</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // --- 평시 스케줄 / 농사 / 인벤토리 UI ---
        const renderStats = (key) => {
            const st = S.stats[key];
            const isSick = st.sick;
            const stressColor = st.stress > 80 ? 'red' : (st.stress > 50 ? '#d4af37' : '#2c7771');
            return `
            <div style="margin-bottom:15px; background:${isSick ? '#ffeaa7' : '#fff'}; padding:12px; border-radius:8px; border:1px solid #eee; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${S.images[key]}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                        <b style="font-size:1.1rem; color:#17332f;">${esc(S.names[key])} ${isSick ? '<span style="color:red; font-size:0.8rem;">(수몰병 앓는 중)</span>' : ''}</b>
                    </div>
                    <div style="font-size:0.8rem; background:#eaf4f1; padding:3px 8px; border-radius:12px; color:#2c7771; font-weight:bold;">유대감: ${st.rel}</div>
                </div>
                <div style="font-size:0.85rem; display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#f4f5f5; padding:8px; border-radius:6px;">
                    <div>💪 체력(HP): <b style="color:#8a5145;">${st.hp}</b></div>
                    <div>📚 지력(INT): <b style="color:#4b675d;">${st.int}</b></div>
                    <div>✨ 매력(CHA): <b style="color:#d4af37;">${st.charm}</b></div>
                    <div style="color:${stressColor};">⚠️ 스트레스: <b>${st.stress}/100</b></div>
                </div>
                ${S.gameOver ? '' : `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:10px;">
                    <button onclick="doSchedule('${key}', '수중탐험')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; color:#17332f; cursor:pointer;" ${isSick ? 'disabled' : ''}>개별: 수중 탐험 (체력/전투)</button>
                    <button onclick="doSchedule('${key}', '기록관공부')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#f4f0e6; border:1px solid #ad8950; border-radius:4px; color:#8a5145; cursor:pointer;" ${isSick ? 'disabled' : ''}>개별: 서고 공부 (지력)</button>
                    <button onclick="doSchedule('${key}', '시장알바')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#fffcf0; border:1px solid #d4af37; border-radius:4px; color:#b8860b; cursor:pointer;" ${isSick ? 'disabled' : ''}>개별: 시장 알바 (매력/돈)</button>
                    <button onclick="doSchedule('${key}', '선착장낚시')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#eef5ff; border:1px solid #4a90e2; border-radius:4px; color:#255e99; cursor:pointer;" ${isSick ? 'disabled' : ''}>개별: 낚시 (아이템)</button>
                    <button style="grid-column: span 2;" onclick="doSchedule('${key}', '휴식')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#fbeeee; border:1px solid #d27979; border-radius:4px; color:#a33; cursor:pointer;">꿀잠 휴식 (돈 -10 / 스트레스 대폭 감소)</button>
                </div>
                `}
            </div>`;
        };

        const renderFarm = () => {
            let html = `<div style="display:flex; gap:10px; margin-top:10px;">`;
            for (let i = 0; i < 4; i++) {
                const plot = S.farm[i];
                if (!plot) html += `<div onclick="openSeedShop(${i})" style="flex:1; height:70px; background:#8a5145; border-radius:8px; border:2px dashed #5c342b; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#f4f0e6; font-size:0.8rem; text-align:center;">빈 밭<br>(클릭)</div>`;
                else if (plot.remain > 0) html += `<div style="flex:1; height:70px; background:#4b675d; border-radius:8px; border:2px solid #2c7771; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-size:0.8rem; text-align:center;">🌱 ${plot.crop}<br>${plot.remain}턴 남음</div>`;
                else html += `<div onclick="harvestCrop(${i})" style="flex:1; height:70px; background:#d4af37; border-radius:8px; border:2px solid #b8860b; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; color:#123d3a; font-weight:bold; font-size:0.8rem; text-align:center;">✨ 수확!<br>${plot.crop}</div>`;
            }
            html += `</div>`; return html;
        };

        const renderInventory = () => {
            const itemKeys = Object.keys(S.items);
            if (itemKeys.length === 0) return `<small style="color:#888;">가방이 비어있습니다.</small>`;
            let html = `<div style="display:flex; flex-direction:column; gap:8px;">`;
            itemKeys.forEach(k => {
                const count = S.items[k];
                html += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:6px 10px; border:1px solid #ccc; border-radius:6px;">
                    <span style="font-weight:bold; font-size:0.9rem;">${k} <span style="color:#2c7771;">x${count}</span></span>
                    <div style="display:flex; gap:4px;">
                        <button onclick="sellItem('${k}')" style="background:#fffcf0; border:1px solid #d4af37; border-radius:4px; padding:3px 6px; font-size:0.75rem; cursor:pointer;">팔기</button>
                        <button onclick="consumeItem('${k}', 'a')" style="background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; padding:3px 6px; font-size:0.75rem; cursor:pointer;">A 먹기</button>
                        <button onclick="consumeItem('${k}', 'b')" style="background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; padding:3px 6px; font-size:0.75rem; cursor:pointer;">B 먹기</button>
                    </div>
                </div>`;
            });
            html += `</div>`; return html;
        };

        leftPanelHtml = `
            <div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #d8cfbd; overflow-y:auto; display:flex; flex-direction:column; height:100%;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #17332f; padding-bottom:5px; margin-bottom:15px;">
                    <h3 style="margin:0;">개별 스케줄 관리 (1턴 소모)</h3>
                </div>
                ${renderStats('a')}
                ${renderStats('b')}
                
                <div style="border-top:2px dashed #ccc; margin:15px 0;"></div>
                
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #d4af37; padding-bottom:5px; margin-bottom:15px;">
                    <h3 style="margin:0; color:#8a5145;">🤝 2인 1조 합동 스케줄 (턴 2회 소모)</h3>
                </div>
                <div style="display:grid; grid-template-columns:1fr; gap:6px;">
                    <button class="action" onclick="doCoopSchedule('심해잠수')" style="padding:10px; font-size:0.85rem; font-weight:bold; background:#1e524e; border:1px solid #2c7771; border-radius:6px; color:white; cursor:pointer;">🌊 생명줄 매고 심해 유적 잠수 (전투 확률/대박 보상)</button>
                    <button class="action" onclick="doCoopSchedule('밤샘해독')" style="padding:10px; font-size:0.85rem; font-weight:bold; background:#5c342b; border:1px solid #8a5145; border-radius:6px; color:white; cursor:pointer;">📚 등 맞대고 고문서 밤샘 해독 (지력/유대 상승)</button>
                    <button class="action" onclick="doCoopSchedule('함께휴식')" style="padding:10px; font-size:0.85rem; font-weight:bold; background:#fffcf0; border:1px solid #d4af37; border-radius:6px; color:#b8860b; cursor:pointer;">☕ 함께 수프 끓여먹으며 휴식 (돈 -20 / 스트레스 대폭 감소)</button>
                </div>
                
                <div style="margin-top:20px; background:#fffdf8; padding:12px; border:1px solid #e5dece; border-radius:8px;">
                    <b style="font-size:0.95rem; color:#8a5145; display:block;">🌱 수경 텃밭 (온실)</b>
                    ${renderFarm()}
                </div>

                <div style="margin-top:15px; background:#fffdf8; padding:12px; border:1px solid #e5dece; border-radius:8px; margin-bottom:15px;">
                    <b style="font-size:0.95rem; color:#17332f; display:block; margin-bottom:8px;">🎒 가방 (수확물 & 낚시)</b>
                    ${renderInventory()}
                </div>
                
                <button class="secondary" style="width:100%; margin-top:auto;" onclick="if(confirm('진행 상황을 닫고 메뉴로 돌아갈까요?')){ S = null; render(); }">나가기 (메뉴로)</button>
            </div>
        `;
    }

    document.getElementById('app').innerHTML = `
    <main class="shell" style="max-width:1150px; display:flex; flex-direction:column; height:95vh;">
        <div class="topbar" style="flex-shrink:0;">
            <div>
                <div class="logo">WATERLINE</div>
                <div class="sub">방 코드: ${esc(S.roomCode)} | ${currentSeason} (🗓️ ${S.month}개월 차 / ${S.turn}/4 턴) / ${tideText}</div>
            </div>
            <div style="display:flex; gap:15px; align-items:center;">
                <div class="clock"><div class="sub">공유 가문 재화</div><b style="color:#d4af37; font-size:1.3rem;">${S.money} G</b></div>
                ${(!S.gameOver && !S.combat) ? `<button class="primary" style="background:#8a5145; border:none; padding:8px 15px;" onclick="openShop()">⛵ 상점 열기</button>` : ''}
            </div>
        </div>
        
        <div class="layout" style="grid-template-columns: 420px 1fr; gap: 20px; flex:1; overflow:hidden;">
            <!-- 좌측 패널 (스케줄 / 전투 UI) -->
            ${leftPanelHtml}
            
            <!-- 우측: 코코포리아 스타일 롤플레잉 채팅 패널 -->
            <aside style="display:flex; flex-direction:column; background:#12211e; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                <div id="logArea" style="flex:1; padding:20px; overflow-y:auto; background:#f4f5f5;">
                    ${logHtml}
                </div>
                
                <div style="background:#fffdf8; padding:15px; border-top:1px solid #ccc; display:flex; gap:10px; align-items:center;">
                    <select id="customSpeaker" style="padding:10px; border-radius:6px; border:1px solid #ccc; font-weight:bold; width:110px; background:#fff; cursor:pointer;">
                        <option value="a">${esc(S.names.a)}</option>
                        <option value="b">${esc(S.names.b)}</option>
                        <option value="pet">${esc(S.names.pet)}</option>
                        <option value="sys">GM(시스템)</option>
                    </select>
                    <input type="text" id="customLogInput" onkeypress="handleInputEnter(event)" placeholder="행동이나 대사를 직접 입력해 롤플레잉을 진행하세요." style="flex:1; padding:10px; border:1px solid #ccc; border-radius:6px; font-size:0.95rem;">
                    <button onclick="submitCustomLog()" style="background:#2c7771; color:white; border:none; border-radius:6px; padding:0 20px; font-weight:bold; cursor:pointer; height:100%;">전송</button>
                </div>
            </aside>
        </div>
    </main>`;

    setTimeout(() => {
        const logArea = document.getElementById('logArea');
        if (logArea) logArea.scrollTop = logArea.scrollHeight;
    }, 50);
}

window.newGame = function() { S = null; setupView(); };
if (S) render(); else setupView();
})();

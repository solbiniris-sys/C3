(() => {
// ==========================================
// WATERLINE: CO-OP RP SANDBOX (Worldview Fix)
// ==========================================

const DEFAULT_IMG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiPj88L3RleHQ+PC9zdmc+";
const SYS_IMG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMmMyYzJjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNlN2U3ZTciPlNZUzwvdGV4dD48L3N2Zz4=";

const traitPool = ['호기심', '신중함', '낙천적', '조용함', '고집', '다정함', '장난기', '몽상가', '꼼꼼함', '독립적', '사교적', '섬세함'];
const petTraits = ['부성애/모성애', '뛰어난 지능', '충직함', '수호자', '느긋함', '사려 깊음', '사람의 말 이해', '자유로운 영혼', '물 좋아함', '거대한 덩치'];

const SEASONS = ['🌸 물안개의 봄', '☀️ 맑고 투명한 여름', '🍂 서늘한 수로의 가을', '❄️ 살얼음이 끼는 겨울'];

const SEEDS = {
    '물토마토': { cost: 15, time: 2, crop: '물토마토', sell: 30, healHp: 10, healStr: 10, desc: '습한 텃밭에서 잘 자랍니다. (2턴)' },
    '벽돌이끼': { cost: 20, time: 3, crop: '벽돌이끼', sell: 45, healHp: 15, healStr: 15, desc: '폐허의 붉은 벽돌에서 긁어모은 식용 이끼. (3턴)' },
    '수국': { cost: 40, time: 5, crop: '수국', sell: 100, healHp: 20, healStr: 40, desc: '우울한 기분을 달래주는 꽃. (5턴)' }
};

const FISH_DB = [
    { name: '녹슨 회중시계', sell: 5, chance: 15, healHp: 0, healStr: 5, msg: '누군가 물에 빠뜨린 녹슨 시계다.' },
    { name: '은빛송어', sell: 20, chance: 40, healHp: 15, healStr: 10, msg: '반짝거리는 은빛 송어다. 꽤 흔한 저녁 반찬거리.' },
    { name: '보따리게', sell: 40, chance: 30, healHp: 20, healStr: 15, msg: '등에 작은 짐을 싣고 다니는 보따리게를 낚았다.' },
    { name: '수달의 유실물', sell: 100, chance: 15, healHp: 10, healStr: 30, msg: '변이 수달이 물속에 숨겨둔 반짝이는 장신구를 건졌다!' }
];

// 🎲 TRPG 일상 위기/탐험 도감 (전투가 아님)
const CHALLENGES = [
    { name: '무너져 내리는 천장', hp: 30, reqType: '체력', desc: '저택의 낡은 천장 일부가 무너져 내리려 합니다! 힘으로 받치고 보수해야 합니다.', failMsg: '잔해에 깔려 가벼운 타박상을 입고 집이 더 엉망이 되었습니다.' },
    { name: '잠겨진 옛 주인의 금고', hp: 40, reqType: '지력', desc: '반쯤 물에 잠긴 서재에서 복잡한 다이얼이 달린 금고를 발견했습니다.', failMsg: '금고의 잠금장치가 완전히 망가져 영영 열 수 없게 되었습니다.' },
    { name: '까탈스러운 떠돌이 상인', hp: 35, reqType: '매력', desc: '배를 타고 온 상인이 귀한 물건을 가지고 있지만, 가격을 터무니없이 부릅니다.', failMsg: '상인은 콧방귀를 뀌며 노를 저어 가버렸습니다.' },
    { name: '길 잃은 새끼 수달 떼', hp: 25, reqType: '매력', desc: '텃밭에 새끼 변이 수달 떼가 들어와 작물을 파헤치려 합니다. 어르고 달래서 쫓아내야 합니다.', failMsg: '수달들이 텃밭을 엉망으로 만들고 도망갔습니다.' }
];

const SHOP_ITEMS = [
    { id: 'blanket', name: '두꺼운 양모 담요', price: 50, desc: '외풍이 심한 저택에서 필수품입니다. (스트레스 -40)', type: 'stress', val: -40 },
    { id: 'book', name: '유럽풍 건축사', price: 60, desc: '석조 건물의 구조가 담겨있습니다. (지력 +20)', type: 'int', val: 20 },
    { id: 'musicbox', name: '태엽 오르골', price: 70, desc: '아름다운 선율이 폐허를 채웁니다. (매력 +20)', type: 'charm', val: 20 },
    { id: 'toolkit', name: '녹슨 공구함', price: 80, desc: '집을 보수하기 좋은 도구들입니다. (체력 +25)', type: 'hp', val: 25 },
    { id: 'ring', name: '세공된 은반지', price: 100, desc: '둘이 함께 나누어 낍니다. (유대감 대폭 상승)', type: 'rel', val: 30 }
];

let S = null;
let roomCodeInput = "coop_rp_01";
let tempSetup = {
    names: { a: '', b: '', pet: '' },
    images: { a: DEFAULT_IMG, b: DEFAULT_IMG, pet: DEFAULT_IMG }
};

function getSaveKey() { return `waterline_room_${S ? S.roomCode : roomCodeInput}`; }
function save() { if (S) localStorage.setItem(getSaveKey(), JSON.stringify(S)); }
function load(code) {
    try { const data = localStorage.getItem(`waterline_room_${code}`); return data ? JSON.parse(data) : null; } 
    catch (e) { return null; }
}

function initState(code) {
    return {
        roomCode: code,
        month: 1, turn: 0, 
        money: 100, 
        names: { ...tempSetup.names, sys: '시스템(GM)' },
        images: { ...tempSetup.images, sys: SYS_IMG },
        stats: {
            a: { hp: 50, int: 50, charm: 50, stress: 0, rel: 50 },
            b: { hp: 50, int: 50, charm: 50, stress: 0, rel: 50 }
        },
        farm: [null, null, null, null],
        items: {}, 
        logs: [],
        challenge: null,
        discover: 0,
        milestones: { m1: false, m2: false, m3: false },
        gameOver: false
    };
}

function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function clamp(n) { return Math.max(0, Math.min(999, n)); }
function getSeason() { return SEASONS[Math.floor((S.month - 1) / 3) % 4]; }
function rollDice(sides) { return Math.floor(Math.random() * sides) + 1; }

function addLog(speakerKey, text, isTrpg = false) {
    const name = S.names[speakerKey] || speakerKey;
    const img = S.images[speakerKey] || SYS_IMG;
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
        if(S.challenge === undefined) S.challenge = null;
        if(S.discover === undefined) S.discover = 0;
        if(!S.milestones) S.milestones = { m1: false, m2: false, m3: false };
        if(!S.images.sys) S.images.sys = SYS_IMG;
        render(); 
    } else { alert('해당 코드로 저장된 데이터가 없습니다.'); }
};

window.startNewRoom = function() {
    const code = document.getElementById('roomCode').value.trim();
    if (!code) { alert('방 코드를 입력해주세요.'); return; }
    roomCodeInput = code;
    
    tempSetup.names.a = document.getElementById('na').value.trim() || 'Player 1';
    tempSetup.names.b = document.getElementById('nb').value.trim() || 'Player 2';
    tempSetup.names.pet = document.getElementById('np').value.trim() || '보호자(거대동물)';
    
    S = initState(code);
    addLog('sys', `[시스템] 세션 방 <${code}>이 생성되었습니다. 폐허가 된 아름다운 저택에서의 롤플레잉을 시작합니다.`);
    save(); render();
};

function setupView() {
    document.getElementById('app').innerHTML = `
    <main class="shell" style="max-width: 850px;">
        <section class="paper setup">
            <div class="sub">WATERLINE · 2-Player Everyday RP Sandbox</div>
            <h1 style="font-size:28px;">불편하고 거대한 폐허 저택,<br>그곳을 채우는 아이들과 짐승.</h1>
            <p class="lead" style="font-size:0.95rem;">수면 아래위로 나뉜 유럽풍 도시. 사람들은 변이동물을 타고 등교하거나 장을 봅니다.<br>여러분은 인적 드문 도시 외곽, 지나치게 크고 비가 새는 낡은 저택에 삽니다.<br>괴물도, 세계 멸망도 없습니다. 그저 <b>서로의 온기에 의지해 집을 고치고 하루를 살아가는 롤플레잉</b>에 집중하세요.</p>
            
            <div class="field full" style="background:#eef0e5; border:1px solid #b7cec7;">
                <label>세션 방 코드 (자동 저장 및 불러오기 가능)</label>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <input id="roomCode" placeholder="예: my_rp_01" value="${roomCodeInput}" style="flex:1;">
                    <button class="secondary" onclick="loadRoom()">이어하기 (불러오기)</button>
                </div>
            </div>

            <div class="formgrid">
                <div class="field full">
                    <h3 style="margin:0 0 15px 0; border-bottom:1px solid #ccc; padding-bottom:5px;">캐릭터 설정 및 프로필 이미지 첨부 (TRPG 토큰용)</h3>
                    ${characterSetupHtml('a', '첫 번째 아이 (Player 1)')}
                    ${characterSetupHtml('b', '두 번째 아이 (Player 2)')}
                    ${characterSetupHtml('pet', '거대동물 (보호자)')}
                </div>
            </div>
            
            <button class="primary start" onclick="startNewRoom()" style="margin-top: 20px; width:100%; font-size:1.1rem; padding:15px;">낡은 저택의 문을 열기</button>
        </section>
    </main>`;
}

function characterSetupHtml(key, label) {
    return `
    <div style="display:flex; gap:15px; align-items:center; margin-bottom:20px; background:#fffdf8; padding:10px; border-radius:8px; border:1px solid #e5dece;">
        <img id="preview-${key}" src="${tempSetup.images[key]}" style="width:60px; height:60px; border-radius:8px; object-fit:cover; border:1px solid #ccc;">
        <div style="flex:1;">
            <label style="font-size:0.9rem; font-weight:bold; color:#17332f;">${label}</label>
            <input id="n${key}" maxlength="12" placeholder="캐릭터 이름 입력" style="margin-top:5px; padding:6px; width:100%; box-sizing:border-box;">
            <input type="file" accept="image/*" onchange="handleImageUpload(event, '${key}')" style="margin-top:8px; font-size:0.8rem; width:100%;">
        </div>
    </div>`;
}

function endTurn(turnsConsumed = 1) {
    S.turn += turnsConsumed;
    S.farm.forEach(f => { if (f && f.remain > 0) f.remain -= turnsConsumed; });

    if (S.turn >= 4) { 
        S.month++; S.turn = 0;
        const newSeason = getSeason();
        addLog('sys', `--- 🗓️ ${S.month}개월 차 (${newSeason}) ---`);
        if (S.month > 24) { S.gameOver = true; evaluateEnding(); }
    }
    
    // 스토리 진행도 체크
    if (S.discover >= 3 && !S.milestones.m1) {
        S.milestones.m1 = true;
        addLog('sys', `📖 [기억의 파편] 다락방 구석에서 낡은 '고아원 바구니' 두 개를 발견했습니다. 이 거대한 짐승이 그 바구니를 물어와 이 폐허에서 우릴 길렀다는 사실을 다시금 깨닫습니다.`);
    } else if (S.discover >= 6 && !S.milestones.m2) {
        S.milestones.m2 = true;
        addLog('sys', `📖 [기억의 파편] 반쯤 잠긴 1층 서재에서 일기장을 찾았습니다. 이 저택은 과거 꽤 명망 있던 귀족의 집이었으나, 수몰 이후 가족들이 떠나고 방치된 곳이었습니다.`);
    } else if (S.discover >= 9 && !S.milestones.m3) {
        S.milestones.m3 = true;
        addLog('sys', `📖 [기억의 파편] 짐승의 목덜미에 걸려 있던 오래된 열쇠가 저택 안방의 열쇠임을 알게 되었습니다. 이 짐승은 그저 우연히 머문 것이 아니라, 옛 주인을 기다리며 집을 지키고 있었던 것입니다.`);
    }
    
    save(); render();
}

function checkStress(targetKey) {
    const st = S.stats[targetKey];
    if (st.stress >= 100) {
        addLog('sys', `⚠️ [탈진] ${S.names[targetKey]}이(가) 외풍과 피로를 견디지 못하고 쓰러졌습니다. 휴식이 시급합니다!`);
        addLog(targetKey, `으슬으슬해... 집이 너무 추워...`);
        st.stress = 70; // 강제 완화
        return true;
    }
    return false;
}

// --- 일상 스케줄 시스템 ---
window.doSchedule = function(targetKey, actionType) {
    if (S.gameOver || S.challenge) return;
    const st = S.stats[targetKey];
    
    // 25% 확률로 TRPG 판정(위기/탐험) 발생
    if (actionType !== '휴식' && Math.random() < 0.25) {
        startChallenge(targetKey);
        return; 
    }

    if (actionType === '폐허보수') {
        st.hp += 10; st.stress += 15;
        addLog('sys', `[스케줄] ${S.names[targetKey]}이(가) 비가 새는 붉은 벽돌 지붕을 보수하며 땀을 흘렸습니다. (체력 +10, 스트레스 +15)`);
        addLog(targetKey, `휴, 집이 왜 이렇게 큰 거야. 끝이 없네.`);
    } else if (actionType === '고물탐색') {
        st.int += 10; st.stress += 15; S.discover += 1;
        addLog('sys', `[스케줄] ${S.names[targetKey]}이(가) 저택의 방치된 서재와 창고를 뒤적여 쓸만한 물건과 기록을 찾았습니다. (지력 +10, 단서 +1)`);
        addLog(targetKey, `먼지투성이지만, 꽤 재밌는 물건이 많은걸?`);
    } else if (actionType === '시장외출') {
        st.charm += 5; S.money += 25; st.stress += 15;
        addLog('sys', `[스케줄] ${S.names[targetKey]}이(가) 배를 타고 시장에 나가 심부름을 하고 용돈을 벌었습니다. (매력 +5, 재화 +25)`);
        addLog(targetKey, `다녀왔어! 오늘 광장에서 변이 거북이 경주하는 거 봤어!`);
    } else if (actionType === '선착장낚시') {
        st.hp += 3; st.stress -= 10; 
        const roll = Math.random() * 100;
        let caught = FISH_DB[0];
        let cumulative = 0;
        for (let f of FISH_DB) {
            cumulative += f.chance;
            if (roll <= cumulative) { caught = f; break; }
        }
        S.items[caught.name] = (S.items[caught.name] || 0) + 1;
        addLog('sys', `[스케줄] ${S.names[targetKey]}이(가) 저택 선착장에서 여유롭게 낚시를 해 [${caught.name}]을(를) 낚았습니다. (스트레스 -10)`);
        addLog(targetKey, caught.msg);
    } else if (actionType === '휴식') {
        st.stress = Math.max(0, st.stress - 40); S.money -= 10;
        addLog('pet', `(부드러운 숨소리를 내며 ${S.names[targetKey]}을(를) 거대한 털품으로 감싸 안아 따뜻하게 해줍니다.)`);
        addLog('sys', `[스케줄] ${S.names[targetKey]}이(가) 거대동물의 곁에서 외풍을 피해 푹 쉬었습니다. (스트레스 -40, 생활비 -10)`);
    }

    checkStress(targetKey);
    endTurn(1);
};

// 🤝 2인 합동 스케줄
window.doCoopSchedule = function(actionType) {
    if (S.gameOver || S.challenge) return;
    if (S.turn > 2) { alert('합동 스케줄은 남은 행동력이 2 이상일 때만 가능합니다.'); return; }

    if (actionType === '대청소') {
        S.stats.a.hp += 10; S.stats.b.hp += 10; 
        S.stats.a.stress += 20; S.stats.b.stress += 20;
        S.stats.a.rel += 15; S.stats.b.rel += 15;
        S.discover += 2;
        addLog('sys', `[합동 스케줄] 둘이 함께 먼지 쌓인 저택의 1층을 대청소하며 과거의 흔적을 2개 발견했습니다! (유대감 +15, 단서 +2)`);
        addLog('a', `콜록! 저쪽 창문은 네가 닦을래?`);
        addLog('b', `알았어. 와, 여기 옛날 사진 같은 게 떨어져 있어.`);
    } else if (actionType === '함께휴식') {
        if (S.money < 20) { alert('가문 재화가 부족합니다 (20G 필요).'); return; }
        S.money -= 20;
        S.stats.a.stress = Math.max(0, S.stats.a.stress - 50); S.stats.b.stress = Math.max(0, S.stats.b.stress - 50);
        S.stats.a.rel += 20; S.stats.b.rel += 20;
        addLog('sys', `[합동 스케줄] 따뜻한 차를 끓여 마시며 두런두런 대화를 나눴습니다. (스트레스 대폭 감소, 유대감 +20)`);
        addLog('a', `집은 넓고 춥지만... 그래도 같이 있으니까 견딜 만해.`);
        addLog('b', `응, 우리 셋이 함께면 어떻게든 될 거야.`);
    }

    checkStress('a'); checkStress('b');
    endTurn(2); 
};

// --- 🎲 TRPG 일상 위기/탐험 판정 시스템 ---
window.startChallenge = function(finderKey) {
    const cTmpl = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    S.challenge = {
        name: cTmpl.name, hp: cTmpl.hp, maxHp: cTmpl.hp,
        reqType: cTmpl.reqType, desc: cTmpl.desc, failMsg: cTmpl.failMsg,
        actor: finderKey
    };
    addLog('sys', `⚠️ [상황 발생] 일상 속에서 문제가 생겼습니다! 주사위를 굴려 상황을 해결하세요.`, true);
    save(); render();
};

window.doChallengeAction = function(actorKey, useStat) {
    const st = S.stats[actorKey];
    const c = S.challenge;
    let d20 = rollDice(20);
    let score = 0; let logText = "";

    let mod = 0;
    if(useStat === '체력') mod = Math.floor(st.hp / 10);
    if(useStat === '지력') mod = Math.floor(st.int / 10);
    if(useStat === '매력') mod = Math.floor(st.charm / 10);

    const total = d20 + mod;
    score = rollDice(6) + mod * 2; // 해결 진척도
    
    if (useStat === c.reqType) {
        score += 10; // 약점(요구 스탯) 찌르기 보너스
        logText = `🎲 [올바른 접근] (🎲${d20}+${mod}=${total}) 상황에 알맞은 방식으로 접근하여 ${score}만큼의 문제를 해결했습니다!`;
    } else {
        logText = `🎲 [어긋난 접근] (🎲${d20}+${mod}=${total}) 어설프지만 억지로 밀어붙여 ${score}만큼의 문제를 해결했습니다.`;
    }

    c.hp -= score;
    addLog(actorKey, logText, true);

    if (c.hp <= 0) {
        addLog('sys', `🎉 [상황 극복] <${c.name}> 문제를 완벽히 해결했습니다! 보상으로 15G를 얻습니다.`, true);
        S.money += 15;
        S.challenge = null;
        endTurn(1); 
    } else if (total < 10) {
        addLog('sys', `❌ [위기] 상황이 악화되었습니다. ${S.names[actorKey]}의 스트레스가 10 오릅니다.`, true);
        st.stress += 10;
        if (st.stress >= 100) {
             addLog('sys', `💀 [포기] ${S.names[actorKey]}이(가) 지쳐서 물러납니다. ${c.failMsg}`, true);
             S.challenge = null;
             st.stress = 60;
             endTurn(1);
        }
    }
    save(); render();
};

window.fleeChallenge = function() {
    const c = S.challenge;
    addLog('sys', `🏃 [회피] 문제를 방치하기로 했습니다. ${c.failMsg}`, true);
    S.challenge = null;
    endTurn(1);
};

// --- 농사 시스템 ---
window.openSeedShop = function(slotIndex) {
    if (S.challenge) return; 
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'seedModal';
    let html = `
        <div class="modal paper" style="background:#f4f0e6; max-width:400px;">
            <h3 style="font-family:'Gowun Batang'; font-size:20px; margin:0 0 10px 0; color:#2c7771;">🌱 텃밭 씨앗 상점</h3>
            <p style="font-size:0.85rem; color:#555; margin-bottom:15px;">가문 재화: <b>${S.money}G</b><br>저택 마당의 빈 텃밭에 심습니다. (턴 소모 없음)</p>
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
    addLog('sys', `[농사] 마당 텃밭에 '${seedKey} 씨앗'을 심었습니다! (${seed.time}턴 후 수확)`);
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
    let itemData = Object.values(SEEDS).find(s => s.crop === itemName) || FISH_DB.find(f => f.name === itemName);
    if (!itemData) return;

    S.items[itemName] -= 1;
    if (S.items[itemName] === 0) delete S.items[itemName];

    const st = S.stats[target];
    st.hp += (itemData.healHp || 0);
    st.stress = Math.max(0, st.stress - (itemData.healStr || 0));

    addLog('sys', `[사용] ${S.names[target]}이(가) '${itemName}'을(를) 사용했습니다. (체력+${itemData.healHp||0}, 스트레스-${itemData.healStr||0})`);
    save(); render();
};

window.sellItem = function(itemName) {
    if (!S.items[itemName] || S.items[itemName] <= 0) return;
    let itemData = Object.values(SEEDS).find(s => s.crop === itemName) || FISH_DB.find(f => f.name === itemName);
    if (!itemData) return;

    S.items[itemName] -= 1;
    if (S.items[itemName] === 0) delete S.items[itemName];
    S.money += itemData.sell;
    addLog('sys', `[판매] '${itemName}'을(를) 팔아 ${itemData.sell}G를 벌었습니다.`);
    save(); render();
};

window.openShop = function() {
    if (S.challenge) return;
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'shopModal';
    let html = `
        <div class="modal paper" style="background:#f4f0e6; max-width:500px;">
            <h3 style="font-family:'Gowun Batang'; font-size:22px; margin:0 0 10px 0; color:#8a5145;">⛵ 떠돌이 상인의 나룻배</h3>
            <p style="font-size:0.9rem; color:#555; margin-bottom:20px;">집을 꾸미거나 아이들을 위한 선물을 사세요. (가문 재화 <b>${S.money}G</b>)</p>
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
    if (item.type === 'stress') S.stats[target].stress = Math.max(0, S.stats[target].stress + item.val);
    else if (item.type === 'rel') { S.stats.a.rel += item.val; S.stats.b.rel += item.val; } 
    else S.stats[target][item.type] += item.val;
    
    addLog('sys', `[상점] ${S.names[target]}에게 '${item.name}'을(를) 선물했습니다!`);
    document.getElementById('shopModal').remove();
    save(); render(); openShop();
};

function evaluateEnding() {
    const a = S.stats.a; const b = S.stats.b;
    const avgRel = (a.rel + b.rel) / 2;
    let endTitle = ""; let endDesc = "";

    if (avgRel < 40) {
        endTitle = "쓸쓸한 폐허"; endDesc = "시간이 흘러 두 아이는 성장했지만 각자의 길을 떠났습니다. 거대동물만이 낡은 저택을 지킵니다.";
    } else if (S.discover >= 6) {
        endTitle = "저택의 진정한 후계자"; endDesc = "두 사람은 이 저택의 과거를 모두 알아내고, 훌륭하게 집을 고쳐내어 새로운 가문을 열었습니다.";
    } else {
        endTitle = "붉은 벽돌집의 다정한 일상"; endDesc = "저택은 여전히 크고 외풍이 불지만, 서로를 깊이 아끼며 웃음이 끊이지 않는 따뜻한 집이 되었습니다.";
    }
    addLog('sys', `[엔딩 도달: ${endTitle}] ${endDesc}`);
    addLog('a', `정말 긴 시간이었네. 집도 제법 사람 사는 곳 같아졌어.`);
    addLog('b', `응. 이 넓은 집도 너희와 함께면 포근해.`);
    addLog('pet', `크루루룽... (장성한 아이들을 보며 다정하게 꼬리를 칩니다.)`);
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

    const logHtml = S.logs.map(log => {
        const isSys = log.name.includes('시스템');
        const color = isSys ? '#555' : '#8a5145';
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

    if (S.challenge) {
        const c = S.challenge;
        const hpPercent = Math.max(0, (c.hp / c.maxHp) * 100);
        leftPanelHtml = `
            <div style="background:#1e272e; color:white; padding:20px; border-radius:12px; border:2px solid #e74c3c; display:flex; flex-direction:column; height:100%;">
                <h3 style="margin-top:0; color:#ff7675; border-bottom:1px solid #555; padding-bottom:10px;">⚠ 일상 위기 / 탐험 판정</h3>
                <div style="text-align:center; margin-bottom:20px; background:#2f3640; padding:15px; border-radius:8px;">
                    <h2 style="margin:5px 0; color:#ff9f43;">${c.name}</h2>
                    <p style="color:#aaa; font-size:0.95rem; margin-bottom:10px;">${c.desc}</p>
                    <p style="color:#1abc9c; font-size:0.85rem; margin-bottom:10px;">💡 권장 해결 방식: <b>[${c.reqType}]</b> 판정</p>
                    <div style="background:#555; border-radius:10px; height:15px; overflow:hidden; width:100%; border:1px solid #222;">
                        <div style="background:#e84118; width:${hpPercent}%; height:100%; transition:width 0.3s;"></div>
                    </div>
                    <div style="margin-top:5px; font-weight:bold; color:#ecf0f1;">해결 진척도: ${c.maxHp - c.hp} / ${c.maxHp}</div>
                </div>
                
                <div style="flex:1; display:flex; flex-direction:column; gap:12px; overflow-y:auto;">
                    <div style="background:#2f3640; padding:12px; border-radius:8px; border-left:4px solid #3498db;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <b style="color:#3498db;">${esc(S.names[c.actor])}의 주사위 굴림</b>
                        </div>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <button onclick="doChallengeAction('${c.actor}', '체력')" style="flex:1; padding:10px; background:#e74c3c; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">💪 힘으로 해결 (체력)</button>
                            <button onclick="doChallengeAction('${c.actor}', '지력')" style="flex:1; padding:10px; background:#9b59b6; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">📚 머리로 해결 (지력)</button>
                            <button onclick="doChallengeAction('${c.actor}', '매력')" style="flex:1; padding:10px; background:#f1c40f; color:#333; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">✨ 말로 해결 (매력)</button>
                        </div>
                    </div>
                    <div style="margin-top:auto; display:flex; gap:10px;">
                        <button onclick="fleeChallenge()" style="flex:1; padding:10px; background:#7f8c8d; color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">🏃 포기하기 (페널티 감수)</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        const renderStats = (key) => {
            const st = S.stats[key];
            const stressColor = st.stress > 80 ? 'red' : (st.stress > 50 ? '#d4af37' : '#2c7771');
            return `
            <div style="margin-bottom:15px; background:#fff; padding:12px; border-radius:8px; border:1px solid #eee; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${S.images[key]}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                        <b style="font-size:1.1rem; color:#17332f;">${esc(S.names[key])}</b>
                    </div>
                    <div style="font-size:0.8rem; background:#eaf4f1; padding:3px 8px; border-radius:12px; color:#2c7771; font-weight:bold;">유대감: ${st.rel}</div>
                </div>
                <div style="font-size:0.85rem; display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#f4f5f5; padding:8px; border-radius:6px;">
                    <div>💪 체력: <b style="color:#8a5145;">${st.hp}</b></div>
                    <div>📚 지력: <b style="color:#4b675d;">${st.int}</b></div>
                    <div>✨ 매력: <b style="color:#d4af37;">${st.charm}</b></div>
                    <div style="color:${stressColor};">⚠️ 스트레스: <b>${st.stress}/100</b></div>
                </div>
                ${S.gameOver ? '' : `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:10px;">
                    <button onclick="doSchedule('${key}', '폐허보수')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; color:#17332f; cursor:pointer;">집 보수 (체력/위기)</button>
                    <button onclick="doSchedule('${key}', '고물탐색')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#f4f0e6; border:1px solid #ad8950; border-radius:4px; color:#8a5145; cursor:pointer;">고물 탐색 (지력/위기)</button>
                    <button onclick="doSchedule('${key}', '시장외출')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#fffcf0; border:1px solid #d4af37; border-radius:4px; color:#b8860b; cursor:pointer;">시장 심부름 (매력/돈)</button>
                    <button onclick="doSchedule('${key}', '선착장낚시')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#eef5ff; border:1px solid #4a90e2; border-radius:4px; color:#255e99; cursor:pointer;">선착장 낚시 (아이템)</button>
                    <button style="grid-column: span 2;" onclick="doSchedule('${key}', '휴식')" style="padding:6px; font-size:0.75rem; font-weight:bold; background:#fbeeee; border:1px solid #d27979; border-radius:4px; color:#a33; cursor:pointer;">보호자 곁 휴식 (스트레스 대폭 감소)</button>
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
                        <button onclick="consumeItem('${k}', 'a')" style="background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; padding:3px 6px; font-size:0.75rem; cursor:pointer;">A 사용</button>
                        <button onclick="consumeItem('${k}', 'b')" style="background:#eaf4f1; border:1px solid #2c7771; border-radius:4px; padding:3px 6px; font-size:0.75rem; cursor:pointer;">B 사용</button>
                    </div>
                </div>`;
            });
            html += `</div>`; return html;
        };

        leftPanelHtml = `
            <div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #d8cfbd; overflow-y:auto; display:flex; flex-direction:column; height:100%;">
                
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #17332f; padding-bottom:5px; margin-bottom:15px;">
                    <h3 style="margin:0;">개별 행동 (1턴 소모)</h3>
                </div>
                ${renderStats('a')}
                ${renderStats('b')}
                
                <div style="border-top:2px dashed #ccc; margin:15px 0;"></div>
                
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #d4af37; padding-bottom:5px; margin-bottom:15px;">
                    <h3 style="margin:0; color:#8a5145;">🤝 합동 행동 (턴 2회 소모)</h3>
                </div>
                <div style="display:grid; grid-template-columns:1fr; gap:6px;">
                    <button class="action" onclick="doCoopSchedule('대청소')" style="padding:10px; font-size:0.85rem; font-weight:bold; background:#1e524e; border:1px solid #2c7771; border-radius:6px; color:white; cursor:pointer;">🧹 폐허 대청소 (체력 소모 / 단서 대량 획득)</button>
                    <button class="action" onclick="doCoopSchedule('함께휴식')" style="padding:10px; font-size:0.85rem; font-weight:bold; background:#fffcf0; border:1px solid #d4af37; border-radius:6px; color:#b8860b; cursor:pointer;">☕ 따뜻한 차 마시기 (돈 -20 / 스트레스 대폭 감소)</button>
                </div>
                
                <div style="margin-top:20px; background:#fffdf8; padding:12px; border:1px solid #e5dece; border-radius:8px;">
                    <b style="font-size:0.95rem; color:#8a5145; display:block;">🌱 마당 텃밭</b>
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
                <div class="sub">방 코드: ${esc(S.roomCode)} | ${currentSeason} (🗓️ ${S.month}개월 차 / ${S.turn}/4 턴)</div>
            </div>
            <div style="display:flex; gap:15px; align-items:center;">
                <div class="clock"><div class="sub">가문 재화</div><b style="color:#d4af37; font-size:1.3rem;">${S.money} G</b></div>
                ${(!S.gameOver && !S.challenge) ? `<button class="primary" style="background:#8a5145; border:none; padding:8px 15px;" onclick="openShop()">⛵ 상점 열기</button>` : ''}
            </div>
        </div>
        
        <div class="layout" style="grid-template-columns: 420px 1fr; gap: 20px; flex:1; overflow:hidden;">
            <!-- 좌측 패널 (스케줄 / 위기 UI) -->
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

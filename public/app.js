(() => {
const KEY = 'waterline_v90_save';

// --- 기초 데이터 풀 ---
const traitPool = ['호기심', '신중함', '낙천적', '조용함', '고집', '다정함', '장난기', '몽상가', '꼼꼼함', '독립적', '사교적', '섬세함', '강인함', '손재주', '직감', '협상가'];
const petTraits = ['부성애/모성애', '뛰어난 지능', '충직함', '수호자', '느긋함', '대담함', '사려 깊음', '경계심', '사람의 말 이해', '자유로운 영혼', '영리함', '물 좋아함', '사냥꾼', '거대한 덩치'];

// --- 날씨 시스템 ---
const weatherInfo = {
    '잔잔한 운하': { desc: '평온한 날입니다. 모든 행동이 정상적으로 이루어집니다.', fx: {} },
    '거센 비': { desc: '폭우가 쏟아집니다. 야외 활동 시 체력이 2배로 닳지만, 저택에서 식수 획득 효율이 큽니다.', fx: { outdoorEnergyMult: 2, rainBonus: true } },
    '유리처럼 맑은 수면': { desc: '물속이 투명하게 보입니다. 잠수 파밍 성공 확률과 보상 획득량이 증가합니다.', fx: { gatherBonus: true } },
    '물안개 낀 날': { desc: '시야가 좁아 위험합니다. 안개 때문에 기분이 쉽게 우울해집니다.', fx: { moodDrain: true } },
    '높은 수위': { desc: '수위가 비정상적으로 높습니다. 수압의 영향을 받아 저택 방수벽이 미세하게 손상됩니다.', fx: { houseDamage: 1 } }
};
const weatherKeys = Object.keys(weatherInfo);

// --- 저택 설비(업그레이드) ---
const upgradesInfo = {
    'waterTank': { name: '빗물 정화조', cost: { scrap: 4, money: 5 }, desc: '매일 아침 식수를 2씩 자동 생산합니다.' },
    'greenhouse': { name: '수경 재배기', cost: { scrap: 6, money: 10 }, desc: '매일 아침 식량을 2씩 자동 생산합니다.' },
    'reinforcedWall': { name: '고대 방수벽', cost: { scrap: 8 }, desc: '매일 밤 방수벽이 1씩 깎이는 기본 페널티를 막아줍니다.' }
};

// --- 장소 데이터 ---
const placesInfo = {
    '저택': { label: '집', desc: '수면 아래까지 방수된 저택. 설비 건설과 요리가 가능합니다.', isOutdoor: false },
    '시장': { label: '시장', desc: '상인들이 오가는 장터. 물빛 포커를 칠 수 있습니다.', isOutdoor: true },
    '선착장': { label: '선착장', desc: '습한 물가. 잠수 파밍으로 자원을 캐기 좋습니다.', isOutdoor: true },
    '기록관': { label: '기록관', desc: '먼지 쌓인 서고. 집중력 소모가 큽니다.', isOutdoor: true },
    '미지의 수로': { label: '탐험', desc: '어떤 보상과 위험이 있을지 모르는 폐쇄 구역.', isOutdoor: true }
};

// --- 무작위 조우(Encounter) ---
const randomEncounters = [
    {
        id: 'enc_1', title: '떠내려온 화물상자',
        text: '물길을 따라 굳게 닫힌 나무 상자 하나가 떠내려왔습니다. 자물쇠가 꽤 튼튼해 보입니다.',
        choices: [
            { t: '억지로 부숴서 연다', fx: { energy: -3, scrap: 1 }, tone: '손을 다쳤지만 쓸만한 고대 부품을 얻었다.' },
            { t: '도구를 이용해 흠집 없이 해체한다', reqTrait: '손재주', fx: { money: 5, scrap: 3 }, tone: '손재주를 발휘해 귀한 부품을 대량으로 회수했다!' },
            { t: '함정이 있을지 모르니 무시한다', reqTrait: '신중함', fx: { mood: 1 }, tone: '위험을 감수하지 않기로 했다.' }
        ]
    },
    {
        id: 'enc_2', title: '위협적인 들짐승',
        text: '야생 변이동물 무리와 마주쳤습니다. 그들은 적의를 띠고 으르렁거립니다.',
        choices: [
            { t: '도망친다', fx: { energy: -5, mood: -2 }, tone: '숨이 턱 끝까지 차오르도록 뛰어 겨우 도망쳤다.' },
            { t: '거대동물이 나서서 포효한다', reqTrait: '거대한 덩치', fx: { petEnergy: -2, rep: 2, mood: 3 }, tone: '보호자의 덩치와 포효에 야생 짐승들이 도망쳤다!' },
            { t: '먹이를 던져주며 시선을 끈다', fx: { food: -2 }, tone: '식량을 잃었지만 무사히 빠져나왔다.' }
        ]
    },
    {
        id: 'enc_3', title: '수몰된 금고 (위험 지대 전용)',
        text: '미지의 수로 깊은 곳, 빛바랜 금고가 물에 잠겨 있습니다. 주변 지반이 붕괴될 것 같습니다.',
        reqPlace: '미지의 수로',
        choices: [
            { t: '무너질 위험을 감수하고 금고를 연다', fx: { scrap: 5, money: 5, house: -5, energy: -4 }, tone: '금고를 열었지만 붕괴 여파로 방수벽 일부가 손상되었다.' },
            { t: '직감으로 안전한 틈새만 공략한다', reqTrait: '직감', fx: { scrap: 6, money: 10 }, tone: '뛰어난 직감으로 무너지기 직전 부품만 빼냈다!' },
            { t: '미련 없이 돌아선다', fx: { mood: -1 }, tone: '안전이 제일이다.' }
        ]
    }
];

// --- 메인 스토리 & 재난 ---
const crisisEvent = {
    id: 'crisis_flood', title: '재난: 대수위 상승',
    text: '방벽 밖에서 거대한 물울음 소리가 들립니다. 수위가 폭발적으로 상승하며 저택의 1층 방수벽을 강하게 짓누르기 시작했습니다! 대응하지 않으면 집이 무너집니다.',
    choices: [
        { t: '온 가족이 맨몸으로 방수벽을 덧댄다', fx: { energy: -10, house: -15, mood: -10 }, tone: '필사적으로 막았지만 벽 일부가 무너지고 체력이 바닥났다.' },
        { t: '강인한 체력으로 무너지는 기둥을 떠받친다', reqTrait: '강인함', fx: { energy: -5, house: -5 }, tone: '강인한 힘으로 기둥을 버텨내어 피해를 최소화했다!' },
        { t: '거대동물이 수로 밖으로 나가 물결을 흩뜨린다', reqTrait: '물 좋아함', fx: { petEnergy: -15, house: -2 }, tone: '보호자가 거센 물결을 몸으로 분산시켜 저택을 지켜냈다!' }
    ]
};

const events = {
 main: [
  {
    id: 'milestone_1', title: '기억의 1장: 버려진 요람',
    text: '다락에서 발견한 요람에 누군가 고의로 우리를 띄워 보낸 흔적이 있습니다. 그리고 보호자는 그 사실을 처음부터 알고 있었습니다.',
    choices: [
      { t: '거대동물을 껴안으며 신뢰를 표한다', fx: { petMood: 10, relAP: 5, relBP: 5, flags: ['hugged_pet'] }, tone: '짐승은 조용히 두 아이의 등을 감싸 안았다.' },
      { t: '직감으로 요람의 출처를 추적한다', reqTrait: '직감', fx: { discover: 3, petMood: 5 }, tone: '우리는 상류의 어느 권력자가 개입되어 있음을 깨달았다.' }
    ]
  },
  {
    id: 'milestone_2', title: '기억의 2장: 잠겨진 통제실',
    text: '지하의 낡은 방수 격벽이 열리며, 도시의 수위를 조절하는 [고대 수문 통제기]의 도면이 나타납니다. 이 집은 평범한 저택이 아니라 도시의 심장부였습니다.',
    choices: [
      { t: '도면을 조심스럽게 챙겨 방을 나선다', fx: { discover: 3, energy: -2 }, tone: '이 도면이 큰 도움이 될 것이다.' },
      { t: '복잡한 기계 원리를 해독한다', reqTrait: '호기심', fx: { discover: 5, energy: -2 }, tone: '통제기가 여전히 미세하게 작동 중이라는 사실을 알아냈다!' }
    ]
  },
  {
    id: 'milestone_3', title: '기억의 3장: 짐승의 맹세',
    text: '도면 뒷면에 적힌 유언장. "이 방주를 지능을 가진 나의 형제(짐승)에게 맡긴다." 우리는 이 유산의 진정한 상속자였습니다.',
    choices: [
      { t: '유산을 온전히 받아들이기로 맹세한다', fx: { mood: 10, relAB: 5 }, tone: '두 사람의 눈빛이 흔들림 없이 단단해졌다.' },
      { t: '이 성채를 굳건히 요새화하겠다', reqTrait: '강인함', fx: { house: 15, mood: 5 }, tone: '어떤 수압도 견뎌낼 요새를 지켜낼 결심을 했다.' }
    ]
  }
 ]
};

let S = load() || null;
let setup = { a: '', b: '', pet: '', mode: '2', traits: { a: [], b: [], pet: [] } };

function load() {
    try {
        const x = JSON.parse(localStorage.getItem(KEY));
        if (!x) return null; 
        if (x.scrap === undefined) x.scrap = 0;
        if (!x.upgrades) x.upgrades = { waterTank: false, greenhouse: false, reinforcedWall: false };
        if (!x.selectedPlayer) x.selectedPlayer = 'a'; // 자유 턴 선택용
        return x;
    } catch (e) { localStorage.removeItem(KEY); return null; }
}

function initState() {
    return {
        day: 1, turn: 0, ageStage: 1, ageText: '어린 시절',
        weather: weatherKeys[0],
        money: 30, food: 10, water: 10, house: 80, scrap: 0, 
        rep: 0, discover: 0, place: '저택',
        goal: '자원을 파밍해 기지를 강화하고, 15번의 계절을 버티자.',
        mode: setup.mode, 
        selectedPlayer: 'a', // 플레이어가 수동으로 탭에서 선택한 캐릭터
        names: { a: setup.a.trim() || 'A', b: setup.b.trim() || 'B', pet: setup.pet.trim() || '보호자' },
        traits: { a: [...setup.traits.a], b: [...setup.traits.b], pet: [...setup.traits.pet] },
        moodA: 70, moodB: 70, petMood: 80, energyA: 80, energyB: 80, petEnergy: 85,
        relAB: 60, relAP: 85, relBP: 85,
        logs: ['방수벽 너머로 잔잔한 물결 소리가 들리며 생존이 시작되었다.'],
        lastEvent: null, lastOutcome: null,
        milestones: { m5: false, m10: false, m15: false },
        upgrades: { waterTank: false, greenhouse: false, reinforcedWall: false },
        flags: [], collection: ['버들가지 요람'], gameOver: false
    };
}

function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function clamp(n) { return Math.max(0, Math.min(100, n)); }
function nm(k) { return S?.names?.[k] || ({ a: 'A', b: 'B', pet: '보호자' }[k]); }
function traitTags(k) { return (S?.traits?.[k] || []).map(esc).join(' · '); }
function toast(t) {
    const x = document.createElement('div');
    x.className = 'toast'; x.textContent = t;
    document.body.appendChild(x);
    setTimeout(() => x.remove(), 2500);
}

// 현재 액티브 플레이어의 성향 체크
function hasTrait(traitName) {
    if (!S || !S.traits) return false;
    if (S.traits.pet.includes(traitName)) return true;
    if (S.mode === '2') return S.traits[S.selectedPlayer].includes(traitName);
    return S.traits.a.includes(traitName) || S.traits.b.includes(traitName);
}

// 턴 변경 탭 함수
window.selectPlayer = function(p) {
    if(S.mode !== '2') return;
    S.selectedPlayer = p;
    save(); render();
}

function setupView() {
    document.getElementById('app').innerHTML = `
    <main class="shell">
        <section class="paper setup">
            <div class="sub">WATERLINE · 생존 및 기지 건설 노벨</div>
            <h1>수면 아래 완벽한 방주,<br>짐승이 품은 두 아이.</h1>
            <p class="lead">선택하신 성향이 위험한 '잠수 파밍'과 탐험을 극복할 열쇠가 됩니다.<br>8일 차에 닥쳐올 대범람을 대비하여 기지를 보수하고 자원을 모으세요.</p>
            <div class="field full" style="background:#eef0e5; border:1px solid #b7cec7; padding:15px; margin-bottom:20px;">
                <label style="display:block; margin-bottom:10px;">플레이 모드 선택</label>
                <div style="display:flex; gap:20px;">
                    <label><input type="radio" name="playMode" value="1"> 1인용 (통합 조종/성향 공유)</label>
                    <label><input type="radio" name="playMode" value="2" checked> 2인용 (턴 직접 선택/각자 성향 적용)</label>
                </div>
            </div>
            <div class="formgrid">
                <div class="field"><label>첫 번째 아이</label><input id="na" maxlength="12" placeholder="첫째 이름"></div>
                <div class="field"><label>두 번째 아이</label><input id="nb" maxlength="12" placeholder="둘째 이름"></div>
                <div class="field full"><label>가족을 지키는 짐승 (보호자)</label><input id="np" maxlength="12" placeholder="이름 (예: 바론)"></div>
                ${traitPicker('a', '첫 번째 아이', traitPool, 3)}
                ${traitPicker('b', '두 번째 아이', traitPool, 3)}
                ${traitPicker('pet', '거대동물', petTraits, 3)}
            </div>
            <button class="primary start" id="start" style="margin-top: 30px;">소설 읽기 시작</button>
        </section>
    </main>`;
    
    ['na', 'nb', 'np'].forEach(id => document.getElementById(id).addEventListener('input', e => setup[{ na: 'a', nb: 'b', np: 'pet' }[id]] = e.target.value));
    
    document.querySelectorAll('.trait').forEach(b => b.onclick = () => {
        const k = b.dataset.k, t = b.dataset.t;
        let arr = setup.traits[k];
        if (arr.includes(t)) arr = arr.filter(x => x !== t);
        else if (arr.length < 3) arr = [...arr, t];
        setup.traits[k] = arr;
        document.querySelectorAll(`.trait[data-k="${k}"]`).forEach(x => x.classList.toggle('selected', arr.includes(x.dataset.t)));
    });
    
    document.getElementById('start').onclick = () => {
        setup.mode = document.querySelector('input[name="playMode"]:checked').value;
        const pools = { a: traitPool, b: traitPool, pet: petTraits };
        for (const k of ['a', 'b', 'pet']) { if (!setup.traits[k].length) setup.traits[k] = pools[k].slice(0, 3); }
        S = initState(); save(); render();
    };
}

function traitPicker(k, label, list, limit) {
    return `<div class="field"><label>${label}의 성향 <span class="pill">${limit}개 선택</span></label>
    <div class="traits" id="traits-${k}">
        ${list.map(t => `<button type="button" class="trait" data-k="${k}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}
    </div></div>`;
}

function checkMilestones() {
    if (S.discover >= 5 && !S.milestones.m5) { S.milestones.m5 = true; return events.main.find(e => e.id === 'milestone_1'); }
    if (S.discover >= 10 && !S.milestones.m10) { S.milestones.m10 = true; return events.main.find(e => e.id === 'milestone_2'); }
    if (S.discover >= 15 && !S.milestones.m15) { S.milestones.m15 = true; return events.main.find(e => e.id === 'milestone_3'); }
    return null;
}

function triggerGrowthModal() {
    S.ageStage++; S.ageText = S.ageStage === 2 ? '소년기' : '청년기';
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'growthModal';
    back.innerHTML = `
        <div class="modal paper" style="background:#fbf8ef; text-align:center;">
            <span class="tag" style="background:#2c7771; color:white;">시간 도약</span>
            <h3 style="font-family:'Gowun Batang'; font-size:24px; margin:10px 0;">시간이 흘러, ${S.ageText}가 되었습니다.</h3>
            <p style="color:#555; line-height:1.6; margin-bottom:20px;">각자 <b>새로운 성향을 1개씩</b> 선택해주세요.</p>
            <div style="text-align:left; margin-bottom:15px;">
                <b>${esc(nm('a'))}의 새 성향 선택</b>
                <div class="traits" id="growth-a" style="margin-top:5px;">
                    ${traitPool.filter(t => !S.traits.a.includes(t)).map(t => `<button type="button" class="trait growth-trait-a" data-t="${esc(t)}">${esc(t)}</button>`).join('')}
                </div>
            </div>
            <div style="text-align:left; margin-bottom:20px;">
                <b>${esc(nm('b'))}의 새 성향 선택</b>
                <div class="traits" id="growth-b" style="margin-top:5px;">
                    ${traitPool.filter(t => !S.traits.b.includes(t)).map(t => `<button type="button" class="trait growth-trait-b" data-t="${esc(t)}">${esc(t)}</button>`).join('')}
                </div>
            </div>
            <button class="primary" id="confirmGrowth" style="width:100%;" disabled>성장 완료</button>
        </div>`;
    document.body.appendChild(back);

    let selectedA = null; let selectedB = null;
    document.querySelectorAll('.growth-trait-a').forEach(btn => {
        btn.onclick = () => { document.querySelectorAll('.growth-trait-a').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); selectedA = btn.dataset.t; if (selectedA && selectedB) document.getElementById('confirmGrowth').disabled = false; };
    });
    document.querySelectorAll('.growth-trait-b').forEach(btn => {
        btn.onclick = () => { document.querySelectorAll('.growth-trait-b').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); selectedB = btn.dataset.t; if (selectedA && selectedB) document.getElementById('confirmGrowth').disabled = false; };
    });

    document.getElementById('confirmGrowth').onclick = () => {
        S.traits.a.push(selectedA); S.traits.b.push(selectedB);
        S.logs.unshift(`시간 도약: ${nm('a')} [${selectedA}], ${nm('b')} [${selectedB}] 성향 각성.`);
        document.getElementById('growthModal').remove(); save(); render();
    };
}

function checkEnding() {
    if (S.discover >= 20) {
        S.gameOver = true;
        let tone = S.flags.includes('hugged_pet') ? "서로를 깊이 안아준 채로," : "단단한 각오로,";
        S.lastOutcome = { title: "진실 엔딩: 영원한 방주", text: `모든 조각이 모였습니다. 옛 가주의 맹세, 요람의 진실, 고대 수문 제어권. ${nm('a')}와 ${nm('b')}는 ${tone} 이 저택의 새로운 주인이 되었습니다. ${nm('pet')}는 임무를 완수했다는 듯 발치에 엎드렸습니다. 이 수면 아래 세계는 영원히 당신들의 요새가 될 것입니다.` };
        return true;
    }
    if (S.house <= 0) { S.gameOver = true; S.lastOutcome = { title: "배드 엔딩: 무너진 안식처", text: "방수벽 이음새가 터지고 맙니다. 집을 버리고 도망쳐야 했습니다." }; return true; }
    if (S.food <= 0 && S.money <= 0) { S.gameOver = true; S.lastOutcome = { title: "배드 엔딩: 고단한 유랑", text: "식량과 재화가 바닥나 저택을 버리고 유랑길에 올랐습니다." }; return true; }
    if (S.day > 15) {
        S.gameOver = true;
        if (S.relAB >= 70 && S.relAP >= 75) S.lastOutcome = { title: "해피 엔딩: 평온한 나날", text: `15번의 계절이 지났습니다. 모든 진실을 밝혀내진 못했지만, 붉은 벽돌 저택 안에는 늘 따뜻한 가족의 온기가 가득합니다.` };
        else S.lastOutcome = { title: "노멀 엔딩: 물결치는 하루하루", text: "당장 굶주리진 않지만, 비밀도 유대도 애매하게 남겨둔 채 수로 도시의 고단한 삶이 이어집니다." };
        return true;
    }
    return false;
}

// 통합 Fx 적용 (에너지/기분 처리를 mode와 selectedPlayer에 맞게 라우팅)
function applyFxObj(fx) {
    if (!fx) return;
    const wFx = weatherInfo[S.weather].fx;
    const isOutdoor = placesInfo[S.place].isOutdoor;

    if (fx.money) S.money = Math.max(0, S.money + fx.money);
    if (fx.food) {
        let amt = fx.food;
        if (amt > 0 && wFx.gatherBonus && (S.place === '선착장' || S.place === '미지의 수로')) amt += 1;
        S.food = Math.max(0, S.food + amt);
    }
    if (fx.water) {
        let amt = fx.water;
        if (amt > 0 && wFx.rainBonus && S.place === '저택') amt += 2;
        S.water = Math.max(0, S.water + amt);
    }
    if (fx.scrap) {
        let amt = fx.scrap;
        if (amt > 0 && wFx.gatherBonus) amt += 1;
        S.scrap = Math.max(0, S.scrap + amt);
    }
    if (fx.house) S.house = clamp(S.house + fx.house);
    if (fx.rep) S.rep += fx.rep;
    if (fx.discover) S.discover += fx.discover;
    
    let energyMult = (isOutdoor && wFx.outdoorEnergyMult) ? wFx.outdoorEnergyMult : 1;

    // 통합 키워드 처리: energy, mood
    if (fx.energy) {
        let change = fx.energy;
        if (change < 0) change *= energyMult;
        if (S.mode === '2') {
            const eStr = S.selectedPlayer === 'a' ? 'energyA' : 'energyB';
            S[eStr] = clamp(S[eStr] + change);
        } else {
            S.energyA = clamp(S.energyA + change);
            S.energyB = clamp(S.energyB + change);
        }
    }
    if (fx.mood) {
        if (S.mode === '2') {
            const mStr = S.selectedPlayer === 'a' ? 'moodA' : 'moodB';
            S[mStr] = clamp(S[mStr] + fx.mood);
        } else {
            S.moodA = clamp(S.moodA + fx.mood);
            S.moodB = clamp(S.moodB + fx.mood);
        }
    }

    // 명시적 키워드 (a, b)
    if (fx.energyA) S.energyA = clamp(S.energyA + (fx.energyA < 0 ? fx.energyA * energyMult : fx.energyA));
    if (fx.energyB) S.energyB = clamp(S.energyB + (fx.energyB < 0 ? fx.energyB * energyMult : fx.energyB));
    if (fx.moodA) S.moodA = clamp(S.moodA + fx.moodA);
    if (fx.moodB) S.moodB = clamp(S.moodB + fx.moodB);

    if (fx.petEnergy) S.petEnergy = clamp(S.petEnergy + fx.petEnergy);
    if (fx.petMood) S.petMood = clamp(S.petMood + fx.petMood);
    if (fx.relAB) S.relAB = clamp(S.relAB + fx.relAB);
    if (fx.relAP) S.relAP = clamp(S.relAP + fx.relAP);
    if (fx.relBP) S.relBP = clamp(S.relBP + fx.relBP);
    if (fx.flags) fx.flags.forEach(flag => { if (!S.flags.includes(flag)) S.flags.push(flag); });
}

function consumeTurnAndRender() {
    S.turn++;
    if (S.turn >= 8) endDay();
    else { save(); render(); }
}

function action(title, desc, fn) {
    if (S.gameOver) return;
    if (S.turn >= 8) { toast('오늘의 행동력을 모두 사용했습니다.'); return; }
    S.lastOutcome = null; 
    
    const before = { money: S.money, food: S.food, water: S.water, house: S.house, scrap: S.scrap, discover: S.discover };
    let passiveLog = '';
    const wFx = weatherInfo[S.weather].fx;

    if (S.place === '저택') { applyFxObj({ mood: 2 }); passiveLog += " (저택 안락함: 기분 회복)"; }
    else if (S.place === '시장') { applyFxObj({ energy: -1 }); if(Math.random() < 0.2) { S.discover += 1; passiveLog += " (시장 소문: 단서 획득!)"; } }
    else if (S.place === '기록관') { applyFxObj({ energy: -2 }); passiveLog += " (집중력 소모)"; }
    else if (S.place === '선착장') { S.petMood = clamp(S.petMood + 4); passiveLog += " (물가 냄새: 짐승 기분 상승)"; }
    
    if (wFx.moodDrain && placesInfo[S.place].isOutdoor) { applyFxObj({ mood: -2 }); passiveLog += " (안개 우울감)"; }

    fn();
    
    const fx = {}; Object.keys(before).forEach(k => { const d = S[k] - before[k]; if (d) fx[k] = d; });
    S.lastOutcome = { title: title, text: desc + passiveLog, changes: changeSummary(fx) };
    
    let actorName = S.mode === '2' ? nm(S.selectedPlayer) : '가족';
    S.logs.unshift(`${S.day}일 · ${actorName}의 행동: ${title}`);
    consumeTurnAndRender();
}

// ----------------------------------------------------
// 신규 미니게임: 심해 잠수 파밍 (노가다 시스템)
// ----------------------------------------------------
let diveState = { depth: 0, scrap: 0, food: 0 };

window.openDiveModal = function() {
    if (S.turn >= 8) { toast('행동력이 부족합니다.'); return; }
    diveState = { depth: 1, scrap: 0, food: 0 };
    renderDiveModal();
};

function renderDiveModal() {
    let back = document.getElementById('diveModal');
    if (!back) {
        back = document.createElement('div');
        back.className = 'modalback'; back.id = 'diveModal';
        document.body.appendChild(back);
    }
    
    const isClear = weatherInfo[S.weather].fx.gatherBonus;
    const baseChance = 80 - (diveState.depth * 15);
    const traitBonus = hasTrait('물 좋아함') ? 15 : (hasTrait('직감') ? 10 : 0);
    const weatherBonus = isClear ? 10 : 0;
    const successChance = Math.max(10, Math.min(100, baseChance + traitBonus + weatherBonus));

    back.innerHTML = `
        <div class="modal paper" style="background:#f4f0e6; text-align:center;">
            <h3 style="font-family:'Gowun Batang'; font-size:22px; margin-bottom:5px;">🌊 수중 파밍 (노가다)</h3>
            <p style="color:#8a5145; font-size:0.9rem; margin-bottom:20px;">
                더 깊이 잠수할수록 보상이 누적되지만,<br>실패하면 보상을 전부 잃고 체력만 크게 깎입니다!<br>
                <small>(※ 턴은 탐험을 마칠 때 1회만 소모됩니다.)</small>
            </p>
            
            <div style="background:#2c7771; color:white; padding:15px; border-radius:8px; margin-bottom:20px;">
                <div style="font-size:1.2rem; font-weight:bold;">현재 수심: ${diveState.depth} M</div>
                <div style="margin-top:10px;">누적 보상: <b>부품 ${diveState.scrap}개</b> | <b>식량 ${diveState.food}개</b></div>
            </div>
            
            <div style="font-size:0.95rem; color:#333; margin-bottom:15px;">
                다음 수심 돌파 성공 확률: <b style="color:${successChance > 50 ? 'green' : 'red'};">${successChance}%</b><br>
                <small style="color:#666;">(성향 및 날씨 보너스 적용됨)</small>
            </div>
            
            <div style="display:flex; gap:10px; flex-direction:column;">
                <button class="primary" onclick="diveDeeper(${successChance})" style="font-size:1.1rem; background:#1e524e;">위험 감수: 더 깊이 잠수하기</button>
                <button class="action" onclick="diveStop()" style="background:#d4af37; border:none; color:#123d3a;"><b>수면으로 상승 (보상 획득 및 종료)</b></button>
            </div>
            <button class="secondary" style="width:100%; margin-top:15px;" onclick="document.getElementById('diveModal').remove()">아무것도 안 하고 닫기</button>
        </div>`;
}

window.diveDeeper = function(chance) {
    const roll = Math.random() * 100;
    if (roll <= chance) {
        // 성공
        diveState.depth++;
        diveState.scrap += Math.floor(Math.random() * 2) + 1; // 1~2개
        diveState.food += Math.floor(Math.random() * 2);      // 0~1개
        renderDiveModal();
    } else {
        // 실패
        document.getElementById('diveModal').remove();
        action("수중 파밍 실패", `숨이 막혀 황급히 수면으로 올라왔습니다. 모았던 자원을 모두 잃었습니다!`, () => {
            applyFxObj({ energy: -4, mood: -2 });
        });
    }
};

window.diveStop = function() {
    document.getElementById('diveModal').remove();
    if (diveState.scrap === 0 && diveState.food === 0) {
        toast('얻은 것이 없습니다.'); return;
    }
    action(`수중 파밍 완료 (수심 ${diveState.depth}M)`, `안전하게 수면으로 올라와 자원을 챙겼습니다!`, () => {
        applyFxObj({ scrap: diveState.scrap, food: diveState.food, energy: -2 });
    });
};

// ----------------------------------------------------

window.openCookModal = function() {
    if (S.food < 3 || S.water < 2) { toast('식량 3, 식수 2가 필요합니다.'); return; }
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'cookModal';
    back.innerHTML = `
        <div class="modal paper" style="background:#fdfaf3; text-align:center;">
            <h3 style="font-family:'Gowun Batang'; font-size:22px;">🍳 가족 특식 요리</h3>
            <p style="color:#555;">어떤 재료를 중심으로 만찬을 준비할까요?<br>(식량 3, 식수 2, 행동력 1 소모)</p>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                <button class="action" onclick="finishCook('고기 중심', '구운 고기와 진한 스튜', 8, 4)" style="background:#8a5145; color:white; border:none;">🥩 고기 듬뿍 특식 (체력 대폭 회복)</button>
                <button class="action" onclick="finishCook('채소 중심', '신선한 샐러드와 수프', 4, 8)" style="background:#2c7771; color:white; border:none;">🥗 신선한 채소 요리 (기분 대폭 회복)</button>
                <button class="action" onclick="finishCook('생선 중심', '물고기 구이와 맑은 탕', 6, 6)" style="background:#4b675d; color:white; border:none;">🐟 갓 잡은 생선 요리 (균형 잡힌 회복)</button>
            </div>
            <button class="secondary" style="width:100%; margin-top:15px;" onclick="document.getElementById('cookModal').remove()">취소</button>
        </div>`;
    document.body.appendChild(back);
};

window.finishCook = function(type, dishName, energyBonus, moodBonus) {
    document.getElementById('cookModal').remove();
    let bonusText = ""; let rel = 4;
    if (hasTrait('다정함')) { rel += 3; bonusText = " [다정함 보너스]"; }
    action(`특식 요리: ${type}`, `가족이 모여 앉아 <b>${dishName}</b>를 배불리 먹었습니다!${bonusText}`, () => { 
        applyFxObj({ food: -3, water: -2, energy: energyBonus, mood: moodBonus, relAB: rel, petMood: 5, petEnergy: 5 }); 
    });
};

window.openPokerModal = function() {
    if (S.money < 3) { toast('판돈(재화 3)이 부족합니다.'); return; }
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'pokerModal';
    back.innerHTML = `
        <div class="modal paper" style="background:#f4f0e6; text-align:center;">
            <h3 style="font-family:'Gowun Batang'; font-size:22px; margin-bottom:5px;">🃏 물빛 포커 (턴 소모 X)</h3>
            <p style="color:#8a5145; font-size:0.9rem; margin-bottom:20px;">판돈: <b>재화 3</b> | 승리 시 <b>재화 6</b> 획득<br>상인보다 높은 숫자를 뽑으세요!</p>
            <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:20px;">
                <div style="background:#fff; border:2px solid #ccc; border-radius:8px; padding:20px; width:40%;">
                    <div style="font-size:0.8rem; color:#888;">내 카드</div>
                    <div id="myCard" style="font-size:36px; font-weight:bold;">?</div>
                </div>
                <div style="font-size:24px; font-weight:bold; color:#8a5145;">VS</div>
                <div style="background:#fff; border:2px solid #ccc; border-radius:8px; padding:20px; width:40%;">
                    <div style="font-size:0.8rem; color:#888;">상인 카드</div>
                    <div id="dealerCard" style="font-size:36px; font-weight:bold;">?</div>
                </div>
            </div>
            <button class="primary" id="playPokerBtn" style="width:100%; font-size:1.1rem; background:#d4af37; color:#123d3a;">승부하기 (판돈 내기)</button>
            <button class="secondary" style="width:100%; margin-top:10px;" onclick="document.getElementById('pokerModal').remove()">도박장 나가기</button>
            <div id="pokerResult" style="margin-top:15px; font-weight:bold; height:20px;"></div>
        </div>`;
    document.body.appendChild(back);

    document.getElementById('playPokerBtn').onclick = function() {
        if (S.money < 3) { document.getElementById('pokerResult').innerText = "돈이 부족합니다!"; return; }
        S.money -= 3; 
        let myVal = Math.floor(Math.random() * 10) + 1;
        let dealerVal = Math.floor(Math.random() * 10) + 1;
        if (hasTrait('장난기') && Math.random() < 0.3) myVal += 2; // 장난기 사기
        
        document.getElementById('myCard').innerText = myVal;
        document.getElementById('dealerCard').innerText = dealerVal;
        
        const resDiv = document.getElementById('pokerResult');
        if (myVal > dealerVal) {
            S.money += 6; resDiv.innerHTML = `<span style="color:green;">승리! 재화 6을 획득했습니다.</span>`;
            S.logs.unshift(`${S.day}일 · 도박 승리! 재화를 벌어들였다.`);
        } else if (myVal === dealerVal) {
            S.money += 3; resDiv.innerHTML = `<span style="color:#555;">무승부! 판돈을 돌려받았습니다.</span>`;
        } else {
            resDiv.innerHTML = `<span style="color:red;">패배... 판돈을 잃었습니다.</span>`;
            S.logs.unshift(`${S.day}일 · 도박 패배. 돈을 날렸다.`);
        }
        save();
        document.getElementById('moneyStat').innerText = S.money; // UI 부분 갱신
    };
};

window.openUpgradeModal = function() {
    const back = document.createElement('div');
    back.className = 'modalback'; back.id = 'upgradeModal';
    let html = `
        <div class="modal paper" style="background:#fbf8ef;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="font-family:'Gowun Batang'; font-size:22px; margin:0;">저택 설비 업그레이드</h3>
                <span class="tag" style="background:#8a5145; color:white;">부품: ${S.scrap} | 돈: ${S.money}</span>
            </div>
            <p style="color:#555; font-size:0.9rem; line-height:1.5; margin:10px 0 20px;">영구적인 설비를 건설합니다. (턴 소모 X)</p>
            <div style="display:flex; flex-direction:column; gap:12px;">`;
    Object.keys(upgradesInfo).forEach(key => {
        const u = upgradesInfo[key]; const isBuilt = S.upgrades[key];
        const costStr = (u.cost.scrap ? `부품 ${u.cost.scrap}` : '') + (u.cost.money ? ` | 돈 ${u.cost.money}` : '');
        const canAfford = (!u.cost.scrap || S.scrap >= u.cost.scrap) && (!u.cost.money || S.money >= u.cost.money);
        if (isBuilt) html += `<button class="action" disabled style="background:#eaf4f1; border-color:#2c7771; opacity:0.8;"><b>✔️ 건설 완료: ${u.name}</b><small>${u.desc}</small></button>`;
        else html += `<button class="action dynamic-action" style="text-align:left; border-left:4px solid ${canAfford ? '#d4af37' : '#ccc'};" ${canAfford ? `onclick="buildUpgrade('${key}')"` : 'disabled'}>
                <b>${u.name} 건설</b><small style="color:#b8860b; font-weight:bold;">[필요: ${costStr}]</small><small>${u.desc}</small></button>`;
    });
    html += `</div><button class="secondary" style="width:100%; margin-top:20px;" onclick="document.getElementById('upgradeModal').remove(); render();">닫기</button></div>`;
    back.innerHTML = html; document.body.appendChild(back);
};

window.buildUpgrade = function(key) {
    const u = upgradesInfo[key];
    if (u.cost.scrap) S.scrap -= u.cost.scrap;
    if (u.cost.money) S.money -= u.cost.money;
    S.upgrades[key] = true;
    toast(`[${u.name}] 건설 완료!`); S.logs.unshift(`저택에 [${u.name}] 설비를 완성했다.`);
    document.getElementById('upgradeModal').remove(); openUpgradeModal();
};

function forceEncounter() {
    if (S.gameOver || S.turn >= 8) return;
    let pool = randomEncounters;
    if (S.place !== '미지의 수로') pool = randomEncounters.filter(e => !e.reqPlace);
    S.lastEvent = pool[Math.floor(Math.random() * pool.length)];
    S.logs.unshift(`${S.day}일 · 탐험 중 무언가와 마주쳤다.`);
    save(); render();
}

function getContextualActions() {
    let btns = ''; const p = S.place;
    const isRaining = S.weather === '거센 비';
    
    if (p === '미지의 수로') {
        btns += `<button class="action dynamic-action" style="background:#1e524e; color:white; border-color:#2c7771;" onclick="openDiveModal()">
            <b style="color:white;">🌊 수중 파밍 (Push your luck)</b><small style="color:#d9e3df;">더 깊이 잠수하여 대박을 노리세요.</small></button>`;
        btns += `<button class="action dynamic-action" style="background:#8a5145; color:white; border-color:#5c342b;" onclick="forceEncounter()">
            <b style="color:white;">⚠️ 폐쇄 구역 탐험 (위험)</b><small style="color:#f5f0e4;">이곳에선 쉴 수 없습니다. 위험한 사건 조우.</small></button>`;
        return btns;
    }

    if (p === '저택') {
        btns += `<button class="action dynamic-action" style="background:#f4f0e6; border-color:#ad8950;" onclick="openUpgradeModal()">
            <b style="color:#8a5145;">🛠️ 기지 설비 업그레이드 (턴 소모 X)</b><small>부품을 소모해 저택에 영구 설비를 짓습니다.</small></button>`;
        btns += `<button class="action dynamic-action" onclick="openCookModal()"><b>🍳 가족 특식 요리하기</b><small>식량 3, 식수 2 소모. 메뉴를 직접 정합니다.</small></button>`;
        btns += `<button class="action dynamic-action" data-room="수면 아래 방 조사"><b>안전한 집 안 탐색</b><small>단서 획득, 방수 1 소모. (호기심 보너스)</small></button>`;
        btns += `<button class="action dynamic-action" data-room="방수벽 보수 및 정화"><b>방수 보수 및 정화</b><small>활력 소모. ${isRaining ? '<span style="color:blue;">(비오는 날: 식수 보너스)</span>' : ''}</small></button>`;
    } else if (p === '시장') {
        btns += `<button class="action dynamic-action" style="background:#fffcf0; border-color:#d4af37;" onclick="openPokerModal()">
            <b style="color:#b8860b;">🃏 물빛 포커 도박장 (턴 소모 X)</b><small>돈 3을 걸고 승부를 벌입니다. (장난기 보너스)</small></button>`;
        btns += `<button class="action dynamic-action" data-room="상점에서 식량 구매"><b>상점에서 장보기</b><small>재화 4 소모. 식량 5 획득</small></button>`;
        btns += `<button class="action dynamic-action" data-room="상인 일손 돕기"><b>안전한 일손 돕기</b><small>활력 소모. 재화 획득. (사교적 보너스)</small></button>`;
    } else if (p === '기록관') {
        btns += `<button class="action dynamic-action" data-room="도시 건축 기록 조사"><b>기록 조사하기</b><small>활력 소모. 단서 2 획득</small></button>`;
    } else if (p === '선착장') {
        btns += `<button class="action dynamic-action" style="background:#1e524e; color:white; border-color:#2c7771;" onclick="openDiveModal()">
            <b style="color:white;">🌊 수중 파밍 (Push your luck)</b><small style="color:#d9e3df;">더 깊이 잠수하여 대박을 노리세요.</small></button>`;
        btns += `<button class="action dynamic-action" style="background:#2c7771; color:white;" onclick="forceEncounter()">
            <b style="color:white;">🔥 무작위 파밍 및 탐험</b><small style="color:#d9e3df;">주변을 탐색하여 무작위 사건을 마주합니다.</small></button>`;
    }
    return btns;
}

function doRoom(type) {
    if (type === '수면 아래 방 조사') {
        let bonus = ""; let disc = 1;
        if (hasTrait('호기심')) { disc += 1; bonus = " [호기심 보너스]"; }
        action(type, "안전한 저택에서 숨겨진 기록을 찾았습니다." + bonus, () => { applyFxObj({ discover: disc, house: -1, energy: -1 }); });
    } else if (type === '방수벽 보수 및 정화') {
        let bonus = ""; let houseRep = 6;
        if (hasTrait('꼼꼼함')) { houseRep += 3; bonus = " [꼼꼼함 보너스]"; }
        action(type, '이음새를 보수하고 필터로 식수를 얻어냅니다.' + bonus, () => { applyFxObj({ house: houseRep, water: 4, energy: -2 }); });
    } else if (type === '상점에서 식량 구매') {
        if (S.money >= 4) { action(type, '시장에서 신선한 식재료를 샀습니다.', () => { applyFxObj({ money: -4, food: 5 }); }); }
        else { toast('재화가 부족합니다.'); }
    } else if (type === '상인 일손 돕기') {
        let bonus = ""; let moneyEarn = 5;
        if (hasTrait('사교적')) { moneyEarn += 2; bonus = " [사교적 보너스]"; }
        action(type, '상인을 돕고 수고비를 받았습니다.' + bonus, () => { applyFxObj({ money: moneyEarn, rep: 1, energy: -2 }); });
    } else if (type === '도시 건축 기록 조사') {
        action(type, '수몰 역사의 조각을 맞춥니다.', () => { applyFxObj({ discover: 2, energy: -2 }); });
    }
}

function travel(place) {
    if (S.gameOver || S.turn >= 8) return;
    if (S.place === place) { toast(`지금은 ${place}에 있습니다.`); return; }
    if (S.lastEvent) { toast('눈앞의 상황을 먼저 해결해야 합니다.'); return; }
    S.place = place;
    S.logs.unshift(`${S.day}일 · ${place}(으)로 이동`);
    consumeTurnAndRender();
    toast(`${place}에 도착했습니다.`);
}

function choose(i) {
    const e = S.lastEvent; if (!e) return;
    const c = e.choices[i];
    if (c.reqTrait && !hasTrait(c.reqTrait)) { toast(`[${c.reqTrait}] 성향이 부족합니다.`); return; }
    
    S.lastEvent = null;
    const before = { money: S.money, food: S.food, water: S.water, house: S.house, scrap: S.scrap, discover: S.discover };
    applyFxObj(c.fx);
    const fxObj = {}; Object.keys(before).forEach(k => { const d = S[k] - before[k]; if (d) fxObj[k] = d; });
    
    S.lastOutcome = { title: c.t, text: c.tone || '어떤 결과를 부를지 모릅니다.', changes: changeSummary(fxObj) };
    S.logs.unshift(`${S.day}일 · 결단: ${c.t}`);
    
    if (e.id === 'crisis_flood') {
        if (S.turn >= 8) endDay(); else { save(); render(); }
        return;
    }
    
    let nextMainEvent = checkMilestones();
    if (nextMainEvent) { S.lastEvent = nextMainEvent; save(); render(); return; }
    
    consumeTurnAndRender();
}

function changeSummary(fx) {
    const out = []; const names = { money: '재화', food: '식량', water: '식수', house: '방수 상태', scrap: '부품', discover: '진실' };
    Object.keys(names).forEach(k => { if (fx[k]) out.push(`${names[k]} ${fx[k] > 0 ? '+' : ''}${fx[k]}`); });
    return out.slice(0, 5);
}

function endDay() {
    if (checkEnding()) { save(); render(); return; }
    S.food = Math.max(0, S.food - 2); S.water = Math.max(0, S.water - 2);
    if (!S.upgrades.reinforcedWall) S.house = clamp(S.house - 1);
    
    S.weather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    if (S.upgrades.waterTank) S.water += 2;
    if (S.upgrades.greenhouse) S.food += 2;

    S.day++; S.turn = 0; S.place = '저택';
    toast(`새로운 하루 · DAY ${S.day}`);

    if (S.day === 8 && !S.flags.includes('crisis_flood_done')) {
        S.flags.push('crisis_flood_done'); S.lastEvent = crisisEvent;
        save(); render(); return;
    }
    
    if (S.day === 6 || S.day === 11) { triggerGrowthModal(); return; }

    let nextMainEvent = checkMilestones();
    if (nextMainEvent) S.lastEvent = nextMainEvent;
    if (checkEnding()) { save(); render(); return; }
    save(); render();
}

function newGame() {
    if (confirm('현재 이야기를 지우고 새로운 책을 펼칠까요?')) { localStorage.removeItem(KEY); S = null; setupView(); }
}

function render() {
    if (!S) { setupView(); return; }
    const progressPercent = Math.min(100, (S.discover / 20) * 100);
    const e = S.lastEvent;
    
    const activeUpgrades = Object.keys(upgradesInfo).filter(k => S.upgrades[k]).map(k => `<span class="pill" style="margin:2px; background:#d4af37; color:white;">🛠️ ${upgradesInfo[k].name}</span>`);
    const invItems = S.collection.map(x => `<span class="pill" style="margin:2px; background:#2c7771; color:white;">${esc(x)}</span>`);
    const inventoryHtml = [...activeUpgrades, ...invItems].join('') || '<small class="muted">가진 물건이 없습니다.</small>';
    
    const isEventActive = e ? true : false;
    
    // 2인용 모드 시 턴을 자유롭게 선택할 수 있는 탭 UI 추가
    let turnAlertHtml = '';
    if (S.mode === '2' && !S.gameOver) {
        turnAlertHtml = `
            <div style="background:#eef0e5; border:1px solid #b7cec7; border-radius:8px; padding:12px; margin-bottom:15px; text-align:center;">
                <span style="font-weight:bold; font-size:1.05rem; color:#17332f; display:block; margin-bottom:8px;">어느 캐릭터로 행동할지 선택하세요</span>
                <div style="display:flex; justify-content:center; gap:10px;">
                    <button onclick="selectPlayer('a')" style="flex:1; padding:8px; border-radius:6px; font-weight:bold; border:2px solid ${S.selectedPlayer === 'a' ? '#2c7771' : '#ccc'}; background:${S.selectedPlayer === 'a' ? '#eaf4f1' : '#fff'}; color:${S.selectedPlayer === 'a' ? '#123d3a' : '#888'};">👤 ${esc(nm('a'))}</button>
                    <button onclick="selectPlayer('b')" style="flex:1; padding:8px; border-radius:6px; font-weight:bold; border:2px solid ${S.selectedPlayer === 'b' ? '#2c7771' : '#ccc'}; background:${S.selectedPlayer === 'b' ? '#eaf4f1' : '#fff'}; color:${S.selectedPlayer === 'b' ? '#123d3a' : '#888'};">👤 ${esc(nm('b'))}</button>
                </div>
                <small style="display:block; margin-top:8px; color:#555;">선택된 캐릭터의 성향과 체력만 영향을 미칩니다.</small>
            </div>
        `;
    }

    const w = weatherInfo[S.weather];
    const weatherHtml = `<div style="background:#2b3a42; color:#fff; padding:12px 15px; border-radius:8px; margin-bottom:15px; display:flex; flex-direction:column; gap:4px;">
        <div style="font-weight:bold; font-size:1.1rem;">🌤️️ 오늘의 날씨: ${S.weather}</div><div style="font-size:0.9rem; color:#b0c4de;">${w.desc}</div></div>`;

    document.getElementById('app').innerHTML = `
    <main class="shell">
        <div class="topbar">
            <div><div class="logo">WATERLINE</div><div class="sub">생존 및 기지 건설 · DAY ${S.day} / 15 (${S.ageText})</div></div>
            <div class="clock"><div class="sub">남은 행동력</div><b>${8 - S.turn} / 8</b></div>
        </div>
        <div class="layout">
            <section>
                ${weatherHtml}${turnAlertHtml}
                <div class="stats">
                    <div class="stat"><small>재화</small><b id="moneyStat">${S.money}</b></div>
                    <div class="stat"><small>식량</small><b>${S.food}</b></div>
                    <div class="stat"><small>식수</small><b>${S.water}</b></div>
                    <div class="stat"><small>부품</small><b style="color:#8a5145;">${S.scrap}</b></div>
                    <div class="stat"><small>방수 상태</small><b>${S.house}/100</b></div>
                </div>
                <div class="card" style="margin-top:12px; border-left: 4px solid #8a5145;">
                    <h3>진실을 향한 조각 (${S.discover} / 20)</h3><div class="meter"><i style="width:${progressPercent}%"></i></div>
                </div>
                <div class="card" style="margin-top:12px; ${isEventActive ? 'border: 2px solid #2c7771; background: #fdfaf3;' : ''}">
                    ${S.gameOver ? `<div class="event"><span class="tag">이야기의 끝</span><h2>${S.lastOutcome.title}</h2><p style="font-size: 1.1rem; line-height: 1.8;">${S.lastOutcome.text}</p></div>` : 
                      (e ? eventHtml(e) : `<div class="event"><span class="tag">안전 구역</span><h2>정비 및 탐험</h2><p>현재 <b>${esc(S.place)}</b>입니다. 정비를 취하거나 미니게임, 부품 파밍을 하세요.</p></div>`)}
                    ${!S.gameOver && S.lastOutcome && !e ? outcomeHtml(S.lastOutcome) : ''}
                    ${!S.gameOver && !e ? `<div style="margin-top:20px; border-top: 1px dashed #d8cfbd; padding-top: 14px;"><div class="section-head"><h3>행동하기</h3></div><div class="actions">${getContextualActions()}</div></div>` : ''}
                </div>
            </section>
            <aside>
                <div class="card"><h3>가족 상태</h3><div class="family">${personHtml('a', S.moodA, S.energyA, S.mode === '2' && S.selectedPlayer === 'a')}${personHtml('b', S.moodB, S.energyB, S.mode === '2' && S.selectedPlayer === 'b')}${personHtml('pet', S.petMood, S.petEnergy, false)}</div></div>
                ${!S.gameOver ? `<div class="card" style="margin-top:12px"><h3>장소 이동</h3><div class="actions">${Object.keys(placesInfo).map(p => `<button class="action place-btn ${S.place === p ? 'current-place' : ''}" data-place="${p}"><b>${placesInfo[p].label}</b><small>${placesInfo[p].desc}</small></button>`).join('')}</div></div>` : ''}
                <div class="card" style="margin-top:12px"><h3>설비 및 가방</h3><div style="margin-top: 8px;">${inventoryHtml}</div></div>
                <div class="card" style="margin-top:12px"><h3>최근 기록</h3><div class="log">${S.logs.slice(0, 5).map(x => `<div class="logitem">${esc(x)}</div>`).join('')}</div></div>
                <div class="footer-actions"><button class="secondary" onclick="newGame()">처음부터 다시 읽기</button></div>
            </aside>
        </div>
    </main>`;
    bindChoices();
}

function eventHtml(e) {
    return `<div class="event"><span class="tag" style="background: #17332f; color: white;">${e.tags ? e.tags.join(', ') : '사건 발생'}</span><h2 style="font-size: 1.5rem; margin-top: 10px;">${esc(e.title)}</h2><p style="font-size: 1.1rem; line-height: 1.8; color: #333;">${esc(e.text)}</p>
        <div class="choices" style="margin-top: 20px;">
            ${e.choices.map((c, i) => {
                if (c.reqTrait) {
                    if (!hasTrait(c.reqTrait)) return `<button class="choice" disabled style="border-left: 4px solid #888; background: #eaeaea; opacity: 0.6;"><b style="color: #666;">[필요 성향: ${c.reqTrait}] 선택 불가</b><br><small>현재 선택된 캐릭터에게 해당 성향이 없습니다.</small></button>`;
                    return `<button class="choice" data-i="${i}" style="border-left: 4px solid #d4af37;"><b><span style="color:#b8860b;">[히든 해금: ${c.reqTrait}]</span>${esc(c.t)}</b></button>`;
                }
                return `<button class="choice" data-i="${i}" style="border-left: 4px solid #2c7771;"><b>${esc(c.t)}</b></button>`;
            }).join('')}
        </div></div>`;
}

function outcomeHtml(o) {
    return `<div class="outcome-card" style="background: #f4f7f6;"><span class="tag">결과</span><div class="outcome-title" style="font-size: 1.2rem;">${esc(o.title)}</div><div class="outcome-text" style="font-size: 1.05rem; line-height:1.7; margin-top:8px; color: #444;">${esc(o.text)}</div>${o.changes?.length ? `<div class="outcome-changes" style="margin-top: 15px;">${o.changes.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}</div>`;
}

function personHtml(k, m, e, isSelected) {
    let borderStyle = isSelected ? 'border: 2px solid #2c7771; background: #eaf4f1;' : '';
    return `<div class="person" style="${borderStyle}"><div class="personline"><b>${esc(nm(k))}</b> ${isSelected ? '<span class="pill" style="background:#2c7771; color:white;">선택됨</span>' : ''}</div><div class="traitsline">${traitTags(k)}</div><div class="meter"><i style="width:${m}%"></i></div><div class="traitsline">기분 ${m} · 체력 ${e}</div></div>`;
}

function bindChoices() {
    document.querySelectorAll('.choice[data-i]').forEach(b => b.onclick = () => choose(+b.dataset.i));
    document.querySelectorAll('.place-btn[data-place]').forEach(b => b.onclick = () => travel(b.dataset.place));
    document.querySelectorAll('.dynamic-action[data-room]').forEach(b => b.onclick = () => doRoom(b.dataset.room));
}

window.travel = travel; window.doRoom = doRoom; window.newGame = newGame; window.forceEncounter = forceEncounter;
if (S) render(); else setupView();
})();

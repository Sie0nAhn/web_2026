let DESIGNERS = [];

// 1. CSV 데이터 로드 및 초기화
window.addEventListener('DOMContentLoaded', () => {
    fetch('2026_web.csv')
        .then(response => {
            if (!response.ok) throw new Error('CSV 파일을 찾을 수 없습니다.');
            return response.text();
        })
        .then(csvString => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // CSV 열 제목에 맞춰 데이터 매핑
                    DESIGNERS = results.data.map(row => ({
                        name: row['이름'] || '',
                        engName: row['영문이름'] || '',
                        track: row['트랙'] || '',
                        workTitle: row['작품명'] || '',
                        booth: row['부스번호'] || '',
                        msg: row['한마디'] || ''
                    }));
                    
                    // 데이터 로드 후 화면 렌더링
                    initApp();
                }
            });
        })
        .catch(err => console.error('데이터 로드 실패:', err));
});

function initApp() {
    renderGrid();
    renderWorks('all');
    renderBooth();
    renderMsgs();
}

// 2. 페이지 전환 함수 (원본 로직 유지)
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
    
    window.scrollTo(0, 0);
}

// 3. 메인 그리드 (원본 클래스명 .designer-card, .card-track 등 100% 복구)
function renderGrid() {
    const container = document.getElementById('designer-grid');
    if (!container) return;
    
    container.innerHTML = DESIGNERS.map(d => `
        <div class="designer-card" onclick="showDesignerDetail('${d.name}')">
            <div class="card-track">${d.track}</div>
            <div class="card-name">${d.name}</div>
            <div class="card-eng">${d.engName}</div>
        </div>
    `).join('');
}

// 4. 작품 리스트 필터링
function filterWorks(track, btn) {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderWorks(track);
}

// 5. 작품 리스트 (원본 클래스명 .work-item, .work-header 등 100% 복구)
function renderWorks(filter) {
    const container = document.getElementById('works-list');
    if (!container) return;
    
    const data = filter === 'all' ? DESIGNERS : DESIGNERS.filter(d => d.track === filter);
    
    container.innerHTML = data.map(d => `
        <div class="work-item">
            <div class="work-header">
                <span class="work-tag">${d.track}</span>
                <h2 class="work-title">${d.workTitle}</h2>
                <p class="work-author">${d.name} / ${d.engName}</p>
            </div>
            <div class="work-visual">
                <div class="placeholder-box">IMAGE</div>
            </div>
            <div class="work-description">
                <p>${d.msg}</p>
            </div>
        </div>
    `).join('');
}

// 6. 부스 정보 (원본 구조 유지)
function renderBooth() {
    const container = document.getElementById('booth-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="booth-container">
            ${DESIGNERS.map(d => `
                <div class="booth-item">
                    <span class="booth-num">${d.booth}</span>
                    <span class="booth-name">${d.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// 7. 디자이너 상세 보기 (필요한 경우 구현)
function showDesignerDetail(name) {
    console.log(name + " 디자이너 상세 페이지로 이동 로직");
    // 상세 페이지 구현 방식에 따라 추가 가능
}
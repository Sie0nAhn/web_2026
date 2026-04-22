let DESIGNERS = [];

// 1. CSV 데이터 로드 (HTML에 PapaParse 라이브러리가 연결되어 있어야 합니다)
window.addEventListener('DOMContentLoaded', () => {
    fetch('2026_web.csv')
        .then(response => {
            if (!response.ok) throw new Error('CSV 파일을 찾을 수 없습니다.');
            return response.text();
        })
        .then(csvString => {
            Papa.parse(csvString, {
                header: true,         // 첫 줄을 제목으로 인식
                skipEmptyLines: true, // 빈 줄 제외
                complete: function(results) {
                    // [데이터 매핑] CSV의 열 제목(이름, 영문이름, 트랙 등)을 속성에 맞게 연결합니다.
                    DESIGNERS = results.data.map(row => ({
                        name: row['이름'] || '',
                        engName: row['영문이름'] || '',
                        track: row['트랙'] || '',
                        workTitle: row['작품명'] || '',
                        booth: row['부스번호'] || '',
                        msg: row['한마디'] || ''
                    }));
                    
                    // 데이터 로드가 완료된 후, 원본 초기화 함수들을 실행합니다.
                    initSite();
                }
            });
        })
        .catch(err => console.error('데이터 로드 실패:', err));
});

// 초기화 함수: 원본 화면들을 처음으로 그립니다.
function initSite() {
    renderGrid();
    renderWorks('all');
    renderBooth();
    renderMsgs();
}

// --- 아래는 "이게 진짜.html" 원본에 있던 모든 기능을 그대로 옮긴 것입니다 ---

// 페이지 전환 기능
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
    
    window.scrollTo(0, 0);
}

// 메인 그리드 (디자이너 리스트)
function renderGrid() {
    const container = document.getElementById('designer-grid');
    if (!container) return;
    
    container.innerHTML = DESIGNERS.map(d => `
        <div class="designer-card">
            <div class="card-track">${d.track}</div>
            <div class="card-name">${d.name}</div>
            <div class="card-eng">${d.engName}</div>
        </div>
    `).join('');
}

// 작품 필터링 버튼 클릭 시 실행
function filterWorks(track, btn) {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    renderWorks(track);
}

// 작품 리스트 출력
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
        </div>
    `).join('');
}

// 부스 배치 정보
function renderBooth() {
    const container = document.getElementById('booth-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="booth-layout">
            ${DESIGNERS.map(d => `
                <div class="booth-info">
                    <strong>${d.booth}</strong> ${d.name}
                </div>
            `).join('')}
        </div>
    `;
}

// 방명록/한마디 출력
function renderMsgs() {
    const container = document.getElementById('guestbook-content');
    if (!container) return;
    
    container.innerHTML = DESIGNERS.filter(d => d.msg).map(d => `
        <div class="msg-box">
            <p class="msg-text">"${d.msg}"</p>
            <p class="msg-sender">- ${d.name}</p>
        </div>
    `).join('');
}
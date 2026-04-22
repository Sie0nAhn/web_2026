let DESIGNERS = [];

// 1. CSV 데이터 로드
window.addEventListener('DOMContentLoaded', () => {
    fetch('2026_web.csv')
        .then(response => response.text())
        .then(csvString => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // 실제 업로드하신 CSV 열 제목에 정확히 맞췄습니다.
                    DESIGNERS = results.data.map(row => ({
                        name: row['이름'] || '',
                        engName: row['영문이름'] || '',
                        track: row['트랙'] || '',
                        workTitle: row['작품명'] || '',
                        booth: row['부스번호'] || '',
                        msg: row['한마디'] || ''
                    }));
                    initApp();
                }
            });
        });
});

function initApp() {
    renderGrid();
    renderWorks('all');
    renderBooth();
}

// 2. 페이지 전환 로직
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
}

// 3. 메인 그리드 렌더링
function renderGrid() {
    const container = document.getElementById('designer-grid');
    if(!container) return;
    container.innerHTML = DESIGNERS.map(d => `
        <div class="designer-card">
            <p style="color: var(--accent); font-size: 11px; margin-bottom: 10px;">${d.track}</p>
            <h3 style="font-size: 20px; margin-bottom: 5px;">${d.name}</h3>
            <p style="color: #555; font-size: 13px;">${d.engName}</p>
        </div>
    `).join('');
}

// 4. 필터링 및 작품 렌더링
function filterWorks(track, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderWorks(track);
}

function renderWorks(filter) {
    const container = document.getElementById('works-list');
    if(!container) return;
    
    const data = filter === 'all' ? DESIGNERS : DESIGNERS.filter(d => d.track === filter);
    
    container.innerHTML = data.map(d => `
        <div class="work-item" style="margin-bottom: 80px;">
            <h2 style="font-size: 32px; letter-spacing: -1px;">${d.workTitle}</h2>
            <p style="color: var(--gray); margin-bottom: 20px;">${d.name} / ${d.track}</p>
            <div style="width: 100%; aspect-ratio: 16/9; background: #15151A; border: 1px solid #222;"></div>
        </div>
    `).join('');
}

function renderBooth() {
    const container = document.getElementById('booth-content');
    if(container) container.innerHTML = `<p style="text-align:center; color:#444;">CSV에서 로드된 ${DESIGNERS.length}명의 데이터가 준비되었습니다.</p>`;
}
let DESIGNERS = [];

// 페이지가 로드되면 CSV 파일을 읽어옵니다.
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
                    // [데이터 매핑] CSV 열 이름에 맞춰 데이터를 정리합니다.
                    DESIGNERS = results.data.map(row => ({
                        name: row['이름'] || '이름 없음',
                        engName: row['영문이름'] || '',
                        track: row['트랙'] || 'General',
                        workTitle: row['작품명'] || 'Untitled',
                        booth: row['부스'] || 'TBD',
                        msg: row['한마디'] || ''
                    }));
                    
                    // 데이터 로드 후 첫 화면 렌더링
                    initSite();
                }
            });
        })
        .catch(err => console.error(err));
});

function initSite() {
    renderGrid();
    renderWorks('all');
    renderBooth();
    renderMsgs();
}

// 페이지 전환 함수
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    window.scrollTo(0, 0);
}

// 메인 그리드 렌더링
function renderGrid() {
    const container = document.getElementById('designer-grid');
    if(!container) return;
    container.innerHTML = DESIGNERS.map(d => `
        <div class="designer-card">
            <h3>${d.name}</h3>
            <p>${d.engName}</p>
            <p style="margin-top:10px; color:#3A3AFF;">${d.track}</p>
        </div>
    `).join('');
}

// 작품 리스트 렌더링 (필터링 포함)
function renderWorks(filter) {
    const container = document.getElementById('works-list');
    if(!container) return;
    
    const filtered = filter === 'all' 
        ? DESIGNERS 
        : DESIGNERS.filter(d => d.track === filter);

    container.innerHTML = filtered.map(d => `
        <div class="work-item">
            <h2 style="font-size:24px;">${d.workTitle}</h2>
            <p style="color:#888;">${d.name} (${d.track})</p>
            <div style="width:100%; height:300px; background:#1a1a1a; margin-top:20px; display:flex; align-items:center; justify-content:center;">
                IMAGE PLACEHOLDER
            </div>
        </div>
    `).join('');
}

function renderBooth() {
    const container = document.getElementById('booth-map');
    if(container) container.innerHTML = `<p style="text-align:center; color:#555;">부스 배치도는 준비 중입니다.</p>`;
}

function renderMsgs() {
    const container = document.getElementById('guestbook-list');
    if(container) container.innerHTML = `<p style="text-align:center; color:#555;">남겨진 메시지가 없습니다.</p>`;
}
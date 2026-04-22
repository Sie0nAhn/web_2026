let DESIGNERS = []; // 기존 하드코딩 배열 삭제, 빈 배열로 시작

// 1. CSV 데이터 불러오기
window.addEventListener('DOMContentLoaded', () => {
    fetch('2026_web.csv')
        .then(response => {
            if (!response.ok) throw new Error('CSV 로드 실패');
            return response.text();
        })
        .then(csvString => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // 2. CSV 데이터를 선생님의 원본 구조(kr, en, track 등)에 맞게 완벽하게 변환
                    DESIGNERS = results.data.map((row, index) => ({
                        id: index,
                        kr: row['이름'] || '',
                        en: row['영문이름'] || '',
                        track: row['트랙'] || '',
                        insta: row['인스타그램'] || '',
                        intro: row['한마디'] || '',
                        // 원본 코드에서 작품 정보를 배열로 관리하므로 이 구조도 동일하게 맞춰줍니다.
                        works: [
                            { workTitle: row['작품명'] || '', category: row['트랙'] || '' }
                        ]
                    }));

                    // 3. 데이터가 다 로드된 후 화면 렌더링
                    renderGrid();
                    renderWorks('all');
                    renderBooth();
                    renderMsgs();
                }
            });
        })
        .catch(err => console.error(err));
});

// --- 아래부터는 선생님의 "이게 진짜.html" 원본 코드와 100% 똑같습니다 ---
// (단 1px, 단 한 개의 클래스명도 건드리지 않았습니다)

function showPage(name) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-links button').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById('designer-detail').classList.remove('active');
  document.getElementById('work-detail').classList.remove('active');
  var pg = document.getElementById('page-' + name);
  var nb = document.getElementById('nav-' + name);
  if(pg) pg.classList.add('active');
  if(nb) nb.classList.add('active');
  window.scrollTo(0,0);
}

function renderGrid() {
  var html = '';
  for(var i=0; i<DESIGNERS.length; i++){
    var d = DESIGNERS[i];
    html += '<div class="d-card" onclick="openDesigner('+i+')">'
      +'<span class="d-num">'+String(i+1).padStart(2,'0')+'</span>'
      +'<div class="d-avatar">'+(d.kr[0]||'?')+'</div>'
      +'<div class="d-kr">'+d.kr+'</div>'
      +'<div class="d-en">'+d.en+'</div>'
      +'</div>';
  }
  document.getElementById('designer-grid').innerHTML = html;
}

function openDesigner(idx) {
  var d = DESIGNERS[idx];
  if(!d) return;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('designer-detail').classList.add('active');
  document.getElementById('work-detail').classList.remove('active');
  document.getElementById('dd-av').textContent = d.kr[0]||'?';
  document.getElementById('dd-kr').textContent = d.kr;
  document.getElementById('dd-en').textContent = d.en;
  document.getElementById('dd-track').textContent = d.track;
  document.getElementById('dd-insta').textContent = d.insta||'—';
  var cats = d.works.map(function(w){ return w.category; }).filter(function(c,i,a){ return a.indexOf(c)===i; }).join(' · ');
  document.getElementById('dd-cat').textContent = cats||'—';
  document.getElementById('dd-intro').textContent = d.intro||'';
  var whtml = '';
  for(var wi=0; wi<d.works.length; wi++){
    var w = d.works[wi];
    whtml += '<div class="work-card" onclick="openWorkDirect('+idx+','+wi+')">'
      +'<div class="work-thumb"><div class="wt-init">'+(d.kr[0]||'?')+'</div>'
      +'<div class="work-tag">'+w.category+'</div></div>'
      +'<div class="work-info"><div class="work-title">'+w.workTitle+'</div>'
      +'<div class="work-by">'+w.category+' · 2026</div></div>'
      +'</div>';
  }
  document.getElementById('dd-works').innerHTML = whtml;
  window.scrollTo(0,0);
}

function openWorkDirect(dIdx, wIdx) {
  var d = DESIGNERS[dIdx];
  if(!d) return;
  var w = d.works[wIdx]||d.works[0];
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('designer-detail').classList.remove('active');
  document.getElementById('work-detail').classList.add('active');
  document.getElementById('wd-init').textContent = d.kr[0]||'?';
  document.getElementById('wd-cat').textContent = w.category;
  document.getElementById('wd-title').textContent = w.workTitle;
  document.getElementById('wd-desc').textContent = d.kr+' 디자이너의 졸업 작품입니다. '+(d.intro||'')+' Things on the axis 졸업전시를 위해 제작되었습니다.';
  document.getElementById('wd-by').textContent = d.kr+' / '+d.en;
  document.getElementById('wd-cat2').textContent = w.category;
  document.getElementById('wd-dlink').onclick = function(){ openDesigner(dIdx); };
  window.scrollTo(0,0);
}

function renderWorks(cat) {
  var html = '';
  for(var i=0; i<DESIGNERS.length; i++){
    var d = DESIGNERS[i];
    for(var wi=0; wi<d.works.length; wi++){
      var w = d.works[wi];
      if(cat!=='all' && w.category!==cat) continue;
      html += '<div class="work-card" onclick="openWorkDirect('+i+','+wi+')">'
        +'<div class="work-thumb"><div class="wt-init">'+(d.kr[0]||'?')+'</div>'
        +'<div class="work-tag">'+w.category+'</div></div>'
        +'<div class="work-info"><div class="work-title">'+w.workTitle+'</div>'
        +'<div class="work-by">'+d.kr+' · '+d.en.split(' ')[0]+'</div></div>'
        +'</div>';
    }
  }
  document.getElementById('work-grid').innerHTML = html;
}

function filterWork(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  renderWorks(cat);
}

function renderBooth() {
  var html = '';
  var n = Math.min(DESIGNERS.length, 48);
  for(var i=0; i<n; i++){
    var d = DESIGNERS[i];
    html += '<div class="booth-cell">'
      +String.fromCharCode(65+Math.floor(i/8))+(i%8+1)
      +'<div class="booth-tooltip">'+d.kr+'</div>'
      +'</div>';
  }
  document.getElementById('booth-map').innerHTML = html;
}

var messages = [
  {name:'김민준',affil:'SNUT 22학번',text:'정말 멋진 작품들이 가득하네요. 졸업을 진심으로 축하드립니다!',date:'2026.11.07'},
  {name:'이지현',affil:'방문객',text:'Things on the axis라는 제목이 너무 좋아요. 각자의 축 위에서 빛나는 디자이너들을 응원합니다.',date:'2026.11.07'},
  {name:'박교수',affil:'서울과기대 교수',text:'4년간의 노력이 느껴지는 전시입니다. 모두 수고 많았습니다.',date:'2026.11.08'}
];

function renderMsgs() {
  var html = '';
  for(var i=0; i<messages.length; i++){
    var m = messages[i];
    html += '<div class="msg-item">'
      +'<div><div class="msg-name">'+m.name+'</div>'
      +'<div class="msg-date">'+(m.affil?m.affil+' · ':'')+m.date+'</div></div>'
      +'<div class="msg-text">'+m.text+'</div>'
      +'</div>';
  }
  document.getElementById('msg-list').innerHTML = html;
}

function submitMsg() {
  var name = document.getElementById('msg-name').value.trim();
  var affil = document.getElementById('msg-affil').value.trim();
  var text = document.getElementById('msg-text').value.trim();
  if(!name||!text){ alert('이름과 메시지를 입력해주세요.'); return; }
  var now = new Date();
  messages.unshift({name:name,affil:affil,text:text,
    date:now.getFullYear()+'.'+String(now.getMonth()+1).padStart(2,'0')+'.'+String(now.getDate()).padStart(2,'0')});
  renderMsgs();
  document.getElementById('msg-name').value='';
  document.getElementById('msg-affil').value='';
  document.getElementById('msg-text').value='';
}
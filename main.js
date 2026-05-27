let DESIGNERS = [];

window.addEventListener('DOMContentLoaded', () => {
    fetch('2026_web.csv', {cache:'no-store'})
        .then(response => {
            if (!response.ok) throw new Error('CSV 로드 실패');
            return response.text();
        })
        .then(csvString => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    const groupedDesigners = {};

                    results.data.forEach(row => {
                        const krName = row['이름'] || '';
                        if (!groupedDesigners[krName]) {
                            groupedDesigners[krName] = {
                                kr: krName,
                                en: row['영어 이름'] || '',
                                track: row['트랙'] || '',
                                insta: row['인스타'] || '',
                                intro: row['한줄 소개'] || '',
                                profileImg: row['프로필이미지'] || 'images/profiles/none.jpg',
                                works: []
                            };
                        }
                        var imgs = [];
                        var imgKeys = ['작품이미지','작품이미지2','작품이미지3','작품이미지4','작품이미지5','작품이미지6','작품이미지7'];
                        imgKeys.forEach(function(k){ if(row[k] && row[k].trim()) imgs.push(row[k].trim()); });
                        if(imgs.length === 0) imgs.push('images/works/none.jpg');
                        groupedDesigners[krName].works.push({
                            workTitle: row['작품명'] || '',
                            category: row['카테고리'] || '',
                            workImgs: imgs
                        });
                    });

                    // 가나다 순 정렬
                    DESIGNERS = Object.values(groupedDesigners)
                        .sort((a, b) => a.kr.localeCompare(b.kr, 'ko'))
                        .map((designer, index) => ({
                            id: index,
                            ...designer
                        }));

                    renderGrid();
                    renderWorks('all');
                    renderBooth();
                    renderMsgs();
                }
            });
        })
        .catch(err => console.error(err));
});

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

// filter: 검색어 (기본값 빈 문자열 = 전체 표시)
function renderGrid(filter) {
  filter = (filter || '').trim();
  var q = filter.toLowerCase();
  var html = '';
  var displayNum = 1;

  for (var i = 0; i < DESIGNERS.length; i++) {
    var d = DESIGNERS[i];
    // 한글 이름 또는 영어 이름으로 필터링
    if (q && !d.kr.includes(filter) && !d.en.toLowerCase().includes(q)) continue;
    html += '<div class="d-card" onclick="openDesigner(' + i + ')">'
      + '<span class="d-num">' + String(displayNum++).padStart(2, '0') + '</span>'
      + '<div class="d-avatar"><img src="' + d.profileImg + '" alt="' + d.kr + '" onerror="this.onerror=null;this.src=\'images/profiles/none.jpg\'"></div>'
      + '<div class="d-kr">' + d.kr + '</div>'
      + '<div class="d-en">' + d.en + '</div>'
      + '</div>';
  }

  if (!html) {
    html = '<p class="no-result">검색 결과가 없습니다.</p>';
  }

  document.getElementById('designer-grid').innerHTML = html;
}

function searchDesigner(value) {
  renderGrid(value);
}

function openDesigner(idx) {
  var d = DESIGNERS[idx];
  if(!d) return;
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('designer-detail').classList.add('active');
  document.getElementById('work-detail').classList.remove('active');
  var avEl = document.getElementById('dd-av');
  avEl.innerHTML = '<img src="' + d.profileImg + '" alt="' + d.kr + '" onerror="this.onerror=null;this.src=\'images/profiles/none.jpg\'">';
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
      +'<div class="work-thumb"><img src="'+w.workImgs[0]+'" alt="'+w.workTitle+'" onerror="this.onerror=null;this.src=\'images/works/none.jpg\'">'
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
  document.getElementById('wd-title').textContent = w.workTitle;
  document.getElementById('wd-desc').textContent = d.kr+' 디자이너의 졸업 작품입니다. '+(d.intro||'')+' Things on the axis 졸업전시를 위해 제작되었습니다.';
  document.getElementById('wd-by').textContent = d.kr+' / '+d.en;
  document.getElementById('wd-cat2').textContent = w.category;
  document.getElementById('wd-dlink').onclick = function(){ openDesigner(dIdx); };
  // 썸네일 (workImgs[0])
  var thumbEl = document.getElementById('wdv-thumb');
  thumbEl.onerror = function(){ this.onerror=null; this.src='images/works/none.jpg'; };
  thumbEl.src = (w.workImgs && w.workImgs[0]) || 'images/works/none.jpg';
  thumbEl.alt = w.workTitle;
  // 갤러리 이미지 (workImgs[1] ~), 없으면 none.jpg
  var galleryImgs = (w.workImgs || []).slice(1);
  if(galleryImgs.length === 0) galleryImgs = ['images/works/none.jpg'];
  var ghtml = '';
  galleryImgs.forEach(function(src, i) {
    ghtml += '<div class="wdv-img-wrap">'
      +'<img src="'+src+'" alt="'+w.workTitle+' '+(i+1)+'" onerror="this.onerror=null;this.src=\'images/works/none.jpg\'">'
      +'</div>';
  });
  document.getElementById('wdv-gallery').innerHTML = ghtml;
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
        +'<div class="work-thumb"><img src="'+w.workImgs[0]+'" alt="'+w.workTitle+'" onerror="this.onerror=null;this.src=\'images/works/none.jpg\'">'
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

/* ── 캐러셀 ── */
var _carImgs = [];
var _carIdx  = 0;

function initCarousel(imgs, altText) {
  _carImgs = imgs && imgs.length ? imgs : ['images/works/none.jpg'];
  _carIdx  = 0;
  var multi = _carImgs.length > 1;

  // 화살표 표시/숨김
  document.getElementById('wdc-prev').style.display = multi ? 'flex' : 'none';
  document.getElementById('wdc-next').style.display = multi ? 'flex' : 'none';

  // 도트 생성
  var dots = document.getElementById('wdc-dots');
  if(multi) {
    dots.innerHTML = _carImgs.map(function(_, i){
      return '<span class="wdc-dot' + (i===0?' active':'') + '" onclick="carGoTo('+i+')"></span>';
    }).join('');
    dots.style.display = 'flex';
  } else {
    dots.innerHTML = '';
    dots.style.display = 'none';
  }

  _carSetImg(0, altText);
}

function _carSetImg(idx, altText) {
  _carIdx = idx;
  var img = document.getElementById('wd-img');
  img.onerror = function(){ this.onerror=null; this.src='images/works/none.jpg'; };
  img.alt = altText || '';
  img.src = _carImgs[idx];
  // 도트 active
  document.querySelectorAll('.wdc-dot').forEach(function(d,i){ d.classList.toggle('active', i===idx); });
}

function carStep(dir) {
  _carSetImg((_carIdx + dir + _carImgs.length) % _carImgs.length);
}

function carGoTo(idx) {
  _carSetImg(idx);
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

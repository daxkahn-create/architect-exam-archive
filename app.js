'use strict';
const subjects=['營建法規與實務','建築結構','建築構造與施工','建築環境控制','敷地計畫與都市設計','建築計畫與設計'];
const years=[114,113,112,111,110];
const $=id=>document.getElementById(id);
let mode='year',lastFocus=null;
years.forEach(y=>$('year').add(new Option(`${y} 年（${y+1911}）`,y)));
subjects.forEach(s=>$('subject').add(new Option(s,s)));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fileCount=r=>Object.keys(r.files).length;
function fileCell(r,type){const file=r.files[type],cls=type==='試題'?'question':type==='更正答案'?'correction':'';if(!file)return `<div class="file-cell ${cls}"><span class="missing">${type==='更正答案'?'無更正':'未提供'}</span></div>`;return `<div class="file-cell ${cls}"><button class="view" data-id="${r.id}" data-type="${type}" aria-label="預覽 ${r.year} 年 ${esc(r.subject)} ${type}">${type}${type==='試題'?' ↗':''}</button><a class="download" href="${esc(file)}" download aria-label="下載 ${r.year} 年 ${esc(r.subject)} ${type}" title="下載 PDF">↓</a></div>`;}
function render(){const q=$('search').value.trim().toLowerCase(),y=$('year').value,s=$('subject').value;
const rows=EXAMS.filter(r=>(!y||r.year==y)&&(!s||r.subject===s)&&(!q||`${r.year} ${r.year+1911} ${r.subject} 建築師`.toLowerCase().includes(q)));
$('count').textContent=`找到 ${rows.length} 組考題，共 ${rows.reduce((n,r)=>n+fileCount(r),0)} 份 PDF`;
$('empty').hidden=!!rows.length;
const groups=mode==='year'?years:subjects;
$('results').innerHTML=groups.map(g=>{const items=rows.filter(r=>mode==='year'?r.year===g:r.subject===g);if(!items.length)return '';const title=mode==='year'?`${g} 年 <small>${g+1911}</small>${g===114?'<span class="tag">最新收錄</span>':''}`:esc(g);return `<section class="collection"><div class="collection-head"><h3>${title}</h3><span class="quantity">${items.length} ${mode==='year'?'科':'年'} · ${items.reduce((n,r)=>n+fileCount(r),0)} 份 PDF</span></div><div class="row table-labels" aria-hidden="true"><span>NO.</span><span>${mode==='year'?'考試科目':'考試年度'}</span><span>試題</span><span>標準答案</span><span>更正答案</span></div>${items.map((r,i)=>`<article class="row"><span class="number">${String(i+1).padStart(2,'0')}</span><h4>${mode==='year'?esc(r.subject):`${r.year} 年 <small>西元 ${r.year+1911} 年</small>`}</h4>${['試題','答案','更正答案'].map(t=>fileCell(r,t)).join('')}</article>`).join('')}</section>`;}).join('');
}
function setMode(next){mode=next;$('byYear').classList.toggle('active',mode==='year');$('bySubject').classList.toggle('active',mode==='subject');$('byYear').setAttribute('aria-pressed',mode==='year');$('bySubject').setAttribute('aria-pressed',mode==='subject');render();}
function reset(){['search','year','subject'].forEach(id=>$(id).value='');render();}
$('byYear').onclick=()=>setMode('year');$('bySubject').onclick=()=>setMode('subject');$('reset').onclick=reset;$('emptyReset').onclick=reset;
$('search').addEventListener('input',render);['year','subject'].forEach(id=>$(id).addEventListener('change',render));
$('results').addEventListener('click',e=>{const button=e.target.closest('button[data-id]');if(!button)return;const row=EXAMS.find(r=>r.id===button.dataset.id),type=button.dataset.type,file=row.files[type];lastFocus=button;$('viewerMeta').textContent=`${row.year} 年（${row.year+1911}） · 建築師高考`;$('viewerTitle').textContent=`${row.subject}｜${type}`;$('openPdf').href=file;$('downloadPdf').href=file;$('pdfFrame').src=file;$('pdfFrame').title=`${row.year} 年 ${row.subject} ${type}`;$('viewer').showModal();document.body.classList.add('modal-open');});
$('closeViewer').onclick=()=>$('viewer').close();$('viewer').addEventListener('close',()=>{document.body.classList.remove('modal-open');$('pdfFrame').src='about:blank';lastFocus?.focus();});
$('viewer').addEventListener('click',e=>{if(e.target===$('viewer')){const r=$('viewer').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('viewer').close();}});
render();

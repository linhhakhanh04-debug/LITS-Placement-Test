const iconPath=name=>`assets/icons/${name}.svg`;
const questions=[
  {n:1, part:1, speech:'Bag.', answer:'bag', options:['bag','book']},
  {n:2, part:1, speech:'Pencil.', answer:'pencil', options:['chair','pencil']},
  {n:3, part:1, speech:'Book.', answer:'book', options:['book','bag']},
  {n:4, part:1, speech:'Sit down.', answer:'sit', options:['sit','stand']},
  {n:5, part:1, speech:'Stand up.', answer:'stand', options:['stand','sit']},
  {n:6, part:1, speech:'Clap your hands.', answer:'clap', options:['clap','handsup']},
  {n:7, part:1, speech:'Hands up.', answer:'handsup', options:['handsdown','handsup']},
  {n:8, part:1, speech:'Ball.', answer:'ball', options:['doll','ball']},
  {n:9, part:1, speech:'Car.', answer:'car', options:['car','train']},
  {n:10, part:1, speech:'Plane.', answer:'plane', options:['monster','plane']},
  {n:11, part:2, speech:'Train.', answer:'train', options:['train','car','bus']},
  {n:12, part:2, speech:'Doll.', answer:'doll', options:['doll','ball','monster']},
  {n:13, part:2, speech:'Monster.', answer:'monster', options:['monster','plane','train']},
  {n:14, part:2, speech:'Chair.', answer:'chair', options:['chair','book','bag']},
  {n:15, part:2, speech:'Pen.', answer:'pen', options:['pencil','pen','book']},
  {n:16, part:2, speech:'Say hello.', answer:'hello', options:['hello','clap','sit']},
  {n:17, part:2, speech:'Hands down.', answer:'handsdown', options:['handsdown','handsup','stand']},
  {n:18, part:2, speech:'Bag.', answer:'bag', options:['chair','bag','book']},
  {n:19, part:2, speech:'Book.', answer:'book', options:['book','pencil','ball']},
  {n:20, part:2, speech:'Plane.', answer:'plane', options:['car','train','plane']}
];
const labels={bag:'bag',book:'book',pencil:'pencil',chair:'chair',sit:'sit down',stand:'stand up',clap:'clap',handsup:'hands up',handsdown:'hands down',ball:'ball',doll:'doll',car:'car',train:'train',plane:'plane',monster:'monster',pen:'pen',hello:'say hello',bus:'bus'};
const answers={};
const part1=document.getElementById('part1');
const part2=document.getElementById('part2');
const progressText=document.getElementById('progressText');
const progressFill=document.getElementById('progressFill');
const sideProgress=document.getElementById('sideProgress');
const toast=document.getElementById('toast');

function speak(text){
  if(!('speechSynthesis' in window)){showToast('Audio is not available in this browser.');return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US';u.rate=.78;u.pitch=1.08;
  speechSynthesis.speak(u);
}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2000)}
function makeCard(q){
  const card=document.createElement('article');
  card.className='question-card';
  card.innerHTML=`<div class="q-top"><span class="q-number">${q.n}</span><button class="play-btn" type="button">▶ Listen</button></div><div class="choices ${q.options.length===2?'two':'three'}"></div>`;
  card.querySelector('.play-btn').addEventListener('click',()=>speak(q.speech));
  const choices=card.querySelector('.choices');
  q.options.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.type='button';btn.className='choice';btn.dataset.value=opt;
    btn.innerHTML=`<img src="${iconPath(opt)}" alt="${labels[opt]}"><span>${String.fromCharCode(65+i)}</span>`;
    btn.addEventListener('click',()=>{
      choices.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));
      btn.classList.add('selected');answers[q.n]=opt;updateProgress();
    });
    choices.appendChild(btn);
  });
  return card;
}
questions.forEach(q=>(q.part===1?part1:part2).appendChild(makeCard(q)));
function updateProgress(){
  const done=Object.keys(answers).length;
  progressText.textContent=`${done} / 20 answered`;
  sideProgress.textContent=`${done} / 20`;
  progressFill.style.width=`${done/20*100}%`;
}
let remain=15*60;
const timer=document.getElementById('timer');
const interval=setInterval(()=>{
  if(remain>0) remain--;
  const m=String(Math.floor(remain/60)).padStart(2,'0');
  const s=String(remain%60).padStart(2,'0');
  timer.textContent=`${m}:${s}`;
  if(remain===0){clearInterval(interval);showToast('Time is up. You can submit your test.');}
},1000);

const HISTORY_KEY='lits_superkids_history_v1';
function getHistory(){return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}
function setHistory(rows){localStorage.setItem(HISTORY_KEY,JSON.stringify(rows))}
function formatTimeUsed(){const used=15*60-remain;const m=String(Math.floor(used/60)).padStart(2,'0');const s=String(used%60).padStart(2,'0');return `${m}:${s}`}
function renderHistory(){
  const rows=getHistory();
  const body=document.getElementById('historyBody');
  body.innerHTML=rows.length?rows.map(r=>`<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.className)}</td><td><b>${r.score}/20</b></td><td>${r.percent}%</td><td>${r.timeUsed}</td><td>${r.submittedAt}</td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;padding:22px">No results yet.</td></tr>';
  document.getElementById('historyAttempts').textContent=rows.length;
  document.getElementById('historyAverage').textContent=(rows.length?Math.round(rows.reduce((s,r)=>s+r.percent,0)/rows.length):0)+'%';
  document.getElementById('historyBest').textContent=(rows.length?Math.max(...rows.map(r=>r.score)):0)+'/20';
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

document.getElementById('submitTest').addEventListener('click',()=>{
  const unanswered=20-Object.keys(answers).length;
  if(unanswered>0 && !confirm(`You still have ${unanswered} unanswered question(s). Submit anyway?`)) return;
  const score=questions.reduce((sum,q)=>sum+(answers[q.n]===q.answer?1:0),0);
  const name=(document.getElementById('studentName').value||'Unnamed student').trim();
  const className=(document.getElementById('studentClass').value||'').trim();
  const row={name,className,score,percent:Math.round(score/20*100),timeUsed:formatTimeUsed(),submittedAt:new Date().toLocaleString()};
  const rows=getHistory(); rows.unshift(row); setHistory(rows.slice(0,200)); renderHistory();
  document.getElementById('resultScore').textContent=`${score} / 20`;
  document.getElementById('resultMessage').textContent=score>=17?'Excellent listening!':score>=13?'Good job! Keep practising.':score>=9?'Nice try. More listening practice will help.':'This level may still be challenging. Keep practising the basic words and classroom actions.';
  document.getElementById('resultDialog').showModal();
});
document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('resultDialog').close());
updateProgress();

const historyDialog=document.getElementById('historyDialog');
document.getElementById('openHistory').addEventListener('click',()=>{renderHistory();historyDialog.showModal()});
document.getElementById('closeHistory').addEventListener('click',()=>historyDialog.close());
document.getElementById('exportHistory').addEventListener('click',()=>{
  const rows=getHistory(); if(!rows.length){showToast('No history yet.');return;}
  const data=[['Student','Class','Score','Percent','Time used','Submitted'],...rows.map(r=>[r.name,r.className,`${r.score}/20`,`${r.percent}%`,r.timeUsed,r.submittedAt])];
  const csv=data.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='LITS_Superkids_History.csv';a.click();URL.revokeObjectURL(a.href);
});
document.getElementById('clearHistory').addEventListener('click',()=>{if(confirm('Clear all saved Superkids results on this browser?')){localStorage.removeItem(HISTORY_KEY);renderHistory();}});
renderHistory();

document.getElementById('resultHistory').addEventListener('click',()=>{document.getElementById('resultDialog').close();renderHistory();historyDialog.showModal();});

const levels = {
  'Superkids': {desc:'20 very easy listening questions for young beginners.', badge:'LEVEL 1'},
  'Starters': {desc:'A beginner placement test for early primary learners.', badge:'LEVEL 2'},
  'Movers': {desc:'A placement test for learners working toward Movers-level English.', badge:'LEVEL 3'},
  'Flyers': {desc:'A higher Young Learners test for more confident primary learners.', badge:'LEVEL 4'},
  'Pre-KET': {desc:'A bridge test for learners preparing to move into A2 Key content.', badge:'LEVEL 5'},
  'KET': {desc:'An A2-level placement test for learners ready for Key-style tasks.', badge:'LEVEL 6'},
  'Level 7': {desc:'This level is reserved for a future test.', badge:'LEVEL 7'}
};
const buttons=[...document.querySelectorAll('.level-button')];
const selectedLevel=document.getElementById('selectedLevel');
const selectedDescription=document.getElementById('selectedDescription');
const previewBadge=document.getElementById('previewBadge');
const startButton=document.getElementById('startButton');
const toast=document.getElementById('toast');
let current='Superkids';

function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t=setTimeout(()=>toast.classList.remove('show'),2200);
}

buttons.forEach(btn=>btn.addEventListener('click',()=>{
  buttons.forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  current=btn.dataset.level;
  selectedLevel.textContent=current;
  selectedDescription.textContent=levels[current].desc;
  previewBadge.textContent=levels[current].badge;
  startButton.textContent=current==='Level 7'?'Coming soon':`Start ${current}`;
}));

startButton.addEventListener('click',()=>{
  if(current==='Superkids'){
    window.location.href='superkids.html';
    return;
  }
  if(current==='Level 7') showToast('Level 7 is coming soon.');
  else showToast(`${current} test will be connected next.`);
});

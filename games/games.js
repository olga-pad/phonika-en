'use strict';
function initGames(){
 const $=id=>document.getElementById(id);
 const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const targetOf=t=>t.targetWord??t.targetSound;
 const arrangeTasks=tasks=>{const buckets=new Map();tasks.forEach(t=>{const k=targetOf(t);if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(t);});buckets.forEach((v,k)=>buckets.set(k,shuffle(v)));const out=[];while(out.length<tasks.length){const last=targetOf(out.at(-1)||{}),c=[...buckets.entries()].filter(([k,v])=>v.length&&k!==last);if(!c.length)break;const max=Math.max(...c.map(([,v])=>v.length));const [,bucket]=shuffle(c.filter(([,v])=>v.length===max))[0];out.push(bucket.pop());}return out;};
 const createDoubleExposureTasks=(items,fallbackPool,makeTask)=>{const current=[...new Set(items)],fallback=[...new Set(fallbackPool)],tasks=[];current.forEach(target=>{const primary=shuffle(current.filter(item=>item!==target)),extra=shuffle(fallback.filter(item=>item!==target&&!primary.includes(item))),pool=[...primary,...extra],distractors=pool.slice(0,2);if(distractors.length===1)distractors.push(distractors[0]);distractors.forEach(distractor=>tasks.push(makeTask(target,distractor)));});return arrangeTasks(tasks);};
 const availableWords=()=>wordsThroughLevel().filter(wordAvailable);
 const pool=()=>[...new Set(availableWords().map(x=>x.word))];
 const data=w=>availableWords().find(x=>x.word===w);
 const size=()=>Math.min(pool().length,5);
 const speakText=s=>{if(!s||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='en-GB';u.rate=.72;speechSynthesis.speak(u);};
 const shown=s=>typeof textCase==='function'?textCase(String(s)):String(s);
 const learning=(el,s,isSound=false)=>{
  el.classList.add('learning-text');
  if(typeof color==='function'){
   color(el,s,isSound);
  }else{
   el.textContent=shown(s);
  }
  el.classList.toggle('cursive',String(mode||'').startsWith('cursive'));
  return el;
 };
 const celebrate=source=>{const host=source?.closest('.find-game');if(!host)return;const burst=document.createElement('div');burst.className='correct-confetti';burst.setAttribute('aria-hidden','true');const bits=['🎉','✨','⭐','●','◆','★','●','✨','◆','★'];burst.innerHTML=bits.map((x,i)=>'<span style="--i:'+i+'">'+x+'</span>').join('');host.appendChild(burst);setTimeout(()=>burst.remove(),850);};
 const completionHtml='<div class="fireworks" aria-hidden="true"><span>✨</span><span>🎆</span><span>✨</span><span>🎉</span><span>⭐</span></div><div class="celebration-dino">🦕</div><div class="games-completion-title"><h1>Hooray!</h1><p>All tasks are complete!</p></div><button type="button" class="primary dino-again">Play again</button>';

 const style=document.createElement('style');style.textContent=`
 #childView #gamesView{min-height:0;flex:1;width:100%;max-width:1120px;margin:0 auto;overflow:hidden;padding-top:0}
 #childView .find-game{width:100%;max-width:1120px;height:100%;margin:0 auto;display:flex;flex-direction:column;position:relative;text-align:center;overflow:visible}
 #childView .find-header{width:100%;max-width:1120px;margin:0 auto 0;min-height:46px;display:flex;align-items:center;justify-content:space-between;flex:0 0 auto}
 #childView .find-back{min-height:44px;padding:7px 4px;background:transparent;color:#55746d;border-radius:10px;font-size:16px;font-weight:700}
 #childView .find-title{color:#123f73;font-size:20px;font-weight:800}
 #childView .find-modes{position:fixed;z-index:12;top:34px;left:50%;transform:translateX(-50%);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:min(100%,390px);margin:0;padding:4px;background:#edf4fb;border:1px solid #d5e1ef;border-radius:24px}
 #childView .find-mode{min-height:52px;border-radius:20px;padding:6px 14px;background:transparent;color:#123f73;font-size:16px;font-weight:750}
 #childView .find-mode.active{background:#2389e8;color:#fff;box-shadow:0 3px 10px #2389e83a}
 #childView .find-question-row{position:relative;min-height:0;flex:1;width:100%;display:flex;align-items:center;justify-content:center;padding:8px 145px 28px;margin:0}
 #childView .find-question{display:flex;align-items:center;justify-content:center;gap:16px;margin:0;color:#123f73;font-size:clamp(42px,6vw,68px);font-weight:800;line-height:1.05}
 #childView .find-picture{width:112px;height:112px;min-width:112px;min-height:112px;padding:6px;background:transparent;border:0;border-radius:20px;box-shadow:none;font-size:82px;line-height:1;display:flex;align-items:center;justify-content:center}
 #childView .find-nav-arrow{position:absolute;top:46%;transform:translateY(-50%);width:58px;height:58px;min-height:58px;padding:0;border:1.5px solid #d2deea;border-radius:50%;background:#fff;color:#123f73;box-shadow:0 2px 8px #123f730d;display:flex;align-items:center;justify-content:center;font-size:34px;line-height:1}
 #childView .find-nav-arrow:first-child{left:34px}#childView .find-nav-arrow:last-child{right:34px}#childView .find-nav-arrow:hover:not(:disabled){border-color:#aebfd1;background:#fbfdff}#childView .find-nav-arrow:active:not(:disabled){transform:translateY(-50%) scale(.96)}#childView .find-nav-arrow:disabled{opacity:.32;cursor:default}
 #childView .find-nav-arrow.game-nav-success{background:#35b96f;color:#fff;border-color:#35b96f;box-shadow:0 4px 12px #35b96f30;cursor:pointer}#childView .find-nav-arrow.game-nav-success:hover{background:#2fa963;border-color:#2fa963}
 #childView .find-answers{--find-cols:2;flex:0 0 auto;display:grid;grid-template-columns:repeat(var(--find-cols),minmax(0,1fr));gap:22px;width:min(100%,840px);margin:0 auto 2px}
 #childView .find-answers:has(.find-answer:nth-child(3)){--find-cols:3}
 #childView .find-answer{min-width:0;min-height:82px;padding:12px 18px;border-radius:17px;background:#f8fbff;color:#123f73;border:1px solid #cbd9ea;box-shadow:0 4px 12px #123f7315;font-size:clamp(30px,4.2vw,54px);font-weight:800;line-height:1.05;white-space:normal;overflow-wrap:anywhere;display:flex;align-items:center;justify-content:center}
 #childView .find-answer.correct{background:#35b96f;color:#fff;border-color:#35b96f}#childView .find-answer.try-again{background:#edf4fb;border-color:#cbd9ea}
 #childView .dino-track{position:relative;width:min(88%,820px);height:50px;margin:0 auto;padding-left:46px;padding-right:46px;transform:translateY(16px);flex:0 0 auto;overflow:visible}
 #childView .dino-path{position:absolute;left:7%;right:7%;top:28px;height:6px;background:#d5dee8;border-radius:999px}
 #childView .dino-steps{position:absolute;left:7%;right:7%;top:15px;display:flex;justify-content:space-between}
 #childView .dino-step{width:32px;height:32px;border:4px solid #d5dee8;background:#fffdf8;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px}
 #childView .dino-step.done{background:#35b96f;border-color:#35b96f}
 #childView .dino{position:absolute;top:-8px;font-size:68px;line-height:1;transform:translate(-10px,-22px) scaleX(-1);transition:left .3s ease;z-index:4}
 #childView .dino-finish{position:absolute;right:0;top:-2px;font-size:38px;transform:translate(38px,-2px)}
 #childView .games-completion-title{text-align:center;margin:10px 0 0}#childView .games-completion-title h1{margin:0;font-size:46px;line-height:1.1}#childView .games-completion-title p{margin:7px 0 0;font-size:22px;font-weight:700;color:inherit;line-height:1.25}#childView .games-completion .dino-again{margin-top:34px}
 #childView .celebration-dino{font-size:82px;margin:12px 0}
 #childView .correct-confetti{position:absolute;inset:0;pointer-events:none;z-index:10;display:flex;justify-content:center;align-items:center}
 #childView .correct-confetti span{position:absolute;font-size:32px;animation:confettiBurst .75s ease-out forwards}
 @keyframes confettiBurst{0%{transform:translate(0,0) scale(0.3);opacity:1}100%{transform:translate(calc(cos(var(--i) * 36deg) * 140px),calc(sin(var(--i) * 36deg) * 140px)) scale(1.2);opacity:0}}
 @media(max-width:700px){
  #childView #gamesView{max-width:100%;overflow:auto}
  #childView .find-game{max-width:100%;min-height:100%}
  #childView .find-modes{top:17px;width:min(58%,280px);padding:4px}
  #childView .find-mode{min-height:40px;border-radius:20px;padding:4px 8px;font-size:15px}
  #childView .find-header{min-height:42px;margin-bottom:0}
  #childView .find-back{font-size:15px;min-height:40px}
  #childView .find-title{font-size:18px}
  #childView .find-question-row{min-height:0;padding:2px 55px 12px}
  #childView .find-question{gap:10px;font-size:clamp(34px,10vw,48px)}
  #childView .find-picture{width:82px;height:82px;min-width:82px;min-height:82px;font-size:62px;padding:2px}
  #childView .find-nav-arrow{width:48px;height:48px;min-height:48px;top:45%;font-size:29px}
  #childView .find-nav-arrow:first-child{left:0}#childView .find-nav-arrow:last-child{right:0}
  #childView .find-answers{gap:10px;width:min(100%,440px);margin:0 auto}
  #childView .find-answer{min-height:68px;padding:9px 10px;border-radius:14px;font-size:clamp(28px,9vw,42px)}
  #childView .dino-track{padding-left:38px;padding-right:38px;transform:translateY(10px);margin-top:28px}
  #childView .dino{font-size:58px;transform:translate(-8px,-19px) scaleX(-1)}
  #childView .dino-finish{transform:translate(31px,-2px);font-size:30px}
  #childView .games-completion-title{margin-top:8px}#childView .games-completion-title h1{font-size:40px}#childView .games-completion-title p{margin-top:6px;font-size:20px}#childView .games-completion .dino-again{margin-top:28px}
 }
 @media(max-width:430px){
  #childView .find-answers:has(.find-answer:nth-child(3)){grid-template-columns:repeat(2,minmax(0,1fr))}
  #childView .find-answers:has(.find-answer:nth-child(3)) .find-answer:last-child{grid-column:1/-1}
 }
 .games-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;width:min(100%,760px);margin:28px auto}.game-card{min-height:150px;background:#f8fbff;color:#123f73;border:1px solid #cbd9ea;border-radius:22px;box-shadow:0 4px 12px #123f7315;font-size:22px;display:grid;place-items:center;gap:6px}.game-card span{font-size:48px}.game-card:active{background:#2389e8;color:#fff;transform:scale(.985)}
 .en-game{width:min(100%,920px);margin:0 auto;text-align:center;position:relative}.game-header{display:flex;align-items:center;justify-content:center;position:relative;min-height:58px}.game-back{position:absolute;left:0;background:#f8fbff;color:#123f73;border:1px solid #cbd9ea}.game-title{font-size:25px;font-weight:850}.game-progress{display:flex;justify-content:center;gap:7px;margin:16px auto 24px}.game-step{width:25px;height:25px;border-radius:50%;background:#edf4fb;border:1px solid #cbd9ea;font-size:15px;display:grid;place-items:center}.game-step.done{background:#35b96f;color:white;border-color:#35b96f}.game-task{min-height:330px;display:grid;align-content:center;justify-items:center;gap:24px;position:relative;padding:0 76px}.game-picture{background:transparent;font-size:64px;min-height:70px;padding:0}.game-prompt{font-size:25px;font-weight:800}.game-answers{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}.game-answer,.build-tile,.build-slot{min-width:92px;min-height:70px;padding:10px 18px;background:#f8fbff;color:#123f73;border:1px solid #cbd9ea;box-shadow:0 4px 12px #123f7315;border-radius:16px;font-size:34px;font-weight:800}.game-answer.correct,.build-slot.correct{background:#35b96f;color:white;border-color:#35b96f}.game-answer.wrong{box-shadow:0 0 0 3px #d6e0eb inset}.game-nav{position:absolute;top:50%;transform:translateY(-50%);width:58px;height:58px;min-height:58px;padding:0;border-radius:50%;background:white;color:#123f73;border:1px solid #cbd9ea}.game-prev{left:5px}.game-next{right:5px}.game-next.ready{background:#35b96f;color:#fff;border-color:#35b96f}.game-complete,.game-empty{min-height:430px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.game-complete h1,.game-complete p,.game-empty h2,.game-empty p{margin:0}.game-dino{font-size:74px}.game-fireworks{font-size:34px}.game-again{margin-top:22px}.build-slots,.build-tiles{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.build-slot{min-width:66px}.build-slot.empty{background:transparent;box-shadow:none;border:0;border-bottom:4px solid #cbd9ea;border-radius:0}.build-tile{min-width:66px}.build-tile:disabled{visibility:hidden}.missing-pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:min(100%,520px)}.missing-word{min-height:86px;padding:15px;border-radius:16px;background:#f8fbff;border:1px solid #cbd9ea;font-size:38px;font-weight:800;display:grid;place-items:center}.catch-area{position:relative;width:100%;height:330px;overflow:hidden}.catch-answer{position:absolute;min-width:130px;min-height:78px;transition:transform 5s ease-in-out}.catch-answer.correct{background:#35b96f;color:white}.game-empty small{color:#7d8599}
 `;document.head.appendChild(style);

 const gamesTab=$('gamesTab'),view=$('gamesView'),grid=$('gamesGrid'),host=$('gameHost');if(!gamesTab||!view||!grid||!host)return;let active=null;
 const findGame=$('findGame'),findCard=$('findGameCard'),soundsMode=$('findSoundsMode'),wordsMode=$('findWordsMode'),answers=$('findAnswers'),findPicture=$('findPicture'),allGames=$('allGames'),findDinoSteps=$('findDinoSteps'),findDino=$('findDino'),findPrev=$('findPrev'),findNext=$('findNext');

 let findCompletion=null,isFindOpen=false,findMode='sounds',findTaskIndex=0,wordFindSession=[],soundFindSession=[],wordFindOriginal=[],soundFindOriginal=[];

 const resetAttempt=task=>{task.attempted=false;task.completed=false;task.hadWrongAttempt=false;return task;};
 const markWrong=task=>{if(task.completed)return;task.attempted=true;task.hadWrongAttempt=true;};
 const markCorrect=task=>{if(task.completed)return false;task.attempted=true;task.completed=true;const rewarded=!task.hadWrongAttempt&&!task.rewarded;if(rewarded){task.rewarded=true;task.closed=true;}return rewarded;};
 const hideFindCompletion=()=>{if(findCompletion)findCompletion.hidden=true;if(findGame)findGame.hidden=false;};

 const createWordFindSession=()=>{
  const currentCards=[...new Set(availableWords().map(x=>x.word))];
  const allWords=[...new Set(wordsThroughLevel().map(x=>x.word))];
  const byWord=new Map(wordsThroughLevel().map(item=>[item.word,item]));
  wordFindOriginal=createDoubleExposureTasks(currentCards.slice(0,5),allWords,(targetWord,distractor)=>({
   targetWord,
   picture:byWord.get(targetWord)?.picture||'🔊',
   distractor,
   answers:shuffle([targetWord,distractor]),
   attempted:false,completed:false,hadWrongAttempt:false,rewarded:false,closed:false
  }));
  wordFindSession=[...wordFindOriginal];
 };

 const soundAnswers=target=>{
  const allSounds=[...new Set(soundsThroughLevel())];
  const used=new Set([target]);
  const result=[target];
  const choices=shuffle(allSounds.filter(x=>!used.has(x)));
  while(result.length<Math.min(3,allSounds.length)&&choices.length){
   const c=choices.pop();
   used.add(c);
   result.push(c);
  }
  return shuffle(result);
 };

 const createSoundFindSession=()=>{
  const sounds=[...new Set(soundsThroughLevel())];
  const sizeVal=Math.min(sounds.length,5);
  const targets=shuffle(sounds).slice(0,sizeVal);
  soundFindOriginal=targets.map(targetSound=>({
   targetSound,
   answers:soundAnswers(targetSound),
   attempted:false,completed:false,hadWrongAttempt:false,rewarded:false,closed:false
  }));
  soundFindSession=[...soundFindOriginal];
 };

 const findSession=()=>findMode==='words'?wordFindSession:soundFindSession;
 const findOriginal=()=>findMode==='words'?wordFindOriginal:soundFindOriginal;
 const findGoal=()=>findOriginal().length;
 const currentFindTask=()=>findSession()[findTaskIndex];
 const currentProgress=()=>findOriginal().filter(task=>task.rewarded).length;

 const updateFindProgress=()=>{
  const progress=currentProgress(),goal=findGoal();
  [...findDinoSteps.children].forEach((step,i)=>{
   const done=i<progress;
   step.classList.toggle('done',done);
   step.innerHTML=done?'✓':'';
  });
  const pct=goal?Math.min(100,(progress/goal)*100):0;
  findDino.style.left=`calc(${pct}% - ${pct/100*46}px)`;
 };

 const buildFindProgress=()=>{
  findDinoSteps.replaceChildren();
  for(let i=0;i<findGoal();i++){
   const step=document.createElement('span');
   step.className='dino-step';
   findDinoSteps.append(step);
  }
  updateFindProgress();
 };

 const refreshFindNav=()=>{
  findPrev.disabled=findTaskIndex===0;
  const task=currentFindTask();
  findNext.disabled=!task?.completed;
  findNext.classList.toggle('game-nav-success',!!task?.completed);
 };

 const allFindClosed=()=>findGoal()>0&&currentProgress()===findGoal();

 const showFindCompletion=()=>{
  if(!allFindClosed())return;
  if(!findCompletion){
   findCompletion=document.createElement('section');
   findCompletion.className='finish dino-celebration games-completion';
   findCompletion.innerHTML=completionHtml;
   findGame.insertAdjacentElement('afterend',findCompletion);
   findCompletion.querySelector('.dino-again')?.addEventListener('click',startFindSession);
  }
  findGame.hidden=true;
  findCompletion.hidden=false;
 };

 const startFindRemediation=()=>{
  const pending=findOriginal().filter(task=>!task.rewarded).map(resetAttempt);
  if(!pending.length){showFindCompletion();return;}
  if(findMode==='words')wordFindSession=shuffle(pending);else soundFindSession=shuffle(pending);
  findTaskIndex=0;
  renderFindTask();
 };

 const goNextFindTask=()=>{
  if(!currentFindTask()?.completed)return;
  if(findTaskIndex<findSession().length-1){
   findTaskIndex++;
   renderFindTask();
  }else if(allFindClosed()){
   showFindCompletion();
  }else{
   startFindRemediation();
  }
 };

 const renderFindTask=()=>{
  const task=currentFindTask();
  if(!task)return;
  const isWords=findMode==='words',target=isWords?task.targetWord:task.targetSound;
  findPicture.textContent=isWords?(ASSOC[target]?ASSOC[target][1]:'🔊'):(ASSOC[target]?ASSOC[target][1]:'🔊');
  findPicture.setAttribute('aria-label',isWords?`Listen word ${target}`:`Listen sound ${target}`);
  const questionSpans=findGame.querySelectorAll('.find-question > span');
  questionSpans.forEach(span=>span.hidden=false);
  answers.replaceChildren(...task.answers.map(label=>{
   const correct=label===target,btn=document.createElement('button');
   btn.type='button';
   btn.className='find-answer'+(task.completed&&correct?' correct':'');
   learning(btn,label,!isWords);
   btn.addEventListener('click',()=>{
    if(task.completed)return;
    if(correct){
     answers.querySelectorAll('.find-answer').forEach(x=>x.classList.remove('try-again'));
     btn.classList.add('correct');
     const rewarded=markCorrect(task);
     if(rewarded){
      updateFindProgress();
      celebrate(btn);
     }
     refreshFindNav();
    }else{
     markWrong(task);
     btn.classList.add('try-again');
     refreshFindNav();
    }
   });
   return btn;
  }));
  refreshFindNav();
 };

 const startFindSession=()=>{
  if(findMode==='words')createWordFindSession();else createSoundFindSession();
  findTaskIndex=0;
  hideFindCompletion();
  buildFindProgress();
  renderFindTask();
 };

 const setFindMode=modeVal=>{
  findMode=modeVal;
  findTaskIndex=0;
  hideFindCompletion();
  soundsMode.classList.toggle('active',modeVal==='sounds');
  wordsMode.classList.toggle('active',modeVal==='words');
  if(modeVal==='words'&&!wordFindOriginal.length)createWordFindSession();
  if(modeVal==='sounds'&&!soundFindOriginal.length)createSoundFindSession();
  buildFindProgress();
  renderFindTask();
 };

 const hidePractice=()=>{['practice','finish'].forEach(id=>{const e=$(id);if(e)e.hidden=true;});};
 function showList(){
  active=null;
  isFindOpen=false;
  if(findCompletion)findCompletion.hidden=true;
  if(findGame)findGame.hidden=true;
  hidePractice();
  host.hidden=true;
  view.hidden=false;
  grid.hidden=false;
  gamesTab.classList.add('on');
  $('soundsTab')?.classList.remove('on');
  $('wordsTab')?.classList.remove('on');
 }
 const leaveGames=()=>{
  isFindOpen=false;
  if(findCompletion)findCompletion.hidden=true;
  if(findGame)findGame.hidden=true;
  view.hidden=true;
  gamesTab.classList.remove('on');
  active=null;
 };
 $('soundsTab')?.addEventListener('click',leaveGames);
 $('wordsTab')?.addEventListener('click',leaveGames);
 gamesTab.onclick=showList;

 function openFindGame(){
  active='find';
  isFindOpen=true;
  hidePractice();
  grid.hidden=true;
  host.hidden=true;
  findGame.hidden=false;
  findTaskIndex=0;
  createWordFindSession();
  createSoundFindSession();
  setFindMode(findMode);
 }

 if(findCard)findCard.onclick=openFindGame;
 grid.querySelector('[data-game="find"]')?.addEventListener('click',openFindGame);
 if(allGames)allGames.onclick=showList;
 if(soundsMode)soundsMode.onclick=()=>setFindMode('sounds');
 if(wordsMode)wordsMode.onclick=()=>setFindMode('words');
 if(findPrev)findPrev.onclick=()=>{if(findTaskIndex>0){findTaskIndex--;renderFindTask();}};
 if(findNext)findNext.onclick=goNextFindTask;
 if(findPicture)findPicture.onclick=()=>{
  const task=currentFindTask();
  if(!task)return;
  if(findMode==='sounds'){
   speakText(ASSOC[task.targetSound]?ASSOC[task.targetSound][0]:task.targetSound);
   return;
  }
  speakText(task.targetWord);
 };
 const progressHtml=(tasks)=>'<div class="game-progress">'+tasks.map(t=>'<span class="game-step'+(t.rewarded?' done':'')+'">'+(t.rewarded?'✓':'')+'</span>').join('')+'</div>';
 const finish=(restart)=>{host.innerHTML='<div class="game-complete">'+completionHtml+'</div>';host.querySelector('.game-again').onclick=restart;};
 const taskEngine=(tasks,render,restart)=>{let original=tasks,session=[...tasks],i=0;const current=()=>session[i],done=()=>original.length&&original.every(t=>t.rewarded);const nav=()=>{const prev=host.querySelector('.game-prev'),next=host.querySelector('.game-next');if(prev)prev.disabled=i===0;if(next){next.disabled=!current()?.completed;next.classList.toggle('ready',!!current()?.completed);}};const redraw=()=>{render(current(),{original,session,index:i,current,redraw,nav,next,prev,reward});nav();};const reward=(t,correct)=>{t.attempted=true;if(!correct){t.hadWrongAttempt=true;return false;}t.completed=true;if(!t.hadWrongAttempt&&!t.rewarded)t.rewarded=true;return t.rewarded;};const retry=()=>{session=shuffle(original.filter(t=>!t.rewarded).map(t=>({...t,attempted:false,completed:false,hadWrongAttempt:false})));i=0;redraw();};function next(){if(!current()?.completed)return;if(i<session.length-1){i++;redraw();}else if(done())finish(restart);else retry();}function prev(){if(i>0){i--;redraw();}}redraw();};
 const shell=(title,body,steps)=>{host.hidden=false;grid.hidden=true;host.innerHTML='<div class="en-game"><div class="game-header"><button class="game-back">← Games</button><span class="game-title">'+title+'</span></div>'+progressHtml(steps)+'<div class="game-task"><button class="game-nav game-prev">‹</button>'+body+'<button class="game-nav game-next">›</button></div></div>';host.querySelector('.game-back').onclick=showList;};
 function startFind(){active='find';const p=pool();if(p.length<2){host.hidden=false;grid.hidden=true;empty(host,2);return;}const words=shuffle(p).slice(0,size()),tasks=createDoubleExposureTasks(words,p,(targetWord,distractor)=>({targetWord,answers:shuffle([targetWord,distractor]),attempted:false,completed:false,hadWrongAttempt:false,rewarded:false}));taskEngine(tasks,(t,e)=>{shell('Find','<button class="game-picture">'+(data(t.targetWord)?.picture||'🔊')+'</button><div class="game-prompt">Find “'+shown(t.targetWord)+'”</div><div class="game-answers"></div>',e.original);const ans=host.querySelector('.game-answers');t.answers.forEach(label=>{const b=document.createElement('button');b.className='game-answer'+(t.completed&&label===t.targetWord?' correct':'');learning(b,label);b.onclick=()=>{if(t.completed)return;const ok=label===t.targetWord;e.reward(t,ok);if(ok){b.classList.add('correct');e.redraw();}else b.classList.add('wrong');};ans.append(b);});host.querySelector('.game-picture').onclick=()=>speakWord(t.targetWord);host.querySelector('.game-prev').onclick=e.prev;host.querySelector('.game-next').onclick=e.next;},startFind);}
 function startCatch(){active='catch';const p=pool();if(p.length<2){host.hidden=false;grid.hidden=true;empty(host,2);return;}const words=shuffle(p).slice(0,size()),tasks=createDoubleExposureTasks(words,p,(targetWord,distractor)=>({targetWord,answers:shuffle([targetWord,distractor]),attempted:false,completed:false,hadWrongAttempt:false,rewarded:false}));taskEngine(tasks,(t,e)=>{shell('Catch','<button class="game-picture">'+(data(t.targetWord)?.picture||'🔊')+'</button><div class="catch-area"></div>',e.original);const area=host.querySelector('.catch-area');t.answers.forEach((label,j)=>{const b=document.createElement('button');b.className='game-answer catch-answer'+(t.completed&&label===t.targetWord?' correct':'');learning(b,label);b.style.transform='translate('+(j?65:5)+'%, '+(j?180:20)+'px)';b.onclick=()=>{if(t.completed)return;const ok=label===t.targetWord;e.reward(t,ok);if(ok){b.classList.add('correct');e.redraw();}else b.classList.add('wrong');};area.append(b);});if(!t.completed)setTimeout(()=>{[...area.children].forEach((b,j)=>b.style.transform='translate('+(j?5:65)+'%, '+(j?20:180)+'px)');},30);host.querySelector('.game-picture').onclick=()=>speakWord(t.targetWord);host.querySelector('.game-prev').onclick=e.prev;host.querySelector('.game-next').onclick=e.next;},startCatch);}
 const shuffledGraphemes=(gs,avoid='')=>{for(let n=0;n<12;n++){const x=shuffle(gs);if(x.join('|')!==avoid&&x.join('|')!==gs.join('|'))return x;}return [...gs].reverse();};
 function startBuild(){active='build';const p=pool();if(p.length<1){host.hidden=false;grid.hidden=true;empty(host,1);return;}const words=shuffle(p).slice(0,size()),tasks=[];words.forEach(targetWord=>{const gs=graphemes(targetWord),a=shuffledGraphemes(gs),b=shuffledGraphemes(gs,a.join('|'));[a,b].forEach(order=>tasks.push({targetWord,graphemes:gs,tiles:order.map((g,id)=>({id,g})),placed:Array(order.length).fill(null),attempted:false,completed:false,hadWrongAttempt:false,rewarded:false}));});const arranged=arrangeTasks(tasks);taskEngine(arranged,(t,e)=>{shell('Build Word','<button class="game-picture">'+(data(t.targetWord)?.picture||'🔊')+'</button><div class="build-slots"></div><div class="build-tiles"></div>',e.original);const slots=host.querySelector('.build-slots'),tiles=host.querySelector('.build-tiles');t.placed.forEach(tile=>{const b=document.createElement('button');b.className='build-slot'+(!tile?' empty':'')+(t.completed?' correct':'');if(tile)learning(b,tile.g);b.disabled=!tile||t.completed;if(tile)b.onclick=()=>{const k=t.placed.findIndex(x=>x?.id===tile.id);if(k>=0)t.placed[k]=null;e.redraw();};slots.append(b);});t.tiles.forEach(tile=>{const b=document.createElement('button');b.className='build-tile';learning(b,tile.g);b.disabled=t.completed||t.placed.some(x=>x?.id===tile.id);b.onclick=()=>{const k=t.placed.findIndex(x=>x===null);if(k<0)return;t.placed[k]=tile;if(t.placed.every(Boolean)){const assembled=t.placed.map(x=>x.g).join('');const expected=t.graphemes.join('');const ok=assembled===expected;e.reward(t,ok);if(!ok)setTimeout(()=>{t.placed=Array(t.tiles.length).fill(null);e.redraw();},350);else e.redraw();}else e.redraw();};tiles.append(b);});host.querySelector('.game-picture').onclick=()=>speakWord(t.targetWord);host.querySelector('.game-prev').onclick=e.prev;host.querySelector('.game-next').onclick=e.next;},startBuild);}
 function startMissing(){active='missing';const p=pool();if(p.length<2){host.hidden=false;grid.hidden=true;empty(host,2);return;}const words=shuffle(p).slice(0,size()),tasks=[];words.forEach(targetWord=>{for(let n=0;n<2;n++){const other=shuffle(words.filter(w=>w!==targetWord))[0]||shuffle(p.filter(w=>w!==targetWord))[0];if(!other)continue;const distractor=shuffle(p.filter(w=>w!==targetWord&&w!==other))[0]||other;const first=Math.random()<.5?targetWord:other,second=first===targetWord?other:targetWord;tasks.push({targetWord,first,second,missing:targetWord,answers:shuffle([...new Set([targetWord,distractor])]),phase:'memorize',attempted:false,completed:false,hadWrongAttempt:false,rewarded:false});}});const arranged=arrangeTasks(tasks);let timer=0;const restart=()=>{clearTimeout(timer);startMissing();};taskEngine(arranged,(t,e)=>{clearTimeout(timer);const answer=t.phase==='answer';shell("What’s Missing?",'<div class="game-prompt">'+(answer?'What’s missing?':'Remember')+'</div><div class="missing-pair"><div class="missing-word" id="mw1"></div><div class="missing-word" id="mw2"></div></div><div class="game-answers"></div>',e.original);const one=host.querySelector('#mw1'),two=host.querySelector('#mw2');if(answer&&!t.completed&&t.first===t.missing)one.textContent='?';else learning(one,t.first);if(answer&&!t.completed&&t.second===t.missing)two.textContent='?';else learning(two,t.second);if(answer){const box=host.querySelector('.game-answers');t.answers.forEach(label=>{const b=document.createElement('button');b.className='game-answer'+(t.completed&&label===t.missing?' correct':'');learning(b,label);b.onclick=()=>{if(t.completed)return;const ok=label===t.missing;e.reward(t,ok);if(ok)e.redraw();else b.classList.add('wrong');};box.append(b);});}else{const sec=Number(localStorage.getItem('phonika-en-missing-memory-seconds')||10);timer=setTimeout(()=>{t.phase='answer';e.redraw();},[5,7,10,15].includes(sec)?sec*1000:10000);}host.querySelector('.game-prev').onclick=e.prev;host.querySelector('.game-next').onclick=e.next;},restart);}
 grid.querySelector('[data-game="find"]').onclick=startFind;grid.querySelector('[data-game="catch"]').onclick=startCatch;grid.querySelector('[data-game="build"]').onclick=startBuild;grid.querySelector('[data-game="missing"]').onclick=startMissing;
 $('parentOpen')?.addEventListener('click',()=>{if(!view.hidden)localStorage.setItem('phonika-en-return-games',active||'list');});
 $('parentBack')?.addEventListener('click',()=>{const ret=localStorage.getItem('phonika-en-return-games');if(!ret)return;localStorage.removeItem('phonika-en-return-games');requestAnimationFrame(()=>{showList();if(ret==='find')startFind();else if(ret==='catch')startCatch();else if(ret==='build')startBuild();else if(ret==='missing')startMissing();});});
 window.PhonikaGamesEN={shuffle,arrangeTasks,availableWords,pool,graphemesForWord:graphemes};
}

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initGames);
} else {
 initGames();
}

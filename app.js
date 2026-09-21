'use strict';
document.write('<script src="./app-core.js?v=35"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
 if(localStorage.getItem('phonika-letter-mode')!=='upper'){mode='upper';save();render();}
 const sound=document.getElementById('soundCard');
 const word=document.getElementById('wordCard');
 const picture=document.getElementById('picture');
 const mastery=document.getElementById('mastery');

 const speakAssociationWord=()=>{const key=currentKey();if(!key||!('speechSynthesis' in window))return;const text=section==='sounds'&&ASSOC[key]?ASSOC[key][0]:((currentWordObj()||{}).word||key);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.72;speechSynthesis.speak(u);};
 const useAudio=()=>{usedHint=true;mastery.disabled=true;speakAssociationWord();};
 const helpButton=document.getElementById('help');if(helpButton)helpButton.onclick=useAudio;
 const pictureButton=document.getElementById('showPicture');if(pictureButton)pictureButton.onclick=()=>{usedHint=true;mastery.disabled=true;picture.hidden=!picture.hidden;pictureButton.querySelector('span').textContent=picture.hidden?'Show picture':'Hide picture';};
 sound.onclick=()=>{if(section==='sounds')speakAssociationWord();};
 word.onclick=null;
 picture.onclick=null;
 const prevCard=document.getElementById('prevCard');
 const nextCard=document.getElementById('nextCard');
 const refreshNav=()=>{const count=section==='words'?sessionQueue.length:(soundSessionQueue.length?soundSessionQueue.length:soundQueue.length);const pos=section==='words'?sessionIndex:(soundSessionQueue.length?soundSessionIndex:index);prevCard.hidden=count<2||pos<=0;nextCard.hidden=count===0;};
 nextCard.onclick=()=>{
  if(section==='sounds'){
   if(!soundSessionQueue.length){startSoundSession();refreshNav();return;}
   const key=currentKey();
   if(key&&marked)soundSessionReads.set(key,Math.min(SESSION_GOAL,(soundSessionReads.get(key)||0)+1));
   const oldQueue=[...soundSessionQueue],oldIndex=soundSessionIndex;
   const pending=oldQueue.filter(s=>(soundSessionReads.get(s)||0)<SESSION_GOAL);
   if(!pending.length){soundSessionQueue=[];soundSessionIndex=0;document.getElementById('practice').hidden=true;document.getElementById('finish').hidden=false;refreshNav();return;}
   const oldNext=oldQueue[(oldIndex+1)%oldQueue.length];
   soundSessionQueue=pending;
   const nextPos=pending.indexOf(oldNext);
   soundSessionIndex=nextPos>=0?nextPos:0;
   index=soundSessionIndex;
   render();refreshNav();return;
  }
  next();refreshNav();
 };
 prevCard.onclick=()=>{if(section==='words'){if(sessionQueue.length&&sessionIndex>0){sessionIndex--;render();}}else if(soundSessionQueue.length&&soundSessionIndex>0){soundSessionIndex--;index=soundSessionIndex;render();}refreshNav();};
 document.getElementById('wordsTab').addEventListener('click',()=>requestAnimationFrame(refreshNav));
 document.getElementById('soundsTab').addEventListener('click',()=>requestAnimationFrame(refreshNav));
 refreshNav();
});
window.addEventListener('DOMContentLoaded',()=>{
 const practice=document.getElementById('practice'),stage=practice?.querySelector('.stage'),mastery=document.getElementById('mastery');
 if(!practice||!stage||!mastery)return;
 const track=document.createElement('div');track.className='lesson-progress';track.innerHTML='<div class="progress-line"></div><div class="progress-dots"></div><div class="progress-dino">🦕</div><div class="progress-flag">🏁</div>';
 practice.insertBefore(track,stage);
 const dots=track.querySelector('.progress-dots'),dino=track.querySelector('.progress-dino');let progress=0;
 const goal=10;
 const draw=()=>{dots.replaceChildren(...Array.from({length:goal},(_,i)=>{const s=document.createElement('span');s.className='progress-dot'+(i<progress?' done':'');s.textContent=i<progress?'✓':'';return s;}));const pct=Math.min(100,progress/goal*100);dino.style.left='calc(7% + '+(pct*.86)+'%)';};
 mastery.addEventListener('click',()=>{setTimeout(()=>{if(mastery.classList.contains('done')||mastery.disabled){progress=Math.min(goal,progress+1);draw();}},0);});
 document.getElementById('soundsTab')?.addEventListener('click',()=>{progress=0;draw();});
 document.getElementById('wordsTab')?.addEventListener('click',()=>{progress=0;draw();});
 draw();
});
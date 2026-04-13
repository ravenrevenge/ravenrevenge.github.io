const cv=document.getElementById('bgcanvas'),cx=cv.getContext('2d');
let W,H;
function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
resize();addEventListener('resize',resize);
const rand=(a,b)=>a+Math.random()*(b-a);

const particles=Array.from({length:70},()=>({
  reset(init){this.x=rand(0,W);this.y=init?rand(0,H):H+8;this.r=rand(.4,1.8);this.vx=rand(-.18,.18);this.vy=rand(-.4,-1.1);this.op=rand(.04,.16);this.life=rand(.4,1);this.decay=rand(.001,.0025);this.col=['#cba6f7','#f5c2e7','#89b4fa','#94e2d5','#fab387','#a6e3a1','#f38ba8','#b4befe'][Math.floor(rand(0,8))];},
  update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;if(this.life<=0||this.y<-10)this.reset(false);},
  draw(){cx.save();cx.globalAlpha=this.op*this.life;cx.fillStyle=this.col;cx.beginPath();cx.arc(this.x,this.y,this.r,0,Math.PI*2);cx.fill();cx.restore();}
}));
particles.forEach(p=>p.reset(true));

const drops=Array.from({length:80},()=>({
  reset(init){this.x=rand(0,W);this.y=init?rand(0,H):-10;this.len=rand(25,75);this.spd=rand(1.2,3);this.op=rand(.007,.025);this.w=rand(.3,.7);},
  update(){this.y+=this.spd;this.x-=this.spd*.18;if(this.y>H+20)this.reset(false);},
  draw(){cx.save();cx.globalAlpha=this.op;cx.strokeStyle='#cba6f7';cx.lineWidth=this.w;cx.beginPath();cx.moveTo(this.x,this.y);cx.lineTo(this.x-this.len*.14,this.y+this.len);cx.stroke();cx.restore();}
}));
drops.forEach(d=>d.reset(true));

(function loop(){cx.clearRect(0,0,W,H);drops.forEach(d=>{d.update();d.draw();});particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(loop);})();

const shapes=[
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="currentColor"><path d="M20.19 19c1.76 0 3.19-.42 3.19-2.227c0-1.816-1.43-3.283-3.19-3.273c-1.76 0-3.19 1.467-3.19 3.273S18.43 19 20.19 19m-8.435 0c1.79 0 3.245-.42 3.245-2.222c0-1.813-1.444-3.278-3.245-3.278c-1.8 0-3.255 1.475-3.255 3.278S9.965 19 11.755 19m4.82 1h-1.15c-.287 0-.499-.33-.4-.642l.211-.726c.107-.377.417-.632.76-.632c.342 0 .644.255.759.623l.22.726c.098.311-.106.651-.4.651"/><path d="M9.892 6.892L8.696 5.696a2.5 2.5 0 1 0-4.654-1.654a2.5 2.5 0 1 0 1.654 4.654l1.188 1.188A10.95 10.95 0 0 0 5 16.04c0 2.034.56 3.534 1.732 4.528c.342.29.72.522 1.125.709l-2.16 2.167a2.4 2.4 0 0 0-1.34-.41c-1.3 0-2.357 1.04-2.357 2.322c0 1.28 1.056 2.312 2.356 2.312A2.34 2.34 0 0 0 6.703 30c1.3 0 2.356-1.04 2.356-2.322c0-.53-.183-1.011-.487-1.401l1.464-1.47a2.626 2.626 0 0 0 4.254 1.597c.47.373 1.064.596 1.71.596s1.24-.223 1.71-.596a2.626 2.626 0 0 0 4.256-1.604l1.484 1.55a2.322 2.322 0 0 0 1.91 3.64c1.28 0 2.32-1.04 2.32-2.32c1.28 0 2.33-1.03 2.33-2.31s-1.04-2.32-2.32-2.32c-.53 0-1.01.18-1.4.48l-2.145-2.24a5 5 0 0 0 1.123-.709C26.441 19.576 27 18.073 27 16.04a10.95 10.95 0 0 0-1.882-6.158l1.186-1.186a2.5 2.5 0 1 0 1.654-4.654a2.5 2.5 0 1 0-4.654 1.654L22.11 6.89A10.95 10.95 0 0 0 16 5.04c-2.26 0-4.36.682-6.108 1.852M13.25 23v1.375a.625.625 0 1 1-1.25 0v-4.302l-.913-.08c-1.444-.125-2.43-.416-3.062-.95C7.445 18.55 7 17.705 7 16.04c0-4.968 4.032-9 9-9s9 4.023 9 9c0 1.667-.446 2.514-1.026 3.006c-.63.535-1.616.827-3.057.948L20 20.07v4.305a.625.625 0 1 1-1.25 0V23a1 1 0 1 0-2 0v1.25a.75.75 0 0 1-1.5 0V23a1 1 0 1 0-2 0"/></g></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" d="M19.1 10.66c1.111 1.314.88 2.922.88 4.34c0 3.906-5.267 5-7.98 5s-7.98-1.094-7.98-5c0-1.418-.231-3.026.88-4.34m14.2 0c-.195-.23-.43-.45-.716-.66m.715.66c.7.403.88-1.105.881-1.598V7.188C19.98 5.563 18.863 5 17.905 5c-.957 0-2.873 1.563-3.511 1.563c-.766 0-.914-.157-2.394-.157s-1.628.157-2.394.157C8.968 6.563 7.052 5 6.095 5S4.02 5.563 4.02 7.188v1.875c.002.492.18 2 .88 1.597m0 0c.195-.23.43-.45.716-.66"/><path d="M12.826 16c0 .173-.361.313-.807.313c-.445 0-.806-.14-.806-.313s.361-.312.806-.312s.807.14.807.312Zm2.674-2.406c0 .431-.217.781-.484.781s-.484-.35-.484-.781s.217-.781.484-.781s.484.35.484.78Zm-6 0c0 .431-.217.781-.484.781s-.484-.35-.484-.781s.217-.781.484-.781s.484.35.484.78Z"/><path stroke-linecap="round" d="M22 15.469c-.483-.313-2.58-1.094-3.387-1.094m1.774 3.594c-.484-.313-1.613-1.094-2.42-1.094M2 15.469c.484-.313 2.58-1.094 3.387-1.094m-1.774 3.594c.484-.313 1.613-1.094 2.42-1.094"/></g></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10c0-.463-.694-.54-.933-.143a6.5 6.5 0 1 1-8.924-8.924C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M3 12c6.268 0 9-2.637 9-9c0 6.363 2.713 9 9 9c-6.287 0-9 2.713-9 9c0-6.287-2.732-9-9-9Z"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M16 10.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5s.448-1.5 1-1.5s1 .672 1 1.5"/><ellipse cx="9" cy="10.5" fill="currentColor" rx="1" ry="1.5"/><path stroke="currentColor" stroke-width="1.5" d="M22 19.723v-7.422C22 6.61 17.523 2 12 2S2 6.612 2 12.3v7.423c0 1.322 1.351 2.182 2.5 1.591a2.82 2.82 0 0 1 2.896.186a2.82 2.82 0 0 0 3.208 0l.353-.242a1.84 1.84 0 0 1 2.086 0l.353.242a2.82 2.82 0 0 0 3.208 0a2.82 2.82 0 0 1 2.897-.186c1.148.591 2.499-.269 2.499-1.591Z"/></g></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M17.382 6.001L13.07 17.184l4.574 24.8l12.673.014l4.614-24.796l-4.294-11.19zm14.629-1.988L16.01 4L11 16.992l4.978 26.99l16 .018L37 17.013z"/><path d="M23 17.997V26h2v-8.003h3v-2h-3V13h-2v2.997h-3v2z"/></g></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="currentColor" d="M61.088 19.088c-4.482-12.049-16.152-11.637-23.15-7.349l-5.376 11.288l9.953-.927l-10.249 13.159l8.429-2.15l-5.285 20.89l-1.643-14.132l-11.861 2.543l9.072-14.445l-7.822-1.139l5.381-12.364c-6.404-6.39-22.973-7.569-26.209 7.755c-3.854 18.253 27.348 29.586 32.927 32.712l-.011.071l.066-.043c.023.014.055.03.078.043l.002-.095c8.434-5.432 31.45-20.359 25.698-35.817"/></svg>`,
];
const sw=document.getElementById('skull-wrap');
const cols=['#cba6f7','#f5c2e7','#89b4fa','#94e2d5','#fab387','#a6e3a1','#f38ba8','#b4befe'];
let colQueue=[];
for(let i=0;i<12;i++){
  const el=document.createElement('div');
  const s=rand(14,26),col=cols[i%cols.length];
  const blur=rand(0.5,2);el.style.cssText=`position:absolute;left:${rand(2,93)}%;bottom:${rand(-8,16)}px;width:${s}px;height:${s}px;animation:skullfloat ${rand(4,9)}s ${rand(0,8)}s linear infinite;pointer-events:none;color:${col};filter:blur(${blur}px) drop-shadow(0 0 4px ${col});opacity:0.6;`;
  el.innerHTML=shapes[i%shapes.length];
  el.addEventListener('animationiteration', ()=>{
    if(colQueue.length===0) colQueue=[...cols].sort(()=>Math.random()-.5);
    const col=colQueue.pop();
    const blur=rand(0.5,2);
    el.style.color=col;
    el.style.filter=`blur(${blur}px) drop-shadow(0 0 4px ${col})`;
  });
  sw.appendChild(el);
}

function goSelect(sel){
  go(sel.value, null);
}
function go(name,btn){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('p-'+name).classList.add('active');
  if(btn){btn.classList.add('active');btn.classList.remove('bounce');void btn.offsetWidth;btn.classList.add('bounce');}
}

// Banner glitch
const glFrames  = ['(Raven Revenge)','[RaVen Rev|Nge]','[rAVeN rev|NgE]','[rAV?N rev|NgE]','[rAV?N rev|NgE]','(Raven Revenge)'];
const glColors  = ['#8b6aad','#cba6f7','#cba6f7','#cba6f7','#cba6f7','#8b6aad'];
const FRAME_MS  = 150;
const REST_MS   = 5000;

function triggerVHS(a, b, text) {
  [a,b].forEach(el=>{
    el.textContent = text;
    el.classList.remove('go');
    void el.offsetWidth;
    el.classList.add('go');
  });
}

(function glitchLoop() {
  const el  = document.getElementById('banner-title');
  const vhsA = document.getElementById('bt-vhs-a');
  const vhsB = document.getElementById('bt-vhs-b');
  let i = 0;
  function next() {
    const txt = glFrames[i];
    const col = glColors[i];
    el.childNodes[0].textContent = txt;
    el.style.color = col;
    vhsA.textContent = txt;
    vhsB.textContent = txt;
    if (i === 1) triggerVHS(vhsA, vhsB, txt);
    i++;
    if (i < glFrames.length) setTimeout(next, FRAME_MS);
    else { i = 0; setTimeout(next, REST_MS); }
  }
  setTimeout(next, 3000);
})();
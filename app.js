// MicroMarine Web — cockpit logic extracted from V0.27.
// Behavior preserved; refactor and tests to follow.
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
let heading=0,lastTick=performance.now();
let profile="sail",left={x:0,y:0},right={x:0,y:0};
let neutralDetent=true;
const theme=$("theme");
const fs=$("fullscreen");
const standalone=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
function fsLabel(){fs.textContent=standalone()?"✓ App-Modus":document.fullscreenElement?"⤢ Beenden":"⛶ Vollbild"}
fs.addEventListener("click",async()=>{if(standalone()){alert("MicroMarine läuft bereits im Home-Bildschirm-Modus.");return}if(document.fullscreenElement){try{await document.exitFullscreen()}catch(e){};fsLabel();return}if(document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen();fsLabel();return}catch(e){}}alert("Auf dem iPhone: Safari → Teilen → Zum Home-Bildschirm. Danach MicroMarine über das neue Symbol öffnen, um die Safari-Leisten auszublenden.")});
document.addEventListener("fullscreenchange",fsLabel);fsLabel();
try{const saved=localStorage.getItem("micromarine-theme");if(saved==="neutral"||saved==="maritime"||saved==="walnut")theme.value=saved}catch(e){}
document.body.dataset.theme=theme.value;
theme.addEventListener("change",()=>{document.body.dataset.theme=theme.value;try{localStorage.setItem("micromarine-theme",theme.value)}catch(e){}});
function paint(el,v){
if(el.id==="leftPad"){
const handle=el.querySelector(".throttle-handle");
// rotateX: forward/backward tip, fixed foot. No left/right pendulum motion.
handle.style.transform="translate(-50%,calc(-50% + "+(v.y*20)+"px))";
el.setAttribute("aria-valuenow",String(Math.round(-v.y*100)));
}else{
el.querySelector(".wheel-assembly").style.transform="rotate("+(v.x*100)+"deg)";
el.setAttribute("aria-valuenow",String(Math.round(v.x*100)));
}}
function scaleSegments(segments){const pt=t=>[100+67*Math.cos(Math.PI*(1-t)),110-67*Math.sin(Math.PI*(1-t))];return segments.map(([a,b,color])=>{const p=pt(a),q=pt(b);return `<path d="M ${p[0].toFixed(2)} ${p[1].toFixed(2)} A 67 67 0 0 1 ${q[0].toFixed(2)} ${q[1].toFixed(2)}" fill="none" stroke="${color}" stroke-width="10"/>`}).join("")}
function motorTicks(){let lines="";for(let p=-100;p<=100;p+=5){const t=(p+100)/200,theta=Math.PI*(1-t),major=p%50===0,medium=p%25===0;const outer=69,inner=major?54:medium?58:63;const xy=radius=>[100+radius*Math.cos(theta),110-radius*Math.sin(theta)];const a=xy(inner),b=xy(outer);lines+='<line x1="'+a[0].toFixed(2)+'" y1="'+a[1].toFixed(2)+'" x2="'+b[0].toFixed(2)+'" y2="'+b[1].toFixed(2)+'" stroke="#d0c5ac" stroke-width="'+(major?2.6:medium?2:1.1)+'" stroke-linecap="round"/>';}return lines;}
function update(){
const throttle=Math.round(-left.y*100),rudder=Math.round(right.x*100);
const sail=Math.round((1+left.y)*50); // top = 0% (hauled in), bottom = 100% (eased out)
const ml=profile==="twin"?clamp(throttle+rudder,-100,100):profile==="single"?throttle:null;
const mr=profile==="twin"?clamp(throttle-rudder,-100,100):null;
$("leftValue").textContent=profile==="sail"?"SCHOT "+String(sail).padStart(3,"0")+" %":"GAS "+(throttle<0?"−":"+")+String(Math.abs(throttle)).padStart(3,"0")+" %";
$("rightValue").textContent=(profile==="twin"?"DIFF ":"RUDER ")+(rudder<0?"−":"+")+String(Math.abs(rudder)).padStart(3,"0")+" %";
const gaugeValue=profile==="sail"?sail:throttle;
const signedPower=profile==="sail"?String(sail):(throttle<0?"−"+Math.abs(throttle):String(throttle));
const powerScale=$("powerScale");
if(powerScale){powerScale.innerHTML=profile==="sail"?scaleSegments([[0,.25,"#b9655a"],[.25,.5,"#c5a56d"],[.5,.75,"#6b9fa4"],[.75,1,"#5488b4"]]):motorTicks();}
$("thirdGaugeTitle").textContent=profile==="sail"?"Segelstellung":"Motorleistung";
$("power").textContent=signedPower+" %";
$("powerNeedle").style.transform="rotate("+(profile==="sail"?-90+gaugeValue*1.8:gaugeValue*.9)+"deg)";
$("outputs").textContent=profile==="sail"
?"Ruder "+rudder+" % · Schot "+sail+" % · Kein Motor"
:profile==="single"
?"Ruder "+rudder+" % · Motor "+throttle+" %"
:"Motor links "+ml+" % · Motor rechts "+mr+" %";
}

function compassUpdate(){
const angle=((heading%360)+360)%360;
$("headingText").textContent=String(Math.round(angle)%360).padStart(3,"0")+"°";
$("compassRose").style.setProperty("--compass-angle",(-heading)+"deg");
}
function axis(side){return side==="left"?"vertical":"horizontal"}
function stick(id,side){
const el=$(id);el.dataset.axis=axis(side);let pointer=null;
function move(e){
const r=el.getBoundingClientRect(),rad=r.width*.35;
const v={x:0,y:0};
if(side==="left"){const raw=clamp((e.clientY-r.top-r.height/2)/rad,-1,1);if(profile!=="sail"){if(Math.abs(raw)<=.055)neutralDetent=true;else if(Math.abs(raw)>=.11)neutralDetent=false;v.y=neutralDetent?0:raw;}else v.y=raw;}
else v.x=clamp((e.clientX-r.left-r.width/2)/rad,-1,1);
if(side==="left")left=v;else right=v;
paint(el,v);update();
}
el.addEventListener("pointerdown",e=>{if(pointer!==null)return;pointer=e.pointerId;el.setPointerCapture(pointer);move(e)});
el.addEventListener("pointermove",e=>{if(e.pointerId===pointer)move(e)});
function release(e){
if(e.pointerId!==pointer)return;
pointer=null;
if(side==="right"){right={x:0,y:0};paint(el,right);update()}
}
el.addEventListener("pointerup",release);
el.addEventListener("pointercancel",release);
}
stick("leftPad","left");stick("rightPad","right");
[["leftPad","left"],["rightPad","right"]].forEach(([id,side])=>{$(id).addEventListener("keydown",e=>{const delta=(e.key==="ArrowUp"||e.key==="ArrowRight")?-.1:(e.key==="ArrowDown"||e.key==="ArrowLeft")?.1:0;if(!delta)return;e.preventDefault();if(side==="left"){left.y=clamp(left.y+delta,-1,1);if(profile!=="sail"&&Math.abs(left.y)<.06){left.y=0;neutralDetent=true}else neutralDetent=false;paint($(id),left)}else{right.x=clamp(right.x-delta,-1,1);paint($(id),right)}update()})});
document.querySelectorAll("[data-profile]").forEach(btn=>btn.addEventListener("click",()=>{
profile=btn.dataset.profile;
neutralDetent=Math.abs(left.y)<.055;
$("rotaryKnob").style.setProperty("--rotary-angle",({sail:-45,single:0,twin:45})[profile]+"deg");
$("profileDrum").textContent=({sail:"SEGELBOOT",single:"MOTORBOOT",twin:"ZWEIMOTORIG"})[profile];
$("profileDrum").animate([{transform:"translateY(-65%)",opacity:.3},{transform:"translateY(0)",opacity:1}],{duration:190,easing:"ease-out"});
document.querySelectorAll("[data-profile]").forEach(b=>b.classList.toggle("active",b===btn));
$("leftTitle").textContent=profile==="sail"?"Segel":"Gas";
$("rightTitle").textContent=profile==="twin"?"Differenzial":"Ruder";
$("hint").textContent=profile==="sail"?"Schot 0 % = dichtgeholt, 100 % = gefiert · Ruder zentriert.":profile==="single"?"Gashebel rastet ein · Ruder zentriert.":"Gashebel rastet ein · Steuerrad mischt linke/rechte Motorleistung.";
left={x:0,y:0};right={x:0,y:0};neutralDetent=true;
paint($("leftPad"),left);paint($("rightPad"),right);update();
}));
function nextBoatProfile(){const modes=["sail","single","twin"];const next=modes[(modes.indexOf(profile)+1)%3];document.querySelector(`[data-profile="${next}"]`)?.click();}
$("rotaryKnob").addEventListener("click",nextBoatProfile);
$("profileWindow").addEventListener("click",nextBoatProfile);
$("stop").addEventListener("click",()=>{
left={x:0,y:0};right={x:0,y:0};
["lights","decklight","signal"].forEach(id=>$(id).checked=false);
paint($("leftPad"),left);paint($("rightPad"),right);update();
});
setInterval(()=>{
const now=performance.now(),dt=Math.min((now-lastTick)/1000,.25);lastTick=now;
const rudder=right.x;
const speed=profile==="sail"?.45:Math.max(0,Math.abs(left.y));
heading+=rudder*42*speed*dt;
compassUpdate();
},80);
compassUpdate();
update();
})();

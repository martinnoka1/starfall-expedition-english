import * as T from './three.module.js';
const $=id=>document.getElementById(id), canvas=$('world');
let renderer;try{renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(e){$('loading').innerHTML='<p>This device could not start 3D graphics. Try an up-to-date Safari or Chrome.</p>';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new T.Scene();scene.background=new T.Color('#080e1e');scene.fog=new T.FogExp2('#080e1e',.008);const camera=new T.PerspectiveCamera(48,1,.1,400);const clock=new T.Clock();
scene.add(new T.HemisphereLight(0xb3d6ff,0x152033,2));const sun=new T.DirectionalLight(0xffe0bf,3.3);sun.position.set(15,32,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:.5,far:90});sun.shadow.bias=-.001;scene.add(sun,sun.target);
const fill=new T.DirectionalLight(0x70aaff,2);fill.position.set(-15,10,-20);scene.add(fill);
const mat=(c,metal=.1,rough=.6,emissive=0)=>new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough,emissive,emissiveIntensity:1.8});
const white=mat(0xdfe9ed,.25,.45),dark=mat(0x142538,.65,.4),orange=mat(0xff9754,.25,.35),glass=mat(0x173c54,.9,.16),green=mat(0xc6fba9,.2,.3,0x5fbc5b),blue=mat(0x78c8ed,.2,.3,0x1675a5),red=mat(0xef6481,.2,.4,0x9a143f);
const boxG=new T.BoxGeometry(1,1,1),sphereG=new T.SphereGeometry(1,20,14),cylG=new T.CylinderGeometry(1,1,1,16);
function mesh(g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1,parent=scene){let a=new T.Mesh(g,m);a.position.set(x,y,z);a.scale.set(sx,sy,sz);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a;}
function box(m,x,y,z,sx,sy,sz,p){return mesh(boxG,m,x,y,z,sx,sy,sz,p)}
function ball(m,x,y,z,sx,sy,sz,p){return mesh(sphereG,m,x,y,z,sx,sy,sz,p)}
const starPos=[];for(let i=0;i<1700;i++){let a=Math.random()*Math.PI*2,b=Math.acos(Math.random()*2-1),r=140+Math.random()*130;starPos.push(Math.sin(b)*Math.cos(a)*r,Math.abs(Math.cos(b))*r-15,Math.sin(b)*Math.sin(a)*r);}const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.Float32BufferAttribute(starPos,3));const stars=new T.Points(starGeo,new T.PointsMaterial({color:0xbbdcff,size:.20,sizeAttenuation:true,fog:false}));scene.add(stars);
const planet=ball(mat(0x345c86,.05,.9),-63,24,-100,30,30,30);planet.castShadow=false;const halo=mesh(new T.SphereGeometry(1,32,24),new T.MeshBasicMaterial({color:0x659fc7,transparent:true,opacity:.09,side:T.BackSide,depthWrite:false}),-63,24,-100,31.6,31.6,31.6);const ring=mesh(new T.TorusGeometry(42,.14,8,100),mat(0x789ba8,.3,.6),-63,24,-100);ring.rotation.x=1.1;ring.rotation.y=.3;
// All visible game objects are actual 3D meshes.
const avatar=new T.Group();scene.add(avatar);box(white,0,1.05,0,.68,.8,.44,avatar);box(dark,0,1.10,.32,.52,.65,.25,avatar);box(orange,0,1.08,-.245,.40,.27,.04,avatar);box(green,.10,1.13,-.277,.09,.05,.02,avatar);ball(white,0,1.75,0,.44,.43,.4,avatar);ball(glass,0,1.77,-.18,.375,.30,.27,avatar);box(orange,0,1.39,0,.58,.08,.44,avatar);box(dark,0,.58,0,.55,.18,.37,avatar);
let legs=[],arms=[];for(let s of [-1,1]){let leg=new T.Group();leg.position.set(s*.20,.57,0);avatar.add(leg);box(white,0,-.20,0,.26,.45,.29,leg);box(dark,0,-.45,-.055,.29,.14,.43,leg);legs.push(leg);let arm=new T.Group();arm.position.set(s*.43,1.32,0);avatar.add(arm);ball(white,0,0,0,.17,.19,.18,arm);box(white,0,-.24,0,.23,.42,.24,arm);box(orange,0,-.40,0,.25,.10,.25,arm);ball(dark,0,-.50,0,.14,.15,.14,arm);arms.push(arm);mesh(cylG,dark,s*.22,.88,.41,.115,.46,.115,avatar);}
const flame=new T.Group();avatar.add(flame);for(let s of [-1,1]){let f=mesh(new T.ConeGeometry(.13,.68,12),new T.MeshBasicMaterial({color:0x7bdbff,transparent:true,opacity:.85}),s*.22,.35,.4,1,1,1,flame);f.rotation.z=Math.PI;}flame.visible=false;
const levels=[
 {name:'Echo Dock',note:'Collect the three cores. Hold jump in mid-air for the jetpack.',color:0xc6fba9,points:[[0,0,0,7],[0,.3,-8,5],[5,.7,-15,5],[1,1.1,-22,6],[-5,.5,-29,5],[-2,1,-37,7]],cores:[1,3,4],drones:[],lasers:[]},
 {name:'Lunar Garden',note:'New heights. Refuel the jetpack every time you land.',color:0x88d6f2,points:[[0,0,0,7],[-4,.8,-8,5],[2,1.6,-15,5],[7,2.3,-23,6],[1,3,-31,5],[-5,3.8,-38,5],[0,4.4,-46,7]],cores:[1,2,4,5],drones:[3],lasers:[]},
 {name:'Red Belt',note:'Red drones are patrolling. Fly over them.',color:0xffba82,points:[[0,0,0,7],[5,.5,-8,5],[1,1,-16,5],[-5,1.3,-23,6],[-1,1.8,-31,5],[6,2.3,-38,5],[1,2.8,-46,7]],cores:[1,2,4,5],drones:[1,3,5],lasers:[]},
 {name:'Silent Reactor',note:'The lasers pulse. Wait or jump over them.',color:0xc8acff,points:[[0,0,0,7],[-4,.6,-8,5],[2,1.3,-16,5],[7,1.9,-24,6],[1,2.5,-32,5],[-5,3.1,-40,5],[0,3.8,-48,7]],cores:[1,2,4,5],drones:[4],lasers:[2,3,5]},
 {name:'The Way Home',note:'The last signal. Activate the portal to Earth.',color:0xa1ffe0,points:[[0,0,0,7],[5,.7,-8,5],[0,1.4,-16,5],[-6,2.2,-24,6],[-1,3,-32,5],[5,3.8,-40,5],[0,4.5,-48,6],[-4,5.2,-56,7]],cores:[1,2,4,5,6],drones:[2,4,6],lasers:[3,5]}
];
let env=new T.Group();scene.add(env);let platforms=[],collectibles=[],drones=[],lasers=[],decor=[],portal,beacon,checkpoint=0,level=0,life=3,fuel=100,elapsed=0,collected=0,phase='menu',grounded=true,invulnerable=0,unlocked=0,best={},muted=true,audio=null;
try{const saved=JSON.parse(localStorage.getItem('starfall-save')||'{}');unlocked=Math.max(0,Math.min(4,Math.floor(Number(saved.unlocked)||0)));best=saved.best&&typeof saved.best==='object'?saved.best:{};}catch{}
const p=new T.Vector3(0,.04,0),vel=new T.Vector3(),keys={},joy={x:0,y:0},camTarget=new T.Vector3();let jetPressed=false,jumpLatch=false,toastTime=0,action=()=>{},menuTime=0,worldTime=0;
function tone(freq=440,dur=.15,type='sine',volume=.08){if(muted)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.65,audio.currentTime+dur);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+dur);}catch{}}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');toastTime=3;}
function save(){try{localStorage.setItem('starfall-save',JSON.stringify({unlocked,best}));}catch{}}
function build(n){resetInput();scene.remove(env);const disposed=new Set();env.traverse(o=>{if(o.geometry&&![boxG,sphereG,cylG].includes(o.geometry)&&!disposed.has(o.geometry)){o.geometry.dispose();disposed.add(o.geometry);}if(o.material&&![white,dark,orange,glass,green,blue,red].includes(o.material)&&!disposed.has(o.material)){o.material.dispose();disposed.add(o.material);}});env=new T.Group();scene.add(env);platforms=[];collectibles=[];drones=[];lasers=[];decor=[];const l=levels[n];
 const deck=mat(0x344659,.6,.65),edge=mat(0x182638,.5,.65),accent=mat(l.color,.2,.4,l.color);accent.emissiveIntensity=.45;
 l.points.forEach(([x,y,z,w],i)=>{let plat={x,y,z,w,index:i};platforms.push(plat);box(edge,x,y-.65,z,w,1.15,w,env);box(deck,x,y-.06,z,w-.10,.15,w-.10,env);box(accent,x,y-.15,z+w/2-.05,w-.3,.09,.10,env);box(accent,x,y-.15,z-w/2+.05,w-.3,.09,.10,env);for(let s of [-1,1]){box(dark,x+s*(w/2-.20),y+.10,z,.10,.12,w-.7,env);for(let t of [-1,1]){box(orange,x+s*(w/2-.35),y+.06,z+t*(w/2-.35),.42,.06,.42,env);}}
 for(let k=0;k<3;k++)box(mat(0x657285,.3,.7),x+(k-1)*.45,y+.026,z+w*.3,.23,.015,.55,env);
 const spindle=mesh(cylG,edge,x,y-2,z,.7,2.2,.7,env);box(blue,x,y-3.1,z,.5,.12,.5,env);
 if(i && i%3===0){let c=mesh(new T.TorusGeometry(.85,.035,8,40),accent,x,y+.05,z);scene.remove(c);env.add(c);c.rotation.x=Math.PI/2;plat.check=true;}
 if(i<l.points.length-1){const q=l.points[i+1];let dx=q[0]-x,dz=q[2]-z;for(let k=1;k<5;k++){let f=k/5;let dot=ball(accent,x+dx*f,y+.1+(q[1]-y)*f,z+dz*f,.06,.06,.06,env);dot.castShadow=false;}}
 // Antennae and cargo remain at the edges of the landing areas.
 if(i%2===0){box(dark,x-w*.32,y+1,z-w*.32,.08,2,.08,env);ball(blue,x-w*.32,y+2,z-w*.32,.10,.10,.10,env);box(edge,x+w*.28,y+.38,z-w*.30,.9,.7,.7,env);box(orange,x+w*.28,y+.74,z-w*.30,.8,.04,.12,env);}
 });
 l.cores.forEach(i=>{let a=platforms[i];const g=new T.Group();g.position.set(a.x,a.y+1.05,a.z);env.add(g);const gem=mesh(new T.OctahedronGeometry(.34),green,0,0,0,1,1.4,1,g);const r=mesh(new T.TorusGeometry(.58,.025,8,36),blue,0,0,0,1,1,1,g);r.rotation.x=.9;collectibles.push({g,base:a.y+1.05,taken:false});});
 l.drones.forEach((i,j)=>{let a=platforms[i],g=new T.Group();env.add(g);ball(dark,0,0,0,.46,.28,.42,g);ball(red,0,0,.30,.18,.16,.16,g);let r=mesh(new T.TorusGeometry(.64,.035,8,24),red,0,0,0,1,1,1,g);r.rotation.x=Math.PI/2;g.position.set(a.x+Math.sin(worldTime*1.15+j*2)*(a.w*.36),a.y+.95,a.z);drones.push({g,a,seed:j*2});});
 l.lasers.forEach((i,j)=>{let a=platforms[i],beam=box(red,a.x,a.y+.60,a.z,a.w-.2,.12,.12,env);for(let s of [-1,1]){box(dark,a.x+s*(a.w/2-.22),a.y+.6,a.z,.32,1.3,.4,env);ball(red,a.x+s*(a.w/2-.22),a.y+1.28,a.z,.15,.15,.15,env);}lasers.push({beam,a,seed:j*1.1,on:true});});
 let end=platforms[l.points.length-1];portal=new T.Group();portal.position.set(end.x,end.y,end.z);env.add(portal);let arch=mesh(new T.TorusGeometry(1.45,.15,12,64),white,0,1.65,-.6,1,1,1,portal);let inner=mesh(new T.TorusGeometry(1.22,.055,8,64),blue,0,1.65,-.59,1,1,1,portal);beacon=mesh(new T.CircleGeometry(1.18,48),new T.MeshBasicMaterial({color:l.color,transparent:true,opacity:.12,side:T.DoubleSide,depthWrite:false}),0,1.65,-.6,1,1,1,portal);box(dark,0,.12,-.6,3.4,.24,1,portal);
 // Distant orbital wreckage gives parallax without obstructing the course.
 for(let i=0;i<34;i++){let x=(i%2?-1:1)*(12+(i*7)%30),z=-i*3.7,y=-7-((i*3)%9);let a=box(edge,x,y,z,1.5+(i%3),3+(i%5),2,env);a.rotation.set(i*.2,i*.7,.3);decor.push(a);}
 level=n;checkpoint=0;life=3;fuel=100;elapsed=0;collected=0;invulnerable=0;p.set(0,.03,0);vel.set(0,0,0);grounded=true;jumpLatch=false;camTarget.copy(p);camera.position.set(10,10,14);$('levelname').textContent=l.name;$('chapter').textContent=`0${n+1} / 05`;$('objective').textContent='Collect the cores and reach the portal.';sectorArt(n);updateHud();
}
function updateHud(){$('cores').textContent=`${collected} / ${collectibles.length}`;$('hearts').textContent='● '.repeat(life)+'○ '.repeat(3-life);$('fuel').style.width=fuel+'%';$('timer').textContent=`${Math.floor(elapsed/60).toString().padStart(2,'0')}:${Math.floor(elapsed%60).toString().padStart(2,'0')}`;}
function controlsVisible(v){$('hud').hidden=!v;$('touch').hidden=!(v&&matchMedia('(pointer:coarse)').matches);}
function start(n){build(n);$('sectorintro').hidden=false;$('sectorintro').style.animation='none';void $('sectorintro').offsetWidth;$('sectorintro').style.animation='';$('sectorlabel').textContent=sectorData[n].label;$('sectortitle').textContent=levels[n].name;$('sectorstory').textContent=sectorData[n].story;arrivalTime=2.4;phase='playing';$('menu').hidden=true;$('dialog').hidden=true;controlsVisible(true);toast(n===0?(matchMedia('(pointer:coarse)').matches?'Stick — move. ↑ — jump; hold to fly. Drag the world for camera.':'WASD — move. Space — jump; hold to fly. Shift — dash.'):levels[n].note);tone(420,.4);}
function modal(tag,title,body,label,fn){resetInput();$('preferences').hidden=true;phase='paused';jetPressed=false;dashWanted=false;dashTime=0;orbitPointer=null;joy.x=joy.y=0;Object.keys(keys).forEach(k=>keys[k]=false);$('knob').style.transform='';$('dialogtag').textContent=tag;$('dialogtitle').textContent=title;$('dialogtext').textContent=body;$('dialogaction').textContent=label;$('dialogaction').hidden=false;$('levelbuttons').innerHTML='';action=fn;$('dialog').hidden=false;controlsVisible(false);}
function resume(){resetInput();clock.getDelta();phase='playing';$('dialog').hidden=true;controlsVisible(true);jumpLatch=false;}
function pause(){if(phase==='playing'){modal('EXPEDITION PAUSED','Take a breath.','WASD or arrows — move. Space — jump; hold in mid-air for the jetpack. Shift — dash. Drag the world to orbit the camera. R — return to checkpoint. On phone: stick, ↑ to fly and » to dash. Orange relics restore your shield. Three stars: all relics and a mission with no lives lost.','RESUME',resume);$('preferences').hidden=false;}else if(phase==='paused'&&action===resume)resume();}
function respawn(damage=true){if(phase!=='playing')return;if(damage&&shield&&p.y>-14){shield=false;invulnerable=2;flashTime=.25;burst(p.clone().add(new T.Vector3(0,1,0)),0x79daff,35,5);tone(150,.2);toast('The shield absorbed the hit.');return;}if(damage){life--;damageCount++;flashTime=.5;tone(110,.35,'sawtooth',.035);}if(life<=0){modal('SIGNAL LOST','One more try.','The cores are waiting. Use short flights and refuel on the platforms.','RETRY MISSION',()=>start(level));return;}resetInput();let a=platforms[checkpoint];p.set(a.x,a.y+.08,a.z+Math.min(1,a.w*.2));vel.set(0,0,0);grounded=true;fuel=100;invulnerable=2;jumpLatch=true;toast(damage?'Returned to the checkpoint.':'Back at the checkpoint.');updateHud();}
function win(){const rank=1+(relicTotal===3?1:0)+(relicTotal===3&&damageCount===0?1:0);records[level]={stars:Math.max(rank,records[level]?.stars||0),relics:Math.max(relicTotal,records[level]?.relics||0)};try{localStorage.setItem('starfall-records',JSON.stringify(records));}catch{}burst(portal.position.clone().add(new T.Vector3(0,2,0)),sectorData[level].accent,80,7);tone(880,.6);best[level]=Math.min(Number(best[level])||Infinity,elapsed);unlocked=Math.max(unlocked,Math.min(4,level+1));save();const last=level===4;modal(last?'EXPEDITION COMPLETE':'POWER NODE RESTORED',last?'Welcome home.':'The signal is restored.',last?'Five worlds. Five signals restored. You brought Echo Station back to life. You can replay the missions and improve your times.':`${levels[level].name} is back online. Time: ${$('timer').textContent}. Next: ${levels[level+1].name}.`,last?'NEW EXPEDITION':'NEXT MISSION',()=>start(last?0:level+1));const result=document.createElement('div');result.innerHTML=`<div class="resultstars">${'★'.repeat(rank)}${'☆'.repeat(3-rank)}</div><div class="resultstats"><div><strong>${$('timer').textContent}</strong><small>TIME</small></div><div><strong>${relicTotal}/3</strong><small>RELICS</small></div><div><strong>${damageCount}</strong><small>LIVES LOST</small></div></div>`;$('levelbuttons').append(result);}
function physics(dt,time){if(phase!=='playing')return;updateHazards(time);elapsed+=dt;expeditionTick(dt,time);coyote=grounded?.12:Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);invulnerable=Math.max(0,invulnerable-dt);let ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x,iz=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0)+joy.y;let len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}const mx=ix*Math.cos(cameraYaw)+iz*Math.sin(cameraYaw),mz=-ix*Math.sin(cameraYaw)+iz*Math.cos(cameraYaw);let speed=7.2;if(dashTime<=0){vel.x=T.MathUtils.damp(vel.x,mx*speed,grounded?15:5,dt);vel.z=T.MathUtils.damp(vel.z,mz*speed,grounded?15:5,dt);}const jump=!!(keys.Space||jetPressed);
 if(jump&&!jumpLatch)jumpBuffer=.14;if(jumpBuffer>0&&coyote>0){jumpBuffer=0;coyote=0;vel.y=8.8;grounded=false;tone(240,.12,'sine',.03);}let thrust=jump&&!grounded&&fuel>0;flame.visible=thrust;if(thrust){vel.y+=25*dt;fuel=Math.max(0,fuel-32*dt);vel.y=Math.min(vel.y,Math.max(6.5,vel.y-25*dt));}else if(grounded)fuel=Math.min(100,fuel+50*dt);jumpLatch=jump;vel.y-=sectorData[level].gravity*dt;let old=p.clone();p.addScaledVector(vel,dt);grounded=false;
 for(const a of platforms){if(Math.abs(p.x-a.x)<a.w/2+.15&&Math.abs(p.z-a.z)<a.w/2+.15){if(old.y>=a.y-.09&&p.y<=a.y+.03&&vel.y<=0){p.y=a.y;if(vel.y<-3)burst(p,sectorData[level].accent,8,1);vel.y=0;grounded=true;if(a.check&&a.index>checkpoint){checkpoint=a.index;toast('Checkpoint saved.');tone(660,.25);}}else if(vel.y>0&&old.y+1.95<=a.y-(a.optional?.7:1.225)&&p.y+1.95>=a.y-(a.optional?.7:1.225)){p.y=a.y-(a.optional?.7:1.225)-1.95;vel.y=0;}else if(p.y<a.y-.08&&p.y+1.95>a.y-(a.optional?.7:1.225)&&old.y<a.y){p.x=old.x;p.z=old.z;vel.x*=.2;vel.z*=.2;}}}
 if(p.y<-14){respawn(true);return;}if(p.y>platforms[levels[level].points.length-1].y+13){vel.y=Math.min(vel.y,0);fuel=Math.max(0,fuel-5);}
 for(const c of collectibles){if(!c.taken&&p.clone().add(new T.Vector3(0,1,0)).distanceTo(c.g.position)<1.15){c.taken=true;c.g.visible=false;collected++;celebrate=1.5;burst(c.g.position,sectorData[level].accent,28,4);tone(600+collected*100,.22);if(collected===collectibles.length){toast('All cores are yours. To the portal!');$('objective').textContent='The portal is active. Reach the final platform.';}else toast(`Power core ${collected} / ${collectibles.length}`);}}
 if(!invulnerable){for(const d of drones)if(p.clone().add(new T.Vector3(0,.8,0)).distanceTo(d.g.position)<.95){respawn(true);return;}for(const l of lasers)if(l.on&&Math.abs(p.z-l.a.z)<.32&&Math.abs(p.x-l.a.x)<l.a.w/2&&p.y<l.a.y+.85&&p.y+1.8>l.a.y+.5){respawn(true);return;}}
 let end=platforms[levels[level].points.length-1];if(Math.hypot(p.x-end.x,p.z-(end.z-.6))<1.25&&Math.abs(p.y-end.y)<1.1){if(collected===collectibles.length)win();else if(toastTime<.1)toast('The portal needs all the cores.');}
 const moving=Math.hypot(vel.x,vel.z)>.3;if(moving){const angle=Math.atan2(-vel.x,-vel.z);avatar.rotation.y+=Math.atan2(Math.sin(angle-avatar.rotation.y),Math.cos(angle-avatar.rotation.y))*Math.min(1,dt*12);}legs.forEach((l,i)=>l.rotation.x=T.MathUtils.damp(l.rotation.x,grounded&&moving?Math.sin(time*12+i*Math.PI)*.5:thrust?-.25:vel.y<0?.25:0,14,dt));arms.forEach((a,i)=>a.rotation.x=T.MathUtils.damp(a.rotation.x,grounded&&moving?Math.sin(time*12+i*Math.PI)*-.4:thrust?.45:vel.y<0?-.35:0,14,dt));avatar.rotation.x=T.MathUtils.damp(avatar.rotation.x,dashTime>0?-.28:0,9,dt);avatar.position.copy(p);avatar.visible=!invulnerable||Math.sin(time*24)>-.3;flame.scale.y=.8+Math.random()*.45;updateHud();}
function updateHazards(time){ for(const d of drones){d.g.position.set(d.a.x+Math.sin(time*1.15+d.seed)*(d.a.w*.36),d.a.y+.95+Math.sin(time*2)*.10,d.a.z);d.g.rotation.y=time;}
 for(const l of lasers){l.on=Math.sin(time*1.65+l.seed)>.05;l.beam.visible=l.on;}
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.1);if(phase==='menu')worldTime+=dt;const time=worldTime;
 if(phase==='playing'){advanceSimulation(dt);camTarget.lerp(p,1-Math.exp(-dt*5));const d=cameraDistance;const desired=camTarget.clone().add(new T.Vector3(Math.sin(cameraYaw)*Math.cos(cameraPitch)*d,Math.sin(cameraPitch)*d,Math.cos(cameraYaw)*Math.cos(cameraPitch)*d));camera.fov=T.MathUtils.damp(camera.fov,dashTime>0?57:48,5,dt);camera.updateProjectionMatrix();camera.position.lerp(desired,1-Math.exp(-dt*5));camera.lookAt(camTarget.x,camTarget.y+1.0,camTarget.z-1.4);sun.position.copy(camTarget).add(new T.Vector3(15,32,10));sun.target.position.copy(camTarget);}
 else if(phase==='menu'){menuTime+=dt;avatar.visible=true;avatar.position.set(1,.04,0);avatar.rotation.y=-.45;avatar.position.y+=Math.sin(time*1.7)*.03;legs.forEach(l=>l.rotation.x=0);arms.forEach(a=>a.rotation.x=0);flame.visible=false;camera.position.set(10+Math.sin(menuTime*.15),6.5,12);camera.lookAt(-2,1,-4);}
 for(const c of [...collectibles,...relics]){c.g.rotation.y=time*.8;c.g.position.y=c.base+Math.sin(time*2+c.base)*.15;}
 if(beacon){beacon.material.opacity=(collected===collectibles.length?.55:.09)+Math.sin(time*2)*.025;portal.children[1].rotation.z=time*.3;}
 stars.rotation.y=time*.003;ring.rotation.z=time*.015;planet.rotation.y=time*.015;if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').classList.remove('show');}if(arrivalTime>0){arrivalTime-=dt;if(arrivalTime<=0)$('sectorintro').hidden=true;}if(flashTime>0){flashTime=Math.max(0,flashTime-dt);$('damageflash').style.opacity=flashTime;}if(phase!=='paused')tickParticles(dt);tickCrew(phase==='paused'?0:dt,worldTime);drawNavigation();renderer.render(scene,camera);
}
// Expedition systems: progression, flight assistance and procedural sector art.
const sectorData=[
 {sky:0x080f21,planet:0x386697,accent:0xc6fba9,gravity:18,label:'01 / ORBITAL DOCK',story:'Echo has been silent for 37 years. Today someone answered.',target:80},
 {sky:0x071d2b,planet:0x6bb6c8,accent:0x88d6f2,gravity:15,label:'02 / CRYOSPHERE',story:'Beneath the ice glow the traces of the first expedition.',target:100},
 {sky:0x25101c,planet:0xa24c33,accent:0xffba82,gravity:18,label:'03 / ASTEROID BELT',story:'The red dust hides more than wreckage.',target:105},
 {sky:0x100c28,planet:0x6754ac,accent:0xc8acff,gravity:18,label:'04 / THE SLEEPING REACTOR',story:'Someone left the reactor running. For you.',target:115},
 {sky:0x061f25,planet:0x317c88,accent:0xa1ffe0,gravity:16,label:'05 / THE LAST SIGNAL',story:'On the other side of the portal, home is waiting.',target:135}
];
let relics=[],relicTotal=0,shield=true,dashCooldown=0,dashTime=0,dashWanted=false,damageCount=0,coyote=0,jumpBuffer=0,arrivalTime=0,flashTime=0,quality='auto';
let cameraYaw=.62,cameraPitch=.55,cameraDistance=19,orbitPointer=null,orbitLast={x:0,y:0},fxCursor=0;
let records={};try{const raw=JSON.parse(localStorage.getItem('starfall-records')||'{}');for(let i=0;i<5;i++)if(raw?.[i])records[i]={stars:Math.max(0,Math.min(3,Math.floor(Number(raw[i].stars)||0))),relics:Math.max(0,Math.min(3,Math.floor(Number(raw[i].relics)||0)))};}catch{}
const fxGeometry=new T.IcosahedronGeometry(.06,0),fxMaterial=new T.MeshBasicMaterial({color:0xffffff});
const fxMesh=new T.InstancedMesh(fxGeometry,fxMaterial,180);fxMesh.frustumCulled=false;scene.add(fxMesh);
const fx=Array.from({length:180},()=>({life:0,max:1,p:new T.Vector3(),v:new T.Vector3()})),dummy=new T.Object3D();
for(let i=0;i<180;i++){dummy.scale.setScalar(0);dummy.updateMatrix();fxMesh.setMatrixAt(i,dummy.matrix);}
const shieldMesh=mesh(new T.SphereGeometry(1,20,12),new T.MeshBasicMaterial({color:0x77d9ff,wireframe:true,transparent:true,opacity:.09,depthWrite:false}),0,1,0,1.08,1.3,1.08,avatar);shieldMesh.castShadow=false;
function burst(position,color=0xa1ffe0,count=24,force=2){for(let i=0;i<count;i++){const j=fxCursor++%fx.length,a=fx[j];a.life=a.max=.4+Math.random()*.7;a.p.copy(position);a.v.set((Math.random()-.5)*force,Math.random()*force,(Math.random()-.5)*force);fxMesh.setColorAt(j,new T.Color(color));}if(fxMesh.instanceColor)fxMesh.instanceColor.needsUpdate=true;}
function tickParticles(dt){for(let i=0;i<fx.length;i++){const a=fx[i];a.life=Math.max(0,a.life-dt);if(a.life){a.v.y-=dt*1.7;a.p.addScaledVector(a.v,dt);dummy.position.copy(a.p);dummy.scale.setScalar(a.life/a.max*(dashTime>0?2:1));}else dummy.scale.setScalar(0);dummy.updateMatrix();fxMesh.setMatrixAt(i,dummy.matrix);}fxMesh.instanceMatrix.needsUpdate=true;}
function setQuality(){const low=quality==='eco'||quality==='auto'&&matchMedia('(pointer:coarse)').matches;renderer.setPixelRatio(Math.min(devicePixelRatio,low?1.15:1.8));renderer.shadowMap.enabled=!low;$('quality').textContent='Graphics: '+({auto:'Auto',eco:'Eco',high:'High'}[quality]);resize();}
function sectorArt(n){const config=sectorData[n];scene.background.set(config.sky);scene.fog.color.set(config.sky);scene.fog.density=.0055;planet.material.color.set(config.planet);halo.material.color.set(config.accent);fill.color.set(config.accent);document.documentElement.style.setProperty('--accent','#'+config.accent.toString(16).padStart(6,'0'));
 const glow=mat(config.accent,.4,.4,config.accent);glow.emissiveIntensity=.6;const rock=mat(n===2?0x50372f:0x243953,.3,.85),ice=mat(0x77bace,.35,.23,0x164953);
 // Architecture has a distinct silhouette in each sector.
 for(let i=0;i<platforms.length;i++){const a=platforms[i];
  if(n===0||n===4){for(const s of [-1,1]){box(white,a.x+s*(a.w/2-.15),a.y+2,a.z+1,.2,4,.25,env);box(glow,a.x+s*(a.w/2-.15),a.y+2,a.z+1,.24,.8,.29,env);}box(dark,a.x,a.y+4,a.z+1,a.w+.2,.2,.3,env);}
  if(n===1){for(let k=0;k<6;k++){const s=k%2?1:-1;const crystal=mesh(new T.ConeGeometry(.35,2+(k%3)*.65,5),ice,a.x+s*(a.w/2+.3),a.y+.5,a.z+(k%3-1)*1.5,1,1,1,env);crystal.rotation.z=s*.25;}}
  if(n===2){for(let k=0;k<3;k++){let r=mesh(new T.IcosahedronGeometry(1,1),rock,a.x+(k%2?1:-1)*(a.w+2+k),a.y-2+k,a.z-k*2,1.2+k,.8+k*.4,1+k*.3,env);r.rotation.set(i,k,i*.5);decor.push(r);}}
  if(n===3){for(const s of [-1,1]){let r=mesh(new T.TorusGeometry(3.5,.09,8,48),glow,a.x+s*8,a.y+2,a.z,1,1,1,env);r.rotation.y=Math.PI/2;decor.push(r);box(dark,a.x+s*8,a.y-1.4,a.z,2,.4,2,env);}}
 }
 // Optional relics sit on small, reachable side docks; no required core is hidden.
 relics=[];relicTotal=0;const mainCount=platforms.length;for(let k=0;k<3;k++){const index=Math.min(mainCount-2,1+k*2),a=platforms[index],side=k%2?-1:1,x=a.x+side*(a.w/2+2.4),z=a.z-1.4,y=a.y+.6;
  box(dark,x,y-.35,z,2.8,.7,2.8,env);box(glow,x,y-.04,z,2.6,.08,2.6,env);platforms.push({x,y,z,w:2.8,index:100+k,optional:true});
  const g=new T.Group();g.position.set(x,y+1.2,z);env.add(g);mesh(new T.OctahedronGeometry(.27),orange,0,0,0,1,1.8,1,g);const orbit=mesh(new T.TorusGeometry(.52,.018,6,32),orange,0,0,0,1,1,1,g);orbit.rotation.x=.8;relics.push({g,base:y+1.2,taken:false});
 }
 // A derelict survey craft anchors the first launch pad.
 const ship=new T.Group();ship.position.set(-9,3,4);ship.rotation.y=-.35;env.add(ship);ball(white,0,0,0,1.4,.65,3,ship);ball(glass,0,.4,-1,1,.4,1.2,ship);box(dark,0,-.1,.8,7,.18,1.5,ship);for(const s of [-1,1]){mesh(cylG,dark,s*2.5,0,1,.45,1.6,.45,ship).rotation.x=Math.PI/2;ball(blue,s*2.5,0,1.85,.31,.31,.1,ship);}
 // Far orbital structures and luminous planet bands.
 for(let k=0;k<3;k++){let arc=mesh(new T.TorusGeometry(17+k*4,.07,6,100),glow,16,-8,-38,1,1,1,env);arc.rotation.set(.45,.8+k*.13,.2);}
 shield=true;damageCount=0;dashCooldown=0;dashTime=0;dashWanted=false;coyote=.12;jumpBuffer=0;cameraYaw=.62;cameraPitch=.55;arrivalTime=0;flashTime=0;fx.forEach(a=>a.life=0);$('damageflash').style.opacity=0;buildCrew();
}
function useDash(){if(phase!=='playing'||dashCooldown>0)return;dashCooldown=3.2;dashTime=.22;let x=vel.x,z=vel.z;if(Math.hypot(x,z)<.2){x=-Math.sin(avatar.rotation.y);z=-Math.cos(avatar.rotation.y);}const l=Math.hypot(x,z);vel.x=x/l*19;vel.z=z/l*19;vel.y=Math.max(vel.y,2);grounded=false;burst(p.clone().add(new T.Vector3(0,.7,0)),0x8bddff,20,3);tone(180,.18,'triangle',.06);}
function expeditionTick(dt,time){dashCooldown=Math.max(0,dashCooldown-dt);dashTime=Math.max(0,dashTime-dt);if(dashWanted){useDash();dashWanted=false;}
 for(const r of relics){if(!r.taken&&p.distanceTo(r.g.position.clone().add(new T.Vector3(0,-1,0)))<1.1){r.taken=true;r.g.visible=false;relicTotal++;celebrate=1.5;shield=true;burst(r.g.position,0xffbc76,30,4);tone(1100,.3);toast('Relic '+relicTotal+'/3 · Shield restored.');}}
 if(flame.visible&&Math.random()<.7)burst(p.clone().add(new T.Vector3(0,.3,.1)),0x7edaff,2,.9);
 shieldMesh.visible=shield;shieldMesh.rotation.y=time*.4;shieldMesh.material.opacity=invulnerable?.22:.065;
 $('reliccount').textContent=relicTotal+' / 3';$('boostmeter').style.width=(1-dashCooldown/3.2)*100+'%';$('boost').disabled=dashCooldown>0;$('shieldstatus').textContent=shield?'READY':'SPENT';$('shieldstatus').style.color=shield?'#86dcff':'#728399';
 const end=levels[level].points.at(-1);$('routefill').style.width=Math.max(0,Math.min(100,p.z/end[2]*100))+'%';
}
const mapContext=$('minimap').getContext('2d');
function drawNavigation(){if(phase!=='playing'){$('target').hidden=true;return;}const c=mapContext,w=200,h=220;c.clearRect(0,0,w,h);const end=levels[level].points.at(-1),range=-end[2]+14;const map=(x,z)=>[100+x*4,200+z/range*185];c.strokeStyle='#526a8655';c.lineWidth=2;c.beginPath();levels[level].points.forEach(([x,y,z],i)=>{let q=map(x,z);i?c.lineTo(...q):c.moveTo(...q);});c.stroke();
 for(const a of platforms){let q=map(a.x,a.z);c.fillStyle=a.check?'#89cbb066':'#56708e88';c.fillRect(q[0]-a.w*1.5,q[1]-4,a.w*3,8);}
 for(const r of [...collectibles,...relics]){if(r.taken)continue;let q=map(r.g.position.x,r.g.position.z);c.fillStyle=relics.includes(r)?'#ffb879':'#c6fba9';c.save();c.translate(...q);c.rotate(Math.PI/4);c.fillRect(-3,-3,6,6);c.restore();}
 let q=map(end[0],end[2]);c.strokeStyle='#bddeff';c.beginPath();c.arc(...q,5,0,Math.PI*2);c.stroke();q=map(p.x,p.z);c.fillStyle='#ffffff';c.beginPath();c.arc(...q,4,0,Math.PI*2);c.fill();c.strokeStyle='#ffffff66';c.beginPath();c.arc(...q,8,0,Math.PI*2);c.stroke();
 const goal=collectibles.filter(r=>!r.taken).sort((a,b)=>p.distanceToSquared(a.g.position)-p.distanceToSquared(b.g.position))[0]?.g.position||new T.Vector3(end[0],end[1]+2,end[2]);const point=goal.clone().project(camera);const direction=goal.clone().sub(camera.position).dot(camera.getWorldDirection(new T.Vector3()));$('target').hidden=direction<0||point.z>1;
 if(!$('target').hidden){$('target').style.left=Math.max(22,Math.min(innerWidth-55,(point.x*.5+.5)*innerWidth))+'px';$('target').style.top=Math.max(80,Math.min(innerHeight-170,(-point.y*.5+.5)*innerHeight-40))+'px';$('target').querySelector('span').textContent=Math.round(p.distanceTo(goal))+' m';}
}
function orbitMove(e){if(e.pointerId!==orbitPointer)return;cameraYaw-=(e.clientX-orbitLast.x)*.005;cameraPitch=T.MathUtils.clamp(cameraPitch+(e.clientY-orbitLast.y)*.003,.25,.95);orbitLast={x:e.clientX,y:e.clientY};}
canvas.onpointerdown=e=>{if(phase!=='playing')return;orbitPointer=e.pointerId;orbitLast={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=orbitMove;canvas.onpointerup=canvas.onpointercancel=()=>orbitPointer=null;
canvas.addEventListener('wheel',e=>{if(phase==='playing'){e.preventDefault();cameraDistance=T.MathUtils.clamp(cameraDistance+e.deltaY*.01,12,25);}},{passive:false});
$('boost').onpointerdown=e=>{e.preventDefault();dashWanted=true;};$('quality').onclick=()=>{quality=quality==='auto'?'eco':quality==='eco'?'high':'auto';setQuality();};

function menu(){phase='menu';$('sectorintro').hidden=true;$('menu').hidden=false;$('dialog').hidden=true;controlsVisible(false);build(0);}
$('start').onclick=()=>start(unlocked);$('pause').onclick=pause;$('home').onclick=e=>{e.preventDefault();if(phase==='playing')pause();else menu();};$('dialogaction').onclick=()=>action();$('dialogback').onclick=menu;
$('missions').onclick=()=>{modal('EXPEDITION MAP','Five signals. One home.','Complete a mission to unlock the next one. Progress is saved on this device.','',()=>{});$('dialogaction').hidden=true;levels.forEach((l,i)=>{let b=document.createElement('button');b.disabled=i>unlocked;b.innerHTML=`<span class="missionnumber">0${i+1}</span><span class="missioncopy">${l.name}<small>${i>unlocked?'Complete the previous sector':best[i]?`Best ${Math.floor(best[i])} sec · Relics ${records[i]?.relics||0}/3`:'Signal awaiting restoration'}</small></span><span>${i>unlocked?'🔒':'★'.repeat(records[i]?.stars||0)||'→'}</span>`;b.onclick=()=>start(i);$('levelbuttons').append(b);});};
$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'Sound: off':'Sound: on';tone(650,.2);};
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'||e.code==='KeyP'){if(!e.repeat)pause();return;}if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&!e.repeat)dashWanted=true;if(e.code==='KeyR'&&!e.repeat)respawn(false);keys[e.code]=true;});window.addEventListener('keyup',e=>{keys[e.code]=false;});window.addEventListener('blur',()=>{Object.keys(keys).forEach(k=>keys[k]=false);jetPressed=false;if(phase==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase==='playing')pause();});
let stickPointer=null;const stick=$('stick'),knob=$('knob');function moveStick(e){const r=stick.getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,len=Math.hypot(x,y),max=r.width*.30;if(len>max){x=x/len*max;y=y/len*max;}joy.x=x/max;joy.y=y/max;knob.style.transform=`translate(${x}px,${y}px)`;}stick.onpointerdown=e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);};stick.onpointermove=e=>{if(e.pointerId===stickPointer)moveStick(e);};stick.onpointerup=stick.onpointercancel=()=>{stickPointer=null;joy.x=joy.y=0;knob.style.transform='';};$('jet').onpointerdown=e=>{e.preventDefault();$('jet').setPointerCapture(e.pointerId);jetPressed=true;};$('jet').onpointerup=$('jet').onpointercancel=()=>jetPressed=false;
// Crew update: persistent actors, simulation clock and pointer ownership.
let accumulator=0,jetPointer=null,celebrate=0;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const companion=new T.Group();scene.add(companion);
ball(white,0,0,0,.30,.26,.27,companion);ball(dark,0,0,-.20,.24,.16,.12,companion);ball(blue,0,0,-.30,.095,.095,.05,companion);
for(const side of [-1,1]){box(dark,side*.34,0,.02,.18,.15,.3,companion);ball(blue,side*.34,-.10,.02,.075,.08,.1,companion);}
box(white,0,.32,0,.025,.2,.025,companion);ball(green,0,.43,0,.04,.04,.04,companion);
let crew=[],satellites=[],cargo=null;
function buildCrew(){
 crew=[];satellites=[];celebrate=0;companion.position.set(-1.3,2,1.3);
 for(const [index,color] of [[0,orange],[levels[level].points.length-1,blue]]){
  const a=platforms[index],g=new T.Group();g.position.set(a.x-a.w*.32,a.y,a.z+a.w*.28);env.add(g);
  box(white,0,.94,0,.53,.7,.38,g);box(color,0,.95,-.21,.36,.28,.07,g);box(dark,0,.95,.28,.4,.55,.22,g);
  const head=new T.Group();head.position.y=1.54;g.add(head);ball(white,0,0,0,.35,.34,.33,head);ball(glass,0,.01,-.16,.3,.22,.19,head);
  const hand=new T.Group();hand.position.set(-.37,1.19,0);g.add(hand);box(white,0,-.23,0,.19,.46,.2,hand);ball(color,0,-.48,0,.11,.12,.12,hand);
  box(white,.37,.99,0,.2,.48,.22,g);for(const side of [-1,1]){box(white,side*.16,.35,0,.22,.5,.25,g);box(dark,side*.16,.07,-.07,.25,.13,.35,g);}
  crew.push({g,head,hand,base:a.y});
 }
 for(let i=0;i<2;i++){
  const g=new T.Group();g.position.set(i?17:-17,9+i*2,-13-i*24);env.add(g);box(white,0,0,0,.9,.8,1.4,g);const wings=new T.Group();g.add(wings);
  for(const side of [-1,1]){box(dark,side*2,0,0,3,.09,2.3,wings);for(let k=0;k<5;k++)box(blue,side*(.8+k*.55),.06,0,.42,.025,2,wings);}satellites.push({g,wings});
 }
 cargo=new T.Group();env.add(cargo);box(white,0,0,0,1.5,1,4,cargo);box(orange,0,.15,0,1.55,.14,3.7,cargo);for(const side of [-1,1]){box(dark,side*1.2,0,1,.7,.6,2,cargo);ball(blue,side*1.2,0,2.05,.22,.22,.07,cargo);}
}
function tickCrew(dt,time){
 if(!dt)return;
 const bob=reducedMotion?0:Math.sin(time*2.8)*.09;celebrate=Math.max(0,celebrate-dt);
 const angle=cameraYaw-.85,target=avatar.position.clone().add(new T.Vector3(Math.sin(angle)*1.75,2.05+bob,Math.cos(angle)*1.75));
 companion.position.lerp(target,1-Math.exp(-dt*3.5));companion.rotation.y=celebrate&&!reducedMotion?time*5:avatar.rotation.y;companion.rotation.z=reducedMotion?0:Math.sin(time*2)*.07;
 for(const npc of crew){const near=p.distanceTo(npc.g.position)<6&&phase==='playing';npc.g.position.y=npc.base+(reducedMotion?0:Math.sin(time*1.9)*.018);npc.head.rotation.y=T.MathUtils.damp(npc.head.rotation.y,near?Math.atan2(npc.g.position.x-p.x,npc.g.position.z-p.z):0,3,dt);npc.hand.rotation.z=T.MathUtils.damp(npc.hand.rotation.z,near?(-2.35+(reducedMotion?0:Math.sin(time*5)*.23)):0,6,dt);}
 const eco=quality==='eco'||quality==='auto'&&matchMedia('(pointer:coarse)').matches;
 for(const sat of satellites){sat.g.visible=!eco;if(!reducedMotion){sat.g.rotation.y=time*.07;sat.wings.rotation.x=Math.sin(time*.15)*.4;}}
 if(cargo){cargo.visible=!eco&&!reducedMotion;cargo.position.set(Math.sin(time*.08)*45,14,-30+Math.cos(time*.08)*8);cargo.rotation.y=-Math.PI/2;}
}
function advanceSimulation(dt){
 if(phase!=='playing'){accumulator=0;return;}
 accumulator+=Math.min(dt,.1);const step=1/120;
 while(accumulator+1e-9>=step&&phase==='playing'){worldTime+=step;physics(step,worldTime);accumulator-=step;}
 if(phase!=='playing')accumulator=0;
}
function resetInput(){
 jetPointer=null;stickPointer=null;orbitPointer=null;jetPressed=false;dashWanted=false;dashTime=0;jumpBuffer=0;accumulator=0;joy.x=joy.y=0;
 Object.keys(keys).forEach(k=>keys[k]=false);$('knob').style.transform='';
}
function releaseStick(e){if(e.pointerId!==stickPointer)return;stickPointer=null;joy.x=joy.y=0;knob.style.transform='';}
stick.onpointerdown=e=>{if(phase!=='playing'||stickPointer!==null)return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);};
stick.onpointerup=stick.onpointercancel=stick.onlostpointercapture=releaseStick;
$('jet').onpointerdown=e=>{if(phase!=='playing'||jetPointer!==null)return;e.preventDefault();jetPointer=e.pointerId;$('jet').setPointerCapture(e.pointerId);jetPressed=true;};
$('jet').onpointerup=$('jet').onpointercancel=$('jet').onlostpointercapture=e=>{if(e.pointerId!==jetPointer)return;jetPointer=null;jetPressed=false;};
canvas.onpointerdown=e=>{if(phase!=='playing'||orbitPointer!==null)return;orbitPointer=e.pointerId;orbitLast={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};
canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=e=>{if(e.pointerId===orbitPointer)orbitPointer=null;};
$('boost').onpointerdown=e=>{e.preventDefault();if(phase==='playing')dashWanted=true;};
window.addEventListener('blur',resetInput);window.addEventListener('pagehide',()=>{if(phase==='playing')pause();resetInput();});
window.addEventListener('orientationchange',()=>{if(phase==='playing')pause();resetInput();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetInput();});
$('settings').onclick=()=>{if(phase==='playing'){pause();return;}if(phase==='paused'&&action===resume){$('preferences').hidden=false;return;}modal('SETTINGS','Your flight.','Sound and graphics quality can also be changed while paused.','BACK TO START',menu);$('preferences').hidden=false;};
$('maptoggle').onclick=()=>{const hidden=!$('minimap').hidden;$('minimap').hidden=hidden;$('maptoggle').setAttribute('aria-expanded',String(!hidden));$('maptoggle').textContent=hidden?'MAP +':'MAP −';};

function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if(phase==='playing')controlsVisible(true);}window.addEventListener('resize',resize);resize();build(0);setQuality();$('start').firstChild.textContent=unlocked?'CONTINUE EXPEDITION ':'START EXPEDITION ';$('loading').hidden=true;animate();

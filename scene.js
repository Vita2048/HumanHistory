import {createIntelligence} from './finale.js';
import {createComputing,createSpace} from './modern-scenes.js';
import {createIndustry,createElectricity} from './energy.js';
import {createScience} from './science.js';
import {createPrinting} from './printing.js';
import {createWriting} from './writing.js';
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
const W=720,H=1280;
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('#world'),antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1);renderer.setSize(W,H,false);renderer.toneMapping=THREE.ACESFilmicToneMapping;
const camera=new THREE.PerspectiveCamera(48,W/H,.1,400),night=new THREE.Scene(),dawn=new THREE.Scene();
night.background=new THREE.Color('#211d37');night.fog=new THREE.FogExp2('#31253c',.022);dawn.background=new THREE.Color('#ad7689');dawn.fog=new THREE.FogExp2('#bda094',.006);
function sky(scene,low,high){const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{low:{value:new THREE.Color(low)},high:{value:new THREE.Color(high)}},vertexShader:'varying vec3 vP; void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 vP;uniform vec3 low;uniform vec3 high;void main(){float h=smoothstep(-.02,.48,normalize(vP).y);vec3 c=mix(low,high,h);float n=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);gl_FragColor=vec4(c+(n-.5)*.006,1.);}'});const s=new THREE.Mesh(new THREE.SphereGeometry(190,32,24),mat);s.renderOrder=-10;scene.add(s);}
sky(night,'#503549','#12142d');sky(dawn,'#ebb384','#514266');
const composer=new EffectComposer(renderer),pass=new RenderPass(night,camera);composer.addPass(pass);const bloom=new UnrealBloomPass(new THREE.Vector2(W,H),.7,.7,.7);composer.addPass(bloom);composer.addPass(new OutputPass());
let seed=721;function rnd(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;}
const clamp=x=>Math.max(0,Math.min(1,x));const smooth=(a,b,t)=>{const k=clamp((t-a)/(b-a));return k*k*(3-2*k);};const mix=(a,b,t)=>a+(b-a)*t;
function material(c){return new THREE.MeshStandardMaterial({color:c,roughness:1,flatShading:true});}
function mesh(geo,mat,x,y,z,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
const groundMat=material('#272334'),rockMat=material('#4b3947'),woodMat=material('#39262b'),personMat=material('#292032');
night.add(new THREE.HemisphereLight('#9891cd','#241520',1.2));const moon=new THREE.DirectionalLight('#b3bcf2',1.4);moon.position.set(-8,12,-10);night.add(moon);
const fireLight=new THREE.PointLight('#ff9937',90,28,1.8);fireLight.position.set(0,2.1,0);night.add(fireLight);
mesh(new THREE.PlaneGeometry(400,400),groundMat,0,-.15,0,night).rotation.x=-Math.PI/2;
function mountains(scene,palette){for(let layer=0;layer<3;layer++){const geo=new THREE.PlaneGeometry(240,65,64,20);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),envelope=Math.sin((z+32.5)/65*Math.PI);const h=(10+7*Math.sin(x*.067+layer*2)+4*Math.sin(x*.19+layer)+2*Math.cos(x*.37))*envelope+(rnd()-.5)*1.4*envelope;p.setY(i,Math.max(-.5,h));}geo.computeVertexNormals();mesh(geo,material(palette[layer]),0,0,-108-layer*35,scene);}}
mountains(night,['#3b314d','#4a3b58','#34334f']);mountains(dawn,['#8b7485','#a48a94','#92717d']);
for(let i=0;i<75;i++){const a=rnd()*Math.PI*2,r=3+rnd()*28;const m=mesh(new THREE.IcosahedronGeometry(.15+rnd()*.7,0),rockMat,Math.cos(a)*r,.05,Math.sin(a)*r,night);m.scale.y=.4+rnd()*.5;}
for(let i=0;i<14;i++){const a=i/14*Math.PI*2;mesh(new THREE.DodecahedronGeometry(.3+rnd()*.12,0),rockMat,Math.cos(a)*1.45,.1,Math.sin(a)*1.45,night);}
for(let i=0;i<6;i++){const a=i*Math.PI/3;const log=mesh(new THREE.CylinderGeometry(.16,.23,2.2,7),woodMat,Math.cos(a)*.22,.22,Math.sin(a)*.22,night);log.rotation.set(Math.PI/2,a,0);}
function person(x,z,scale,rotation){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);g.rotation.y=rotation;night.add(g);mesh(new THREE.SphereGeometry(.21,10,8),personMat,0,1.48,0,g);mesh(new THREE.ConeGeometry(.32,1.04,7),personMat,0,.83,0,g);for(const s of [-1,1]){const leg=mesh(new THREE.CylinderGeometry(.07,.095,.63,5),personMat,s*.14,.32,0,g);leg.rotation.z=s*.08;const arm=mesh(new THREE.CylinderGeometry(.065,.09,.63,5),personMat,s*.29,1,.1,g);arm.rotation.z=s*.22;arm.rotation.x=-.3;}}
person(-2.5,-1.6,1.2,.7);person(2.65,-1.2,1.05,-.8);person(-3.5,.15,.82,.7);person(1.7,-3.2,.9,-.3);
function tent(x,z,scale){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);night.add(g);const t=mesh(new THREE.ConeGeometry(2.1,2.7,5,1,true),material('#554151'),0,1.2,0,g);t.rotation.y=.3;mesh(new THREE.ConeGeometry(.48,1.25,3),personMat,0,.6,1.6,g);}tent(-6,-6,1.2);tent(6,-9,1.3);
const spriteCanvas=document.createElement('canvas');spriteCanvas.width=64;spriteCanvas.height=64;const cx=spriteCanvas.getContext('2d');const grad=cx.createRadialGradient(32,32,0,32,32,32);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.15,'rgba(255,255,255,.95)');grad.addColorStop(.4,'rgba(255,255,255,.3)');grad.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=grad;cx.fillRect(0,0,64,64);const spriteMap=new THREE.CanvasTexture(spriteCanvas);
function glow(color,size,parent){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:spriteMap,color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(size,size,1);parent.add(s);return s;}
const flames=[];for(let i=0;i<32;i++){const s=glow(i%3===0?'#ffd278':'#ff5715',1,night);flames.push({s,a:rnd()*6.28,p:rnd(),speed:.4+rnd()*.7,r:rnd()*.6});}
const embers=[];for(let i=0;i<160;i++){const s=glow('#ffb14d',.065+rnd()*.07,night);embers.push({s,p:rnd(),a:rnd()*6.28,r:rnd()*2.5,speed:.15+rnd()*.25});}
const core=glow('#ffad30',5,night);core.position.set(0,.8,0);const hero=glow('#ffe2a6',.3,night);
const starPositions=[];for(let i=0;i<1100;i++)starPositions.push((rnd()-.5)*220,12+rnd()*90,-25-rnd()*130);
const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:'#ddd6f8',size:.19,map:spriteMap,transparent:true,depthWrite:false,fog:false}));night.add(stars);
dawn.add(new THREE.HemisphereLight('#ffd3ac','#62583e',2.5));const sunLight=new THREE.DirectionalLight('#ffe1a4',3.5);sunLight.position.set(15,18,-60);dawn.add(sunLight);
mesh(new THREE.PlaneGeometry(400,400),material('#7b7245'),0,-.19,-40,dawn).rotation.x=-Math.PI/2;
const sun=mesh(new THREE.SphereGeometry(4,32,20),new THREE.MeshBasicMaterial({color:new THREE.Color(2.5,1.5,.6),fog:false}),6,14,-115,dawn);const sunHalo=glow('#ffc17a',50,dawn);sunHalo.position.copy(sun.position);sunHalo.material.opacity=.25;sunHalo.material.fog=false;
const riverVerts=[];for(let i=0;i<90;i++){const z=25-i*1.9,x=15+Math.sin(z*.033)*9;riverVerts.push(x-3,-.1,z,x+3,-.1,z);}const riverG=new THREE.BufferGeometry();riverG.setAttribute('position',new THREE.Float32BufferAttribute(riverVerts,3));const ix=[];for(let i=0;i<89;i++){const n=i*2;ix.push(n,n+1,n+2,n+1,n+3,n+2);}riverG.setIndex(ix);riverG.computeVertexNormals();mesh(riverG,new THREE.MeshStandardMaterial({color:'#cca995',metalness:.35,roughness:.6,side:THREE.DoubleSide}),0,0,0,dawn);
const ripples=[];for(let i=0;i<90;i++){const z=20-rnd()*135,x=15+Math.sin(z*.033)*9;const p=mesh(new THREE.PlaneGeometry(.3+rnd()*2,.05+rnd()*.1),new THREE.MeshBasicMaterial({color:'#ffe0a5',transparent:true,opacity:.22}),x+(rnd()-.5)*5,-.075,z,dawn);p.rotation.x=-Math.PI/2;ripples.push(p);}
const soil=material('#675032');for(let i=0;i<25;i++)mesh(new THREE.BoxGeometry(.16,.04,75),soil,-23+i*1.35,-.08,-17,dawn);
const N=10000,stalkGeo=new THREE.CylinderGeometry(.013,.025,1,3);stalkGeo.translate(0,.5,0);const wheatMaterial=material('#c89b42');wheatMaterial.onBeforeCompile=shader=>{shader.uniforms.windTime={value:0};wheatMaterial.userData.shader=shader;shader.vertexShader='uniform float windTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(windTime*1.4 + instanceMatrix[3].x*.45 + instanceMatrix[3].z*.22)*.13*position.y;');};
const stalks=new THREE.InstancedMesh(stalkGeo,wheatMaterial,N),ears=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.095,0),wheatMaterial,N);dawn.add(stalks,ears);const dummy=new THREE.Object3D();
for(let i=0;i<N;i++){const row=i%25,x=-23+row*1.35+(rnd()-.5)*.65,z=20-rnd()*78,h=.65+rnd()*.65;dummy.position.set(x,0,z);dummy.rotation.set(0,rnd()*6.28,(rnd()-.5)*.1);dummy.scale.set(1,h,1);dummy.updateMatrix();stalks.setMatrixAt(i,dummy.matrix);dummy.position.y=h;dummy.scale.set(.8,2.8,1);dummy.updateMatrix();ears.setMatrixAt(i,dummy.matrix);}
const wallMat=material('#bfa183'),roofMat=material('#766045'),dark=material('#403638');for(let i=0;i<19;i++){const x=-10+(i%5)*4.4+(rnd()-.5)*2,z=-37-Math.floor(i/5)*6-rnd()*2,g=new THREE.Group();g.position.set(x,0,z);dawn.add(g);const width=1.5+rnd()*.8;mesh(new THREE.CylinderGeometry(width*.88,width,1.9,7),wallMat,0,.95,0,g);mesh(new THREE.ConeGeometry(width*1.25,1.9,7),roofMat,0,2.5,0,g).rotation.y=.4;mesh(new THREE.BoxGeometry(.55,1.1,.1),dark,0,.55,width*.94,g);}
for(let i=0;i<17;i++){const x=25+rnd()*15,z=-20-rnd()*75;mesh(new THREE.CylinderGeometry(.13,.24,2.6,5),woodMat,x,1.3,z,dawn);mesh(new THREE.IcosahedronGeometry(1.8,0),material('#676e4c'),x,3,z,dawn).scale.y=1.35;}
const birds=[],birdGeo=new THREE.BufferGeometry();birdGeo.setAttribute('position',new THREE.Float32BufferAttribute([-.3,0,0,0,-.07,0,.3,0,0],3));for(let i=0;i<12;i++){const b=new THREE.Line(birdGeo,new THREE.LineBasicMaterial({color:'#5c4e61'}));dawn.add(b);birds.push(b);}
const writing=createWriting(),printing=createPrinting(),science=createScience(),industry=createIndustry(),electricity=createElectricity(),computing=createComputing(),space=createSpace(),intelligence=createIntelligence();
function renderAt(t){t=Math.max(0,Math.min(118,t));if(t>=92){pass.scene=intelligence.scene;bloom.strength=.55;renderer.toneMappingExposure=1.15;intelligence.update(camera,t-92);composer.render();return;}if(t>=82){pass.scene=space.scene;bloom.strength=.4;renderer.toneMappingExposure=1.1;space.update(camera,t-82);composer.render();return;}if(t>=72){pass.scene=computing.scene;bloom.strength=.5;renderer.toneMappingExposure=1.15;computing.update(camera,t-72);composer.render();return;}if(t>=62){pass.scene=electricity.scene;bloom.strength=.6;renderer.toneMappingExposure=1.2;electricity.update(camera,t-62);composer.render();return;}if(t>=50){pass.scene=industry.scene;bloom.strength=.35;renderer.toneMappingExposure=1.15;industry.update(camera,t-50);composer.render();return;}if(t>=40){pass.scene=science.scene;bloom.strength=.42;renderer.toneMappingExposure=1.15;science.update(camera,t-40);composer.render();return;}if(t>=30){pass.scene=printing.scene;bloom.strength=.3;renderer.toneMappingExposure=1.1;printing.update(camera,t-30);composer.render();return;}if(t>=20){pass.scene=writing.scene;bloom.strength=.35;renderer.toneMappingExposure=1.2;writing.update(camera,t-20);composer.render();return;}if(t<10){pass.scene=night;const p=smooth(0,8.1,t),lift=smooth(7.5,10,t);camera.position.set(mix(1.8,.5,p),mix(3.4,2.6,p)+lift*6,mix(16,8.8,p)-lift*3.8);camera.lookAt(-.2,1.8+lift*7,0);bloom.strength=.8;renderer.toneMappingExposure=1.4;
const ignite=smooth(.05,1.2,t);fireLight.intensity=ignite*(32+5*Math.sin(t*15)+3*Math.sin(t*23));core.material.opacity=ignite*.12;bloom.strength=.4;
for(const f of flames){const q=(f.p+t*f.speed)%1;f.s.position.set(Math.cos(f.a+q*2)*f.r*(1-q)+Math.sin(t*4+f.a)*.12,.3+q*2.5,Math.sin(f.a)*f.r*(1-q));f.s.scale.set((1-q)*.65+.09,(1-q)*1.8+.2,1);f.s.material.opacity=ignite*Math.sin(q*Math.PI)*.43;}
for(const e of embers){const q=(e.p+t*e.speed)%1;e.s.position.set(Math.sin(e.a+q*2)*e.r*q,.7+q*7,Math.cos(e.a)*e.r*q);e.s.material.opacity=ignite*(1-q)*.85;}
hero.position.set(.3+Math.sin(t)*.12,2.4+lift*7.5,.1);hero.scale.setScalar(.12+lift*.9);hero.material.opacity=smooth(6,8,t);stars.rotation.z=t*.0008;
}else{const u=t-10,p=u/10;pass.scene=dawn;bloom.strength=.3;renderer.toneMappingExposure=1.15;camera.position.set(mix(-3,1.5,p),mix(2.2,9,smooth(0,10,u)),mix(20,-9,p));camera.lookAt(-1,mix(3,1.4,p),mix(-35,-46,p));if(wheatMaterial.userData.shader)wheatMaterial.userData.shader.uniforms.windTime.value=t;for(let i=0;i<ripples.length;i++)ripples[i].material.opacity=.16+.1*Math.sin(t*1.8+i);for(let i=0;i<birds.length;i++){birds[i].position.set(-15+i*2+u*.9,10+Math.sin(i)*2,-55-i*2);birds[i].scale.y=.5+Math.abs(Math.sin(u*3+i))*.7;}sun.position.y=25+u*.15;sunHalo.position.copy(sun.position);}
composer.render();}
window.addEventListener('hf-seek',e=>renderAt(e.detail.time));window.renderAt=renderAt;renderAt(window.__hfThreeTime||0);






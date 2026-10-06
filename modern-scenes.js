import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.48});
function put(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
function base(){const s=new THREE.Scene();s.background=new THREE.Color('#0b1324');s.add(new THREE.HemisphereLight('#aec7ee','#171321',1.1));const l=new THREE.DirectionalLight('#fff0dc',2.5);l.position.set(-8,12,14);s.add(l);return s;}
function stars(s){const a=[];for(let i=0;i<1400;i++)a.push(Math.sin(i*2.399)*130,Math.cos(i*1.113)*90,-30-i*.077);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a,3));s.add(new THREE.Points(g,new THREE.PointsMaterial({color:'#b3b9db',size:.045})));}
export function createComputing(){
 const scene=base();stars(scene);const computer=new THREE.Group();computer.position.set(0,4,0);scene.add(computer);
 const cream=mat('#bcb5a2'),dark=mat('#282e32'),keys=mat('#b3afa4');
 put(new RoundedBoxGeometry(5.6,4.3,3.8,5,.22),cream,0,1.1,-.5,computer);
 put(new RoundedBoxGeometry(4.75,3.4,.18,5,.16),dark,0,1.3,1.49,computer);
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const ctx=canvas.getContext('2d');ctx.fillStyle='#081d1c';ctx.fillRect(0,0,1024,768);ctx.fillStyle='#90d4a4';ctx.font='36px monospace';const lines=['PERSONAL COMPUTER','READY.','','> CONNECT','ESTABLISHING LINK...','','KNOWLEDGE HAS NO BORDERS','> _'];lines.forEach((l,i)=>ctx.fillText(l,65,90+i*72));const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
 put(new THREE.PlaneGeometry(4.25,2.92),new THREE.MeshBasicMaterial({map:tex}),0,1.3,1.6,computer);
 put(new RoundedBoxGeometry(5.7,.72,4,3,.12),cream,0,-1.45,-.15,computer);
 put(new THREE.BoxGeometry(2,.13,.04),dark,.6,-1.38,1.87,computer);put(new THREE.BoxGeometry(.2,.12,.05),dark,1.9,-1.38,1.88,computer);
 const led=put(new THREE.SphereGeometry(.045,12,8),new THREE.MeshBasicMaterial({color:'#a6ec86'}),-2.25,-1.43,1.9,computer);
 for(let i=0;i<14;i++)put(new THREE.BoxGeometry(.035,.9,.02),dark,-2.5+i*.07,1.25,1.43,computer);
 const keyboard=new THREE.Group();keyboard.position.set(0,-2,3.6);keyboard.rotation.x=.1;computer.add(keyboard);put(new RoundedBoxGeometry(5.7,.3,2,3,.1),cream,0,0,0,keyboard);
 for(let r=0;r<4;r++)for(let k=0;k<14;k++)put(new RoundedBoxGeometry(.31,.14,.31,2,.025),keys,-2.45+k*.375,.2,-.65+r*.36,keyboard);
 put(new RoundedBoxGeometry(2.2,.14,.24,2,.025),keys,0,.2,.82,keyboard);
 put(new RoundedBoxGeometry(.65,.35,1.05,3,.13),cream,3.65,-1.9,3.65,computer);
 const table=put(new THREE.BoxGeometry(15,.24,10),mat('#353242'),0,1.6,1,scene);
 const network=new THREE.Group();network.position.set(0,7,-9);scene.add(network);const ps=[];
 for(let i=0;i<70;i++){const y=1-2*(i+.5)/70,r=Math.sqrt(1-y*y),a=i*2.399,v=new THREE.Vector3(Math.cos(a)*r*4,y*4,Math.sin(a)*r*4);ps.push(v);put(new THREE.SphereGeometry(.055,10,8),new THREE.MeshBasicMaterial({color:'#e9bf7f'}),v.x,v.y,v.z,network);if(i>2){const g=new THREE.BufferGeometry().setFromPoints([ps[i-3],v]);network.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:'#ac9785',transparent:true,opacity:.3})));}}
 function update(camera,t){const p=sm((t-3)/7);camera.position.set(7-p*5,7+p*3,15+p*7);camera.lookAt(0,3.2+p*1.8,0-p*4);network.visible=t>3;network.scale.setScalar(Math.max(.001,sm((t-3)/2)));network.rotation.y=t*.12;}
 return {scene,update};
}
export function createSpace(){
 const scene=base();stars(scene);const loader=new THREE.TextureLoader();const color=loader.load('assets/earth-color.jpg');color.colorSpace=THREE.SRGBColorSpace;color.anisotropy=8;const normal=loader.load('assets/earth-normal.jpg');
 const earth=new THREE.Group();earth.position.set(0,7.2,-13);scene.add(earth);
 put(new THREE.SphereGeometry(5.5,128,96),new THREE.MeshStandardMaterial({map:color,normalMap:normal,normalScale:new THREE.Vector2(.55,.55),roughness:.75,emissiveMap:color,emissive:new THREE.Color(0xffffff),emissiveIntensity:.16}),0,0,0,earth);
 const clouds=put(new THREE.SphereGeometry(5.55,96,64),new THREE.MeshStandardMaterial({map:loader.load('assets/earth-clouds.png'),transparent:true,opacity:.6,depthWrite:false,roughness:1}),0,0,0,earth);
 const atmo=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),3.5);gl_FragColor=vec4(.25,.55,1.,a*.5);}'});put(new THREE.SphereGeometry(5.63,96,64),atmo,0,0,0,earth);
 const rocket=new THREE.Group();scene.add(rocket);const white=mat('#e5e0d5',.15),dark=mat('#20252c',.55),steel=mat('#8d969e',.8);
 // Multi-stage launch vehicle: tapered interstages, service module, escape tower and five engines.
 put(new THREE.CylinderGeometry(.5,.5,4.3,64),white,0,0,0,rocket);
 put(new THREE.CylinderGeometry(.34,.5,.65,64),white,0,2.47,0,rocket);
 put(new THREE.CylinderGeometry(.34,.34,2,64),white,0,3.78,0,rocket);
 put(new THREE.CylinderGeometry(.23,.34,.45,64),steel,0,5,0,rocket);
 put(new THREE.CylinderGeometry(.23,.23,.6,48),steel,0,5.5,0,rocket);
 put(new THREE.ConeGeometry(.23,.7,48),white,0,6.15,0,rocket);
 put(new THREE.CylinderGeometry(.035,.045,.8,12),white,0,6.85,0,rocket);
 for(const y of [-1.9,1.9,2.7,4.7])put(new THREE.CylinderGeometry(y<2?.507:.347,y<2?.507:.347,.11,64),steel,0,y,0,rocket);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const panel=put(new THREE.BoxGeometry(.18,.9,.018),dark,Math.sin(a)*.501,1.25,Math.cos(a)*.501,rocket);panel.rotation.y=a;}
 for(let i=0;i<48;i++){const a=i*Math.PI/24;put(new THREE.CylinderGeometry(.006,.006,.6,5),steel,Math.sin(a)*.505,-1.65,Math.cos(a)*.505,rocket);}
 const finShape=new THREE.Shape();finShape.moveTo(0,0);finShape.lineTo(.8,-1.1);finShape.lineTo(0,-.9);finShape.closePath();const finGeo=new THREE.ExtrudeGeometry(finShape,{depth:.045,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:1});for(let i=0;i<4;i++){const a=i*Math.PI/2;const f=put(finGeo,white,Math.cos(a)*.48,-1.1,Math.sin(a)*.48,rocket);f.rotation.y=-a;}
 const flames=[];
 for(let i=0;i<5;i++){const a=i*Math.PI/2,r=i===4?0:.31,x=Math.sin(a)*r,z=Math.cos(a)*r;put(new THREE.CylinderGeometry(.095,.16,.35,24,1,true),dark,x,-2.32,z,rocket);const flame=put(new THREE.ConeGeometry(.12,2,24),new THREE.MeshBasicMaterial({color:new THREE.Color(2.6,1.5,.65),transparent:true,opacity:.8}),x,-3.45,z,rocket);flame.rotation.z=Math.PI;flames.push(flame);}
 function update(camera,t){const p=sm((t-3)/5);earth.rotation.y=3.85+t*.035;earth.rotation.z=.12;clouds.rotation.y=t*.008;rocket.position.set(-2+t*.11,1+t*1.7,0-t*.2);rocket.rotation.z=-.16;rocket.visible=t<6.8;rocket.scale.setScalar(.75);for(const f of flames)f.scale.y=1+Math.sin(t*29)*.07;camera.position.set(1+p*1.6,7.3,19-p*4);camera.lookAt(0,5.6,-10);}
 return {scene,update};
}

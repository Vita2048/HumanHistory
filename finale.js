import * as THREE from 'three';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.55});
function put(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
function base(){const s=new THREE.Scene();s.background=new THREE.Color('#101329');s.fog=new THREE.FogExp2('#252239',.012);s.add(new THREE.HemisphereLight('#a5afd9','#251a2a',1.4));const l=new THREE.DirectionalLight('#ffe0a8',3);l.position.set(-8,12,10);s.add(l);return s;}
function line(points,color,parent,opacity=1){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(l);return l;}
function stars(scene){const p=[];for(let i=0;i<1500;i++)p.push(Math.sin(i*2.399)*130,Math.cos(i*1.113)*90,-25-i*.077);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:'#b3b9db',size:.075,fog:false})));}
export function createComputing(){
 const scene=base();const board=mat('#243742',.3),metal=mat('#ab986d',.65),chip=mat('#222333',.6);put(new THREE.BoxGeometry(70,.4,110),board,0,-.2,-35,scene);
 const gold=new THREE.MeshBasicMaterial({color:'#dfb36d'}),blue=new THREE.MeshBasicMaterial({color:'#91cbd3'});
 const pulses=[];
 for(let i=0;i<48;i++){const x=(i%12-5.5)*4,z=-Math.floor(i/12)*20+3,h=1+(i*7%8);put(new THREE.BoxGeometry(2.3,h,3.5),chip,x,h/2,z,scene);for(const side of [-1,1])for(let j=0;j<7;j++)put(new THREE.BoxGeometry(.6,.12,.17),metal,x+side*1.3,.2,z-1.3+j*.4,scene);const path=[new THREE.Vector3(x,.08,z),new THREE.Vector3(x+1.8,.08,z-4),new THREE.Vector3(x+1.8,.08,z-15),new THREE.Vector3(x+4,.08,z-15)];line(path,'#997a52',scene);const p=put(new THREE.SphereGeometry(.075,8,6),i%2?gold:blue,x,.15,z,scene);pulses.push({p,x,z});}
 const globe=new THREE.Group();globe.position.set(0,9,-48);scene.add(globe);
 put(new THREE.SphereGeometry(6,28,20),new THREE.MeshBasicMaterial({color:'#5c7a9b',wireframe:true,transparent:true,opacity:.15}),0,0,0,globe);
 const nodes=[];for(let i=0;i<70;i++){const y=1-2*(i+.5)/70,r=Math.sqrt(1-y*y),a=i*2.399,v=new THREE.Vector3(Math.cos(a)*r*6,y*6,Math.sin(a)*r*6);put(new THREE.SphereGeometry(.075,8,6),gold,v.x,v.y,v.z,globe);nodes.push(v);if(i>1)line([nodes[i-2],v],'#d6b579',globe,.42);}
 function update(camera,t){const p=t/10;camera.position.set(Math.sin(p*2)*2,3+sm(p)*9,18-p*48);camera.lookAt(0,3+sm(p)*6,-35-p*18);globe.rotation.y=t*.11;for(let i=0;i<pulses.length;i++){const o=pulses[i],u=(t*.4+i*.113)%1;o.p.position.set(o.x+1.8,.13,o.z-u*15);} }
 return {scene,update};
}
export function createSpace(){
 const scene=base();scene.fog=null;stars(scene);
 // A deliberately stylized globe, with hand-authored geographic silhouettes.
 const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#264c6e';ctx.fillRect(0,0,1024,512);
 const lands=[[[.09,.22],[.16,.12],[.29,.18],[.31,.27],[.23,.35],[.21,.45],[.16,.39]],[[.25,.44],[.33,.49],[.35,.6],[.3,.79],[.26,.87],[.25,.66],[.22,.51]],[[.46,.26],[.52,.23],[.58,.35],[.59,.49],[.54,.67],[.49,.58],[.44,.39]],[[.5,.18],[.61,.12],[.79,.15],[.9,.27],[.78,.37],[.73,.48],[.68,.36],[.61,.42],[.56,.31]],[[.78,.62],[.88,.6],[.92,.7],[.85,.75],[.78,.7]],[[.35,.08],[.41,.07],[.42,.2],[.37,.23]]];
 for(const poly of lands){ctx.beginPath();poly.forEach(([x,y],i)=>i?ctx.lineTo(x*1024,y*512):ctx.moveTo(x*1024,y*512));ctx.closePath();ctx.fillStyle='#7e927e';ctx.fill();}
 ctx.fillStyle='#d8ded9';ctx.fillRect(0,472,1024,40);for(let i=0;i<22;i++){ctx.strokeStyle='rgba(230,236,229,.15)';ctx.lineWidth=7+(i%4)*3;ctx.beginPath();ctx.ellipse((i*137)%1024,(i*71)%400+30,70+i%5*15,9,Math.sin(i)*.4,0,Math.PI*1.7);ctx.stroke();}
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
 const earth=new THREE.Group();earth.position.set(0,1,-16);scene.add(earth);put(new THREE.SphereGeometry(6,64,40),new THREE.MeshStandardMaterial({map:texture,roughness:.8}),0,0,0,earth);
 const atmo=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;void main(){float a=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(.25,.55,1.,a*.65);}'});put(new THREE.SphereGeometry(6.16,48,32),atmo,0,0,0,earth);
 const rocket=new THREE.Group();scene.add(rocket);const white=mat('#e1d7cc'),dark=mat('#303447',.5);put(new THREE.CylinderGeometry(.44,.5,4,24),white,0,0,0,rocket);put(new THREE.ConeGeometry(.44,1.2,24),white,0,2.6,0,rocket);put(new THREE.CylinderGeometry(.49,.49,.6,24),dark,0,.8,0,rocket);
 for(let i=0;i<3;i++){const a=i*2.094;const fin=put(new THREE.BoxGeometry(.12,1.4,.9),dark,Math.sin(a)*.5,-1.6,Math.cos(a)*.5,rocket);fin.rotation.y=a;}
 const flame=put(new THREE.ConeGeometry(.5,3.2,16),new THREE.MeshBasicMaterial({color:new THREE.Color(3,1.6,.45)}),0,-3.5,0,rocket);flame.rotation.z=Math.PI;
 const moon=put(new THREE.SphereGeometry(.65,24,16),mat('#afa8b1'),10,8,-30,scene);
 function update(camera,t){const p=sm((t-3)/7);earth.rotation.y=.6+t*.035;rocket.position.set(-1+t*.15,-2+t*2.1,2-t*.6);rocket.rotation.z=-.08-t*.015;rocket.visible=t<6.5;flame.scale.y=.8+.12*Math.sin(t*27);camera.position.set(2+p*7,4+p*5,15+p*6);camera.lookAt(0,4-p*3,-8-p*8);}
 return {scene,update};
}
export function createIntelligence(){
 const scene=base();stars(scene);const gold=new THREE.MeshStandardMaterial({color:'#efc88a',emissive:'#d78b39',emissiveIntensity:.8});
 const network=new THREE.Group();network.position.set(0,6,0);scene.add(network);const N=120,positions=[],nodes=[];
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.399;const v=new THREE.Vector3(Math.cos(a)*r*4.4,y*4.4,Math.sin(a)*r*4.4);positions.push(v);nodes.push(put(new THREE.SphereGeometry(.07+(i%7===0?.05:0),10,8),gold,v.x,v.y,v.z,network));}
 const edgeGeo=new THREE.BufferGeometry();edgeGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(N*6),3));network.add(new THREE.LineSegments(edgeGeo,new THREE.LineBasicMaterial({color:'#b69ec2',transparent:true,opacity:.32})));
 const molecule=[];for(let i=0;i<N;i++){const a=(i%12)/12*Math.PI*2,ring=Math.floor(i/12);molecule.push(new THREE.Vector3(Math.cos(a)*(1.2+ring%3*.6),Math.sin(a)*(1.2+ring%3*.6),-2.5+ring*.55));}
 const bridge=[];for(let i=0;i<N;i++){const k=i%30,x=-5+k/29*10,layer=Math.floor(i/30);bridge.push(new THREE.Vector3(x,layer<2?-.8:1.5-Math.sin(k/29*Math.PI)*1.8,(layer%2-.5)*2));}
 // Warm geometric hand: the opening spark returns to human agency.
 const hand=new THREE.Group();hand.position.set(0,4.3,0);hand.rotation.x=.2;scene.add(hand);const skin=mat('#a97964');const palm=put(new THREE.SphereGeometry(1,24,16),skin,0,0,0,hand);palm.scale.set(1.55,.38,1.3);
 for(let f=0;f<4;f++){const x=-1.03+f*.68,len=1.25+(f===1||f===2?.25:0);const finger=put(new THREE.CapsuleGeometry(.23,len,6,12),skin,x,.13,-1.25,hand);finger.rotation.x=Math.PI/2-.17;}
 const thumb=put(new THREE.CapsuleGeometry(.29,1.15,6,12),skin,1.6,.1,-.25,hand);thumb.rotation.z=-.9;thumb.rotation.x=-.7;
 const wrist=put(new THREE.CylinderGeometry(.7,.78,1.2,20),skin,0,-.23,1.15,hand);wrist.rotation.x=Math.PI/2;
 const spark=put(new THREE.IcosahedronGeometry(.16,2),new THREE.MeshBasicMaterial({color:new THREE.Color(4,2.3,.8)}),0,6.2,0,scene);const sparkLight=new THREE.PointLight('#ffd79a',12,18,1.5);sparkLight.position.copy(spark.position);scene.add(sparkLight);
 const halos=[];for(let i=0;i<3;i++){const r=put(new THREE.TorusGeometry(.5+i*.24,.008,5,80),new THREE.MeshBasicMaterial({color:'#e9b16c',transparent:true,opacity:.4}),0,6.2,0,scene);r.rotation.x=i*.7;halos.push(r);}
 function update(camera,t){const m=sm((t-3)/1.2),b=sm((t-7)/1.3),end=sm((t-11)/2);network.rotation.y=t*.12;network.scale.setScalar(1-end*.98);network.visible=t<13;hand.visible=t>=11;hand.scale.setScalar(.6+.2*end);spark.visible=t>=10.5;halos.forEach((r,i)=>{r.visible=t>=11;r.rotation.y=t*.3+i;});
  for(let i=0;i<N;i++){nodes[i].position.copy(positions[i]).lerp(molecule[i],m).lerp(bridge[i],b);}
  for(let i=0;i<N;i++){const j=b>.5?Math.floor(i/30)*30+(i+1)%30:m>.5?Math.floor(i/12)*12+(i+1)%12:(i+7)%N;const a=nodes[i].position,q=nodes[j].position;const ar=edgeGeo.attributes.position;ar.setXYZ(i*2,a.x,a.y,a.z);ar.setXYZ(i*2+1,q.x,q.y,q.z);}edgeGeo.attributes.position.needsUpdate=true;
  camera.position.set(Math.sin(t*.1)*(1-end),7.7-end*.4,19-end*4);camera.lookAt(0,5.5-end*.8,0);spark.position.y=6.2+Math.sin(t*1.5)*.08;spark.rotation.y=t;}
 return {scene,update};
}

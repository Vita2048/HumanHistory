import * as THREE from 'three';
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.65});
function put(g,m,x,y,z,p){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
function base(color,fog){const s=new THREE.Scene();s.background=new THREE.Color(color);s.fog=new THREE.FogExp2(fog,.016);s.add(new THREE.HemisphereLight('#a195bf','#291e2a',1.5));return s;}
export function createIndustry(){
 const scene=base('#403747','#68515c'),iron=mat('#34323a',.65),brass=mat('#ac7843',.6),brick=mat('#72504a'),coal=mat('#27232d');
 const key=new THREE.DirectionalLight('#f5bb7f',3);key.position.set(-8,14,8);scene.add(key);
 put(new THREE.PlaneGeometry(250,250),mat('#40373b'),0,-.12,-35,scene).rotation.x=-Math.PI/2;
 const gear=new THREE.Group();gear.position.set(0,5,5);scene.add(gear);
 put(new THREE.TorusGeometry(2.45,.25,10,64),brass,0,0,0,gear);put(new THREE.CylinderGeometry(.45,.45,.65,20),iron,0,0,0,gear).rotation.x=Math.PI/2;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const spoke=put(new THREE.BoxGeometry(.16,4.8,.16),iron,0,0,0,gear);spoke.rotation.z=a;}
 // Rails, sleepers, and factory facades provide clear speed and depth cues.
 for(const x of [-1.25,1.25])put(new THREE.BoxGeometry(.12,.15,180),iron,x,.08,-45,scene);
 for(let i=0;i<90;i++)put(new THREE.BoxGeometry(3.8,.13,.24),coal,0,-.02,25-i*2,scene);
 const chimneys=[];const fireMat=new THREE.MeshStandardMaterial({color:'#c77339',emissive:'#ed762a',emissiveIntensity:1.2});
 for(let i=0;i<14;i++){const side=i%2?1:-1,x=side*(8+(i%3)*2),z=-12-Math.floor(i/2)*11,h=4+(i%4);put(new THREE.BoxGeometry(7,h,8),brick,x,h/2,z,scene);put(new THREE.BoxGeometry(7.5,.4,8.5),coal,x,h,z,scene);const cy=h+5+(i%3);put(new THREE.CylinderGeometry(.55,.8,cy,12),brick,x+side*2,cy/2,z-2,scene);chimneys.push({x:x+side*2,y:cy,z:z-2});for(let r=0;r<2;r++)for(let c=0;c<4;c++)put(new THREE.BoxGeometry(.7,.9,.03),fireMat,x-2.4+c*1.55,1.4+r*1.7,z+4.03,scene);}
 const train=new THREE.Group();scene.add(train);const boiler=put(new THREE.CylinderGeometry(1.03,1.03,5.2,24),iron,0,2.45,0,train);boiler.rotation.x=Math.PI/2;
 put(new THREE.BoxGeometry(2.7,.4,8.2),coal,0,1.25,-1,train);put(new THREE.BoxGeometry(2.7,2.6,2.3),brick,0,2.75,-3.6,train);put(new THREE.BoxGeometry(3.2,.22,2.8),coal,0,4.13,-3.6,train);
 put(new THREE.CylinderGeometry(.35,.25,1.5,12),iron,0,3.65,1.65,train);put(new THREE.CylinderGeometry(.49,.35,.25,12),coal,0,4.48,1.65,train);
 const lamp=put(new THREE.SphereGeometry(.24,16,12),new THREE.MeshBasicMaterial({color:'#ffe1a1'}),0,2.5,2.68,train);
 const wheels=[];for(const side of [-1,1])for(let i=0;i<4;i++){const w=new THREE.Group();w.position.set(side*1.4,.9,1.8-i*1.6);train.add(w);put(new THREE.CylinderGeometry(.8,.8,.22,24),iron,0,0,0,w).rotation.z=Math.PI/2;const face=put(new THREE.TorusGeometry(.59,.055,6,24),brass,side*.13,0,0,w);face.rotation.y=Math.PI/2;for(let j=0;j<6;j++){const sp=put(new THREE.BoxGeometry(.25,1.35,.07),brass,0,0,0,w);sp.rotation.x=j*Math.PI/3;}wheels.push(w);}
 const rods=[];for(const side of [-1,1])rods.push(put(new THREE.BoxGeometry(.13,.16,5),brass,side*1.62,.9,-.6,train));
 for(let i=0;i<3;i++){const z=-9-i*5;put(new THREE.BoxGeometry(2.7,2.6,4.5),mat('#554147'),0,2.15,z,train);for(const side of [-1,1])for(let j=0;j<3;j++)put(new THREE.BoxGeometry(.04,.65,.72),fireMat,side*1.37,2.7,z-1.25+j*1.2,train);}
 const smoke=[];for(let i=0;i<90;i++){const m=put(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:'#aca0a5',transparent:true,opacity:.25,depthWrite:false,roughness:1}),0,0,0,scene);smoke.push(m);}
 function update(camera,t){const move=Math.max(0,t-3);train.position.z=-20+move*3.2;gear.rotation.z=-t*1.8;gear.visible=t<3.2;
 if(t<3.2){camera.position.set(.5,5.4,19-t*.65);camera.lookAt(0,5,5);}else{const p=smooth((t-3.2)/8.8);camera.position.set(4,4.2+p*3.5,train.position.z+14-p*2);camera.lookAt(0,2.7,train.position.z-2);}
 // The locomotive's nose faces +Z. At radius .8, +3.2 units/s requires +4 rad/s.
 const wheelAngle=move*4;
 for(const w of wheels)w.rotation.x=wheelAngle;for(const r of rods){r.position.y=.9+Math.cos(wheelAngle)*.4;r.position.z=-.6+Math.sin(wheelAngle)*.4;}
 for(let i=0;i<smoke.length;i++){const q=(t*.19+i*.117)%1;const c=i<12?{x:0,y:4.6,z:train.position.z+1.6}:chimneys[i%chimneys.length];const m=smoke[i];m.position.set(c.x+q*4,c.y+q*8,c.z-q*5);m.visible=t>=3.2;m.scale.setScalar(.2+q*1.5);m.material.opacity=(1-q)*.14;}
 }
 return {scene,update};
}
export function createElectricity(){
 const scene=base('#493655','#796074');scene.fog.density=.009;
 const key=new THREE.DirectionalLight('#c5afc9',1.2);key.position.set(-10,30,0);scene.add(key);
 put(new THREE.PlaneGeometry(250,250),mat('#252333'),0,0,-60,scene).rotation.x=-Math.PI/2;
 put(new THREE.PlaneGeometry(7,190),mat('#33303d'),0,.015,-65,scene).rotation.x=-Math.PI/2;
 const windows=[],lamps=[];
 // Dense, individually lit windows echo the reference's purple city canyon.
 for(let i=0;i<40;i++){const side=i%2?1:-1,row=Math.floor(i/2),x=side*(6+(row%3)*.65),z=16-row*7.2,h=12+(i*17%22),w=4.8;
 const bm=mat(i%3===0?'#443745':i%3===1?'#372f40':'#51404b');put(new THREE.BoxGeometry(w,h,5.8),bm,x,h/2,z,scene);
 for(let f=0;f<Math.floor(h/1.5)-1;f++)for(let c=0;c<3;c++){const wm=new THREE.MeshBasicMaterial({color:'#151726'});const o=put(new THREE.PlaneGeometry(.56,.7),wm,x+side*(w/2+.025),1.4+f*1.5,z-1.8+c*1.7,scene);o.rotation.y=side<0?Math.PI/2:-Math.PI/2;windows.push({m:wm,on:1.8+row*.22+(f*3+c+i)%9*.11,lit:(i+f+c)%5!==0});}
 for(let f=0;f<Math.floor(h/1.5)-1;f++)for(let c=0;c<3;c++){const wm=new THREE.MeshBasicMaterial({color:'#151726'});put(new THREE.PlaneGeometry(.6,.7),wm,x-1.5+c*1.5,1.4+f*1.5,z+2.92,scene);windows.push({m:wm,on:1.8+row*.22+(f+c)%6*.15,lit:(i+f+c)%4!==0});}
 }
 const darkColor=new THREE.Color('#151726'),warmColor=new THREE.Color('#ffe4a8');
 for(let i=0;i<22;i++){const z=8-i*6,side=i%2?1:-1;put(new THREE.CylinderGeometry(.04,.08,3.4,6),mat('#595064',.4),side*3,1.7,z,scene);const lm=new THREE.MeshBasicMaterial({color:'#302b35'});put(new THREE.SphereGeometry(.16,10,8),lm,side*3,3.5,z,scene);lamps.push({m:lm,on:1.4+i*.18});}
 // Incandescent filament is the intimate opening, then the camera enters the city.
 const bulb=new THREE.Group();bulb.position.set(0,8,9);scene.add(bulb);
 const glass=new THREE.MeshPhysicalMaterial({color:'#c0a9cd',transparent:true,opacity:.17,roughness:.12,metalness:.1,depthWrite:false});put(new THREE.SphereGeometry(1.15,32,24),glass,0,.4,0,bulb);
 put(new THREE.CylinderGeometry(.45,.6,.65,24),mat('#9f8b72',.8),0,-.85,0,bulb);
 for(let i=0;i<5;i++){const ring=put(new THREE.TorusGeometry(.49,.035,5,32),mat('#51475d',.7),0,-.61-i*.1,0,bulb);ring.rotation.x=Math.PI/2;}
 const filamentMat=new THREE.MeshBasicMaterial({color:'#46333b'});const points=[];for(let i=0;i<100;i++)points.push(new THREE.Vector3(-.42+i*.0085,.2+Math.sin(i*.65)*.09,Math.cos(i*.65)*.09));const filament= new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.018,6,false),filamentMat);bulb.add(filament);
 for(const x of [-.4,.4])put(new THREE.CylinderGeometry(.012,.012,.85,5),mat('#c7af89'),x,-.22,0,bulb);
 const bulbLight=new THREE.PointLight('#ffd997',0,22,1.4);bulbLight.position.copy(bulb.position);scene.add(bulbLight);
 const cableMaterial=new THREE.LineBasicMaterial({color:'#ebb76d',transparent:true,opacity:.6});for(const side of [-1,1]){const ps=[];for(let i=0;i<80;i++)ps.push(new THREE.Vector3(side*3,3.5-Math.sin(i*.3)*.2,10-i*1.6));scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ps),cableMaterial));}
 function update(camera,t){const light=smooth((t-.3)/1.3);filamentMat.color.setRGB(.2+light*4,.1+light*2,.04+light*.65);bulbLight.intensity=light*25;bulb.visible=t<3.5;bulbLight.intensity=t<3.5?light*25:0;
 if(t<3.5){camera.position.set(.3,8.25,15.4-t*.45);camera.lookAt(0,8,9);}else{const p=(t-3.5)/6.5;camera.position.set(Math.sin(p*2)*.4,7+p*7,10-p*45);camera.lookAt(0,12+p*9,-45-p*30);}
 for(const w of windows)w.m.color.copy(darkColor).lerp(warmColor,w.lit?smooth((t-w.on)/.8):0);for(const l of lamps)l.m.color.copy(darkColor).lerp(warmColor,smooth((t-l.on)/.6));
 }
 return {scene,update};
}

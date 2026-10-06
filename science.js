import * as THREE from 'three';
export function createScience(){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#11182e');scene.fog=new THREE.FogExp2('#24213d',.018);
 scene.add(new THREE.HemisphereLight('#9caee2','#342231',1.7));const key=new THREE.DirectionalLight('#ffe1a2',3);key.position.set(-5,10,9);scene.add(key);
 const mat=(c,metalness=0)=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness});const brass=mat('#ba8643',.7),dark=mat('#293045',.6),wood=mat('#573b38');
 function put(g,m,x,y,z,p=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
 const stars=[];for(let i=0;i<950;i++)stars.push(Math.sin(i*2.399)*95,Math.cos(i*1.13)*65+15,-20-(i*.371%85));const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:'#dbd9ed',size:.075,transparent:true,opacity:.85,fog:false})));
 put(new THREE.PlaneGeometry(150,150),mat('#252138'),0,-.1,-20).rotation.x=-Math.PI/2;
 const bench=put(new THREE.BoxGeometry(15,.4,5),wood,0,1.5,-3);for(const x of [-6.5,6.5])for(const z of [-5,-1])put(new THREE.BoxGeometry(.4,1.5,.4),wood,x,.7,z);
 // Telescope points directly toward the first camera position.
 const telescope=new THREE.Group();telescope.position.set(-2.5,4.5,3);scene.add(telescope);
 const tube=put(new THREE.CylinderGeometry(.85,.72,3.8,40,1,true),brass,0,0,0,telescope);tube.rotation.x=Math.PI/2;
 for(const z of [-1.8,1.8]){const ring=put(new THREE.TorusGeometry(.85,.075,8,48),brass,0,0,z,telescope);}
 const lensMat=new THREE.MeshStandardMaterial({color:'#354f82',emissive:'#647ce0',emissiveIntensity:.55,metalness:.8,roughness:.12});put(new THREE.CircleGeometry(.77,48),lensMat,0,0,1.94,telescope);
 put(new THREE.CylinderGeometry(.12,.16,3,8),brass,0,-1.6,0,telescope);
 for(const x of [-1,1]){const leg=put(new THREE.CylinderGeometry(.06,.1,3,7),wood,x*.5,-2.4,0,telescope);leg.rotation.z=x*.4;}
 // A luminous orbital model, deliberately illustrative rather than scale-accurate.
 const system=new THREE.Group();system.position.set(0,6,-8);scene.add(system);
 const sunMat=new THREE.MeshStandardMaterial({color:'#ffcc79',emissive:'#ffa331',emissiveIntensity:1.9});put(new THREE.SphereGeometry(.68,32,24),sunMat,0,0,0,system);
 const sunLight=new THREE.PointLight('#ffd397',35,22,1.5);sunLight.position.copy(system.position);scene.add(sunLight);
 const planets=[],colors=['#ad806f','#deb67a','#6598ba','#c77354','#c5ac85'];
 for(let i=0;i<5;i++){const r=1.5+i*.88;const ring=put(new THREE.TorusGeometry(r,.014,4,120),new THREE.MeshBasicMaterial({color:'#ad9b79',transparent:true,opacity:.5}),0,0,0,system);ring.rotation.x=Math.PI/2-.35;const p=put(new THREE.SphereGeometry(.14+i*.07,22,16),mat(colors[i]),r,0,0,system);planets.push({p,r,speed:.8/(1+i*.6),phase:i*1.7});}
 // Measurement: a working pendulum and a prism share the bench at the final reveal.
 const pendulum=new THREE.Group();pendulum.position.set(3.7,6,-3);scene.add(pendulum);
 for(const x of [-1,1])put(new THREE.BoxGeometry(.16,4.3,.2),brass,3.7+x,3.85,-3);put(new THREE.BoxGeometry(2.4,.17,.2),brass,3.7,6,-3);
 put(new THREE.CylinderGeometry(.015,.015,3.1,5),dark,0,-1.55,0,pendulum);put(new THREE.SphereGeometry(.35,24,16),brass,0,-3.2,0,pendulum);
 const prism=put(new THREE.CylinderGeometry(.75,.75,1.5,3),new THREE.MeshPhysicalMaterial({color:'#abc9e0',metalness:.25,roughness:.13,transparent:true,opacity:.65}),-4.4,2.6,-3);prism.rotation.z=Math.PI/2;
 const spectrum=['#dc6672','#e5a069','#e0ca82','#82b994','#6d9bbf','#9e82bd'];for(let i=0;i<6;i++){const line=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4.1,2.65,-2.8),new THREE.Vector3(-.5,2.2+i*.16,-1.5)]);scene.add(new THREE.Line(line,new THREE.LineBasicMaterial({color:spectrum[i],transparent:true,opacity:.8})));}
 for(let i=0;i<8;i++){const book=put(new THREE.BoxGeometry(1.7,.16,1.2),mat(i%2?'#80654d':'#4a536b'),2,1.8+i*.17,-2.6);book.rotation.y=i*.04;}
 const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function update(camera,t){
  telescope.visible=t<3||t>=7;
  if(t<3){const p=sm(t/3);camera.position.set(-2.5,4.5,13-p*6.7);camera.lookAt(-2.5,4.5,3);}
  else if(t<7){const p=(t-3)/4;camera.position.set(Math.sin(p*.65)*4,7.8,3.5-p*2);camera.lookAt(0,6,-8);}
  else{const p=sm((t-7)/3);camera.position.set(2.4-p*1.4,8+p,1.5+p*17);camera.lookAt(0,5.4-p*.8,-6);}
  for(const o of planets){const a=t*o.speed+o.phase;o.p.position.set(Math.cos(a)*o.r,Math.sin(a)*o.r*.34,Math.sin(a)*o.r*.94);o.p.rotation.y=t*.3;}
  pendulum.rotation.z=Math.sin(t*2.3)*.42;prism.rotation.y=.2+Math.sin(t*.35)*.1;lensMat.emissiveIntensity=.55+sm((t-2.2)/.8)*1.5;
 }
 return {scene,update};
}


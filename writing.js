import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Clay, incised wedge marks, and an archive: every pose derives from local time.
export function createWriting(){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#211b30');scene.fog=new THREE.FogExp2('#30233a',.028);
 scene.add(new THREE.HemisphereLight('#aaa1d0','#281820',1.3));
 const key=new THREE.PointLight('#ffc283',100,45,1.5);key.position.set(-5,9,7);scene.add(key);
 const rim=new THREE.DirectionalLight('#c0addf',2);rim.position.set(5,8,-4);scene.add(rim);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.93});
 const clay=mat('#b16f49'),ink=mat('#452c29'),wood=mat('#342738'),stone=mat('#473d4f');
 function put(g,m,x,y,z,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
 put(new THREE.PlaneGeometry(100,140),mat('#292333'),0,-.05,-30).rotation.x=-Math.PI/2;
 // Hero tablet stands above a low writing table; round corners catch the warm key.
 const tablet=new THREE.Group();tablet.position.set(0,4.5,0);tablet.rotation.x=-.13;scene.add(tablet);
 put(new RoundedBoxGeometry(4.7,5.8,.48,3,.22),clay,0,0,0,tablet);
 put(new THREE.BoxGeometry(6,.28,3),wood,0,1.5,0);
 for(const x of [-2.3,2.3])for(const z of [-1,1])put(new THREE.BoxGeometry(.25,1.5,.25),wood,x,.75,z);
 const wedge=new THREE.Shape();wedge.moveTo(-.14,.12);wedge.lineTo(.16,0);wedge.lineTo(-.14,-.075);wedge.closePath();
 const wedgeGeo=new THREE.ExtrudeGeometry(wedge,{depth:.025,bevelEnabled:false});
 const marks=[],symbols=[];
 for(let row=0;row<7;row++)for(let col=0;col<6;col++){
  const g=new THREE.Group();g.position.set(-1.75+col*.69,2.08-row*.64,.251);tablet.add(g);
  const gold=new THREE.MeshStandardMaterial({color:'#714329',emissive:'#ffb359',emissiveIntensity:0,roughness:1});
  for(let j=0;j<3;j++){const m=put(wedgeGeo,gold,(j%2)*.17,(j===2?-.18:.08),0,g);m.rotation.z=(row+col+j)%3===0?Math.PI/2:0;m.scale.setScalar(.9);}
  marks.push({g,mat:gold,reveal:.6+(row*6+col)*.105});
 }
 // Scratches and a raised rim give the tablet a tactile surface at close range.
 for(let i=0;i<19;i++){const x=-2+(i*.731%4),y=-2.5+(i*.413%5);const l=put(new THREE.BoxGeometry(.07+i%3*.025,.012,.008),ink,x,y,.246,tablet);l.rotation.z=i*.9;}
 // Racks of records recede on both sides of the camera's retreat.
 for(const side of [-1,1])for(let bay=0;bay<5;bay++){
  const x=side*6.1,z=-4-bay*5;
  for(const dx of [-1.4,1.4])put(new THREE.BoxGeometry(.2,9,.26),wood,x+dx,4.5,z);
  for(let shelf=0;shelf<4;shelf++){
   const y=1.2+shelf*2;put(new THREE.BoxGeometry(3.2,.18,1.15),wood,x,y,z);
   for(let j=0;j<4;j++){const t=put(new RoundedBoxGeometry(.54,1.32,.22,1,.08),clay,x-1.03+j*.67,y+.74,z+.11);t.rotation.z=Math.sin(j+bay)*.075;
    for(let r=0;r<4;r++)put(new THREE.BoxGeometry(.32,.025,.015),ink,x-1.03+j*.67,y+.42+r*.2,z+.233);
   }
  }
 }
 // Doorway and pillars establish a far destination, lit by the same golden motif.
 for(const x of [-4.5,4.5])put(new THREE.BoxGeometry(.9,12,1),stone,x,6,-31);
 put(new THREE.BoxGeometry(10,1,1),stone,0,12,-31);
 const distant=new THREE.PointLight('#ffc477',65,40,1.5);distant.position.set(0,6,-27);scene.add(distant);
 const flameMat=new THREE.MeshBasicMaterial({color:new THREE.Color(2.4,1.05,.25)});
 for(const x of [-4.4,4.4]){put(new THREE.CylinderGeometry(.11,.19,1.6,6),wood,x,2,-1);put(new THREE.ConeGeometry(.16,.65,7),flameMat,x,3.1,-1);}
 const stylus=new THREE.Group();scene.add(stylus);
 const reed=put(new THREE.CylinderGeometry(.04,.08,2.4,6),mat('#cca36a'),0,1.2,0,stylus);reed.rotation.z=-.6;
 put(new THREE.ConeGeometry(.075,.32,3),ink,.04,0,0,stylus).rotation.z=Math.PI;
 // A stream of written signs leaves the tablet: stored knowledge travels outward.
 const goldMat=new THREE.MeshBasicMaterial({color:'#e9b96e',transparent:true,opacity:.7});
 for(let i=0;i<46;i++){const g=new THREE.Group();for(let j=0;j<2;j++){const m=put(wedgeGeo,goldMat,j*.19,0,0,g);m.rotation.z=j*Math.PI/2;}scene.add(g);symbols.push(g);}
 const dustGeo=new THREE.BufferGeometry(),xyz=[];for(let i=0;i<260;i++)xyz.push(Math.sin(i*7.13)*10,1+(i*1.719%12),4-(i*.733%40));dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(xyz,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:'#edbd80',size:.035,transparent:true,opacity:.65}));scene.add(dust);
 const clamp=x=>Math.max(0,Math.min(1,x)),sm=x=>{x=clamp(x);return x*x*(3-2*x);};
 function update(camera,t){const pull=sm((t-2.4)/7.6);camera.position.set(pull*2.4,5.5+pull*1.5,13+pull*8);camera.lookAt(0,4.2,-pull*3);tablet.rotation.y=-.08+pull*.13;
  for(const m of marks){const a=sm((t-m.reveal)/.22);m.g.scale.setScalar(Math.max(.001,a));m.mat.emissiveIntensity=Math.max(0,1.4-(t-m.reveal)*1.6)*a;}
  const target=marks[Math.min(41,Math.max(0,Math.floor((t-.6)/.105)))].g;tablet.updateMatrixWorld(true);const v=tablet.localToWorld(target.position.clone());stylus.position.copy(v).add(new THREE.Vector3(.04,.04,.12));stylus.visible=t<5.35;stylus.position.x+=sm((t-4.95)/.4)*5;
  for(let i=0;i<symbols.length;i++){const u=clamp((t-4.7-i*.045)/4.8);const a=i*2.399;symbols[i].visible=u>0;symbols[i].position.set(Math.sin(a)*u*5,5.3+u*4+Math.sin(u*5+a)*.25,-1-u*26);symbols[i].rotation.set(.1,u*.6,Math.sin(a)*.35);symbols[i].scale.setScalar((1-u*.65)*.7);}
  dust.rotation.y=t*.012;key.intensity=100+4*Math.sin(t*3);
 }
 return {scene,update};
}

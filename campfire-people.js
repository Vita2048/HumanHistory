import * as THREE from 'three';
const material=(color,roughness=.95)=>new THREE.MeshStandardMaterial({color,roughness});
function ellipsoid(parent,mat,x,y,z,sx,sy,sz){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function limb(parent,a,b,r1,r2,mat){const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b),d=v2.clone().sub(v1);const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,d.length(),16),mat);m.position.copy(v1).add(v2).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function createCampfirePeople(scene){
 const people=[];
 const definitions=[{x:-2.6,z:-1.6,s:1.18,pose:'warm',cloth:'#665449',skin:'#a0795d',hair:'#34251f'}, {x:2.65,z:-1.2,s:1.1,pose:'crouch',cloth:'#775749',skin:'#91654c',hair:'#292323'}, {x:-3.6,z:.2,s:.85,pose:'stand',cloth:'#585d5d',skin:'#ae8061',hair:'#3b2b24'}, {x:1.4,z:-3.25,s:1.14,pose:'stand',cloth:'#514d50',skin:'#956d53',hair:'#292421'}];
 definitions.forEach((d,index)=>{
  const root=new THREE.Group();root.position.set(d.x,0,d.z);root.rotation.y=Math.atan2(-d.x,-d.z);root.scale.setScalar(d.s);scene.add(root);
   const cloth=material(d.cloth),skin=material(d.skin,.8),hair=material(d.hair),leather=material('#40342d'),trim=material('#8b7961'),wood=material('#4a3226'),stone=material('#9a938a',.6);
   // Warm fire-glow response, animated deterministically in update().
   skin.emissive=new THREE.Color('#ff7a2a');skin.emissiveIntensity=.1;cloth.emissive=new THREE.Color('#ff5a1a');cloth.emissiveIntensity=.05;
  const crouch=d.pose==='crouch',hip=crouch?.64:1.04;
  // Separate bent thighs, shins, and feet give each stance real weight.
  for(const side of [-1,1]){const hx=side*.16,kx=side*(crouch?.31:.19),knee=[kx,crouch?.4:.54,crouch?.44:.035],ankle=[side*(crouch?.36:.21),.12,crouch?.16:.07];limb(root,[hx,hip,0],knee,.13,.105,skin);ellipsoid(root,skin,...knee,.108,.12,.11);limb(root,knee,ankle,.10,.067,skin);ellipsoid(root,skin,ankle[0],.09,ankle[2]+.075,.095,.085,.20);}
  const torso=new THREE.Group();torso.position.y=hip;torso.rotation.x=crouch?.2:0;root.add(torso);
  const profile=[[.35,-.38],[.34,-.22],[.27,.05],[.25,.22],[.28,.45],[.32,.57],[.24,.65],[.12,.71]].map(([r,y])=>new THREE.Vector2(r,y));
  const hideGeo=new THREE.LatheGeometry(profile,32);const hp=hideGeo.attributes.position;for(let v=0;v<hp.count;v++){const angle=Math.atan2(hp.getZ(v),hp.getX(v));if(hp.getY(v)<-.2)hp.setY(v,hp.getY(v)+.045*Math.sin(angle*7+index)+.028*Math.sin(angle*13));}hideGeo.computeVertexNormals();const tunic=new THREE.Mesh(hideGeo,cloth);tunic.scale.z=.65;tunic.castShadow=true;tunic.receiveShadow=true;torso.add(tunic);
  const belt=new THREE.Mesh(new THREE.CylinderGeometry(.252,.257,.022,32,1,true),leather);belt.scale.z=.68;belt.position.y=.13;torso.add(belt);
  
  limb(torso,[0,.63,0],[0,.82,0],.092,.086,skin);
  const head=new THREE.Group();head.position.set(0,.91,.02);torso.add(head);
  ellipsoid(head,skin,0,0,0,.175,.235,.17);ellipsoid(head,skin,0,-.055,.106,.125,.13,.09);
  ellipsoid(head,skin,0,.004,.171,.034,.055,.059);
  for(const side of [-1,1]){ellipsoid(head,skin,side*.17,-.005,0,.029,.052,.035);ellipsoid(head,hair,side*.064,.047,.151,.039,.012,.012);}
  const cap=new THREE.Mesh(new THREE.SphereGeometry(1,28,18,0,Math.PI*2,0,Math.PI*.56),hair);cap.scale.set(.183,.246,.184);cap.position.y=.018;head.add(cap);
  if(index===0||index===3)ellipsoid(head,hair,0,-.14,.087,.13,.10,.10);
  // A folded collar and seams break the toy-like unbroken cone silhouette.
  // Irregular hide mantle draped over the left shoulder, without a tailored collar.
  for(let j=0;j<12;j++){const a=j/11*Math.PI;ellipsoid(torso,trim,-.17+Math.cos(a)*.16,.56+Math.sin(a)*.075,-.04,.08,.05+(j%3)*.012,.21);}
   for(let j=0;j<10;j++){const a=j/10*Math.PI*2;ellipsoid(head,hair,Math.cos(a)*.158,-.065-(j%3)*.03,Math.sin(a)*.12-.045,.062,.18+(j%3)*.025,.063);}
   // The standing watcher carries a stone-tipped spear and a leather headband; the crouching figure gets a topknot.
   if(index===2){const spear=new THREE.Group();spear.position.set(.37,-.15,.12);spear.rotation.z=-.07;spear.rotation.x=.04;torso.add(spear);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.028,.034,2.3,8),wood);shaft.position.y=1.0;shaft.castShadow=true;spear.add(shaft);const tip=new THREE.Mesh(new THREE.ConeGeometry(.06,.22,8),stone);tip.position.y=2.26;tip.castShadow=true;spear.add(tip);const bind=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.09,8),leather);bind.position.y=2.13;spear.add(bind);const band=new THREE.Mesh(new THREE.TorusGeometry(.178,.02,8,24),leather);band.position.set(0,.04,.005);band.rotation.x=Math.PI/2-.12;head.add(band);}
   if(index===1){ellipsoid(head,hair,0,.24,-.03,.06,.09,.06);}

  const arms=[];
  for(const side of [-1,1]){
   const arm=new THREE.Group();arm.position.set(side*.28,.56,0);torso.add(arm);
   const warm=d.pose!=='stand',elbow=[side*.13,warm?-.25:-.34,warm?.16:.01],wrist=[side*.1,warm?-.17:-.59,warm?.53:.1];
   ellipsoid(arm,skin,0,0,0,.11,.13,.11);limb(arm,[0,0,0],elbow,.105,.075,skin);ellipsoid(arm,skin,...elbow,.078,.082,.078);limb(arm,elbow,wrist,.075,.045,skin);
   const hand=ellipsoid(arm,skin,wrist[0],wrist[1]-.025,wrist[2]+.025,.056,.082,.038);hand.rotation.x=warm?-1.2:0;
   ellipsoid(arm,skin,wrist[0]-side*.044,wrist[1],wrist[2]+.025,.023,.038,.025);arms.push(arm);
  }
   people.push({root,torso,head,arms,hip,crouch,phase:index*1.83,warm:d.pose!=='stand',skin,cloth});
 });
 return {update(t){for(const p of people){const breath=Math.sin(t*1.45+p.phase);p.torso.position.y=p.hip+breath*.012;p.torso.rotation.x=(p.crouch?.2:.015)+Math.sin(t*.65+p.phase)*.018;p.torso.rotation.z=Math.sin(t*.54+p.phase)*.012;p.head.rotation.y=Math.sin(t*.47+p.phase)*.075;p.head.rotation.x=.09+Math.sin(t*.7+p.phase)*.035;for(let i=0;i<2;i++){p.arms[i].rotation.x=Math.sin(t*.95+p.phase+i*.7)*(p.warm?.045:.018);p.arms[i].rotation.z=Math.sin(t*.55+p.phase+i)*.012;}const flick=Math.sin(t*13+p.phase*3)*.5+Math.sin(t*29+p.phase)*.5;p.skin.emissiveIntensity=.1+flick*.035;p.cloth.emissiveIntensity=.05+flick*.02;}}};
}

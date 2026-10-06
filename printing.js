import * as THREE from 'three';
export function createPrinting(){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#342940');scene.fog=new THREE.FogExp2('#705064',.018);
 scene.add(new THREE.HemisphereLight('#e8c6b8','#302439',2));const light=new THREE.DirectionalLight('#ffd79b',3);light.position.set(-6,12,8);scene.add(light);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const wood=mat('#614334'),iron=mat('#363139'),paper=mat('#edd9ad'),walls=mat('#a77965'),roof=mat('#50394b');
 function put(g,m,x,y,z,p=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
 put(new THREE.PlaneGeometry(160,160),mat('#49404c'),0,-.1,-35).rotation.x=-Math.PI/2;
 const press=new THREE.Group();scene.add(press);
 for(const x of [-2.3,2.3]){put(new THREE.BoxGeometry(.55,7.8,.7),wood,x,3.9,0,press);put(new THREE.BoxGeometry(1,.3,3),wood,x,.15,0,press);}
 put(new THREE.BoxGeometry(5.4,.7,1.2),wood,0,7.3,0,press);put(new THREE.BoxGeometry(5.2,.6,3.5),wood,0,2.4,0,press);
 const plate=put(new THREE.BoxGeometry(4,.3,2.7),iron,0,4.3,0,press);
 const screw=put(new THREE.CylinderGeometry(.23,.23,3.4,12),iron,0,5.8,0,press);
 for(let i=0;i<20;i++){const r=put(new THREE.TorusGeometry(.25,.04,4,12),wood,0,4.4+i*.15,0,press);r.rotation.x=Math.PI/2;}
 const handle=put(new THREE.BoxGeometry(4.7,.14,.16),wood,0,6.2,0,press);
 // Raised movable type is readable as a dense printing bed beneath the platen.
 for(let r=0;r<12;r++)for(let c=0;c<20;c++)put(new THREE.BoxGeometry(.12,.08,.1),iron,-1.7+c*.17,2.75,-1+r*.17,press);
 const texCanvas=document.createElement('canvas');texCanvas.width=384;texCanvas.height=512;const ctx=texCanvas.getContext('2d');ctx.fillStyle='#ead9b2';ctx.fillRect(0,0,384,512);ctx.fillStyle='#493a38';ctx.fillRect(40,36,304,4);ctx.font='bold 38px serif';ctx.fillText('IDEAS',40,92);ctx.fillRect(40,110,304,3);for(let r=0;r<22;r++){for(let c=0;c<2;c++){const w=112+((r*17+c*11)%25);ctx.fillRect(40+c*160,140+r*14,w,3);}}const texture=new THREE.CanvasTexture(texCanvas);texture.colorSpace=THREE.SRGBColorSpace;
 const pageMat=new THREE.MeshStandardMaterial({map:texture,side:THREE.DoubleSide,roughness:1});
 const bedPage=put(new THREE.PlaneGeometry(3.3,2.5),pageMat,0,2.84,0,press);bedPage.rotation.x=-Math.PI/2;
 for(let i=0;i<12;i++)put(new THREE.BoxGeometry(2.5,.035,1.9),paper,-3.9,1+i*.038,1,scene);
 // An avenue of roofs forms the world the printed pages travel through.
 const windows=[];
 for(let row=0;row<7;row++)for(const side of [-1,1]){
  const x=side*(6.4+(row%2)*1.1),z=-8-row*6,h=4+(row%3)*1.3,w=3.8;
  put(new THREE.BoxGeometry(w,h,4.6),walls,x,h/2,z);
  const r=put(new THREE.ConeGeometry(3.4,2.2,4),roof,x,h+1.1,z);r.rotation.y=Math.PI/4;
  for(let y=1;y<h-.3;y+=1.3)for(let dx=-1;dx<=1;dx+=2){const wm=new THREE.MeshStandardMaterial({color:'#d69f65',emissive:'#ffd091',emissiveIntensity:0});put(new THREE.BoxGeometry(.55,.8,.06),wm,x+dx,y,z+2.34);windows.push({m:wm,start:3.4+row*.55});}
 }
 const pages=[];for(let i=0;i<34;i++){const g=new THREE.PlaneGeometry(1.4,1.9,5,8);const m=put(g,pageMat,0,0,0);pages.push(m);}
 const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 function update(camera,t){const lift=ease((t-3)/7);camera.position.set(1.3+lift*2,5.7+lift*8.5,16-lift*18);camera.lookAt(0,4.2+lift*4,-lift*21);
  const down=ease(t/.9),up=ease((t-1.5)/1.1);plate.position.y=4.3-1.25*down+1.25*up;screw.rotation.y=t<2.6?Math.PI*(down-up):0;handle.rotation.y=screw.rotation.y;screw.scale.y=(7.1-plate.position.y)/3.4;screw.position.y=(7.1+plate.position.y)/2;
  bedPage.visible=t<3;
  for(let i=0;i<pages.length;i++){const u=clamp((t-2.5-i*.11)/5.5);const p=pages[i];p.visible=t>=2.5+i*.11;p.position.set(Math.sin(u*5+i*.7)*u*4,2.9+u*9.5,-u*37+i*.07);p.rotation.set(-Math.PI/2+u*2.3,Math.sin(u*4+i)*.5,Math.sin(i*2.1+u*3)*u*.6);const a=p.geometry.attributes.position;for(let j=0;j<a.count;j++){a.setZ(j,Math.sin(a.getY(j)*3+t*3+i)*.09*u);}a.needsUpdate=true;p.geometry.computeVertexNormals();}
  for(const w of windows)w.m.emissiveIntensity=ease((t-w.start)/.8)*1.6;
 }
 return {scene,update};
}


import * as THREE from 'three';
export function createBook(){
 const book=new THREE.Group(),leather=new THREE.MeshStandardMaterial({color:'#583627',roughness:.92});
 function put(g,m,x,y,z){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);book.add(o);return o;}
 for(const side of [-1,1]){
  put(new THREE.BoxGeometry(3.42,4.8,.14),leather,side*1.73,0,-.25);
  const c=document.createElement('canvas');c.width=768;c.height=1024;const x=c.getContext('2d');x.fillStyle='#d9bc83';x.fillRect(0,0,768,1024);
  for(let i=0;i<16000;i++){x.fillStyle=i%2?'rgba(85,50,18,.045)':'rgba(255,236,185,.09)';x.fillRect(i*137.17%768,i*251.39%1024,1+i%3,1+i%2);}
  const g=x.createLinearGradient(0,0,768,0);g.addColorStop(0,'rgba(73,37,13,.29)');g.addColorStop(.13,'rgba(73,37,13,0)');g.addColorStop(.85,'rgba(73,37,13,0)');g.addColorStop(1,'rgba(73,37,13,.23)');x.fillStyle=g;x.fillRect(0,0,768,1024);
  x.strokeStyle='#9b6434';x.lineWidth=3;x.strokeRect(44,44,680,936);x.lineWidth=1;x.strokeRect(52,52,664,920);
  for(let i=0;i<25;i++)for(const y of [65,959]){x.beginPath();x.arc(66+i*26,y,5,0,Math.PI*2);x.stroke();}
  x.fillStyle='#713526';x.font='48px Georgia';x.textAlign='center';x.fillText(side===1?'Memoria mundi':'Liber sapientiae',384,144);x.textAlign='left';
  const lines=['Scientia et memoria hominum','verba per tempora portantur','Quod discimus posteris traditur','et lumen inter gentes crescit','In principio erat verbum','memoria manet ultra vitam'];x.font='italic 27px Georgia';x.fillStyle='#4f3b28';
  for(let r=0;r<22;r++){const y=218+r*30;if(r===0){x.fillStyle='#883d2c';x.font='88px Georgia';x.fillText(side===1?'M':'S',83,y+45);x.font='italic 27px Georgia';x.fillStyle='#4f3b28';}x.fillText(lines[(r+(side===1?2:0))%6],r<3?170:85,y);}
  x.font='22px Georgia';x.textAlign='center';x.fillText(side===1?'XVII':'XVI',384,934);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=8;
  for(let i=0;i<16;i++){const geo=new THREE.PlaneGeometry(3.3,4.6,40,16),a=geo.attributes.position;for(let j=0;j<a.count;j++){const u=(a.getX(j)+1.65)/3.3,d=side===1?u:1-u;a.setZ(j,.1+Math.sin(d*Math.PI)*.32);a.setX(j,a.getX(j)+Math.sin(a.getY(j)*2+i)*.009);}geo.computeVertexNormals();put(geo,new THREE.MeshStandardMaterial(i===15?{map:tx,side:THREE.DoubleSide,roughness:1}:{color:i%2?'#cbb17f':'#ac8958',side:THREE.DoubleSide,roughness:1}),side*1.66,0,-.14+i*.018);}
 }
 put(new THREE.CylinderGeometry(.1,.1,4.85,16),leather,0,0,-.14);
 put(new THREE.PlaneGeometry(.12,2.1),new THREE.MeshStandardMaterial({color:'#763331',side:THREE.DoubleSide}),.15,-1.8,.34).rotation.z=-.13;
 return book;
}

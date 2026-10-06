import * as THREE from 'three';
import fragment from './orb-fragment.js';
export function createClosingLight(){
 const canvas=document.getElementById('closing-person');const ctx=canvas.getContext('2d');const W=1024,H=1536;canvas.width=W;canvas.height=H;
 const glowLayer=document.createElement('canvas');glowLayer.width=W;glowLayer.height=H;const light=glowLayer.getContext('2d');
 const orb=document.createElement('canvas');orb.width=orb.height=128;const gl=orb.getContext('webgl',{alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
 if(!gl)throw new Error('Closing light requires WebGL');
 function compile(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
 const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.,1.);}'));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 const u={};for(const n of ['uRes','uTime','uRadius','uSpin','uHue','uAccent','uStars','uGlow','uPulse'])u[n]=gl.getUniformLocation(program,n);
 gl.viewport(0,0,128,128);gl.uniform2f(u.uRes,128,128);gl.uniform1f(u.uSpin,.11);gl.uniform1f(u.uHue,205);gl.uniform1f(u.uAccent,180);gl.uniform1f(u.uStars,1.1);
 let person=null,lastTime=0;
 new THREE.TextureLoader().load('assets/person-clean.png',texture=>{person=texture.image;draw(lastTime);});
 function radial(context,x,y,r,rgb,alpha){const g=context.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${alpha})`);g.addColorStop(.33,`rgba(${rgb},${alpha*.45})`);g.addColorStop(1,`rgba(${rgb},0)`);context.fillStyle=g;context.fillRect(x-r,y-r,2*r,2*r);}
 function draw(t){lastTime=t;if(!person)return;const pulse=.5+.36*Math.sin(t*2.35)+.14*Math.sin(t*4.9+.7),cx=781,cy=342+Math.sin(t*1.4)*2.2;
  ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.drawImage(person,0,0,W,H);
  // Motivated light is clipped to the character's alpha, so it cannot make glowing rectangles.
  light.clearRect(0,0,W,H);light.globalCompositeOperation='source-over';radial(light,775,400,115,'100,195,255',.9);radial(light,657,471,130,'82,160,255',.55);radial(light,546,207,107,'130,210,255',.45);radial(light,567,366,145,'90,180,255',.3);light.globalCompositeOperation='destination-in';light.drawImage(person,0,0,W,H);
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=.35+pulse*.65;ctx.drawImage(glowLayer,0,0);ctx.globalAlpha=1;
  radial(ctx,cx,cy,170+pulse*50,'55,135,255',.30+pulse*.40);radial(ctx,cx,cy,80+pulse*20,'105,220,255',.4+pulse*.4);
  gl.useProgram(program);gl.uniform1f(u.uTime,t);gl.uniform1f(u.uRadius,32*(.95+.10*pulse));gl.uniform1f(u.uGlow,1.7+pulse*1.1);gl.uniform1f(u.uPulse,pulse);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);gl.flush();
  ctx.globalCompositeOperation='source-over';ctx.drawImage(orb,cx-64,cy-64);ctx.globalCompositeOperation='screen';
  // Curved energy trails orbit the core, with changing tilt and intensity.
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.45);for(let k=0;k<3;k++){ctx.save();ctx.rotate(k*1.05);ctx.strokeStyle=`rgba(110,211,255,${.24+pulse*.4})`;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,0,48+k*9,17+k*3,0,t*.7+k,t*.7+k+Math.PI*1.3);ctx.stroke();ctx.restore();}ctx.restore();
  for(let i=0;i<34;i++){const q=(t*(.17+i%3*.025)+i*.173)%1,angle=i*2.399,x=cx+Math.sin(angle+q*4)*(30+q*80),y=cy-10-q*200,alpha=Math.sin(q*Math.PI)*(.6+pulse*.4);radial(ctx,x,y,5+i%4,'100,200,255',alpha);ctx.strokeStyle=`rgba(167,233,255,${alpha*.65})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(angle+q*4)*5,y+8+i%5);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 }
 return {update:draw};
}

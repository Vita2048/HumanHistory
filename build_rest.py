from pathlib import Path
chapters=[
 ('computing',72,10,'08 / KNOWLEDGE CONNECTED','CONNECTION','Knowledge crossed the planet.',89),
 ('space',82,10,'09 / OUR SHARED HOME','PERSPECTIVE','We reached beyond Earth. And looked back.',82),
 ('ai',92,12,'10 / ARTIFICIAL INTELLIGENCE','INTELLIGENCE','Learning patterns. Expanding possibility.',78),
 ('closing',104,8,'THE NEXT CHAPTER','WHAT WILL WE<br>BUILD NEXT?','The choice is ours.',76)
]
base=Path('compositions/printing-title.html').read_text(encoding='utf-8')
hosts=[]
for name,start,duration,kicker,title,quote,size in chapters:
 s=base.replace('printing',name).replace('04 / THE PRINTED PAGE',kicker).replace('IDEAS',title).replace('The written page multiplied.',quote).replace('font:150px/.95','font:'+str(size)+'px/1.03').replace('data-duration="10"',f'data-duration="{duration}"')
 if name=='ai':
  s=s.replace('</style>','.lang{position:absolute;top:225px;left:48px;right:48px;text-align:center;font:42px Era,sans-serif;color:#fff1d5;opacity:0}</style>')
  s=s.replace('<div id="ai-copy">','<div id="hello" class="lang">HELLO</div><div id="hola" class="lang">HOLA</div><div id="bonjour" class="lang">BONJOUR</div><div id="ai-copy">')
  s=s.replace("window.__timelines['ai-title']=tl;","tl.fromTo('#hello',{opacity:0},{opacity:1,duration:.2},5).to('#hello',{opacity:0,duration:.2},5.7);tl.fromTo('#hola',{opacity:0},{opacity:1,duration:.2},5.9).to('#hola',{opacity:0,duration:.2},6.6);tl.fromTo('#bonjour',{opacity:0},{opacity:1,duration:.2},6.8).to('#bonjour',{opacity:0,duration:.2},7.6);window.__timelines['ai-title']=tl;")
 Path(f'compositions/{name}-title.html').write_text(s,encoding='utf-8')
 hosts.append(f'<div id="{name}-title" class="clip" data-composition-id="{name}-title" data-composition-src="compositions/{name}-title.html" data-start="{start}" data-duration="{duration}" data-track-index="1" data-track-kind="graphics" data-width="720" data-height="1280"></div>')
 offsets={'computing':.4,'space':.8,'ai':.5,'closing':.3}
 offset=offsets[name]
 hosts.append(f'<audio id="voice-{name}" src="assets/{name}.mp3" data-start="{start+offset}" data-duration="{duration-offset}" data-track-index="3" data-volume="1"></audio>')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('data-duration="72"','data-duration="112"');s=s.replace('<div data-hf-id="hf-3jgm"','\n'.join(hosts)+'\n<div data-hf-id="hf-3jgm"');p.write_text(s,encoding='utf-8')
p=Path('scene.js');s=p.read_text(encoding='utf-8');s="import {createComputing,createSpace,createIntelligence} from './finale.js';\n"+s;s=s.replace('electricity=createElectricity();','electricity=createElectricity(),computing=createComputing(),space=createSpace(),intelligence=createIntelligence();');s=s.replace('Math.min(72,t));if(t>=62)','Math.min(112,t));if(t>=92){pass.scene=intelligence.scene;bloom.strength=.55;renderer.toneMappingExposure=1.15;intelligence.update(camera,t-92);composer.render();return;}if(t>=82){pass.scene=space.scene;bloom.strength=.4;renderer.toneMappingExposure=1.1;space.update(camera,t-82);composer.render();return;}if(t>=72){pass.scene=computing.scene;bloom.strength=.5;renderer.toneMappingExposure=1.15;computing.update(camera,t-72);composer.render();return;}if(t>=62)');p.write_text(s,encoding='utf-8')

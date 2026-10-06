import sys, asyncio, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / '.tools'))
import edge_tts
import edge_tts.communicate
# Include the OS certificate store alongside certifi; TLS verification stays enabled.
edge_tts.communicate._SSL_CTX.load_default_certs()

LINES = [
 ('fire', 'For most of our story, the night was dark. Then we learned to carry a little daylight with us.'),
 ('roots', 'We planted seeds. We built homes. Across generations, villages grew into places no single person could build alone.'),
 ('writing', 'We gave memory a shape. Words could travel farther than voices, and knowledge could outlive its makers.'),
 ('printing', 'The written page multiplied. Ideas crossed borders, challenged authority, and reached people their authors would never meet.'),
 ('science', 'We measured, tested, and questioned. Again and again, the universe proved stranger than the stories we had told.'),
 ('industry', 'Machines amplified our strength. Industry transformed daily life, and brought new dangers, inequalities, and costs to the world around us.'),
 ('electricity', 'Electricity threaded through our cities. Night changed. Voices crossed oceans. The world began to feel smaller.'),
 ('computing', 'We taught machines to calculate, then connected them. More people could share knowledge, create, and collaborate across the planet.'),
 ('space', 'We reached beyond Earth, and looked back at the fragile home that had made every discovery possible.'),
 ('ai', 'We built systems that learned patterns from data, helping us discover, create, and solve problems. Their power made human judgment more important.'),
 ('closing', 'Progress is rarely a straight line, but it never stops—it accelerates. What comes next isn’t written yet. It depends on what we choose to build. So... what will you build?')
]
async def main():
 Path('assets').mkdir(exist_ok=True)
 for name,text in LINES:
  if len(sys.argv)>1 and name not in sys.argv[1:]: continue
  communicate = edge_tts.Communicate(text, 'en-GB-RyanNeural', rate=('-18%' if name == 'fire' else '-15%' if name == 'writing' else '+3%'), boundary='WordBoundary')
  words=[]
  with open(f'assets/{name}.mp3','wb') as f:
   async for chunk in communicate.stream():
    if chunk['type']=='audio': f.write(chunk['data'])
    elif chunk['type']=='WordBoundary': words.append(chunk)
  Path(f'assets/{name}.json').write_text(json.dumps(words, indent=2))
  print(name, 'last_word_end', (words[-1]['offset']+words[-1]['duration'])/1e7 if words else None, flush=True)
asyncio.run(main())

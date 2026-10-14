// ---------- Quest 10: The Returning of the Keys (roadmap 5.10): the end of the main story ----------
// The story: the player takes the three keys from Captain Barron's pouch (Earth, Sky and Fire) back to the spirits of their temples, in any order, the Fire temple last. The Earth girl (Mysterious Girl) is in the sanctum of the Temple to
// the Mountains and says her line (Jack's) and seals the key. The Sky boy (Mysterious Boy) is on the plateau of the Temple to the Sky: when he gets his key he repairs his temple (the ruined circle is made whole again: `sky_damaged` is switched
// off, so the variant puts the Sky temple back exactly). The Fire Spirit (an old woman, in the fire hall) only receives hers once the other two are home; she says Jack's long speech, gives the old man's letter and the key to a new home, and
// the main story is complete (`story_complete`): water has raised an island north of the village (Haven Isle) with a ready house, which becomes your home. The game goes on as free play.
// Switches: earth_key_returned, sky_key_returned, fire_key_returned, island_risen, q10_done, story_complete. Items: house_key. The spoken lines marked JACK are Jack's own words from STORY_TEXT.md (also in JACKS_LINES.txt).
QUESTS.push({id:'q10',name:'The Returning of the Keys',
 steps:['[Placeholder] Take the Earth Key to the Temple to the Mountains and the Sky Key to the Temple to the Sky. The Fire temple is last.','[Placeholder] Both keys are home. Take the Fire Key to the Temple of Fire.'],
 goals:[()=>{const e=!flag('earth_key_returned')?[7,28]:null,s=!flag('sky_key_returned')?[236,114]:null;return e&&s?(Math.hypot(P.x-e[0],P.y-e[1])<=Math.hypot(P.x-s[0],P.y-s[1])?e:s):(e||s)},[71,38]]});
LETTERS.q10_letter={from:'The old man',title:'A home for you',text:"[Placeholder] Dear friend,\n\nThe sea has raised a small island for you, north of the village. The key inside this letter opens the house on it.\n\nThank you for everything.\n\nThe old man"};
ITEMS.house_key={n:'House key',kind:'key',desc:'The key to your new home on Haven Isle, north of the village.'};
TACT.giveletter=v=>{if(!hasLetter(v))myLetters().push(v);save()};   // a letter goes straight into the bag's LETTERS pocket
// ---- the new island: Haven Isle, an oval of sand and grass in the open sea north of the village, with a pier, a path, lanterns and a house ----
const ISLE={cx:166,cy:82,rx:12,ry:9.5,hx:165,hy:78},ISLE_ORIG=new Map(),ISLE_LAND=['Haven Isle',166,82];
function applyIsle(on){const{cx,cy,rx,ry,hx,hy}=ISLE,x0=cx-14,x1=cx+14,y0=cy-12,y1=cy+16,gy=hy+8;   // gy: the row of the garden gate
  BL.filter(b=>b.haven).forEach(b=>BL.splice(BL.indexOf(b),1));
  if(!on){ISLE_ORIG.forEach((t,k)=>{M[k]=t});ISLE_ORIG.clear();const i=LAND.indexOf(ISLE_LAND);if(i>=0)LAND.splice(i,1);if(typeof groundDirty==='function')groundDirty();return}
  if(!ISLE_ORIG.size)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)ISLE_ORIG.set(y*MW+x,M[y*MW+x]);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const d=Math.hypot((x-cx)/rx,(y-cy)/ry);if(d<=1)setT(x,y,d>.82?2:1)}
  [[-8,-3],[-6,3],[7,-2],[8,3],[-4,-6],[4,-7],[-9,0],[9,0]].forEach(([dx,dy])=>{const x=cx+dx,y=cy+dy;if(at(x,y)===1&&!(y>=hy+3&&y<=gy&&Math.abs(dx)<=9))setT(x,y,4)});
  for(let y=hy+2;y<=Math.round(cy+ry)+1;y++)if(at(cx,y)!==0)setT(cx,y,6);                                  // the path from the door down to the beach
  for(let y=Math.round(cy+ry);y<=Math.round(cy+ry)+3;y++)if(at(cx,y)===0||at(cx,y)===2)setT(cx,y,3);        // a short pier into the sea
  [gy+3,gy+6].forEach(y=>[cx-1,cx+1].forEach(x=>{if(at(x,y)===1)setT(x,y,7)}));                              // lanterns along the path outside the gate
  // the Japanese garden in front of the house: a raked-gravel court with a line of stepping stones, a koi pond either side, pines, stone lanterns, a bamboo fence and a wooden gate
  rect(cx-8,hy+3,cx+8,gy-1,(x,y)=>{if(at(x,y)===1||at(x,y)===2||at(x,y)===4)setT(x,y,103)});
  for(let y=hy+2;y<gy;y++)setT(cx,y,104);setT(cx,gy,104);[cx-1,cx+1].forEach(x=>setT(x,gy,103));
  [[-6,4],[-5,4],[-6,5],[-5,5],[5,4],[6,4],[5,5],[6,5]].forEach(([dx,dy])=>setT(cx+dx,hy+dy,9));              // two small koi ponds
  [[cx-8,hy+3],[cx+8,hy+3],[cx-8,gy-1],[cx+8,gy-1],[cx-3,hy+3],[cx+3,hy+3]].forEach(([x,y])=>setT(x,y,102));   // pines at the corners and either side of the door
  [[-2,hy+3],[2,hy+3],[-2,gy-1],[2,gy-1],[-2,hy+6],[2,hy+6]].forEach(([dx,y])=>setT(cx+dx,y,7));          // stone lanterns
  for(let x=cx-9;x<=cx+9;x++)if(Math.abs(x-cx)>=3)setT(x,gy,8);for(let y=hy+3;y<gy;y++){setT(cx-9,y,8);setT(cx+9,y,8)}   // a bamboo fence round the garden
  setT(cx-2,gy,107);setT(cx+2,gy,107);BL.push({x:cx-2,y:gy,w:5,towergate:1,haven:1});                        // the gate (posts, and the wooden roof drawn by towerGate)
  if(S.home&&S.home.x===hx&&S.home.y===hy)for(let j=-2;j<2;j++)for(let i=-3;i<=5;i++)M[(hy+j)*MW+hx+i]=5;       // the grand house fills 9 x 4 tiles (js/render/grandhouse.js); the door is the home system's (home.x+1, home.y+1)
  if(!LAND.includes(ISLE_LAND))LAND.push(ISLE_LAND);
  for(let y=y0;y<=y1;y+=2)for(let x=x0;x<=x1;x+=2)FOG[(y>>2)*FW+(x>>2)]=1;                                   // it appears on the map
  if(typeof groundDirty==='function')groundDirty()}
VARIANTS.push({id:'haven_isle',flag:'island_risen',apply:on=>applyIsle(on)});applyVariants(true);
// the key to the new home: this house becomes your home (an older house is packed back into its kit and the old claim goes), on a claim round it
TACT.islandhome=()=>{const h=S.home;if(h&&!(h.x===ISLE.hx&&h.y===ISLE.hy)){for(let j=0;j<2;j++)for(let i=0;i<3;i++){const k=(h.y+j)*MW+h.x+i;if(M[k]===5)M[k]=1;delete S.cut[k]}
    const kit=Object.keys(ITEMS).find(id=>ITEMS[id].kind==='prefab'&&ITEMS[id].roof===h.roof);if(kit)add(kit,1)}
  S.home={x:ISLE.hx,y:ISLE.hy,roof:'slate',grand:1};S.claim={x:ISLE.cx-14,y:ISLE.cy-11,w:29,h:22,isle:1};ui();save()};   // the claim is the whole island (not fenced); stations and gardens can go anywhere on it
// ---- where the spirits stand (the girl in the Earth sanctum, the boy on the Sky plateau, the Fire Spirit in her hall) ----
NPC.push({n:'Fire Spirit',x:PH.dx,y:PH.y0+6,hx:PH.dx,hy:PH.y0+6,f:'d',skin:2,hair:3,shirt:0,jk:0,hat:'none',hstyle:'bun',pack:false,fixed:1,say:['[Placeholder] The flame burns steadily now. Thank you.'],bio:{age:null,job:'Spirit of the Fire temple',backstory:null,likes:[],q:null}});
STORY_PEOPLE.unshift(
 {npc:'Mysterious Girl',if:{flag:'keys_to_return'},at:[257,SZ.y0+6],f:'d',say:['[Placeholder] This temple is always open to you, brother.']},
 {npc:'Mysterious Boy',if:{flag:'keys_to_return'},at:[236,113],f:'d',say:['[Placeholder] The stones are standing again. Thank you.']},
 {npc:'Fire Spirit',if:{flag:'keys_to_return'},at:[PH.dx,PH.y0+6],f:'d'},
 {npc:'Fire Spirit',hide:1});
DLG.q10_boy={start:'a',nodes:{a:{who:'Mysterious Boy',text:"The water was right all along. Thank you, I'll repair my temple now. Im sure this world will be safe with you among us to defend us"}}};   // JACK
DLG.q10_girl={start:'a',nodes:{a:{who:'Mysterious Girl',text:"From the moment i layed eyes on you i knew you were special. Im glad to call you my brother. I will seal the key so it is safe. I pray we don't have to fight again but always feel free to come back to this temple. Im sure we will meet again soon"}}};   // JACK
DLG.q10_fire={start:'a',nodes:{a:{who:'Fire Spirit',text:"So it is true. Our long lost brother has returned. Thank you. Water has raised an island up from the sea just for you, so that you might find peace and a home to build your new life. Inside the letter is a key to a home on your new island. Keep this safe. You have done a great service to everyone on this land. Though they might not know it. This world owes you a great debt. Go well brother."}}};   // JACK
DLG.q10_fire_wait={start:'a',nodes:{a:{who:'Fire Spirit',text:'[Placeholder] You carry my key, but the others are still waiting for theirs. Take them home first. Mine can wait.'}}};
SCENES.q10_earth=[{wait:200},{say:'q10_girl'},{take:{earth_key:1}},{set:'earth_key_returned'},{toast:'The Earth spirit seals the Earth Key.'}];
SCENES.q10_sky=[{wait:200},{say:'q10_boy'},{take:{sky_key:1}},{set:'sky_key_returned'},{toast:'The Sky spirit takes the Sky Key.'},{wait:400},
 {fade:'out',ms:500},{wait:300},{clear:'sky_damaged'},{fade:'in',ms:900},{msg:'The Temple to the Sky stands whole again!'}];
SCENES.q10_fire=[{wait:300},{say:'q10_fire'},{take:{fire_key:1}},{set:'fire_key_returned'},{toast:'The Fire spirit seals the Fire Key.'},{wait:400},
 {giveletter:'q10_letter'},{read:'q10_letter'},{give:{house_key:1}},{toast:'You got the key to your new home!'},
 {fade:'out',ms:500},{islandhome:1},{set:'island_risen'},{wait:300},{fade:'in',ms:900},
 {set:'q10_done'},{set:'story_complete'},{done:'q10'},
 {msg:'An island has risen from the sea north of the village. It is on your map, and the house on it is your home now. You have finished the main story of Little Harbor. The game goes on: fish, build and explore!'}];
TRIGGERS.push(
 // returning a key: the first of the Earth and Sky keys just goes home; the second also sends you on to the Fire temple
 {id:'q10_earth_a',when:{talk:'Mysterious Girl'},if:{quest:'q10',has:{earth_key:1},noflag:'sky_key_returned'},do:[{scene:'q10_earth'}]},
 {id:'q10_earth_b',when:{talk:'Mysterious Girl'},if:{quest:'q10',has:{earth_key:1},flag:'sky_key_returned'},do:[{scene:'q10_earth'},{step:1},{msg:'[Placeholder] Both keys are home. The Fire temple is last.'}]},
 {id:'q10_sky_a',when:{talk:'Mysterious Boy'},if:{quest:'q10',has:{sky_key:1},noflag:'earth_key_returned'},do:[{scene:'q10_sky'}]},
 {id:'q10_sky_b',when:{talk:'Mysterious Boy'},if:{quest:'q10',has:{sky_key:1},flag:'earth_key_returned'},do:[{scene:'q10_sky'},{step:1},{msg:'[Placeholder] Both keys are home. The Fire temple is last.'}]},
 {id:'q10_fire',when:{talk:'Fire Spirit'},if:{quest:'q10',step:1,has:{fire_key:1},noflag:'fire_key_returned'},do:[{scene:'q10_fire'}]},
 {id:'q10_fire_early',when:{talk:'Fire Spirit'},if:{quest:'q10',step:0,has:{fire_key:1}},do:[{say:'q10_fire_wait'}],repeat:1}
);

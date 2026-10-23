// ---------- talking portraits (batch H2): the detailed picture beside someone's words ----------
// Everyone who speaks gets one (js/render/heroart.js paints it; the box shows the head and shoulders). NPC_ART designs the important people by hand. Anyone not listed gets a picture built from their own
// walking-sprite colours and hair (npcArtSpec): older people (named "Old ..." or with grey hair) get lines, some men get a beard or a moustache. A row: {sex, hair, top, over, build, acc, col, arm, bg}
//   hair: braid bob wavy long messy curly crop bun ponytail bald | top: tee shirt stripes sweater tunic | over: vest flannel coat robe apron | build: 'stout'
//   acc: beard longbeard moustache stubble old glasses eyepatch earring scar freckles cap straw tricorn skull chef hood scarf bandana satchel | col: colours to use instead of their own
//   arm: armour painted over the clothes ({helm, body} names from ARM_PAL) | bg: the portrait's background colour
const PT_BG={shop:'#e8c898',story:'#c8b8e8',pirate:'#e0a8a0',guard:'#b8c4d4',spirit:'#c4e4ee',folk:'#a8d0a0',guild:'#d8b890'};
const NPC_ART={
 'Odo':{sex:'m',hair:'bald',over:'apron',build:'stout',acc:['moustache','straw','old'],col:{hair:'#a8a8a8',beard:'#d0d0d0'},bg:PT_BG.shop},
 'Bram':{sex:'m',hair:'crop',top:'shirt',over:'vest',acc:['cap','beard'],bg:PT_BG.shop},
 'Murl':{sex:'m',hair:'crop',over:'coat',acc:['cap','longbeard','old'],col:{hair:'#d9d9d9',beard:'#ececec',jacket:'#2a3a5a'},bg:PT_BG.shop},
 'Bjorn the Elder':{sex:'m',hair:'bald',over:'robe',acc:['longbeard','old'],col:{hair:'#e8e8e8',beard:'#f4f4f4',jacket:'#6b5a8a'},bg:PT_BG.story},
 'Old Tess':{sex:'f',hair:'bun',top:'sweater',over:'vest',acc:['old','glasses'],col:{hair:'#d9d9d9'},bg:PT_BG.folk},
 'Garrick':{sex:'m',hair:'bald',over:'apron',build:'stout',acc:['beard','scar'],col:{apron:'#6b4423',beard:'#4a2a18',hair:'#4a2a18'},bg:PT_BG.shop},
 'Tilda':{sex:'f',hair:'ponytail',over:'apron',acc:['freckles'],col:{apron:'#6b4423'},bg:PT_BG.shop},
 'Astrid':{sex:'f',hair:'long',top:'tunic',over:'robe',acc:['earring'],col:{jacket:'#3f6a4f'},bg:PT_BG.shop},
 'Seamstress Wynn':{sex:'f',hair:'bun',top:'shirt',over:'vest',acc:['glasses'],bg:PT_BG.shop},
 'Barber Fenwick':{sex:'m',hair:'messy',top:'shirt',over:'apron',acc:['moustache'],col:{apron:'#f2f2ec'},bg:PT_BG.shop},
 'Carpenter Alder':{sex:'m',hair:'crop',top:'shirt',over:'apron',acc:['beard','bandana'],col:{apron:'#8a6a40',hat:'#4a7a4a'},bg:PT_BG.shop},
 'Lucie':{sex:'f',hair:'wavy',over:'coat',acc:['earring'],col:{jacket:'#7a2a4a'},bg:PT_BG.shop},
 'Innkeeper Hobb':{sex:'m',hair:'bald',top:'shirt',over:'apron',build:'stout',acc:['moustache'],bg:PT_BG.shop},
 'Innkeeper Ragna':{sex:'f',hair:'braid',top:'sweater',over:'apron',bg:PT_BG.shop},
 'Gate Guard Bors':{sex:'m',hair:'crop',acc:['stubble'],arm:{helm:'chain',body:'chain'},bg:PT_BG.guard},
 'Warden Orrin':{sex:'m',hair:'crop',acc:['moustache'],arm:{helm:'leather',body:'leather'},bg:PT_BG.guard},
 'Warden Brann':{sex:'m',hair:'crop',acc:['beard'],arm:{helm:'leather',body:'leather'},bg:PT_BG.guard},
 'Guildmaster Brenna':{sex:'f',hair:'ponytail',acc:['scar'],arm:{body:'chain'},bg:PT_BG.guild},
 'Sergeant Voss':{sex:'m',hair:'crop',acc:['moustache','scar'],arm:{helm:'chain',body:'chain'},bg:PT_BG.guild},
 'Hild':{sex:'f',hair:'braid',arm:{body:'leather'},bg:PT_BG.guild},
 'Aldric':{sex:'m',hair:'messy',acc:['stubble'],arm:{body:'leather'},bg:PT_BG.guild},
 'Arena Master Dorn':{sex:'m',hair:'bald',build:'stout',acc:['beard'],arm:{body:'leather'},bg:PT_BG.guild},
 'Gambler Finch':{sex:'m',hair:'crop',top:'shirt',over:'vest',acc:['moustache'],bg:PT_BG.guild},
 'Hale':{sex:'m',hair:'messy',over:'flannel',acc:['beard'],col:{jacket:'#a83a2a'},bg:PT_BG.story},
 'Wren':{sex:'f',hair:'wavy',top:'tunic',acc:['hood','freckles'],col:{jacket:'#4a6a3a'},bg:PT_BG.story},
 'Miner Gudrun':{sex:'f',hair:'braid',top:'shirt',over:'vest',acc:['bandana'],bg:PT_BG.folk},
 'Old Stig':{sex:'m',hair:'bald',top:'shirt',over:'vest',acc:['longbeard','old'],col:{hair:'#c8c8c8',beard:'#e0e0e0'},bg:PT_BG.folk},
 'Miner Dell':{sex:'m',hair:'crop',top:'shirt',acc:['cap','stubble'],bg:PT_BG.folk},
 'Rue':{sex:'m',hair:'messy',top:'stripes',acc:['bandana','stubble'],col:{hat:'#c8402a'},bg:PT_BG.story},
 'Old Stranger':{sex:'m',hair:'bald',over:'robe',acc:['hood','longbeard','old'],col:{jacket:'#3a4a6a',beard:'#ececec',hair:'#ececec'},bg:PT_BG.spirit},
 'Captain Redd':{sex:'m',hair:'long',over:'coat',acc:['tricorn','eyepatch','beard'],col:{jacket:'#a82a2a',hair:'#8a2a1a',beard:'#8a2a1a'},bg:PT_BG.pirate},
 'Captain Barron':{sex:'m',hair:'messy',over:'coat',build:'stout',acc:['tricorn','skull','beard','scar'],col:{jacket:'#2a2228',hair:'#1a1416',beard:'#1a1416',hat2:'#1a1416'},bg:PT_BG.pirate},
 'Mysterious Girl':{sex:'f',hair:'long',top:'tunic',col:{skin:'#ece6f2',hair:'#f2f2ff',shirt:'#c8e0d0',eye:'#3ab878'},bg:PT_BG.spirit},
 'Mysterious Boy':{sex:'m',hair:'messy',top:'tunic',col:{skin:'#e8eef8',hair:'#e8f4ff',shirt:'#b8d0f0',eye:'#3a98e0'},bg:PT_BG.spirit},
 'Fire Spirit':{sex:'f',hair:'wavy',top:'tunic',col:{skin:'#f8d8b0',hair:'#f05a20',shirt:'#e8a020',eye:'#d89a10'},bg:'#f0c8a0'},
 'Pip':{sex:'m',hair:'messy',top:'tee',acc:['freckles'],bg:PT_BG.folk},
 'Farmer Hobb':{sex:'m',hair:'crop',top:'shirt',over:'vest',acc:['straw','beard'],bg:PT_BG.folk},
 'Maude':{sex:'f',hair:'bun',top:'sweater',acc:['straw','old'],col:{hair:'#c8c8c8'},bg:PT_BG.folk},
 'Perrin':{sex:'m',hair:'crop',top:'shirt',over:'apron',acc:['cap'],bg:PT_BG.folk},
 'Mags':{sex:'f',hair:'bob',top:'stripes',acc:['bandana','earring'],bg:PT_BG.pirate},
 'One-Eye Finn':{sex:'m',hair:'messy',top:'stripes',acc:['eyepatch','stubble','bandana'],bg:PT_BG.pirate},
 'Barnaby':{sex:'m',hair:'crop',build:'stout',over:'vest',acc:['beard','bandana'],bg:PT_BG.pirate},
 'Salty Jo':{sex:'f',hair:'braid',top:'stripes',acc:['bandana'],bg:PT_BG.pirate},
 'Peg':{sex:'f',hair:'ponytail',over:'vest',acc:['earring','scar'],bg:PT_BG.pirate},
 'Old Nate':{sex:'m',hair:'bald',over:'vest',acc:['longbeard','old','bandana'],col:{beard:'#d8d8d8',hair:'#d8d8d8'},bg:PT_BG.pirate},
 'Quill':{sex:'m',hair:'crop',top:'shirt',over:'vest',acc:['moustache','glasses'],bg:PT_BG.pirate},
 'Dagger Dell':{sex:'m',hair:'messy',top:'stripes',acc:['scar','stubble'],bg:PT_BG.pirate},
 'Cookie':{sex:'m',hair:'bald',build:'stout',over:'apron',acc:['chef','moustache'],bg:PT_BG.pirate},
 'Pirate':{sex:'m',hair:'crop',top:'stripes',acc:['bandana','stubble'],col:{hat:'#a82a2a',shirt:'#2a4a8a'},bg:PT_BG.pirate},
 'Pirate grunt':{sex:'m',hair:'messy',top:'stripes',acc:['bandana','stubble','earring'],col:{hat:'#a82a2a',shirt:'#3a5a9a'},bg:PT_BG.pirate},
 'Pirate grunt 2':{sex:'m',hair:'crop',top:'stripes',acc:['bandana','beard'],col:{hat:'#2a2a2a',shirt:'#8a2a2a'},bg:PT_BG.pirate}};
NPC_ART.Wynn=NPC_ART['Seamstress Wynn'];NPC_ART.Alder=NPC_ART['Carpenter Alder'];
// a person's portrait description: their NPC_ART row on top of what their walking sprite already says (colours, hair, hat)
function npcArtSpec(name){const n=typeof NPC!=='undefined'&&NPC.find(q=>q.n===name),des=NPC_ART[name];if(!n&&!des)return null;
  const base=n?{...n,...((typeof NL!=='undefined'&&NL[n.n])||{})}:{},L=n?lo(base):{colors:{}},cl=L.colors||{},h=[...name].reduce((a,c)=>a+c.charCodeAt(0),0);
  const st=L.style||'short',hair={long:'long',bun:'bun',ponytail:'ponytail',spiky:'messy',bald:'bald'}[st]||'crop',sex=['long','bun','ponytail'].includes(st)?'f':'m';
  const old=/^Old /.test(name)||cl.hair===OPT.hair[3],acc=[];
  if(old)acc.push('old');if(sex==='m')acc.push(h%3===0?'beard':h%3===1?(old?'moustache':'stubble'):'');
  if(base.hat==='cap')acc.push('cap');else if(base.hat==='straw')acc.push('straw');
  const auto={pose:'stand',sex,hair,top:['tee','shirt','stripes','sweater'][h%4],over:n&&base.jon!==false?['vest','coat','flannel'][h%3]:null,acc:acc.filter(Boolean),
    col:{skin:cl.skin||'#e0ac84',hair:cl.hair||'#6b3d1e',shirt:cl.shirt||'#f4f4f0',jacket:cl.jacket||'#3a63a8',hat:cl.hat||'#d9a441',eye:'#3a2a20',pants:'#4a4a58',boots:'#5a3a22'},bg:PT_BG.folk};
  if(n&&(n.pirate||/pirate/i.test(name))){auto.acc=auto.acc.filter(q=>q!=='cap'&&q!=='straw').concat(['bandana']);auto.top='stripes';auto.bg=PT_BG.pirate}   // pirates without their own row still look like pirates
  if(!des)return auto;
  return{...auto,...des,pose:'stand',acc:des.acc||[],col:{...auto.col,...(des.col||{})}}}
const npcArt=name=>{const sp=npcArtSpec(name);return sp?{art:heroCanvas('npc_'+name,sp,'f',sp.arm),bg:sp.bg}:null};

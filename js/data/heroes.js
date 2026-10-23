// ---------- the six characters you can be (batch H1): three women and three men ----------
// look: the small walking sprite (the same fields the tailor and barber change, see js/ui/look.js); art: the detailed picture (js/render/heroart.js). Add a row to add a character.
const HEROES=[
 {id:'f1',sex:'f',n:'Braided fisher',look:{skin:0,hair:4,shirt:5,jk:3,hc:0,hat:'none',jon:true,pack:false,hstyle:'ponytail'},art:{pose:'rod',hair:'braid',top:'sweater',over:'vest',acc:[],eye:'#4a6a3a',pants:'#3b4a6b',boots:'#5a3a22'}},
 {id:'f2',sex:'f',n:'Sailor in a headscarf',look:{skin:2,hair:0,shirt:1,jk:1,hc:1,hat:'scarf',jon:false,pack:false,hstyle:'short'},art:{pose:'hips',hair:'bob',top:'stripes',over:null,acc:['scarf'],eye:'#3a2418',pants:'#e6e0cc',boots:'#3a2a20'}},
 {id:'f3',sex:'f',n:'Freckled forager',look:{skin:0,hair:2,shirt:3,jk:2,hc:0,hat:'none',jon:false,pack:true,hstyle:'long'},art:{pose:'walk',hair:'wavy',top:'tunic',over:null,acc:['freckles','satchel'],eye:'#3a5a8a',pants:'#6b4a30',boots:'#4a3020'}},
 {id:'m1',sex:'m',n:'Deckhand in a cap',look:{skin:1,hair:1,shirt:5,jk:1,hc:2,hat:'cap',jon:true,pack:false,hstyle:'spiky'},art:{pose:'wave',hair:'messy',top:'tee',over:'flannel',acc:['cap'],eye:'#3a2a20',pants:'#55555f',boots:'#5a3a22'}},
 {id:'m2',sex:'m',n:'Navy coat',look:{skin:4,hair:0,shirt:5,jk:0,hc:0,hat:'none',jon:true,pack:false,hstyle:'short'},art:{pose:'cross',hair:'curly',top:'tee',over:'coat',acc:[],eye:'#2a1a10',pants:'#2a3550',boots:'#2a2228'}},
 {id:'m3',sex:'m',n:'Bandana and vest',look:{skin:1,hair:2,shirt:5,jk:6,hc:3,hat:'scarf',jon:true,pack:false,hstyle:'short'},art:{pose:'point',hair:'crop',top:'shirt',over:'vest',acc:['bandana'],eye:'#4a3a20',pants:'#9a7a50',boots:'#4a3020'}}];

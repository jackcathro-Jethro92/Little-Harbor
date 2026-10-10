// ---------- sprites (CharacterSprite module) ----------
var CharacterSprite=(function(){
var FB=["................","................","......KKKKKK....",".....KHHHHHHK...","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHSSSSSSHK..","....KSSSSSSSSK..","....KSESSSSESK..","....KSSSSSSSSK..",".....KSSSSSSK...","......KKSSKK....","....KKTTTTTTKK..","...KSKTTTTTTKSK.","...KSKTTTTTTKSK.","....KKTTTTTTKK..","......KPPPPK....","......KPPKPPK...","......KBBKBBK...","................"];
var BB=["................","................","......KKKKKK....",".....KHHHHHHK...","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..",".....KHHHHHHK...","......KKSSKK....","....KKTTTTTTKK..","...KSKTTTTTTKSK.","...KSKTTTTTTKSK.","....KKTTTTTTKK..","......KPPPPK....","......KPPKPPK...","......KBBKBBK...","................"];
var SB=["................","................",".....KKKKKK.....","....KHHHHHHK....","...KHHHHHHHHK...","...KHHHHHHHHK...","...KHHHHSSSSK...","...KHHHSSSESK...","...KHHSSSSSSSK..","....KHSSSSSSK...",".....KKSSSSK....","......KKSSKK....",".....KTTTTTTK...",".....KTTttTTK...",".....KTTSSTTK...",".....KTTTTTTK...","......KPPPPK....","......KPPPPK....","......KBBBBBK...","................"];
var FF={1:{18:"......KKKKBBK..."},3:{18:"......KBBKKKK..."}};
var SF={1:{17:".....KPPKKPPK...",18:".....KBBK.KBBK.."},3:{17:".....KPPKKPPK...",18:".....KBBK.KBBK.."}};
var SA={1:{13:".....KTTTttTK...",14:".....KTTTSSTK..."},3:{13:".....KttTTTTK...",14:".....KSSTTTTK..."}};
var SJA={1:{13:".....KJJJjjJK...",14:".....KJJJSSJK..."},3:{13:".....KjjJJJJK...",14:".....KSSJJJJK..."}};
var FISHB={13:".....KTTTTTTTSK.",14:".....KTTTTTTK..."};
var FISHJ={13:".....KJJJJJJJSK.",14:".....KJJJJJJK..."};
var CAP={3:".....KAAAAAAK...",4:"....KAAAAAAAAK..",5:"....KaaaaaaaaK.."};
var STRAW={2:".....KKKKKKKK...",3:"....KAAAAAAAAK..",4:"....KAAAAAAAAK..",5:"..KKKaaaaaaaaKKK",6:"..KAAAAAAAAAAAAK"};
var L={
f:{jacket:{12:"....KKJJTTJJKK..",13:"...KJKJJTTJJKJK.",14:"...KSKJJTTJJKSK."},pack:{12:".......r..r.....",13:".......r..r.....",14:".......r..r....."},cap:CAP,straw:STRAW},
b:{jacket:{12:"....KKJJJJJJKK..",13:"...KJKJJJJJJKJK.",14:"...KSKJJJJJJKSK."},pack:{12:"......rrrrrr....",13:"......RRRRRR....",14:"......RRrrRR....",15:"......RRrrRR...."},cap:CAP,straw:STRAW},
s:{jacket:{12:".....KJJJJJJK...",13:".....KJJjjJJK...",14:".....KJJSSJJK..."},pack:{12:".KrrrK..........",13:".KRRRK..........",14:".KrrrK..........",15:".KRRRK..........",16:"..KKK..........."},cap:{3:"....KAAAAAAK....",4:"...KAAAAAAAAK...",5:"...KaaaaaaaaKKKK"},straw:{2:".....KKKKKK.....",3:"....KAAAAAAK....",4:"....KAAAAAAK....",5:"..KKKaaaaaaKKK..",6:"..KAAAAAAAAAAK.."}}};
// hair styles (barber): the base grids are the 'short' style. Overlays are put on before the jacket, pack and hat. 'bald' recolours the hair as skin.
var HS={
long:{f:{7:"....KHSSSSSSHK..",8:"....KHESSSSEHK..",9:"....KHSSSSSSHK..",10:".....KHSSSSHK...",11:".....KHKSSKHK..."},b:{11:".....KHHHHHHK...",12:"....KKHHHHHHKK.."},s:{9:"...KHHHSSSSSK...",10:".....KHHSSSK....",11:"....KHHKSSKK...."}},
spiky:{f:{1:"......KHKHKHK...",2:".....KHHHHHHK..."},b:{1:"......KHKHKHK...",2:".....KHHHHHHK..."},s:{1:".....KHKHKHK....",2:"....KHHHHHHK...."}},
bun:{f:{0:".......KKKK.....",1:".......KHHK.....",2:"......KKHHKK...."},b:{0:".......KKKK.....",1:".......KHHK.....",2:"......KKHHKK...."},s:{0:"......KKKK......",1:"......KHHK......",2:".....KKHHKK....."}},
ponytail:{f:{},b:{11:"......KKHHKK....",12:"....KKTTHHTTKK.."},s:{8:"..KHHHSSSSSSSK..",9:"..KHHHSSSSSSK...",10:"..KHHKKSSSSK....",11:"...KHK.KKSSKK..."}},
bald:{fn:function(g){for(var y=2;y<=10;y++)g[y]=g[y].replace(/H/g,"S")}}};
var DC={hair:"#6b3f1d",skin:"#f1c8a0",shirt:"#f2efe6",jacket:"#3a63a8",hat:"#d9a441",pack:"#c8553d",pants:"#3b4a6b",boots:"#5a3a22"};
function darken(h){var n=parseInt(h.slice(1),16),r=(n>>16)*.74|0,g=((n>>8)&255)*.74|0,b=(n&255)*.74|0;return"#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function put(g,o){for(var y in o){var s=o[y],row=g[y].split("");for(var x=0;x<16;x++)if(s[x]!==".")row[x]=s[x];g[y]=row.join("")}}
function buildGrid(k,f,fish,o){var g=(k==="f"?FB:k==="b"?BB:SB).slice();var side=k==="s",step=!fish&&(f===1||f===3);
if(side&&fish)put(g,FISHB);
if(step){put(g,side?SF[f]:FF[f]);if(side)put(g,SA[f])}
var hsd=o.style&&HS[o.style];if(hsd){if(hsd.fn)hsd.fn(g);else if(hsd[k])put(g,hsd[k])}
if(o.jacket){put(g,L[k].jacket);if(side&&fish)put(g,FISHJ);else if(side&&step)put(g,SJA[f])}
if(o.pack)put(g,L[k].pack);
if(o.hat==="cap")put(g,L[k].cap);
if(o.hat==="straw")put(g,L[k].straw);
return g}
function draw(ctx,x,y,opts){var o=opts||{};
var view=o.view||"f",f=o.frame||0,fish=!!o.fishing,t=o.t||0;
var o2={jacket:o.jacket!==false,pack:o.pack!==false,hat:o.hat===undefined?"cap":o.hat,style:o.style};
var c={},src=o.colors||{};for(var key in DC)c[key]=src[key]||DC[key];
var COL={K:"#2b2118",E:"#2b2118",H:c.hair,S:c.skin,T:c.shirt,t:darken(c.shirt),J:c.jacket,j:darken(c.jacket),A:c.hat,a:darken(c.hat),P:c.pants,B:c.boots,R:c.pack,r:darken(c.pack)};
var k=view==="f"?"f":view==="b"?"b":"s";
var g=buildGrid(k,f,fish,o2);
var dy=(!fish&&(f===1||f===3))?1:0;
var fx=Math.round(x),fy=Math.round(y);
function px(xx,yy,col){ctx.fillStyle=col;ctx.fillRect(xx,yy,1,1)}
ctx.save();
if(view==="l"){ctx.translate(fx+16,fy);ctx.scale(-1,1)}else ctx.translate(fx,fy);
for(var yy=0;yy<20;yy++)for(var xx=0;xx<16;xx++){var ch=g[yy][xx];if(ch!==".")px(xx,yy+dy,COL[ch])}
if(fish&&k==="s"){
[[14,12],[15,11],[16,10],[17,9]].forEach(function(q){px(q[0],q[1],"#7a5230")});
px(18,8,"#d9a441");
if(!o.noLine){var by=o.bite?17:15+((t>>5)&1);for(var ly=9;ly<by;ly++)px(18,ly,"#ffffff");px(18,by,"#d94b3a")}}
ctx.restore()}
return{draw:draw,defaultColors:DC}})();

OPT.jacket=['#3a63a8','#d9534f','#4caf72','#f2c14e','#9c5bb5','#3a3a48'];
OPT.hat=['#d9a441','#c8553d','#3b82c4','#4caf72','#f4f4f0'];
const vw=f=>({u:'b',d:'f',l:'l',r:'r'})[f];
const HSTYLES=['short','long','spiky','bun','ponytail','bald'];
const lo=l=>({style:l.hstyle||(l.id?HSTYLES[l.id.charCodeAt(l.id.length-1)%5]:undefined),jacket:l.jon!==false,pack:l.pack!==false,hat:l.hat===undefined?'cap':l.hat,
  colors:{skin:OPT.skin[l.skin],hair:OPT.hair[l.hair],shirt:OPT.shirt[l.shirt],jacket:OPT.jacket[l.jk===undefined?1:l.jk],hat:OPT.hat[l.hc||0]}});
const NL={Odo:{hat:'straw',pack:false,jk:2},Mara:{hat:'none',pack:false,jon:false},Pip:{hat:'cap',jon:false,hc:1},'Old Tess':{hat:'straw',pack:false,jk:3,hc:4},Bram:{hat:'cap',pack:false,jk:4,hc:2},Murl:{hat:'cap',pack:false,jk:5,hc:0}};
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x|0,y|0,w,h)};

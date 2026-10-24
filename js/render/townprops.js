// ---------- outdoor props for the towns (graphics for TOWN_DECOR in js/data/town.js): a stone well, signposts, flower beds, shade trees, hay bales and a handcart ----------
// They are ordinary props (PROPS.DEF in js/render/props.js, drawn with the same small rectangle painter) placed on the map instead of in a room; js/systems/towndecor.js sets them out.
{const O='#2a1b0e',D=PROPS.DEF;
 D.well={n:'Well',w:2,h:2,c:'Town',d:r=>{r(9,0,14,2,O);r(10,0,12,1,'#8a5a2e');r(6,1,3,15,O);r(23,1,3,15,O);r(7,1,1,14,'#8a5a2e');r(24,1,1,14,'#8a5a2e');r(4,0,24,3,O);r(5,1,22,1,'#b0473a');
   r(15,2,2,7,'#6b4423');r(13,8,6,4,O);r(14,9,4,2,'#8a5a2e');r(2,14,28,16,O);r(3,15,26,14,'#8a887e');for(let y=16;y<29;y+=4)for(let x=4+(y%8?0:3);x<28;x+=6){r(x,y,5,3,'#a8a69c');r(x,y,5,1,'#c4c2b8')}
   r(5,13,22,4,O);r(6,14,20,2,'#2a4a6a');r(7,14,6,1,'#6ab4d8');r(3,29,26,2,'rgba(0,0,0,.25)')}};
 D.signpost={n:'Signpost',w:1,h:1,c:'Town',d:r=>{r(7,-4,2,20,O);r(7,-4,1,19,'#8a5a2e');r(0,-3,14,5,O);r(1,-2,11,3,'#c9965a');r(12,-2,3,3,O);r(12,-1,2,1,'#c9965a');r(2,-1,8,1,'#6b4423');
   r(3,2,13,5,O);r(4,3,10,3,'#c9965a');r(1,3,3,3,O);r(2,4,2,1,'#c9965a');r(6,4,7,1,'#6b4423');r(5,14,6,2,'rgba(0,0,0,.25)')}};
 D.flowerbed={n:'Flower bed',w:1,h:1,c:'Town',d:r=>{r(0,8,16,8,O);r(1,9,14,6,'#6b4423');r(1,9,14,1,'#8a5a2e');[[2,'#e85a5a'],[6,'#f8d050'],[10,'#e8688a'],[13,'#ffffff']].forEach(([x,c])=>{r(x,6,1,4,'#3f8f3a');r(x-1,4,3,3,c);r(x,5,1,1,'#fff6c9')});r(4,8,8,2,'#4f8a36')}};
 D.shadetree={n:'Shade tree',w:2,h:2,c:'Town',d:r=>{r(12,18,8,14,O);r(13,18,6,13,'#6b4423');r(14,18,2,13,'#8a5a2e');r(6,28,20,4,'rgba(0,0,0,.25)');
   r(2,2,28,20,O);r(0,6,32,12,O);r(3,3,26,18,'#3f8f3a');r(1,7,30,10,'#3f8f3a');r(5,3,14,8,'#5aa83c');r(3,8,8,6,'#5aa83c');r(8,4,6,3,'#7ac258');r(20,14,8,5,'#2f6f2c');r(12,17,10,4,'#2f6f2c')}};
 D.campfire={n:'Camp fire',w:1,h:1,c:'Town',g:[8,8,26,'rgba(255,150,50,A)'],d:(r,t)=>{r(1,11,14,4,O);r(2,11,12,3,'#5a3a22');r(3,9,4,3,'#7a5230');r(9,9,4,3,'#6b4423');[[2,13],[6,14],[10,13]].forEach(([x,y])=>r(x,y,3,2,'#8d8f97'));r(5,6,6,6,'#e8632e');r(6,3+t%2,4,6,'#f2a22e');r(7,1+t%3,2,4,'#ffe27a')}},
 D.hay={n:'Hay bale',w:1,h:1,c:'Town',d:r=>{r(1,4,14,11,O);r(2,5,12,9,'#d8b04a');r(2,5,12,2,'#f0d070');r(2,8,12,1,'#a8843a');r(2,11,12,1,'#a8843a');r(5,5,1,9,'#a8843a');r(10,5,1,9,'#a8843a')}};
 D.cart={n:'Handcart',w:2,h:1,c:'Town',d:r=>{r(2,2,24,9,O);r(3,3,22,7,'#a8743f');r(3,3,22,2,'#c9965a');r(3,6,22,1,'#7a5230');r(26,6,6,2,O);r(26,6,5,1,'#8a5a2e');r(4,1,6,3,'#d8c88a');r(12,0,6,4,'#5aa83c');
   r(5,9,8,7,O);r(6,10,6,5,'#6b4423');r(8,12,2,1,'#c9d2da');r(17,9,8,7,O);r(18,10,6,5,'#6b4423');r(20,12,2,1,'#c9d2da')}}}

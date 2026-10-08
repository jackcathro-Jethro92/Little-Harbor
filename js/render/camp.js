// ---------- the pirate camp: tents, camp scenery and the moored ships (see js/world/pirates.js) ----------
function campDecor(b,x,y,t){const O='#2a1b0e',fl=((t/120)|0)%3;R(x+1,y+13,14,3,'#00000030');
  if(b.decor==='campfire'){for(let k=0;k<3;k++)R(x+2+k*4,y+10-k%2,3,4,'#5a3a1e');R(x+3,y+11,10,3,O);R(x+4,y+4+(fl%2),8,8,'#e8641c');R(x+5,y+5,6,6,'#ffb050');R(x+7,y+6,2,3,'#fff0b0');R(x,y-2,16,12,'rgba(255,150,50,.18)');const p=((t/70)%26)|0;R(x+7+(p>>3),y-p|0,2,3,'rgba(150,150,160,.45)')}
  else if(b.decor==='coldfire'){R(x+2,y+9,12,5,'#2a2a2c');R(x+3,y+10,10,3,'#3a3a3e');R(x+4,y+8,3,4,'#4a3a2a');R(x+9,y+9,3,3,'#4a3a2a');R(x+6,y+11,3,1,'#6a6a6e')}
  else if(b.decor==='grave'){R(x+3,y+3,10,11,'#26262a');R(x+4,y+4,8,10,'#8a8a92');R(x+4,y+4,8,2,'#a8a8b0');R(x+6,y+7,4,1,'#5a5a62');R(x+7,y+6,2,5,'#5a5a62');R(x+2,y+13,12,2,'#1e1e22')}
  else if(b.decor==='crate'){R(x+2,y+5,12,10,O);R(x+3,y+6,10,8,'#8a5a2e');R(x+3,y+9,10,1,O);R(x+7,y+6,1,8,O);R(x+3,y+6,10,1,'#a8743f')}
  else if(b.decor==='barrel'){R(x+3,y+3,10,12,O);R(x+4,y+4,8,10,'#8a5a2e');R(x+4,y+6,8,1,O);R(x+4,y+11,8,1,O);R(x+5,y+4,2,10,'#a8743f')}
  else if(b.decor==='flag'){R(x+7,y-14,2,29,'#6e4a1a');const w=Math.round(Math.sin(t/200+x)*1.5);R(x+9,y-14,10,7,O);R(x+9,y-13,9+w,5,'#1a1a1e');R(x+12,y-12,3,2,'#efe6d0');R(x+11,y-11,5,1,'#efe6d0')}}
// a pirate ship moored with its bow to the north, seen from above (3 tiles wide, 4 tall): dark wooden hull, two masts with black sails, a skull flag
function pirateShip(b,x,y,t){const bob=Math.round(Math.sin(t/500+b.y)),O='#1a1008',cx=x+24;R(x+4,y+4+bob,40,60,'rgba(255,255,255,.18)');
  for(let r=0;r<60;r++){const hw=r<16?Math.round(3+r*.85):r>50?Math.round(17-(r-50)*1.4):17;R(cx-hw-1,y+3+r+bob,hw*2+2,1,O);R(cx-hw,y+3+r+bob,hw*2,1,r%6<1?'#8a5a2e':'#5a3a1e')}
  R(cx-9,y+20+bob,18,30,'#8a6a3a');R(cx-9,y+20+bob,18,1,'#a8845a');R(cx-1,y+3+bob,2,6,'#6e4a1a');
  [24,44].forEach((my,k)=>{const sway=Math.round(Math.sin(t/400+k)*1);R(cx-1,y+my-10+bob,2,20,'#6e4a1a');R(cx-13+sway,y+my-8+bob,26,2,'#6e4a1a');R(cx-12+sway,y+my-6+bob,24,9,O);R(cx-11+sway,y+my-5+bob,22,7,k?'#2a2a30':'#3a1a1a');
    if(!k){R(cx-3+sway,y+my-3+bob,6,3,'#efe6d0');R(cx-1+sway,y+my-1+bob,2,2,O)}});
  R(cx-1,y+bob,8,5,O);R(cx,y+1+bob,6,3,'#1a1a1e');R(cx+2,y+1+bob,2,1,'#efe6d0');R(cx-7,y+58+bob,14,3,'#5a3a1e')}

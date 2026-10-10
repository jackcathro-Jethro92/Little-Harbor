// ---------- the Temple to the Sky, damaged version: a switch the story can turn on (flag `sky_damaged`) ----------
// applySky(on) turns the Sky temple's circle (js/world/skytemple.js) into its ruined self, or puts it back; it is safe to call again. It runs at load with the saved flag (see js/systems/flags.js;
// for testing add ?flags=sky_damaged to the game's link) and a quest will call setFlag('sky_damaged') then applySky(true). Built from art/temples/sky_stonehenge_temple (5_circle_damaged, 6_temple_stone_damaged).
// Damaged: the temple stone is split in two (tiles 117 and 118) with dark stairs going down between them (119, blocked: what is below is not built, it comes with the story), scorched
// ground and rubble (120, 122: walkable) round it, two puffs of smoke, some standing stones and lintels toppled (121, blocked) or gone, and the horseshoe of trilithons broken up.
// Only tiles inside the circle's box (x 218-254, y 96-128) change, and the first look of the box is kept in SKY_ORIG so `applySky(false)` restores it exactly. No people, no story items.
const SKY_BOX={x0:218,y0:96,x1:254,y1:128},SKY_ORIG=[];
for(let y=SKY_BOX.y0;y<=SKY_BOX.y1;y++)for(let x=SKY_BOX.x0;x<=SKY_BOX.x1;x++)SKY_ORIG.push(M[y*MW+x]);
function applySky(on){if(typeof groundDirty==="function")groundDirty();
  const AX=236,CY=108;let k=0;
  for(let y=SKY_BOX.y0;y<=SKY_BOX.y1;y++)for(let x=SKY_BOX.x0;x<=SKY_BOX.x1;x++)M[y*MW+x]=SKY_ORIG[k++];
  BL.splice(0,BL.length,...BL.filter(b=>!b.skydmg));
  if(!on)return;
  const set=(x,y,t)=>{if(at(x,y)!==0)setT(x,y,t)},R2=(x,y)=>hs(x*17+3,y*29+5)%100;
  // the standing stones and slabs of the circle and the avenue: a good few toppled or gone
  rect(SKY_BOX.x0,SKY_BOX.y0,SKY_BOX.x1,SKY_BOX.y1,(x,y)=>{const t=at(x,y),r=R2(x,y);
    if(t===78&&r<40)setT(x,y,121);else if(t===79&&r<50)setT(x,y,r<25?122:1)});
  // the trilithons: the north one stands; the others lose their lintels and an upright or two
  const tri=(x,y,lost)=>{const[a,b]=lost;set(x-1,y-1,1);set(x,y-1,1);set(x+1,y-1,1);if(a)set(x-1,y,a===2?122:121);if(b)set(x+1,y,b===2?122:121)};
  tri(AX+4,CY-2,[1,2]);tri(AX-4,CY-2,[2,1]);tri(AX+5,CY+1,[0,1]);tri(AX-5,CY+1,[1,2]);set(AX-4,CY-3,79);set(AX+2,CY-1,79);
  // scorched ground and rubble round the temple stone, thinning out
  rect(AX-6,CY-5,AX+5,CY+5,(x,y)=>{const d=Math.hypot(x-AX+.5,(y-CY)*1.15),t=at(x,y);if(d<5.2&&(t===6||t===1)){const r=R2(x,y);if(r<70)setT(x,y,120);else if(r<85)setT(x,y,122)}});
  // the temple stone, split in two with the stairs showing between the halves
  set(AX-1,CY,117);set(AX,CY,119);set(AX+1,CY,118);set(AX-1,CY+1,120);set(AX,CY+1,120);set(AX+1,CY+1,120);
  BL.push({x:AX-3,y:CY-1,w:1,skydmg:1,skysmoke:1},{x:AX+3,y:CY-1,w:1,skydmg:1,skysmoke:1});
}
applySky(flag('sky_damaged'));

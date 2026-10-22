// Shared basics: DOM helper, canvas, map size constants, directions, look palettes.
const $=id=>document.getElementById(id),cv=$('c');let g=cv.getContext('2d');   // g can be swapped for a moment to draw a creature onto the battle screen (js/systems/battle.js)
const MW=320,MH=420,WH=240,T=16,VW=176,VH=208,KEY='little-harbor-v1',FW=80,FH=60,FOG=new Uint8Array(4800); // the sea and land you can reach are 320 x 240 tiles (WH rows); rows 240-299 hold the hidden rooms (home, halls, the Darkwood) where nothing can sail or walk; FOG = explored 4x4 chunks
const D={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
const OPT={skin:['#f6d2b0','#e0ac84','#b97a50','#7a4a2c','#4e2f1d'],hair:['#2b2118','#6b3d1e','#c9892f','#d9d9d9','#b8412e','#3b6fd0'],shirt:['#d9534f','#3b82c4','#f2c14e','#4caf72','#9c5bb5','#f4f4f0']};

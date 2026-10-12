// ---------- Bjorn the Elder's big house, at the far north of the village (Jack's playtest note P15) ----------
// A large slate-roofed house seven tiles wide (x 151-157, y 101-102) standing in the north of the village island, with a dirt path from the main road (155,106) to its door. Its door stand tile is
// (154,103). Bjorn stands just outside it (js/story/quest2.js) and is found here in every quest. The house cannot be entered yet (an interior comes with the interior loader, step 2.10).
// Runs after settlement.js; coordinates are final world coordinates (the village was moved by OX, OY in overworld.js).
{const X=151,Y=101,W=7;
 rect(X-2,Y-1,X+W+1,Y+4,(x,y)=>{if(at(x,y)!==0&&at(x,y)!==5)setT(x,y,1)});            // clear trees, flowers and crates round it
 rect(X,Y,X+W-1,Y+1,(x,y)=>setT(x,y,5));BL.push({x:X,y:Y,w:W,roof:'slate',big:1});       // the house
 [[154,103],[154,104],[154,105],[155,105]].forEach(([x,y])=>setT(x,y,6));                 // the path from the road to the door
 [[X-1,Y+2],[X+W,Y+2]].forEach(([x,y])=>{if(at(x,y)===1)setT(x,y,11)})}                    // a barrel at each end

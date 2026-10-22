// ---------- player and boat position, movement ----------
let P={x:32+OX,y:33+OY,rx:32+OX,ry:33+OY,f:'d'},B={x:32+OX,y:39+OY},sail=false;
const npcAt=(x,y)=>NPC.find(n=>n.x===x&&n.y===y&&!n.hidden);
const walkable=(x,y)=>{const t=at(x,y);return WK.includes(t)&&!npcAt(x,y)&&!(B.x===x&&B.y===y)&&!placedAt(x,y)&&!solidAt(x,y)&&!INTBLK[y*MW+x]};
const front=()=>[P.x+D[P.f][0],P.y+D[P.f][1]];
function move(d){
  if(SCENE||BATTLE||(typeof SEA_ALERT!=='undefined'&&SEA_ALERT>performance.now()))return;if(fs)cancel();
  P.f=d;const[x,y]=front();{const en=!sail&&enemyAt(x,y);if(en){startEnemyBattle(en);return}}
  if(sail?(at(x,y)===0&&x>=0&&y>=0&&x<MW&&y<WH&&!npcAt(x,y)):walkable(x,y)){P.x=x;P.y=y;if(sail){B.x=x;B.y=y}if(sail){gainXp('sailing',.25);seaTick()}reveal();if(at(P.x,P.y)===47)grassEvent();if(gatePending)applyGates();fireTriggers('step')}
}

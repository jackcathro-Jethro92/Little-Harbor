// ---------- the Stone Barrier: jagged rocks seal the mainland's north-west coast so the mountain country can only be reached through the forest ----------
// Runs right after overworld.js. From y 0 to y 150 (the whole coast of the mountain country and the forest) boats cannot land and nobody can walk along the beach:
//  54 jagged rock in the sea, in a ragged band 1 to 4 tiles wide along the shore (boats cannot get close)
//  55 jagged rock on the shore, covering the beach strip within 5 tiles of the sea (so no one can land further south and walk north along the sand)
// The Darkwood's two gates are then the only way north. Both tile types block everything (they are not in WK).
{const BR={x1:100,y1:150},D4=[[1,0],[-1,0],[0,1],[0,-1]];
 const seaLike=i=>M[i]===0||M[i]===32,inb=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH;
 const land=new Uint8Array(MW*MH),q=[[26,77]];land[77*MW+26]=1; // all the mainland: flood the land from the Mountain Town gate (islands are separate)
 for(let h=0;h<q.length;h++){const[x,y]=q[h];D4.forEach(([a,b])=>{const nx=x+a,ny=y+b;if(!inb(nx,ny))return;const j=ny*MW+nx;if(land[j]||seaLike(j))return;land[j]=1;q.push([nx,ny])})}
 const near=(x,y,r,f)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const nx=x+i,ny=y+j;if(inb(nx,ny)&&f(ny*MW+nx))return true}return false};
 const inRect=(x,y)=>x<=BR.x1&&y<=BR.y1,wet=[],dry=[];
 for(let y=0;y<=BR.y1+4;y++)for(let x=0;x<=BR.x1+4;x++){const i=y*MW+x;
   if(M[i]===0){ // a sea tile: rock it if land is close (always at 1, less often further out, so the edge is ragged)
     for(let d=1;d<=4;d++){if(near(x,y,d,j=>land[j]&&inRect(j%MW,(j/MW)|0))){if(d===1||hs(x*7,y*11)%100<[0,100,75,35,10][d])wet.push(i);break}}}
   else if(land[i]&&inRect(x,y)&&y>=fTop(x)-2&&WK.includes(M[i])&&near(x,y,5,seaLike))dry.push(i)}
 wet.forEach(i=>M[i]=54);dry.forEach(i=>M[i]=55)}

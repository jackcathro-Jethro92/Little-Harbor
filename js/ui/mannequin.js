// ---------- the wardrobe's mannequins (playtest #4, P76): four mannequins that keep armour sets ----------
// Each mannequin (tile 176, indexed by its place in the wardrobe: mannIndex in js/world/granthome.js) can hold one helmet, one armour and one pair of boots (S.mann[i] = {helmet, armour, boots}, item ids). What is on a mannequin is
// really stored there: it is not in your bag. Face one and press Use: wear its set (each piece it holds swaps with the piece you wear in that slot, so yours go onto the mannequin), dress it with armour from your bag
// (including what you are wearing), or take everything off it. The picture of the mannequin shows the pieces in their colours (js/render/granthome.js). Armour sets only: clothes colours stay with the tailor.
const MANN_SLOTS=['helmet','armour','boots'],MANN_NAME={helmet:'head',armour:'body',boots:'feet'};
const mannOf=i=>{S.mann=S.mann||{};return S.mann[i]=S.mann[i]||{}};
const mannSummary=m=>MANN_SLOTS.map(k=>m[k]?ITEMS[m[k]].n:'-').join(' / ');
function mannDone(msg){ui();save();if(typeof groundDirty==='function')groundDirty();if(msg)say(msg)}
function openMannequin(x,y){const i=mannIndex(x),m=mannOf(i),has=MANN_SLOTS.some(k=>m[k]);
  menu('Mannequin '+(i+1)+': '+mannSummary(m),['Wear this set','Dress it from my bag','Take it all to my bag','Cancel'],o=>{
    if(o==='Wear this set'){if(!has)return say('This mannequin is not wearing anything yet.');
      MANN_SLOTS.forEach(k=>{if(!m[k])return;const theirs=m[k],mine=S.eq[k];add(theirs,1);S.eq[k]=theirs;m[k]=null;
        if(mine){S.bag[mine]--;if(!S.bag[mine])delete S.bag[mine];m[k]=mine}});
      mannDone('You change into the set. Your own pieces are on the mannequin now.')}
    else if(o==='Take it all to my bag'){if(!has)return say('There is nothing on it.');MANN_SLOTS.forEach(k=>{if(m[k]){add(m[k],1);m[k]=null}});mannDone('You take everything off the mannequin.')}
    else if(o==='Dress it from my bag')mannDress(i)})}
function mannDress(i){const m=mannOf(i),ids=Object.keys(S.bag).filter(id=>ITEMS[id]&&ITEMS[id].kind==='armour'&&MANN_SLOTS.includes(ITEMS[id].slot)&&S.bag[id]>0);
  if(!ids.length)return say('You have no armour to put on it.');
  const label=id=>ITEMS[id].n+' ('+MANN_NAME[ITEMS[id].slot]+')'+(S.eq[ITEMS[id].slot]===id&&S.bag[id]===1?' [worn]':'');
  menu('Put on mannequin '+(i+1),[...ids.map(label),'Cancel'],o=>{const id=ids.find(q=>label(q)===o);if(!id)return;const k=ITEMS[id].slot;
    if(S.eq[k]===id&&S.bag[id]===1)S.eq[k]=null;S.bag[id]--;if(!S.bag[id])delete S.bag[id];if(m[k])add(m[k],1);m[k]=id;
    mannDone(ITEMS[id].n+' is on the mannequin.')})}

// ---------- food and potions ----------
const foodDesc=id=>{const i=ITEMS[id],pot=1+.04*lvl('cooking'),a=[];if(i.hp)a.push(Math.round(i.hp*pot)+' health');if(i.sta)a.push(Math.round(i.sta*pot)+' stamina');return 'Restores '+a.join(' and ')+'.'};
const potPow=()=>1+.04*lvl('alchemy');
function potionDesc(id){const i=ITEMS[id],p=potPow(),a=[];
  if(i.hp)a.push('Restores '+Math.round(i.hp*p)+' health.');if(i.sta)a.push('Restores '+Math.round(i.sta*p)+' stamina.');
  if(i.speed)a.push('Move and sail twice as fast for '+Math.round(i.speed*p)+' seconds.');
  if(i.coat)a.push('Coats your weapon for '+(i.coat+Math.floor(lvl('alchemy')/3))+' hits. Poisoned enemies are slowed, weakened and take damage over time.');return a.join(' ')}
function drink(id){const it=ITEMS[id],p=potPow();
  if(it.coat){if(!eq('weapon'))return say('Equip a weapon first, then apply the poison.');
    const c=it.coat+Math.floor(lvl('alchemy')/3);S.coat=Math.min(20,S.coat+c);say('Your '+eq('weapon').n.toLowerCase()+' is coated. Poison x'+S.coat+'.')}
  else if(it.speed){S.buff=Math.max(S.buff,Date.now())+Math.round(it.speed*p)*1000;say('You feel light on your feet! Moving twice as fast.')}
  else{if(it.hp&&!it.sta&&S.hp>=maxHp())return say("You're already at full health.");if(it.sta&&!it.hp&&S.sta>=maxSta())return say("You're already fully rested.");
    const h=Math.round((it.hp||0)*p),st=Math.round((it.sta||0)*p);S.hp=Math.min(maxHp(),S.hp+h);S.sta=Math.min(maxSta(),S.sta+st);
    say('You drank the '+it.n.toLowerCase()+'.'+(h?' +'+h+' health.':'')+(st?' +'+st+' stamina.':''));toast((h?'+'+h+' HP ':'')+(st?'+'+st+' STA':''))}
  S.bag[id]--;if(!S.bag[id])delete S.bag[id];ui();save();drawBag()}
function eat(id){const it=ITEMS[id];
  if(S.hp>=maxHp()&&S.sta>=maxSta())return say("You aren't hungry right now.");
  const pot=1+.04*lvl('cooking'),h=Math.round((it.hp||0)*pot),st=Math.round((it.sta||0)*pot);
  S.hp=Math.min(maxHp(),S.hp+h);S.sta=Math.min(maxSta(),S.sta+st);S.bag[id]--;if(!S.bag[id])delete S.bag[id];
  say('You ate the '+it.n.toLowerCase()+'. +'+h+' health, +'+st+' stamina.');toast('+'+h+' HP  +'+st+' STA');ui();save();drawBag()}

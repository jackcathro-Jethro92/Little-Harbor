// ---------- the opening (roadmap 4.0): the sea festival, the first boat, and the first seagull letter ----------
// All the words here are PLACEHOLDERS (marked in DIALOGUE.md) until Jack writes his own, except the stranger's letter, which is Jack's own text from STORY_TEXT.md, word for word.
// The story switches it uses: festival_on (the decorations are up), festival_done (the opening has played), letter1_read (the first letter has come), then Quest 1 starts.
// How it runs: finishing the character screen of a new game fires the 'start' trigger below, which plays the scene (Skip works) and sets festival_done; the first morning after, the decorations come down; and the
// first time the player boards the boat in the village (an older save never sees the festival, it just gets the letter) a seagull brings the letter and Quest 1 appears in the quest log.
// Places are in world tile coordinates: the village plaza (156,124), the pier and Murl (161,125).
VARIANTS.push({id:'festival',flag:'festival_on',apply:on=>{FESTIVAL_ON=on}});applyVariants(true);
// The sea festival cinematic (Jack's playtest note P1): silent, about 50 seconds, with film bars. Sunrise over a dark, quiet harbor; the village wakes (the bunting and lanterns go up and the villagers gather along the road to
// the pier); boats bob in the harbor; Murl steps onto the pier and gives his speech and the crowd cheers; the crowd parts for the newest fisher, who walks down the road to Murl; Murl presents the little rowboat and ties it up
// at the end of the pier; paper lanterns float out over the water as the sun climbs; and the screen fades to the game with the player at the pier. A tap anywhere (or Skip) ends it in the same place. The speech is placeholder.
DLG.fest_c1={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] Welcome, friends, to the Little Harbor Sea Festival!'}}};
DLG.fest_c2={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] Every year we thank the sea for its gifts, and welcome those who will fish its waters.'}}};
DLG.fest_c3={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] This year our newest fisher joins us. Come forward, friend!'}}};
DLG.fest_c4={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] Every fisher needs a boat. This little rowboat is yours, tied up at the end of the pier. Fair winds!'}}};
const FEST_CROWD=['Odo','Bram','Mara','Pip','Old Tess','Yuki','Aiko','Taro','Mei','Haru','Nao'];
// the villagers line both sides of the road between the plaza and the pier, on walkable ground and never on the road itself
function festCrowdWalks(){const spots=[];for(const x of[154,158])for(let y=124;y>=114;y-=2){const p=nearestTile(x,y,(a,b)=>WK.includes(at(a,b))&&Math.abs(a-155.5)>=1.5&&!spots.some(s=>s[0]===a&&s[1]===b)&&a>=150&&a<=162);if(p)spots.push(p)}
  return FEST_CROWD.filter(n=>NPC.some(q=>q.n===n)).map((n,i)=>[n,spots[i%spots.length][0],spots[i%spots.length][1],250])}
SCENES.festival_opening=[
 {bars:'on'},{build:[0,0,1]},{light:[.78,1.07,44000]},{fade:'out',ms:1},{tp:['You',156,108]},{pan:[156,133,1]},{wait:300},{fade:'in',ms:2400},                       // 0-3 s: a dark, quiet harbor before sunrise
 {pan:[156,127,5200]},                                                                                                                                      // 3-8 s: the camera drifts up to the pier as the sky lightens
 {build:[0,1,5500]},{walks:festCrowdWalks},{crowd:'face'},                                                                                                    // 8-15 s: the village wakes: bunting and lanterns go up, villagers gather
 {pan:[156,122,2600]},{wait:400},                                                                                                                           // 15-18 s: the road lined with people
 {walks:[['Murl',156,127,300]]},{face:['Murl','u']},{pan:[156,126,1200]},                                                                                    // 18-21 s: Murl steps onto the pier
 {speak:'fest_c1',ms:3800},{cheer:2400},{wait:2400},{speak:'fest_c2',ms:4600},{cheer:2000},{wait:1800},{speak:'fest_c3',ms:3200},{cheer:3000},{pan:['back',700]}, // 21-36 s: Murl's speech and the cheering
 {walks:[['You',156,125,230]]},{face:['You','d']},                                                                                                          // 36-40 s: the crowd parts and the newest fisher walks to Murl
 {speak:'fest_c4',ms:4200},{toast:'Murl gives you the rowboat!'},{face:['Murl','d']},{wait:500},                                                             // 40-45 s: the rowboat
 {lanterns:8000},{cheer:2500},{wait:3600},                                                                                                                  // 45-49 s: lanterns float out over the water
 {fade:'out',ms:1200},{wait:1300},{light:'reset'},{bars:'off'},{tp:['You',156,126]},{face:['You','d']},{set:'festival_done'},{fade:'in',ms:900},{msg:'Walk down the pier to your boat, face it, and tap Use.'}];
SCENES.festival_opening.cine=true;
LETTERS.q1_letter={from:'A stranger',title:'Please come quick!',text:'Please come quick! Strangers are taking over the northern water temple. There is no time to waste! Hurry'};
TRIGGERS.push(
 {id:'festival_open',when:{start:1},if:{noflag:'festival_done'},do:[{set:'festival_on'},{scene:'festival_opening'}]},
 {id:'festival_down',when:{day:1},if:{flag:'festival_on'},do:[{clear:'festival_on'}]},
 {id:'letter1',when:{board:[140,105,183,135]},if:{noflag:'letter1_read'},do:[{letter:'q1_letter'},{set:'letter1_read'},{quest:['q1',0]},{msg:'A seagull brought you a letter. Read it again any time from the bag (Letters).'}]}
);

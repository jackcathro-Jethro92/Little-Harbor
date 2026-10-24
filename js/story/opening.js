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
const FEST_CROWD=['Odo','Bram','Mara','Pip','Old Tess','Yuki','Aiko','Taro','Mei','Haru','Nao'];   // the villagers who come to the festival (they fill the crowd in the opening cinematic)
// the opening cinematic itself is Jack's extended draft, drawn on its own picture (js/story/openingfilm.js): dawn and the title, the festival, Murl's speech (fest_c1 to fest_c3), the first boat (fest_c4),
// fireworks and a seagull on the boat. Afterwards (or after a tap, Skip or Escape) you are on the pier with the decorations up.
SCENES.festival_opening=[
 {film:'intro'},
 {fade:'out',ms:1},{light:'reset'},{tp:['You',156,126]},{face:['You','d']},{set:'festival_done'},{fade:'in',ms:900},{msg:'Walk down the pier to your boat, face it, and tap Use.'}];
SCENES.festival_opening.cine=true;
LETTERS.q1_letter={from:'A stranger',title:'Please come quick!',text:'Please come quick! Strangers are taking over the northern water temple. There is no time to waste! Hurry!!'};
TRIGGERS.push(
 {id:'festival_open',when:{start:1},if:{noflag:'festival_done'},do:[{set:'festival_on'},{scene:'festival_opening'}]},
 {id:'festival_down',when:{day:1},if:{flag:'festival_on'},do:[{clear:'festival_on'}]},
 {id:'letter1',when:{board:[140,105,183,135]},if:{noflag:'letter1_read'},do:[{letter:'q1_letter'},{set:'letter1_read'},{quest:['q1',0]},{msg:'A seagull brought you a letter. Read it again any time from the bag (Letters).'}]}
);

// ---------- the opening (roadmap 4.0): the sea festival, the first boat, and the first seagull letter ----------
// All the words here are PLACEHOLDERS (marked in DIALOGUE.md) until Jack writes his own, except the stranger's letter, which is Jack's own text from STORY_TEXT.md, word for word.
// The story switches it uses: festival_on (the decorations are up), festival_done (the opening has played), letter1_read (the first letter has come), then Quest 1 starts.
// How it runs: finishing the character screen of a new game fires the 'start' trigger below, which plays the scene (Skip works) and sets festival_done; the first morning after, the decorations come down; and the
// first time the player boards the boat in the village (an older save never sees the festival, it just gets the letter) a seagull brings the letter and Quest 1 appears in the quest log.
// Places are in world tile coordinates: the village plaza (156,124), the pier and Murl (161,125).
VARIANTS.push({id:'festival',flag:'festival_on',apply:on=>{FESTIVAL_ON=on}});applyVariants(true);
DLG.fest_welcome={start:'a',nodes:{a:{who:'Murl',text:'[Placeholder] Gather round, everyone! The Little Harbor Sea Festival begins!'}}};
DLG.fest_initiate={start:'a',nodes:{
 a:{who:'Murl',text:'[Placeholder] And here is our newest fisher, fresh to the harbor. Come on up!',next:'c'},
 c:{who:'Murl',text:'[Placeholder] Every fisher needs a boat. This little rowboat is yours. She is tied up at the end of the pier.',next:'d'},
 d:{who:'Murl',text:'[Placeholder] Go on, take her out. The sea is waiting.'}}};
SCENES.festival_opening=[
 {fade:'out',ms:1},{pan:[156,114,1]},{fade:'in',ms:1400},{pan:[156,120,2600]},
 {say:'fest_welcome'},{pan:['back',900]},
 {walk:['You',156,125]},{walk:['You',160,125]},{face:['You','r']},{face:['Murl','l']},
 {say:'fest_initiate'},
 {toast:'Murl gives you the rowboat!'},{set:'festival_done'},{msg:'Walk down the pier to your boat, face it, and tap Use.'}];
LETTERS.q1_letter={from:'A stranger',title:'Please come quick!',text:'Please come quick! Strangers are taking over the northern water temple. There is no time to waste! Hurry'};
TRIGGERS.push(
 {id:'festival_open',when:{start:1},if:{noflag:'festival_done'},do:[{set:'festival_on'},{scene:'festival_opening'}]},
 {id:'festival_down',when:{day:1},if:{flag:'festival_on'},do:[{clear:'festival_on'}]},
 {id:'letter1',when:{board:[140,105,183,135]},if:{noflag:'letter1_read'},do:[{letter:'q1_letter'},{set:'letter1_read'},{quest:['q1',0]},{msg:'A seagull brought you a letter. Read it again any time from the bag (Letters).'}]}
);

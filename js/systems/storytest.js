// ---------- story test switches (roadmap step 2.11): TESTING ONLY, remove before release ----------
// With TEST_STORY on, the home menu (and the ☰ menu) gets a "Test: jump to a quest" button that lists STORY_JUMPS. Tapping a row clears the story (flags, quest, letters, finished quests, seen scenes and moved
// people), applies the row (and every row it comes `after`, so Quest 3 begins with Quests 1 and 2 done), gives its items and gold, puts the player on its tile and saves. Your bag, skills and gold are kept.
// A game link ending in  ?story=q2  does the same jump when the page opens (several tries in one visit are fine). A row is
//   {id, name, after:'earlier id', quest:'q2', step:0, flags:['a','b'], give:{item:n}, gold:n, at:[x,y]}   (flags are set after the story is cleared; `at` is in world tile coordinates)
// The ten rows below carry Jack's quest titles (STORY_TEXT.md). Each is filled in (flags, items, place) when its quest is built, so that "one tap" really reaches the right state.
const TEST_STORY=true;
const STORY_JUMPS=[
 {id:'start',name:'Start of the game (clear the story)'},
 {id:'q1',name:'Quest 1: A Stranger’s Letter, Part 1',after:'start',quest:'q1',flags:['festival_done','letter1_read'],letters:['q1_letter'],at:[156,125]},
 {id:'q2',name:'Quest 2: Find the Lost Man',after:'q1',quest:'q2'},
 {id:'q3',name:'Quest 3: Merl’s Quest',after:'q2',quest:'q3'},
 {id:'q4',name:'Quest 4: A Stranger’s Letter, Part 2',after:'q3',quest:'q4'},
 {id:'q5',name:'Quest 5: Saviour of the Seas',after:'q4',quest:'q5'},
 {id:'q6',name:'Quest 6: At the Top of the World',after:'q5',quest:'q6'},
 {id:'q7',name:'Quest 7: Under Attack',after:'q6',quest:'q7'},
 {id:'q8',name:'Quest 8: Into the Depths',after:'q7',quest:'q8'},
 {id:'q9',name:'Quest 9: The Final Fight',after:'q8',quest:'q9'},
 {id:'q10',name:'Quest 10: The Returning of the Keys',after:'q9',quest:'q10'}
];
function storyReset(){S.flags={};S.story={q:null,step:0,seen:[],done:[]};S.letters=[];save();
  if(typeof applyVariants==='function')applyVariants();if(typeof applyGates==='function')applyGates();if(typeof applyStoryPeople==='function')applyStoryPeople();if(typeof applyEncounters==='function')applyEncounters()}
// the rows to apply, earliest first
const jumpChain=id=>{const out=[];for(let r=STORY_JUMPS.find(q=>q.id===id);r;r=r.after&&STORY_JUMPS.find(q=>q.id===r.after))out.unshift(r);return out};
function storyJump(id){const rows=jumpChain(id);if(!rows.length)return false;storyReset();
  rows.forEach(r=>{(r.flags||[]).forEach(f=>setFlag(f,1));(r.letters||[]).forEach(id=>{if(!hasLetter(id))myLetters().push(id)});if(r.give)Object.entries(r.give).forEach(([k,n])=>add(k,n));if(r.gold)S.gold+=r.gold;
    if(r.quest)questSet(r.quest,r.step||0);
    // earlier quests count as finished once a later one starts
    if(r.quest&&r!==rows[rows.length-1])questDone(r.quest)});
  const last=[...rows].reverse().find(r=>r.at);if(last){sail=false;P.x=P.rx=last.at[0];P.y=P.ry=last.at[1];if(typeof reveal==='function')reveal()}
  if(typeof applyStoryPeople==='function')applyStoryPeople();ui();save();return true}
function storyJumpFromLink(){if(!TEST_STORY)return;const id=new URLSearchParams(location.search).get('story');if(id&&STORY_JUMPS.some(r=>r.id===id))storyJump(id)}

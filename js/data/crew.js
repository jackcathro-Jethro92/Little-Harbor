// ---------- crew: who can sail with you, and what each ship needs ----------
// A ship's `crew:[least,most]` row in ITEMS says how many people it needs to sail (you count as one). Each CREW row below is one person who can be aboard; `flag` is the story switch that says they have joined.
// `where:'boatyard'` rows can be hired from Murl for `price` gold (taverns will use `where:'tavern'` later). Rows with no `where` join through the story (Rue, Quest 2).
const CREW=[
 {id:'rue',n:'Rue',job:'Deckhand',flag:'crew_1',desc:'Good on the ropes and fast in a fight.'},
 {id:'finn',n:'Finn',job:'Deckhand',flag:'crew_finn',where:'boatyard',price:2500,desc:'Young, strong and not afraid of the sea.'},
 {id:'marta',n:'Marta',job:'Rigger',flag:'crew_marta',where:'boatyard',price:4000,desc:'Knows every knot and every sail.'},
 {id:'ollie',n:'Ollie',job:'Gunner',flag:'crew_ollie',where:'boatyard',price:6000,desc:'Steady hands and a loud voice.'},
 {id:'nell',n:'Nell',job:'Navigator',flag:'crew_nell',where:'boatyard',price:8000,desc:'Can find the way home in any fog.'}];
const crewList=()=>CREW.filter(c=>flag(c.flag));                    // the crew who have joined you (not counting you)
const crewHave=()=>1+crewList().length;                              // you count as one
const crewNeed=id=>(ITEMS[id]&&ITEMS[id].crew?ITEMS[id].crew[0]:1);
const crewOk=id=>crewHave()>=crewNeed(id);
const crewNote=id=>ITEMS[id].n+' needs '+crewNeed(id)+' crew (you count as one). You have '+crewHave()+'.';

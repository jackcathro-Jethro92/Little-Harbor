"""Smoke test: serve the game, load it with a seeded save and check the basics.
Run: python tests/smoke_test.py [chromium] [webkit]   (default: both)
Needs: pip install playwright && python -m playwright install chromium webkit"""
import functools, http.server, json, os, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAVE = {"v": 3, "wv": 2, "look": {"skin": 0, "hair": 1, "shirt": 5, "jk": 1}, "day": 2, "gold": 10, "seen": 1, "hp": 50, "sta": 100, "xp": {},
        "granted": ["sword", "roundA", "roundB", "roundC", "roundD", "roundE", "roundF", "roundG"], "cut": {}, "placed": [], "gardens": [], "claim": None, "home": None,
        "bag": {"driftwood_rod": 1, "rowboat": 1}, "eq": {"rod": "driftwood_rod", "boat": "rowboat", "weapon": None, "pickaxe": None, "axe": None, "knife": None}}
OLD_SAVE = {"look": {"skin": 0, "hair": 1, "shirt": 5}, "day": 3, "gold": 50, "seen": 1, "inv": 4, "rod": 1, "boat": 0}  # v1 save from the small world


# clicks Attack and then the first attack you can afford (Slash, Strike or Chop)
ATTACK_JS = "(()=>{[...$('bt-menu').children].find(b=>b.textContent==='Attack').click();[...$('bt-menu').children].find(b=>!b.disabled&&b.textContent!=='Back').click()})()"


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass


def serve():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:%d/index.html" % srv.server_address[1]


def load(b, url, save):
    pg = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("response", lambda r: r.status >= 400 and r.url.startswith("http://127.0.0.1") and errs.append("%d %s" % (r.status, r.url)))
    pg.add_init_script("try{sessionStorage.setItem('lh-started','1')}catch(e){};window.__NO_SIGHT=1;window.__NO_PP=1")   # (pirates that spot you are tested on their own, near the end)
    pg.goto(url)
    pg.evaluate("s=>localStorage.setItem('little-harbor-v1',s)", json.dumps(save)); pg.reload(); pg.wait_for_timeout(400)
    return pg, errs


def check(b, url):
    pg, errs = load(b, url, SAVE)
    ev = pg.evaluate
    # playtest #3: Oak Island is haunted by four restless spirits standing on grass near the island's middle
    assert ev("(()=>{const g=ENEMIES.filter(e=>e.t==='oak_ghost');return g.length===4&&g.every(e=>at(e.x,e.y)===1&&Math.hypot(e.x-144,e.y-170)<14)})()"), "four restless spirits haunt Oak Island"
    ev("ENEMIES.forEach(e=>{e.cd=1e9})")   # (the creatures do not ambush the player during the older checks, which teleport about and would otherwise get a battle opened on them; the creature checks set their own waiting time)
    y0 = ev("P.y"); ev("move('u')"); assert ev("P.y") != y0, "player should move"
    for btn in ("#bagbtn", "#skbtn", "#mapbtn"):
        pg.tap(btn); pg.wait_for_timeout(100)
        pg.keyboard.press("Escape")
        ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    for js, sel in (("openStore('rod')", "#store"), ("openGeneral('buy')", "#store"), ("openCraft('bench')", "#craft")):
        ev(js); assert ev("s=>document.querySelector(s).classList.contains('open')", sel), js + " should open"
        ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    assert ev("[MW,WH,MH]") == [320, 240, 420]
    water = ev("(()=>{const seen=new Uint8Array(MW*MH),q=[[B.x,B.y]];seen[B.y*MW+B.x]=1;let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const i=ny*MW+nx;if(seen[i]||at(nx,ny)!==0)continue;seen[i]=1;q.push([nx,ny])}}let w=0;for(let i=0;i<M.length;i++)if(M[i]===0)w++;return q.length/w})()")
    assert water > 0.99, "sea should be one connected body"
    bad = ev("(()=>{let n=0;for(let y=0;y<MH;y+=20)for(let x=0;x<MW;x+=20){P.x=P.rx=x;P.y=P.ry=y;try{draw()}catch(e){n++}}return n})()")
    assert bad == 0, "draw() should not throw anywhere"
    # the Walled Settlement: every house door can be reached from its gate, and Garrick's forge opens
    town = ev("(()=>{const ok=new Set(WK),seen=new Set([202*MW+100]),q=[[100,202]];let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,i=ny*MW+nx;if(seen.has(i)||!ok.has(at(nx,ny)))continue;seen.add(i);q.push([nx,ny])}}const bs=BL.filter(b=>b.x>=84&&b.x<=115&&b.y>=200&&b.y<=234);return{houses:bs.length,stuck:bs.filter(b=>!seen.has((b.y+2)*MW+b.x+1)).length,people:NPC.filter(n=>n.x>=84&&n.x<=115&&n.y>=200&&n.y<=234).length}})()")
    assert town["houses"] >= 15 and town["stuck"] == 0 and town["people"] >= 15, town
    # farms: every farm gate and farmhouse door can be reached on foot from the settlement's east gate, and pets/animals stand on walkable ground
    farms = ev("(()=>{const ok=new Set(WK),seen=new Set([217*MW+117]),q=[[117,217]];let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,i=ny*MW+nx;if(seen.has(i)||!ok.has(at(nx,ny)))continue;seen.add(i);q.push([nx,ny])}}return{gates:FARMS.filter(f=>!seen.has(f.gate[1]*MW+f.gate[0])).length,doors:FARMS.filter(f=>!seen.has((f.house[1]+2)*MW+f.house[0]+1)).length,badAn:AN.filter(a=>!WK.includes(at(a.x,a.y))).length,cows:AN.filter(a=>a.k==='cow').length,dogs:AN.filter(a=>a.k==='dog').length,cats:AN.filter(a=>a.k==='cat').length}})()")
    assert farms == {"gates": 0, "doors": 0, "badAn": 0, "cows": 3, "dogs": 2, "cats": 1}, farms
    # Mountain Town: every building door reachable from its gate; guild and arena halls can be entered and left; Lucie's shop opens; a first bout can be won
    mt = ev("(()=>{const ok=new Set(WK),seen=new Set([77*MW+26]),q=[[26,77]];let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,i=ny*MW+nx;if(seen.has(i)||!ok.has(at(nx,ny)))continue;seen.add(i);q.push([nx,ny])}}const bs=BL.filter(b=>b.x>=15&&b.x<=39&&b.y>=59&&b.y<=78);return{houses:bs.length,stuck:bs.filter(b=>!seen.has((b.y+2)*MW+(b.hall?b.x+2:b.x+1))).length,people:NPC.filter(n=>n.x>=15&&n.x<=39&&n.y>=59&&n.y<=78).length}})()")
    assert mt["houses"] >= 11 and mt["stuck"] == 0 and mt["people"] >= 10, mt
    zones = ev("(()=>{const r=[];for(const[x,y,z]of[[30,74,3],[36,74,4]]){P.x=P.rx=x;P.y=P.ry=y;P.f='u';act();r.push(zoneOf(P.x,P.y)===z);P.f='d';P.x=P.rx=P.x;act();r.push(zoneOf(P.x,P.y)===0)}return r})()")
    assert zones == [True, True, True, True], zones
    ev("S.eq.weapon='sword';P.x=P.rx=36;P.y=P.ry=74;P.f='u';act();arenaStart(0);S.sta=100;AR.cd=99;for(let i=0;i<10&&AR.on;i++){P.x=P.rx=AR.x;P.y=P.ry=AR.y+1;P.f='u';act()}")
    assert ev("!AR.on&&S.arena===1"), "first arena bout should be winnable"
    ev("P.x=P.rx=B.x;P.y=P.ry=B.y;S.arena=0;S.eq.weapon=null;draw()")
    ev("openTrader('jeweller','buy')"); assert ev("/Ring of Vigor/.test($('items').textContent)"), "jeweller shop"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    # the stone barrier: no walkable shore north of the forest can be reached from the sea or the south coast, but the town, temple and Darkwood gate stay connected
    ev("setFlag('rockslide_cleared')")   # the road from the Darkwood's north gate is open for this check (the rockslide has its own test)
    seal = ev("(()=>{const ok=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],sea=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&at(x,y)===0,flood=st=>{const s=new Set(st.map(([x,y])=>y*MW+x)),q=st.slice();for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH||s.has(i)||!ok.has(at(nx,ny)))continue;s.add(i);q.push([nx,ny])}}return s},mtn=flood([[26,77]]),seeds=[];for(let y=0;y<MH;y++)for(let x=0;x<=110;x++)if(ok.has(at(x,y))&&!mtn.has(y*MW+x)&&D4.some(([a,b])=>sea(x+a,y+b)))seeds.push([x,y]);const out=flood(seeds);let landing=0,leak=0;mtn.forEach(i=>{const x=i%MW,y=(i/MW)|0;if(D4.some(([a,b])=>sea(x+a,y+b)))landing++;if(out.has(i))leak++});return{landing,leak,temple:mtn.has(29*MW+9),gate:mtn.has(109*MW+31)}})()")
    assert seal == {"landing": 0, "leak": 0, "temple": True, "gate": True}, seal
    ev("setFlag('rockslide_cleared',0)")
    # phone D-pad and keyboard move at the same speed: holding either for 1 s gives about the same number of steps
    # (always start from a long clear stretch of open land, not wherever the earlier checks left the player, which could be a wall or the water)
    ev("(()=>{sail=false;SCENE=null;BATTLE=null;ENEMIES.forEach(e=>{e.cd=1e9});window.__p0=null;outer:for(let y=60;y<230;y++)for(let x=30;x<250;x++){for(let i=0;i<30;i++)if(!walkable(x+i,y)||zoneOf(x+i,y)!==0)continue outer;window.__p0=[x,y];break outer}})()")
    assert ev("!!window.__p0"), "there is a long clear stretch of land to walk along"
    def held(start, stop):
        ev("(()=>{window.__n=0;const mv=window.__mv||(window.__mv=move);window.move=d=>{window.__n++;return mv(d)}})()")
        # both runs start on the same tile, so a wall or wanderer further along cannot skew the second one
        ev("P.x=P.rx=window.__p0[0];P.y=P.ry=window.__p0[1];P.f='r'")
        start(); pg.wait_for_timeout(1000); stop()
        n = ev("window.__n"); ev("(()=>{window.move=window.__mv})()"); return n
    kb = held(lambda: pg.keyboard.down("ArrowRight"), lambda: pg.keyboard.up("ArrowRight"))
    dp = held(lambda: ev("$('right').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))"), lambda: ev("$('right').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}))"))
    assert abs(kb - dp) <= 2 and 6 <= kb <= 20, (kb, dp)
    # movement feel: a quick tap on a new direction only turns you; a tap on the way you face moves exactly one tile; holding walks; a second key takes over and, when let go, the first carries on; letting go of all stops
    ev("sail=false;P.x=P.rx=60;P.y=P.ry=190;P.f='d';for(let y=186;y<=194;y++)for(let x=56;x<=64;x++)if(!walkable(x,y)){}")
    ok_ground = ev("(()=>{let c=0;for(let y=186;y<=194;y++)for(let x=56;x<=64;x++)if(walkable(x,y))c++;return c})()")
    if ok_ground >= 60:
        pos = lambda: ev("[P.x,P.y,P.f]")
        ev("P.x=P.rx=60;P.y=P.ry=190;P.f='d'")
        pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(50); pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(100)
        assert pos() == [60, 190, 'r'], ("tap on a new direction should only turn", pos())
        pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(60); pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(100)
        assert pos() == [61, 190, 'r'], ("tap on the facing direction should move one tile", pos())
        pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(1200); pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(100)
        assert pos()[0] >= 64 or not ev("walkable(P.x+1,P.y)"), ("holding should keep walking", pos())
        ev("P.x=P.rx=58;P.y=P.ry=190;P.f='r'")
        pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(300)
        pg.keyboard.down("ArrowDown"); pg.wait_for_timeout(500)
        x1, y1, f1 = pos(); assert f1 == 'd' and y1 > 190, ("second key should take over", pos())
        pg.keyboard.up("ArrowDown"); pg.wait_for_timeout(400)
        x2, y2, f2 = pos(); assert f2 == 'r' and x2 > x1, ("first key should carry on when the second is let go", pos(), x1)
        pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(300)
        p3 = pos(); pg.wait_for_timeout(400); assert pos() == p3, "letting go of every key must stop"
        ev("sail=false;P.x=P.rx=60;P.y=P.ry=190;P.f='u'")
        ev("$('left').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))"); pg.wait_for_timeout(50); ev("$('left').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}))"); pg.wait_for_timeout(100)
        assert pos() == [60, 190, 'l'], ("D-pad tap on a new direction should only turn", pos())
    # the Mountain Town's north gate: the gateway is open and a path leads from it up to the Temple to the Mountains using only land north of the wall
    gate = ev("(()=>{const ok=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],s=new Set([58*MW+26]),q=[[26,58]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(ny>58||s.has(i)||!ok.has(at(nx,ny)))continue;s.add(i);q.push([nx,ny])}}return{open:[25,26,27].every(x=>ok.has(at(x,59))),temple:s.has(29*MW+9)}})()")
    assert gate == {"open": True, "temple": True}, gate
    # the Earth temple: the north gate path leads up the stairs to the landing, the doorways lead into the sanctum and back out
    et = ev("(()=>{const ok=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],s=new Set([58*MW+26]),q=[[26,58]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(ny>58||s.has(i)||!ok.has(at(nx,ny)))continue;s.add(i);q.push([nx,ny])}}const r={landing:[5,6,7].every(x=>s.has(15*MW+x)),plaza:s.has(28*MW+3)||s.has(28*MW+7)};for(const x of[5,6,7]){P.x=P.rx=x;P.y=P.ry=15;P.f='u';act();r['in'+x]=zoneOf(P.x,P.y)===5;P.f='d';act();r['out'+x]=zoneOf(P.x,P.y)===0&&P.y===15}return r})()")
    assert all(et.values()), et
    # the Temple of the Sea island: from the beach the stairs lead up through every terrace to the rim, but without the stairs nothing above the beach can be reached; the crater lake is open water
    isl = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],walk=j=>WK.includes(M[j]),lvl=i=>({2:0,4:1,7:2,10:3})[TLV[i]];let st=null;for(let x=257;x<272&&st===null;x++)if(walk(36*MW+x)&&lvl(36*MW+x)===0)st=36*MW+x;const reach=ok=>{const s=new Set([st]),q=[st];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(s.has(j)||!ok(j))continue;s.add(j);q.push(j)}}return s};const all=reach(walk),no=reach(j=>walk(j)&&M[j]!==50);const tot=[0,0,0,0],got=[0,0,0,0],high=[0,0,0,0];for(let y=10;y<64;y++)for(let x=250;x<316;x++){const i=y*MW+x,l=lvl(i);if(l===undefined||!walk(i))continue;tot[l]++;if(all.has(i))got[l]++;if(no.has(i))high[l]++}return{allReachable:tot.every((n,l)=>n>20&&got[l]===n),sealedByCliffs:high[1]+high[2]+high[3]===0,lake:M[36*MW+277]===0}})()")
    assert isl == {"allReachable": True, "sealedByCliffs": True, "lake": True}, isl
    # the Temple of the Sea: rim gate, boardwalk and courtyard are walkable from the rim; the hall door leads in, the stairs lead down to the vault, and both ways back out work
    sea = ev("(()=>{const ok=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],s=new Set([44*MW+283]),q=[[283,44]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(s.has(i)||!ok.has(at(nx,ny)))continue;s.add(i);q.push([nx,ny])}}const r={boardwalk:s.has(38*MW+283),court:s.has(33*MW+283),notPool:!s.has(34*MW+283)};P.x=P.rx=283;P.y=P.ry=32;P.f='u';act();r.hall=zoneOf(P.x,P.y)===6;P.x=P.rx=237;P.y=P.ry=31+224;P.f='u';act();r.vault=zoneOf(P.x,P.y)===7;P.f='d';act();r.up=zoneOf(P.x,P.y)===6;P.x=P.rx=237;P.y=P.ry=258;P.f='d';act();r.out=zoneOf(P.x,P.y)===0;return r})()")
    assert all(sea.values()), sea
    # the Temple to the Sky's island: from the south-west beach the zigzag route climbs through four terraces to the plateau, and without the five stairways nothing above the lowland is reachable;
    # lanterns are 5 or 6 tiles apart; the lowland forest has trees but the hill and plateau have none
    sky = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],walk=j=>WK.includes(M[j]),lvl=i=>({2:0,3:1,4:2,6:3,8:4,10:5})[TLV[i]],st=155*MW+222;const reach=ok=>{const s=new Set([st]),q=[st];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(s.has(j)||!ok(j))continue;s.add(j);q.push(j)}}return s};const all=reach(walk),no=reach(j=>walk(j)&&M[j]!==50);let up=0,hillTrees=0,lowTrees=0,tot=[0,0,0,0,0,0],got=[0,0,0,0,0,0];for(let y=100;y<176;y++)for(let x=205;x<284;x++){const i=y*MW+x,l=lvl(i);if(l===undefined)continue;if(l>=1&&no.has(i))up++;if(M[i]===4){if(l>=1)hillTrees++;else lowTrees++}if(walk(i)){tot[l]++;if(all.has(i))got[l]++}}const gaps=[];SKY_LAN.forEach((l,i)=>{if(i)gaps.push(l.d-SKY_LAN[i-1].d)});return{plateau:all.has(120*MW+236),temple:all.has(123*MW+236)&&all.has(110*MW+236)&&all.has(105*MW+236)&&!walk(108*MW+235)&&!walk(108*MW+236)&&!walk(123*MW+234)&&!walk(123*MW+238)&&!walk(101*MW+236)&&(()=>{let n=0;for(let y=98;y<126;y++)for(let x=226;x<248;x++)if([78,79,80,81].includes(M[y*MW+x]))n++;return n>=55})(),terraces:[1,2,3,4].every(l=>got[l]===tot[l]&&tot[l]>50)&&got[5]>=tot[5]*.9,sealed:up===0,lanterns:SKY_LAN.length>=15,spacing:gaps.every(g=>g===5||g===6),forest:lowTrees>150&&hillTrees===0}})()")
    assert all(sky.values()), sky
    # the Temple of Fire's volcano island and temple: from the black-sand landing the slab path leads over the marble bridge, through the gate's middle gateway and up through the courtyard to the fire hall's door,
    # which leads in and back out; lava, peaks, the gate's side arches and the basin block; there are tents but no houses on the island
    fire = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],walk=j=>WK.includes(M[j]),st=46*MW+71,s=new Set([st]),q=[st];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(s.has(j)||!walk(j))continue;s.add(j);q.push(j)}}let lava=0,peaks=0,crater=0;for(let y=0;y<60;y++)for(let x=40;x<105;x++){const m=M[y*MW+x];if(m===84)lava++;if(m===86)peaks++;if(m===87)crater++}const r={bridge:s.has(37*MW+71),gate:!walk(35*MW+71)&&!walk(35*MW+67)&&!walk(35*MW+75),court:!walk(32*MW+71),moatBlocks:!walk(37*MW+66)&&!walk(38*MW+76),lava:lava>200,peaks:peaks>100,crater:crater>5,reef:REEF.size>300,emptyCamp:!BL.some(b=>b.tent||b.ship)&&!NPC.some(n=>n.pirate)&&BL.some(b=>b.decor==='coldfire')&&!flag('pirates_here'),noHouses:!BL.some(b=>b.roof&&b.x>=50&&b.x<=95&&b.y>=8&&b.y<=48)};P.x=P.rx=71;P.y=P.ry=37;P.f='u';act();r.gateIn=zoneOf(P.x,P.y)===9;P.x=P.rx=177;P.y=P.ry=PG.y0+1;P.f='u';act();r.hall=zoneOf(P.x,P.y)===8&&P.x===196&&P.y===PH.y1-1;P.f='d';act();r.hallBack=zoneOf(P.x,P.y)===9&&P.x===177&&P.y===PG.y0+1;P.x=P.rx=177;P.y=P.ry=PG.y1-1;P.f='d';act();r.gateBack=zoneOf(P.x,P.y)===0&&P.y===37;return r})()")
    assert all(fire.values()), fire
    # the pirates arrive overnight once a quest has called them: nothing before, then ten pirates, three ships, tents and a lit fire; undoing it leaves the empty camp; the flag is saved
    ev("setFlag('pirates_called',1);sail=true;sleep()")
    pir = ev("({here:flag('pirates_here'),npc:NPC.filter(n=>n.pirate).length,ships:BL.filter(b=>b.ship).length,tents:BL.filter(b=>b.tent).length,fire:BL.some(b=>b.decor==='campfire'),cold:!BL.some(b=>b.decor==='coldfire'),saved:JSON.parse(localStorage.getItem('little-harbor-v1')||'{}').flags.pirates_here===1,named:LAND.some(l=>l[0]==='Pirate Island')})")
    assert pir["here"] and pir["npc"] == 10 and pir["ships"] == 3 and pir["tents"] >= 5 and pir["fire"] and pir["cold"] and pir["saved"] and pir["named"], pir
    ev("applyPirates(false)"); assert ev("!BL.some(b=>b.tent||b.ship)&&!NPC.some(n=>n.pirate)&&BL.some(b=>b.decor==='coldfire')&&LAND.some(l=>l[0]==='Volcano Island')"), "empty camp again"
    ev("S.flags={};sail=false;P.x=P.rx=B.x;P.y=P.ry=B.y;draw()")
    ev("applyPirates(true);for(const[x,y]of[[70,28],[87,25],[94,25],[88,30]]){sail=false;P.x=P.rx=x;P.y=P.ry=y;draw()};applyPirates(false)")
    # the Temple Tower's island: the old islet is gone, the stone dock in the north joins the gravel path, which runs south to the clearing (walkable all the way), lanterns line it every four tiles, pines block
    tow = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],ok=new Set(WK);let by=0;for(let y=224;y>150;y--)if(at(212,y)===105)by=y;const s=new Set([by*MW+212]),q=[by*MW+212];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(!s.has(j)&&ok.has(M[j])){s.add(j);q.push(j)}}}"
            "return {beach:by>0&&by<=175&&at(212,by-1)===0,clearing:s.has(194*MW+212)&&s.has(194*MW+205)&&s.has(194*MW+219),noPlaceholder:!BL.some(b=>b.tower),lanterns:TOWER_LAN.length>=6&&TOWER_LAN.every(l=>at(l.x,l.y)===7),pines:at(190,196)===102||[...Array(200)].some((_,k)=>at(190+k%20,190+(k/20|0))===102),pineBlocks:!WK.includes(102),clearOfPines:!(()=>{for(let y=195;y<=208;y++)for(let x=203;x<=221;x++)if(at(x,y)===102)return true;return false})(),belowZones:LAND.some(l=>l[0]==='Temple Tower'&&l[2]<224)}})()")
    assert all(tow.values()), tow
    ev("for(const[x,y]of[[212,174],[212,185],[212,194],[205,200],[198,196],[212,210]]){sail=false;P.x=P.rx=x;P.y=P.ry=y;draw()}")
    # the Temple Tower: from the dock the gate, courtyard and both sides of the pagoda are walkable, the pagoda blocks, its south door leads into the shrine room and the shrine room door leads back out
    tt = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],ok=new Set(WK);let by=0;for(let y=224;y>150;y--)if(at(212,y)===105)by=y;const s=new Set([by*MW+212]),q=[by*MW+212];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(!s.has(j)&&ok.has(M[j])){s.add(j);q.push(j)}}}"
            "const r={gate:s.has(195*MW+212),courtyard:s.has(196*MW+204)&&s.has(208*MW+220),west:s.has(202*MW+206),east:s.has(202*MW+218),door:s.has(205*MW+212),pagodaBlocks:!s.has(202*MW+212)&&!s.has(204*MW+212),wallBlocks:!s.has(195*MW+205),gate2:BL.some(b=>b.towergate)&&BL.some(b=>b.pagoda)};"
            "sail=false;P.x=P.rx=212;P.y=P.ry=205;P.f='u';act();r.in=zoneOf(P.x,P.y)===10;r.floor=at(P.x,P.y)===108;r.stands=[...Array(11*10)].filter((_,k)=>at(TS.x0+k%11,TS.y0+(k/11|0))===114).length===4;P.f='d';act();r.out=zoneOf(P.x,P.y)===0&&P.x===212&&P.y===205;return r})()")
    assert all(tt.values()), tt
    ev("for(const[x,y,f]of[[212,192,'d'],[212,199,'d'],[206,203,'d'],[212,207,'u']]){sail=false;P.x=P.rx=x;P.y=P.ry=y;P.f=f;draw()};sail=false;P.x=P.rx=212;P.y=P.ry=205;P.f='u';act();draw();P.f='d';act();draw()")
    # the damaged Sky temple: off it matches the normal temple; on it has the split stone with stairs, smoke and toppled stones, the temple stays reachable from the avenue, and off puts everything back
    sk0 = ev("(()=>{window.__a=[];for(let y=96;y<=128;y++)for(let x=218;x<=254;x++)window.__a.push(at(x,y));return window.__a.length})()")
    ev("applySky(true)")
    skd = ev("(()=>{const D4=[[1,0],[-1,0],[0,1],[0,-1]],ok=new Set(WK);const s=new Set([125*MW+236]),q=[125*MW+236];for(let h=0;h<q.length;h++){const i=q[h],x=i%MW,y=(i/MW)|0;for(const[a,b]of D4){const j=(y+b)*MW+x+a;if(!s.has(j)&&ok.has(M[j])){s.add(j);q.push(j)}}}"
            "let toppled=0;for(let y=96;y<=128;y++)for(let x=218;x<=254;x++)if(at(x,y)===121)toppled++;"
            "return {split:at(235,108)===117&&at(236,108)===119&&at(237,108)===118,stairsBlock:!WK.includes(119)&&!WK.includes(117),smoke:BL.filter(b=>b.skysmoke).length===2,toppled:toppled>=6,reach:s.has(109*MW+236)&&s.has(111*MW+236)&&s.has(105*MW+236),scorch:at(236,109)===120&&WK.includes(120)&&WK.includes(122)}})()")
    assert all(skd.values()), skd
    ev("for(const[x,y]of[[236,113],[236,104],[230,108],[242,110]]){sail=false;P.x=P.rx=x;P.y=P.ry=y;draw()}")
    ev("applySky(false)")
    assert ev("(()=>{let k=0;for(let y=96;y<=128;y++)for(let x=218;x<=254;x++)if(at(x,y)!==window.__a[k++])return false;return !BL.some(b=>b.skydmg)})()"), "undamaged temple restored exactly"
    # N3: the woodcutters' cottage moved from (39,158) to (34,158); the dirt road from the Walled Settlement to the Darkwood's south gate runs unbroken and the cottage door is reachable
    cot = ev("(()=>{const W=new Set(WK),s=new Set([160*MW+37]),q=[[37,160]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=(y+b)*MW+x+a;if(!s.has(i)&&W.has(at(x+a,y+b))){s.add(i);q.push([x+a,y+b])}}}"
            "return {moved:BL.some(b=>b.x===34&&b.y===158)&&!BL.some(b=>b.x===39&&b.y===158),door:s.has(160*MW+35),road:[40,41,42].every(x=>s.has(158*MW+x)||at(x,158)===6),gate:s.has(150*MW+36)}})()")
    assert all(cot.values()), cot
    # NAMES.md and DIALOGUE.md must match the game: if a character or a line was added (or JACKS_LINES.txt changed) without running  python3 tools/make_lists.py  this fails
    sys.path.insert(0, os.path.join(ROOT, "tools")); import make_lists
    pgl, _ = load(b, url, SAVE); lbase = pgl.evaluate(make_lists.JS); ldlg_tab = pgl.evaluate(make_lists.JS_DLG); pgl.evaluate("applyPirates(true)"); lpir = pgl.evaluate(make_lists.JS); pgl.close()
    lnames, ldlg = make_lists.build(lbase, lpir, ldlg_tab)
    assert lnames == open(os.path.join(ROOT, "NAMES.md"), encoding="utf-8").read(), "NAMES.md is out of date: run  python3 tools/make_lists.py  and commit the result"
    assert ldlg == open(os.path.join(ROOT, "DIALOGUE.md"), encoding="utf-8").read(), "DIALOGUE.md is out of date: run  python3 tools/make_lists.py  and commit the result"
    # Astrid the apothecary (Walled Settlement) sells potions and poisons; the boatyard owner is Murl; Mountain Town's old Astrid is now Solveig; no two people share a name
    ap = ev("(()=>{const a=NPC.find(n=>n.n==='Astrid'),sh=BL.find(b=>b.sign==='apothecary'),names=NPC.map(n=>n.n);return {one:NPC.filter(n=>n.n==='Astrid').length===1,inTown:!!a&&a.shopRoom==='apothecary'&&zoneOf(a.x,a.y)>=30,shop:!!sh&&ENTR.some(e=>e.to==='shop_apothecary'&&e.x===sh.x+1&&e.y===sh.y+1),door:!!sh&&WK.includes(at(sh.x+1,sh.y+2)),walls:[0,1].every(j=>[0,1,2].every(i=>at(sh.x+i,sh.y+j)===5)),murl:!!NPC.find(n=>n.n==='Murl'&&n.store==='boat')&&!NPC.some(n=>n.n==='Captain Rue'),solveig:names.includes('Solveig'),unique:new Set(names.filter(n=>!/fan|Warden|Guard/.test(n))).size===names.filter(n=>!/fan|Warden|Guard/.test(n)).length}})()")
    assert all(ap.values()), ap
    # shop rooms (batch G1): walk in from the street, the shopkeeper stands behind the counter, talk across it, walk out
    assert ev("INTR.length===Object.keys(INTERIOR_DESIGNS).length+SHOP_ROOMS.length+SHOP_ROOMS.reduce((a,s)=>a+(s.inn?s.inn.length:0),0)&&INTR.every(r=>at(r.dx,r.y1)===23&&zoneOf(r.dx,r.y1-1)===r.z&&r.z>=30)"), "every design is built as a room with a door in its bottom row"
    assert ev("SHOP_ROOMS.every(s=>{const n=NPC.find(q=>q.n===s.npc);return n&&n.shopRoom===s.id&&zoneOf(n.x,n.y)===s.room.z&&!INTBLK[n.y*MW+n.x]&&n.f==='d'})&&SHOP_ROOMS.length===11"), "all eleven shopkeepers stand inside their rooms"
    assert ev("SHOP_ROOMS.every(s=>{const r=s.room,tb=r.props.find(p=>p.id===s.table),seen=new Set([r.dx+','+(r.y1-1)]),q=[[r.dx,r.y1-1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(!seen.has(k)&&walkable(x+a,y+b)&&zoneOf(x+a,y+b)===r.z){seen.add(k);q.push([x+a,y+b])}}}return seen.has((tb.ax+(tb.w>>1))+','+(tb.ay+tb.h))})"), "from the door you can walk to the front of every shop's counter"
    assert ev("(()=>{const r=SHOP_ROOMS.find(q=>q.id==='smith').room,tb=r.props.find(p=>p.id==='counter4'),rug=r.props.find(p=>p.flat);return !walkable(tb.ax,tb.ay)&&!!rug&&walkable(rug.ax,rug.ay)&&r.props.some(p=>!p.flat&&INTBLK[p.ay*MW+p.ax]===1)})()"), "counters and furniture are in the way, but rugs are not"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));SCENE=null;BATTLE=null;sail=false;P.x=P.rx=91;P.y=P.ry=217;P.f='u';act()")
    assert ev("zoneOf(P.x,P.y)>=30&&intrOf(P.x,P.y).key==='shop_apothecary'&&P.x===intrOf(P.x,P.y).dx&&P.y===intrOf(P.x,P.y).y1-1"), "facing the shop's door and pressing Use walks you into its room"
    ev("(()=>{const a=NPC.find(n=>n.n==='Astrid');P.x=P.rx=a.x;P.y=P.ry=a.y+2;P.f='u';act()})()"); assert ev("$('menu').classList.contains('open')&&/Astrid/.test($('menu-t').textContent)&&mn.opts.join()==='Buy,Sell,Cancel'"), "pressing Use at the counter talks to the shopkeeper behind it"
    ev("$('menu').classList.remove('open');mn=null;(()=>{const r=intrOf(P.x,P.y);P.x=P.rx=r.dx;P.y=P.ry=r.y1-1;P.f='d';act()})()"); assert ev("zoneOf(P.x,P.y)===0&&P.x===91&&P.y===217"), "facing the door from inside leads back out to the street"
    assert ev("(()=>{let bad=0;INTR.forEach(r=>{visitRoom(r);try{draw()}catch(e){bad++}});sail=false;P.x=P.rx=91;P.y=P.ry=217;return bad})()") == 0, "every room draws without errors (props, floors, walls and light)"
    ev("S.gold=1000;S.bag.healing_potion=0;P.x=P.rx=91;P.y=P.ry=218;P.f='u';act();document.querySelectorAll('#menu button,#menu .opt').forEach(()=>{});openTrader('apothecary','buy')")
    assert ev("/Healing potion/.test($('items').textContent)&&/Poison vial/.test($('items').textContent)&&/Swiftness/.test($('items').textContent)"), "apothecary stock"
    ev("[...document.querySelectorAll('#items .it')].find(r=>/^Healing potion/.test(r.textContent)).querySelector('button').click()")
    assert ev("[S.gold,S.bag.healing_potion]") == [940, 1], "buying a healing potion costs 60"
    ev("openTrader('apothecary','sell')"); assert ev("/Healing potion x1/.test($('items').textContent)"), "she buys potions back"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    # ore: only in the mountain country (x<100, y<100), few of them, gold and silver rare, every outcrop reachable on foot from the Mountain Town's north gate; gold is mined, regrows slowly and is sold (not bought) at Garrick's
    ore = ev("(()=>{const c={},out=[];for(let y=0;y<WH;y++)for(let x=0;x<MW;x++){const t=at(x,y);if(ORE[t]){c[t]=(c[t]||0)+1;if(x>=100||y>=100)out.push([x,y])}}"
             "const W=new Set(WK),s=new Set([57*MW+26]),q=[[26,57]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=(y+b)*MW+x+a;if(!s.has(i)&&W.has(at(x+a,y+b))&&y+b<100){s.add(i);q.push([x+a,y+b])}}}"
             "const lost=[...ORE_AT].filter(i=>![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>s.has(i+b*MW+a))).length;"
             "return {c,out:out.length,lost,total:Object.values(c).reduce((a,b)=>a+b,0)}})()")
    assert ore["out"] == 0 and ore["lost"] == 0 and 30 <= ore["total"] <= 45, ore
    assert ore["c"].get("123", 0) == 3 and 3 <= ore["c"].get("124", 0) <= 5 and ore["c"]["15"] > ore["c"]["17"] > ore["c"]["123"], ore
    g = ev("[...ORE_AT].map(i=>[i%MW,(i/MW)|0]).find(([x,y])=>at(x,y)===123)")
    ev(f"S.eq.pickaxe='iron_pickaxe';S.bag.iron_pickaxe=1;S.sta=100;sail=false;P.x=P.rx={g[0]};P.y=P.ry={g[1]+1};P.f='u';S.bag.gold_ore=0;for(let i=0;i<8&&at({g[0]},{g[1]})===123;i++){{S.sta=100;act()}}")
    assert ev(f"[S.bag.gold_ore>=1,at({g[0]},{g[1]})===18,S.cut[{g[1]}*MW+{g[0]}].m]") == [True, True, 123], "gold can be mined"
    assert ev("REGROW(123)>REGROW(124)&&REGROW(124)>REGROW(15)"), "rarer ore regrows slower"
    ev("openTrader('smith','buy')"); assert ev("!/Gold ore/.test($('items').textContent)"), "Garrick must not sell gold"
    ev("S.bag.gold_ore=2;openTrader('smith','sell')"); assert ev("!/Gold ore/.test($('items').textContent)"), "Garrick no longer buys gold (the goldsmith does, playtest #4)"
    ev("openTrader('jeweller','buy')"); assert ev("!/Gold ore/.test($('items').textContent)"), "Lucie does not sell gold ore"
    ev("openTrader('jeweller','sell')"); assert ev("/Gold ore x2/.test($('items').textContent)&&/Sells for 200g/.test($('items').textContent)"), "Lucie buys gold ore for half its old price"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    pgo, erro = load(b, url, dict(SAVE, cut={str(104 * 320 + 142): {"m": 17, "d": 1}}))   # an old ore record at a spot that no longer has ore (it was on the village island)
    assert pgo.evaluate("!S.cut[104*MW+142]&&at(142,104)!==18"), "old ore records elsewhere are dropped"
    pgo.close()
    # foraging: mushrooms and forest sprigs grow only in the Darkwood and only a few; all of them can be reached from its south gate; one can be picked; old records outside the wood are dropped
    ev("setFlag('forest_boulder_open')")   # (the forest's east trail is shut by a boulder until the pickaxe opens it: open it for the reach check)
    fg = ev("(()=>{const c={},out=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=at(x,y);if(t>=27&&t<=30){c[t]=(c[t]||0)+1;if(!inFZ(x,y))out.push([x,y])}}"
            "const W=new Set(WK),sx=123,sy=38+FY,s=new Set([sy*MW+sx]),q=[[sx,sy]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=(y+b)*MW+x+a;if(!s.has(i)&&W.has(at(x+a,y+b))){s.add(i);q.push([x+a,y+b])}}}"
            "let far=0;for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=at(x,y);if(t>=27&&t<=30&&!s.has(y*MW+x))far++}"
            "return {c,out:out.length,far,total:Object.values(c).reduce((a,b)=>a+b,0)}})()")
    assert fg["out"] == 0 and fg["far"] == 0 and 60 <= fg["total"] <= 100 and all(fg["c"].get(str(k), 0) >= 10 for k in (27, 28, 29, 30)), fg
    ev("setFlag('forest_boulder_open',0)")
    ev("S.eq.knife='knife';S.bag.knife=1;S.sta=100;ENEMIES.forEach(e=>{if(e.t==='centipede'){e.alive=false;e.resp=1e9}})")   # (a Darkwood centipede wandering onto the mushroom would be struck instead of the mushroom picked; the centipede check wakes them later)
    pick = ev("(()=>{let f=null;for(let y=FZ.y0;y<=FZ.y1&&!f;y++)for(let x=FZ.x0;x<=FZ.x1;x++)if(at(x,y)===28){f=[x,y];break}sail=false;P.x=P.rx=f[0];P.y=P.ry=f[1]+1;if(!WK.includes(at(P.x,P.y))){P.y=P.ry=f[1]-1;P.f='d'}else P.f='u';S.bag.red_cap=0;act();return [S.bag.red_cap>=1,at(f[0],f[1])===31]})()")
    assert pick == [True, True], "a red cap can be picked in the Darkwood"
    pgf, errf = load(b, url, dict(SAVE, cut={str(104 * 320 + 142): {"m": 28, "d": 1}}))
    assert pgf.evaluate("!S.cut[104*MW+142]"), "old mushroom records outside the Darkwood are dropped"
    pgf.close()
    # graphics 1.1: ground and water are drawn from a cache; the cache fills as tiles are drawn, can be emptied (groundDirty) and rebuilds itself, and the pirates' ships/damaged temple switches empty it
    gc = ev("(()=>{sail=false;P.x=P.rx=156;P.y=P.ry=113;draw();const a=GCACHE.size;groundDirty();const z=GCACHE.size;draw();const b=GCACHE.size;applyPirates(true);const c=GCACHE.size;draw();applyPirates(false);return {filled:a>100,emptied:z===0,refilled:b>100,pirateClears:c===0}})()")
    assert all(gc.values()), gc
    # graphics 1.2: trees and plants come from the sprite cache (the same picture is reused), shaking a tree still moves it, every herb, mushroom, flax and tall-grass tile draws
    sp = ev("(()=>{sail=false;P.x=P.rx=36;P.y=P.ry=140;draw();const a=SPRC.size;for(const m of[19,20,24,25,26,27,28,29,30,31,47]){const i=(P.y-1)*MW+P.x,keep=M[i];M[i]=m;draw();M[i]=keep}draw();return {cached:a>=3&&a<=400,plants:SPRC.size>a}})()")
    assert all(sp.values()), sp
    # graphics 1.3: every house and shop (all roofs and signs) comes from a cached picture and draws without errors
    hb = ev("(()=>{sail=false;let n=0;const kinds=new Set();for(const b of BL){if(b.hall||b.tent||b.col||b.tower||b.decor||b.ship||b.mayan||b.knossos||b.skygate||b.firegate||b.firehall||b.towergate||b.pagoda||b.skysmoke||b.w!==3||!b.roof)continue;kinds.add(b.roof+'|'+(b.sign||''));P.x=P.rx=b.x+1;P.y=P.ry=b.y+4;draw();n++}return {n,kinds:kinds.size,cached:[...SPRC.keys()].filter(k=>k[0]==='h').length>=10}})()")
    assert hb["n"] >= 40 and hb["kinds"] >= 10 and hb["cached"], hb
    # graphics 1.4: people are shaded once and cached (same picture reused), all three boats draw sailing in every direction and moored, animals, chickens and the spirit draw, and every hair style still draws
    pe = ev("(()=>{sail=false;P.x=P.rx=156;P.y=P.ry=113;draw();const a=PCACHE.size;draw();const b=PCACHE.size;let ok=true;try{for(const id of LIST('boat')){S.eq.boat=id;for(const d of['u','d','l','r']){sail=true;P.x=P.rx=B.x=172;P.y=P.ry=B.y=190;P.f=d;draw()}sail=false;draw()}"
            "for(const a of AN.slice(0,4)){P.x=P.rx=a.x;P.y=P.ry=a.y+1;draw()}G.alive=true;P.x=P.rx=G.x;P.y=P.ry=G.y+1;draw()}catch(e){ok=false}S.eq.boat='rowboat';return {cached:a>5&&b===a,ok,boats:['ship0r','ship1u','ship2l','ship3d'].every(k=>[...SPRC.keys()].some(q=>q.startsWith(k)))&&LIST('boat').join()==='rowboat,sloop,schooner,brig'}})()")
    assert all(pe.values()), pe
    # graphics 1.5: every object tile (lantern, fence, barrel, gravestone, stump, rubble, treasure, five ores, pond, crop plot, wall) and every station and garden stage draws; the wall and the gold ore never share a picture
    ob = ev("(()=>{sail=false;P.x=P.rx=156;P.y=P.ry=113;let ok=true;try{const i=(P.y-1)*MW+P.x,keep=M[i];for(const m of[7,8,9,10,11,12,13,14,15,16,17,18,46,123,124]){M[i]=m;draw()}M[i]=keep;"
            "const ps=S.placed,gs=S.gardens;S.placed=['camp_kit','alchemy_station','shipwright','cooking_station','standard_bench','forge'].map((id,k)=>({id,x:P.x-3+k,y:P.y-2}));S.gardens=[{x:P.x,y:P.y+2,cells:[0,1,2,3,4,5,6,7,8].map(k=>({c:['carrot','potato','cabbage'][k%3],d:S.day-k}))}];draw();S.placed=ps;S.gardens=gs}catch(e){ok=false}"
            "return {ok,sprites:[...SPRC.keys()].some(k=>k.startsWith('wall'))&&[...SPRC.keys()].some(k=>k==='o123')}})()")
    assert all(ob.values()), ob
    # graphics 1.6: the Darkwood (floor, thick trees, trail, fireflies) and the home room (floor, rug, wall, window, door) draw everywhere inside them, and the guild and arena rooms that share the home tiles still draw
    iw = ev("(()=>{let ok=true,n=0;try{sail=false;for(let y=FZ.y0;y<=FZ.y1;y+=3)for(let x=FZ.x0;x<=FZ.x1;x+=4){P.x=P.rx=x;P.y=P.ry=y;draw();n++}"
            "for(let y=IR.y0;y<=IR.y1;y+=2)for(let x=IR.x0;x<=IR.x1;x+=2){P.x=P.rx=x;P.y=P.ry=y;draw();n++}P.x=P.rx=GZ.dx;P.y=P.ry=GZ.y1-1;draw();P.x=P.rx=AZ.dx;P.y=P.ry=AZ.y1-1;draw()}catch(e){ok=false}return {ok,n:n>60}})()")
    assert all(iw.values()), iw
    # graphics 1.7: the day cycle goes dark and light again, sleeping brings the morning, the tint and glow draw outdoors and indoors, ?time=night freezes the time, and nothing is saved
    li = ev("(()=>{const r={};let ok=true;try{dayStart=performance.now()-DAY_MS*.8;r.night=daylight().dark>.9;dayStart=performance.now()-DAY_MS*.3;r.day=daylight().dark===0;lightMorning();r.morning=daylight().dark===0&&daylight().warm<.6;"
            "dayStart=performance.now()-DAY_MS*.8;sail=false;for(const[x,y]of[[156,113],[100,219],[212,178],[IR.dx,IR.dy-1],[FZ.x0+23,FZ.y0+30]]){P.x=P.rx=x;P.y=P.ry=y;draw()}lightMorning()}catch(e){ok=false}r.ok=ok;r.unsaved=!JSON.stringify(S).includes('dayStart');return r})()")
    assert all(li.values()), li
    pgt, errt = load(b, url + "?time=night", SAVE)
    assert pgt.evaluate("daylight().dark===1&&FORCE_TIME==='night'"), "?time=night"
    pgt.close()
    # ships: an old save that owned and used the trawler now has the schooner, and the shipwright can build the schooner and the brig
    old2 = json.loads(json.dumps(SAVE)); old2["bag"] = dict(SAVE.get("bag", {}), trawler=1); old2["eq"] = dict(SAVE.get("eq", {}), boat="trawler")
    pgs, errs2 = load(b, url, old2)
    shp = pgs.evaluate("({schooner:S.bag.schooner===1,noTrawler:S.bag.trawler===undefined,eq:S.eq.boat==='schooner',tier:tier('boat')===2,recipes:['schooner','brig'].every(id=>RECIPES.some(r=>r.out===id&&r.station==='shipwright')),crew:ITEMS.brig.crew[0]===3&&ITEMS.rowboat.crew[1]===1})")
    assert all(shp.values()) and not errs2, (shp, errs2)
    pgs.close()
    # prices and crew: the testing prices are off (sloop 25,000, schooner 40,000, brig 80,000); each ship needs crew (you count as one); Murl hires sailors; a ship you lack crew for can't be used or boarded
    ev("S.gold=1000000;S.bag.sloop=0;S.bag.schooner=0;S.bag.brig=0;S.eq.boat='rowboat';S.flags={};openStore('boat')")
    assert ev("!BOAT_TEST&&ITEMS.sloop.price===25000&&ITEMS.schooner.price===40000&&ITEMS.brig.price===80000"), "boat prices"
    assert ev("crewHave()===1&&crewOk('rowboat')&&crewOk('sloop')&&!crewOk('schooner')&&!crewOk('brig')"), "alone you can sail the rowboat and sloop only"
    ev("document.querySelectorAll('#items .it button').forEach(b=>{if(/^40,000g$/.test(b.textContent))b.click()})")
    assert ev("S.bag.schooner===1&&S.gold===960000&&S.eq.boat==='rowboat'"), "buying a ship you lack crew for keeps the old boat"
    ev("openStore('boat')")
    assert ev("(()=>{const r=[...document.querySelectorAll('#items .it')].find(x=>/^Schooner/.test(x.innerText));return /Need 2 crew/.test(r.innerText)&&r.querySelector('button').disabled})()"), "Use is blocked with no crew"
    ev("sail=false;S.eq.boat='schooner';B.x=P.x+1;B.y=P.y;P.f='r';act()")
    assert ev("!sail"), "can't board without enough crew"
    ev("S.eq.boat='rowboat';openStore('boat');[...document.querySelectorAll('#items .it')].filter(x=>/^Finn/.test(x.innerText)).forEach(x=>x.querySelector('button').click())")
    assert ev("flag('crew_finn')&&crewHave()===2&&S.gold===957500&&crewOk('schooner')&&!crewOk('brig')"), "hiring Finn at the boatyard"
    ev("document.querySelectorAll('#items .it').forEach(x=>{if(/^(Marta|Ollie|Nell)/.test(x.innerText))x.querySelector('button').click()});S.eq.boat='schooner';sail=false;B.x=P.x+1;B.y=P.y;P.f='r';act()")
    assert ev("crewHave()===5&&crewOk('brig')&&sail"), "with enough crew you can board"
    ev("openCharacter()"); assert ev("/Crew/.test($('ch-info').innerText)"), "the summary shows the crew"
    ev("closeCharacter();S.flags={};S.eq.boat='rowboat';sail=false")
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    # ships' insides: 9 rooms (deck, quarters, storage for the sloop, schooner and brig) with every door, crate, bed and wheel reachable; bigger ships have more room, crates and storage; the helm, the doors, sleeping and the storage work
    sh = ev("(()=>{const W=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],r={};const reach=(R,sx,sy)=>{const s=new Set([sy*MW+sx]),q=[[sx,sy]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(!s.has(i)&&nx>=R.x0&&nx<=R.x1&&ny>=R.y0&&ny<=R.y1&&W.has(at(nx,ny))){s.add(i);q.push([nx,ny])}}}return s};"
            "r.rooms=SHIPNAMES.every(sn=>['deck','quarters','storage'].every(k=>SHIPR[sn][k]&&zoneOf(SHIPR[sn][k].dx,SHIPR[sn][k].y0+1)===SHIPR[sn][k].z));"
            "r.reach=SHIPNAMES.every(sn=>['deck','quarters','storage'].every(k=>{const R=SHIPR[sn][k],s=reach(R,R.dx,k==='deck'?R.y1-2:R.y1-1);const have={},seen={};for(let y=R.y0;y<=R.y1;y++)for(let x=R.x0;x<=R.x1;x++){const t=at(x,y);if([23,128,129,130].includes(t)){seen[t]=1;if(D4.some(([a,b])=>s.has((y+b)*MW+x+a)))have[t]=(have[t]||0)+1;else if(t===23)have[t]=-99}}return Object.keys(seen).every(t=>have[t]>0)}));"
            "const crates=sn=>{let n=0;const R=SHIPR[sn].storage;for(let y=R.y0;y<=R.y1;y++)for(let x=R.x0;x<=R.x1;x++)if(at(x,y)===130)n++;return n};"
            "r.bigger=crates('sloop')<crates('schooner')&&crates('schooner')<crates('brig')&&ITEMS.sloop.store<ITEMS.schooner.store&&ITEMS.schooner.store<ITEMS.brig.store&&SHIPR.sloop.quarters.w<SHIPR.brig.quarters.w;"
            "r.noRowboat=shipLevel()===-1&&!shipHidesPlayer();return r})()")
    assert all(sh.values()), sh
    flow = ev("(()=>{const r={};S.gold=5000;for(const id of['sloop','schooner','brig']){S.bag[id]=1}S.eq.boat='schooner';sail=true;P.x=P.rx=B.x=172;P.y=P.ry=B.y=190;P.f='d';ui();r.deckBtn=$('deck').style.visibility==='visible';r.hidden=shipHidesPlayer();"
              "boardDeck();const D=SHIPR.schooner.deck,Q=SHIPR.schooner.quarters,St=SHIPR.schooner.storage;r.onDeck=zoneOf(P.x,P.y)===D.z&&!sail;"
              "P.x=P.rx=D.dx-2;P.y=P.ry=D.y0+2;P.f='u';act();r.toQuarters=zoneOf(P.x,P.y)===Q.z;P.f='d';act();r.backDeck=zoneOf(P.x,P.y)===D.z;"
              "P.x=P.rx=D.dx+2;P.y=P.ry=D.y0+2;P.f='u';act();r.toStorage=zoneOf(P.x,P.y)===St.z;P.f='d';act();r.backDeck2=zoneOf(P.x,P.y)===D.z;"
              "const bed=(()=>{for(let y=Q.y0;y<=Q.y1;y++)for(let x=Q.x0;x<=Q.x1;x++)if(at(x,y)===129)return[x,y]})();P.x=P.rx=Q.dx;P.y=P.ry=Q.y1-1;"
              "P.x=P.rx=bed[0];P.y=P.ry=bed[1]+1;P.f='u';const d0=S.day;S.hp=5;act();r.slept=S.day===d0+1&&S.hp>5&&zoneOf(P.x,P.y)===Q.z;"
              "const cr=(()=>{for(let y=St.y0;y<=St.y1;y++)for(let x=St.x0;x<=St.x1;x++)if(at(x,y)===130)return[x,y]})();P.x=P.rx=cr[0];P.y=P.ry=cr[1]+1;P.f='u';S.bag.driftwood_rod=1;S.bag.sardine=30;act();r.storeOpen=$('store').classList.contains('open')&&/storage/.test($('st').textContent);"
              "[...document.querySelectorAll('#items .it')].find(x=>/^Sardine/.test(x.innerText)).querySelectorAll('button')[1].click();r.stored=(S.ships.schooner.store.sardine||0)===30&&!S.bag.sardine;"
              "[...document.querySelectorAll('#items .it')].find(x=>/^Sardine/.test(x.innerText)).querySelectorAll('button')[0].click();r.took=S.ships.schooner.store.sardine===29&&S.bag.sardine===1;"
              "S.bag.copper_ore=500;openStorage('schooner');[...document.querySelectorAll('#items .it')].find(x=>/^Copper ore/.test(x.innerText)).querySelectorAll('button')[1].click();r.capacity=Object.values(S.ships.schooner.store).reduce((a,b)=>a+b,0)===ITEMS.schooner.store;"
              "document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));P.x=P.rx=D.dx;P.y=P.ry=D.y1-2;P.f='d';act();r.helm=sail&&P.x===172&&P.y===190&&zoneOf(P.x,P.y)===0;return r})()")
    assert all(flow.values()), flow
    ev("S.eq.boat='rowboat';sail=false;ui()")
    assert ev("$('deck').style.visibility")=='hidden', "no deck on the rowboat"
    # story state (2.1): defaults, survives saving, reloading and sleeping; old saves without it still load
    pg2 = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    pg2.add_init_script("try{sessionStorage.setItem('lh-started','1')}catch(e){}")
    pg2.goto(url); pg2.evaluate("s=>localStorage.setItem('little-harbor-v1',s)", json.dumps(SAVE)); pg2.reload(); pg2.wait_for_timeout(300)
    assert pg2.evaluate("(()=>{const s=storyState();return s.q===null&&s.step===0&&s.seen.length===0})()"), "old saves get the default story state"
    pg2.evaluate("questSet('q1',2);markSeen('festival');setFlag('met_stranger');save()"); pg2.reload(); pg2.wait_for_timeout(300)
    assert pg2.evaluate("S.story.q==='q1'&&S.story.step===2&&wasSeen('festival')&&flag('met_stranger')"), "story state survives a reload"
    pg2.evaluate("sail=true;sleep()"); assert pg2.evaluate("S.story.q==='q1'&&flag('met_stranger')&&wasSeen('festival')"), "story state survives sleep"
    pg2.close()
    # the opening cinematic (N10): plays first on a new visit; the home menu appears over it as the ship sails away (a tap skips to it); it plays only once per visit
    pi = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True); ierr = []; pi.on("pageerror", lambda e: ierr.append(str(e)))
    pi.goto(url); pi.wait_for_timeout(1200)
    assert pi.evaluate("!!$('intro')&&!$('title').classList.contains('open')"), "the opening scene plays before the title menu"
    pi.tap("#intro"); pi.wait_for_timeout(300)
    assert pi.evaluate("$('title').classList.contains('open')&&$('title').classList.contains('over')&&!!$('intro')"), "a tap skips to the home menu, shown over the scene"
    assert pi.evaluate("[...document.querySelectorAll('#title-body button.tm')].map(b=>b.textContent)") == ["Continue", "New game", "Load game"], "the home menu has Continue, New game and Load game"
    pi.click("#title-body button.tm >> text=Load game"); assert pi.evaluate("$('title-h').textContent==='Load game'&&!!$('intro')"), "Load game opens over the scene"
    pi.click("#title-body button.tm >> text=Back"); pi.click("#title-body button.tm >> text=New game"); pi.wait_for_timeout(900)
    assert pi.evaluate("!$('intro')&&!$('title').classList.contains('open')&&$('look').classList.contains('open')"), "New game closes the scene and starts the game"
    pi.evaluate("sessionStorage.removeItem('lh-started')"); pi.reload(); pi.wait_for_timeout(300); assert pi.evaluate("!$('intro')&&$('title').classList.contains('open')"), "it plays only once per visit"
    assert not ierr, ierr
    pi.close()
    # the title menu (2.1b): opens at the start, Continue goes in; save to a file, a code and slots; loading is checked, backed up and reloads; new game keeps a backup; no movement while it is open
    pm = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True); perr = []; pm.on("pageerror", lambda e: perr.append(str(e)))
    pm.goto(url); pm.evaluate("s=>localStorage.setItem('little-harbor-v1',s)", json.dumps(SAVE)); pm.reload(); pm.wait_for_timeout(300)
    assert pm.evaluate("$('title').classList.contains('open')&&!document.querySelector('#title-body button.tm').disabled&&document.querySelector('#title-body button.tm').textContent==='Continue'"), "title menu opens with Continue"
    x0 = pm.evaluate("P.x"); pm.evaluate("move('r')"); pm.keyboard.down("ArrowRight"); pm.wait_for_timeout(250); pm.keyboard.up("ArrowRight")
    assert pm.evaluate("P.x") == x0 + 1, "only the direct move() call moved: the key was ignored while the menu is open"
    pm.click("#title-body button.tm >> text=Continue"); assert pm.evaluate("!$('title').classList.contains('open')&&/Welcome back/.test($('msg').textContent)")
    pm.click("#menubtn"); assert pm.evaluate("$('title').classList.contains('open')&&/Resume/.test($('title-body').innerText)"), "the menu button opens the pause menu"
    pm.keyboard.press("Escape"); assert pm.evaluate("!$('title').classList.contains('open')"), "Escape closes it again"
    pm.keyboard.press("Escape"); pm.click("#title-body button.tm >> text=Save game"); pm.click("#title-body button.tm >> text=Show a save code")
    code = pm.evaluate("document.querySelector('.tmta').value"); assert code.startswith("LH1:"), code[:10]
    assert pm.evaluate("c=>{const d=parseSave(c);return d.day===S.day&&d.look.skin===S.look.skin&&d.gold===S.gold}", code), "a save code reads back as the same game"
    bad = pm.evaluate("(()=>{const r=[];for(const t of['', 'hello','{\"look\":1,\"day\":3}','LH1:@@@',JSON.stringify({look:{},day:2,v:99})]){try{parseSave(t);r.push('accepted')}catch(e){r.push(typeof e==='string')}}return r})()")
    assert bad == [True] * 5, ("bad saves must be refused with a sentence", bad)
    pm.click("#title-body button.tm >> text=Back"); pm.click("#title-body button.tm >> text=Slot 2")
    assert pm.evaluate("!!slotInfo(2)&&slotInfo(2).day===S.day"), "saved to slot 2"
    pm.evaluate("S.gold=777;save()"); pm.click("#title-body button.tm >> text=Back"); pm.click("#title-body button.tm >> text=Load game"); pm.click("#title-body button.tm >> text=Slot 2")
    pm.click("#title-body button.tm >> text=Yes, load it"); pm.wait_for_function("typeof S!=='undefined'&&typeof saveFileObj==='function'&&S.gold===10", timeout=15000)   # (the page reloads: wait for it, not a fixed time)
    assert pm.evaluate("S.gold===10&&!$('title').classList.contains('open')&&!!localStorage.getItem('little-harbor-v1-backup-before-load')"), "loading a slot restores that game, goes straight in and keeps a backup"
    fobj = pm.evaluate("JSON.stringify(saveFileObj())"); pm.evaluate("S.gold=555;save()"); pm.keyboard.press("Escape")
    pm.click("#title-body button.tm >> text=Load game")
    pm.set_input_files("input[type=file]", {"name": "mine.json", "mimeType": "application/json", "buffer": fobj.encode()}); pm.click("#title-body button.tm >> text=Yes, load it"); pm.wait_for_function("typeof S!=='undefined'&&typeof saveFileObj==='function'&&S.gold===10", timeout=15000)
    assert pm.evaluate("S.gold===10"), "loading a save file works"
    pm.keyboard.press("Escape"); pm.click("#title-body button.tm >> text=Load game")
    pm.set_input_files("input[type=file]", {"name": "junk.json", "mimeType": "application/json", "buffer": b"not a save"})
    pm.wait_for_timeout(300); assert pm.evaluate("/not a Little Harbor save/.test($('title-note').textContent)&&S.gold===10"), "a wrong file is refused and changes nothing"
    pm.click("#title-body button.tm >> text=Back"); pm.click("#title-body button.tm >> text=New game"); pm.click("#title-body button.tm >> text=Yes, start a new game"); pm.wait_for_timeout(600)
    assert pm.evaluate("!S.seen&&!!localStorage.getItem('little-harbor-v1-backup-new-game')"), "new game starts fresh and keeps the old game as a backup"
    assert not perr, perr
    pm.close()
    # N5 shop sub-menus: every shop splits into categories with tabs, one category shows at a time and the choice is remembered
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));S.gold=9999")
    tabs = lambda: ev("[...document.querySelectorAll('#items .tabs button')].map(b=>b.textContent)")
    shown = lambda: ev("[...document.querySelectorAll('#items .it[data-cat]')].filter(r=>r.style.display!=='none').map(r=>r.dataset.cat).filter((v,i,a)=>a.indexOf(v)===i)")
    ev("openStore('rod')"); assert tabs() == ["Rods", "Tools", "Home"] and ev("!/Pickaxe|Sword/.test($('items').textContent)"), ("Bram hides the pickaxe until the story hands them out", tabs())
    ev("setFlag('q2_got_sword');setFlag('q2_got_pickaxe')")   # (Quest 2 unlocks them; the older checks below want the full shop)
    ev("openStore('rod')"); assert tabs() == ["Rods", "Tools", "Home"] and shown() == ["Rods"], (tabs(), shown())
    ev("[...document.querySelectorAll('#items .tabs button')].find(b=>b.textContent==='Tools').click()"); assert shown() == ["Tools"] and ev("[...document.querySelectorAll('#items .tabs button.sel')].map(b=>b.textContent)") == ["Tools"], shown()
    ev("openStore('rod')"); assert shown() == ["Tools"], "the chosen category is remembered"
    ev("openStore('boat')"); assert tabs() == ["Boats", "Crew", "Yard"], tabs()
    ev("openTrader('smith','buy')"); assert tabs() == ["Materials", "Weapons", "Tools", "Armour", "Objects"], tabs()
    ev("openTrader('jeweller','buy')"); assert tabs() == ["Rings", "Amulets"], tabs()
    ev("openTrader('apothecary','buy')"); assert tabs() == ["Potions", "Poisons", "Ingredients"], tabs()
    ev("S.bag.sardine=3;S.bag.carrot=2;openGeneral('sell')"); assert tabs()[0] == "Fish" and "Ingredients" in tabs(), tabs()

    # playtest #4, batch E: who buys and sells what (P57, P58)
    def shop(key, mode, bag=""):   # the names of the rows on a shop screen
        ev("S.gold=100000;S.bag={};S.eq.weapon='wooden_sword';S.bag.wooden_sword=1;%s;openTrader('%s','%s')" % (bag, key, mode)); return ev("[...document.querySelectorAll('#items .it b')].map(b=>b.textContent)")
    def sells_row(name, button):
        ev("[...[...document.querySelectorAll('#items .it')].find(r=>r.querySelector('b').textContent==%s).querySelectorAll('button')].find(b=>b.textContent==%s).click()" % (json.dumps(name), json.dumps(button)))
    t = shop("smith", "buy"); assert all(x in t for x in ["Copper ore", "Iron bar", "Bronze sword", "Iron pickaxe", "Chainmail hauberk"]) and not any(x in t for x in ["Rope", "Softwood plank", "Cloth", "Leather", "Silver ore", "Gold ore"]), ("Garrick sells ore, iron, weapons, tools and armour, but no longer rope, planks, cloth, leather or rare ore", t)
    t = shop("smith", "sell", "S.bag.sword=1;S.bag.bronze_sword=2;S.bag.divine_blade=1;S.bag.pickaxe=1;S.bag.knife=1;S.bag.iron_pickaxe=1;S.bag.rope=3;S.bag.cloth=2")
    assert all(x in t for x in ["Old Sword x1", "Bronze sword x2", "Pickaxe x1", "Knife x1", "Iron pickaxe x1"]) and not any(("Wooden sword" in x or "Divine Blade" in x or x.startswith("Rope") or x.startswith("Cloth x")) for x in t), ("Garrick buys unwanted weapons and tools, but never the wooden sword or the Divine Blade (nor rope or cloth now)", t)
    sells_row("Bronze sword x2", "Sell 1"); assert ev("S.gold===100000+225&&count('bronze_sword')===1"), "a weapon sells for half its price"
    ev("S.eq.weapon='sword';S.bag.sword=1;openTrader('smith','sell')"); sells_row("Old Sword x1", "Sell 1"); assert ev("S.eq.weapon==='wooden_sword'&&count('sword')===0"), "selling the weapon you wield puts the wooden sword back in your hand"
    t = shop("carpenter", "buy"); assert all(x in t for x in ["Softwood plank", "Medium wood plank", "Hardwood plank", "Rope"]) and not any("log" in x for x in t), ("the carpenter sells planks and rope (he does not sell logs)", t)
    t = shop("carpenter", "sell", "S.bag.softwood=2;S.bag.fiber=5;S.bag.rope=1;S.bag.cloth=1"); assert all(x in t for x in ["Softwood log x2", "Flax fiber x5", "Rope x1"]) and not any(x.startswith("Cloth") for x in t), ("he buys logs, flax fiber, planks and rope", t)
    t = shop("tailor", "buy"); assert "Cloth" in t and "Leather" in t and "Rope" not in t, ("Wynn sells cloth and leather", t)
    t = shop("tailor", "sell", "S.bag.cloth=2;S.bag.leather=1;S.bag.rope=1"); assert "Cloth x2" in t and "Leather x1" in t and not any(x.startswith("Rope") for x in t), ("and buys them", t)
    t = shop("apothecary", "buy"); assert "Basil" in t and "Moss" in t and "Death cap mushroom" in t and not any("fang" in x for x in t), ("Astrid sells herbs and mushrooms but not centipede fangs", t)
    t = shop("apothecary", "sell", "S.bag.basil=3;S.bag.centipede_fang=2;S.bag.healing_potion=1;S.bag.carrot=1"); assert "Basil x3" in t and "Centipede fang x2" in t and "Healing potion x1" in t and not any(x.startswith("Carrot") for x in t), ("she buys herbs, fangs and potions, not vegetables", t)
    assert ev("[...document.querySelectorAll('#items .it')].filter(r=>/Basil|Centipede fang/.test(r.querySelector('b').textContent)).map(r=>r.textContent.match(/Sells for (\\d+)g/)[1]).join()") == "5,12", "she pays what Odo paid for herbs (5 for basil), 12 for a fang, and half price for potions"
    t = shop("jeweller", "sell", "S.bag.silver_ore=1;S.bag.gold_ore=1;S.bag.ring_vigor=1"); assert "Silver ore x1" in t and "Gold ore x1" in t and "Ring of Vigor x1" in t, ("Lucie buys gold and silver ore and jewellery", t)
    ev("S.bag={};S.bag.basil=2;S.bag.sardine=2;S.bag.grilled_sardine=1;S.bag.carrot=1;openGeneral('sell')"); t = ev("[...document.querySelectorAll('#items .it b')].map(b=>b.textContent)"); assert "Sardine x2" in t and "Carrot x1" in t and "Grilled sardine x1" in t and not any(x.startswith("Basil") for x in t), ("Odo buys fish, vegetables and meals, but no longer herbs", t)
    assert ev("(()=>{const c=NPC.find(n=>n.n==='Carpenter Alder');return !!c&&c.store==='carpenter'&&c.shopRoom==='carpenter'&&ENTR.some(e=>e.to==='shop_carpenter'&&e.x===31&&e.y===157&&e.out[1]===158)&&at(31,158)===1&&BL.some(b=>b.x===30&&b.y===156)})()"), "the carpenter keeps shop behind the door of a Woodcutters' Shack, outside the Darkwood's south gate"
    ev("sail=false;SCENE=null;BATTLE=null;(()=>{const c=NPC.find(n=>n.n==='Carpenter Alder'),tb=SHOP_ROOMS.find(q=>q.id==='carpenter').room.props.find(p=>p.id==='carpbench');P.x=P.rx=c.x;P.y=P.ry=tb.ay+tb.h;P.f='u';act()})()"); assert ev("$('menu').classList.contains('open')&&mn.opts.join()==='Buy,Sell,Cancel'&&/Alder/.test($('menu-t').textContent)"), "talking to the carpenter across his bench offers Buy and Sell"
    # G2: the village shops, Lucie's shop and the two taverns
    assert ev("['Odo','Bram','Murl','Lucie'].every(nm=>{const n=NPC.find(q=>q.n===nm);return n&&n.shopRoom&&zoneOf(n.x,n.y)>=30})&&BL.filter(b=>b.sign==='tavern').length===2"), "Odo, Bram, Murl and Lucie keep shop inside, and each town has a tavern"
    assert ev("SHOP_ROOMS.every(s=>at(s.door[0],s.door[1])===5&&walkable(s.door[0],s.door[1]+1)&&ENTR.some(e=>e.x===s.door[0]&&e.y===s.door[1])&&BL.some(b=>b.x<=s.door[0]&&s.door[0]<b.x+b.w&&b.y+1===s.door[1]))"), "every shop door is the middle of a building's bottom row with the street in front"
    ev("sail=false;SCENE=null;BATTLE=null;S.gold=250;S.hp=1;(()=>{const k=NPC.find(n=>n.n==='Innkeeper Hobb'),tb=SHOP_ROOMS.find(q=>q.id==='inn_settlement').room.props.find(p=>p.id==='bar');P.x=P.rx=k.x;P.y=P.ry=tb.ay+tb.h;P.f='u';act()})()")
    assert ev("$('menu').classList.contains('open')&&mn.opts.join()==='Single room (100g),Double room (100g),Talk,Cancel'"), "the innkeeper offers rooms across the bar"
    ev("mn.i=1;menuPick()"); assert ev("S.gold===150&&inInn()&&intrOf(P.x,P.y).guest&&$('sleep').style.visibility==='visible'"), "a room costs 100 gold and lets you sleep"
    d0 = ev("S.day"); ev("sleep()"); pg.wait_for_timeout(300); assert ev("S.day")==d0+1 and ev("S.hp>=maxHp()"), "sleeping in the rented room starts the next day and restores health"
    ev("(()=>{const r=intrOf(P.x,P.y);P.x=P.rx=r.dx;P.y=P.ry=r.y1-1;P.f='d';act()})()"); assert ev("!inInn()&&zoneOf(P.x,P.y)===SHOP_ROOMS.find(q=>q.id==='inn_settlement').room.z"), "the guest room's door leads back down into the tavern"
    ev("S.gold=50;(()=>{const k=NPC.find(n=>n.n==='Innkeeper Hobb'),tb=SHOP_ROOMS.find(q=>q.id==='inn_settlement').room.props.find(p=>p.id==='bar');P.x=P.rx=k.x;P.y=P.ry=tb.ay+tb.h;P.f='u';act()})();mn.i=0;menuPick()"); assert ev("S.gold===50&&!inInn()"), "without 100 gold you cannot rent a room"
    ev("$('menu').classList.remove('open');mn=null;S.gold=Math.max(S.gold,5000)")
    # G3: the carpenter's furniture
    t = shop("carpenter", "buy"); assert all(x in t for x in ["Single bed", "Double bed", "Bookcase", "Table", "Chair", "Small carpet", "Large carpet", "Chest of drawers", "Storage crate", "Weapon rack", "Tool rack"]), ("Alder sells all eleven pieces of furniture", t)
    assert ev("[['bed_single',300],['bed_double',600],['bookcase',250],['table',150],['chair',60],['carpet_small',80],['carpet_large',200],['chest_drawers',350],['storage_crate',120],['weapon_rack',300],['tool_rack',250]].every(([i,p])=>CARPENTER.find(s=>s[0]==='Furniture')[1].some(r=>r[0]===i&&r[1]===p)&&ITEMS[i].kind==='furniture')"), "furniture prices are as agreed"
    ev("sail=false;SCENE=null;BATTLE=null;document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));mn=null;S.sta=100;S.placed=[];S.bag={};(()=>{let sp=null;for(let y=20;y<WH-12&&!sp;y++)for(let x=10;x<MW-12&&!sp;x++){let ok=true;for(let j=0;j<9&&ok;j++)for(let i=0;i<9&&ok;i++)if(![1,2].includes(at(x+i,y+j))||NPC.some(n=>n.x===x+i&&n.y===y+j)||ENEMIES.some(e=>e.alive&&e.x===x+i&&e.y===y+j))ok=false;if(ok)sp=[x+4,y+4]}window.__sp=sp;P.x=P.rx=sp[0];P.y=P.ry=sp[1];P.f='d';S.placed.push({id:'camp_kit',x:sp[0]+1,y:sp[1]-2,big:1});S.home={x:sp[0]-1,y:sp[1]-3,roof:'thatch'}})()")
    assert ev("!!window.__sp"), "found open ground for the furniture tests"
    ev("S.bag.storage_crate=1;placing='storage_crate';act()"); assert ev("(()=>{const p=S.placed.find(q=>q.id==='storage_crate');return !!p&&p.x===P.x&&p.y===P.y+1&&!!p.st&&!walkable(p.x,p.y)&&!S.bag.storage_crate&&!placing})()"), "a storage crate is placed in front of you at camp and blocks the way"
    ev("S.bag.sword=1;S.bag.pickaxe=1;S.bag.carrot=3;S.bag.weapon_rack=1;S.bag.tool_rack=1;S.bag.bed_single=1;S.bag.carpet_large=1;S.bag.chair=1;P.f='l';placing='weapon_rack';act()"); assert ev("(()=>{const p=S.placed.find(q=>q.id==='weapon_rack');return !!p&&p.x===P.x-3&&p.y===P.y&&!walkable(p.x,p.y)&&!walkable(p.x+2,p.y)&&!placedAt(P.x,P.y)})()"), "a three-wide weapon rack reaches away from you, so you are never inside it"
    ev("(()=>{const p=S.placed.find(q=>q.id==='weapon_rack');openFurn(p)})()"); t = ev("[...document.querySelectorAll('#items .it b')].map(b=>b.textContent)"); assert any(x.startswith("Old Sword") for x in t) and not any(x.startswith("Pickaxe") for x in t) and not any(x.startswith("Carrot") for x in t), ("a weapon rack takes weapons only", t)
    ev("[...document.querySelectorAll('#items .it')].find(r=>/Old Sword/.test(r.textContent)&&r.querySelector('button')).querySelector('button').click()"); assert ev("(()=>{const p=S.placed.find(q=>q.id==='weapon_rack');return p.st.sword===1&&!S.bag.sword})()"), "a weapon goes onto the rack and out of the bag"
    ev("draw(performance.now())"); ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));(()=>{const p=S.placed.find(q=>q.id==='weapon_rack');P.x=P.rx=p.x+1;P.y=P.ry=p.y+1;P.f='u';act()})()"); assert ev("$('menu').classList.contains('open')&&mn.opts.join()==='Open,Move,Pick up,Cancel'"), "facing the rack offers Open, Move and Pick up"
    ev("mn.i=2;menuPick()"); assert ev("S.placed.some(q=>q.id==='weapon_rack')&&!S.bag.weapon_rack"), "a rack with things on it cannot be picked up"
    ev("(()=>{const p=S.placed.find(q=>q.id==='weapon_rack');S.bag.sword=(S.bag.sword||0)+p.st.sword;p.st={};P.f='u';act();mn.i=2;menuPick()})()"); assert ev("!S.placed.some(q=>q.id==='weapon_rack')&&S.bag.weapon_rack===1"), "an empty rack picks up into the bag"
    ev("P.x=P.rx=window.__sp[0];P.y=P.ry=window.__sp[1];P.f='r';placing='carpet_large';act()"); assert ev("(()=>{const p=S.placed.find(q=>q.id==='carpet_large');return !!p&&walkable(p.x,p.y)&&walkable(p.x+2,p.y+1)&&!placedAt(p.x,p.y)&&!!furnAt(p.x,p.y,true)})()"), "a large carpet lies flat and you can walk over it"
    ev("S.bag.chair=1;P.f='r';placing='chair';act()"); assert ev("S.placed.some(q=>q.id==='chair'&&furnAt(q.x,q.y,true))"), "a chair can stand on a carpet"
    ev("S.placed=S.placed.filter(q=>q.id!=='chair'&&q.id!=='carpet_large');S.bag.chair=1;P.x=P.rx=window.__sp[0];P.y=P.ry=window.__sp[1];P.f='r';placing='bed_single';S.bag.bed_single=1;act()"); assert ev("S.placed.some(q=>q.id==='bed_single')&&(()=>{const b=S.placed.find(q=>q.id==='bed_single');return !walkable(b.x,b.y)&&!walkable(b.x,b.y+1)})()"), "a single bed is two tiles tall"
    ev("S.placed=S.placed.filter(q=>q.id!=='camp_kit');S.home=null;(()=>{const b=S.placed.find(q=>q.id==='bed_single');P.x=P.rx=b.x+1;P.y=P.ry=b.y;P.f='l'})();ui()"); assert ev("atBed()&&!atTent()&&$('sleep').style.visibility==='visible'"), "with only a bed (no tent) you can sleep beside it"
    d0 = ev("S.day"); ev("sleep()"); pg.wait_for_timeout(300); assert ev("S.day")==d0+1, "sleeping beside a bed starts a new day"
    ev("(()=>{const b=S.placed.find(q=>q.id==='bed_single');P.x=P.rx=b.x+6;P.y=P.ry=b.y;ui()})()"); assert ev("!atBed()&&$('sleep').style.visibility==='hidden'"), "far from the bed you cannot sleep"
    ev("S.home={x:window.__sp[0]-1,y:window.__sp[1]-3,roof:'thatch'};P.x=P.rx=window.__sp[0];P.y=P.ry=window.__sp[1];P.f='l';S.bag.table=1;placing='table';act()"); assert ev("(()=>{const l=localStorage.getItem('little-harbor-v1');return !!l&&JSON.parse(l).placed.length>=3})()"), "furniture is saved"
    ev("S.placed=[];S.bag={};S.bag.bookcase=1;P.x=P.rx=IR.dx-3;P.y=P.ry=IR.dy-1;P.f='u';placing='bookcase';act()"); assert ev("(()=>{const p=S.placed.find(q=>q.id==='bookcase');return !!p&&inRoom(p.x,p.y)&&!walkable(p.x,p.y)})()"), "furniture goes in the cottage room"
    ev("S.bag.chair=1;P.f='r';placing='chair';act()"); assert ev("S.placed.length===2"), "a second piece fits beside the first"
    ev("S.bag.chair=1;P.x=P.rx=IR.dx;P.y=P.ry=IR.dy-1;P.f='d';placing='chair';act()"); assert ev("S.placed.length===2"), "furniture cannot go on the tile just inside the door"
    ev("S.placed=[];S.home=null;S.bag={};document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'));mn=null;placing=null")
    # F1: the new Bag (sections on the left, a grid of squares on the right)
    ev("closeBag();S.bag={};S.eq={};S.bag.furnace_x=0;S.bag.sardine=3;S.bag.carrot=2;S.bag.copper_ore=5;S.bag.grilled_sardine=2;S.bag.healing_potion=1;S.bag.sword=1;S.bag.pickaxe=1;S.bag.driftwood_rod=1;S.bag.ring_vigor=1;S.bag.cloth_hood=1;S.bag.storage_crate=1;S.bag.standard_bench=1;S.bag.knife=1;S.eq.weapon='sword';S.eq.ring='ring_vigor';delete S.bag.furnace_x;openBag()")
    assert ev("SECTIONS.map(q=>q.t).join()==='Home Items,Ingredients,Materials,Food,Weapons,Clothing,Tools,Keepsakes'"), "the bag has eight sections, in the order Jack drew them"
    assert ev("(()=>{const n=i=>cellsOf(i).map(c=>c.id);return n(0).includes('storage_crate')&&n(0).includes('standard_bench')&&n(1).includes('sardine')&&n(1).includes('carrot')&&n(2).includes('copper_ore')&&n(3).includes('grilled_sardine')&&n(3).includes('healing_potion')&&n(4).join()==='sword'&&n(5).includes('ring_vigor')&&n(5).includes('cloth_hood')&&n(6).includes('pickaxe')&&n(6).includes('knife')&&n(6).includes('driftwood_rod')})()"), "everything sits in its section (rings in Clothing, tools in Tools, furniture in Home Items)"
    assert ev("document.querySelectorAll('#btabs .btab').length===8&&document.querySelectorAll('#bgrid .bcell').length===cellsOf(0).length&&getComputedStyle($('bgrid')).gridTemplateColumns.split(' ').length===5"), "the tabs are down the left and the squares are five across"
    ev("bs=4;bc=0;drawBag()"); assert ev("document.querySelector('#bgrid .bcell .be')!==null&&/Old Sword/.test($('btxt').textContent)"), "an equipped square carries an E and its name shows below"
    ev("bs=3;bc=cellsOf(3).findIndex(c=>c.id==='grilled_sardine');drawBag();S.hp=10;bagPick()"); assert ev("bpop&&bpop.opts[0]==='Eat'"), "tapping a food square offers Eat"
    ev("popChoose()"); assert ev("S.hp>10&&S.bag.grilled_sardine===1"), "eating from the new bag works"
    ev("bs=5;bc=cellsOf(5).findIndex(c=>c.id==='cloth_hood');drawBag();bagPick()"); assert ev("bpop&&bpop.opts[0]==='Equip'"), "clothing squares offer Equip"
    ev("popChoose()"); assert ev("S.eq.helmet==='cloth_hood'"), "equipping from the new bag works"
    ev("bs=0;bc=cellsOf(0).findIndex(c=>c.id==='storage_crate');drawBag();bagPick()"); assert ev("bpop&&bpop.opts[0]==='Place'"), "home items offer Place"
    ev("bpop=null;popRender();bs=2;bc=0;drawBag();bagPick()"); assert ev("!bpop"), "materials have nothing to do"
    ev("bs=5;bc=0;drawBag();bagGo(1);bagGo(1)"); assert ev("SECTIONS[bs].t==='Keepsakes'&&$('bag').classList.contains('open')"), "the next-section keys wrap round"
    ev("closeBag();S.bag={};S.eq={}")
    # F2: the Vendors screen (sections on the left, a grid of squares, the chosen one's buttons below)
    ev("S.gold=5000;S.bag={};S.eq={};openTrader('smith','buy')"); assert ev("$('store').classList.contains('grid')&&[...document.querySelectorAll('#stabs .btab')].map(b=>b.textContent).join()==='Materials,Weapons,Tools,Armour,Objects'"), "Garrick's screen shows his sections down the left"
    assert ev("document.querySelectorAll('#sgrid .bcell').length===4&&getComputedStyle($('sgrid')).gridTemplateColumns.split(' ').length===5&&/Copper ore/.test($('stxt').textContent)&&$('sbtns').children.length===1"), "the squares are five across and the first is selected with its Buy button below"
    ev("document.querySelectorAll('#sgrid .bcell')[1].click()"); assert ev("/Tin ore/.test($('stxt').textContent)&&/30g/.test($('sbtns').textContent)"), "tapping a square shows its name and price"
    ev("$('sbtns').children[0].click()"); assert ev("S.gold===4970&&count('tin_ore')===1&&/Tin ore/.test($('stxt').textContent)"), "the button below buys it, and the same square stays selected"
    ev("document.querySelector('#sswitch button').click()"); assert ev("/^Selling/.test($('sswitch').textContent)&&document.querySelectorAll('#sgrid .bcell').length>=1"), "the bar across the top switches to selling and shows what you can sell"
    ev("$('sbtns').children[0].click()"); assert ev("S.gold===4985&&!count('tin_ore')"), "selling from the grid pays half price"
    ev("openGeneral('buy')"); assert ev("[...document.querySelectorAll('#stabs .btab')].length>=1&&document.querySelectorAll('#sgrid .bcell canvas').length>=3"), "Odo's goods are squares too"
    ev("S.bag.sardine=2;openStash('Test crate',{},60,()=>{},undefined)"); assert ev("!$('store').classList.contains('grid')"), "crates keep their own list screen"
    ev("$('store').classList.remove('open')")
    ev("$('menu').classList.remove('open');mn=null;(()=>{const w=NPC.find(n=>n.n==='Seamstress Wynn');P.x=P.rx=w.x;P.y=P.ry=w.y+1;P.f='u';act()})()"); assert ev("$('menu').classList.contains('open')&&mn.opts.join()==='Try on clothes,Buy cloth and leather,Sell cloth and leather,Cancel'"), "Wynn still lets you try on clothes, and now buys and sells cloth and leather"
    ev("$('menu').classList.remove('open');mn=null")
    ev("S.bag={};S.eq.weapon='wooden_sword';S.bag.wooden_sword=1;document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    # the dialogue box (2.2): a table of nodes by id with choices that set flags, a portrait for the speakers who have one, advancing by tap, Use or Space, villagers' chat in the box with their words unchanged
    ev("DLG.t_test={start:'a',nodes:{a:{who:'Murl',text:'First line.',next:'b'},b:{who:'You',text:'Pick one.',choices:[{t:'Yes',set:'t_yes',go:'c'},{t:'No'}]},c:{who:'Murl',text:'Done.'}}};window.__end=0;runDialogue('t_test',()=>{window.__end=1})")
    pg.wait_for_timeout(700)
    assert ev("dlgActive()&&$('dlg-who').textContent==='Murl'&&$('dlg-txt').textContent==='First line.'&&$('dlg-pt').style.display==='block'&&$('dlg').classList.contains('has-pt')"), "box shows speaker, text and Murl's portrait"
    kx = ev("P.x"); pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(150); pg.keyboard.up("ArrowRight"); assert ev("P.x") == kx, "no walking while the box is open"
    pg.keyboard.press("Space"); pg.wait_for_timeout(700); assert ev("$('dlg-txt').textContent==='Pick one.'&&document.querySelectorAll('#dlg-ch button').length===2"), "Space goes on to the choice"
    ev("document.querySelectorAll('#dlg-ch button')[0].click()"); pg.wait_for_timeout(500); assert ev("flag('t_yes')&&$('dlg-txt').textContent==='Done.'"), "a choice sets its flag and goes on"
    ev("act()"); pg.wait_for_timeout(100); ev("act()"); assert ev("!dlgActive()&&window.__end===1"), "the end callback runs when it finishes"
    ev("dlgSay('Mara','Hello.')"); pg.wait_for_timeout(500); assert ev("$('dlg-pt').style.display==='none'&&dlgActive()"), "no portrait for a character without one"; ev("dlgAdvance();dlgAdvance()")
    ev("(()=>{const n=NPC.find(q=>q.n==='Gate Guard Bors');n.i=0;P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(700)
    assert ev("(()=>{const n=NPC.find(q=>q.n==='Gate Guard Bors');return dlgActive()&&$('dlg-who').textContent==='Gate Guard Bors'&&n.say.includes($('dlg-txt').textContent)&&$('dlg-pt').style.display==='block'})()") , "villager chat uses the box"
    ev("dlgAdvance();dlgAdvance()")
    # triggers (2.3): an area row says a line, sets a flag and pays gold once; a talk row, a morning row and a "beaten" row work; a condition holds a row back; a moved person stays moved
    ev("DLG.t_trg={start:'a',nodes:{a:{who:'Murl',text:'Trigger line.'}}};TRIGGERS.push({id:'t_area',when:{area:[10,10,12,12]},do:[{say:'t_trg'},{set:'t_area_done'},{gold:7},{give:{sardine:2}}]},{id:'t_talk',when:{talk:'Bram'},if:{flag:'t_need'},do:[{set:'t_talked'}]},{id:'t_day',when:{day:1},do:[{set:'t_morning'},{move:['Odo',37,22]}]},{id:'t_beat',when:{beaten:'t_group'},do:[{quest:['t_q',2]}]})")
    ev("S.gold=0;P.x=P.rx=9;P.y=P.ry=11;P.f='r';fireTriggers('step');P.x=P.rx=10;fireTriggers('step')"); pg.wait_for_timeout(500)
    assert ev("dlgActive()&&$('dlg-txt').textContent==='Trigger line.'&&!flag('t_area_done')"), "the line comes first, the rest waits for the box to close"
    ev("dlgAdvance()"); assert ev("flag('t_area_done')&&S.gold===7&&S.bag.sardine>=2&&wasSeen('trg:t_area')"), "the actions run once the box closes"
    ev("P.x=P.rx=9;fireTriggers('step');P.x=P.rx=10;fireTriggers('step')"); assert ev("!dlgActive()&&S.gold===7"), "an area row fires once only"
    ev("(()=>{const n=NPC.find(q=>q.n==='Bram');P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(200); assert ev("!flag('t_talked')"), "a held-back row does not fire"
    ev("setFlag('t_need');(()=>{const n=NPC.find(q=>q.n==='Bram');P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); assert ev("flag('t_talked')"), "talking fires the talk row"
    ev("fireTriggers('day')"); assert ev("flag('t_morning')&&(()=>{const o=NPC.find(q=>q.n==='Odo');return o.x===37&&o.y===22})()"), "a morning row fires and moves a person"
    ev("enemyBeaten('t_group')"); assert ev("S.story.q==='t_q'&&S.story.step===2"), "a beaten group fires its row"
    ev("save()"); pg.reload(); pg.wait_for_timeout(500); pg.evaluate("TRIGGERS.push({id:'t_area',when:{area:[10,10,12,12]},do:[{gold:7}]})")
    assert ev("(()=>{const o=NPC.find(q=>q.n==='Odo');return flag('t_area_done')&&wasSeen('trg:t_area')&&o.x===37&&o.y===22})()"), "flags, seen rows and moved people survive a reload"
    ev("S.gold=0;P.x=P.rx=11;P.y=P.ry=11;fireTriggers('step')"); assert ev("S.gold===0"), "a row already fired does not fire again after a reload"
    # the buttons and the Menu screen: Bag, Quests, Skills, Map and Menu in one row; Menu shows the summary with Save game and Load game (no Quests); Quests is its own screen
    assert ev("[...$('bagbtn').parentElement.children].map(b=>b.textContent).join()==='Bag,Quests,Skills,Map,Menu'&&[...$('ctx').children].map(b=>b.textContent).join()==='Deck,Sleep'"), "the button row is Bag, Quests, Skills, Map, Menu, with Deck and Sleep in their own row"
    pg.tap("#chbtn"); pg.wait_for_timeout(200)
    assert ev("$('ch').classList.contains('open')&&$('ch-title').textContent==='MENU'&&/Day/.test($('ch-info').textContent)&&/Gold/.test($('ch-info').textContent)&&!document.getElementById('ch-quests')"), "Menu opens the summary, without a Quests button"
    assert ev("(()=>{const d=$('ch-pt').getContext('2d').getImageData(0,0,96,96).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]!==142)n++;return n>200})()"), "the figure is drawn"
    pg.tap("#ch-save"); pg.wait_for_timeout(200)
    assert ev("!$('ch').classList.contains('open')&&$('title').classList.contains('open')&&$('title-h').textContent==='Save game'"), "Save game opens the save choices"
    ev("tmClose()"); pg.tap("#chbtn"); pg.wait_for_timeout(100); pg.tap("#ch-load"); pg.wait_for_timeout(200)
    assert ev("!$('ch').classList.contains('open')&&$('title').classList.contains('open')&&$('title-h').textContent==='Load game'"), "Load game opens the load choices"
    ev("tmClose()")
    pg.tap("#qsbtn"); pg.wait_for_timeout(200)
    assert ev("$('qs').classList.contains('open')&&/No quest right now/.test($('qs-list').textContent)"), "Quests opens the quest log, empty at first"
    ev("QUESTS.push({id:'t_q1',name:'Test quest',steps:['Do the first thing.','Now the second thing.']},{id:'t_q0',name:'Old quest',steps:['x']});questSet('t_q1',1);questDone('t_q0');openQuests()")
    assert ev("/Test quest/.test($('qs-list').textContent)&&/Now the second thing\\./.test($('qs-list').textContent)&&/FINISHED/.test($('qs-list').textContent)&&/Old quest/.test($('qs-list').textContent)"), "the log shows the current step and the finished list"
    ev("questDone('t_q1');openQuests()"); assert ev("S.story.q===null&&/No quest right now/.test($('qs-list').textContent)&&S.story.done.length===2"), "a finished quest moves to the list"
    pg.tap("#qs-back"); assert ev("!$('qs').classList.contains('open')&&!$('ch').classList.contains('open')"), "Back returns to the game"
    pg.keyboard.press("q"); pg.wait_for_timeout(100); assert ev("$('qs').classList.contains('open')"), "the Q key opens the quest log"
    pg.keyboard.press("Escape"); pg.wait_for_timeout(100); assert ev("!$('qs').classList.contains('open')"), "Escape closes it"
    # scenes (2.4): a 7-step scene walks the player and a villager, fades, pans the camera, speaks and sets a flag; input is paused meanwhile; Skip lands in the same end state; a trigger row can start one
    ev("DLG.t_sc={start:'a',nodes:{a:{who:'Murl',text:'Scene line.'}}};SCENES.t_scene=[{fade:'out',ms:50},{tp:['You',P.x,P.y]},{walk:['You',P.x+2,P.y,60]},{face:['You','l']},{fade:'in',ms:50},{pan:[P.x+6,P.y,100]},{say:'t_sc'},{set:'t_scene_done'},{pan:['back',100]},{walk:['Odo',NPC.find(q=>q.n==='Odo').x+2,NPC.find(q=>q.n==='Odo').y,60]}];window.__s=[P.x,P.y,NPC.find(q=>q.n==='Odo').x,NPC.find(q=>q.n==='Odo').y];window.__e=0;runScene('t_scene',()=>{window.__e=1})")
    ev("move('u');act();sleep()"); assert ev("P.x===__s[0]&&P.y===__s[1]&&SCENE!==null"), "no walking, using or sleeping during a scene"
    pg.wait_for_timeout(700); assert ev("dlgActive()&&$('dlg-txt').textContent==='Scene line.'&&P.x===__s[0]+2&&P.f==='l'&&SCENECAM!==null&&!flag('t_scene_done')"), "the scene walked, faced, panned and is now speaking"
    ev("dlgAdvance()"); pg.wait_for_timeout(1000)
    assert ev("window.__e===1&&SCENE===null&&SCENECAM===null&&flag('t_scene_done')&&NPC.find(q=>q.n==='Odo').x===__s[2]+2&&$('flash').style.opacity==='0'&&!document.body.classList.contains('scene')"), "the scene ends with the camera back and the fade cleared"
    ev("P.x=P.rx=__s[0];P.y=P.ry=__s[1];NPC.find(q=>q.n==='Odo').x=__s[2];setFlag('t_scene_done',0);window.__e=0;runScene('t_scene',()=>{window.__e=1})"); pg.wait_for_timeout(300); ev("skipScene()")
    assert ev("window.__e===1&&SCENE===null&&P.x===__s[0]+2&&flag('t_scene_done')&&NPC.find(q=>q.n==='Odo').x===__s[2]+2&&!dlgActive()&&SCENECAM===null"), "Skip lands in the same end state with no box left open"
    ev("setFlag('t_scene_done',0);TRIGGERS.push({id:'t_sc_trg',when:{talk:'Murl'},do:[{scene:'t_scene'},{set:'t_after'}]})"); ev("(()=>{const n=NPC.find(q=>q.n==='Murl');P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(300); ev("skipScene()")
    assert ev("flag('t_scene_done')&&flag('t_after')&&SCENE===null"), "a trigger starts a scene and carries on after it"
    # gates (2.5): a test boulder across two grass tiles blocks until its flag is set (by a trigger, or by Use with the needed tool), stays open after a reload, and never walls anyone in
    ev("sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;NPC.forEach(n=>{n.busy=1});window.__AN=AN.splice(0)");   # (wandering villagers stand still and the farm animals are put away so none walks onto the test boulder)
    cells = ev("(()=>{for(let r=3;r<40;r++)for(let dx=-r;dx<=r;dx++){const x=P.x+dx,y=P.y-r;if(at(x,y)===1&&at(x+1,y)===1&&at(x,y+1)===1&&at(x-1,y)===1)return[x,y]}})()")
    ev("window.__g=%s;GATES.push({id:'t_boulder',flag:'t_boulder_open',cells:[[__g[0],__g[1]],[__g[0]+1,__g[1]]],closed:36,msg:'A boulder blocks the way.',needs:{eq:'pickaxe'},opens:'You break the boulder.'});applyGates()" % json.dumps(cells))
    assert ev("at(__g[0],__g[1])===36&&at(__g[0]+1,__g[1])===36&&!walkable(__g[0],__g[1])"), "a closed gate blocks"
    ev("P.x=P.rx=__g[0];P.y=P.ry=__g[1]+1;P.f='u';S.eq.pickaxe=null;act()"); assert ev("$('msg').textContent==='A boulder blocks the way.'&&at(__g[0],__g[1])===36"), "without the tool it only says why"
    ev("S.eq.pickaxe='pickaxe';act()"); assert ev("flag('t_boulder_open')&&at(__g[0],__g[1])===1&&at(__g[0]+1,__g[1])===1&&walkable(__g[0],__g[1])"), "with the tool, Use opens it and the ground comes back"
    ev("S.eq.pickaxe=null;P.x=P.rx=__g[0];P.y=P.ry=__g[1];setFlag('t_boulder_open',0)"); assert ev("at(__g[0],__g[1])===1&&at(__g[0]+1,__g[1])===36&&gatePending"), "a gate does not close on someone standing in it"
    ev("move('d');"); assert ev("at(__g[0],__g[1])===36&&!gatePending"), "it closes once they step off"
    ev("TRIGGERS.push({id:'t_gate_trg',do:[{set:'t_boulder_open'}]});fireTriggers('step')"); assert ev("at(__g[0],__g[1])===1"), "a trigger can open it"
    ev("save()"); pg.reload(); pg.wait_for_timeout(500)
    ev("window.__g=%s;GATES.push({id:'t_boulder',flag:'t_boulder_open',cells:[[__g[0],__g[1]],[__g[0]+1,__g[1]]],closed:36});applyGates()" % json.dumps(cells)); assert ev("flag('t_boulder_open')&&at(__g[0],__g[1])===1&&at(__g[0]+1,__g[1])===1"), "an opened gate stays open after a reload"
    # seagull letters (2.7): a trigger row sends a letter; a gull lands, the letter opens, closing it keeps it in the bag's LETTERS pocket; it is not sent twice; Skip still keeps it; saved
    ev("sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;LETTERS.t_letter={from:'A stranger',title:'A plea',text:'Please come quick.\\n\\nHurry!'};LETTERS.t_l2={from:'Bjorn',title:'Second',text:'Hello.'};TRIGGERS.push({id:'t_ltr',when:{talk:'Odo'},do:[{letter:'t_letter'},{set:'t_after_letter'}]});window.__x=0;window.__sent=sendLetter('t_letter',()=>{window.__x=1})")
    pg.wait_for_function("GULL!==null", timeout=10000); assert ev("window.__sent===true&&SCENE!==null&&GULL!==null&&!$('letter').classList.contains('open')"), "the gull comes first"
    pg.wait_for_function("$('letter').classList.contains('open')", timeout=15000); assert ev("GULL!==null&&GULL.fly===false&&$('letter').classList.contains('open')&&/From A stranger/.test($('letter-from').textContent)&&document.querySelectorAll('#letter-text p').length===2&&hasLetter('t_letter')"), "it lands and the letter opens"
    ev("move('u')"); assert ev("P.y===33+OY"), "no walking while the letter is open"
    pg.tap("#letter-close"); pg.wait_for_function("SCENE===null", timeout=15000); assert ev("window.__x===1&&SCENE===null&&GULL===null&&S.letters.length===1&&!$('letter').classList.contains('open')"), "closing it sends the gull off and ends the scene"
    assert ev("sendLetter('t_letter')===false"), "a letter you have is not sent twice"
    ev("openBag();bs=7;bc=0;drawBag()"); assert ev("SECTIONS[bs].t==='Keepsakes'&&cellsOf(bs).some(c=>c.label==='A plea')&&/A plea/.test($('btxt').textContent+[...document.querySelectorAll('.bcell')].map(c=>c.title).join())"), "the bag has a Keepsakes section with it"
    ev("bc=cellsOf(7).findIndex(c=>c.label==='A plea');drawBag();bagPick()"); assert ev("$('letter').classList.contains('open')&&$('letter-title').textContent==='A plea'"), "tapping it reads it again"
    ev("closeLetter();closeBag()")
    ev("sendLetter('t_l2')"); pg.wait_for_timeout(300); ev("skipScene()"); assert ev("SCENE===null&&GULL===null&&hasLetter('t_l2')&&!$('letter').classList.contains('open')"), "Skip keeps the letter without showing it"
    ev("S.letters=S.letters.filter(i=>i!=='t_letter');save()"); ev("(()=>{const n=NPC.find(q=>q.n==='Odo');P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(200); ev("skipScene()")
    assert ev("hasLetter('t_letter')&&flag('t_after_letter')&&SCENE===null"), "a trigger row sends a letter and carries on"
    ev("save()"); pg.reload(); pg.wait_for_timeout(500); assert ev("S.letters.includes('t_l2')&&S.letters.includes('t_letter')"), "letters are saved"
    # world variants (2.6): the VARIANTS table drives the pirate camp and the damaged Sky temple from their flags, a simple tile row swaps and restores tiles, and nobody is left standing in a blocked tile
    ev("sail=false;setFlag('pirates_here',0);setFlag('sky_damaged',0)"); assert ev("!NPC.some(n=>n.pirate)&&at(236,108)!==119"), "both variants start off"
    ev("setFlag('pirates_here',1)"); assert ev("NPC.filter(n=>n.pirate).length===10&&BL.filter(b=>b.ship).length===3"), "setting the flag builds the pirate camp live"
    ev("setFlag('sky_damaged',1)"); assert ev("at(236,108)===119"), "setting the flag damages the Sky temple live"
    ev("setFlag('pirates_here',0);setFlag('sky_damaged',0)"); assert ev("!NPC.some(n=>n.pirate)&&at(236,108)!==119"), "clearing the flags puts both back"
    ev("sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY"); vc = ev("(()=>{for(let r=3;r<40;r++)for(let dx=-r;dx<=r;dx++){const x=P.x+dx,y=P.y-r;if(at(x,y)===1&&at(x+1,y)===1)return[x,y]}})()")
    ev("window.__v=%s;VARIANTS.push({id:'t_var',flag:'t_var_on',tiles:[[__v[0],__v[1],12],[__v[0]+1,__v[1],12]]});applyVariants()" % json.dumps(vc)); assert ev("at(__v[0],__v[1])===1"), "a tile row does nothing while its flag is off"
    ev("setFlag('t_var_on',1)"); assert ev("at(__v[0],__v[1])===12&&at(__v[0]+1,__v[1])===12"), "a tile row swaps its tiles when the flag is set"
    ev("setFlag('t_var_on',0)"); assert ev("at(__v[0],__v[1])===1&&at(__v[0]+1,__v[1])===1"), "and puts the first look back when it is cleared"
    ev("P.x=P.rx=__v[0];P.y=P.ry=__v[1];setFlag('t_var_on',1)"); assert ev("WK.includes(at(P.x,P.y))&&(P.x!==__v[0]||P.y!==__v[1])&&Math.abs(P.x-__v[0])+Math.abs(P.y-__v[1])<=2"), "a player standing where a variant blocks is moved to the nearest free tile"
    ev("setFlag('t_var_on',0)")
    # people by story (2.9): a story-only person is hidden until a flag, then stands where the row says and speaks its own line; an everyday person gets new lines and a dialogue for a while and goes back after
    ev("sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;DLG.t_pp={start:'a',nodes:{a:{who:'Pip',text:'Story talk.'}}};window.__g=nearestTile(P.x+4,P.y-3,(x,y)=>at(x,y)===1&&!npcAt(x,y));NPC.push({n:'Lost Test',x:__g[0],y:__g[1],hx:__g[0],hy:__g[1],f:'d',skin:1,hair:1,shirt:1,say:['Plain chat.']});window.__pip=NPC.find(q=>q.n==='Pip');window.__p0=[__pip.x,__pip.y,__pip.say[0]]")
    ev("STORY_PEOPLE.push({npc:'Lost Test',if:{flag:'t_found'},at:[P.x+2,P.y],f:'l',say:['Thank you!']},{npc:'Lost Test',hide:1},{npc:'Pip',if:{flag:'t_pipstory'},say:['Pip story line.'],dlg:'t_pp'});applyStoryPeople()")
    assert ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test');return n.hidden===1&&!npcAt(n.x,n.y)})()"), "a story-only person starts out of the way"
    assert ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test'),w=[];const o=CharacterSprite.draw;CharacterSprite.draw=(c,x,y,l)=>{w.push(1)};try{draw()}finally{CharacterSprite.draw=o}return NPC.filter(q=>!q.hidden&&zoneOf(q.x,q.y)===0).length>0})()"), "hiding them does not break drawing"
    ev("setFlag('t_found')"); assert ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test');return !n.hidden&&n.x===P.x+2&&n.y===P.y&&n.f==='l'&&n.say[0]==='Thank you!'&&npcAt(n.x,n.y)===n})()"), "the flag brings them to the spot, facing the way the row says, with their own line"
    ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test');P.x=P.rx=n.x-1;P.y=P.ry=n.y;P.f='r';act()})()"); pg.wait_for_timeout(300); assert ev("dlgActive()&&$('dlg-txt').textContent==='Thank you!'"), "talking to them says the row's line"
    ev("dlgAdvance();dlgAdvance()")
    ev("setFlag('t_pipstory');(()=>{P.x=P.rx=__pip.x;P.y=P.ry=__pip.y+1;P.f='u';act()})()"); pg.wait_for_timeout(500); assert ev("dlgActive()&&$('dlg-txt').textContent==='Story talk.'"), "a dialogue row replaces the everyday chat"
    ev("dlgAdvance();dlgAdvance();setFlag('t_pipstory',0)"); assert ev("__pip.say[0]===__p0[2]&&!__pip.dlg&&__pip.x===__p0[0]&&__pip.y===__p0[1]"), "when no row matches they go back to how they were built"
    ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test');P.x=P.rx=n.x;P.y=P.ry=n.y;setFlag('t_found',0);setFlag('t_found')})()"); assert ev("(()=>{const n=NPC.find(q=>q.n==='Lost Test');return !(n.x===P.x&&n.y===P.y)&&WK.includes(at(n.x,n.y))})()"), "a person is never put on top of the player"
    ev("setFlag('t_found',0)"); assert ev("NPC.find(q=>q.n==='Lost Test').hidden===1"), "clearing the flag hides them again"
    ev("NPC.splice(NPC.findIndex(q=>q.n==='Lost Test'),1);STORY_PEOPLE.length=0")
    # story test switches (2.11): the menu lists every quest start; a jump clears the story, applies the rows before it (earlier quests done), gives items and gold, moves the player and keeps the bag
    ev("STORY_JUMPS.push({id:'t_a',name:'Test A',after:'q1',quest:'t_qa',flags:['t_ja'],give:{sardine:2},gold:5},{id:'t_b',name:'Test B',after:'t_a',quest:'t_qb',flags:['t_jb'],at:[32+OX,33+OY]})")
    ev("setFlag('t_stale');S.letters=['old'];S.bag.carrot=3;S.gold=100;const g0=S.gold;tmOpen('pause')")
    assert ev("[...document.querySelectorAll('#title-body button')].some(b=>b.textContent==='Test: jump to a quest')"), "the menu has the test button"
    ev("[...document.querySelectorAll('#title-body button')].find(b=>b.textContent==='Test: jump to a quest').click()")
    assert ev("document.querySelectorAll('#title-body button').length>=12&&/Quest 10/.test($('title-body').textContent)&&/Quest 1:/.test($('title-body').textContent)"), "every quest start is listed"
    ev("[...document.querySelectorAll('#title-body button')].find(b=>b.textContent==='Test B').click()")
    assert ev("S.story.q==='t_qb'&&S.story.done.includes('t_qa')&&flag('t_ja')&&flag('t_jb')&&!flag('t_stale')&&S.letters.join()==='q1_letter'&&S.gold===105&&S.bag.carrot===3&&S.bag.sardine>=2&&P.x===32+OX&&P.y===33+OY&&!$('title').classList.contains('open')"), "a jump clears the story, applies earlier rows, gives items, moves the player and keeps the bag"
    ev("storyJump('q10')"); assert ev("S.story.q==='q10'&&S.story.done.length===9&&!flag('t_ja')"), "Quest 10 starts with nine quests finished"
    ev("storyJump('start')"); assert ev("S.story.q===null&&S.story.done.length===0"), "the start row clears the story"
    ev("delete S.bag.sea_key;delete S.bag.earth_key;delete S.bag.sky_key;delete S.bag.fire_key;delete S.bag.enchanted_armour;delete S.bag.sky_helm;delete S.bag.divine_blade;if(S.eq.weapon==='divine_blade')S.eq.weapon=null;S.eq.armour=null;S.eq.helmet=null;ui()")   # (the Quest 10 jump above passes through Quest 5's tower step and hands these out)
    pgs, errs_s = load(b, url + "?story=q2", SAVE); assert pgs.evaluate("S.story.q==='q2'&&S.story.done.includes('q1')"), "a ?story= link jumps on load"; assert not errs_s, errs_s; pgs.close()
    def fight_out():   # click Attack until the battle is over
        for _ in range(60):
            if ev("BATTLE===null"): break
            try: pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=8000)
            except Exception: raise AssertionError(('battle menu never came back', ev("BATTLE?[[...$('bt-menu').children].map(b=>b.textContent+(b.disabled?'(x)':'')),BATTLE.log.slice(-3),S.sta,S.hp,S.eq.weapon]:null")))
            if ev("BATTLE!==null"): ev(ATTACK_JS)
            pg.wait_for_timeout(20)
        pg.wait_for_function("BATTLE===null", timeout=8000)
    # creatures (3.1 and Jack's note P6): they open the turn-based battle when they touch the player (they reach you, you walk into them, or you face them and press Use); a win gives the rewards and takes them off the map, running leaves them waiting
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;S.hp=50;S.sta=100;S.coat=0;S.eq.weapon='sword';add('sword');ENEMIES.length===1||ENEMIES.splice(1);G.hp=G.max=12;G.alive=true;G.cd=0;P.x=P.rx=G.x;P.y=P.ry=G.y+1;P.f='u';window.__xp=S.xp.combat||0;act()"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&BATTLE.foes.length===1&&BATTLE.foes[0].t.n==='Spirit'&&BATTLE.foes[0].t.art==='ghost'&&$('battle').classList.contains('open')"), "facing the spirit and pressing Use opens the battle"
    fight_out(); assert ev("!G.alive&&G.resp>=36&&G.resp<=40&&(S.xp.combat||0)>=__xp+20"), "beating it takes it off the map with a respawn count, and gives its xp"
    assert ev("(()=>{enemiesMorning();return G.alive&&G.hp===G.max&&G.x===G.hx&&G.y===G.hy})()"), "a respawning creature is back at home each morning"   # (one call, so the creature cannot wander off between the morning and the check)
    ev("G.cd=0;P.x=P.rx=G.x;P.y=P.ry=G.y+1;S.hp=50;window.__r0=Math.random;enemiesTick()"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&BATTLE.foes[0].t.n==='Spirit'"), "a creature that reaches the player starts a battle"
    ev("Math.random=()=>0;[...$('bt-menu').children].find(b=>b.textContent==='Run').click()"); pg.wait_for_function("BATTLE===null", timeout=8000); ev("Math.random=__r0")
    assert ev("G.alive&&G.cd>0"), "running away leaves the creature on the map, waiting a moment"
    ev("G.cd=0;P.x=P.rx=G.x;P.y=P.ry=G.y+1;P.f='u';move('u')"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null"), "walking into a creature starts the battle"
    ev("Math.random=()=>0;[...$('bt-menu').children].find(b=>b.textContent==='Run').click()"); pg.wait_for_function("BATTLE===null", timeout=8000); ev("Math.random=__r0")
    ev("ENEMY_TYPES.t_imp={n:'Imp',hp:10,dmg:3,cd:1,speed:1,chase:6,art:'ghost',xp:5,gold:[7,7],drops:[['sardine',1,2]],respawn:0,die:'The imp pops.'};S.gold=0;S.bag.sardine=0;sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;window.__o=nearestTile(P.x+2,P.y-2,(x,y)=>at(x,y)===1&&!npcAt(x,y));TRIGGERS.push({id:'t_imps',when:{beaten:'t_group'},do:[{set:'t_imps_beaten'}]});window.__e1=spawnEnemy('t_imp',__o[0],__o[1],{group:'t_group'});window.__e2=spawnEnemy('t_imp',__o[0]+1,__o[1],{group:'t_group'})")
    ev("draw()"); ev("S.hp=50;P.x=P.rx=__e1.x;P.y=P.ry=__e1.y+1;P.f='u';act()"); pg.wait_for_timeout(100); fight_out()
    assert ev("!__e1.alive&&!flag('t_imps_beaten')&&S.gold===7&&S.bag.sardine===2"), "a win gives the gold and drops, and the group is not done while one lives"
    ev("S.hp=50;P.x=P.rx=__e2.x;P.y=P.ry=__e2.y+1;P.f='u';act()"); pg.wait_for_timeout(100); fight_out()
    assert ev("!__e2.alive&&flag('t_imps_beaten')"), "beating the last of a group fires its trigger"
    ev("enemiesTick()"); assert ev("!ENEMIES.includes(__e1)&&!ENEMIES.includes(__e2)&&ENEMIES.length===1"), "beaten creatures that do not respawn are cleared away"
    # turn-based battles (3.6): opens full screen, blocks everything else, Attack / Item / Run work, wins give rewards and run the row's actions, a knock-out wakes you on the boat, a boss with `flee` escapes, a trigger can start one
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;S.hp=50;S.sta=100;S.coat=0;S.gold=100;S.eq.weapon='sword';add('sword');BATTLES.t_win={foes:['pirate_grunt'],win:[{set:'t_won'}],lose:[{set:'t_lost'}],ran:[{set:'t_ran'}],escaped:[{set:'t_escaped'}]};window.__r=null;startBattle('t_win',r=>{window.__r=r})")
    pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&$('battle').classList.contains('open')&&[...$('bt-menu').children].map(b=>b.textContent).join()==='Attack,Block,Item'&&document.querySelectorAll('.bt-foe canvas').length===1"), "the battle opens with the menu (no Run against pirates)"
    ev("move('u');act();sleep()"); assert ev("P.y===33+OY"), "no walking, using or sleeping during a battle"
    bclick = lambda name: ev("[...$('bt-menu').children].find(b=>b.textContent.startsWith(%s)).click()" % json.dumps(name))
    for _ in range(12):
        if ev("BATTLE===null"): break
        pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000); 
        if ev("BATTLE!==null"): ev(ATTACK_JS)
        pg.wait_for_timeout(30)
    pg.wait_for_function("BATTLE===null", timeout=5000)
    assert ev("window.__r==='won'&&flag('t_won')&&S.gold>=110&&!$('battle').classList.contains('open')&&S.hp>0"), "winning gives gold and runs the win actions"
    # running (playtest #4): only wild creatures can be run from, and it can fail; pirates never let you go
    ev("FOES.t_wild={n:'Wild spirit',hp:30,hit:[1,1],xp:0,art:'ghost',look:{}};BATTLES.t_wild={foes:['t_wild'],ran:[{set:'t_ran'}]};window.__r=null;startBattle('t_wild',r=>{window.__r=r});window.__m=Math.random;Math.random=()=>.99"); pg.wait_for_timeout(50)
    assert ev("[...$('bt-menu').children].some(b=>b.textContent==='Run')"), "a wild creature can be run from"
    bclick("Run"); pg.wait_for_function("BATTLE!==null&&BATTLE.picking&&BATTLE.log.some(t=>/could not get away/.test(t))", timeout=5000)
    ev("Math.random=()=>0"); bclick("Run"); pg.wait_for_function("BATTLE===null", timeout=5000); ev("Math.random=__m")
    assert ev("window.__r==='ran'&&flag('t_ran')"), "running away works, but it can fail first"
    ev("window.__r=null;startBattle('t_win',r=>{window.__r=r})"); pg.wait_for_timeout(50)
    assert ev("![...$('bt-menu').children].some(b=>b.textContent==='Run')"), "there is no Run against pirates"
    ev("bEnd('lost')"); pg.wait_for_function("BATTLE===null", timeout=5000); ev("S.hp=50;S.gold=100;sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY")
    ev("window.__r=null;S.hp=1;S.gold=100;startBattle('t_win',r=>{window.__r=r});BATTLE.foes[0].hp=999;BATTLE.foes[0].max=999"); pg.wait_for_timeout(50); ev(ATTACK_JS); pg.wait_for_function("BATTLE===null", timeout=5000)
    assert ev("window.__r==='lost'&&flag('t_lost')&&sail===true&&S.hp>1&&S.gold===90"), "a knock-out wakes you on the boat with a tenth of your gold gone"
    # Batch 8 animations: a hit shows a slash, a flash and a number; a foe that blocks shows a shield and takes less; blocking yourself shows a shield; walking costs less stamina
    ev("window.__r=null;S.hp=50;S.sta=100;S.eq.weapon='sword';BATTLE_BLOCKS=true;FOES.t_blocker={n:'Blocker',hp:999,hit:[1,1],xp:0,block:1,look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}};BATTLES.t_blk={foes:['t_blocker']};startBattle('t_blk',r=>{window.__r=r})"); pg.wait_for_timeout(50)
    ev(ATTACK_JS); pg.wait_for_function("BATTLE.fx&&BATTLE.fx.some(q=>q==='shield')&&BATTLE.fx.some(q=>q.startsWith('dmg small'))&&BATTLE.fx.includes('slash')")
    assert ev("BATTLE.log.some(l=>/blocks!/.test(l))"), "a foe that blocks says so"
    ev("BATTLE.foes[0].hp=999;BATTLE.fx=[]"); pg.wait_for_function("BATTLE.picking===true"); bclick("Block")
    pg.wait_for_function("BATTLE.fx.filter(q=>q==='shield').length>=1&&BATTLE.fx.some(q=>q.startsWith('dmg'))")
    ev("BATTLE_BLOCKS=false;BATTLES.t_blk.foes=['pirate_grunt'];BATTLE.foes[0].hp=0;BATTLE.foes[0].alive=false"); ev("bEnd('ran')"); pg.wait_for_function("BATTLE===null")
    ev("BATTLE_BLOCKS=false;window.__r=null;startBattle('t_win',()=>{})"); pg.wait_for_timeout(50); ev(ATTACK_JS)
    pg.wait_for_function("BATTLE.fx&&BATTLE.fx.some(q=>/^dmg:-\\d+$/.test(q))&&BATTLE.fx.includes('slash')"); ev("bEnd('ran')"); pg.wait_for_function("BATTLE===null")
    assert ev("STAM.walk===0&&STAM.sail===0"), "walking and sailing cost no stamina"
    ev("sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;S.hp=50;S.eq.weapon=null;window.__r=null;BATTLES.t_boss={foes:['pirate_captain'],noRun:1,win:[{set:'t_bwon'}],escaped:[{set:'t_escaped'}]};startBattle('t_boss',r=>{window.__r=r})"); pg.wait_for_timeout(50)
    assert ev("BATTLE!==null&&![...$('bt-menu').children].some(b=>b.textContent==='Run')"), "a fight with noRun cannot be run from"
    pg.wait_for_function("[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000); ev("BATTLE.foes[0].hp=20"); ev(ATTACK_JS); pg.wait_for_function("BATTLE===null", timeout=5000)
    assert ev("window.__r==='escaped'&&flag('t_escaped')&&!flag('t_bwon')"), "a boss with flee runs away at low health and the escape actions run"
    ev("S.hp=50;S.eq.weapon='sword';BATTLES.t_three={foes:['pirate_grunt','pirate_gunner','pirate_grunt']};startBattle('t_three',()=>{})"); pg.wait_for_timeout(50)
    assert ev("document.querySelectorAll('.bt-foe').length===3"), "up to three foes show"
    ev("document.querySelectorAll('.bt-foe')[1].click()"); ev(ATTACK_JS); pg.wait_for_timeout(200); assert ev("BATTLE.foes[1].hp<BATTLE.foes[1].max&&BATTLE.foes[0].hp===BATTLE.foes[0].max"), "tapping a foe chooses who you hit"
    ev("S.hp=20;S.bag.cooked_fish=0;const fd=LIST('food')[0];add(fd,1);window.__fd=fd")
    pg.wait_for_function("[...$('bt-menu').children].some(b=>b.textContent==='Item')", timeout=5000); bclick("Item"); pg.wait_for_timeout(100)
    assert ev("[...$('bt-menu').children].some(b=>b.textContent.startsWith(ITEMS[__fd].n))"), "the Item menu lists food and potions"
    ev("S.hp=20"); bclick(ev("ITEMS[__fd].n")); pg.wait_for_timeout(300); assert ev("S.hp>20||count(__fd)===0"), "using an item heals"
    ev("BATTLE.over=1;BATTLE.foes.forEach(f=>f.alive=false);bEnd('won')"); pg.wait_for_function("BATTLE===null", timeout=5000)
    ev("BATTLES.t_trg={foes:['pirate_grunt']};TRIGGERS.push({id:'t_btl',when:{talk:'Odo'},do:[{battle:'t_trg'},{set:'t_after_battle'}]});BATTLE=null;S.hp=50;(()=>{const n=NPC.find(q=>q.n==='Odo');P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&!flag('t_after_battle')"), "a trigger can start a battle and waits for it"
    ev("BATTLE.foes[0].hp=1");
    pg.wait_for_function("[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000); ev(ATTACK_JS); pg.wait_for_function("BATTLE===null", timeout=5000); pg.wait_for_timeout(100)
    assert ev("flag('t_after_battle')"), "the trigger carries on after the battle"
    ev("BATTLE_FAST=false;tmOpen('pause');[...document.querySelectorAll('#title-body button')].find(b=>b.textContent==='Test: jump to a quest').click()")
    assert ev("[...document.querySelectorAll('#title-body button')].some(b=>/^Fight: Pirate grunt$/.test(b.textContent))"), "the testing menu can start a fight"
    ev("tmClose()")
    # encounters (3.3): an action starts a group of pirates standing in the world; each is fought through the battle screen; the ones beaten stay beaten through a reload; the last one sets the done flag, runs the win actions and fires {beaten}
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;P.x=P.rx=32+OX;P.y=P.ry=33+OY;S.hp=50;S.sta=100;S.eq.weapon='sword';add('sword');NPC.forEach(n=>{n.busy=1});ENCOUNTERS.push({id:'t_enc',mode:'battle',near:1,foes:[{foe:'pirate_grunt',at:[-2,-2]},{foe:'pirate_grunt',at:[2,-2]}],win:[{set:'t_enc_won'}]});TRIGGERS.push({id:'t_enc_beaten',when:{beaten:'t_enc'},do:[{set:'t_enc_trigger'}]});startEncounter('t_enc')")
    assert ev("encFigures('t_enc').length===2&&flag('enc_t_enc_on')&&!flag('enc_t_enc_done')&&encFigures('t_enc').every(n=>WK.includes(at(n.x,n.y)))"), "starting an encounter puts its foes in the world"
    ev("(()=>{const n=encFigures('t_enc')[0];P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&BATTLE.foes.length===1"), "facing a foe and pressing Use starts a fight with it"
    for _ in range(14):
        if ev("BATTLE===null"): break
        pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000)
        if ev("BATTLE!==null"): ev(ATTACK_JS)
        pg.wait_for_timeout(30)
    pg.wait_for_function("BATTLE===null", timeout=5000)
    assert ev("encFigures('t_enc').length===1&&encDown('t_enc').length===1&&!flag('enc_t_enc_done')"), "a beaten foe is gone and the others wait"
    ev("S.hp=50;save()"); pg.reload(); pg.wait_for_timeout(500)
    ev("ENCOUNTERS.push({id:'t_enc',mode:'battle',near:1,foes:[{foe:'pirate_grunt',at:[-2,-2]},{foe:'pirate_grunt',at:[2,-2]}],win:[{set:'t_enc_won'}]});TRIGGERS.push({id:'t_enc_beaten',when:{beaten:'t_enc'},do:[{set:'t_enc_trigger'}]});BATTLE_FAST=true;BATTLE_BLOCKS=false;applyEncounters()")
    assert ev("encFigures('t_enc').length===1&&encFigures('t_enc')[0].enc.i===1"), "after a reload the beaten one stays beaten and the other is back"
    ev("S.hp=50;S.eq.weapon='sword';add('sword');NPC.forEach(n=>{n.busy=1});(()=>{const n=encFigures('t_enc')[0];P.x=P.rx=n.x;P.y=P.ry=n.y+1;P.f='u';act()})()"); pg.wait_for_timeout(100)
    for _ in range(14):
        if ev("BATTLE===null"): break
        pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000)
        if ev("BATTLE!==null"): ev(ATTACK_JS)
        pg.wait_for_timeout(30)
    pg.wait_for_function("BATTLE===null", timeout=5000); pg.wait_for_timeout(100)
    assert ev("flag('enc_t_enc_done')&&flag('t_enc_won')&&flag('t_enc_trigger')&&encFigures('t_enc').length===0"), "the last foe finishes it: done flag, win actions, and the beaten trigger"
    ev("S.hp=50;ENEMY_TYPES.t_imp2={n:'Imp',hp:6,dmg:2,cd:1,speed:1,chase:6,art:'ghost',xp:1,respawn:0};ENCOUNTERS.push({id:'t_rt',mode:'realtime',near:1,foes:[{type:'t_imp2',at:[3,-2]},{type:'t_imp2',at:[4,-2]}],win:[{set:'t_rt_won'}]});startEncounter('t_rt')")
    assert ev("ENEMIES.filter(e=>e.group==='t_rt').length===2"), "a real-time encounter spawns its enemies as a group"
    for _k in range(2):
        ev("(()=>{const e=ENEMIES.find(q=>q.group==='t_rt'&&q.alive);P.x=P.rx=e.x;P.y=P.ry=e.y+1;P.f='u';S.hp=50;act()})()"); pg.wait_for_timeout(100); fight_out()
    assert ev("flag('enc_t_rt_done')&&flag('t_rt_won')&&ENEMIES.filter(e=>e.group==='t_rt').length===0"), "beating the group finishes a real-time encounter"
    ev("BATTLE_FAST=false;tmOpen('pause');[...document.querySelectorAll('#title-body button')].find(b=>b.textContent==='Test: jump to a quest').click()")
    assert ev("[...document.querySelectorAll('#title-body button')].some(b=>/^Encounter: Three pirates, one by one$/.test(b.textContent))"), "the testing menu can start an encounter"
    ev("tmClose()")
    # the giant centipede (3.2): four live in the Darkwood on walkable ground, it draws facing every way and on the battle screen, fights with its own numbers, drops its fang and gold, and is back each morning
    ev("ENEMIES.forEach(e=>{if(e.t==='centipede')e.resp=0});enemiesMorning()")
    assert ev("(()=>{const c=ENEMIES.filter(e=>e.t==='centipede');return c.length>=4&&c.every(e=>e.y>=FY&&WK.includes(at(e.x,e.y))&&e.alive)&&ENEMY_TYPES.centipede.art==='centipede'})()"), "four centipedes wait in the Darkwood on walkable ground"
    assert ev("(()=>{let bad=0;sail=false;const c=ENEMIES.find(e=>e.t==='centipede');P.x=P.rx=c.x;P.y=P.ry=c.y+3;for(const f of'lrud'){c.f=f;try{draw()}catch(e){bad++}}c.hp=5;try{draw()}catch(e){bad++}c.hp=c.max;c.pois=performance.now()+2000;try{draw()}catch(e){bad++}c.pois=0;return bad===0})()"), "it draws in every direction, hurt and poisoned"
    ev("(()=>{const c=ENEMIES.find(e=>e.t==='centipede');window.__c=c;S.hp=50;S.gold=0;S.bag.centipede_fang=0;S.sta=100;S.eq.weapon='sword';add('sword');P.x=P.rx=c.x;P.y=P.ry=c.y+1;P.f='u';c.cd=0;window.__r0=Math.random;enemiesTick()})()"); pg.wait_for_timeout(100)
    assert ev("BATTLE!==null&&BATTLE.foes[0].t.n==='Giant centipede'&&BATTLE.foes[0].t.art==='centipede'&&BATTLE.foes[0].hp===30&&BATTLE.foes[0].t.hit[0]===3&&BATTLE.foes[0].t.hit[1]===6"), "a centipede that reaches the player starts a battle with its own numbers"
    assert ev("(()=>{const px=cv=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;return n};const bg=$('bt-bg').getContext('2d').getImageData(0,0,122,150).data,cols=new Set();for(let i=0;i<bg.length;i+=4*61)cols.add(bg[i]+','+bg[i+1]+','+bg[i+2]);return px(BATTLE.foes[0].cv)>300&&cols.size>12&&BATTLE.foes[0].el.querySelector('.bt-shadow')!==null})()"), "the creature is drawn on the battle screen, standing on a painted green field with a shadow"
    ev("Math.random=()=>0"); fight_out(); ev("Math.random=__r0")
    assert ev("!__c.alive&&S.gold>=5&&S.gold<=15&&S.bag.centipede_fang===1&&ITEMS.centipede_fang.kind==='material'"), "beating it gives gold and a fang"
    ev("enemiesMorning()"); assert ev("__c.alive&&__c.hp===__c.max&&__c.x===__c.hx"), "it is back at home the next morning"
    # the opening (4.0): a new game plays the festival scene (decorations up, Murl's lines, Skip works), the morning after takes the decorations down, and the first boarding of the boat in the village brings the stranger's letter and starts Quest 1
    ev("storyReset();BATTLE_FAST=false;NPC.forEach(n=>{n.busy=0});sail=false;P.x=P.rx=156;P.y=P.ry=124;ENEMIES.forEach(e=>{if(e.t==='centipede'){e.alive=false;e.resp=1e9}})")
    assert ev("!flag('festival_on')&&!flag('festival_done')&&FESTIVAL_ON===false"), "no festival before a new game starts"
    ev("window.__home=NPC.map(n=>[n.n,n.x,n.y]);fireTriggers('start')"); pg.wait_for_timeout(1500)
    assert ev("SCENE!==null&&SCENE.cine===true&&flag('festival_on')&&FESTIVAL_ON===true"), "starting a new game plays the festival cinematic with the decorations switched on"
    assert ev("$('cine').classList.contains('on')&&SCENE_LIGHT!==null&&SCENE_LIGHT<.9&&FESTIVAL_BUILD===0&&P.x===156&&P.y===108"), "film bars slide in, it starts in the dark before sunrise, no decorations yet, and the player is out of sight"
    ev("(()=>{try{draw()}catch(e){window.__e=String(e)}})()"); assert ev("window.__e===undefined"), "the cinematic frames draw"
    ev("$('wrap').click()"); pg.wait_for_timeout(150)   # a tap anywhere skips a cinematic
    assert ev("SCENE===null&&flag('festival_done')&&FESTIVAL_ON===true&&FESTIVAL_BUILD===1&&SCENE_LIGHT===null&&!$('cine').classList.contains('on')&&!dlgActive()&&P.x===156&&P.y===126&&S.eq.boat==='rowboat'"), "a tap ends it with the festival done, the decorations up, normal light, the bars gone and the player at the pier with the rowboat"
    assert ev("__home.filter(([n])=>FEST_CROWD.includes(n)||n==='Murl').every(([n,x,y])=>{const q=NPC.find(p=>p.n===n);return Math.abs(q.x-x)+Math.abs(q.y-y)<=2})"), "everyone the cinematic moved is back where they were"
    ev("fireTriggers('start')"); assert ev("SCENE===null"), "the festival plays once"
    assert ev("!flag('letter1_read')&&S.story.q===null"), "no letter until the boat"
    ev("fireTriggers('day')"); assert ev("!flag('festival_on')&&FESTIVAL_ON===false"), "the morning after, the decorations come down"
    ev("sail=false;P.x=P.rx=B.x;P.y=P.ry=B.y-1;P.f='d';act()"); pg.wait_for_function("GULL!==null", timeout=10000)
    assert ev("sail===true&&SCENE!==null&&GULL!==null"), "boarding the boat in the village brings a seagull"
    pg.wait_for_function("$('letter').classList.contains('open')", timeout=15000); assert ev("/Please come quick! Strangers are taking over the northern water temple. There is no time to waste! Hurry!!/.test($('letter-text').textContent)"), "the stranger's letter opens, in Jack's words"
    pg.tap("#letter-close"); pg.wait_for_function("SCENE===null", timeout=15000)
    assert ev("SCENE===null&&flag('letter1_read')&&hasLetter('q1_letter')&&S.story.q==='q1'&&/Quest 1|Stranger/.test(QUESTS.find(q=>q.id==='q1').name)"), "the letter is kept and Quest 1 starts"
    ev("sail=false;P.x=P.rx=B.x;P.y=P.ry=B.y-1;P.f='d';act()"); assert ev("SCENE===null"), "the letter comes only once"
    ev("storyJump('q1')"); assert ev("S.story.q==='q1'&&hasLetter('q1_letter')&&flag('festival_done')&&P.x===156&&P.y===125"), "the testing menu can jump to the start of Quest 1"
    ev("storyReset();setFlag('festival_done',0)")
    # Quest 1 (4.1): the courtyard fires the pirate encounter; the three are fought one by one; the last one's flight and the stranger's scene give the compass and finish the quest; the village news follows; the compass draws its arrow
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;storyReset();ENEMIES.forEach(e=>{if(e.t==='centipede'){e.alive=false;e.resp=1e9}});NPC.forEach(n=>{n.busy=1});S.hp=50;S.sta=100;S.eq.weapon='sword';add('sword');S.bag.grandfather_compass=0;storyJump('q1')")
    assert ev("S.story.q==='q1'&&hasLetter('q1_letter')&&questGoal()[0]===283&&count('grandfather_compass')===0"), "Quest 1 begins with the letter, a goal and no compass yet"
    assert ev("DLG.q1_pirate.nodes.a.text===\"This isn't over! You'll see! Just wait till the rest of us get here! Then you'll wish you had never messed with The Fleet!\"&&/^Thank you so much\\. They were just about to break into the sacred Vault\\./.test(DLG.q1_stranger.nodes.b.text)&&/^Have you heard! Pirates have been sighted taking over Fire Island/.test(DLG.q1_villager.nodes.a.text)"), "Jack's three lines are in word for word"
    assert ev("encFigures('q1_pirates').length===0&&S.story.step===0"), "no pirates before the player lands"
    ev("sail=true;const wp=nearestTile(283,47,(x,y)=>at(x,y)===1);P.x=P.rx=wp[0];P.y=P.ry=wp[1]+1;sail=false;move('u')"); pg.wait_for_timeout(100)
    assert ev("encFigures('q1_pirates').length===5&&S.story.step===1&&!dlgActive()&&encFigures('q1_pirates').filter(n=>n.y>=38&&n.y<=43&&n.x>=282&&n.x<=284).length===2&&encFigures('q1_pirates').every(n=>WK.includes(at(n.x,n.y)))"), "the first step ashore puts five pirates at their posts, two of them on the path to the temple (the player says nothing)"
    for k in range(5):
        ev("(()=>{const n=encFigures('q1_pirates')[0];P.x=P.rx=n.x;P.y=P.ry=n.y+1;if(!WK.includes(at(P.x,P.y))){P.y=P.ry=n.y-1;P.f='d'}else P.f='u';S.hp=50;act()})()"); pg.wait_for_timeout(100)
        for _ in range(20):
            if ev("BATTLE===null"): break
            pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000)
            if ev("BATTLE!==null"): ev(ATTACK_JS)
            pg.wait_for_timeout(30)
        pg.wait_for_function("BATTLE===null", timeout=5000); pg.wait_for_timeout(50)
    pg.wait_for_function("SCENE!==null", timeout=5000)
    assert ev("flag('enc_q1_pirates_done')&&S.story.step===2&&SCENE.id==='q1_aftermath'"), "beating the fifth pirate starts the aftermath scene"
    ev("skipScene()"); pg.wait_for_timeout(100)
    assert ev("SCENE===null&&flag('q1_done')&&flag('has_compass')&&flag('pirate_base_known')&&flag('pirates_called')&&count('grandfather_compass')===1&&S.story.q===null&&S.story.done.includes('q1')&&NPC.find(n=>n.n==='Old Stranger').hidden===1&&P.x===283&&P.y===33"), "Skip lands with the compass given (Quest 2 not in the log yet), Quest 1 finished and the stranger gone inside"
    ev("sail=false;P.x=P.rx=283;P.y=P.ry=38;QUESTS.push({id:'t_goal',name:'Goal test',steps:['x'],goal:[283,60]});questSet('t_goal',0)"); assert ev("questGoal()[1]===60"), "a quest names its goal for the compass"
    assert ev("(()=>{let bad=0;for(const[x,y]of[[283,38],[283,55],[290,70],[250,40]]){sail=false;P.x=P.rx=x;P.y=P.ry=y;try{draw()}catch(e){bad++}}return bad===0})()"), "the compass arrow draws when the goal is near and when it is far"
    ev("S.bag.grandfather_compass=0;P.x=P.rx=283;P.y=P.ry=38;draw();S.bag.grandfather_compass=1;questSet(null)")
    ev("openBag();bs=7;bc=cellsOf(7).findIndex(r=>r.id==='grandfather_compass');drawBag();bagPick()"); assert ev("!$('bpop').classList.contains('open')"), "the compass is a key item with nothing to equip"; ev("closeBag()")
    ev("(()=>{const m=dailyEvents();window.__m=m})()"); assert ev("flag('pirates_here')&&NPC.filter(n=>n.pirate).length===10"), "the pirates take Fire Island at the next sleep"
    ev("sail=true;B.x=156;B.y=130;P.x=P.rx=156;P.y=P.ry=130;move('l');move('r')"); assert ev("SCENE===null&&sail===true&&at(B.x,B.y)===0"), "sailing around the village does not start the villager's scene or put the boat on land"
    ev("sail=false;P.x=P.rx=156;P.y=P.ry=129;move('u')"); assert ev("SCENE===null"), "one step on land is not enough"
    ev("move('u')"); pg.wait_for_function("SCENE!==null", timeout=5000); ev("skipScene()"); pg.wait_for_timeout(100)
    assert ev("at(B.x,B.y)===0&&sail===false"), "the boat stays on the water"
    assert ev("SCENE===null&&flag('q1_villager_gone')&&NPC.find(n=>n.n==='Villager').hidden===1&&P.x===156&&P.y===126"), "back in the village the villager runs up with the news and then leaves"
    ev("storyReset();BATTLE_FAST=false;NPC.forEach(n=>{n.busy=0})")
    # Quest 2 (4.2): Bjorn, Garrick (sword), the forest and its boulder, Rue, Garrick (pickaxe), Rue at home, Bjorn's reward; Bram hides the sword and pickaxe until they are handed out
    def talk(name):
        ev("(()=>{const n=NPC.find(q=>q.n===%s&&!q.hidden);sail=false;const f=[[0,1,'u'],[0,-1,'d'],[1,0,'l'],[-1,0,'r']].find(([a,b])=>{const x=n.x+a,y=n.y+b;return WK.includes(at(x,y))&&!npcAt(x,y)});P.x=P.rx=n.x+f[0];P.y=P.ry=n.y+f[1];P.f=f[2];act()})()" % json.dumps(name))
        ev("for(let i=0;i<30&&dlgActive();i++)dlgAdvance()")
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;storyReset();sail=false;NPC.forEach(n=>{n.busy=1});ENEMIES.forEach(e=>{if(e.t==='centipede'){e.alive=false;e.resp=1e9}});S.bag.sword=0;S.eq.weapon=null;S.bag.pickaxe=0;S.eq.pickaxe=null;S.bag.healing_potion=0;S.bag.stamina_tonic=0;S.hp=50;storyJump('q2')")
    assert ev("S.story.q==='q2'&&S.story.step===0&&Math.abs(questGoal()[0]-155)+Math.abs(questGoal()[1]-104)<=2&&NPC.find(n=>n.n==='Bjorn the Elder').hidden===0&&NPC.find(n=>n.n==='Rue').hidden===1"), "Quest 2 begins with the compass pointing at Bjorn; Rue is not about yet"
    assert ev("DLG.q2_bjorn1.nodes.a.text.startsWith('Ahh! Thanks for coming to see me. I\\'m guessing you heard.')&&DLG.q2_garrick1.nodes.a.text.endsWith('Take this and stay safe')&&DLG.q2_rue1.nodes.a.text==='Boy am I glad to see you. Bjorn sent the right person for the job. Let\\'s get out of here, eh?'&&DLG.q2_garrick2.nodes.a.text.startsWith('Impressive work lad.')&&DLG.q2_rue2.nodes.a.text.startsWith('I sure am grateful')&&DLG.q2_bjorn2.nodes.a.text.startsWith('Well well well.')"), "Jack\\'s six lines are in word for word"
    ev("setFlag('q2_got_sword',0);setFlag('q2_got_pickaxe',0);openStore('rod')"); assert ev("!/Sword|Pickaxe/.test($('items').textContent)"), "Bram does not sell the sword or pickaxe yet"
    talk("Bjorn the Elder"); assert ev("flag('q2_started')&&S.story.step===1&&!dlgActive()&&questGoal()!==null"), "Bjorn starts the quest and sends the player to Garrick"
    talk("Garrick"); assert ev("flag('q2_got_sword')&&count('sword')===1&&S.eq.weapon==='sword'&&S.story.step===2"), "Garrick gives a sword (one copy, equipped)"
    ev("openStore('rod')"); assert ev("!/Sword/.test($('items').textContent)&&!/Pickaxe/.test($('items').textContent)"), "Bram never sells swords (only Garrick does) and not the pickaxe yet"
    assert ev("(()=>{const n=NPC.find(q=>q.n==='Rue');return n.hidden===0&&n.y>=FY&&WK.includes(at(n.x,n.y))})()"), "Rue waits by the woodcutter's cottage in the Darkwood"
    assert ev("at(134,26+FY)===36&&!walkable(134,26+FY)&&!!gateAt(134,26+FY)"), "a boulder shuts the forest's east trail"
    ev("P.x=P.rx=133;P.y=P.ry=26+FY;P.f='r';S.eq.pickaxe=null;act()"); assert ev("at(134,26+FY)===36&&/pickaxe/.test($('msg').textContent)"), "without a pickaxe the boulder only says why"
    talk("Rue"); assert ev("flag('q2_rue_found')&&S.story.step===3&&NPC.find(n=>n.n==='Rue').hidden===1"), "Rue is found and leaves the forest"
    talk("Garrick"); assert ev("flag('q2_got_pickaxe')&&flag('blacksmith_buys_ore')&&count('pickaxe')===1&&S.eq.pickaxe==='pickaxe'&&S.story.step===4&&(()=>{const n=NPC.find(q=>q.n==='Rue');return n.hidden===0&&Math.abs(n.x-153)+Math.abs(n.y-122)<=2&&WK.includes(at(n.x,n.y))})()   /* (a villager standing on the exact tile moves her to the next free one) */"), "Garrick gives the pickaxe and Rue is home in the village"
    ev("P.x=P.rx=133;P.y=P.ry=26+FY;P.f='r';act()"); assert ev("flag('forest_boulder_open')&&at(134,26+FY)!==36&&walkable(134,26+FY)"), "with the pickaxe the boulder breaks for good"
    ev("openStore('rod')"); assert ev("/Pickaxe/.test($('items').textContent)"), "Bram sells the pickaxe now"
    talk("Rue"); assert ev("flag('q2_rue_home')&&flag('crew_1')&&flag('lost_man_home')&&S.story.step===5"), "Rue is thankful and becomes the first crew member"
    # Rue can be hired after the quest (crew_1) but does not join until you find him and pay 2,500
    assert ev("!flag('crew_rue')&&crewHave()===1"), "Rue does not join the crew by himself"
    ev("S.gold=100");talk("Rue"); assert ev("!!mn&&/2,500g/.test($('menu-t').textContent)"), "talking to Rue offers to hire him for 2,500"
    ev("mn.i=0;menuPick()"); assert ev("!flag('crew_rue')&&S.gold===100"), "too poor to hire Rue"
    ev("S.gold=3000");talk("Rue"); ev("mn.i=0;menuPick()"); assert ev("flag('crew_rue')&&S.gold===500&&crewHave()===2"), "paying 2,500 puts Rue on the crew"
    ev("S.flags.crew_rue=0;S.gold=0")
    talk("Bjorn the Elder"); assert ev("flag('q2_done')&&count('healing_potion')===1&&count('stamina_tonic')===1&&S.story.q===null&&S.story.done.includes('q2')"), "Bjorn's reward finishes the quest"
    ev("storyJump('q3')"); assert ev("S.story.q==='q3'&&S.story.done.includes('q2')&&count('sword')===1&&count('pickaxe')===1&&flag('crew_1')"), "the testing menu can start Quest 3 with Quest 2 done"
    # Quest 3 (5.3): Murl, Oak Island's ironwood logs, 100 gold, and Hale's axe (Bram stops selling it until then)
    ev("S.bag.woodcutters_axe=0;S.eq.axe=null;S.gold=0;S.bag.ironwood_log=0")
    assert ev("LAND.some(l=>l[0]==='Oak Island')&&(()=>{let n=0;for(let y=160;y<=180;y++)for(let x=135;x<=153;x++)if(at(x,y)===140)n++;return n===3})()"), "three ironwood logs lie on Oak Island"
    assert ev("DLG.q3_murl1.nodes.a.text.startsWith('Old Bjorn sent ya did he?')&&DLG.q3_murl_got.nodes.a.text.endsWith('it\\'s all yours')"), "Murl's two speeches are Jack's words"
    ev("setFlag('q3_started',0);openStore('rod')"); assert ev("!/Woodcutter/.test($('items').textContent)"), "Bram does not sell the axe any more"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    talk("Murl"); assert ev("flag('q3_started')&&S.story.q==='q3'&&S.story.step===0&&!dlgActive()&&Math.abs(questGoal()[0]-144)<=2"), "Murl starts Quest 3 and the compass points at Oak Island"
    talk("Murl"); assert ev("!flag('q3_done')&&!dlgActive()"), "without the log Murl just reminds you"
    def log_tile():
        return ev("(()=>{for(let y=160;y<=180;y++)for(let x=135;x<=153;x++)if(at(x,y)===140)return [x,y]})()")
    def face_log(lx, ly):
        ev("(()=>{sail=false;const f=[[0,1,'u'],[0,-1,'d'],[1,0,'l'],[-1,0,'r']].find(([a,b])=>WK.includes(at(%d+a,%d+b))&&!npcAt(%d+a,%d+b));P.x=P.rx=%d+f[0];P.y=P.ry=%d+f[1];P.f=f[2];act()})()" % (lx, ly, lx, ly, lx, ly)); ev("for(let i=0;i<30&&dlgActive();i++)dlgAdvance()")
    lx, ly = log_tile()
    ev("setFlag('q3_started',0)"); face_log(lx, ly); assert ev("count('ironwood_log')===0&&at(%d,%d)===140" % (lx, ly)), "the log stays until Murl has asked for it"
    ev("setFlag('q3_started')"); face_log(lx, ly)
    assert ev("count('ironwood_log')===1&&flag('q3_got_log')&&S.story.step===1&&at(%d,%d)===1&&S.cut[%d*MW+%d].m===140&&questGoal()!==null" % (lx, ly, ly, lx)), "you pick up an ironwood log (no axe needed) and are sent back to Murl"
    lx2, ly2 = log_tile(); face_log(lx2, ly2); assert ev("count('ironwood_log')===1"), "only one log is carried"
    talk("Murl"); assert ev("flag('q3_done')&&flag('axe_waiting')&&S.gold===100&&count('ironwood_log')===0&&S.story.q===null&&S.story.done.includes('q3')"), "Murl pays 100 gold and takes the log"
    talk("Hale"); assert ev("flag('has_axe')&&count('woodcutters_axe')===1&&S.eq.axe==='woodcutters_axe'"), "Hale gives the woodcutter's axe"
    talk("Hale"); assert ev("count('woodcutters_axe')===1"), "only one axe"
    # Quest 4 (5.4): the second letter, the pirates at the Earth temple, the key, and the Temple Tower (boots)
    def fight_all(enc, n, strong=False):   # strong: the tougher temple pirates, fought with an iron sword and plenty of health
        for k in range(n):
            ev(("(()=>{const n=encFigures('%s')[0];P.x=P.rx=n.x;P.y=P.ry=n.y+1;if(!WK.includes(at(P.x,P.y))){P.y=P.ry=n.y-1;P.f='d'}else P.f='u';" % enc)+("add('iron_sword');S.eq.weapon='iron_sword';S.hp=400;" if strong else "S.hp=50;")+"S.sta=100;act()})()"); pg.wait_for_timeout(100)
            for _ in range(20):
                if ev("BATTLE===null"): break
                pg.wait_for_function("BATTLE===null||[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=5000)
                if ev("BATTLE!==null"): ev(ATTACK_JS)
                pg.wait_for_timeout(30)
            pg.wait_for_function("BATTLE===null", timeout=5000); pg.wait_for_timeout(50)
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;storyReset();sail=false;NPC.forEach(n=>{n.busy=1});ENEMIES.forEach(e=>{e.cd=1e9});S.hp=50;S.eq.weapon='sword';add('sword');['q3_started','q3_done','axe_waiting','has_axe'].forEach(f=>setFlag(f,1))")
    ev("P.x=P.rx=60;P.y=P.ry=170;P.f='d';fireTriggers('step')"); pg.wait_for_function("SCENE!==null", timeout=10000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=10000)
    assert ev("hasLetter('q4_letter')&&flag('q4_started')&&S.story.q==='q4'&&S.story.step===0&&LETTERS.q4_letter.text.startsWith('I\\'ve just received word')&&LETTERS.q4_letter.text.endsWith('You must stop them.')"), "the second letter comes the first time you walk on the mainland"
    ev("P.x=P.rx=12;P.y=P.ry=40;P.f='u';fireTriggers('step')")
    assert ev("flag('q4_gate_started')&&S.story.step===1&&encFigures('q4_gate').length===3&&encFigures('q4_gate').every(n=>WK.includes(at(n.x,n.y)))"), "three pirates hold the temple path"
    fight_all('q4_gate', 3, True); assert ev("flag('enc_q4_gate_done')&&S.story.step===2"), "beating them lets you in"
    ev("P.x=P.rx=6;P.y=P.ry=15;P.f='u';act()"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q4_overhear'", timeout=6000)
    assert ev("zoneOf(P.x,P.y)===5&&encFigures('q4_grunts').length===2&&DLG.q4_grunt1.nodes.a.text.startsWith('You sure the boss is right?')"), "going into the sanctum starts the overheard scene with two grunts"
    ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    fight_all('q4_grunts', 2, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q4_aftermath'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("count('earth_key')===1&&flag('q4_key_got')&&!flag('q4_girl_here')&&S.story.step===3&&NPC.find(n=>n.n==='Mysterious Girl').hidden===1&&DLG.q4_girl2.nodes.a.text.endsWith('where they will be safe.')"), "the girl gives the Earth Key and goes"
    assert ev("S.story.q==='q4'&&Math.abs(questGoal()[0]-212)<=2"), "the compass now points at the Temple Tower"
    ev("sail=false;P.x=P.rx=212;P.y=P.ry=205;P.f='u';act()"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q4_tower'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("flag('q4_done')&&flag('earth_key_at_tower')&&count('earth_key')===0&&S.eq.boots==='enchanted_boots'&&S.story.q==='q5'&&S.story.step===0&&S.story.done.includes('q4')&&(()=>{const o=NPC.find(n=>n.n==='Old Stranger');return o.hidden===0&&o.hx===163&&o.hy===TS.y0+6&&zoneOf(o.x,o.y)===10})()"), "the old man keeps the key, gives the boots and stays in the tower"
    assert ev("DLG.q4_old1.nodes.a.text.startsWith('Oh Good work!')&&DLG.q4_old2.nodes.a.text.endsWith('here I will keep them safe.')"), "the old man's speech is Jack's, in two parts"
    assert ev("(S.buff=0,sail=false,stepMs()===BOOT_MS)&&(sail=true,stepMs()===STEP_MS.sail)&&(sail=false,S.buff=Date.now()+5e4,stepMs()===SWIFT_MS.walk)&&(S.buff=0,true)&&BOOT_MS<STEP_MS.walk&&BOOT_MS>SWIFT_MS.walk"), "boots walk faster than normal but not as fast as the swiftness potion; sailing is unchanged"
    # Quest 5 (5.5): the Sea temple vault, the Sea Key and the enchanted armour at the Tower
    assert ev("S.story.q==='q5'&&Math.abs(questGoal()[1]-40)<=2"), "Quest 4 hands over to Quest 5 and the compass points at the Sea temple"
    ev("P.x=P.rx=283;P.y=P.ry=32;P.f='u';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===6", timeout=5000); pg.wait_for_function("S.story.step===1", timeout=5000)
    assert ev("flag('q5_hall')&&S.story.step===1"), "going into the temple hall sends you after the pirates"
    ev("sail=false;P.x=HZ.dx;P.y=HZ.y0+7;P.rx=P.x;P.ry=P.y;P.f='u';act()"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q5_vault'", timeout=6000)
    assert ev("zoneOf(P.x,P.y)===7&&encFigures('q5_pirates').length===6&&flag('q5_vault_blasted')&&at(217,VZ.y0+4)===73&&encFigures('q5_pirates').every(n=>WK.includes(at(n.x,n.y)))"), "the vault is blown open and three pirates wait in it"
    ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    fight_all('q5_pirates', 6, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q5_aftermath'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("count('sea_key')===1&&flag('q5_key_got')&&S.story.step===3&&Math.abs(questGoal()[0]-212)<=2"), "the pirates run and you take the Sea Key back"
    ev("sail=false;P.x=P.rx=212;P.y=P.ry=205;P.f='u';act()"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q5_tower'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("flag('q5_done')&&flag('sea_key_at_tower')&&count('sea_key')===0&&S.eq.armour==='enchanted_armour'&&S.story.q==='q6'&&S.story.step===0&&S.story.done.includes('q5')&&(()=>{const g=NPC.find(n=>n.n==='Mysterious Girl');return g.hidden===0&&zoneOf(g.x,g.y)===10})()&&DLG.q5_girl.nodes.a.text.startsWith(\"I'm glad I caught you.\")"), "the girl gives the enchanted armour and both keys rest at the tower"
    assert ev("(()=>{S.hp=50;const w=fx('ward');return w===.2})()"), "the armour lowers damage by 20%"
    # Quest 6 (5.6): the Sky temple path, the explosion, seven pirates and their boss, the crying boy and the Sky Helm
    assert ev("Math.abs(questGoal()[0]-222)<=2&&!flag('sky_damaged')"), "Quest 5 hands over to Quest 6 and the compass points at the Sky temple's beach"
    ev("sail=false;P.x=P.rx=222;P.y=P.ry=158;P.f='u';fireTriggers('step')"); pg.wait_for_function("flag('enc_q6_pirates_on')", timeout=6000)
    assert ev("encFigures('q6_pirates').length===7&&encFigures('q6_pirates').every(n=>WK.includes(at(n.x,n.y)))&&[148,142,136].every(y=>encFigures('q6_pirates').filter(n=>n.y===y).length===2)&&encFigures('q6_pirates').every(n=>n.y>=130)"), "seven pirates are scattered up the hill path, two on each lower terrace, as soon as you land (playtest #4)"
    ev("sail=false;P.x=P.rx=225;P.y=P.ry=142;P.f='u';fireTriggers('step')"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q6_boom'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("flag('sky_damaged')&&flag('q6_boom')&&S.story.step===1&&at(236,108)!==80"), "halfway up an explosion ruins the temple on the plateau"
    assert ev("!flag('enc_q6_pirates_done')&&NPC.find(n=>n.n==='Captain Barron').hidden===1"), "the boss does not come until every pirate on the path is beaten"
    fight_all('q6_pirates', 7, True)
    ev("P.x=P.rx=236;P.y=P.ry=129;P.f='u';sail=false;fireTriggers('step')"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q6_barron'", timeout=6000)
    pg.wait_for_function("(()=>{const b=NPC.find(n=>n.n==='Captain Barron');return b.hidden===0&&Math.abs(b.x-P.x)+Math.abs(b.y-P.y)===1})()", timeout=15000)   # he walks down the path and stops beside you
    assert ev("S.story.step===2&&NPC.find(n=>n.n==='Captain Barron').scale>1&&DLG.q6_barron1.nodes.a.text.startsWith('Who is this little dog')"), "Captain Barron comes walking down the path to meet you"
    ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=8000)
    assert ev("S.story.step===3&&flag('q6_barron_gone')&&NPC.find(n=>n.n==='Captain Barron').hidden===1&&flag('q6_boy_here')&&NPC.find(n=>n.n==='Mysterious Boy').hidden===0"), "the boss kicks dirt in your eyes and is gone; a boy is crying at the temple"
    ev("(()=>{const b=NPC.find(n=>n.n==='Mysterious Boy');P.x=P.rx=b.x;P.y=P.ry=b.y+1;P.f='u';sail=false;act()})()"); pg.wait_for_function("dlgActive()", timeout=5000)
    ev("dlgEnd();trgRunning=false"); pg.wait_for_timeout(200)
    assert ev("flag('q6_done')&&S.eq.helmet==='sky_helm'&&S.story.q===null&&S.story.done.includes('q6')&&DLG.q6_boy1.nodes.a.text.startsWith('Did the old man send you?')"), "the boy gives the Sky Helm"
    assert ev("fx('haste')===.2&&Math.abs(fx('ward')-.25)<1e-9&&playerLook().armour.helm==='sky'"), "the Sky Helm gives haste and is drawn on you"
    # Quest 7 (5.7): the seagull letter, the village under attack, three waves, the pirates flee, and the village is mended the next day
    ev("P.x=P.rx=222;P.y=P.ry=158;sail=true;B.x=222;B.y=158;fireTriggers('board')"); pg.wait_for_function("SCENE!==null", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("hasLetter('q7_letter')&&flag('q7_started')&&flag('village_attack')&&S.story.q==='q7'&&S.story.step===0&&LETTERS.q7_letter.text.startsWith('Pirates everywhere!')&&LETTERS.q7_letter.text.endsWith('COME QUICK!')"), "leaving the Sky island brings Bjorn's letter and the village comes under attack"
    assert ev("RAID_ON&&BL.filter(b=>b.raid).length===4&&BL.filter(b=>b.raid).every(b=>at(b.x+1,b.y+1)===101)&&drawRaid&&(()=>{draw();return true})()"), "four pirate ships lie offshore and the burning village draws"
    assert ev("(()=>{const shops=NPC.filter(n=>{const sr=n.shopRoom&&SHOP_ROOMS.find(q=>q.id===n.shopRoom),p=sr?{x:sr.door[0],y:sr.door[1]}:n;return(n.store||n.shop)&&p.x>=140&&p.x<=176&&p.y>=99&&p.y<=127});return shops.length>=3&&shops.every(n=>n.dlg==='raid_closed_'+n.n)&&RAID_FIGHTERS.length>=8&&RAID_FIGHTERS.every(n=>n.hidden===0&&WK.includes(at(n.x,n.y))&&!(n.work==='sword'&&n.f!=='l')||n.work!=='sword')&&RAID_FIGHTERS.filter(n=>n.work==='sword').length===RAID_FIGHTERS.length/2})()"), "the shops are shut and villagers and pirates are fighting all over the village"
    ev("sail=false;BATTLE=null;P.x=P.rx=156;P.y=P.ry=126;P.f='u';fireTriggers('step')"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q7_wave1'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("S.story.step===1&&encFigures('q7_w1').length===3&&encFigures('q7_w1').every(n=>WK.includes(at(n.x,n.y)))"), "three pirates land at the pier"
    ev("S.bag.healing_potion=0"); fight_all('q7_w1', 3, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q7_between1'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("S.story.step===2&&count('healing_potion')===1&&encFigures('q7_w2').length===4&&encFigures('q7_w2').every(n=>WK.includes(at(n.x,n.y)))"), "a villager hands you a potion and four more pirates come"
    fight_all('q7_w2', 4, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q7_between2'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("S.story.step===3&&count('healing_potion')===2&&encFigures('q7_w3').length===5&&encFigures('q7_w3').every(n=>WK.includes(at(n.x,n.y)))"), "and the last five come"
    fight_all('q7_w3', 5, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q7_flee'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("flag('q7_done')&&S.story.done.includes('q7')&&S.story.q==='q8'&&flag('tower_raided')&&DLG.q7_flee.nodes.a.text.startsWith('Let’s get out of here!')&&!flag('village_attack')&&flag('village_burnt')&&!RAID_ON&&BL.filter(b=>b.raid).length===0&&at(136,107)===0"), "the pirates flee with Jack's words, the screen fades, and when it clears the pirates, ships and fires are gone but the burning houses are ruins"
    ev("sail=false;P.x=P.rx=156;P.y=P.ry=112;fireTriggers('day');draw()"); assert ev("flag('village_burnt')&&!flag('village_attack')&&RAID_BURN.length===7&&raidHouses().length>=9"), "the ruins stay after a night, and the village (with its ruins) draws without errors"
    assert ev("NPC.filter(n=>(n.store||n.shop)&&n.x>=140&&n.x<=176&&n.y>=99&&n.y<=127).every(n=>!n.dlg)&&RAID_FIGHTERS.every(n=>n.hidden===1)"), "and the shops open again and the fighting is over"
    # Quest 8 (5.8): the ransacked Tower, the letter, the hatch, the long dark Depths with ghosts and zombies, and the chamber where the spirits give the Divine Blade
    assert ev("S.story.step===0&&flag('tower_raided')&&at(TS.dx-4,TS.y1-2)===152&&!flag('q8_hatch')&&at(TS.dx,TS.y0+5)!==144"), "after Quest 7 the Tower is ransacked (stands toppled) and Quest 8 begins"
    ev("ENEMIES.forEach(e=>{e.cd=1e9});SCENE=null;BATTLE=null;sail=false;P.x=P.rx=212;P.y=P.ry=205;P.f='u';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===10", timeout=6000)
    for _ in range(25):
        if ev("flag('q8_hatch')&&SCENE===null&&!$('letter').classList.contains('open')&&!dlgActive()"): break
        ev("if(SCENE)skipScene()"); pg.wait_for_timeout(300)
    assert ev("hasLetter('q8_letter')&&flag('q8_hatch')&&S.story.step===1&&at(TS.dx,TS.y0+5)===144&&LETTERS.q8_letter.text==='Meet us in the chamber'&&NPC.find(n=>n.n==='Old Stranger').x===CZ.dx"), "going in finds the keys gone, brings the old man's note and opens the hatch"
    assert ev("(()=>{const seen=new Set([DEPTH_START[0]+','+DEPTH_START[1]]),q=[DEPTH_START],D4=[[1,0],[-1,0],[0,1],[0,-1]];let n=0;while(q.length){const[x,y]=q.shift();n++;for(const[a,b]of D4){const k=(x+a)+','+(y+b);if(!seen.has(k)&&WK.includes(at(x+a,y+b))&&zoneOf(x+a,y+b)===20){seen.add(k);q.push([x+a,y+b])}}}return seen.has(DEPTH_EXIT[0]+','+DEPTH_EXIT[1])&&n>350&&DEPTH_SPOTS.length>=26&&DEPTH_SPOTS.filter(s=>s.t==='depths_ghost').length>=11&&DEPTH_SPOTS.filter(s=>s.t==='zombie').length>=11&&DEPTH_SPOTS.every(s=>WK.includes(at(s.x,s.y))&&zoneOf(s.x,s.y)===20)&&ENEMIES.filter(e=>e.t==='zombie'||e.t==='depths_ghost').length===DEPTH_SPOTS.length})()"), "the Depths are one big connected maze from the stairs to the door, with a gauntlet of about 28 ghosts and zombies on its floor"
    # playtest #4: subtle traps in the Depths (dart plates with a wall hole across, fire vents), each with a free lane beside it, and poison
    assert ev("(()=>{let d=0,f=0,ok=true;for(let y=DZ.y0;y<=DZ.y1;y++)for(let x=DZ.x0;x<=DZ.x1;x++){const t=at(x,y);if(t===172){d++;if(![[0,2],[0,-2],[2,0],[-2,0]].some(([a,b])=>at(x+a,y+b)===173))ok=false}if(t===174)f++}return d>=5&&f>=5&&ok})()"), "the Depths hold dart plates (each with a hole in the wall across) and fire vents"
    ev("sail=false;S.hp=50;S.poison=0;(()=>{for(let y=DZ.y0;y<=DZ.y1;y++)for(let x=DZ.x0;x<=DZ.x1;x++)if(at(x,y)===172&&!window.__tp)window.__tp=[x,y]})();P.x=P.rx=__tp[0];P.y=P.ry=__tp[1];trapQuiet=0;trapStep()")
    assert ev("S.hp===50-Math.max(1,Math.round(TRAP_DART*(1-fx('ward'))))&&S.poison===POISON_STEPS&&TRAPFX.kind==='dart'&&/poisoned/.test($('msg').textContent)"), "a dart plate hurts and poisons"
    ev("S.hp=30;poisonStep();poisonStep()"); assert ev("S.hp===28&&S.poison===POISON_STEPS-2&&/PSN/.test($('hpn').textContent)"), "poison costs 1 health a step and shows PSN"
    ev("S.hp=1;poisonStep()"); assert ev("S.hp===1"), "poison never knocks you out"
    ev("S.hp=20;S.bag.healing_potion=1;drink('healing_potion')"); assert ev("S.poison===0&&S.hp>20"), "a healing potion cures poison"
    ev("S.hp=50;(()=>{for(let y=DZ.y0;y<=DZ.y1;y++)for(let x=DZ.x0;x<=DZ.x1;x++)if(at(x,y)===174&&!window.__tf)window.__tf=[x,y]})();P.x=P.rx=__tf[0];P.y=P.ry=__tf[1];trapQuiet=0;trapStep()"); assert ev("S.hp===50-Math.max(1,Math.round(TRAP_FIRE*(1-fx('ward'))))&&TRAPFX.kind==='fire'&&S.poison===0"), "a fire vent burns but does not poison"
    ev("draw();S.hp=50;P.x=P.rx=TS.dx-1;P.y=P.ry=TS.y0+5;S.poison=0")
    ev("P.x=P.rx=TS.dx-1;P.y=P.ry=TS.y0+5;P.f='r';sail=false;act()"); pg.wait_for_function("zoneOf(P.x,P.y)===20", timeout=5000); pg.wait_for_function("S.story.step===2", timeout=5000)
    assert ev("P.x===DEPTH_START[0]&&P.y===DEPTH_START[1]"), "the hatch leads down to the foot of the stairs in the Depths"
    ev("P.x=P.rx=DEPTH_STAIRS[0][0];P.y=P.ry=DEPTH_STAIRS[0][1]-1;P.f='d';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===10", timeout=5000); assert ev("P.x===TS.dx-1&&P.y===TS.y0+5"), "the stairs lead back up to the shrine room"
    ev("P.x=P.rx=TS.dx-1;P.y=P.ry=TS.y0+5;P.f='r';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===20", timeout=5000)
    ev("P.x=P.rx=DEPTH_EXIT[0];P.y=P.ry=DEPTH_EXIT[1];P.f='u';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===21", timeout=5000); pg.wait_for_function("SCENE!==null&&SCENE.id==='q8_meeting'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null&&!dlgActive()", timeout=8000)
    assert ev("count('divine_blade')===1&&S.eq.weapon==='divine_blade'&&flag('q8_done')&&flag('final_battle_open')&&S.story.done.includes('q8')&&S.story.q==='q9'&&DLG.q8_old1.nodes.a.text.startsWith('I knew you would make it here.')&&DLG.q8_old3.nodes.a.text.startsWith('Take this. This sword')"), "the old man's speech (Jack's words) ends with the Divine Blade in your hand, ready to wear"
    ev("P.x=P.rx=CZ.dx;P.y=P.ry=CZ.y1-1;P.f='d';act()"); pg.wait_for_function("zoneOf(P.x,P.y)===20", timeout=5000); assert ev("P.x===DEPTH_EXIT[0]&&P.y===DEPTH_EXIT[1]"), "the chamber door leads back into the Depths"
    ev("S.eq.weapon=null;delete S.bag.divine_blade;ENEMIES.forEach(e=>{e.cd=1e9})")
    # Quest 9 (5.9): the storm, eight pirates, Captain Barron and his pattern, the keys, and the old man sealing the Sea Key
    assert ev("flag('storm_on')&&STORM_ON&&BL.filter(b=>b.storm).length>=4&&BL.filter(b=>b.storm).every(b=>at(b.x+1,b.y+1)===101)&&questGoal()[0]===283"), "Quest 8 hands over to Quest 9: a storm breaks and pirate ships moor round the Sea temple's island"
    assert ev("(()=>{const seen=new Set(['200,100']),q=[[200,100]],D4=[[1,0],[-1,0],[0,1],[0,-1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(nx<0||ny<0||nx>=MW||ny>=WH||seen.has(k)||at(nx,ny)!==0)continue;seen.add(k);q.push([nx,ny])}}let landings=0;for(let y=12;y<=60;y++)for(let x=254;x<=312;x++)if(WK.includes(at(x,y))&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>seen.has((x+a)+','+(y+b))))landings++;return landings>=5})()"), "the ships leave the Sea temple's island open to the sea (a boat can still land)"
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;SCENE=null;BATTLE=null;sail=false;NPC.forEach(n=>{n.busy=1});ENEMIES.forEach(e=>{e.cd=1e9});P.x=P.rx=283;P.y=P.ry=44;P.f='u';fireTriggers('step')"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q9_land'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null", timeout=5000)
    assert ev("S.story.step===1&&encFigures('q9_guards').length===12&&encFigures('q9_guards').every(n=>WK.includes(at(n.x,n.y)))&&(()=>{const r=encFigures('q9_guards').map(n=>Math.hypot((n.x-283)/24,(n.y-36)/19));return r.some(v=>v>.85)&&r.some(v=>v>.68&&v<.82)&&r.some(v=>v>.5&&v<.64)&&r.some(v=>v<.46&&v>.3)&&r.filter(v=>v<.3).length>=3})()"), "twelve pirates are spread round the spiral path: the beach, both terraces, the rim, the boardwalk and the courtyard"
    fight_all('q9_guards', 12, True); pg.wait_for_function("SCENE!==null&&SCENE.id==='q9_taunt'", timeout=8000); ev("skipScene()"); pg.wait_for_function("BATTLE!==null&&BATTLE.foes&&BATTLE.foes[0].t.n==='Captain Barron'", timeout=8000)
    assert ev("S.story.step===2&&BATTLE.row.noRun===1&&DLG.q9_barron1.nodes.a.text.startsWith('You! The dog!')&&BATTLE.foes[0].t.hp===320&&!BATTLE.foes[0].t.flee"), "Captain Barron starts a battle you cannot run from, and he does not retreat"
    ev("S.hp=9999;S.sta=100;BATTLE.foes[0].turns=0")
    seq = []
    for _ in range(4):
        n0 = ev("BATTLE.log.length"); ev("bFoes()"); seq.append(" ".join(ev("BATTLE.log.slice(%d)" % n0)))
    assert "slashes" in seq[0] and "slashes" in seq[1] and "raises his sabre high" in seq[2] and "-" not in seq[2].split("high")[1][:6] and "crashing down" in seq[3], seq
    ev("BATTLE.foes[0].hp=1;S.hp=500"); ev(ATTACK_JS); pg.wait_for_function("SCENE!==null&&SCENE.id==='q9_victory'", timeout=10000); ev("skipScene()"); pg.wait_for_function("SCENE===null&&BATTLE===null&&!dlgActive()", timeout=10000)
    assert ev("flag('q9_done')&&flag('pirates_defeated')&&flag('keys_to_return')&&flag('sea_key_sealed')&&!flag('storm_on')&&!STORM_ON&&BL.filter(b=>b.storm).length===0&&count('earth_key')===1&&count('sky_key')===1&&count('fire_key')===1&&count('sea_key')===0&&S.story.done.includes('q9')&&S.story.q==='q10'&&NPC.find(n=>n.n==='Captain Barron').hidden===1&&NPC.find(n=>n.n==='Old Stranger').x!==CZ.dx-99&&DLG.q9_old.nodes.a.text.startsWith('I knew our faith was well placed.')&&DLG.q9_barron2.nodes.a.text.startsWith('I was wrong!')"), "Barron falls, the sky clears, you keep three keys and the old man seals the Sea Key"
    # Quest 10 (5.10): return the three keys (Sky first here, then the Earth; the Fire temple last), the Sky temple is repaired, the Fire spirit gives the letter and the key, and an island rises with your new home
    assert ev("S.story.q==='q10'&&S.story.step===0&&flag('keys_to_return')&&Array.isArray(questGoal())&&count('earth_key')===1&&count('sky_key')===1&&count('fire_key')===1&&NPC.find(n=>n.n==='Fire Spirit').hidden===0&&zoneOf(NPC.find(n=>n.n==='Fire Spirit').x,NPC.find(n=>n.n==='Fire Spirit').y)===8&&zoneOf(NPC.find(n=>n.n==='Mysterious Girl').x,NPC.find(n=>n.n==='Mysterious Girl').y)===5&&Math.abs(NPC.find(n=>n.n==='Mysterious Boy').x-236)<=2"), "Quest 9 hands over to Quest 10 and the three spirits wait in their temples"
    ev("setFlag('sky_damaged',1)")
    talk("Mysterious Boy"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q10_sky'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null&&!dlgActive()", timeout=8000)
    assert ev("flag('sky_key_returned')&&count('sky_key')===0&&!flag('sky_damaged')&&S.story.step===0&&DLG.q10_boy.nodes.a.text.startsWith('The water was right all along.')&&at(235,108)===80&&at(236,108)===81"), "the Sky spirit takes his key and his temple is made whole again"
    talk("Fire Spirit"); assert ev("count('fire_key')===1&&!flag('fire_key_returned')&&S.story.step===0"), "the Fire spirit asks you to take the other keys home first"
    talk("Mysterious Girl"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q10_earth'", timeout=6000); ev("skipScene()"); pg.wait_for_function("SCENE===null&&!dlgActive()", timeout=8000)
    assert ev("flag('earth_key_returned')&&count('earth_key')===0&&S.story.step===1&&DLG.q10_girl.nodes.a.text.startsWith('From the moment I laid eyes on you')"), "the Earth spirit takes her key and the Fire temple is last"
    ev("S.home={x:150,y:122,roof:'thatch'};S.claim={x:148,y:120,w:7,h:5};for(let j=0;j<2;j++)for(let i=0;i<3;i++)M[(122+j)*MW+150+i]=5;S.bag.cottage_kit=0;S.bag.house_key=0")
    ev("setFlag('village_burnt',1)"); talk("Fire Spirit"); pg.wait_for_function("SCENE!==null&&SCENE.id==='q10_fire'", timeout=6000)
    for _ in range(12):
        ev("if(SCENE)skipScene()"); pg.wait_for_timeout(300)
        if ev("$('letter').classList.contains('open')"): ev("$('letter-close').click()")
        if ev("SCENE===null&&!dlgActive()"): break
    assert ev("flag('q10_done')&&!flag('village_burnt')&&flag('story_complete')&&flag('island_risen')&&S.story.q===null&&S.story.done.includes('q10')&&count('fire_key')===0&&count('house_key')===1&&hasLetter('q10_letter')&&DLG.q10_fire.nodes.a.text.startsWith('So it is true.')"), "the Fire spirit gives the letter and the key and the main story is complete"
    assert ev("S.isle.x===165&&S.isle.y===56&&S.isle.grand===1&&S.home.x===150&&S.home.y===122&&S.claim.x===148&&!S.claim.isle&&(()=>{for(let j=54;j<=57;j++)for(let i=162;i<=170;i++)if(at(i,j)!==5)return false;return true})()&&at(150,122)===5&&count('cottage_kit')===0&&LAND.some(l=>l[0]==='Haven Isle')&&FOG[(60>>2)*FW+(166>>2)]===1"), "the island's house is a second home: your cottage and claim stay exactly as they were, and the island (22 rows further north) is on the map"
    assert ev("(()=>{const seen=new Set(['166,58']),q=[[166,58]],D4=[[1,0],[-1,0],[0,1],[0,-1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of D4){const k=(x+a)+','+(y+b);if(!seen.has(k)&&WK.includes(at(x+a,y+b))){seen.add(k);q.push([x+a,y+b])}}}const w=new Set(['150,60']),r=[[150,60]];while(r.length){const[x,y]=r.shift();for(const[a,b]of D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(nx<0||ny<0||nx>=MW||ny>=WH||w.has(k)||at(nx,ny)!==0)continue;w.add(k);r.push([nx,ny])}}let touch=0;for(let y=48;y<=74;y++)for(let x=150;x<=182;x++)if(WK.includes(at(x,y))&&D4.some(([a,b])=>w.has((x+a)+','+(y+b))))touch++;return seen.size>120&&touch>=5})()"), "the island is a walkable island with a path to the door and the sea reaches its shore"
    # the whole island is yours: a workstation far from the house, and a garden, can go anywhere on it (and still not on the sea)
    assert ev("(()=>{sail=false;P.x=P.rx=157;P.y=P.ry=67;P.f='r';S.placed=[];return [placeWhy('standard_bench',160,66),placeWhy('forge',173,66),placeWhy('standard_bench',140,64)[0]]})()") == ["", "", "T"], "workstations go anywhere on Haven Isle, and not on the water"
    ev("P.x=P.rx=160;P.y=P.ry=68;P.f='r'"); assert ev("(()=>{const pl=plan('garden_kit');return !pl.glob&&!pl.tiles.some(q=>q[2])})()"), "a garden fits on the island's grass far from the house"
    # the Japanese garden entrance: a gate with two posts and a gap, stepping stones to the door, ponds, pines and lanterns, all joined to the pier by a walkable path
    assert ev("(()=>{const cx=ISLE.cx,gy=ISLE.hy+8;if(at(cx-2,gy)!==107||at(cx+2,gy)!==107||!BL.some(b=>b.haven&&b.towergate))return 'gate';for(const x of[cx-1,cx,cx+1])if(!WK.includes(at(x,gy)))return 'gap';if(at(cx-5,ISLE.hy+4)!==9||at(cx+5,ISLE.hy+4)!==9)return 'ponds';let pines=0,lan=0;for(let y=ISLE.hy+2;y<=gy;y++)for(let x=cx-9;x<=cx+9;x++){if(at(x,y)===102)pines++;if(at(x,y)===7)lan++}if(pines<4||lan<4)return 'pines '+pines+' lanterns '+lan;const seen=new Set(['166,58']),q=[[166,58]],D4=[[1,0],[-1,0],[0,1],[0,-1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of D4){const k=(x+a)+','+(y+b);if(!seen.has(k)&&WK.includes(at(x+a,y+b))){seen.add(k);q.push([x+a,y+b])}}}return seen.has('166,70')?'ok':'no way from the pier to the door'})()") == "ok", "a Japanese garden gate, stepping stones, ponds, pines and lanterns, with a way from the pier to the door"
    # inside: six furnished rooms, all joined, with a bed to sleep in and room for workstations
    ev("sail=false;P.x=P.rx=166;P.y=P.ry=58;P.f='u';act()"); assert ev("zoneOf(P.x,P.y)===1&&P.x===HG.dx&&P.y===HG.dy&&inRoom(P.x,P.y)"), "the door of the grand house opens into its entrance hall"
    rooms = ev("(()=>{const seen=new Set([HG.dx+','+HG.dy]),q=[[HG.dx,HG.dy]],D4=[[1,0],[-1,0],[0,1],[0,-1]];while(q.length){const[x,y]=q.shift();for(const[a,b]of D4){const k=(x+a)+','+(y+b);if(!seen.has(k)&&WK.includes(at(x+a,y+b))&&inRoom(x+a,y+b)&&!placedAt(x+a,y+b)){seen.add(k);q.push([x+a,y+b])}}}const R=[[297,272],[305,272],[314,272],[297,282],[305,282],[314,280],[297,292],[305,292],[314,292]];let furn=0,types=new Set();for(let y=HG.y0;y<=HG.y1;y++)for(let x=HG.x0;x<=HG.x1;x++){const t=at(x,y);if((t>=156&&t<=183)&&![163,165,167,169,177].includes(t)&&!(t>=172&&t<=174)){furn++;types.add(t)}}return {reach:R.map(([x,y])=>seen.has(x+','+y)),n:seen.size,furn,types:types.size}})()")
    assert all(rooms["reach"]) and rooms["n"] > 400 and rooms["furn"] >= 120 and rooms["types"] >= 18, rooms
    # nine rooms, with the built-in stations, crates everywhere, a storage room of fourteen, and a wardrobe of four mannequins (playtest #4)
    assert ev("HG_CRATES.length>=25&&HG_CRATES.filter(c=>c[0]>=311&&c[1]>=286).length>=14&&HG_CRATES.every(c=>at(c[0],c[1])===175)&&[303,305,307,309].every(x=>at(x,267)===176)&&at(296,265)===177&&at(295,295)===177"), "crates in every room, fourteen in the storage room, four mannequins, garden windows"
    ev("S.placed=[];haveFixtures()")   # (an earlier check cleared the placed things; the island's key puts these there when it is given and again at every load)
    assert ev("S.placed.filter(p=>p.fixed).map(p=>p.id).sort().join()==='alchemy_station,cooking_station,forge,standard_bench'&&S.placed.filter(p=>p.fixed).every(p=>inRoom(p.x,p.y))"), "a cooking station, a workbench, a forge and an alchemy station are built in"
    ev("haveFixtures();haveFixtures()"); assert ev("S.placed.filter(p=>p.fixed).length===4"), "the built-in stations are only put there once"
    ev("sail=false;P.x=P.rx=300;P.y=P.ry=280;P.f='u';act()"); assert ev("$('menu').classList.contains('open')&&mn.opts.includes('Cancel')&&!mn.opts.includes('Pick up')&&!mn.opts.includes('Move')&&mn.opts.length===2"), "a built-in station can be used but not picked up or moved"
    ev("menuPick&&(mn.i=mn.opts.length-1,menuPick())"); ev("S.bag.camp_kit=1")
    ev("S.placed.push({id:'camp_kit',x:156,y:130,big:1});S.placed.push({id:'forge',x:157,y:128});(()=>{pickUp(S.placed.find(p=>p.id==='camp_kit'))})()"); assert ev("S.placed.filter(p=>p.fixed).length===4&&!S.placed.some(p=>p.id==='camp_kit')&&count('forge')===1"), "packing a camp never packs the built-in stations"
    ev("delete S.bag.forge;delete S.bag.camp_kit")
    assert ev("[placeWhy('standard_bench',298,283),placeWhy('standard_bench',295,281),placeWhy('standard_bench',294,274)].join('|')") == "|You can't place that there.|", "workstations go anywhere on a free floor inside (a wide one needs two free tiles), but not on furniture"
    ev("S.day=5;P.x=P.rx=305;P.y=P.ry=272;P.f='d';sleep()"); assert ev("S.day===6"), "you can sleep anywhere inside the house"
    # working storage: a crate keeps what you put in it, each crate is its own store, equipped things and keys stay with you
    ev("S.bag.sardine=7;S.bag.earth_key=1;S.eq.weapon='wooden_sword';S.bag.wooden_sword=1;S.crates={};openCrate(312,288)")
    assert ev("/Storage crate/.test($('st').textContent)&&!/Earth Key/.test($('items').textContent)&&!/Wooden sword/.test($('items').textContent)&&/Sardine x7/.test($('items').textContent)"), "the crate screen lists what you can store (not keys, not what you wear)"
    ev("[...[...document.querySelectorAll('#items .it')].find(r=>/Sardine/.test(r.textContent)).querySelectorAll('button')].find(b=>b.textContent==='Store all').click()"); assert ev("count('sardine')===0&&S.crates['312,288'].sardine===7&&Object.keys(crateStore(313,288)).length===0"), "storing moves the whole stack into that crate only"
    ev("[...[...document.querySelectorAll('#items .it')].find(r=>/Sardine/.test(r.textContent)).querySelectorAll('button')].find(b=>b.textContent==='Take 1').click()"); assert ev("count('sardine')===1&&S.crates['312,288'].sardine===6"), "and you can take things back out"
    ev("$('store').classList.remove('open');S.crates={}")
    # mannequins keep armour sets
    ev("S.mann={};S.bag.cloth_hood=1;S.bag.leather_jerkin=1;S.eq.helmet=null;S.eq.armour=null;S.eq.boots=null;mannDress(0)"); assert ev("$('menu').classList.contains('open')&&/Cloth hood/.test($('menu-o').textContent)&&/Leather jerkin/.test($('menu-o').textContent)"), "a mannequin can be dressed from your bag"
    ev("mn.i=mn.opts.findIndex(o=>/Cloth hood/.test(o));menuPick()"); assert ev("S.mann[0].helmet==='cloth_hood'&&count('cloth_hood')===0"), "the piece moves onto the mannequin (it leaves your bag)"
    ev("S.bag.cloth_tunic=1;S.eq.armour='cloth_tunic';mannDress(0)"); ev("mn.i=mn.opts.findIndex(o=>/Cloth tunic/.test(o)&&/worn/.test(o));menuPick()"); assert ev("S.mann[0].armour==='cloth_tunic'&&S.eq.armour===null&&count('cloth_tunic')===0"), "your worn armour can go onto it too"
    ev("S.bag.leather_cap=1;S.eq.helmet='leather_cap';openMannequin(303,267)"); ev("mn.i=0;menuPick()"); assert ev("S.eq.helmet==='cloth_hood'&&S.mann[0].helmet==='leather_cap'&&S.eq.armour==='cloth_tunic'&&S.mann[0].armour===null&&count('leather_cap')===0"), "wearing its set swaps each piece with yours"
    ev("openMannequin(303,267)"); ev("mn.i=2;menuPick()"); assert ev("S.mann[0].helmet===null&&count('leather_cap')===1"), "or take it all to your bag"
    ev("S.mann={};S.eq.helmet=null;S.eq.armour=null;draw()")
    ev("P.x=P.rx=HG.dx;P.y=P.ry=HG.dy;P.f='d';act()"); assert ev("zoneOf(P.x,P.y)===0&&P.x===166&&P.y===58"), "and the front door takes you back out onto the island"
    ev("['earth_key','sky_key','fire_key','house_key','cottage_kit'].forEach(k=>delete S.bag[k]);S.home=null;S.claim=null;S.isle=null;setFlag('island_risen',0);BATTLE_FAST=false;NPC.forEach(n=>{n.busy=0})")
    assert ev("at(166,60)===0&&!LAND.some(l=>l[0]==='Haven Isle')"), "switching the island off puts the sea back"
    # an older save made when the island home was at y 78 and replaced the cottage: the house moves 22 rows north and becomes the second home, and what was placed on the island moves with it
    old = dict(SAVE); old["wv"] = 3; old["flags"] = {"island_risen": 1}; old["home"] = {"x": 165, "y": 78, "roof": "slate", "grand": 1}; old["claim"] = {"x": 152, "y": 71, "w": 29, "h": 22, "isle": 1}; old["placed"] = [{"id": "forge", "x": 170, "y": 84}, {"id": "standard_bench", "x": 303, "y": 254}]
    pgm, errm = load(b, url, old); evm = pgm.evaluate
    assert evm("S.wv===4&&S.home===null&&S.claim===null&&S.isle.x===165&&S.isle.y===56&&S.isle.grand===1&&S.placed[0].y===62&&S.placed[1].y===254&&at(166,60)!==0&&at(166,82)===0&&(()=>{for(let j=54;j<=57;j++)for(let i=162;i<=170;i++)if(at(i,j)!==5)return false;return true})()"), "an older save's island home moves north with the island, and its things move with it"
    assert not errm, errm; pgm.close()
    ev("storyJump('q6')"); assert ev("S.story.q==='q6'&&S.story.step===0&&count('sea_key')===0&&flag('q5_done')&&!flag('q6_done')"), "the testing menu can jump to Quest 6"
    ev("storyJump('q7')"); assert ev("S.story.q==='q7'&&S.story.step===0&&flag('village_attack')&&RAID_ON&&P.x===156&&P.y===126"), "the testing menu can jump to Quest 7, with the village under attack"
    ev("storyJump('q8')"); assert ev("S.story.q==='q8'&&!flag('village_attack')&&!RAID_ON&&flag('village_burnt')"), "later jumps find the village burnt but quiet"
    ev("storyJump('q4t')"); assert ev("S.story.q==='q4'&&S.story.step===3&&count('earth_key')===1&&flag('q4_key_got')"), "the testing menu can jump to the key at the tower"
    ev("storyJump('q5t')"); assert ev("S.story.q==='q5'&&S.story.step===3&&count('sea_key')===1"), "the testing menu can jump to the Sea Key at the tower"
    ev("S.eq.helmet=null;delete S.bag.sky_helm;S.eq.armour=null;delete S.bag.enchanted_armour;S.eq.boots=null;delete S.bag.enchanted_boots;storyReset();BATTLE_FAST=false;NPC.forEach(n=>{n.busy=0})")
    # a brand-new game: no gold, and only a driftwood rod, the rowboat and a wooden sword (Jack's playtest note)
    pgn = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True); errn = []; pgn.on("pageerror", lambda e: errn.append(str(e)))
    pgn.add_init_script("try{sessionStorage.setItem('lh-started','1')}catch(e){}"); pgn.goto(url); pgn.wait_for_timeout(400)
    start = pgn.evaluate("({gold:S.gold,bag:Object.keys(S.bag).filter(k=>S.bag[k]).sort(),weapon:S.eq.weapon,rod:S.eq.rod,dmg:eq('weapon').damage,shop:(openStore('rod'),/Wooden sword/.test($('items').textContent))})")
    assert start == {"gold": 0, "bag": ["driftwood_rod", "rowboat", "wooden_sword"], "weapon": "wooden_sword", "rod": "driftwood_rod", "dmg": 3, "shop": False}, start
    assert not errn, errn; pgn.close()
    # Bjorn's big house: a seven-wide house in the north of the village with a path to its door, reachable on foot from the pier, and Bjorn standing at it
    assert ev("(()=>{const h=BL.find(b=>b.big);if(!h||h.w!==7||h.y>103)return false;const seen=new Set(),q=[[156,124]];seen.add(124*MW+156);for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=ny*MW+nx;if(seen.has(k)||!WK.includes(at(nx,ny)))continue;seen.add(k);q.push([nx,ny])}}return seen.has(103*MW+154)&&seen.has(104*MW+155)&&at(154,102)===5&&at(157,101)===5&&(()=>{try{sail=false;P.x=P.rx=155;P.y=P.ry=106;draw();return true}catch(e){return false}})()})()"), "Bjorn's house stands in the north of the village, is reachable on foot, and draws"
    # weapon attacks (P7): the Attack list depends on the weapon and its skill, every attack costs stamina, power comes from the weapon skill, Bash may stun, Block takes less damage and gives stamina back
    def menu_ready():
        pg.wait_for_function("BATTLE!==null&&[...$('bt-menu').children].some(b=>b.textContent==='Attack')", timeout=8000)
    menu = lambda: ev("[...$('bt-menu').children].map(b=>b.textContent)")
    pick = lambda name: ev("(n=>{[...$('bt-menu').children].find(b=>b.textContent==='Attack').click();[...$('bt-menu').children].find(b=>b.textContent.startsWith(n)).click()})(%s)" % json.dumps(name))
    def attack_list(weapon, xp_key=None, xp=0):
        ev("S.xp={};%s;S.eq.weapon=%s;S.sta=100;S.hp=50;FOES.t_dummy={n:'Dummy',hp:999,hit:[1,1],xp:0,look:{skin:1,hair:3,shirt:1,jk:2,hat:'cap',hc:1,pack:false}};BATTLES.t_dummy={foes:['t_dummy']};startBattle('t_dummy')" % (("S.xp['%s']=%d" % (xp_key, xp)) if xp_key else "0", json.dumps(weapon)))
        pg.wait_for_timeout(50); menu_ready(); ev("[...$('bt-menu').children].find(b=>b.textContent==='Attack').click()"); out = menu(); return out
    def end_battle(): ev("clearInterval(BATTLE.anim);$('battle').classList.remove('open');BATTLE=null")
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;S.bag.sword=1;S.bag.hand_axe=1;S.bag.wooden_sword=1;S.coat=0;NPC.forEach(n=>{n.busy=1})")
    assert attack_list('sword') == ["Slash (4)", "Back"]; end_battle()
    assert attack_list('wooden_sword') == ["Strike (4)", "Bash (4)", "Back"]; end_battle()
    assert attack_list(None) == ["Strike (4)", "Bash (4)", "Back"], "bare hands and the wooden sword share Strike and Bash"; end_battle()
    assert attack_list('hand_axe') == ["Chop (4)", "Back"]; end_battle()
    assert attack_list('sword', 'sword', 380) == ["Slash (4)", "Lunge (5)", "Back"], "Lunge is learned at sword level 2"; end_battle()
    # playtest #4: attack uses, Scuffle, Quick Strike's second blow, the hit reaction, and the gain card for potions
    ev("PP_ON=true;S.pp={}")
    assert attack_list('sword') == ["Slash (4)  40/40", "Back"], "each attack shows its uses left"; end_battle()
    ev("S.pp={}"); ev("S.xp={};S.eq.weapon='sword';S.sta=100;S.hp=50;startBattle('t_dummy')"); pg.wait_for_timeout(50); menu_ready(); pick("Slash"); menu_ready()
    assert ev("S.pp.slash===1&&BATTLE.fx.includes('hurt')&&BATTLE.fx.some(q=>q.startsWith('dmg player'))"), "using an attack counts a use, and being hit shows the hurt reaction"; end_battle()
    ev("S.pp={slash:40}"); out = attack_list('sword'); assert out == ["Slash (4)  0/40", "Scuffle", "Back"], out
    ev("[...$('bt-menu').children].find(b=>b.textContent==='Scuffle').click()"); menu_ready(); assert ev("BATTLE.log.some(t=>/You use Scuffle/.test(t))&&S.pp.slash===40"), "when nothing else can be used, Scuffle always can"; end_battle()
    ev("S.pp={slash:3};restAttacks()"); assert ev("Object.keys(S.pp).length===0"), "resting gives every attack its uses back"
    ev("PP_ON=false;S.xp={};S.xp.sword=770;S.eq.weapon='sword';S.sta=100;S.hp=50;window.__m=Math.random;Math.random=()=>0;startBattle('t_dummy')"); pg.wait_for_timeout(50); menu_ready(); pick("Quick"); menu_ready()
    assert ev("BATTLE.fx.includes('twice')&&BATTLE.log.some(t=>/strike again/.test(t))&&BATTLE.log.filter(t=>/You use Quick Strike/.test(t)).length===2"), "Quick Strike can hit twice before the foe answers"; end_battle()
    ev("Math.random=()=>.99;S.sta=100;startBattle('t_dummy')"); pg.wait_for_timeout(50); menu_ready(); pick("Quick"); menu_ready()
    assert ev("!BATTLE.fx.includes('twice')&&BATTLE.log.filter(t=>/You use Quick Strike/.test(t)).length===1"), "and usually hits once"; end_battle(); ev("Math.random=__m;S.xp={}")
    ev("S.hp=10;S.sta=10;S.bag.healing_potion=1;drink('healing_potion')"); assert ev("!!$('gain')&&$('gain').querySelectorAll('.gr').length===1&&/HP/.test($('gain').textContent)&&/\\+\\d+/.test($('gain').textContent)"), "a potion shows a card with the bar filling and the amount gained"
    ev("$('gain').remove();S.hp=50;S.sta=100")
    assert attack_list('sword', 'sword', 770) == ["Slash (4)", "Lunge (5)", "Quick Strike (2)", "Back"], "Quick Strike is learned at sword level 3"; end_battle()
    assert attack_list('sword', 'sword', 3300) == ["Slash (4)", "Lunge (5)", "Quick Strike (2)", "Power Slash (8)", "Back"], "Power Slash at level 6"; end_battle()
    assert attack_list('hand_axe', 'axe', 3300) == ["Chop (4)", "Bash (4)", "Cleave (8)", "Back"], "the axe learns Bash at 3 and Cleave at 6"; end_battle()
    # damage and stamina: with the dice fixed at 1.0, light 0.6, normal 1, heavy 1.6 of the weapon's damage (5) times the skill bonus (+8% a level)
    attack_list('sword', 'sword', 3300); ev("window.__r0=Math.random;Math.random=()=>0.5;ev0=0"); ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()")
    ev("window.__f=BATTLE.foes[0];window.__s0=S.sta")
    pick("Power Slash"); menu_ready(); assert ev("__f.hp===999-12&&S.sta===__s0-8"), "Power Slash: 5 x 1.48 x 1.6 = 12 damage for 8 stamina"
    pick("Quick Strike"); menu_ready(); assert ev("__f.hp===999-12-4&&S.sta===__s0-10"), "Quick Strike: a light hit of 4 for 2 stamina"
    pick("Slash"); menu_ready(); assert ev("__f.hp===999-12-4-7&&S.sta===__s0-14"), "Slash: a normal hit of 7 for 4 stamina"
    pick("Lunge"); menu_ready(); assert ev("__f.hp===999-12-4-7-8&&S.sta===__s0-19"), "Lunge: 5 x 1.48 x 1.1 = 8 damage (a little more than Slash's 7) for 5 stamina"
    assert ev("(S.xp.sword||0)>=3300+16+6+10+12"), "using sword attacks trains the sword skill"
    ev("Math.random=__r0"); end_battle()
    # learning an attack announces it
    attack_list('sword', 'sword', 765); ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()"); pick("Slash"); menu_ready()
    assert ev("BATTLE.log.some(t=>/Sword skill reached level 3!/.test(t))&&BATTLE.fx.includes('banner:New attack learned: Quick Strike!')"), "reaching level 3 teaches Quick Strike, with a banner"; end_battle()
    attack_list('sword', 'sword', 375); ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()"); pick("Slash"); menu_ready()
    assert ev("BATTLE.log.some(t=>/Sword skill reached level 2!/.test(t))&&BATTLE.fx.includes('banner:New attack learned: Lunge!')"), "reaching level 2 teaches Lunge, with a banner"; end_battle()
    # the Divine Blade: its own attack, Divine Strike, on top of the sword's (Quest 8)
    ev("S.bag.divine_blade=1")
    assert attack_list('divine_blade') == ["Slash (4)", "Divine Strike (10)", "Back"], "the Divine Blade adds Divine Strike to the sword's attacks"; end_battle()
    attack_list('divine_blade'); ev("window.__r0=Math.random;Math.random=()=>0.5;[...$('bt-menu').children].find(b=>b.textContent==='Back').click();window.__f=BATTLE.foes[0];window.__s0=S.sta;window.__f.t.block=1;BATTLE_BLOCKS=true")
    pick("Divine Strike"); menu_ready(); assert ev("__f.hp===999-25&&S.sta===__s0-10"), "Divine Strike: 14 x 1.8 = 25 damage for 10 stamina, even against a foe that always blocks"
    ev("Math.random=__r0;BATTLE_BLOCKS=false"); end_battle(); ev("S.eq.weapon=null;delete S.bag.divine_blade")
    # the axe trains the axe, not the sword
    attack_list('hand_axe'); ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()"); pick("Chop"); menu_ready(); assert ev("(S.xp.axe||0)===10&&!(S.xp.sword)"), "the axe trains the axe skill"; end_battle()
    # Bash: a 15% chance to stun
    attack_list('wooden_sword'); ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()"); ev("window.__r0=Math.random;Math.random=()=>0")
    pick("Bash"); menu_ready(); assert ev("BATTLE.log.some(t=>/Dummy is stunned!/.test(t))&&BATTLE.log.some(t=>/stunned and loses its turn/.test(t))&&S.hp===50"), "a lucky Bash stuns the foe, which loses its turn"
    ev("Math.random=()=>0.99"); pick("Bash"); menu_ready(); assert ev("S.hp===49"), "an ordinary Bash does not stun (15% only)"
    ev("Math.random=__r0"); end_battle()
    # Block: much less damage, and stamina back
    ev("FOES.t_hard={n:'Brute',hp:999,hit:[10,10],xp:0,look:FOES.t_dummy.look};BATTLES.t_hard={foes:['t_hard']};S.eq.weapon='sword';S.sta=50;S.hp=50;startBattle('t_hard')"); pg.wait_for_timeout(50); menu_ready()
    ev("window.__r0=Math.random;Math.random=()=>0.5;[...$('bt-menu').children].find(b=>b.textContent==='Block').click()"); menu_ready()
    assert ev("S.sta===60&&S.hp===46"), "Block gives 10 stamina back and cuts a 10 hit to 4"
    ev("[...$('bt-menu').children].find(b=>b.textContent==='Attack').click()"); ev("[...$('bt-menu').children].find(b=>b.textContent.startsWith('Slash')).click()"); menu_ready(); assert ev("S.hp===36"), "without Block the same hit is 10"
    ev("Math.random=__r0;S.sta=3"); ev("[...$('bt-menu').children].find(b=>b.textContent==='Attack').click()")
    assert ev("[...$('bt-menu').children].find(b=>b.textContent.startsWith('Slash')).disabled===true"), "an attack you cannot afford is greyed out"
    ev("[...$('bt-menu').children].find(b=>b.textContent==='Back').click()"); assert ev("![...$('bt-menu').children].find(b=>b.textContent==='Block').disabled"), "Block is always there"
    end_battle()
    ev("openSmith('buy')"); assert ev("/Hand axe/.test($('items').textContent)"), "Garrick sells the hand axe"; ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    ev("openSkills()"); assert ev("/Sword/.test($('sk-list').textContent)&&/Axe/.test($('sk-list').textContent)&&/Quick Strike \\(level 3\\)/.test($('sk-list').textContent)"), "the Skills screen shows the Sword and Axe skills and their attacks"; ev("closeSkills()")
    ev("S.xp={};S.eq.weapon='wooden_sword';BATTLE_FAST=false;NPC.forEach(n=>{n.busy=0})")
    # cinematic steps (2.12): film bars, a moving time of day, decorations rising, a crowd walking together, speech that closes by itself, cheering, floating lanterns; everyone is put back at the end
    ev("storyReset();NPC.forEach(n=>{n.busy=0});sail=false;DLG.t_cin={start:'a',nodes:{a:{who:'Murl',text:'A short test speech.'}}};window.__pos=NPC.filter(n=>n.n==='Odo'||n.n==='Bram').map(n=>[n.n,n.x,n.y]);window.__mx=[];SCENES.t_cinema=[{bars:'on'},{build:[0,1,300]},{light:[.78,.9,300]},{walks:[['Odo',NPC.find(n=>n.n==='Odo').x+2,NPC.find(n=>n.n==='Odo').y,60],['Bram',NPC.find(n=>n.n==='Bram').x-2,NPC.find(n=>n.n==='Bram').y,60]]},{crowd:'face'},{speak:'t_cin',ms:300},{cheer:300},{lanterns:600},{wait:200}];SCENES.t_cinema.cine=true;window.__d=0;runScene('t_cinema',()=>{window.__d=1})")
    pg.wait_for_timeout(120); assert ev("$('cine').classList.contains('on')&&SCENE.cine&&FESTIVAL_BUILD<1&&SCENE_LIGHT!==null&&SCENE_LIGHT>=.78"), "the bars, the rising decorations and the moving light start"
    pg.wait_for_function("dlgActive()&&$('dlg-txt').textContent.length>0", timeout=8000); assert ev("$('dlg-who').textContent==='Murl'&&NPC.find(n=>n.n==='Odo').x===__pos[0][1]+2&&NPC.find(n=>n.n==='Bram').x===__pos[1][1]-2"), "the crowd walked together before the speech"
    pg.wait_for_function("!dlgActive()", timeout=8000); assert ev("SCENE!==null||window.__d===1"), "the speech closes by itself"
    ev("window.__lan=FLOAT_START>0&&CHEER_UNTIL>0")
    pg.wait_for_function("window.__d===1", timeout=8000)
    assert ev("SCENE===null&&window.__lan===true&&FESTIVAL_BUILD===1&&SCENE_LIGHT===null&&FLOAT_START===0&&CHEER_UNTIL===0&&!$('cine').classList.contains('on')&&NPC.find(n=>n.n==='Odo').x===__pos[0][1]&&NPC.find(n=>n.n==='Odo').y===__pos[0][2]&&NPC.find(n=>n.n==='Bram').x===__pos[1][1]"), "when it ends the lanterns, cheering and light are back to normal, the bars slide out and the people are back in place"
    ev("storyReset()")
    # tailor and barber: the look screen charges only for what you change, and every hair style draws
    ev("S.gold=500;openLook('tailor');LK.jk=3;buildSw()"); assert ev("$('go').textContent")=="Pay 80g"
    ev("$('go').click()"); assert ev("[S.gold,S.look.jk]")==[420,3], "tailor charge"
    ev("openLook('barber');LK.hstyle='long';LK.hair=2;buildSw()"); assert ev("$('go').textContent")=="Pay 100g"
    ev("$('lookx').click()"); assert ev("[S.gold,S.look.hstyle]")==[420,None], "cancelled barber visit costs nothing"
    ev("S.look.jk=1;HSTYLES.forEach(h=>['f','b','r'].forEach(v=>{const c=document.createElement('canvas').getContext('2d');CharacterSprite.draw(c,0,0,{...lo({...S.look,hstyle:h}),view:v,frame:0})}))")
    ev("openSmith('buy')"); assert ev("document.querySelector('#store').classList.contains('open')&&/Iron sword/.test($('items').textContent)"), "smith shop"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    # Batch 6 (playtest #2): slower walking with the old speed kept for the swiftness potion, Old Sword, stamina bar, ambush over an open screen, slower centipede respawn
    assert ev("STEP_MS.walk>SWIFT_MS.walk&&STEP_MS.sail>SWIFT_MS.sail&&SWIFT_MS.walk===110&&SWIFT_MS.sail===60&&(S.buff=0,stepMs()===STEP_MS.walk)&&(sail=false,S.buff=Date.now()+5e4,stepMs()===110)&&(S.buff=0,true)"), "walking is slower; the old speed is the swiftness speed"
    assert ev("[ITEMS.sardine.value,ITEMS.mackerel.value,ITEMS.bream.value,ITEMS.tuna.value,ITEMS.koi.value].join()==='3,6,15,60,300'"), "fish values are halved"
    ev("sail=false;S.placed=S.placed.filter(o=>o.id!=='camp_kit');S.placed.push({id:'camp_kit',x:P.x+1,y:P.y});ui()")
    assert ev("atTent()&&$('sleep').style.visibility==='visible'"), "the Sleep button shows beside the camp tent"
    d0 = ev("S.day"); ev("S.hp=1;sleep()"); assert ev("S.day")==d0+1 and ev("S.hp===maxHp()&&$('msg').textContent.includes('tent')"), "sleeping in the tent starts a new day and heals"
    ev("S.placed=S.placed.filter(o=>o.id!=='camp_kit');ui()"); assert ev("!atTent()&&!inRoom(P.x,P.y)?$('sleep').style.visibility==='hidden':true"), "no tent, no sleeping outdoors"
    assert ev("ITEMS.sword.n==='Old Sword'&&ENEMY_TYPES.centipede.respawn>=240"), "Old Sword, slower centipede respawn"
    ev("BATTLE_FAST=true;BATTLE_BLOCKS=false;sail=false;ENEMIES.forEach(e=>{e.cd=1e9});SCENE=null;S.hp=maxHp();S.sta=50;const e=spawnEnemy('spirit',P.x+1,P.y);e.cd=0;e.keep=1;window.__amb=e;openBag();")
    assert ev("$('bag').classList.contains('open')&&canBeAmbushed()"), "a creature may ambush over the bag"
    ev("enemiesTick()"); pg.wait_for_function("BATTLE!==null&&BATTLE.log&&BATTLE.log.includes('You were attacked while distracted!')")
    assert ev("!$('bag').classList.contains('open')&&$('bt-sta').style.width!==''&&$('bt-sta').style.width!=='0%'"), "the bag closed, the notice showed, the stamina bar is drawn"
    ev("clearInterval(BATTLE.anim);BATTLE=null;$('battle').classList.remove('open');ENEMIES.splice(ENEMIES.indexOf(window.__amb),1)")
    ev("$('look').classList.add('open')"); assert ev("!canBeAmbushed()"), "no ambush over the look editor"
    ev("$('look').classList.remove('open');showMap()"); assert ev("(()=>{const r=$('mc').getBoundingClientRect();return $('map-back').getBoundingClientRect().bottom<=innerHeight&&r.height>50})()"), "the map fits the window"
    ev("$('mapov').classList.remove('open')")
    # playtest #3: creatures chase round obstacles (a wall with one gap), and the compass works inside the Darkwood
    ev("BATTLE=null;SCENE=null;sail=false;ENEMIES.length=0")
    ev("(()=>{const x0=60,y0=60;for(let y=y0-4;y<=y0+4;y++)for(let x=x0-6;x<=x0+6;x++)M[y*MW+x]=1;for(let y=y0-4;y<=y0+4;y++)if(y!==y0+3)M[y*MW+x0]=12;\
      ENEMY_TYPES.t_chaser={n:'Chaser',hp:5,dmg:1,cd:99,speed:1,chase:12,leash:12,art:'ghost',xp:0,gold:[0,0],drops:[],respawn:0,die:'x'};P.x=P.rx=x0+3;P.y=P.ry=y0;window.__ch=spawnEnemy('t_chaser',x0-3,y0);__ch.cd=99})()")
    ev("for(let i=0;i<30;i++)enemiesTick()")
    assert ev("Math.abs(__ch.x-P.x)+Math.abs(__ch.y-P.y)<=1"), "a creature walks round a wall to reach you (it used to get stuck behind it)"
    ev("ENEMIES.length=0")
    ev("add('grandfather_compass');S.story.q='q4';S.story.step=0;P.x=P.rx=124;P.y=P.ry=20+FY")
    assert ev("(()=>{const g=compassGoal();return !!g&&g[0]===136&&g[1]===5+FY})()"), "inside the Darkwood the compass points to the gate towards a northern goal"
    # playtest #3: the camp is a 2x2 tent plus a fire, placeable on open ground, solid, and packs up again
    ev("S.placed=[];S.bag.camp_kit=1;sail=false;let o=null;for(let y=60;y<230&&!o;y++)for(let x=30;x<300&&!o;x++){let ok=true;for(let j=-3;j<=3&&ok;j++)for(let i=-3;i<=3;i++)if(at(x+i,y+j)!==1){ok=false;break}if(ok&&zoneOf(x,y)===0)o=[x,y]}P.x=P.rx=o[0];P.y=P.ry=o[1];P.f='u';placing='camp_kit';act()")
    assert ev("S.placed.length===1&&S.placed[0].big===1&&!S.bag.camp_kit"), "the camp kit is placed in front of you"
    assert ev("(()=>{const c=S.placed[0];return !walkable(c.x-1,c.y-1)&&!walkable(c.x-2,c.y)&&!walkable(c.x,c.y)&&walkable(c.x+1,c.y)})()"), "the tent and the fire are solid"
    ev("S.bag.camp_kit=1;placing='camp_kit'"); assert ev("campPlan().glob==='You already have a camp set up.'"), "only one camp"
    ev("placing=null;S.bag.camp_kit=0;pickUp(S.placed[0])"); assert ev("S.placed.length===0&&S.bag.camp_kit===1"), "the camp packs up into the kit"
    ev("S.bag.camp_kit=1;P.f='u';placing='camp_kit';window.__f=front();window.__t=at(__f[0],__f[1]);M[__f[1]*MW+__f[0]]=5"); assert ev("campPlan().tiles.some(t=>t[2])"), "a camp cannot go over a building"
    ev("M[__f[1]*MW+__f[0]]=__t")
    ev("placing=null;S.bag.camp_kit=0")
    # playtest #3: chopping and mining start a tool swing that is drawn on the player (and drawing it raises no error)
    ev("sail=false;SCENE=null;BATTLE=null;add('woodcutters_axe');S.eq.axe='woodcutters_axe';S.sta=100;P.x=P.rx=60;P.y=P.ry=61;P.f='u';M[60*MW+60]=4;gather(60,60,4)")
    assert ev("WORK.kind==='axe'&&performance.now()-WORK.at<300"), "chopping starts an axe swing"
    ev("for(let i=0;i<4;i++){WORK.at=performance.now()-i*110-5;draw()}"); ev("add('pickaxe');S.eq.pickaxe='pickaxe';M[60*MW+60]=15;gather(60,60,15)")
    assert ev("WORK.kind==='pick'"), "mining starts a pickaxe swing"; ev("M[60*MW+60]=1")
    # playtest #3: armour. Three kinds in three pieces, bought at Garrick's (dearer as it gets better), crafted at Crafting level 10, worn from the equipment screen, drawn on the character, and the quest items share the slots
    arm = ev("(()=>{const ids=Object.keys(ITEMS).filter(i=>ITEMS[i].kind==='armour'&&ITEMS[i].price),sets=['cloth','leather','chain'],cost=m=>ids.filter(i=>ITEMS[i].look===m).reduce((a,i)=>a+ITEMS[i].price,0),sold=SMITH.find(r=>r[0]==='Armour')[1].map(r=>r[0]);return {n:ids.length,slots:ids.every(i=>['helmet','armour','boots'].includes(ITEMS[i].slot)&&slotOf(i)===ITEMS[i].slot&&ITEMS[i].fx.ward>0),sold:ids.every(i=>sold.includes(i)&&SMITH.find(r=>r[0]==='Armour')[1].find(r=>r[0]===i)[1]===ITEMS[i].price),order:cost('cloth')<cost('leather')&&cost('leather')<cost('chain'),recipes:ids.every(i=>{const r=RECIPES.find(q=>q.out===i);return r&&r.level===10}),quest:slotOf('enchanted_boots')==='boots'&&slotOf('enchanted_armour')==='armour'}})()")
    assert arm == {"n": 9, "slots": True, "sold": True, "order": True, "recipes": True, "quest": True}, arm
    ev("S.xp={};S.bag={};S.bag.cloth=3;S.bag.hand_axe=0;recipes0=0")
    assert ev("(()=>{const r=RECIPES.find(q=>q.out==='cloth_hood');return !canMake(r)})()"), "cloth armour cannot be crafted below Crafting level 10"
    ev("S.xp.crafting=15000"); assert ev("canMake(RECIPES.find(q=>q.out==='cloth_hood'))&&lvl('crafting')===10"), "and can at level 10"
    ev("S.bag={};['cloth_hood','leather_jerkin','chain_boots','leather_cap','sword','enchanted_boots'].forEach(i=>add(i));S.eq.helmet=null;S.eq.armour=null;S.eq.boots=null;S.eq.weapon=null;ui();openEquip()")
    pg.click('#eq-helmet'); pg.click('#eqs-pick .eqrow'); assert ev("S.eq.helmet==='cloth_hood'"), "tapping a helmet wears it from the equipment screen"
    pg.click('#eq-armour'); pg.click('#eqs-pick .eqrow'); pg.click('#eq-boots'); pg.click('#eqs-pick .eqrow')
    assert ev("S.eq.armour==='leather_jerkin'&&S.eq.boots==='enchanted_boots'"), "the armour and boots squares wear the first thing in their list (the quest boots have no price, so they come first)"
    ev("S.eq.boots='chain_boots'"); assert ev("Math.abs(fx('ward')-(.03+.1+.08))<1e-9"), "cloth hood 3% + jerkin 10% + chain boots 8% stop 21%"
    assert ev("(()=>{const bad=[];['cloth','leather','chain'].forEach(m=>['f','b','r','l'].forEach(v=>[0,1,2,3].forEach(f=>{try{shadePerson({...lo(S.look),armour:{helm:m,body:m,boots:m},view:v,frame:f})}catch(e){bad.push(m+v+f+e.message)}})));['enchanted'].forEach(m=>['f','b','r'].forEach(v=>{try{shadePerson({...lo(S.look),armour:{body:m,boots:m},view:v,frame:0})}catch(e){bad.push(m+v+e.message)}}));return bad.length?bad:true})()"), "every armour look draws in every view"
    assert ev("playerLook().armour.helm==='cloth'&&playerLook().armour.body==='leather'&&playerLook().armour.boots==='chain'"), "what you wear is drawn on you"
    ev("S.eq.boots='enchanted_boots';ui()"); assert ev("fx('speed')===1&&slotOf('enchanted_boots')==='boots'"), "the quest boots take the Boots slot like any other"
    pg.click('#eq-helmet'); pg.click('#eqs-pick .eqrow:last-child'); assert ev("S.eq.helmet===null"), "Take off removes it"
    pg.click('#eqs-back'); assert ev("!$('eqs').classList.contains('open')"), "Back closes the equipment screen"
    ev("S.eq={};S.bag={}")
    # playtest #3: the rockslide outside the Darkwood's north gate seals the way until it is broken with a pickaxe, then Dell thanks you
    reach = "(()=>{const seen=new Set([109*MW+31]),q=[[31,109]];while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=WH||seen.has(k)||!WK.includes(at(nx,ny)))continue;seen.add(k);q.push([nx,ny])}}return seen.has(79*MW+26)})()"
    ev("S.flags={};applyGates();applyStoryPeople();SCENE=null;BATTLE=null;sail=false;P.x=P.rx=31;P.y=P.ry=109;P.f='u';S.eq.pickaxe=null")
    assert not ev(reach), "the rockslide seals the way from the Darkwood's north gate to the Mountain Town"
    assert ev("NPC.some(n=>n.n==='Miner Dell'&&n.work==='pick')"), "a miner is digging at the rocks"
    ev("act()"); assert ev("!flag('rockslide_cleared')"), "no pickaxe, the rocks stay"
    ev("TRIGGERS.forEach(t=>{if(t.id!=='rockslide_thanks')markSeen('trg:'+t.id)});S.gold=0;add('pickaxe');S.eq.pickaxe='pickaxe';act()"); assert ev("flag('rock_3')&&!flag('rockslide_cleared')&&at(30,108)===141&&at(31,108)!==141"), "one swing breaks only the rock you face (you can squeeze through the gap, but Dell pays only when all are broken)"
    ev("[29,30,32,33,34].forEach(x=>{P.x=P.rx=x;P.y=P.ry=109;P.f='u';act()})"); assert ev("flag('rockslide_cleared')&&[29,30,31,32,33,34].every(x=>at(x,108)!==141)") and ev(reach), "breaking every rock opens the road"
    pg.wait_for_function("dlgActive()&&/This rock slide was going to take all day to clear/.test($('dlg').textContent)", timeout=8000)   # Dell thanks you
    ev("dlgAdvance();dlgAdvance()")
    pg.wait_for_function("dlgActive()&&/take this for your trouble/.test($('dlg').textContent)", timeout=8000)   # then the reward line
    ev("dlgAdvance();dlgAdvance()"); pg.wait_for_function("S.gold===150", timeout=8000)   # Dell pays 150 gold once the road is clear
    ev("dlgEnd();trgRunning=false")
    # playtest #4, batch C2: balance (P62, P70), sea creatures (P72) and the rock dragons (P73)
    assert ev("ITEMS.iron_sword.damage===9&&ITEMS.greatsword.damage===12&&ITEMS.divine_blade.damage===14&&ATTACKS.divine_strike.power===1.8&&FOES.final_raider.hp>=50&&FOES.barron.hp>=300&&FOES.final_raider.hit[0]>=9"), "weapons are weaker and the late pirates hit harder and take more"
    assert ev("(()=>{const best=ITEMS.divine_blade.damage*(1+.08*6)*ATTACKS.divine_strike.power*1.15;return best<FOES.final_raider.hp&&best<FOES.final_gunner.hp})()"), "Divine Strike no longer finishes a Final Fight pirate in one blow at Sword skill 6"
    ev("sail=true;BATTLE=null;SCENE=null;setFlag('festival_done');window.__sp=(()=>{for(let y=60;y<230;y++)for(let x=250;x<310;x++)if(seaOpen(x,y)&&Math.hypot(x-156,y-113)>95)return[x,y];return null})();P.x=P.rx=B.x=__sp[0];P.y=P.ry=B.y=__sp[1]")
    ev("seaQuiet=1;window.__m=Math.random;Math.random=()=>0;seaTick();Math.random=__m"); assert ev("SEA_ALERT>performance.now()"), "sailing in open sea far from home can bring an attack, with an alert first"
    ev("P.x=P.rx=B.x=156;P.y=P.ry=B.y=130;SEA_ALERT=0;seaQuiet=1;Math.random=()=>0;seaTick();Math.random=__m"); assert ev("SEA_ALERT===0"), "never near the village"
    pg.wait_for_function("BATTLE!==null&&BATTLE.row.field==='sea'", timeout=5000); assert ev("BATTLE.foes[0].t.n==='Shark'||BATTLE.foes[0].t.n==='Ancient squid'"), "then the battle starts on the sea"
    assert ev("[...$('bt-menu').children].some(b=>b.textContent==='Run')"), "a sea creature can be run from"
    ev("bEnd('ran')"); pg.wait_for_function("BATTLE===null", timeout=5000)
    ev("seaAttack('sea_squid')"); pg.wait_for_function("BATTLE!==null&&BATTLE.foes[0].t.n==='Ancient squid'", timeout=5000); ev("bEnd('ran')"); pg.wait_for_function("BATTLE===null", timeout=5000)
    ev("sail=false;SEA_ALERT=0;P.x=P.rx=32+OX;P.y=P.ry=33+OY")
    pgd, errd = load(b, url, SAVE); evd = pgd.evaluate   # a fresh page, because the older tests above clear the extra creatures
    assert evd("ENEMIES.filter(e=>e.t==='rock_dragon'&&e.alive&&at(e.x,e.y)===48).length>=3"), "rock dragons stand on the bare rock of the mountain country"
    evd("BATTLE_FAST=true;sail=false;startEnemyBattle(ENEMIES.find(e=>e.t==='rock_dragon'))"); pgd.wait_for_function("BATTLE!==null&&BATTLE.foes[0].t.n==='Rock dragon'", timeout=5000)
    assert evd("BATTLE.foes[0].t.pattern.length===3&&/fire/.test(BATTLE.foes[0].t.pattern[2].atk)&&BATTLE.foes[0].t.art==='dragon'"), "the dragon winds up and then breathes fire"
    evd("S.hp=500;BATTLE.foes[0].turns=2;bFoes()"); pgd.wait_for_function("BATTLE.fx.includes('firebreath')", timeout=5000); evd("bEnd('ran')"); pgd.wait_for_function("BATTLE===null", timeout=5000)
    assert not errd, errd; pgd.close()
    # playtest #4 (P60): a pirate that sees you hops with a "!", walks up beside you, says a line, and then the battle starts
    ev("sail=false;SCENE=null;BATTLE=null;P.x=P.rx=32+OX;P.y=P.ry=33+OY;NPC.forEach(n=>{if(n.enc)n.coolUntil=1e15});ENCOUNTERS.push({id:'t_sight',mode:'battle',near:1,foes:[{foe:'pirate_grunt',at:[0,-4]}]});startEncounter('t_sight');ENC_SIGHT=true")
    pg.wait_for_function("SCENE!==null", timeout=4000)
    assert ev("(()=>{const n=encFigures('t_sight')[0];return n.alertUntil>performance.now()&&n.alertAt>0})()"), "a pirate that sees you shows the alert mark"
    pg.wait_for_function("dlgActive()&&/Placeholder/.test($('dlg').textContent)", timeout=8000)
    assert ev("(()=>{const n=encFigures('t_sight')[0];return Math.abs(n.x-P.x)+Math.abs(n.y-P.y)===1})()"), "the pirate walked up beside you before speaking"
    ev("dlgAdvance();dlgAdvance()"); pg.wait_for_function("BATTLE!==null", timeout=4000)
    assert ev("BATTLE.foes.length===1"), "the battle starts after the pirate's line"
    ev("ENC_SIGHT=false;bEnd('ran')"); pg.wait_for_function("BATTLE===null", timeout=4000)
    ev("encClear(encRow('t_sight'));SCENE=null;NPC.forEach(n=>{n.coolUntil=0})")
    assert not errs, errs
    pg.close()
    # the hidden rooms moved below the sea (world version 3): an older world-version-2 save keeps its home-room station and its Darkwood treasure record in the new places
    old = dict(SAVE); old["placed"] = [{"id": "bench", "x": 303, "y": 230}]; old["cut"] = {str(20 * 320 + 120): {"m": 46, "d": 1}}
    pg, errs = load(b, url, old)
    mig = pg.evaluate("({wv:S.wv,placed:S.placed.map(o=>[o.x,o.y]),cutNew:!!S.cut[(20+FY)*MW+120],cutOld:!!S.cut[20*MW+120],zonesBelow:[IR,GZ,AZ,SZ,HZ,VZ,PH,PG,TS,FZ].every(z=>z.y0>=WH+6),seaClean:(()=>{for(let y=0;y<WH;y++)for(let x=0;x<MW;x++)if(zoneOf(x,y))return false;return true})(),edge:(()=>{sail=true;P.x=P.rx=B.x=150;P.y=P.ry=B.y=WH-1;move('d');return P.y===WH-1})(),forest:(()=>{sail=false;P.x=P.rx=31;P.y=P.ry=111;P.f='u';act();return zoneOf(P.x,P.y)===2&&P.y===FZ.y0+1&&at(P.x,P.y)!==0})()})")
    assert mig == {"wv": 4, "placed": [[303, 254]], "cutNew": True, "cutOld": False, "zonesBelow": True, "seaClean": True, "edge": True, "forest": True}, mig
    assert not errs, errs
    pg.close()
    # an old v1 save still loads, is migrated, and is backed up
    pg, errs = load(b, url, OLD_SAVE)
    s = pg.evaluate("({v:S.v,wv:S.wv,day:S.day,sardine:S.bag.sardine,rod:S.eq.rod,backup:!!localStorage.getItem('little-harbor-v1-backup-v1')})")
    assert s == {"v": 3, "wv": 4, "day": 3, "sardine": 4, "rod": "bamboo_rod", "backup": True}, s  # (the testing gifts are off, so no extra sardines)
    assert not errs, errs
    pg.close()


def all_scripts_listed():
    html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    files = [os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, "/") for d, _, fs in os.walk(os.path.join(ROOT, "js")) for f in fs if f.endswith(".js")]
    missing = [f for f in files if '<script src="%s">' % f not in html]
    assert not missing, "not loaded by index.html: %s" % missing


if __name__ == "__main__":
    all_scripts_listed()
    url = serve()
    with sync_playwright() as p:
        for name in sys.argv[1:] or ["chromium", "webkit"]:
            b = getattr(p, name).launch()
            check(b, url)
            b.close()
            print("smoke test passed in", name)

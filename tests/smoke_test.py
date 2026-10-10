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
    pg.add_init_script("try{sessionStorage.setItem('lh-started','1')}catch(e){}")
    pg.goto(url)
    pg.evaluate("s=>localStorage.setItem('little-harbor-v1',s)", json.dumps(save)); pg.reload(); pg.wait_for_timeout(400)
    return pg, errs


def check(b, url):
    pg, errs = load(b, url, SAVE)
    ev = pg.evaluate
    y0 = ev("P.y"); ev("move('u')"); assert ev("P.y") != y0, "player should move"
    for btn in ("#bagbtn", "#skbtn", "#mapbtn"):
        pg.tap(btn); pg.wait_for_timeout(100)
        pg.keyboard.press("Escape")
        ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    for js, sel in (("openStore('rod')", "#store"), ("openGeneral('buy')", "#store"), ("openCraft('bench')", "#craft")):
        ev(js); assert ev("s=>document.querySelector(s).classList.contains('open')", sel), js + " should open"
        ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    assert ev("[MW,WH,MH]") == [320, 240, 300]
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
    seal = ev("(()=>{const ok=new Set(WK),D4=[[1,0],[-1,0],[0,1],[0,-1]],sea=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&at(x,y)===0,flood=st=>{const s=new Set(st.map(([x,y])=>y*MW+x)),q=st.slice();for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of D4){const nx=x+a,ny=y+b,i=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH||s.has(i)||!ok.has(at(nx,ny)))continue;s.add(i);q.push([nx,ny])}}return s},mtn=flood([[26,77]]),seeds=[];for(let y=0;y<MH;y++)for(let x=0;x<=110;x++)if(ok.has(at(x,y))&&!mtn.has(y*MW+x)&&D4.some(([a,b])=>sea(x+a,y+b)))seeds.push([x,y]);const out=flood(seeds);let landing=0,leak=0;mtn.forEach(i=>{const x=i%MW,y=(i/MW)|0;if(D4.some(([a,b])=>sea(x+a,y+b)))landing++;if(out.has(i))leak++});return{landing,leak,temple:mtn.has(29*MW+9),gate:mtn.has(109*MW+31)}})()")
    assert seal == {"landing": 0, "leak": 0, "temple": True, "gate": True}, seal
    # phone D-pad and keyboard move at the same speed: holding either for 1 s gives about the same number of steps
    def held(start, stop):
        ev("(()=>{window.__n=0;const mv=window.__mv||(window.__mv=move);window.move=d=>{window.__n++;return mv(d)}})()")
        ev("window.__p0=window.__p0||[P.x,P.y]");  # both runs start on the same tile, so a wall or wanderer further along cannot skew the second one
        ev("P.x=P.rx=window.__p0[0];P.y=P.ry=window.__p0[1];P.f='r'")
        start(); pg.wait_for_timeout(1000); stop()
        n = ev("window.__n"); ev("(()=>{window.move=window.__mv})()"); return n
    kb = held(lambda: pg.keyboard.down("ArrowRight"), lambda: pg.keyboard.up("ArrowRight"))
    dp = held(lambda: ev("$('right').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))"), lambda: ev("$('right').dispatchEvent(new PointerEvent('pointerup',{bubbles:true}))"))
    assert abs(kb - dp) <= 2 and 8 <= kb <= 20, (kb, dp)
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
        pg.keyboard.down("ArrowRight"); pg.wait_for_timeout(600); pg.keyboard.up("ArrowRight"); pg.wait_for_timeout(100)
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
    ap = ev("(()=>{const a=NPC.find(n=>n.n==='Astrid'),sh=BL.find(b=>b.sign==='apothecary'),names=NPC.map(n=>n.n);return {one:NPC.filter(n=>n.n==='Astrid').length===1,inTown:!!a&&a.x>=84&&a.x<=115&&a.y>=200&&a.y<=234,shop:!!sh&&sh.x+1===a.x&&sh.y+2===a.y,door:WK.includes(at(a.x,a.y+1)),walls:[0,1].every(j=>[0,1,2].every(i=>at(sh.x+i,sh.y+j)===5)),murl:!!NPC.find(n=>n.n==='Murl'&&n.store==='boat')&&!NPC.some(n=>n.n==='Captain Rue'),solveig:names.includes('Solveig'),unique:new Set(names.filter(n=>!/fan|Warden|Guard/.test(n))).size===names.filter(n=>!/fan|Warden|Guard/.test(n)).length}})()")
    assert all(ap.values()), ap
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
    ev("S.bag.gold_ore=2;openTrader('smith','sell')"); assert ev("/Gold ore x2/.test($('items').textContent)"), "Garrick buys gold"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    pgo, erro = load(b, url, dict(SAVE, cut={str(104 * 320 + 142): {"m": 17, "d": 1}}))   # an old ore record at a spot that no longer has ore (it was on the village island)
    assert pgo.evaluate("!S.cut[104*MW+142]&&at(142,104)!==18"), "old ore records elsewhere are dropped"
    pgo.close()
    # foraging: mushrooms and forest sprigs grow only in the Darkwood and only a few; all of them can be reached from its south gate; one can be picked; old records outside the wood are dropped
    fg = ev("(()=>{const c={},out=[];for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=at(x,y);if(t>=27&&t<=30){c[t]=(c[t]||0)+1;if(!inFZ(x,y))out.push([x,y])}}"
            "const W=new Set(WK),sx=123,sy=38+FY,s=new Set([sy*MW+sx]),q=[[sx,sy]];for(let h=0;h<q.length;h++){const[x,y]=q[h];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const i=(y+b)*MW+x+a;if(!s.has(i)&&W.has(at(x+a,y+b))){s.add(i);q.push([x+a,y+b])}}}"
            "let far=0;for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=at(x,y);if(t>=27&&t<=30&&!s.has(y*MW+x))far++}"
            "return {c,out:out.length,far,total:Object.values(c).reduce((a,b)=>a+b,0)}})()")
    assert fg["out"] == 0 and fg["far"] == 0 and 60 <= fg["total"] <= 100 and all(fg["c"].get(str(k), 0) >= 10 for k in (27, 28, 29, 30)), fg
    ev("S.eq.knife='knife';S.bag.knife=1;S.sta=100")
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
    # testing prices: while BOAT_TEST is on, all three bought boats cost 100 gold at Murl's boatyard
    ev("S.gold=1000;S.bag.sloop=0;S.bag.schooner=0;S.bag.brig=0;openStore('boat')")
    assert ev("['sloop','schooner','brig'].every(id=>ITEMS[id].price===100)||!BOAT_TEST"), "boats cost 100 while testing"
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
    pm.click("#title-body button.tm >> text=Yes, load it"); pm.wait_for_timeout(600)
    assert pm.evaluate("S.gold===10&&!$('title').classList.contains('open')&&!!localStorage.getItem('little-harbor-v1-backup-before-load')"), "loading a slot restores that game, goes straight in and keeps a backup"
    fobj = pm.evaluate("JSON.stringify(saveFileObj())"); pm.evaluate("S.gold=555;save()"); pm.keyboard.press("Escape")
    pm.click("#title-body button.tm >> text=Load game")
    pm.set_input_files("input[type=file]", {"name": "mine.json", "mimeType": "application/json", "buffer": fobj.encode()}); pm.click("#title-body button.tm >> text=Yes, load it"); pm.wait_for_timeout(600)
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
    ev("openStore('rod')"); assert tabs() == ["Rods", "Weapons", "Tools", "Home"] and shown() == ["Rods"], (tabs(), shown())
    ev("[...document.querySelectorAll('#items .tabs button')].find(b=>b.textContent==='Tools').click()"); assert shown() == ["Tools"] and ev("[...document.querySelectorAll('#items .tabs button.sel')].map(b=>b.textContent)") == ["Tools"], shown()
    ev("openStore('rod')"); assert shown() == ["Tools"], "the chosen category is remembered"
    ev("openStore('boat')"); assert tabs() == ["Boats", "Yard"], tabs()
    ev("openTrader('smith','buy')"); assert tabs() == ["Materials", "Weapons", "Tools", "Objects"], tabs()
    ev("openTrader('jeweller','buy')"); assert tabs() == ["Rings", "Amulets"], tabs()
    ev("openTrader('apothecary','buy')"); assert tabs() == ["Potions", "Poisons"], tabs()
    ev("S.bag.sardine=3;S.bag.carrot=2;openGeneral('sell')"); assert tabs()[0] == "Fish" and "Ingredients" in tabs(), tabs()
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
    # the character screen: a Me button next to Bag shows the portrait, day, gold and health, and its Save button opens the save choices
    pg.tap("#chbtn"); pg.wait_for_timeout(200)
    assert ev("$('ch').classList.contains('open')&&/Day/.test($('ch-info').textContent)&&/Gold/.test($('ch-info').textContent)"), "Me opens the character screen"
    assert ev("(()=>{const d=$('ch-pt').getContext('2d').getImageData(0,0,96,96).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]!==142)n++;return n>200})()"), "the figure is drawn"
    pg.tap("#ch-quests"); pg.wait_for_timeout(200)
    assert ev("$('qs').classList.contains('open')&&/No quest right now/.test($('qs-list').textContent)"), "the quest log opens, empty at first"
    ev("QUESTS.push({id:'t_q1',name:'Test quest',steps:['Do the first thing.','Now the second thing.']},{id:'t_q0',name:'Old quest',steps:['x']});questSet('t_q1',1);questDone('t_q0');openQuests()")
    assert ev("/Test quest/.test($('qs-list').textContent)&&/Now the second thing\\./.test($('qs-list').textContent)&&/FINISHED/.test($('qs-list').textContent)&&/Old quest/.test($('qs-list').textContent)"), "the log shows the current step and the finished list"
    ev("questDone('t_q1');openQuests()"); assert ev("S.story.q===null&&/No quest right now/.test($('qs-list').textContent)&&S.story.done.length===2"), "a finished quest moves to the list"
    pg.tap("#qs-back"); assert ev("!$('qs').classList.contains('open')&&$('ch').classList.contains('open')"), "Back returns to the character screen"
    pg.tap("#ch-save"); pg.wait_for_timeout(200)
    assert ev("!$('ch').classList.contains('open')&&$('title').classList.contains('open')&&$('title-h').textContent==='Save game'"), "Save opens the save choices"
    ev("tmClose()")
    # tailor and barber: the look screen charges only for what you change, and every hair style draws
    ev("S.gold=500;openLook('tailor');LK.jk=3;buildSw()"); assert ev("$('go').textContent")=="Pay 80g"
    ev("$('go').click()"); assert ev("[S.gold,S.look.jk]")==[420,3], "tailor charge"
    ev("openLook('barber');LK.hstyle='long';LK.hair=2;buildSw()"); assert ev("$('go').textContent")=="Pay 100g"
    ev("$('lookx').click()"); assert ev("[S.gold,S.look.hstyle]")==[420,None], "cancelled barber visit costs nothing"
    ev("S.look.jk=1;HSTYLES.forEach(h=>['f','b','r'].forEach(v=>{const c=document.createElement('canvas').getContext('2d');CharacterSprite.draw(c,0,0,{...lo({...S.look,hstyle:h}),view:v,frame:0})}))")
    ev("openSmith('buy')"); assert ev("document.querySelector('#store').classList.contains('open')&&/Iron sword/.test($('items').textContent)"), "smith shop"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    assert not errs, errs
    pg.close()
    # the hidden rooms moved below the sea (world version 3): an older world-version-2 save keeps its home-room station and its Darkwood treasure record in the new places
    old = dict(SAVE); old["placed"] = [{"id": "bench", "x": 303, "y": 230}]; old["cut"] = {str(20 * 320 + 120): {"m": 46, "d": 1}}
    pg, errs = load(b, url, old)
    mig = pg.evaluate("({wv:S.wv,placed:S.placed.map(o=>[o.x,o.y]),cutNew:!!S.cut[(20+FY)*MW+120],cutOld:!!S.cut[20*MW+120],zonesBelow:[IR,GZ,AZ,SZ,HZ,VZ,PH,PG,TS,FZ].every(z=>z.y0>=WH+6),seaClean:(()=>{for(let y=0;y<WH;y++)for(let x=0;x<MW;x++)if(zoneOf(x,y))return false;return true})(),edge:(()=>{sail=true;P.x=P.rx=B.x=150;P.y=P.ry=B.y=WH-1;move('d');return P.y===WH-1})(),forest:(()=>{sail=false;P.x=P.rx=31;P.y=P.ry=111;P.f='u';act();return zoneOf(P.x,P.y)===2&&P.y===FZ.y0+1&&at(P.x,P.y)!==0})()})")
    assert mig == {"wv": 3, "placed": [[303, 254]], "cutNew": True, "cutOld": False, "zonesBelow": True, "seaClean": True, "edge": True, "forest": True}, mig
    assert not errs, errs
    pg.close()
    # an old v1 save still loads, is migrated, and is backed up
    pg, errs = load(b, url, OLD_SAVE)
    s = pg.evaluate("({v:S.v,wv:S.wv,day:S.day,sardine:S.bag.sardine,rod:S.eq.rod,backup:!!localStorage.getItem('little-harbor-v1-backup-v1')})")
    assert s == {"v": 3, "wv": 3, "day": 3, "sardine": 4 + 4, "rod": "bamboo_rod", "backup": True}, s  # +4 sardines from the TEST_KITS roundB grant
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

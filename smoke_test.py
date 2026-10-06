"""Smoke test: load the game with a seeded save and check the basics. Run: python tests/smoke_test.py (needs: pip install playwright && playwright install chromium)"""
import json, sys
from playwright.sync_api import sync_playwright
SAVE = {"v": 3, "wv": 2, "look": {"skin": 0, "hair": 1, "shirt": 5, "jk": 1}, "day": 2, "gold": 10, "seen": 1, "hp": 50, "sta": 100, "xp": {},
        "granted": ["sword", "roundA", "roundB", "roundC", "roundD", "roundE", "roundF", "roundG"], "cut": {}, "placed": [], "gardens": [], "claim": None, "home": None,
        "bag": {"driftwood_rod": 1, "rowboat": 1}, "eq": {"rod": "driftwood_rod", "boat": "rowboat", "weapon": None, "pickaxe": None, "axe": None, "knife": None}}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + sys.argv[1] if len(sys.argv) > 1 else "file:///index.html")
    pg.evaluate("s=>localStorage.setItem('little-harbor-v1',s)", json.dumps(SAVE)); pg.reload(); pg.wait_for_timeout(400)
    ev = pg.evaluate
    y0 = ev("P.y"); ev("move('u')"); assert ev("P.y") != y0, "player should move"
    for btn in ("#bagbtn", "#skbtn", "#mapbtn"):
        pg.tap(btn); pg.wait_for_timeout(100)
        pg.keyboard.press("Escape")
        ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    assert ev("[MW,MH]") == [320, 240]
    water = ev("(()=>{const seen=new Uint8Array(MW*MH),q=[[B.x,B.y]];seen[B.y*MW+B.x]=1;let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const i=ny*MW+nx;if(seen[i]||at(nx,ny)!==0)continue;seen[i]=1;q.push([nx,ny])}}let w=0;for(let i=0;i<M.length;i++)if(M[i]===0)w++;return q.length/w})()")
    assert water > 0.99, "sea should be one connected body"
    bad = ev("(()=>{let n=0;for(let y=0;y<MH;y+=20)for(let x=0;x<MW;x+=20){P.x=P.rx=x;P.y=P.ry=y;try{draw()}catch(e){n++}}return n})()")
    assert bad == 0, "draw() should not throw anywhere"
    assert not errs, errs
    print("smoke test passed"); b.close()

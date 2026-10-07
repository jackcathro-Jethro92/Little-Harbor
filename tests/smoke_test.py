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
    assert ev("[MW,MH]") == [320, 240]
    water = ev("(()=>{const seen=new Uint8Array(MW*MH),q=[[B.x,B.y]];seen[B.y*MW+B.x]=1;let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const i=ny*MW+nx;if(seen[i]||at(nx,ny)!==0)continue;seen[i]=1;q.push([nx,ny])}}let w=0;for(let i=0;i<M.length;i++)if(M[i]===0)w++;return q.length/w})()")
    assert water > 0.99, "sea should be one connected body"
    bad = ev("(()=>{let n=0;for(let y=0;y<MH;y+=20)for(let x=0;x<MW;x+=20){P.x=P.rx=x;P.y=P.ry=y;try{draw()}catch(e){n++}}return n})()")
    assert bad == 0, "draw() should not throw anywhere"
    # the Walled Settlement: every house door can be reached from its gate, and Garrick's forge opens
    town = ev("(()=>{const ok=new Set(WK),seen=new Set([202*MW+100]),q=[[100,202]];let h=0;while(h<q.length){const[x,y]=q[h++];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,i=ny*MW+nx;if(seen.has(i)||!ok.has(at(nx,ny)))continue;seen.add(i);q.push([nx,ny])}}const bs=BL.filter(b=>b.x>=84&&b.x<=115&&b.y>=200&&b.y<=234);return{houses:bs.length,stuck:bs.filter(b=>!seen.has((b.y+2)*MW+b.x+1)).length,people:NPC.filter(n=>n.x>=84&&n.x<=115&&n.y>=200&&n.y<=234).length}})()")
    assert town["houses"] >= 15 and town["stuck"] == 0 and town["people"] >= 15, town
    ev("openSmith('buy')"); assert ev("document.querySelector('#store').classList.contains('open')&&/Iron sword/.test($('items').innerText)"), "smith shop"
    ev("document.querySelectorAll('.open').forEach(e=>e.classList.remove('open'))")
    assert not errs, errs
    pg.close()
    # an old v1 save still loads, is migrated, and is backed up
    pg, errs = load(b, url, OLD_SAVE)
    s = pg.evaluate("({v:S.v,wv:S.wv,day:S.day,sardine:S.bag.sardine,rod:S.eq.rod,backup:!!localStorage.getItem('little-harbor-v1-backup-v1')})")
    assert s == {"v": 3, "wv": 2, "day": 3, "sardine": 4 + 4, "rod": "bamboo_rod", "backup": True}, s  # +4 sardines from the TEST_KITS roundB grant
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

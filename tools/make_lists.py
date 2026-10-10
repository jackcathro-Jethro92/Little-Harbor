"""Make NAMES.md (every named character) and DIALOGUE.md (every spoken line, marked original or placeholder).
Run from the repo root:  python3 tools/make_lists.py   (needs Playwright, like the smoke test).
A line is 'original' if it appears word for word in the first game file Jack uploaded (git commit f7ee28c); every other line is a placeholder written while building."""
import glob, json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tests"))
import smoke_test as t
from playwright.sync_api import sync_playwright

ORIG = subprocess.run(["git", "show", "f7ee28c:index.html"], cwd=ROOT, capture_output=True, text=True).stdout.replace("\\'", "'")
is_orig = lambda s: s in ORIG
exe = (glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome") + glob.glob("/opt/pw-browsers/chromium/chrome-linux/chrome") or [None])[0]
ZONES = {2: "The Darkwood", 3: "Fighters Guild hall (Mountain Town)", 4: "Gladiators' Arena (Mountain Town)"}

JS = """(()=>{const area=n=>{const z=zoneOf(n.x,n.y);if(z===2)return 'The Darkwood';if(z===3)return 'Fighters Guild hall (Mountain Town)';if(z===4)return "Gladiators' Arena (Mountain Town)";
 let best=null,bd=1e9;LAND.forEach(l=>{const d=Math.hypot(l[1]-n.x,l[2]-n.y);if(d<bd){bd=d;best=l[0]}});return best};
 return NPC.map(n=>({n:n.n,area:n.pirate?'Pirate camp (Volcano Island)':area(n),job:(n.bio&&n.bio.job)||null,store:n.store||null,pirate:!!n.pirate,say:n.say||[]}))})()"""
ROLES = {"Odo": "General store keeper", "Captain Rue": "Boat seller", "Hale": "Woodcutter (Darkwood)", "Wren": "Forager (Darkwood)", "Tilda": "Blacksmith's apprentice", "Aldric": "Fighters Guild member", "Hild": "Fighters Guild member", "Old Stig": "Old miner"}
PREFIX = [("Warden", "Mountain Town warden"), ("Miner", "Miner"), ("Sergeant", "Guild sergeant"), ("Gate Guard", "Gate guard"), ("Gambler", "Arena gambler"), ("Arena Master", "Arena master"), ("Guildmaster", "Fighters Guild master")]
JOBS = {"smith": "Blacksmith", "rod": "Fishing and boat shop", "general": "General store", "jeweller": "Goldsmith (enchanted jewellery)", "guild": "Fighters Guild master"}

def collect(b, url, query=""):
    pg, errs = t.load(b, url + query, t.SAVE) if not query else t.load(b, url, t.SAVE)
    if query:
        pg.evaluate("applyPirates(true)")
    return pg.evaluate(JS)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()
    t.all_scripts_listed(); url = t.serve()
    base = collect(b, url)
    withp = collect(b, url, "?x")
people = base + [n for n in withp if n["pirate"]]

names = ["# Little Harbor: named characters (for Jack to review)\n",
         "Made by `tools/make_lists.py` from the running game. Nobody has been renamed. Tell me which names to change and I will change them in one go.\n",
         "| Name | Where they live | Job or role |", "| --- | --- | --- |"]
for n in people:
    job = n["job"] or ROLES.get(n["n"]) or next((v for k, v in PREFIX if n["n"].startswith(k)), None) or JOBS.get(n["store"] or "", None) or ("Pirate" if n["pirate"] else "Spectator" if "fan" in n["n"].lower() else "Villager")
    names.append("| %s | %s | %s |" % (n["n"], n["area"], job))
names += ["", "Also named in the game: the town's pets (two dogs and a cat, unnamed), the farm animals (unnamed), and the spirit in the Darkwood (unnamed).", "Placeholders in this list: none yet; every name above was in the game before the roadmap started. The roadmap's story characters will be added when the story is built."]
open(os.path.join(ROOT, "NAMES.md"), "w").write("\n".join(names) + "\n")

dlg = ["# Little Harbor: every spoken line, and who wrote it\n",
       "Made by `tools/make_lists.py`. **Original** means the line is word for word in the first game file Jack uploaded (7 October 2026). **Placeholder** means it was written while building and is only filler: replace it with your own words whenever you like. No line has been changed or removed because of this list. New story lines will be marked as placeholders when they are added.\n"]
tot = {"original": 0, "placeholder": 0}
by = {}
for n in people:
    for s in n["say"]:
        st = "original" if is_orig(s) else "placeholder"; tot[st] += 1
        by.setdefault((n["area"], n["n"]), []).append((st, s))
dlg.append("**Totals (people's lines): %d original, %d placeholder.**\n" % (tot["original"], tot["placeholder"]))
for (area, name), lines in sorted(by.items()):
    dlg.append("### %s (%s)" % (name, area))
    dlg += ["- *%s:* %s" % (st, s) for st, s in lines]
    dlg.append("")
dlg.append("## Lines spoken by menus and shopkeepers (in the code)\n")
for f in sorted(glob.glob(os.path.join(ROOT, "js", "**", "*.js"), recursive=True)):
    for m in re.finditer(r"'((?:Odo|Rue|Wynn|Fenwick|Brenna|Dorn|Garrick|Lucie|Bram): [^']{3,}?)'", open(f).read()):
        s = m.group(1)
        dlg.append("- *%s* (`%s`): %s" % ("original" if is_orig(s.replace("\\'", "'")) else "placeholder", os.path.relpath(f, ROOT), s))
open(os.path.join(ROOT, "DIALOGUE.md"), "w").write("\n".join(dlg) + "\n")
print("people", len(people), "lines", tot)

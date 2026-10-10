"""Make NAMES.md (every named character) and DIALOGUE.md (every spoken line, marked original, Jack's or placeholder).
Run from the repo root:  python3 tools/make_lists.py   (needs Playwright, like the smoke test). The smoke test also calls build() and fails if the two files are out of date.
A line is 'original' if it is word for word in the first game file Jack uploaded (tools/original_lines.txt); 'Jack's' if it is listed in JACKS_LINES.txt; otherwise a placeholder."""
import glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def _lines(path):
    if not os.path.exists(path):
        return set()
    return {l.rstrip("\n") for l in open(path, encoding="utf-8") if l.strip() and not l.startswith("#")}

ORIG = _lines(os.path.join(ROOT, "tools", "original_lines.txt"))
JACK = _lines(os.path.join(ROOT, "JACKS_LINES.txt"))
def status(s):
    s = s.replace("\\'", "'")
    return "jack" if s in JACK else "original" if s in ORIG else "placeholder"
LABEL = {"jack": "Jack's", "original": "original", "placeholder": "placeholder"}

JS = """(()=>{const area=n=>{const z=zoneOf(n.x,n.y);if(z===2)return 'The Darkwood';if(z===3)return 'Fighters Guild hall (Mountain Town)';if(z===4)return "Gladiators' Arena (Mountain Town)";
 let best=null,bd=1e9;LAND.forEach(l=>{const d=Math.hypot(l[1]-n.x,l[2]-n.y);if(d<bd){bd=d;best=l[0]}});return best};
 return NPC.map(n=>({n:n.n,area:n.pirate?'Pirate camp (Volcano Island)':area({x:n.hx!==undefined?n.hx:n.x,y:n.hy!==undefined?n.hy:n.y}),job:(n.bio&&n.bio.job)||null,store:n.store||null,pirate:!!n.pirate,say:n.say||[]}))})()"""
ROLES = {"Odo": "General store keeper", "Murl": "Boat seller (boatyard)", "Hale": "Woodcutter (Darkwood)", "Wren": "Forager (Darkwood)", "Tilda": "Blacksmith's apprentice", "Aldric": "Fighters Guild member", "Hild": "Fighters Guild member", "Old Stig": "Old miner"}
PREFIX = [("Warden", "Mountain Town warden"), ("Miner", "Miner"), ("Sergeant", "Guild sergeant"), ("Gate Guard", "Gate guard"), ("Gambler", "Arena gambler"), ("Arena Master", "Arena master"), ("Guildmaster", "Fighters Guild master")]
JOBS = {"smith": "Blacksmith", "rod": "Fishing and boat shop", "general": "General store", "jeweller": "Goldsmith (enchanted jewellery)", "guild": "Fighters Guild master"}

def build(base, with_pirates):
    """base: the people in the normal game; with_pirates: the people once the pirates have arrived (both from JS). Returns (NAMES.md text, DIALOGUE.md text)."""
    people = base + [n for n in with_pirates if n["pirate"]]
    names = ["# Little Harbor: named characters (for Jack to review)\n",
             "Made by `tools/make_lists.py` from the running game, and checked by the tests, so it is always up to date. Nobody has been renamed. Tell me which names to change and I will change them in one go.\n",
             "| Name | Where they live | Job or role |", "| --- | --- | --- |"]
    for n in people:
        job = n["job"] or ROLES.get(n["n"]) or next((v for k, v in PREFIX if n["n"].startswith(k)), None) or JOBS.get(n["store"] or "", None) or ("Pirate" if n["pirate"] else "Spectator" if "fan" in n["n"].lower() else "Villager")
        names.append("| %s | %s | %s |" % (n["n"], n["area"], job))
    names += ["", "Also named in the game: the town's pets (two dogs and a cat, unnamed), the farm animals (unnamed), and the spirit in the Darkwood (unnamed).",
              "Story characters will be added here when the story is built."]
    tot = {"jack": 0, "original": 0, "placeholder": 0}
    by = {}
    for n in people:
        for s in n["say"]:
            st = status(s); tot[st] += 1
            by.setdefault((n["area"], n["n"]), []).append((st, s))
    dlg = ["# Little Harbor: every spoken line, and who wrote it\n",
           "Made by `tools/make_lists.py` and checked by the tests, so it is always up to date. **Original** means the line is word for word in the first game file Jack uploaded (7 October 2026). **Jack's** means Jack wrote it and listed it in `JACKS_LINES.txt`. **Placeholder** means it was written while building and is only filler: replace it with your own words whenever you like. No line has been changed or removed because of this list.\n",
           "**Totals (people's lines): %d original, %d Jack's, %d placeholder.**\n" % (tot["original"], tot["jack"], tot["placeholder"])]
    for (area, name), lines in sorted(by.items()):
        dlg.append("### %s (%s)" % (name, area))
        dlg += ["- *%s:* %s" % (LABEL[st], s) for st, s in lines]
        dlg.append("")
    dlg.append("## Lines spoken by menus and shopkeepers (in the code)\n")
    for f in sorted(glob.glob(os.path.join(ROOT, "js", "**", "*.js"), recursive=True)):
        for m in re.finditer(r"'((?:Odo|Rue|Wynn|Fenwick|Brenna|Dorn|Garrick|Lucie|Bram): [^']{3,}?)'", open(f, encoding="utf-8").read()):
            s = m.group(1)
            dlg.append("- *%s* (`%s`): %s" % (LABEL[status(s)], os.path.relpath(f, ROOT).replace(os.sep, "/"), s))
    spoken = {s.replace("\\'", "'") for n in people for s in n["say"]}
    unused = sorted(l for l in JACK if l not in spoken and not any(l in open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(ROOT, "js", "**", "*.js"), recursive=True)))
    if unused:
        dlg += ["", "## Lines in JACKS_LINES.txt that are not in the game (yet)\n"] + ["- " + l for l in unused]
    return "\n".join(names) + "\n", "\n".join(dlg) + "\n"

def collect(b, url):
    import smoke_test as t
    pg, _ = t.load(b, url, t.SAVE)
    base = pg.evaluate(JS); pg.evaluate("applyPirates(true)")
    withp = pg.evaluate(JS); pg.close()
    return base, withp

if __name__ == "__main__":
    sys.path.insert(0, os.path.join(ROOT, "tests"))
    import smoke_test as t
    from playwright.sync_api import sync_playwright
    exe = (glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome") + glob.glob("/opt/pw-browsers/chromium/chrome-linux/chrome") or [None])[0]
    t.all_scripts_listed(); url = t.serve()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe, args=["--no-sandbox"]) if exe else p.chromium.launch()
        base, withp = collect(b, url)
    names, dlg = build(base, withp)
    open(os.path.join(ROOT, "NAMES.md"), "w", encoding="utf-8").write(names)
    open(os.path.join(ROOT, "DIALOGUE.md"), "w", encoding="utf-8").write(dlg)
    print("NAMES.md and DIALOGUE.md written")

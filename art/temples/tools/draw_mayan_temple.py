import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'pixel_helpers.py')).read())
from PIL import ImageFont
OUT=os.path.join(HERE,'..','mayan_temple','render_')
def grass(c,x0,y0,w,h,seed=1):
    c.R(x0,y0,w,h,'#9d8e7c');random.seed(seed)
    for _ in range(w*h//18):
        x,y=random.randrange(x0,x0+w),random.randrange(y0,y0+h);c.R(x,y,1,2,random.choice(['#a89a88','#8b7a68','#90806d']))
def rubble(c,x0,y0,w,h,seed=2,base='#8a8a82'):
    c.R(x0,y0,w,h,'#5e5e58');random.seed(seed);y=y0
    while y<y0+h:
        hh=random.randint(3,5);x=x0+random.randint(-3,0)
        while x<x0+w:
            ww=random.randint(4,9);xx=max(x,x0);ww2=min(x+ww,x0+w)-xx-1;hh2=min(hh,y0+h-y)-1
            c.R(xx,y,ww2,hh2,random.choice([base,'#9a9a90','#7a7a72','#a4a49a']));c.R(xx,y,ww2,1,'#b8b8ae');x+=ww
        y+=hh
    for _ in range(w*h//40): c.R(random.randrange(x0,x0+w),random.randrange(y0,y0+h),random.randint(1,3),1,'#827565')
def tree(c,x,y,r,seed):
    random.seed(seed)
    for k in range(r*3):
        a=random.random()*6.28;d=random.random()*r;rr=random.randint(3,6)
        cx,cy=int(x+math.cos(a)*d),int(y+math.sin(a)*d*0.8);c.R(cx-rr,cy-rr,rr*2,rr*2,random.choice(['#726558','#4e443c','#827565','#595d5f','#90887e']))
    for k in range(r): a=random.random()*6.28;d=random.random()*r*.7;c.R(int(x+math.cos(a)*d),int(y+math.sin(a)*d*.8)-2,3,2,'#9d8e7c')
def stairs(c,x,y,w,h,light='#c4c4b8',dark='#8a8a82'):
    for j in range(0,h,4): c.R(x,y+j,w,3,light);c.R(x,y+j+3,w,1,dark)
def doorway(c,x,y,w,h):
    c.R(x,y,w,h,'#141410');c.R(x,y,w,2,'#2a2a26')
def jadekey(c,x,y):
    c.R(x,y,8,14,O);c.R(x+1,y+1,6,5,'#3fb87a');c.R(x+2,y+2,3,2,'#c8ffe0');c.R(x+3,y+6,2,6,'#c9a227');c.R(x+5,y+10,2,1,'#c9a227')

# ---------- A. plan ----------
def plan():
    S=240;im=Image.new('RGB',(S,S),'#4e443c');c=C(im);random.seed(4)
    for _ in range(900): c.R(random.randrange(S),random.randrange(S),random.randint(4,9),random.randint(4,8),random.choice(['#726558','#827565','#4e443c']))
    grass(c,40,60,170,170,5)
    pts=[(120,240),(118,215),(100,195),(96,175),(112,160),(130,150)]
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        for k in range(30): t=k/30;c.R(int(x1+(x2-x1)*t)-4,int(y1+(y2-y1)*t)-4,9,9,'#c8b088')
    c.R(70,180,22,18,'#6e6e68');c.R(72,182,18,14,'#a4a49a')
    c.R(50,90,30,26,'#6e6e68');c.R(53,93,24,20,'#a4a49a');c.R(58,98,14,8,'#3a3a36')
    c.R(170,150,26,22,'#6e6e68');c.R(173,153,20,16,'#a4a49a')
    for k in range(4): c.R(100+k*8,60+k*12,96-k*16,96-k*16,['#7a7a72','#9d8e7c','#8a8a82','#90806d'][k])
    c.R(138,60,20,92,'#c4c4b8')
    for y in range(60,152,4): c.R(138,y,20,1,'#8a8a82')
    c.R(130,62,36,18,'#6e6e68');c.R(132,64,32,14,'#b0b0a6');c.R(140,70,4,6,'#141410');c.R(146,70,4,6,'#141410');c.R(152,70,4,6,'#141410')
    c.R(144,72,8,4,'#3fb87a')
    big=im.resize((S*3,S*3),Image.NEAREST);d=ImageDraw.Draw(big)
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    def lab(x,y,t,ax,ay):
        d.line([(ax*3,ay*3),(x,y)],fill='#ffffff',width=2);w=d.textlength(t,font=f);d.rectangle([x-4,y-3,x+w+4,y+18],fill='#141c24');d.text((x,y),t,fill='#ffe9a0',font=f)
    lab(420,690,'1  Mountain path in',118,226);lab(20,640,'2  Plaza with altar',80,190);lab(20,190,'3  Side shrine',64,100)
    lab(560,560,'4  Side shrine',183,165);lab(500,420,'5  Pyramid stairway',148,130);lab(240,40,'6  Temple on top + sanctum (Earth Key)',148,70)
    d.text((14,10),'Earth Temple complex: dusty mountain ruins overview',fill='#ffffff',font=f)
    big.save(OUT+'earth_0_plan.png')

# ---------- B. jungle plaza approach ----------
def plaza():
    im,d=new();c=C(im)
    grass(c,0,0,W,H,7)
    pts=[(84,208),(82,186),(68,168),(64,146),(78,128),(104,116),(124,100),(132,80)]
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        for k in range(24): t=k/24;c.R(int(x1+(x2-x1)*t)-6,int(y1+(y2-y1)*t)-5,13,10,'#c8b088')
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        for k in range(24): t=k/24;c.R(int(x1+(x2-x1)*t)-4,int(y1+(y2-y1)*t)-3,9,6,'#d4bc94')
    # small altar platform in the grass
    c.R(26,150,30,20,O);rubble(c,27,151,28,18,9);c.R(31,155,20,10,'#9d8e7c');c.R(31,155,20,1,'#a89a88');stairs(c,36,168,10,6)
    # side shrine with three doorways (left), base of the great pyramid (right)
    rubble(c,12,40,50,40,11);c.R(14,30,46,12,'#a4a49a');c.R(14,30,46,2,'#c4c4b8')
    for x in (20,32,44): doorway(c,x,52,7,14)
    stairs(c,24,80,26,14)
    for k in range(3):
        rubble(c,96+k*10,0,80-k*10,14,20+k);grass(c,96+k*10,14,80-k*10,10,30+k)
    c.R(120,0,26,78,'#141410');stairs(c,121,0,24,78)
    # jungle edges
    for (x,y,r,s) in [(0,8,20,1),(10,110,18,2),(-4,196,22,3),(170,120,20,4),(176,190,22,5),(60,-4,14,6),(170,40,14,8)]: tree(c,x,y,r,s)
    for x,y in [(100,150),(110,170),(54,120),(150,100)]: c.R(x,y,4,2,'#4a7a3a');c.R(x+1,y-1,2,1,'#6a9a4a')
    person(c,76,180,True)
    im=glow(im,150,0,120,(255,250,220),.15);im=vignette(im,.3)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'earth_1_plaza.png');return im

# ---------- C. climbing the pyramid ----------
def pyramid():
    im,d=new();c=C(im)
    grass(c,0,0,W,H,13)
    levels=[(188,4),(146,18),(104,32),(62,46),(20,60)]
    c.R(0,0,W,H,'#827565')
    for i,(y,inset) in enumerate(levels):
        grass(c,inset,0,W-2*inset,y,50+i)
        c.R(inset,0,2,y,'#4e443c');c.R(W-inset-2,0,2,y,'#4e443c')
        rubble(c,inset,y,W-2*inset,12,40+i);c.R(inset,y+12,W-2*inset,2,'#352d2d')
    c.R(60,0,56,H,'#5e5e58');stairs(c,62,0,52,H,'#c4c4b8','#8a8a82')
    for y in range(6,H,24): c.R(62+(y*7)%40,y,6,2,'#827565')
    # temple at the top (Tulum-like) with a lattice crest
    rubble(c,48,0,80,22,60);c.R(48,0,80,4,'#b0b0a6')
    for x in (64,84,104): doorway(c,x,8,9,14)
    for (x,y,r,s) in [(-6,40,22,1),(-8,150,22,2),(182,60,22,3),(184,170,22,4)]: tree(c,x,y,r,s)
    for x,y in [(30,120),(140,80),(24,40)]: c.R(x,y,1,22,'#5a4a3a');c.R(x-1,y+6,3,1,'#9d8e7c');c.R(x-1,y+14,3,1,'#9d8e7c')
    person(c,80,120,True)
    im=vignette(im,.3);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'earth_2_pyramid.png');return im

# ---------- D. the temple at the summit ----------
def summit():
    im,d=new();c=C(im)
    c.R(0,0,W,40,'#4a8ad0')
    for y in range(120): c.R(0,y,W,1,'#4c7bb3' if y<40 else '#5a88bc')
    for x in range(W):
        h1=int(58+14*abs(math.sin(x*.045+.6))+6*math.sin(x*.21));c.R(x,h1,1,120-h1,'#3a415a');c.R(x,h1,1,3,'#87a9c0')
        h2=int(80+10*abs(math.sin(x*.07+2))+3*math.sin(x*.4));c.R(x,h2,1,120-h2,'#726558');c.R(x,h2,1,1,'#9d8e7c')
    for x,y,w in [(20,10,30),(110,6,40),(140,22,24)]: c.R(x,y,w,6,'#87a9c0');c.R(x+4,y-3,w-8,4,'#a8c4d4')
    # summit platform
    rubble(c,0,120,W,88,70,'#9a9a90');grass(c,0,170,W,38,71)
    stairs(c,60,176,56,32)
    # temple building
    rubble(c,24,52,128,76,72,'#a4a49a')
    c.R(24,48,128,6,'#c4c4b8');c.R(24,62,128,4,'#8a8a82');c.R(24,76,128,3,'#c4c4b8')
    for x in range(28,150,10): c.R(x,67,6,6,'#7a7a72');c.R(x+2,69,2,2,'#a8503a')
    # roof comb lattice
    c.R(56,22,64,28,O);c.R(58,24,60,24,'#b0b0a6')
    for x in range(60,116,8):
        for y in range(26,46,6): c.R(x,y,4,3,'#3a3a36')
    for x in (44,78,112): doorway(c,x,90,18,30)
    for x in (66,100): c.R(x,88,8,34,'#c4c4b8');c.R(x,88,2,34,'#d8d8cc')
    c.R(24,120,128,6,'#c4c4b8');c.R(24,120,128,1,'#e0e0d4')
    # serpent heads at the top of the stairs
    for x in (46,118):
        c.R(x,148,14,12,O);c.R(x+1,149,12,10,'#9a9a90');c.R(x+3,151,2,2,'#141410');c.R(x+9,151,2,2,'#141410');c.R(x+2,156,10,2,'#a8503a')
    for x,y in [(8,130),(152,140),(10,150)]: c.R(x,y,10,6,'#726558');c.R(x+1,y-2,8,3,'#827565')
    for x,y in [(14,166),(150,168),(30,160)]: c.R(x,y,4,2,'#4a7a3a');c.R(x+1,y-1,2,1,'#6a9a4a')
    for (x,y,r,s) in [(-4,60,18,9),(180,70,18,10)]: tree(c,x,y,r,s)
    person(c,80,182,True)
    im=vignette(im,.3);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'earth_3_summit.png');return im

# ---------- E. the sanctum inside ----------
def glyph(c,x,y,seed):
    r=random.Random(seed)
    c.R(x+1,y,11,12,'#5a4632');c.R(x,y+1,13,10,'#5a4632')
    c.R(x+1,y+1,11,10,'#b89a72');c.R(x+1,y+1,11,1,'#d4b88e');c.R(x+1,y+1,1,10,'#d4b88e');c.R(x+2,y+10,10,1,'#8a6e50');c.R(x+11,y+2,1,9,'#8a6e50')
    k=r.randrange(6);D='#6a5038'
    if k==0:   # face in profile
        c.R(x+3,y+3,6,6,D);c.R(x+4,y+4,4,4,'#c8aa80');c.R(x+5,y+5,1,1,D);c.R(x+8,y+7,2,1,D);c.R(x+9,y+3,1,2,D)
    elif k==1: # spiral
        c.R(x+3,y+3,7,1,D);c.R(x+9,y+3,1,6,D);c.R(x+3,y+8,7,1,D);c.R(x+3,y+5,1,4,D);c.R(x+5,y+5,3,1,D);c.R(x+7,y+6,1,1,D)
    elif k==2: # dots over a bar
        for i in range(3): c.R(x+3+i*3,y+3,2,2,D)
        c.R(x+3,y+7,8,2,D)
    elif k==3: # cross-hatch
        for i in range(3):
            c.R(x+3,y+3+i*2,7,1,D);c.R(x+3+i*3,y+3,1,5,D)
    elif k==4: # curled creature head
        c.R(x+3,y+4,7,4,D);c.R(x+4,y+5,5,2,'#c8aa80');c.R(x+5,y+5,1,1,D);c.R(x+3,y+3,2,1,D);c.R(x+9,y+8,1,2,D)
    else:      # stacked affixes
        c.R(x+3,y+3,2,6,D);c.R(x+6,y+3,4,2,D);c.R(x+6,y+6,4,3,D);c.R(x+7,y+7,2,1,'#c8aa80')
def codex_glyph(c,x,y,seed):
    r=random.Random(seed);K='#1a1410'
    c.R(x,y,7,6,K);c.R(x+1,y+1,5,4,'#f4ead6')
    for _ in range(3): c.P(x+1+r.randrange(5),y+1+r.randrange(4),K)
def numeral(c,x,y,dots,bars,col):
    for i in range(dots): c.R(x+i*3,y,2,2,col)
    for j in range(bars): c.R(x,y+3+j*2,8,1,col)
def jaguar(c,x,y):
    K='#1a1410';c.R(x+2,y+6,11,13,K);c.R(x+3,y+7,9,11,'#e8c06a');c.R(x+3,y+1,9,7,K);c.R(x+4,y+2,7,5,'#e8c06a')
    c.R(x+3,y,2,2,K);c.R(x+10,y,2,2,K);c.R(x+5,y+3,1,1,K);c.R(x+8,y+3,1,1,K);c.R(x+5,y+5,4,1,'#b8322a')
    for px,py in [(5,9),(9,10),(4,13),(8,14),(10,16),(6,16)]: c.R(x+px,y+py,2,2,K)
    c.R(x+12,y+12,3,1,K);c.R(x+14,y+9,1,4,K)
def skeleton(c,x,y):
    K='#1a1410';c.R(x+3,y+1,8,7,K);c.R(x+4,y+2,6,5,'#f4ead6');c.R(x+5,y+3,1,2,K);c.R(x+8,y+5,2,1,K)
    c.R(x+3,y,6,2,'#b8322a');c.R(x+9,y-1,3,2,'#3fb87a')
    c.R(x+4,y+8,7,11,K);c.R(x+5,y+9,5,9,'#f4ead6')
    for i in range(4): c.R(x+5,y+10+i*2,5,1,K)
    c.R(x+1,y+10,3,1,K)
def birdman(c,x,y):
    K='#1a1410';c.R(x+4,y+1,8,7,K);c.R(x+5,y+2,6,5,'#f4ead6');c.R(x+8,y+3,1,1,K);c.R(x+1,y+4,4,2,K);c.R(x+2,y+5,2,1,'#e8c06a')
    c.R(x+6,y-1,1,2,K);c.R(x+9,y-2,1,3,K)
    c.R(x+4,y+8,9,11,K);c.R(x+5,y+9,7,9,'#f4ead6');c.R(x+6,y+10,2,7,K);c.R(x+9,y+12,2,5,K);c.R(x+1,y+10,4,2,K)
    for i in range(3): c.R(x+4+i*3,y+8,2,1,'#3fb87a')
def sanctum():
    im,d=new();c=C(im)
    rubble(c,0,0,W,H,80,'#8a8a82')
    for k in range(6): c.R(0,k*3,30-k*5,3,'#3a3a36');c.R(W-30+k*5,k*3,30-k*5,3,'#3a3a36')
    # carved glyph wall (two rows of rounded glyph blocks in warm stone)
    c.R(14,16,148,30,'#6e5640')
    n=0
    for y in (17,31):
        for x in range(16,158,14): glyph(c,x,y,n*7+3);n+=1
    # painted codex mural below: red border, glyph strip with dot-and-bar numbers, three panels
    c.R(14,46,148,38,'#a8322a')
    c.R(16,48,144,14,'#f4ead6')
    for i,x in enumerate(range(18,158,8)): codex_glyph(c,x,49,i+40)
    for i,(x,dd,bb,col) in enumerate([(22,2,0,'#1a1410'),(46,1,2,'#b8322a'),(70,3,0,'#1a1410'),(94,4,1,'#b8322a'),(118,2,0,'#1a1410'),(140,1,2,'#b8322a')]):
        numeral(c,x,56,dd,bb,col)
    for i,(x,col) in enumerate([(16,'#e8a64a'),(65,'#d0583a'),(114,'#e8a64a')]):
        c.R(x,63,46,20,col)
        for _ in range(30): c.P(x+random.randrange(46),63+random.randrange(20),'#f0b860' if col!='#d0583a' else '#e07050')
    skeleton(c,30,64);jaguar(c,80,64);birdman(c,128,64)
    c.R(14,82,148,2,'#7a1e18')
    # floor
    c.R(0,84,W,H-84,'#7a7a72')
    for y in range(84,H,10):
        c.R(0,y,W,1,'#5e5e58')
        for x in range((y//10%2)*10,W,20): c.R(x,y,1,10,'#5e5e58')
    # jaguar statues and the altar with the Earth Key
    for x in (30,128):
        c.R(x,84,18,22,O);c.R(x+1,85,16,20,'#9a9a90');c.R(x+3,82,4,4,'#9a9a90');c.R(x+11,82,4,4,'#9a9a90');c.R(x+4,90,2,2,'#3fb87a');c.R(x+12,90,2,2,'#3fb87a');c.R(x+6,96,6,2,'#5e5e58')
    c.R(68,100,40,24,O);c.R(69,101,38,22,'#a4a49a');c.R(69,101,38,2,'#c4c4b8');c.R(72,114,32,2,'#a8503a')
    jadekey(c,84,88)
    for x,y,l in [(8,0,70),(168,10,60),(154,110,40)]:
        for k in range(l): c.P(x+int(3*math.sin(k*.2)),y+k,'#5a4a2a');c.P(x+1+int(3*math.sin(k*.2)),y+k,'#6a5a3a')
    for x,y in [(20,140),(150,160),(40,190)]: c.R(x,y,8,4,'#5a4a3a');c.R(x+2,y-1,4,1,'#9d8e7c')
    for x in (4,166):
        c.R(x,96,6,10,'#5a3a1e');c.R(x,90,6,6,'#e8632e');c.R(x+1,88,4,4,'#f2a22e')
    person(c,80,176,True)
    im=vignette(im,.6);im=glow(im,88,96,46,(110,255,170),.5);im=glow(im,7,92,34,(255,160,70),.45);im=glow(im,169,92,34,(255,160,70),.45)
    im=glow(im,88,50,70,(255,200,140),.18);im=glow(im,88,160,40,(255,240,200),.12)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'earth_4_sanctum.png');return im

a=plaza();b=pyramid();s=summit();t=sanctum();plan()
sheet=Image.new('RGB',(W*2*4+50,H*2+20),'#14202c')
for i,im in enumerate([a,b,s,t]): sheet.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
sheet.save(OUT+'earth_overview.png');print('ok')

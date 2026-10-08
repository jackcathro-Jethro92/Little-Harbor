import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'pixel_helpers.py')).read())
from PIL import ImageFont
def rubble(c,x0,y0,w,h,seed=2,base='#8a8a82'):
    c.R(x0,y0,w,h,'#5e5e58');random.seed(seed);y=y0
    while y<y0+h:
        hh=random.randint(3,5);x=x0+random.randint(-3,0)
        while x<x0+w:
            ww=random.randint(4,9);xx=max(x,x0);ww2=min(x+ww,x0+w)-xx-1;hh2=min(hh,y0+h-y)-1
            c.R(xx,y,ww2,hh2,random.choice([base,'#9a9a90','#7a7a72','#a4a49a']));c.R(xx,y,ww2,1,'#b8b8ae');x+=ww
        y+=hh
    for _ in range(w*h//40): c.R(random.randrange(x0,x0+w),random.randrange(y0,y0+h),random.randint(1,3),1,'#827565')
OUT=os.path.join(HERE,'..','sky_stonehenge_temple','render_')
G=['#6a9a50','#7aaa5a','#5a8a46','#82b064']
def turf(c,x0,y0,w,h,seed=1):
    c.R(x0,y0,w,h,G[0]);random.seed(seed)
    for _ in range(w*h//16): c.R(random.randrange(x0,x0+w),random.randrange(y0,y0+h),1,2,random.choice(G[1:]))
def clouds(c,x0,y0,w,h,seed=2):
    random.seed(seed)
    for _ in range(w*h//30):
        x,y=random.randrange(x0,x0+w),random.randrange(y0,y0+h);r=random.randint(4,10)
        col=random.choice(['#e8eef4','#d8e2ec','#f4f8fc','#c8d4e0']);c.d.ellipse([x-r,y-r//2,x+r,y+r//2],fill=col);c.d.ellipse([x-r+2,y-r//2-2,x+r-4,y+r//2-3],fill='#f8fbff')
def stone(c,x,y,w,h,seed=0,tone=0):
    r=random.Random(seed);b=['#9a9a8e','#a4a296','#8e8e84'][tone%3]
    c.R(x+2,y-1,w+2,3,'#3f6a34')
    c.R(x,y-h,w,h,O);c.R(x+1,y-h+1,w-2,h-2,b);c.R(x+1,y-h+1,2,h-2,'#b8b8ac');c.R(x+w-3,y-h+1,2,h-2,'#74746a')
    c.R(x+1,y-h+1,w-2,3,'#c8c8bc')
    for _ in range(max(2,w*h//30)): c.R(x+1+r.randrange(max(1,w-3)),y-h+4+r.randrange(max(1,h-6)),2,1,r.choice(['#a8b070','#c8c890','#6e6e64']))
    c.R(x+1+r.randrange(max(1,w-3)),y-h+5,1,r.randint(3,6),'#6e6e64')
def lintel(c,x1,y1,x2,y2):
    n=max(1,int(math.hypot(x2-x1,y2-y1)))
    for k in range(n+1):
        t=k/n;x=int(x1+(x2-x1)*t);y=int(y1+(y2-y1)*t);c.R(x-1,y-5,4,7,O)
    for k in range(n+1):
        t=k/n;x=int(x1+(x2-x1)*t);y=int(y1+(y2-y1)*t);c.R(x,y-4,3,5,'#a4a498');c.R(x,y-4,3,2,'#c8c8bc')
def trilithon(c,x,y,gap=6,h=22,seed=0):
    stone(c,x,y,9,h,seed);stone(c,x+9+gap,y,9,h,seed+1)
    c.R(x-1,y-h-5,9*2+gap+2,7,O);c.R(x,y-h-4,9*2+gap,5,'#a4a498');c.R(x,y-h-4,9*2+gap,2,'#c8c8bc')
def triskele(c,cx,cy,s,col):
    for a in range(3):
        ang0=a*2*math.pi/3;ox=cx+math.cos(ang0)*s*.45;oy=cy+math.sin(ang0)*s*.45
        for k in range(60):
            t=k/60*2.2*math.pi;r=s*.45*(1-t/(2.4*math.pi))
            c.P(int(ox+math.cos(ang0+math.pi+t)*r),int(oy+math.sin(ang0+math.pi+t)*r),col)
def skykey(c,x,y):
    c.R(x,y,8,14,O);c.R(x+1,y+1,6,5,'#cfe8ff');c.R(x+2,y+2,2,2,'#ffffff');c.R(x+3,y+6,2,6,'#e8e8f0');c.R(x+5,y+10,2,1,'#e8e8f0')
    c.R(x-3,y+2,3,1,'#ffffff');c.R(x+8,y+2,3,1,'#ffffff')
def fern(c,x,y):
    for k in range(6): c.R(x+k,y-k//2,1,1,'#3f7a3a');c.R(x-k,y-k//2,1,1,'#3f7a3a');c.R(x,y-k,1,1,'#4f8a40')
def ring_positions(cx,cy,rx,ry,n):
    return [(int(cx+math.cos(2*math.pi*i/n)*rx),int(cy+math.sin(2*math.pi*i/n)*ry)) for i in range(n)]


def fallen(c,x,y,l,h=8,seed=0):
    r=random.Random(seed);c.R(x+1,y+h-1,l,3,'#3f6a34');c.R(x,y,l,h,O);c.R(x+1,y+1,l-2,h-2,'#9a9a8e');c.R(x+1,y+1,l-2,2,'#c8c8bc');c.R(x+1,y+h-3,l-2,2,'#74746a')
    for _ in range(l//6): c.R(x+2+r.randrange(max(1,l-4)),y+3,2,1,r.choice(['#a8b070','#6e6e64']))
def debris(c,x0,y0,w,h,n,seed):
    r=random.Random(seed)
    for _ in range(n):
        x,y=x0+r.randrange(w),y0+r.randrange(h);s=r.randint(2,4);c.R(x,y,s+1,s,O);c.R(x,y,s,s-1,r.choice(['#9a9a8e','#b8b8ac','#8e8e84']))
def scorch(c,cx,cy,rx,ry,seed):
    r=random.Random(seed)
    for _ in range(int(rx*ry*1.4)):
        a=r.random()*6.28;d=r.random()**.6;x=int(cx+math.cos(a)*rx*d);y=int(cy+math.sin(a)*ry*d);c.P(x,y,r.choice(['#3a3226','#4a4030','#2a2420','#5a5040']))
def stairwell(c,x,y,w,h):
    c.R(x-1,y-1,w+2,h+2,'#1a1814')
    steps=h//4
    for i in range(steps):
        sh=int(20+i*(130/steps));c.R(x,y+i*4,w,3,'#%02x%02x%02x'%(sh,sh,int(sh*.95)));c.R(x,y+i*4+3,w,1,'#%02x%02x%02x'%(max(0,sh-40),max(0,sh-40),max(0,sh-40)))
    c.R(x,y,w,3,'#060606')
def smoke(c,x,y,seed):
    r=random.Random(seed)
    for k in range(8):
        rr=r.randint(3,6);xx=x+r.randint(-4,4)+k;yy=y-k*5;c.d.ellipse([xx-rr,yy-rr,xx+rr,yy+rr],fill=r.choice(['#8a8a8a','#9a9a9a','#7a7a7a']))

# ---------- A. plan ----------
def plan():
    S=240;im=Image.new('RGB',(S,S),'#a8c4e0');c=C(im);clouds(c,0,0,S,S,3)
    px=im.load();random.seed(5)
    for y in range(S):
        for x in range(S):
            r=math.hypot((x-120)/1.0,(y-110)/0.9)+5*math.sin(math.atan2(y-110,x-120)*5)
            if r<84: px[x,y]=random.choice([(106,154,80),(122,170,90),(90,138,70)])
            elif r<92: px[x,y]=random.choice([(122,118,104),(100,96,86),(140,136,120)])
    c=C(im)
    pts=[(120,240),(100,226),(132,214),(108,202),(120,192)]
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        for k in range(20): t=k/20;c.R(int(x1+(x2-x1)*t)-3,int(y1+(y2-y1)*t)-3,7,7,'#c8b088')
    c.R(110,180,22,8,'#5e5e58');c.R(112,176,4,10,'#9a9a8e');c.R(126,176,4,10,'#9a9a8e')
    for y in range(140,178,8): c.R(108,y,4,4,'#9a9a8e');c.R(130,y,4,4,'#9a9a8e')
    for (x,y) in ring_positions(120,100,40,36,24): c.R(x-2,y-2,5,5,'#9a9a8e');c.R(x-2,y-2,5,1,'#c8c8bc')
    for (x,y) in ring_positions(120,100,40,36,48): c.P(x,y,'#7a7a70')
    for i,a in enumerate([200,235,270,305,340]):
        x=int(120+math.cos(math.radians(a))*20);y=int(100+math.sin(math.radians(a))*18)+(4 if a in(200,340) else 0);c.R(x-3,y-2,7,4,'#8e8e84')
    c.R(116,97,9,7,'#5e5e58');c.R(117,98,7,5,'#c8c8bc');c.R(119,99,3,2,'#5e5e58')
    big=im.resize((S*3,S*3),Image.NEAREST);d=ImageDraw.Draw(big)
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    def lab(x,y,t,ax,ay):
        d.line([(ax*3,ay*3),(x,y)],fill='#ffffff',width=2);w=d.textlength(t,font=f);d.rectangle([x-4,y-3,x+w+4,y+18],fill='#141c24');d.text((x,y),t,fill='#ffe9a0',font=f)
    lab(430,690,'1  Cliff path up',118,228);lab(450,600,'2  Dolmen gateway',130,182);lab(450,520,'3  Avenue of stones',132,160)
    lab(470,170,'4  Outer stone circle',156,92);lab(20,170,'5  Inner trilithons',96,84);lab(20,320,'6  Temple stone (key hidden beneath)',118,100)
    d.text((14,10),'Sky Temple complex: plateau above the clouds',fill='#1a2430',font=f)
    big.save(OUT+'sky_0_plan.png')

# ---------- B. the cliff path up ----------
def cliffpath():
    im,d=new();c=C(im)
    rubble(c,0,0,W,H,90,'#8e8a7c')
    for y in range(0,H,2): c.R(0,y,W,1,'#7a7668') if (y//2)%9==0 else None
    pts=[(88,208),(60,186),(120,160),(54,126),(118,92),(70,58),(96,30),(90,0)]
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        n=max(abs(x2-x1),abs(y2-y1))
        for k in range(n): t=k/n;c.R(int(x1+(x2-x1)*t)-8,int(y1+(y2-y1)*t)-5,17,10,'#b49e7c')
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        n=max(abs(x2-x1),abs(y2-y1))
        for k in range(n): t=k/n;c.R(int(x1+(x2-x1)*t)-6,int(y1+(y2-y1)*t)-3,13,6,'#c8b088')
    for x,y in [(20,40),(150,70),(30,150),(146,190),(140,120)]: c.R(x,y,10,5,'#5a8a46');c.R(x+2,y-2,6,3,'#7aaa5a')
    for x,y in [(126,152),(48,118)]:
        for k in range(3): c.R(x+k,y-k*3,7-2*k,3,['#8e8e84','#a4a296','#b8b8ac'][k])
    clouds(c,0,176,40,32,6);clouds(c,140,0,36,40,7)
    for y in (20,70,140): c.R(10,y,30,1,'#e8eef4');c.R(130,y+20,26,1,'#e8eef4')
    person(c,76,170,True)
    im=vignette(im,.3);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'sky_1_cliffpath.png');return im

# ---------- C. dolmen gateway and avenue ----------
def avenue():
    im,d=new();c=C(im)
    turf(c,0,0,W,H,11)
    c.R(70,0,36,H,'#b49e7c');c.R(72,0,32,H,'#c4ae8a')
    for i,y in enumerate(range(40,140,24)): stone(c,52,y,9,16,30+i,i);stone(c,115,y,9,16,40+i,i+1)
    # the circle just visible at the top
    for i,x in enumerate(range(6,176,22)): stone(c,x,18,10,18,60+i,i)
    lintel(c,10,0,170,0)
    # dolmen gateway
    stone(c,56,182,12,28,70);stone(c,108,182,12,28,71)
    c.R(52,148,72,10,O);c.R(53,149,70,8,'#a4a498');c.R(53,149,70,3,'#c8c8bc');c.R(70,152,6,2,'#74746a')
    for x,y in [(14,120),(22,190),(160,100),(150,176),(30,60),(146,50)]: fern(c,x,y)
    for x,y in [(10,150),(166,140)]: c.R(x,y,8,6,O);c.R(x+1,y+1,6,4,'#8e8e84')
    clouds(c,0,196,30,12,13);clouds(c,150,196,26,12,14)
    person(c,80,120,True)
    im=vignette(im,.3);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'sky_2_avenue.png');return im

# ---------- D. the stone circle ----------
def circle(damaged=False):
    im,d=new();c=C(im)
    turf(c,0,0,W,H,21)
    clouds(c,0,0,W,18,22)
    for y in range(18,26): c.R(0,y,W,1,'#5a8a46')
    cx,cy=88,112
    for y in range(H):
        for x in range(W):
            if ((x-cx)/52)**2+((y-cy)/40)**2<1 and ((x-cx)/44)**2+((y-cy)/33)**2>1 and random.random()<.5: c.P(x,y,'#b49e7c')
    pos=ring_positions(cx,cy+8,74,58,16)
    back=[p for p in pos if p[1]<=cy+8];front=[p for p in pos if p[1]>cy+8]
    FALL={2,5,9,12} if damaged else set()
    if damaged: scorch(c,89,118,40,26,77)
    def draw_ring(lst):
        for i,(x,y) in enumerate(sorted(lst,key=lambda p:p[1])):
            k=pos.index((x,y))
            if k in FALL: fallen(c,x-12,y-6,24,8,300+k)
            else: stone(c,x-5,y,10,20,100+i,i)
    draw_ring(back)
    for i in range(16):
        a,b=pos[i],pos[(i+1)%16]
        if i in FALL or (i+1)%16 in FALL: continue
        if damaged and i%3==0: continue
        if a[1]<=cy+8 and b[1]<=cy+8: lintel(c,a[0]-4,a[1]-20,b[0]-4,b[1]-20)
    # inner horseshoe of trilithons
    for i,(x,y) in enumerate([(44,100),(60,86),(82,80),(104,86),(118,100)]):
        if damaged and i in (1,4): fallen(c,x-6,y-4,30,8,400+i);debris(c,x-6,y-12,30,10,6,410+i)
        else: trilithon(c,x,y,4,24,200+i*3)
    # temple stone
    if not damaged:
        c.R(72,112,34,18,O);c.R(73,113,32,16,'#8e8e84');c.R(73,113,32,4,'#c8c8bc');c.R(73,125,32,3,'#74746a')
        triskele(c,89,121,10,'#5e5e58')
    else:
        c.R(66,111,16,19,O);c.R(67,112,14,17,'#8e8e84');c.R(67,112,14,4,'#c8c8bc')
        c.R(98,113,16,19,O);c.R(99,114,14,17,'#8e8e84');c.R(99,114,14,4,'#c8c8bc')
        stairwell(c,83,114,14,16)
        for k in range(8): c.P(64-k,120+k//2,'#3a3a36');c.P(116+k,124-k//3,'#3a3a36')
        debris(c,56,104,70,30,14,88);smoke(c,74,100,5);smoke(c,108,96,6)
    draw_ring(front)
    for i in range(16):
        a,b=pos[i],pos[(i+1)%16]
        if i in FALL or (i+1)%16 in FALL: continue
        if a[1]>cy+8 and b[1]>cy+8: lintel(c,a[0]-4,a[1]-20,b[0]-4,b[1]-20)
    if damaged: debris(c,10,60,156,120,22,99)
    clouds(c,0,190,28,18,23);clouds(c,150,190,26,18,24)
    person(c,80,170,True)
    im=vignette(im,.3 if not damaged else .45)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+('sky_5_circle_damaged.png' if damaged else 'sky_3_circle.png'));return im

# ---------- E. the temple stone close up ----------
def altar(damaged=False):
    im,d=new();c=C(im)
    turf(c,0,0,W,H,31)
    for y in range(0,40): c.R(0,y,W,1,'#%02x%02x%02x'%(168+y,196+y//2,224))
    clouds(c,0,24,W,22,32)
    if damaged:
        trilithon(c,10,96,6,44,300);fallen(c,120,86,48,10,311);fallen(c,128,100,30,8,312);trilithon(c,64,74,10,40,320)
        scorch(c,88,140,64,34,55)
    else:
        trilithon(c,10,96,6,44,300);trilithon(c,130,96,6,44,310);trilithon(c,64,74,10,40,320)
    # worn ring of earth around the stone
    for y in range(H):
        for x in range(W):
            if ((x-88)/62)**2+((y-140)/38)**2<1 and random.random()<.55: c.P(x,y,'#b49e7c')
    # the temple stone, carved
    if not damaged:
        c.R(40,112,96,52,O);c.R(42,114,92,48,'#8e8e84');c.R(42,114,92,10,'#c8c8bc');c.R(42,156,92,6,'#6e6e64');c.R(42,114,3,48,'#a4a296')
        triskele(c,66,140,22,'#4e4e48');triskele(c,112,140,22,'#4e4e48')
        for x in range(48,130,6): c.R(x,118,3,1,'#6e6e64');c.R(x+3,120,3,1,'#6e6e64')
        for x,y in [(50,150),(124,150),(88,154)]: c.R(x,y,3,2,'#5e5e58')
    else:
        # the slab split in two, pushed apart, with stairs going down between the halves
        c.R(30,114,44,50,O);c.R(32,116,40,46,'#8e8e84');c.R(32,116,40,10,'#c8c8bc');c.R(32,156,40,6,'#6e6e64');c.R(32,116,3,46,'#a4a296')
        triskele(c,52,140,22,'#4e4e48')
        c.R(104,110,44,50,O);c.R(106,112,40,46,'#8e8e84');c.R(106,112,40,10,'#c8c8bc');c.R(106,152,40,6,'#6e6e64')
        triskele(c,124,136,22,'#4e4e48')
        for k in range(14): c.P(60+k//2,116+k*3,'#3a3a36');c.P(114+k%3,114+k*3,'#3a3a36')
        for k in range(10): c.P(40+k*2,130+int(3*math.sin(k)),'#3a3a36');c.P(128+k,148-k,'#3a3a36')
        stairwell(c,76,114,26,46)
        c.R(74,112,30,2,'#5e5e58')
        debris(c,24,100,128,80,30,66);smoke(c,60,96,7);smoke(c,120,90,8)
    for k in range(5):
        y=60+k*22;x0=8+(k*37)%120
        for j in range(26): c.P(x0+j,y+int(2*math.sin(j*.4)),'#ffffff')
    for x,y in [(12,180),(160,186),(20,130)]: fern(c,x,y)
    person(c,80,176,True)
    im=vignette(im,.3 if not damaged else .45)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+('sky_6_temple_stone_damaged.png' if damaged else 'sky_4_temple_stone.png'));return im

a=cliffpath();b=avenue();ci=circle();al=altar();cd=circle(True);ad=altar(True);plan()
sheet=Image.new('RGB',(W*2*4+50,H*2+20),'#14202c')
for i,im in enumerate([a,b,ci,al]): sheet.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
dm=Image.new('RGB',(W*2*2+30,H*2+20),'#2a1414')
for i,im in enumerate([cd,ad]): dm.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
dm.save(OUT+'sky_damaged_overview.png')
sheet.save(OUT+'sky_overview.png');print('ok')

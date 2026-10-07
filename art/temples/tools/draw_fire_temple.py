import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'pixel_helpers.py')).read())
from PIL import ImageFont
OUT=os.path.join(HERE,'..','fire_temple','render_')
ROCK=['#2a2426','#3a3234','#4a4044','#221c1e']
def volcanic(c,x0,y0,w,h,seed=1):
    c.R(x0,y0,w,h,ROCK[1]);r=random.Random(seed)
    for _ in range(w*h//10): c.R(x0+r.randrange(w),y0+r.randrange(h),r.randint(2,5),r.randint(1,2),r.choice(ROCK))
def lava(c,pts,wid,seed=2):
    r=random.Random(seed)
    for (x1,y1),(x2,y2) in zip(pts,pts[1:]):
        n=max(abs(x2-x1),abs(y2-y1),1)
        for k in range(n):
            t=k/n;x=int(x1+(x2-x1)*t);y=int(y1+(y2-y1)*t)
            c.R(x-wid//2-1,y-1,wid+2,3,'#8a2a1a');c.R(x-wid//2,y,wid,2,'#e8632e')
            if wid>2: c.R(x-wid//2+1,y,max(1,wid-2),1,'#f2a22e')
            if r.random()<.15: c.P(x,y,'#ffd25a')
def ashsky(c,y0,y1,seed=3):
    for y in range(y0,y1):
        t=(y-y0)/max(1,y1-y0);col=(int(58+120*t),int(48+44*t),int(72-20*t));c.R(0,y,W,1,'#%02x%02x%02x'%col)
    r=random.Random(seed)
    for _ in range(20):
        x,y=r.randrange(W),r.randrange(y0,y1);rr=r.randint(5,12);c.d.ellipse([x-rr,y-rr//2,x+rr,y+rr//2],fill=r.choice(['#4a3a50','#5a4258','#3a2e44','#7a4a40']))
def volcano(c,cx,base,wid,hgt,seed=4):
    for j in range(hgt):
        w=int(wid*(j/hgt))+6;y=base-hgt+j;c.R(cx-w//2,y,w,1,ROCK[2] if j%3 else ROCK[1])
    lava(c,[(cx,base-hgt+2),(cx-6,base-hgt//2),(cx-14,base)],2,seed);lava(c,[(cx+1,base-hgt+2),(cx+8,base-hgt//3),(cx+18,base)],2,seed+1)
    c.R(cx-4,base-hgt-1,8,3,'#ffd25a')
    r=random.Random(seed)
    for k in range(9):
        rr=r.randint(5,10);c.d.ellipse([cx-rr+r.randint(-6,6)+k,base-hgt-6-k*5-rr,cx+rr+k,base-hgt-6-k*5+rr],fill=r.choice(['#4a4048','#5a5058','#3a3238']))
def roof(c,x,y,w,h,gold='#e8b030',lo='#a06a10',hi='#f8d060'):
    for j in range(h):
        ins=int((h-j)*1.6);xx=x+ins;ww=w-2*ins
        c.R(xx,y+j,ww,1,gold)
        for k in range(xx+1,xx+ww,3): c.P(k,y+j,lo)
    c.R(x+int(h*1.6),y,w-2*int(h*1.6),2,lo);c.R(x+int(h*1.6),y,w-2*int(h*1.6),1,hi)
    c.R(x,y+h,w,2,lo);c.R(x-2,y+h-2,3,2,gold);c.R(x+w-1,y+h-2,3,2,gold)
    c.R(x+2,y+h+2,w-4,2,'#2a6a7a');for_k=[c.P(k,y+h+2,'#3a9a7a') for k in range(x+3,x+w-3,4)]
def redwall(c,x,y,w,h):
    c.R(x,y,w,h,'#b8322a');c.R(x,y,w,1,'#d8524a');c.R(x,y+h-2,w,2,'#7c1e18')
def marble(c,x,y,w,h,seed=5):
    c.R(x,y,w,h,'#e8e4dc');r=random.Random(seed)
    for j in range(0,h,8): c.R(x,y+j,w,1,'#c8c4bc')
    for _ in range(w*h//60): c.R(x+r.randrange(w),y+r.randrange(h),2,1,'#d8d4cc')
def balustrade(c,x,y,w):
    c.R(x,y,w,3,'#c8c4bc');c.R(x,y,w,1,'#ffffff')
    for k in range(x,x+w,6): c.R(k,y-2,2,5,'#e8e4dc')
def brazier(c,x,y):
    c.R(x,y,12,8,O);c.R(x+1,y+1,10,6,'#6a5a3a');c.R(x+1,y+1,10,2,'#8a7a4a');c.R(x+1,y+7,2,3,O);c.R(x+9,y+7,2,3,O)
    c.R(x+2,y-5,8,6,'#e8632e');c.R(x+3,y-8,6,5,'#f2a22e');c.R(x+5,y-10,2,3,'#ffd25a')
def column(c2,x,top,bot):
    c2.R(x,top,8,bot-top,'#b8322a');c2.R(x,top,2,bot-top,'#d8524a');c2.R(x+6,top,2,bot-top,'#7c1e18');c2.R(x-1,bot-2,10,2,'#e8e4dc')

# ---------- A. plan ----------
def plan():
    S=240;im=Image.new('RGB',(S,S),'#1a2a48');c=C(im);px=im.load();random.seed(9)
    for y in range(S):
        for x in range(S):
            r=math.hypot(x-120,(y-118)*1.1)+8*math.sin(math.atan2(y-118,x-120)*6)
            if r<88: px[x,y]=random.choice([(58,50,52),(42,36,38),(74,64,68)])
            elif r<104 and random.random()<.7: px[x,y]=random.choice([(42,154,154),(90,200,192),(30,110,120)])
    c=C(im)
    for k,(a,b) in enumerate([((120,40),(90,150)),((122,40),(170,140)),((118,42),(60,110))]): lava(c,[a,((a[0]+b[0])//2+8,(a[1]+b[1])//2),b],3,k)
    c.d.ellipse([104,26,136,52],fill='#4a4044');c.d.ellipse([112,32,128,46],fill='#e8632e')
    c.R(110,196,22,10,'#1a1416');c.R(116,150,10,46,'#4a4044')
    c.R(96,140,50,10,'#e8632e');c.R(116,140,10,10,'#e8e4dc')
    c.R(92,126,58,14,'#b8322a');c.R(92,124,58,4,'#e8b030');c.R(108,132,6,8,'#141010');c.R(118,132,6,8,'#141010');c.R(128,132,6,8,'#141010')
    c.R(96,98,50,26,'#e8e4dc');c.R(104,74,34,24,'#b8322a');c.R(100,70,42,6,'#e8b030');c.R(117,84,8,8,'#ffd25a')
    big=im.resize((S*3,S*3),Image.NEAREST);d=ImageDraw.Draw(big)
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    def lab(x,y,t,ax,ay):
        d.line([(ax*3,ay*3),(x,y)],fill='#ffffff',width=2);w=d.textlength(t,font=f);d.rectangle([x-4,y-3,x+w+4,y+18],fill='#141c24');d.text((x,y),t,fill='#ffe9a0',font=f)
    lab(430,660,'1  Black sand landing',121,202);lab(450,560,'2  Basalt path past the lava',121,172)
    lab(470,460,'3  Lava moat and great gate',146,140);lab(20,330,'4  Marble courtyard',96,110)
    lab(20,250,'5  Fire hall (sacred flame altar)',104,86);lab(420,40,'6  The volcano',134,40)
    d.text((14,10),'Fire Temple complex: volcano island overview',fill='#ffffff',font=f)
    big.save(OUT+'fire_0_plan.png')

# ---------- B. landing and lava path ----------
def landing():
    im,d=new();c=C(im)
    ashsky(c,0,52,11);volcano(c,92,52,120,34,12)
    volcanic(c,0,48,W,130,13)
    lava(c,[(30,52),(40,90),(22,130),(30,176)],4,14);lava(c,[(150,56),(140,100),(156,140),(146,176)],3,15)
    for x,y in [(26,170),(150,172)]:
        for k in range(4): c.d.ellipse([x-4+k*2,y-6-k*6,x+4+k*2,y-k*6],fill='#c8c0c8')
    for y in range(176,190): c.R(0,y,W,1,'#221c1e' if y%3 else '#2a2426')
    for y in range(190,H): c.R(0,y,W,1,'#1a2a48')
    r=random.Random(16)
    for _ in range(14): x=r.randrange(W);c.d.ellipse([x-10,192+r.randrange(10),x+10,198+r.randrange(10)],fill=r.choice(['#2a9a9a','#5ac8c0']))
    for x in range(0,W,10): c.R(x+(x//10%2)*3,189,6,1,'#e8eef4')
    for j,y in enumerate(range(56,190,12)):
        x=80+int(6*math.sin(j*.9));c.R(x-1,y-1,20,11,O);c.R(x,y,18,9,'#4a4044');c.R(x,y,18,2,'#6a5e64')
    person(c,80,166,True)
    im=glow(im,92,20,40,(255,170,80),.35)
    for x,y in [(36,90),(26,130),(144,100),(154,140)]: im=glow(im,x,y,14,(255,130,50),.35)
    im=vignette(im,.4);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'fire_1_landing.png');return im

# ---------- C. great gate over the lava moat ----------
def gate():
    im,d=new();c=C(im)
    ashsky(c,0,52,21);volcano(c,140,46,70,30,22)
    roof(c,26,8,124,16);c.R(40,26,96,12,'#b8322a')
    for x in range(44,134,10): c.R(x,28,6,9,'#7c1e18');c.R(x+1,29,4,7,'#e8b030')
    roof(c,14,36,148,14)
    redwall(c,0,52,W,62)
    for x in (34,78,122):
        c.R(x,78,20,36,'#141010');c.d.ellipse([x,70,x+19,88],fill='#141010')
    c.R(76,58,24,8,'#e8b030');c.R(78,60,20,4,'#2a3a6a')
    for k in range(5): c.R(80+k*4,61,2,2,'#e8b030')
    marble(c,0,114,W,10,23);balustrade(c,0,114,W)
    c.R(0,124,W,30,'#e8632e');r=random.Random(24)
    for _ in range(70):
        x,y=r.randrange(W),r.randrange(124,152);ww=r.randint(4,12);c.R(x,y,ww,2,r.choice(['#f2a22e','#ffd25a','#8a2a1a','#a8381e']))
    c.R(0,124,W,2,'#5a1a10')
    marble(c,70,118,36,90,25);c.R(68,124,2,30,'#c8c4bc');c.R(106,124,2,30,'#c8c4bc')
    for k in range(0,30,6): c.R(66,124+k,4,4,'#e8e4dc');c.R(106,124+k,4,4,'#e8e4dc')
    volcanic(c,0,154,70,54,26);volcanic(c,106,154,70,54,27)
    for x in (40,126): brazier(c,x,170)
    person(c,80,166,True)
    im=glow(im,88,140,90,(255,120,40),.3);im=glow(im,46,164,24,(255,170,70),.4);im=glow(im,132,164,24,(255,170,70),.4)
    im=vignette(im,.35);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'fire_2_gate.png');return im

# ---------- D. marble courtyard and the fire hall ----------
def courtyard():
    im,d=new();c=C(im)
    ashsky(c,0,80,31);volcano(c,40,30,60,24,32)
    roof(c,36,4,104,12);c.R(46,20,84,8,'#b8322a')
    roof(c,20,26,136,14)
    c.R(26,42,124,34,'#b8322a')
    for x in range(30,150,14): column(c,x,42,76)
    for x in range(38,144,14): c.R(x,48,8,20,'#7c1e18');c.R(x+1,49,6,18,'#e8b030');c.R(x+3,50,2,16,'#b8322a')
    c.R(78,52,20,24,'#141010')
    marble(c,0,76,W,30,37)
    for i,(y,ins) in enumerate([(76,16),(86,8),(96,0)]):
        marble(c,ins,y,W-2*ins,10,33+i);balustrade(c,ins,y,W-2*ins)
    c.R(76,76,24,30,'#d8d4cc')
    for y in range(76,106,3): c.R(76,y,24,1,'#b8b4ac')
    marble(c,0,106,W,H-106,36)
    for x in (16,152): c.R(x,106,8,H-106,'#8a2a1a');lava(c,[(x+4,106),(x+4,H)],4,x)
    for x,y in [(40,120),(124,120),(40,170),(124,170)]: brazier(c,x,y)
    c.d.ellipse([70,140,106,160],fill='#6a5a3a');c.d.ellipse([72,142,104,158],fill='#8a7a4a');c.d.ellipse([78,145,98,155],fill='#e8632e');c.d.ellipse([82,147,94,153],fill='#ffd25a')
    person(c,80,176,True)
    for x,y in [(46,116),(130,116),(46,166),(130,166),(88,150)]: im=glow(im,x,y,26,(255,160,60),.4)
    im=vignette(im,.35);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'fire_3_courtyard.png');return im

# ---------- E. inside the fire hall ----------
def hall():
    im,d=new();c=C(im)
    c.R(0,0,W,H,'#5a1a14')
    for y in range(0,14,4):
        for x in range(0,W,8): c.R(x,y,7,3,'#3a2a20');c.R(x+2,y+1,3,1,'#2a6a7a')
    c.R(0,14,W,64,'#7c1e18')
    c.R(52,18,72,12,'#e8b030');c.R(54,20,68,8,'#2a3a6a')
    for k in range(4): c.R(60+k*15,21,8,6,'#e8b030');c.R(62+k*15,23,4,2,'#2a3a6a')
    c.R(40,32,96,10,'#c88a1a')
    for x in range(42,134,6): c.R(x,34+int(2*math.sin(x*.5)),4,2,'#ffd25a');c.R(x+2,37,2,2,'#e8632e')
    for x in (6,152):
        c.R(x,30,18,30,'#e8e4dc')
        for yy in range(32,58,4):
            for xx in range(x+2,x+16,4): c.R(xx,yy,2,2,'#5a1a14')
    for x in (30,58,110,138):
        column(c,x,14,150);c.R(x+1,40,6,40,'#e8b030');c.R(x+2,42,4,36,'#b8322a')
        for k in range(4): c.R(x+3,46+k*8,2,4,'#e8b030')
    # dais with steps, the throne-altar and the sacred flame
    c.R(48,78,80,60,O)
    for i,(y,ins) in enumerate([(78,0),(96,6),(108,12),(120,18)]):
        c.R(48+ins,y,80-2*ins,12 if i else 18,['#c88a1a','#e8b030','#f0c040','#e8b030'][i]);c.R(48+ins,y,80-2*ins,1,'#ffe080')
    c.R(76,108,24,30,'#e8b030')
    for y in range(108,138,4): c.R(76,y,24,1,'#a06a10')
    c.R(68,58,40,26,O);c.R(70,60,36,24,'#c88a1a');c.R(72,62,32,6,'#e8b030');c.R(70,60,36,2,'#ffe080')
    c.R(80,70,16,10,'#6a5a3a');c.R(82,64,12,8,'#e8632e');c.R(84,60,8,6,'#f2a22e');c.R(86,56,4,5,'#ffd25a')
    c.R(86,80,4,4,'#141010')
    for x in (34,128):
        c.R(x,96,14,18,O);c.R(x+1,97,12,16,'#3a8a8a');c.R(x+1,97,12,3,'#5ac8c0');c.R(x+3,92,8,6,'#3a8a8a');c.R(x+5,90,4,3,'#e8b030')
    # polished dark floor with reflections
    c.R(0,150,W,58,'#3a1410')
    for x in (30,58,110,138): c.R(x+2,150,4,30,'#6a2418')
    for y in range(150,H,10):
        c.R(0,y,W,1,'#2a0e0a')
    c.R(76,150,24,20,'#5a2a18')
    person(c,80,176,True)
    im=vignette(im,.6);im=glow(im,88,64,60,(255,150,60),.55);im=glow(im,88,30,40,(255,210,120),.2)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'fire_4_hall.png');return im

a=landing();b=gate();ct=courtyard();h=hall();plan()
sheet=Image.new('RGB',(W*2*4+50,H*2+20),'#14202c')
for i,im in enumerate([a,b,ct,h]): sheet.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
sheet.save(OUT+'fire_overview.png');print('ok')

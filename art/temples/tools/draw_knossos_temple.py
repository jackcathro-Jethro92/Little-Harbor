import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'pixel_helpers.py')).read())
from PIL import ImageFont
OUT=os.path.join(HERE,'..','knossos_temple','render_')
def water(c,x0,y0,w,h,deep=(31,111,138),light=(63,168,176),seed=1,glint='#8fd0e0'):
    for y in range(y0,y0+h):
        t=(y-y0)/max(1,h);col=tuple(int(deep[k]+(light[k]-deep[k])*t*.4) for k in range(3));c.R(x0,y,w,1,'#%02x%02x%02x'%col)
    random.seed(seed)
    for _ in range(w*h//60): c.R(random.randrange(x0,x0+w),random.randrange(y0,y0+h),random.randint(2,5),1,glint)
def lamp(c,x,y):
    c.R(x,y,6,12,O);c.R(x+1,y+1,4,10,'#b8322a');c.R(x,y-4,6,5,O);c.R(x+1,y-3,4,3,'#ffd96a')
def basalt(c,x0,y0,w,h,seed=2):
    c.R(x0,y0,w,h,'#4a4a52');random.seed(seed)
    for _ in range(w*h//14):
        x,y=random.randrange(x0,x0+w),random.randrange(y0,y0+h);c.R(x,y,random.randint(2,6),random.randint(1,3),random.choice(['#5c5c66','#3a3a42','#6a6a74']))
def flag(c,x0,y0,w,h,base='#d8cfb8',joint='#a89e86',hi='#ece4d0',seed=4):
    c.R(x0,y0,w,h,base);random.seed(seed);y=y0
    while y<y0+h:
        hh=random.randint(10,16);x=x0
        while x<x0+w:
            ww=random.randint(14,26);c.R(x,y,min(ww,x0+w-x),min(hh,y0+h-y),random.choice([base,hi,'#cfc6ae']));c.R(x,y,1,min(hh,y0+h-y),joint);x+=ww
        c.R(x0,y,w,1,joint);y+=hh

# ---------- A. the complex plan (whole crater) ----------
def plan():
    S=240;im=Image.new('RGB',(S,S),'#2a3a2a');c=C(im);cx=cy=S//2
    px=im.load()
    random.seed(9)
    for y in range(S):
        for x in range(S):
            r=math.hypot(x-cx,y-cy)+3*math.sin(math.atan2(y-cy,x-cx)*7)
            if r<112: px[x,y]=(31,105,135) if r>40 else (55,150,165)
            elif r<124: px[x,y]=random.choice([(74,74,82),(92,92,102),(58,58,66)])
            else: px[x,y]=random.choice([(70,110,60),(84,126,70),(62,98,54)])
    c=C(im)
    c.R(112,150,16,72,'#d8cfb8');c.R(112,150,1,72,'#a89e86');c.R(127,150,1,72,'#a89e86')
    for y in range(156,220,12): c.P(110,y,'#ffd96a');c.P(129,y,'#ffd96a')
    c.R(104,214,32,12,'#8a8270');c.R(106,216,28,8,'#b8322a');c.R(116,216,8,8,'#2a1b0e')
    c.R(86,86,68,66,'#a89e86');c.R(88,88,64,62,'#e4dcc6')
    c.R(110,140,20,12,'#b8322a');c.R(116,140,8,12,'#2a1b0e')
    c.R(96,112,48,26,'#d8cfb8');c.R(114,118,12,12,'#3fa8b0')
    c.R(94,90,52,20,'#b8322a');c.R(96,92,48,16,'#7c1e18');c.R(116,96,8,8,'#141014');c.R(117,97,6,1,'#5a5a66');c.R(117,99,6,1,'#5a5a66')
    big=im.resize((S*3,S*3),Image.NEAREST);d=ImageDraw.Draw(big)
    try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    except: f=ImageFont.load_default()
    def lab(x,y,t,ax,ay):
        d.line([(ax*3,ay*3),(x,y)],fill='#ffffff',width=2);w=d.textlength(t,font=f);d.rectangle([x-4,y-3,x+w+4,y+18],fill='#141c24');d.text((x,y),t,fill='#ffe9a0',font=f)
    lab(430,640,'1  Crater rim gate',120,222);lab(450,560,'2  Stone boardwalk',128,185);lab(470,450,'3  Gatehouse',128,146)
    lab(470,390,'4  Courtyard and pool',144,124);lab(40,250,'5  Temple hall',100,100);lab(40,300,'6  Stairs down to the vault',116,104)
    lab(20,30,'Sea Temple: crater lake complex (overview, not to scale)',0,0) if False else d.text((14,10),'Sea Temple complex: crater lake overview',fill='#ffffff',font=f)
    big.save(OUT+'crater_0_plan.png');return big

# ---------- B. the stone boardwalk across the crater lake ----------
def boardwalk():
    im,d=new();c=C(im)
    water(c,0,0,W,H,seed=21)
    basalt(c,0,0,30,40,3);basalt(c,146,0,30,34,5);c.R(0,40,30,2,'#3a3a42')
    for x,y in [(8,36),(150,30)]: c.R(x,y,10,4,'#3f7a3a')
    # the island and gate at the far end
    c.R(40,0,96,26,'#cfc6ae');c.R(40,24,96,4,'#a89e86')
    blocks(c,48,0,80,18,'#e4dcc6','#f0e8d4','#b8ae96',14,6)
    for x in (58,78,98,118): column(c,x-2,0,20,'#b8322a','#d8524a','#7c1e18','#2a2226') if False else None
    c.R(72,2,32,18,O);c.R(74,4,28,16,'#b8322a');c.R(82,8,12,12,'#141014')
    for x in (60,112): c.R(x,0,8,20,'#b8322a');c.R(x-1,0,10,3,'#2a2226')
    # boardwalk
    flag(c,64,26,48,H-26,seed=8)
    c.R(60,26,4,H-26,'#a89e86');c.R(112,26,4,H-26,'#a89e86');c.R(60,26,1,H-26,'#ece4d0');c.R(115,26,1,H-26,'#7a7266')
    for y in range(40,H,40): lamp(c,55,y);lamp(c,115,y)
    for x,y in [(24,96),(30,150),(140,120),(146,178),(20,60)]: c.R(x,y,8,3,'#174a5c');c.R(x+8,y+1,2,1,'#174a5c')
    person(c,80,178,True)
    for y in range(40,H,40):
        im=glow(im,58,y-2,18,(255,210,110),.4);im=glow(im,118,y-2,18,(255,210,110),.4)
    im=vignette(im,.35);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'crater_1_boardwalk.png');return im

# ---------- C. gatehouse into the courtyard, facing the temple hall ----------
def courtyard():
    im,d=new();c=C(im)
    flag(c,0,56,W,H-56,seed=12)
    # temple hall facade
    c.R(0,0,W,58,'#e4dcc6');blocks(c,0,0,W,20,'#d8cfb8','#ece4d0','#a89e86',16,6)
    c.R(0,18,W,8,'#b8322a')
    for x in range(4,W,8): c.R(x,19,6,6,'#efe6d4');c.R(x+2,21,2,2,'#3a6fb8')
    for x in (16,44,120,148): column(c,x,26,60)
    c.R(70,28,36,32,O);c.R(72,30,32,30,'#141014');c.R(74,30,28,2,'#3a3a44')
    c.R(62,56,52,4,'#ece4d0');c.R(66,60,44,4,'#d8cfb8')
    # courtyard pool with a dolphin fountain
    c.R(56,92,64,40,O);c.R(58,94,60,36,'#d8cfb8');water(c,62,98,52,28,(40,140,160),(70,190,190),seed=30,glint='#b8f0ec')
    c.R(84,104,8,14,O);c.R(85,105,6,12,'#c8ccd4');dolphin(c,81,99,'#3a6fb8')
    for k in range(4): c.P(88+k-2,96+k%2,'#e8fcff')
    # water channels along the sides
    for x in (20,150): c.R(x,64,6,H-64,'#a89e86');water(c,x+1,64,4,H-64,(40,140,160),(70,190,190),seed=x,glint='#b8f0ec')
    # gatehouse columns at the bottom, braziers, a statue
    for x in (40,124): column(c,x,170,208)
    c.R(0,196,40,12,'#a89e86');c.R(136,196,40,12,'#a89e86')
    for x in (34,136):
        c.R(x,72,10,8,O);c.R(x+1,73,8,6,'#4a4a52');c.R(x+2,66,6,7,'#e8632e');c.R(x+3,64,4,5,'#f2a22e')
    person(c,80,150,True)
    im=glow(im,39,68,30,(255,170,70),.4);im=glow(im,141,68,30,(255,170,70),.4);im=vignette(im,.3)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'crater_2_courtyard.png');return im

# ---------- D. temple hall with the stairway down ----------
def hall():
    im,d=new();c=C(im)
    c.R(0,0,W,64,'#a8332a')
    for y in (5,9): c.R(0,y,W,1,'#efe6d4')
    c.R(0,20,W,24,'#efe6d4')
    for x in range(W):
        y1=int(38+4*math.sin(x*.18));c.R(x,y1,1,44-y1,'#b8322a')
    for x,y in [(8,25),(44,28),(118,27),(150,25)]: dolphin(c,x,y)
    for y in (50,54): c.R(0,y,W,1,'#efe6d4')
    c.R(0,58,W,6,'#5a1e18')
    # statue of the sea god in a niche
    c.R(74,6,28,52,O);c.R(76,8,24,50,'#3a3a44')
    c.R(83,12,10,8,'#c8ccd4');c.R(81,20,14,22,'#c8ccd4');c.R(80,42,16,12,'#b0b6c0');c.R(82,10,12,3,'#3a6fb8')
    c.R(96,14,2,34,'#c9a227');c.R(94,12,6,3,'#c9a227')
    c.R(72,56,32,8,'#d8dce4');c.R(72,56,32,2,'#eef0f4')
    flag(c,0,64,W,H-64,'#9aa2b0','#6a4e50','#a6aebb',seed=15)
    # stairway descending into the vault
    c.R(58,104,60,70,O)
    for i in range(10):
        sh=int(40+i*14);col='#%02x%02x%02x'%(sh,sh,int(sh*1.05))
        c.R(60,106+i*7,56,6,col);c.R(60,106+i*7,56,1,'#%02x%02x%02x'%(min(255,sh+30),min(255,sh+30),min(255,sh+32)))
    c.R(60,104,56,4,'#060608')
    for x in (44,124): column(c,x,92,176,'#2a2226','#4a4246','#141014','#b8322a')
    for x in (30,138):
        c.R(x,96,10,8,O);c.R(x+1,97,8,6,'#4a4a52');c.R(x+2,90,6,7,'#e8632e');c.R(x+3,88,4,5,'#f2a22e')
    for x in (6,160): c.R(x,70,10,H-70,'#8a9098');water(c,x+2,70,6,H-70,(30,90,120),(50,130,150),seed=x)
    person(c,80,180,True)
    im=vignette(im,.65);im=glow(im,35,92,36,(255,160,70),.4);im=glow(im,143,92,36,(255,160,70),.4)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'crater_3_temple_hall.png');return im

# ---------- E. the vault beneath the lake ----------
def vault():
    im,d=new();c=C(im)
    basalt(c,0,0,W,H,31)
    water(c,0,30,W,150,(14,40,60),(24,70,90),seed=33,glint='#2f6f8a')
    c.R(0,0,W,30,'#2a2a32');basalt(c,0,0,W,26,34)
    for x in range(0,W,22): c.R(x+8,26,4,10+((x*7)%9),'#3a3a42');c.P(x+10,40+((x*5)%20),'#8fd0e0')
    # central island platform with the key
    c.R(48,70,80,70,O);c.R(50,72,76,66,'#8a9098');flag(c,52,74,72,62,'#9aa2b0','#5a4e5a','#a6aebb',seed=36)
    for x in (52,116): column(c,x,62,100,'#b8322a','#d8524a','#7c1e18','#2a2226')
    c.R(78,88,20,22,O);c.R(79,89,18,20,'#b0b6c0');c.R(79,89,18,3,'#d8dce4')
    c.R(84,76,8,14,O);c.R(85,77,6,5,'#4ac8e8');c.R(86,78,3,2,'#e8fcff');c.R(87,82,2,6,'#c9a227');c.R(89,86,2,1,'#c9a227')
    # stepping stones and the stair landing at the bottom
    for i,(x,y) in enumerate([(80,146),(84,158),(78,170)]): c.R(x,y,16,8,O);c.R(x+1,y+1,14,6,'#9aa2b0');c.R(x+1,y+1,14,1,'#c8ccd4')
    c.R(40,180,96,28,O);flag(c,42,182,92,26,'#8a9098','#4a4250','#9aa2b0',seed=37)
    for x in (44,124): c.R(x,180,8,28,'#5a1e18')
    for x in (34,138):
        c.R(x,182,8,6,O);c.R(x+1,183,6,4,'#4a4a52');c.R(x+2,177,4,6,'#4ac8e8');c.R(x+3,176,2,3,'#c8f4ff')
    person(c,80,186,True)
    im=vignette(im,.75);im=glow(im,88,82,56,(110,210,255),.6);im=glow(im,38,180,22,(110,210,255),.45);im=glow(im,142,180,22,(110,210,255),.45)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'crater_4_vault.png');return im

b=boardwalk();ct=courtyard();h=hall();v=vault();p=plan()
sheet=Image.new('RGB',(W*2*4+50,H*2+20),'#14202c')
for i,im in enumerate([b,ct,h,v]): sheet.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
sheet.save(OUT+'crater_overview.png');print('ok')

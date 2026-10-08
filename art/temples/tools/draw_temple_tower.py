import os
HERE=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE,'pixel_helpers.py')).read())
from PIL import ImageFont
OUT=os.path.join(HERE,'..','temple_tower','render_')
WD=['#3a2a20','#4a3628','#5a4230','#6e5038','#8a6440']
def gravel(c,x0,y0,w,h,seed=1):
    c.R(x0,y0,w,h,'#c8c0b0');r=random.Random(seed)
    for _ in range(w*h//8): c.P(x0+r.randrange(w),y0+r.randrange(h),r.choice(['#b8b0a0','#d8d0c0','#a8a090']))
    for y in range(y0+3,y0+h,6):
        for x in range(x0,x0+w,2): c.P(x,y+int(math.sin(x*.15)),'#b0a898')
def pine(c,x,y,s,seed):
    r=random.Random(seed);c.R(x-1,y,3,s//2,'#4a3628')
    for k in range(4):
        w=s-k*s//5;yy=y-k*s//4;c.d.ellipse([x-w//2,yy-s//6,x+w//2,yy+s//8],fill=r.choice(['#2f5a3a','#3f6a44','#284a32']))
def slantern(c,x,y):
    c.R(x+3,y+10,6,8,'#8a8a84');c.R(x+1,y+16,10,3,'#7a7a74');c.R(x+2,y+4,8,7,'#9a9a94');c.R(x+4,y+6,4,3,'#ffe8b0');c.R(x,y+1,12,4,'#8a8a84');c.R(x+4,y-1,4,3,'#9a9a94')
def jroof(c,x,y,w,h=7,col='#3a4450',hi='#5a6674'):
    for j in range(h):
        ins=int((h-j)*2.2);c.R(x+ins,y+j,w-2*ins,1,col)
        for k in range(x+ins,x+w-ins,3): c.P(k,y+j,'#2a323c')
    c.R(x+int(h*2.2),y,w-2*int(h*2.2),1,hi);c.R(x,y+h,w,2,'#2a323c');c.R(x-2,y+h-2,3,2,col);c.R(x+w-1,y+h-2,3,2,col)
    c.R(x+2,y+h+2,w-4,1,'#c9a227')
def storey(c,cx,y,w,h):
    c.R(cx-w//2,y,w,h,WD[2]);c.R(cx-w//2,y,w,2,WD[4])
    for x in range(cx-w//2+3,cx+w//2-4,8): c.R(x,y+3,5,h-5,'#e8e0d0');c.R(x,y+3,5,1,'#fff8e8')
    for x in range(cx-w//2,cx+w//2,8): c.R(x,y,2,h,WD[0])
def pagoda(c,cx,base,scale=1.0):
    s=scale;c.R(int(cx-50*s),base,int(100*s),int(10*s),'#8a8a84');c.R(int(cx-50*s),base,int(100*s),2,'#a8a8a0')
    c.R(int(cx-12*s),base,int(24*s),int(10*s),'#9a9a94')
    for k in range(0,int(10*s),3): c.R(int(cx-12*s),base+k,int(24*s),1,'#7a7a74')
    storey(c,cx,int(base-16*s),int(76*s),int(16*s))
    y=int(base-16*s);widths=[112,96,82,68,56]
    for i,wd in enumerate(widths):
        w=int(wd*s);y-=int(9*s);jroof(c,cx-w//2,y,w,int(7*s));
        if i<4: y-=int(12*s);storey(c,cx,y,int((wd-36)*s),int(12*s))
    for k in range(int(30*s)): c.P(cx,y-k,'#6a6a64');c.P(cx+1,y-k,'#4a4a44')
    for k in range(0,int(24*s),4): c.R(cx-2,y-6-k,6,1,'#c9a227')
    c.R(cx-1,y-int(30*s)-3,4,3,'#c9a227')
def softlight(im,amt=.2):
    return glow(im,W//2,40,170,(255,236,200),amt)
def kplate(c,x,y,col):
    c.R(x,y,12,10,'#2a1e18');c.R(x+1,y+1,10,8,WD[3]);c.R(x+3,y-3,6,5,col);c.R(x+4,y-2,2,2,'#ffffff')

# ---------- A. plan ----------
def plan():
    S=240;im=Image.new('RGB',(S,S),'#3f6a44');c=C(im);r=random.Random(3)
    for _ in range(500): c.d.ellipse([(x:=r.randrange(S))-6,(y:=r.randrange(S))-6,x+6,y+6],fill=r.choice(['#2f5a3a','#284a32','#3f6a44']))
    gravel(c,60,40,120,140,4);c.R(110,180,20,60,'#c8c0b0')
    for y in range(186,236,12): c.R(102,y,5,5,'#9a9a94');c.R(133,y,5,5,'#9a9a94')
    c.R(100,176,40,8,WD[1]);c.R(102,170,4,14,WD[0]);c.R(134,170,4,14,WD[0])
    c.R(60,40,10,140,'#3a4450');c.R(170,40,10,140,'#3a4450');c.R(60,40,120,10,'#3a4450')
    c.R(96,70,48,48,'#8a8a84');c.R(100,74,40,40,'#3a4450');c.R(108,82,24,24,'#4a5664');c.R(116,90,8,8,'#c9a227')
    c.R(116,118,8,10,'#9a9a94')
    big=im.resize((S*3,S*3),Image.NEAREST);d=ImageDraw.Draw(big)
    f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    def lab(x,y,t,ax,ay):
        d.line([(ax*3,ay*3),(x,y)],fill='#ffffff',width=2);w=d.textlength(t,font=f);d.rectangle([x-4,y-3,x+w+4,y+18],fill='#141c24');d.text((x,y),t,fill='#ffe9a0',font=f)
    lab(440,670,'1  Lantern path through the pines',120,214);lab(450,560,'2  Wooden gate',136,176)
    lab(20,470,'3  Gravel courtyard and cloisters',80,150);lab(450,250,'4  The pagoda (Temple Tower)',138,80)
    lab(20,330,'5  Shrine room (ground floor)',116,108);lab(20,250,'6  Hidden chamber below',112,94)
    d.text((14,10),'Temple Tower complex: overview',fill='#ffffff',font=f)
    big.save(OUT+'tower_0_plan.png')

# ---------- B. lantern path and gate ----------
def approach():
    im,d=new();c=C(im)
    for y in range(40): c.R(0,y,W,1,'#%02x%02x%02x'%(168+y//2,204,224))
    c.R(0,40,W,H-40,'#3f6a44');r=random.Random(5)
    for _ in range(300): c.P(r.randrange(W),40+r.randrange(H-40),r.choice(['#2f5a3a','#4f7a50']))
    pagoda(c,88,36,.45)
    gravel(c,64,40,48,H-40,6)
    for y in range(52,H,6): c.R(76,y,24,4,'#b8b0a0');c.R(76,y,24,1,'#d8d0c0')
    for y in (70,110,150): slantern(c,46,y);slantern(c,118,y)
    c.R(52,88,72,8,WD[0]);jroof(c,48,78,80,8,'#3a4450');c.R(56,96,6,40,WD[1]);c.R(114,96,6,40,WD[1]);c.R(56,96,2,40,WD[3]);c.R(114,96,2,40,WD[3])
    c.R(62,100,52,4,WD[2])
    for x,y,s in [(14,60,26),(160,70,28),(10,130,30),(166,140,30),(20,196,26),(156,200,26)]: pine(c,x,y,s,x+y)
    person(c,80,176,True)
    im=softlight(im,.22)
    for y in (70,110,150): im=glow(im,52,y+6,14,(255,220,150),.35);im=glow(im,124,y+6,14,(255,220,150),.35)
    im=vignette(im,.3);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'tower_1_approach.png');return im

# ---------- C. the pagoda in its courtyard ----------
def courtyard():
    im,d=new();c=C(im)
    for y in range(100): c.R(0,y,W,1,'#%02x%02x%02x'%(176+y//3,206+y//6,226))
    gravel(c,0,100,W,H-100,11)
    for x0 in (0,146):
        c.R(x0,40,30,100,WD[1])
        for y in range(48,140,10): c.R(x0+4,y,22,6,'#e8e0d0');c.R(x0+4,y,22,1,'#fff8e8')
        jroof(c,x0-2,32,34,6)
    pagoda(c,88,140,1.0)
    for x in (40,124): slantern(c,x,150)
    pine(c,16,170,30,1);pine(c,160,176,30,2)
    c.R(80,150,16,58,'#b8b0a0')
    person(c,80,178,True)
    im=softlight(im,.25);im=glow(im,46,156,14,(255,220,150),.35);im=glow(im,130,156,14,(255,220,150),.35)
    im=vignette(im,.25);im.resize((W*4,H*4),Image.NEAREST).save(OUT+'tower_2_pagoda.png');return im

# ---------- D. shrine room, ground floor ----------
def shrine():
    im,d=new();c=C(im)
    c.R(0,0,W,H,WD[1])
    for y in range(0,20,6):
        for x in range(0,W,10): c.R(x,y,9,5,WD[0]);c.R(x+1,y+1,7,3,'#5a2a20')
    c.R(0,20,W,4,WD[3])
    c.R(58,6,60,16,'#c8c4b8');c.R(60,8,56,12,'#2a1e18')
    for k in range(3): c.R(68+k*14,11,8,6,'#e8e0d0')
    c.R(0,24,W,72,'#e8e0d0')
    for x in (0,150):
        for y in range(28,92,8):
            for xx in range(x+2,x+24,6): c.R(xx,y,5,7,'#f8f0dc')
        c.R(x,26,26,68,WD[0]) if False else None
    for x in (26,52,118,144): c.R(x,20,8,130,WD[0]);c.R(x,20,2,130,WD[3]);c.R(x-2,148,12,4,'#8a8a84')
    # golden shrine on a lacquered dais
    c.R(56,70,64,30,'#1a1414');c.R(58,72,60,26,'#2a1a1a')
    for x in range(60,116,8): c.R(x,76,6,4,'#a8322a');c.R(x+1,77,4,2,'#c9a227')
    c.R(58,96,60,4,'#c9a227')
    c.R(66,40,44,32,O);c.R(68,42,40,30,'#8a6a20')
    for x in (70,80,94,104): c.R(x,46,3,24,'#1a1414')
    c.R(84,48,8,20,'#e8c860');c.R(86,50,4,6,'#fff0c0')
    jroof(c,60,30,56,9,'#c9a227','#f0d860')
    # hanging golden lanterns
    for x in (40,136):
        for k in range(0,34,4): c.R(x,24+k,2,3,'#c9a227')
        c.R(x-4,58,10,8,'#c9a227');c.R(x-3,59,8,6,'#ffe8b0')
    # tatami floor
    c.R(0,100,W,108,'#c8b878')
    for y in (100,132,164,196): c.R(0,y,W,2,'#3a3a30')
    for x in (0,58,118,176): c.R(x,100,2,108,'#3a3a30')
    for y in range(100,H,2): c.R(0,y,W,1,'#c0b070') if y%4==0 else None
    # offering table with crane and vessels, and four key stands
    c.R(60,112,56,14,O);c.R(61,113,54,12,'#8a3a2a');c.R(61,113,54,3,'#a84a3a');c.R(62,125,3,8,O);c.R(111,125,3,8,O)
    c.R(70,104,6,10,'#c9a227');c.R(72,100,2,4,'#c9a227');c.R(74,100,4,2,'#c9a227')
    c.R(84,106,8,8,'#3a8a7a');c.R(84,106,8,2,'#5aa898');c.R(98,106,8,8,'#2a2a2a');c.R(99,104,6,3,'#ffffff')
    for x,col in [(20,'#4ac8e8'),(44,'#3fb87a'),(120,'#cfe8ff'),(144,'#f2a22e')]: kplate(c,x,140,col)
    # hidden hatch in the floor
    c.R(78,150,20,14,'#b0a060');c.R(78,150,20,1,'#8a7a40');c.R(78,163,20,1,'#8a7a40');c.R(78,150,1,14,'#8a7a40');c.R(97,150,1,14,'#8a7a40')
    person(c,80,178,True)
    im=vignette(im,.45);im=glow(im,88,56,60,(255,220,150),.35);im=glow(im,41,62,22,(255,230,170),.45);im=glow(im,137,62,22,(255,230,170),.45)
    im=glow(im,12,60,40,(255,246,220),.25);im=glow(im,164,60,40,(255,246,220),.25)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'tower_3_shrine_room.png');return im

# ---------- E. hidden chamber below ----------
def chamber():
    im,d=new();c=C(im)
    c.R(0,0,W,H,'#2a2420')
    for y in range(0,H,8):
        for x in range((y//8%2)*8,W,16): c.R(x,y,15,7,'#3a322c');c.R(x,y,15,1,'#4a4038')
    for y in (10,30): c.R(0,y,W,6,WD[0]);c.R(0,y,W,1,WD[3])
    for x in (20,80,140): c.R(x,0,10,40,WD[1]);c.R(x,0,2,40,WD[3])
    # four alcoves with element lamps
    for x,col,g in [(12,'#4ac8e8',(80,200,240)),(52,'#3fb87a',(80,220,140)),(104,'#e8f4ff',(220,236,255)),(144,'#f2a22e',(255,170,70))]:
        c.R(x,44,22,30,WD[0]);c.R(x+2,46,18,26,'#1a1614');jroof(c,x-2,38,26,5,WD[1],WD[3])
        c.R(x+8,60,6,8,'#c8c4b8');c.R(x+9,56,4,5,col)
    # round stone platform with paper lanterns
    c.d.ellipse([46,90,130,140],fill='#5a524a');c.d.ellipse([50,92,126,134],fill='#7a7068');c.d.ellipse([60,98,116,128],fill='#8a8078')
    for k in range(3): c.d.ellipse([70+k*4,104+k*2,106-k*4,122-k*2],outline='#6a625a')
    for x in (30,140):
        c.R(x+3,82,2,8,'#2a1e18');c.d.ellipse([x,90,x+8,104],fill='#f0e0b8');c.R(x+1,96,6,1,'#c8a870')
    # stairs coming down from the hatch
    for i in range(6): sh=60+i*14;c.R(72,150+i*9,32,8,'#%02x%02x%02x'%(sh+20,sh+8,sh));c.R(72,150+i*9,32,1,'#%02x%02x%02x'%(sh+40,sh+28,sh+20))
    c.R(70,150,2,58,WD[0]);c.R(104,150,2,58,WD[0])
    person(c,80,176,True)
    im=vignette(im,.65)
    for x,g in [(23,(80,200,240)),(63,(80,220,140)),(115,(220,236,255)),(155,(255,170,70))]: im=glow(im,x,60,26,g,.5)
    for x in (34,144): im=glow(im,x,97,24,(255,226,170),.45)
    im=glow(im,88,115,50,(255,236,200),.15)
    im.resize((W*4,H*4),Image.NEAREST).save(OUT+'tower_4_hidden_chamber.png');return im

a=approach();b=courtyard();s=shrine();ch=chamber();plan()
sheet=Image.new('RGB',(W*2*4+50,H*2+20),'#14202c')
for i,im in enumerate([a,b,s,ch]): sheet.paste(im.resize((W*2,H*2),Image.NEAREST),(10+i*(W*2+10),10))
sheet.save(OUT+'tower_overview.png');print('ok')

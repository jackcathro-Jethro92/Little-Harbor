from PIL import Image, ImageDraw
import math, random
W,H=176,208
def new():
    im=Image.new('RGB',(W,H),'#000');return im,ImageDraw.Draw(im)
class C:
    def __init__(s,im): s.im=im;s.d=ImageDraw.Draw(im)
    def R(s,x,y,w,h,c):
        if w>0 and h>0: s.d.rectangle([x,y,x+w-1,y+h-1],fill=c)
    def P(s,x,y,c):
        if 0<=x<W and 0<=y<H: s.d.point((x,y),fill=c)
O='#3a3226'
# ---- characters (the game's own 16x20 sprite grids) ----
FB=["................","................","......KKKKKK....",".....KHHHHHHK...","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHSSSSSSHK..","....KSSSSSSSSK..","....KSESSSSESK..","....KSSSSSSSSK..",".....KSSSSSSK...","......KKSSKK....","....KKTTTTTTKK..","...KSKTTTTTTKSK.","...KSKTTTTTTKSK.","....KKTTTTTTKK..","......KPPPPK....","......KPPKPPK...","......KBBKBBK...","................"]
BB=["................","................","......KKKKKK....",".....KHHHHHHK...","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..","....KHHHHHHHHK..",".....KHHHHHHK...","......KKSSKK....","....KKTTTTTTKK..","...KSKTTTTTTKSK.","...KSKTTTTTTKSK.","....KKTTTTTTKK..","......KPPPPK....","......KPPKPPK...","......KBBKBBK...","................"]
def person(c,x,y,back=False,hair='#6b3f1d',skin='#f1c8a0',shirt='#3a63a8',band=None):
    pal={'K':'#2b2118','E':'#2b2118','H':hair,'S':skin,'T':shirt,'P':'#3b4a6b','B':'#5a3a22','A':band or hair}
    g=[list(r) for r in (BB if back else FB)]
    if band:
        for i in range(16):
            if g[3][i]=='H': g[3][i]='A'
    for j,row in enumerate(g):
        for i,ch in enumerate(row):
            if ch!='.': c.P(x+i,y+j,pal[ch])
    c.R(x+4,y+19,8,1,'#00000040'[:7])
def blend(im,col,a):
    ov=Image.new('RGB',im.size,col);return Image.blend(im,ov,a)
def glow(im,cx,cy,r,col,amt):
    px=im.load()
    for y in range(max(0,cy-r),min(H,cy+r)):
        for x in range(max(0,cx-r),min(W,cx+r)):
            d=math.hypot(x-cx,y-cy)/r
            if d<1:
                k=(1-d)**1.7*amt;a,b,c=px[x,y];px[x,y]=(int(a+(col[0]-a)*k),int(b+(col[1]-b)*k),int(c+(col[2]-c)*k))
    return im
def vignette(im,s):
    px=im.load()
    for y in range(H):
        for x in range(W):
            d=((x-W/2)/(W/2))**2+((y-H/2)/(H/2))**2;k=max(0,min(1,(d-.55)/1.2))*s
            a,b,c=px[x,y];px[x,y]=(int(a*(1-k)),int(b*(1-k)),int(c*(1-k*.7)))
    return im
# ---- shared Minoan column (wider at the top) ----
def column(c,x,top,bot,shaft='#b8322a',hi='#d8524a',lo='#7c1e18',cap='#2a2226'):
    h=bot-top
    for j in range(6,h-3):
        w=12-int(3*j/h);xx=x+(12-w)//2
        c.R(xx,top+j,w,1,shaft);c.R(xx,top+j,2,1,hi);c.R(xx+w-2,top+j,2,1,lo)
    c.R(x-3,top,18,3,'#2a2226');c.R(x-2,top+3,16,3,cap);c.R(x-2,top+3,16,1,'#4a4246');c.R(x,top+6,12,1,'#1a1416')
    c.R(x+1,bot-3,10,3,'#1a1416')
def blocks(c,x,y,w,h,base,hi,lo,bw=12,bh=6):
    c.R(x,y,w,h,base)
    for j in range(0,h,bh):
        c.R(x,y+j,w,1,lo);off=(j//bh%2)*(bw//2)
        for i in range(off,w,bw): c.R(x+i,y+j,1,bh,lo)
        c.R(x,y+j+1,w,1,hi)
def dolphin(c,x,y,col='#2a4a8a',belly='#e8f0f8'):
    c.R(x+2,y+2,10,3,col);c.R(x+4,y+1,6,1,col);c.R(x+3,y+5,8,1,belly);c.R(x+12,y+2,2,1,col);c.R(x,y+1,3,1,col);c.R(x,y+4,3,1,col);c.R(x+7,y,2,1,col);c.P(x+10,y+2,'#fff')


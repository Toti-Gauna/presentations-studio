import numpy as np, wave, sys
SR=48000; DUR=6.8
t=np.arange(int(SR*DUR))/SR
L=np.zeros_like(t); R=np.zeros_like(t)
rng=np.random.default_rng(3)
def add(x, start, pan=0.0, g=1.0):
    i=int(start*SR); n=min(len(x), len(L)-i)
    L[i:i+n]+=x[:n]*g*(1-max(0,pan)); R[i:i+n]+=x[:n]*g*(1+min(0,pan))
def env(n, a=0.005, r=0.2):
    e=np.ones(n); na=min(int(a*SR),n//4); nr=min(int(r*SR),n-na)
    e[:na]=np.linspace(0,1,na); e[-nr:]*=np.linspace(1,0,nr)**2; return e
def whoosh(d, f0, f1, g=0.5):
    n=int(d*SR); x=rng.standard_normal(n); out=np.zeros(n); s=0
    fc=np.geomspace(f0,f1,n)
    for k in range(n):  # filtro pasa bajos de un polo con corte variable
        a=np.exp(-2*np.pi*fc[k]/SR); s=(1-a)*x[k]+a*s; out[k]=s
    e=np.sin(np.linspace(0,np.pi,n))**1.5
    return out/np.abs(out).max()*e*g
def tono(f, d, g=0.3, tipo='sin', r=0.3):
    n=int(d*SR); tt=np.arange(n)/SR
    x=np.sin(2*np.pi*f*tt) if tipo=='sin' else np.sign(np.sin(2*np.pi*f*tt))*0.3+np.sin(2*np.pi*f*tt)*0.7
    return x*env(n,0.004,r)*g
def boing(f, d=0.25, g=0.35):
    n=int(d*SR); tt=np.arange(n)/SR; fr=f*(1+0.6*np.exp(-tt*25)); ph=2*np.pi*np.cumsum(fr)/SR
    return np.sin(ph)*np.exp(-tt*9)*g
def golpe(g=0.9):
    n=int(0.6*SR); tt=np.arange(n)/SR; fr=110*np.exp(-tt*6)+45; ph=2*np.pi*np.cumsum(fr)/SR
    sub=np.sin(ph)*np.exp(-tt*5); click=rng.standard_normal(n)*np.exp(-tt*60)*0.4
    return (sub+click)*g
# pad de fondo (acorde mayor que crece)
pad=np.zeros_like(t)
for f in (130.81,196.0,261.63,329.63,392.0):
    pad+=np.sin(2*np.pi*f*t+rng.random()*6)*0.05
pad*=np.clip((t-0.9)/1.6,0,1)*np.clip((DUR-t)/0.8,0,1)
L+=pad; R+=pad
add(whoosh(0.9,300,4000,0.35),0.0)                      # mosaicos
for k in range(24): add(tono(1800+rng.random()*900,0.04,0.05),0.05+k*0.03,pan=rng.random()*1.2-0.6)  # tic-tic de mosaicos
add(whoosh(1.0,500,9000,0.45),0.85)                      # revelado
for k in range(8):                                         # pasos que llegan
    for j in range(5): add(tono(220+k*18,0.05,0.07),1.35+k*0.06+j*0.12,pan=(-0.8 if k<4 else 0.8))
for k in range(8): add(boing(330+k*35),2.1+k*0.03,pan=-0.7+k*0.2,g=0.6)   # aterrizajes
add(golpe(),2.5)                                           # logo
add(whoosh(0.5,2000,12000,0.25),2.45)
notas=[523.25,659.25,783.99,1046.5,1318.5]                 # arpegio brillante
for k,f in enumerate(notas): add(tono(f,0.6,0.16,r=0.5),3.1+k*0.08,pan=-0.4+k*0.2)
for k in range(10): add(tono(2600+k*190,0.25,0.05,r=0.2),4.0+k*0.05,pan=-0.5+k*0.1)  # brillo
for k in range(8): add(tono(880+k*55,0.12,0.06),4.3+k*0.05)  # saludos
add(whoosh(0.6,6000,400,0.3),6.05)                         # salida
m=np.stack([L,R],1); m=m/np.abs(m).max()*0.85
w=wave.open(sys.argv[1],'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()

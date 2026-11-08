# Efectos de «HandIA te habla» + la música del clip (sintetizados). Uso: python sonido.py <musica.wav> <salida.wav>
import numpy as np, wave, sys
SR=48000; rng=np.random.default_rng(31)
def leer(f):
    w=wave.open(f); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,w.getnchannels()).astype(float)/32768; w.close(); return x
def env(n,a,r):
    e=np.ones(n); na=min(int(a*SR),n//4); nr=min(int(r*SR),n-na); e[:na]=np.linspace(0,1,na); e[n-nr:]*=np.linspace(1,0,nr)**2; return e
def tono(f,d,g,r=.35):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*env(n,.004,r)*g
def barrido(f0,f1,d,g):
    n=int(d*SR); f=np.geomspace(f0,f1,n); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.01,d*.6)*g
def clic(g):
    n=int(.03*SR); t=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-t*220)*g
mu=leer(sys.argv[1]); T=18.5; N=int(T*SR); L=np.zeros(N); R=np.zeros(N)
n=min(N,len(mu)); L[:n]+=mu[:n,0]*.55; R[:n]+=mu[:n,-1]*.55
def add(x,t,pan=0):
    i=int(t*SR); k=min(len(x),N-i)
    if k>0: L[i:i+k]+=x[:k]*(1-max(0,pan)); R[i:i+k]+=x[:k]*(1+min(0,pan))
add(barrido(300,760,.25,.25),1.1)                                     # aparece HandIA
for t,vos in [(1.65,0),(4.05,1),(6.35,0),(9.15,0),(11.65,1),(13.25,0)]: # cada mensaje
    add(tono(1046 if not vos else 784,.14,.12)+0,t,pan=.3 if vos else -.1)
for t in (4.15,11.75): add(tono(660,.12,.14),t); add(tono(880,.14,.14),t+.09)   # se abre el micrófono
add(clic(.5),8.75); add(barrido(2400,900,.12,.12),8.76)               # foto
for k in range(3): add(tono(1318,.1,.08),10.25+k*.18,pan=-.3)         # especialistas
add(clic(.35),12.95); add(tono(784,.3,.18),13.15); add(tono(1046,.32,.16),13.18)  # pedido enviado
for i,f in enumerate((1046.5,1318.5,1568.0,2093.0)): add(tono(f,.5,.07,r=.4),13.25+i*.07,pan=-.3+i*.2)
m=np.stack([L,R],1); m=m/max(1e-9,np.abs(m).max())*.89
w=wave.open(sys.argv[2],'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
print('audio', sys.argv[2])

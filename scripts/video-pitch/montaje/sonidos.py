import numpy as np, wave, json, sys
SR=48000
rng=np.random.default_rng(5)
def guardar(x,f):
    m=np.stack([x[0],x[1]],1); m=m/max(1e-9,np.abs(m).max())*0.9
    w=wave.open(f,'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
def env(n,a,r):
    e=np.ones(n); na=min(int(a*SR),n//4); nr=min(int(r*SR),n-na); e[:na]=np.linspace(0,1,na); e[n-nr:]*=np.linspace(1,0,nr)**2; return e
def tono(f,d,g,r=.4):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*env(n,.004,r)*g
def ruido(d,f0,f1,g):
    n=int(d*SR); x=rng.standard_normal(n); out=np.zeros(n); s=0; fc=np.geomspace(f0,f1,n)
    for k in range(n): a=np.exp(-2*np.pi*fc[k]/SR); s=(1-a)*x[k]+a*s; out[k]=s
    return out/np.abs(out).max()*np.sin(np.linspace(0,np.pi,n))**1.5*g
def add(L,R,x,t,pan=0):
    i=int(t*SR); n=min(len(x),len(L)-i)
    if n<=0: return
    L[i:i+n]+=x[:n]*(1-max(0,pan)); R[i:i+n]+=x[:n]*(1+min(0,pan))
modo=sys.argv[1]
if modo=='final':
    T=202.0; L=np.zeros(int(T*SR)); R=np.zeros_like(L); T0=183.4
    add(L,R,ruido(1.0,200,6000,.5),T0-.3)                     # entrada al mapa
    add(L,R,ruido(1.2,6000,300,.45),T0+3.2)                    # alejamiento
    n=int(1.2*SR); t=np.arange(n)/SR; rumble=np.sin(2*np.pi*(55*np.exp(-t*1.5)+30)*t)*np.exp(-t*2.5)*.9+rng.standard_normal(n)*np.exp(-t*8)*.3
    add(L,R,rumble,T0+3.7)                                      # se rompe
    for i in range(8):                                          # cada arreglo: brillo ascendente
        f=[523.25,587.33,659.25,698.46,783.99,880.0,987.77,1046.5][i]
        add(L,R,tono(f,.5,.25)+tono(f*2,.5,.08),T0+5.5+i*.62+.15,pan=-.6+i*.17)
    # crescendo de la frase final (acorde mayor que crece)
    n=int(4.2*SR); t=np.arange(n)/SR; pad=sum(np.sin(2*np.pi*f*t) for f in (261.63,329.63,392.0,523.25))*np.clip(t/2.5,0,1)*.12*env(n,.01,.8)
    add(L,R,pad,T0+11.0)
    for i,f in enumerate((523.25,659.25,783.99,1046.5,1318.5)): add(L,R,tono(f,1.2,.2,r=.9),T0+15.15+i*.07,pan=-.4+i*.2)   # gracias
    n=int(3.0*SR); t=np.arange(n)/SR; acorde=sum(np.sin(2*np.pi*f*t) for f in (261.63,392.0,523.25,659.25))*.13*env(n,.02,1.6)
    add(L,R,acorde,199.4)
    guardar((L,R),sys.argv[2])
else:
    tj=json.load(open(sys.argv[3])); T=tj['dur']; L=np.zeros(int(T*SR)); R=np.zeros_like(L); t=np.arange(len(L))/SR
    notas=[(261.63,329.63,392.0),(220.0,261.63,329.63),(174.61,220.0,261.63),(196.0,246.94,293.66)]
    pad=np.zeros_like(t)
    for i,ch in enumerate(notas):
        m=((t%16)>=i*4)&((t%16)<(i+1)*4)
        for f in ch: pad+=np.where(m,np.sin(2*np.pi*f*t),0)
    pad*=0.05*(0.65+0.35*np.sin(2*np.pi*0.25*t))*np.clip(t/1.5,0,1)*np.clip((T-t)/2,0,1)
    L+=pad; R+=pad
    for c in tj['cards']: add(L,R,ruido(.6,400,5000,.18),c-.1); add(L,R,tono(880,.3,.06),c+.15)
    for t0,archivo in tj.get('clips',[]):   # audio de las animaciones a pantalla completa
        w=wave.open(archivo); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,w.getnchannels()).astype(float)/32768; w.close()
        i=int(t0*SR); n=min(len(x),len(L)-i)
        if n>0: L[i:i+n]+=x[:n,0]*.22; R[i:i+n]+=x[:n,-1]*.22
    guardar((L,R),sys.argv[2])

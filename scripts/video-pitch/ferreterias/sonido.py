# Efectos suaves para la animación de ferreterías (sintetizados; por debajo de una voz).
import numpy as np, wave, sys
SR=48000; rng=np.random.default_rng(11)
def guardar(x,f):
    m=np.stack([x[0],x[1]],1); m=m/max(1e-9,np.abs(m).max())*0.85
    w=wave.open(f,'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
def env(n,a,r):
    e=np.ones(n); na=min(int(a*SR),n//4); nr=min(int(r*SR),n-na); e[:na]=np.linspace(0,1,na); e[n-nr:]*=np.linspace(1,0,nr)**2; return e
def tono(f,d,g,r=.4):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*env(n,.004,r)*g
def barrido(f0,f1,d,g):
    n=int(d*SR); t=np.arange(n)/SR; f=np.geomspace(f0,f1,n); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.01,d*.6)*g
def soplo(d,g,brillo=.25):
    n=int(d*SR); x=rng.standard_normal(n); y=np.zeros(n); s=0; a=1-brillo
    for k in range(n): s=a*s+(1-a)*x[k]; y[k]=s
    return y/np.abs(y).max()*np.sin(np.linspace(0,np.pi,n))**1.6*g
def golpe(f,d,g):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t*np.exp(-t*3))*np.exp(-t*18)*g
def M(*xs):
    out=np.zeros(max(len(x) for x in xs))
    for x in xs: out[:len(x)]+=x
    return out
def add(L,R,x,t,pan=0):
    i=int(t*SR); n=min(len(x),len(L)-i)
    if n<=0: return
    L[i:i+n]+=x[:n]*(1-max(0,pan)); R[i:i+n]+=x[:n]*(1+min(0,pan))
T=16.0; L=np.zeros(int(T*SR)); R=np.zeros_like(L)
for i in range(16): add(L,R,golpe(110+(i%4)*18,.35,.35),.3+i*.07,pan=-.8+i*.1)      # la ciudad se arma
add(L,R,golpe(80,.5,.7),.95,-.5); add(L,R,golpe(70,.6,.7),1.1,.6)                       # ferretería y edificio
add(L,R,soplo(.25,.25,.5),1.6,-.5); add(L,R,M(tono(660,.18,.25),tono(990,.18,.12)),1.8,-.5)  # toldo y cartel
add(L,R,M(tono(880,.16,.28),tono(660,.22,.22)),2.5,.5)                                     # ¡se rompió un caño!
add(L,R,tono(660,.22,.2),2.68,.5)
for k in range(5): add(L,R,soplo(.05,.12,.6),3.45+k*.24,-.6+k*.1)                      # pasos
add(L,R,barrido(300,760,.22,.3),4.45)                                                  # aparece el celular
for k in range(3): add(L,R,tono(1046,.12,.22),5.0+k*.35)                               # materiales tildados
add(L,R,M(tono(1318,.25,.3),tono(1568,.25,.15)),6.6,-.4); add(L,R,tono(1568,.3,.25),6.78,-.4)  # ¡en stock!
add(L,R,soplo(.5,.18,.35),6.9,-.4)                                                     # se dibuja la ruta
add(L,R,soplo(.04,.3,.8),7.8); add(L,R,M(tono(784,.3,.22),tono(1046,.3,.18)),8.0)         # reservado
for k in range(4): add(L,R,soplo(.05,.12,.6),8.65+k*.2,-.4)
add(L,R,M(tono(523,.2,.25),tono(784,.25,.2)),9.55,-.4)                                    # retira la caja
add(L,R,soplo(.8,.18,.35),9.7)
for k in range(8): add(L,R,soplo(.05,.12,.6),10.05+k*.22,-.4+k*.12)
for i,f in enumerate((523.25,659.25,783.99,1046.5,1318.5)): add(L,R,tono(f,.9,.18,r=.7),12.3+i*.08,pan=.3)  # arreglo listo
for k in range(4): add(L,R,soplo(.3,.12,.3),13.0+k*.16,-.6+k*.4)                      # beneficios
n=int(2.6*SR); t=np.arange(n)/SR; acorde=sum(np.sin(2*np.pi*f*t) for f in (261.63,392.0,523.25,659.25))*.09*env(n,.05,1.6)
add(L,R,acorde,13.6)
tt=np.arange(len(L))/SR; pad=sum(np.sin(2*np.pi*f*tt) for f in (130.81,196.0,261.63))*.025*np.clip(tt/1.5,0,1)*np.clip((T-tt)/1.5,0,1)
L+=pad; R+=pad
guardar((L,R),sys.argv[1])

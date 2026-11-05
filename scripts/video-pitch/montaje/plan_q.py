import json
S='/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
D='/home/user/presentations-studio/salida/pptx/handyx-aticma-evento'
num=json.load(open(f'{S}/numeros.json'))
def estado(fx,fy,s):
    sc=s; tx=960-fx*sc; ty=540-fy*sc
    tx=min(0,max(1920-1920*sc,tx)); ty=min(0,max(1080-1080*sc,ty)); return [round(tx,2),round(ty,2),round(sc,5)]
PREG=['¿Cuál es tu CAC?','¿Cuánto cuesta mantener Handyx?','¿De dónde salen el 25 % y los USD 100.000?','¿Cuántos trabajos tienen cobrados?','¿HandIA funciona hoy?','¿Qué los diferencia de Clickie y el resto?','¿Cómo cobran el 15 %?','¿Cómo captan y retienen profesionales?','¿En qué usarían los USD 100.000?','¿Qué hacen si los clientes no vuelven?','¿Por qué invertirían USD 100.000 en Handyx?','¿Qué herramientas van a tener los profesionales?','¿Cómo van a conseguir tracción?','¿Hasta dónde puede crecer Handyx?','¿Cómo van a multiplicar los ingresos?','¿Van a invertir la plata de los inversores en cripto?','¿Piensan en una salida? ¿Una IPO?','¿Cómo consiguen los materiales los profesionales?','¿Cómo te ayuda HandIA a conseguir un mejor servicio?','¿Qué logran en los próximos 3 meses?']
RESP={1:['x-cac'],2:['x-costos'],3:['x-proyeccion'],4:['x-validacion'],5:[],6:['x-ux-ia','x-competidores','x-competidores-mundo'],7:[],8:['x-marketing'],9:['x-inversion','x-un-millon'],10:[],
      11:['x-un-millon','x-5m'],12:['x-herramientas-1','x-herramientas-2','x-negocios'],13:['x-marketing','x-publicidades','x-marca'],14:['x-mapa','x-5m','x-business','x-profesiones'],15:['x-multiplicar-1','x-circulo'],16:['x-multiplicar-2'],17:['x-ipo'],18:['clip:ferreterias'],19:['clip:handia'],20:['x-plan-3m','x-mes-1','x-mes-2','x-mes-3']}
PJ=['bombilla','llave','grifo','engranaje','gota','aire','medidor_gas','brocha']
shots=[];cards=[];t=0.0;push=1
# drift: alterna focos para que cada lámina tenga movimiento
FOCOS=[(900,500),(1020,580),(960,600),(940,480)]
def lamina(img,d,k):
    global t,push
    fx,fy=FOCOS[k%len(FOCOS)]
    shots.append({'t0':t,'t1':t+d,'img':img,'push':push,'keys':[[t,*estado(960,540,1.0),'none'],[t+d,*estado(fx,fy,1.04),'none']]})
    push*=-1; t+=d
CLIPS=[]
# animaciones a pantalla completa: secuencia de cuadros + su audio (se mezcla en sonidos.py)
ANIM={'ferreterias':{'frames':f'file://{S}/ferr/cuadros/f{{n}}.jpg','n':480,'fps':30,'audio':f'{S}/ferr/sfx.wav'},
      'handia':{'frames':f'file://{S}/handia/cuadros/f{{n}}.jpg','n':555,'fps':30,'audio':f'{S}/handia/audio.wav'}}
def clip(nombre):
    global t,push
    a=ANIM[nombre]; d=a['n']/a['fps']+0.6
    shots.append({'t0':t,'t1':t+d,'img':a['frames'].replace('{n}','00000'),'frames':a['frames'],'n':a['n'],'fps':a['fps'],'push':push,'keys':[[t,0,0,1,'none'],[t+d,0,0,1,'none']]})
    CLIPS.append([round(t,3),a['audio'],round(d,3)]); push*=-1; t+=d
lamina(f'file://{S}/edicion/preguntas-intro.png',3.5,0)
k=0
for n,q in enumerate(PREG,1):
    cards.append({'t0':t,'t1':t+3.3,'n':n,'total':len(PREG),'q':q,'pj':PJ[(n-1)%len(PJ)],'barra':900}); t+=3.3
    lamina(f"file://{D}/{num[f'q-{n:02d}']:02d}.png",7.0,k); k+=1
    for x in RESP[n]:
        if x.startswith('clip:'): clip(x[5:]); continue
        lamina(f"file://{D}/{num[x]:02d}.png",5.5,k); k+=1
lamina(f"file://{D}/{num['a-equipo#1']:02d}.png",4.5,2)
plan={'dur':round(t,2),'stage':[0,0,1920,1080],'fondo':None,'shots':shots,'cards':cards,'stickers':[]}
open(f'{S}/montaje-q/plan.js','w').write('window.PLAN='+json.dumps(plan,ensure_ascii=False)+';')
json.dump({'dur':t,'cards':[c['t0'] for c in cards],'clips':CLIPS},open(f'{S}/montaje-q/tiempos.json','w'))
print('dur',round(t,1),'shots',len(shots))

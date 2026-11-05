import json, sys
S='/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad'
D='/home/user/presentations-studio/salida/pptx/handyx-aticma-evento'
num=json.load(open(f'{S}/numeros.json'))
SX,SY,SW,SH=40,110,1504,846; B=SW/1920
def estado(fx,fy,s):
    sc=B*s; tx=SW/2-fx*sc; ty=SH/2-fy*sc
    tx=min(0,max(SW-1920*sc,tx)); ty=min(0,max(SH-1080*sc,ty))
    return [round(tx,2),round(ty,2),round(sc,5)]
def toma(img,t0,t1,cams,push=1):
    keys=[]
    for i,(t,fx,fy,s) in enumerate(cams):
        e=estado(fx,fy,s); keys.append([t,*e,'power2.inOut'])
        tn=cams[i+1][0] if i+1<len(cams) else t1
        if tn-t>1.6: keys.append([tn-0.9,*estado(fx,fy,s*1.035),'none'])
    return {'t0':t0,'t1':t1,'img':f'file://{D}/{img:02d}.png','keys':keys,'push':push}
I=lambda k: num[k]
shots=[
 toma(1,0,43.3,[(0,960,540,1),(6.3,800,300,1.25),(12.0,1460,640,1.5),(26.3,960,540,1),(33.5,960,640,1.55)]),
 toma(2,43.3,79.9,[(43.3,960,540,1),(47.4,560,640,1.55),(58.3,760,760,1.7),(70.7,1420,620,1.6)],-1),
 toma(3,79.9,104.6,[(79.9,960,540,1),(81.4,420,640,1.6),(90.4,1250,480,1.3),(99.4,1300,850,1.5)]),
 toma(4,104.6,115.9,[(104.6,960,540,1),(105.1,1460,560,1.5),(108.7,560,520,1.5)],-1),
 toma(5,115.9,136.3,[(115.9,960,540,1),(116.6,620,480,1.45),(121.3,620,800,1.6),(128.2,620,760,1.75)]),
 toma(I('a-equipo#0'),136.3,155.6,[(136.3,960,540,1),(136.8,620,230,1.45),(140.6,520,560,1.6),(152.6,1420,480,1.6)],-1),
 toma(I('x-inversion'),155.6,162.0,[(155.6,960,540,1),(157.0,960,560,1.04)]),
 toma(I('x-profesiones'),162.0,169.6,[(162.0,960,540,1),(166.5,960,600,1.12)],-1),
 toma(I('x-mapa'),169.6,175.8,[(169.6,960,540,1),(172.4,1400,560,1.5)]),
 toma(I('a-equipo#0'),175.8,183.6,[(175.8,960,540,1),(176.6,1430,800,1.6)],-1),
]
st=[(6.6,'La odisea','reloj2'),(15.6,'Profesionales buscando clientes','usuarios'),(29.4,'Creamos Handyx','chispas'),(51.6,'HandIA','chispas'),
    (64.9,'Presupuesto aproximado','calculadora'),(71.8,'¿Ya sabés el oficio? Directo','objetivo'),(85.6,'Herramientas del profesional','herramienta'),
    (97.3,'Trabajos · gastos · ingresos','billetera'),(106.8,'2 apps desarrolladas','celular'),(111.7,'Porteros: primeros ingresos','edificio'),
    (119.7,'259.623 hogares','casa'),(130.9,'USD 100.000 de ingresos brutos','dolar'),(145.1,'Sistema agéntico con IA','ia'),
    (154.9,'Inversión: USD 100.000','alcancia'),(167.4,'72 profesiones','objetivo'),(171.9,'Handyx for People + Business','tienda'),(177.1,'Silicon Valley','cohete')]
stickers=[{'t':t,'dur':2.6,'text':x,'icon':i,'y':848} for t,x,i in st]
grietas=[[[-68,-25],[-64,-29],[-60,-32],[-63,-35],[-58,-40]],[[-62,-5],[-57,-9],[-52,-6],[-47,-11],[-41,-8]],[[-78,-2],[-74,-7],[-76,-12],[-71,-17]],
 [[-12,14],[-6,10],[0,12],[6,9],[12,11]],[[18,-4],[23,-10],[21,-17],[27,-24]],[[-2,26],[6,22],[13,27],[22,23],[30,26]],
 [[-6,41],[1,45],[8,43],[15,47],[22,45]],[[-108,41],[-100,36],[-93,39],[-85,34]]]
T0=183.4
finale={'t0':T0,'zoomOut':3.2,'romper':3.7,'frase':11.1,'gracias':15.15,'mdp':[-57.55,-38.0],'rot0':[-42,6],'giro':14,'R0':2600,'R1':360,
 'llegada':[4.4+i*0.38 for i in range(8)],'arreglo':[5.5+i*0.62 for i in range(8)],'grietas':grietas,
 'ox':960,'derecha':0}  # sin la cámara en el final: el mundo queda centrado
plan={'dur':202.0,'stage':[SX,SY,SW,SH],'fondo':f'file://{S}/edicion/fondo.png','shots':shots,'stickers':stickers,'finale':finale}
open(f'{S}/montaje/plan.js','w').write('window.PLAN='+json.dumps(plan,ensure_ascii=False)+';')
print('ok', len(shots), len(stickers))

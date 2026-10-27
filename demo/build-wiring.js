import * as THREE from 'three';

// Presentation routes, not a netlist or selected wire gauge. Scene units = 100 mm.
const colors={power:'#d34643',ground:'#29312e',control:'#c89a23',sensor:'#268b83',usb:'#4a83c2',motor:'#e57937'};
const samples=28,sides=6;
const yAxis=new THREE.Vector3(0,1,0),zAxis=new THREE.Vector3(0,0,1);

function cableGeometry(){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array((samples+1)*sides*3),3));
  const indices=[];
  for(let i=0;i<samples;i++)for(let j=0;j<sides;j++){
    const a=i*sides+j,b=i*sides+(j+1)%sides,c=a+sides,d=b+sides;
    indices.push(a,c,b,b,c,d);
  }
  geometry.setIndex(indices);return geometry;
}

function tag(parent,text,position,anchor){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fafbf2ee';ctx.fillRect(0,0,512,96);
  ctx.strokeStyle='#aebda0';ctx.lineWidth=3;ctx.strokeRect(1,1,510,94);
  ctx.fillStyle='#41523a';ctx.font='500 52px -apple-system, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,49);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));
  sprite.scale.set(1.50,.28,1);sprite.position.copy(position);sprite.renderOrder=12;parent.add(sprite);if(anchor){const geometry=new THREE.BufferGeometry().setFromPoints([anchor,position]);parent.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:'#859077',transparent:true,opacity:.7})));}return sprite;
}

export function createBuildWiring(scene,model,{kind='original',labels=true}={}){
  const compact=kind==='compact'||kind==='recommended',recommended=kind==='recommended';
  const group=new THREE.Group();group.name=kind+'-wiring';group.visible=false;scene.add(group);
  const hardware=new THREE.Group();hardware.name=kind+'-wiring-hardware';hardware.visible=false;model.root.add(hardware);
  const a=(node,x,y,z)=>({node,point:new THREE.Vector3(x,y,z)});
  const fixed=(x,y,z)=>a(model.root,x,y,z);
  const onYaw=(x,y,z)=>a(model.yaw,x,y,z);
  const onPitch=(x,y,z)=>a(model.pitch,x,y,z);
  const onGun=(x,y,z)=>a(model.gun,x,y,z);
  const pivot=compact?(recommended?1.07:1):2.5;
  const mcu=fixed(compact?.78:-.73,compact?.39:.36,compact?.72:.78);
  const driver=fixed(compact?.06:.65,.30,compact?.91:1.10);
  const battery=fixed(compact?-.65:.95,.30,compact?.72:-.98);
  const supply=fixed(compact?-.88:-.75,.25,-.70);
  const laptop=fixed(compact?-1.18:-1.62,.24,.75);
  const yawServo=kind==='compact'?fixed(.96,.37,-.78):fixed(recommended?.10:0,.42,.13);
  const pitchServo=kind==='plywood'?onYaw(-.55,1.78,1.32):compact?onYaw(recommended?-.04:-.20,recommended?.62:.55,recommended?1.43:1.33):onYaw(-.05,2.33,1.16);
  const camera=compact?onPitch(1.10,.51,.47):onGun(1.65,1.05,.18);
  const range=compact?onPitch(1.31,.31,.46):onGun(2.58,.94,.16);
  const flywheels=compact?onGun(1.12,.10,-.46):onGun(2.0,.38,.47);
  const pusher=compact?onGun(-1.12,-.10,-.46):onGun(-.8,.35,.47);
  // These anchors stay outside the frame and receiver, with two moving handoffs.
  const baseLoop=[fixed(-.55,.30,1.02),fixed(-.92,.50,1.20),onYaw(-.85,.14,1.30),onYaw(-.38,.16,1.40)];
  const upright=[onYaw(-.52,.30,1.45),onYaw(-.52,pivot-.48,1.45)];
  const pitchLoop=[onYaw(-.85,pivot-.14,1.43),onPitch(-.88,-.02,1.38),onPitch(-.60,.24,1.18)];
  const trunk=[...baseLoop,...upright];
  const moving=[...trunk,...pitchLoop];

  function block(position,size,color){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color,roughness:.7}));
    mesh.position.copy(position.point);hardware.add(mesh);return mesh;
  }
  // Existing original/compact boards remain; the plywood view gets its base MCU.
  if(kind==='plywood')block(mcu,[.58,.06,.36],'#438f7e');
  block(driver,[.46,.075,.30],'#438f7e');
  for(const dx of [-.10,.10])block(fixed(driver.point.x+dx,.37,driver.point.z),[.07,.10,.09],'#29312e');
  block(battery,[.58,.25,.36],'#526052');
  block(supply,[.34,.10,.24],'#d6d9cb');
  block(laptop,[.15,.07,.21],'#6089ae');

  const routes=[];
  function add(name,type,anchors,{offset=0,radius=.016,pulse=false}={}){
    const mesh=new THREE.Mesh(cableGeometry(),new THREE.MeshBasicMaterial({color:colors[type]}));
    mesh.name=name;mesh.frustumCulled=false;group.add(mesh);
    const route={name,type,anchors,offset,radius,mesh,curve:new THREE.CatmullRomCurve3(anchors.map(()=>new THREE.Vector3()),false,'centripetal')};
    if(pulse){route.pulse=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:'#fcf6ce'}));route.pulse.frustumCulled=false;group.add(route.pulse);}
    routes.push(route);return route;
  }
  function pair(name,type,anchors,offset=0){add(name,type,anchors,{offset:offset-.025,radius:.021});add(name+' return','ground',anchors,{offset:offset+.025,radius:.017});}
  add('Laptop to micro:bit','usb',[laptop,fixed(-1.1,.28,.84),mcu],{radius:.024,pulse:true});
  add('Camera direct to laptop','usb',[laptop,...moving,camera],{offset:.12,radius:.023,pulse:true});
  pair('Servo rail to yaw','power',[supply,fixed(-.52,.26,-.33),yawServo]);
  pair('Servo rail to pitch','power',[supply,...trunk,pitchServo],-.10);
  add('Micro:bit to yaw signal','control',[mcu,fixed(-.43,.29,.36),yawServo],{offset:.07,pulse:true});
  add('Micro:bit to pitch signal','control',[mcu,...trunk,pitchServo],{offset:-.03,pulse:true});
  add('Rangefinder I2C bundle','sensor',[mcu,...moving,range],{offset:.04,pulse:true});
  add('Yaw feedback','sensor',[mcu,fixed(-.38,.25,.27),fixed(.12,compact?(recommended?.73:.19):.72,.10)],{radius:.012});
  add('Pitch feedback','sensor',[mcu,...trunk,onYaw(-.15,pivot,-.94)],{offset:.18,radius:.012});
  add('Two motor control channels','control',[mcu,fixed(.05,.42,1.02),driver],{radius:.016,pulse:true});
  pair('Stock blaster battery to switches','motor',[battery,fixed(.45,.27,compact?.72:-.60),driver]);
  pair('Switched flywheel branch','motor',[driver,...moving,flywheels],-.20);
  pair('Switched pusher branch','motor',[driver,...moving,pusher],-.28);
  add('Common logic ground','ground',[mcu,fixed(-.32,.30,.38),supply],{radius:.018});
  add('Motor ground reference','ground',[driver,fixed(-.10,.27,.20),supply],{radius:.018});

  if(labels){
    tag(hardware,'micro:bit',mcu.point.clone().add(new THREE.Vector3(.90,.52,0)),mcu.point);
    tag(hardware,'Motor switches',driver.point.clone().add(new THREE.Vector3(-.30,.05,1.05)),driver.point);
    tag(hardware,'Servo power',supply.point.clone().add(new THREE.Vector3(-.20,.70,-.80)),supply.point);
    tag(hardware,'To laptop · 2 USB',laptop.point.clone().add(new THREE.Vector3(-1.05,.26,0)),laptop.point);
  }
  const position=new THREE.Vector3(),tangent=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3();
  let lastPose=null;
  function reshape(route){
    route.anchors.forEach((anchor,i)=>{
      const p=route.curve.points[i];p.copy(anchor.point);p.z+=route.offset;anchor.node.localToWorld(p);
    });
    const attribute=route.mesh.geometry.getAttribute('position');
    for(let i=0;i<=samples;i++){
      route.curve.getPoint(i/samples,position);route.curve.getTangent(i/samples,tangent);
      normal.crossVectors(tangent,Math.abs(tangent.z)<.92?zAxis:yAxis).normalize();binormal.crossVectors(tangent,normal).normalize();
      for(let j=0;j<sides;j++){
        const angle=j/sides*Math.PI*2,c=Math.cos(angle)*route.radius,s=Math.sin(angle)*route.radius;
        attribute.setXYZ(i*sides+j,position.x+normal.x*c+binormal.x*s,position.y+normal.y*c+binormal.y*s,position.z+normal.z*c+binormal.z*s);
      }
    }
    attribute.needsUpdate=true;
  }
  function update({visible=false,pose='',time=0}={}){
    group.visible=visible;hardware.visible=visible;if(!visible)return;
    if(lastPose!==pose){model.root.updateWorldMatrix(true,true);for(const route of routes)reshape(route);lastPose=pose;}
    for(const [i,route]of routes.entries())if(route.pulse)route.curve.getPoint((time*.00035+i*.17)%1,route.pulse.position);
  }
  return {group,hardware,routes,update};
}

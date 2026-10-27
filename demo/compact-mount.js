import * as THREE from 'three';

// Concept geometry only. One scene unit = 100 mm. No shell-fit or load validation.
export const compactSpec={baseMM:[260,220,12.7],deckMM:[160,140],pivotAboveDeckMM:100,coreEnvelopeMM:340,clearGapMM:116,yawLimit:25,pitchMin:-10,pitchMax:25};

export function createCompactMount(scene,{box,cylinder,ring,line,mat,material}){
  const root=new THREE.Group();root.visible=false;scene.add(root);
  const yaw=new THREE.Group();yaw.position.y=.25;root.add(yaw);
  const pitch=new THREE.Group();pitch.position.y=1; yaw.add(pitch);
  const darkBlue=material('#334958',.72),plastic=mat.print;
  // A smaller clamped plywood blank. Battery/controller stay on the fixed base.
  box(root,2.6,.127,2.2,0,.0635,0,mat.wood,.01);
  for(const x of [-1.12,1.12]){
    box(root,.24,.045,.38,x,.15,.94,mat.dark,.008);
    box(root,.055,.23,.08,x,.03,1.08,mat.dark,.005);
    cylinder(root,.02,.02,.25,x,.01,.91,mat.metal);
    box(root,.17,.025,.03,x,-.10,.91,mat.dark,.003);
  }
  box(root,.64,.20,.40,.78,.24,.72,mat.dark,.015);
  box(root,.49,.035,.31,.78,.36,.72,mat.teal,.012);
  for(const x of [.59,.73,.87])cylinder(root,.017,.017,.012,x,.385,.72,mat.orange);
  // Bought turntable sits close to the plywood: no center servo pedestal.
  function bearingPlate(parent,y){
    const shape=new THREE.Shape();shape.moveTo(-.508,-.508);shape.lineTo(.508,-.508);shape.lineTo(.508,.508);shape.lineTo(-.508,.508);shape.closePath();
    const cut=new THREE.Path();cut.absarc(0,0,.270,0,Math.PI*2,true);shape.holes.push(cut);
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.015,bevelEnabled:false}),mat.metal);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
  }
  bearingPlate(root,.15);ring(root,.38,.022,0,.187,0,mat.metal);bearingPlate(yaw,-.04);
  // Thin web deck: corner landings joined by diagonals; no full solid plate.
  function flatBeam(parent,a,b,width,thickness,m){
    const d=b.clone().sub(a),mid=a.clone().add(b).multiplyScalar(.5);
    const mesh=box(parent,d.length(),thickness,width,mid.x,mid.y,mid.z,m,.006);mesh.rotation.y=-Math.atan2(d.z,d.x);return mesh;
  }
  for(const z of [-.62,.62])box(yaw,.80,.07,.23,0,0,z,plastic,.006);
  for(const sign of [-1,1])flatBeam(yaw,new THREE.Vector3(-.37,0,-.62*sign),new THREE.Vector3(.37,0,.62*sign),.12,.07,plastic);
  for(const x of [-.38,.38])box(yaw,.12,.07,1.38,x,0,0,plastic,.005);
  // Two short cutout cheeks, not solid towers. 8 mm concept wall thickness.
  function cheek(z){
    const sh=new THREE.Shape();sh.moveTo(-.4,.035);sh.lineTo(.4,.035);sh.lineTo(.20,1.2);sh.lineTo(-.20,1.2);sh.closePath();
    const window=new THREE.Path();window.moveTo(-.22,.18);window.lineTo(0,.69);window.lineTo(.22,.18);window.closePath();sh.holes.push(window);
    const seat=new THREE.Path();seat.absarc(0,1,.11,0,Math.PI*2,true);sh.holes.push(seat);
    for(const x of [-.28,.28]){const h=new THREE.Path();h.absarc(x,.10,.0225,0,Math.PI*2,true);sh.holes.push(h);}
    const plate=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.08,bevelEnabled:false}),plastic);plate.position.z=z-.04;plate.castShadow=true;plate.receiveShadow=true;yaw.add(plate);
    box(yaw,.85,.08,.28,0,.075,z,plastic,.006);
    for(const x of [-.29,.29]){cylinder(yaw,.025,.025,.13,x,.13,z,mat.metal);cylinder(yaw,.038,.038,.018,x,.20,z,mat.dark,'y',6);}
    // Printed sleeves support separate short pivot bolts on both sides.
    ring(yaw,.082,.026,0,1,z,plastic,'z');
    cylinder(pitch,.04,.04,.25,0,0,z,mat.metal,'z');
    cylinder(pitch,.065,.065,.045,0,0,z+Math.sign(z)*.14,mat.metal,'z',6);
  }
  for(const z of [-.62,.62])cheek(z);
  // Two small padded saddles, tied by light side rails, keep access between them.
  for(const z of [-.50,.50]){
    box(pitch,1.80,.08,.08,0,-.46,z,plastic,.005);
    box(pitch,.22,.48,.08,0,-.23,z,plastic,.005);
  }
  for(const x of [-.65,.65]){
    box(pitch,.18,.07,1.08,x,-.47,0,plastic,.005);
    for(const z of [-.49,.49]){
      box(pitch,.18,.34,.07,x,-.28,z,plastic,.005);
      box(pitch,.18,.06,.13,x,-.40,z,mat.rubber,.005);
    }
    // Straps surround the receiver, away from the centered magazine and jam door.
    box(pitch,.075,.025,.94,x,.43,0,mat.rubber,.004);
    for(const z of [-.46,.46])box(pitch,.075,.90,.025,x,-.015,z,mat.rubber,.004);
  }
  // Core is inverted; camera and range sensor stay upright on the moving cradle.
  const gun=new THREE.Group();gun.rotation.x=Math.PI;pitch.add(gun);
  for(const z of [-.42,.42])box(gun,2.80,.84,.035,-.06,0,z,darkBlue,.025);
  box(gun,2.8,.07,.84,-.06,.385,0,darkBlue,.012);
  box(gun,.58,.65,.82,-1.20,-.015,0,darkBlue,.025); // pusher-side shell retained
  box(gun,.66,.68,.83,1.12,.01,0,mat.orange,.025); // flywheel enclosure retained
  for(const z of [-.20,.20]){cylinder(gun,.21,.21,.09,1.1,-.12,z,mat.dark);cylinder(gun,.10,.10,.19,1.1,.05,z,mat.metal);}
  box(gun,.98,.12,.65,-.32,-.21,0,mat.orange,.01); // feed/pusher bed reference
  box(gun,.24,.06,.20,-.76,-.18,0,mat.ivory,.005);
  cylinder(gun,.15,.15,.32,1.53,-.02,0,mat.orange,'x');cylinder(gun,.105,.105,.025,1.695,-.02,0,mat.dark,'x');
  // Same spring-fed magazine, now above the receiver.
  const magazine=box(gun,.53,1.62,.34,-.20,-.97,0,material('#df9657',.55),.018);
  for(let i=0;i<8;i++)box(gun,.43,.022,.02,-.20,-.26-i*.18,.18,mat.orange,.003);
  box(gun,.61,.08,.40,-.20,-1.80,0,mat.orange,.012);
  box(gun,.56,.025,.52,.15,.44,0,mat.orange,.008); // retained jam door, beneath inverted receiver
  // Shell discarded in this concept, represented by optional, non-operating envelopes.
  const removed=new THREE.Group();gun.add(removed);removed.visible=false;
  const ghostMat=new THREE.LineBasicMaterial({color:'#c77848',transparent:true,opacity:.6,depthWrite:false});
  function ghost(w,h,d,x,y,z){const edges=new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d));const mesh=new THREE.LineSegments(edges,ghostMat);mesh.position.set(x,y,z);removed.add(mesh);}
  ghost(1.5,.66,.58,-2.55,.10,0);ghost(.18,.90,.65,-3.43,.1,0);ghost(1.55,.82,.88,2.48,.04,0);
  ghost(.43,1.12,.43,-1.02,-.89,0);ghost(2.0,.12,.35,-.3,.94,0);
  for(const x of [-1.2,.6])ghost(.16,.44,.35,x,.72,0);
  box(pitch,.30,.05,.18,1.10,.40,.34,plastic,.006);
  box(pitch,.30,.18,.23,1.10,.51,.34,mat.dark,.015);
  cylinder(pitch,.055,.055,.035,1.27,.51,.34,mat.black,'x');
  box(pitch,.08,.11,.24,1.31,.31,.32,mat.teal,.006);
  // Fixed yaw servo: outboard crank/rod avoids lifting the whole bearing stack.
  const yawServo=new THREE.Vector3(1.05,.64,-.90),yawPin=new THREE.Vector3(.25,.39,-.72);
  box(root,.407,.429,.197,.96,.365,-.90,mat.dark,.015).name='compact-fixed-yaw-servo';
  for(const x of [1.19,.72]){
    box(root,.09,.39,.08,x,.34,-.90,plastic,.004);
    box(root,.16,.06,.32,x,.16,-.90,plastic,.004);
    cylinder(root,.022,.022,.03,x,.565,-.90,mat.metal);
  }
  cylinder(root,.06,.06,.09,yawServo.x,.59,yawServo.z,mat.ivory);
  const yawCrank=cylinder(root,.033,.033,1,0,0,0,mat.ivory);
  const yawRod=cylinder(root,.018,.018,1,0,0,0,mat.metal);
  // Raised pin on rear cheek is at the servo horn height, clear of the deck.
  box(yaw,.20,.08,.30,yawPin.x,.33,-.77,plastic,.006);
  box(yaw,.08,.32,.08,yawPin.x,.19,-.88,plastic,.005);
  // External pitch servo drives an arm at the front saddle, around the cheek.
  const pitchServo=new THREE.Vector3(-.30,.55,.85),pitchPin=new THREE.Vector3(.70,-.25,.85);
  box(yaw,.407,.197,.429,-.20,.55,1.115,mat.dark,.015);
  for(const x of [-.48,.02]){
    box(yaw,.08,.78,.06,x,.55,.93,plastic,.004);
    for(const y of [.20,.90])box(yaw,.08,.08,.30,x,y,.78,plastic,.004);
  }
  cylinder(yaw,.06,.06,.10,pitchServo.x,pitchServo.y,.84,mat.ivory,'z');
  box(pitch,.17,.08,.32,.70,-.35,.66,plastic,.004);
  box(pitch,.17,.20,.07,.70,-.29,.78,plastic,.004);
  const pitchCrank=cylinder(yaw,.033,.033,1,0,0,0,mat.ivory),pitchRod=cylinder(yaw,.018,.018,1,0,0,0,mat.metal);
  const joints=[];
  for(const [i,parent]of [root,root,yaw,yaw].entries())joints.push(cylinder(parent,.038,.038,i<2?.04:.12,0,0,0,mat.metal,i<2?'y':'z'));
  ring(pitch,.11,.012,0,0,.72,mat.lime,'z');
  line(pitch,[[-.16,0,.72],[.16,0,.72]],'#789759');line(pitch,[[0,-.16,.72],[0,.16,.72]],'#789759');
  const data={root,yaw,pitch,gun,removed,magazine,closureError:0,reachable:true};
  function rod(mesh,a,b){const d=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=d.length();mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());}
  function solve(a,b,r,l,plane){
    const dx=b.x-a.x,dy=plane==='xz'?b.z-a.z:b.y-a.y,d=Math.hypot(dx,dy),cos=(d*d+r*r-l*l)/(2*d*r);
    if(Math.abs(cos)>1){data.reachable=false;return a.clone();}
    const angle=Math.atan2(dy,dx)-Math.acos(cos);
    return plane==='xz'?new THREE.Vector3(a.x+r*Math.cos(angle),a.y,a.z+r*Math.sin(angle)):new THREE.Vector3(a.x+r*Math.cos(angle),a.y+r*Math.sin(angle),a.z);
  }
  data.update=({yaw:ya,pitch:pi,explode=0,showRemoved=false})=>{
    yaw.rotation.y=-THREE.MathUtils.degToRad(ya);pitch.rotation.z=THREE.MathUtils.degToRad(pi);
    yaw.position.y=.25+explode*.35;pitch.position.y=1+explode*.45;gun.position.y=explode*.35;removed.visible=showRemoved;
    data.reachable=true;
    const by=yawPin.clone().applyAxisAngle(new THREE.Vector3(0,1,0),yaw.rotation.y).add(new THREE.Vector3(0,yaw.position.y,0));
    const cy=solve(yawServo,by,.30,.90,'xz');
    // Yaw rod endpoints lie in one horizontal plane at assembled height.
    rod(yawCrank,yawServo,cy);rod(yawRod,cy,by);joints[0].position.copy(cy);joints[1].position.copy(by);
    const bp=pitchPin.clone().applyAxisAngle(new THREE.Vector3(0,0,1),pitch.rotation.z).add(pitch.position);
    const cp=solve(pitchServo,bp,.24,1.0,'xy');
    rod(pitchCrank,pitchServo,cp);rod(pitchRod,cp,bp);joints[2].position.copy(cp);joints[3].position.copy(bp);joints[2].position.z-=.03;joints[3].position.z-=.03;
    for(const mesh of [yawCrank,yawRod,pitchCrank,pitchRod,...joints])mesh.visible=explode<.015;
    data.closureError=Math.max(Math.abs(cy.distanceTo(by)-.90),Math.abs(cp.distanceTo(bp)-1.0));
  };
  data.update({yaw:0,pitch:0});return data;
}

// Comparable scene-geometry proxy, not filament mass, FEA or optimized CAD.
export function printedVolumeProxy(root,printMaterial){
  let total=0;root.traverse(mesh=>{if(!mesh.isMesh||mesh.material!==printMaterial)return;
    const p=mesh.geometry.getAttribute('position'),idx=mesh.geometry.index;let v=0;
    const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
    const n=idx?idx.count:p.count;
    for(let i=0;i<n;i+=3){a.fromBufferAttribute(p,idx?idx.getX(i):i);b.fromBufferAttribute(p,idx?idx.getX(i+1):i+1);c.fromBufferAttribute(p,idx?idx.getX(i+2):i+2);v+=a.dot(b.cross(c))/6;}
    total+=Math.abs(v*mesh.scale.x*mesh.scale.y*mesh.scale.z);
  });return total*1000; // scene units^3 to cm^3
}

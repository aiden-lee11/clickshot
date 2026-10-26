import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const $ = id => document.getElementById(id);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const rad = THREE.MathUtils.degToRad;
const degrees = value => (Math.abs(value)<.05 ? 0 : value).toFixed(1);
const state = { yaw: 0, pitch: 0, actualYaw: 0, actualPitch: 0, range: 2.5, selected: null, compensation: true, trimApplied: 0, phase: 0, phaseElapsed: 0, paused: false, ready: false, mount: false, mountVariant: 'original', explode: 0, actualExplode: 0, sweep: false, shots: 0, shotTime: -10000, lastTime: -10000 };
const targets = [{ name:'A', yaw:-22, pitch:6, range:2.2 }, { name:'B', yaw:12, pitch:18, range:3.6 }, { name:'C', yaw:26, pitch:-3, range:2.8 }];
let renderer, scene, camera, controls, yawGroup, pitchGroup, cradle, bearingDeck, sightLine, com, yawArc, pitchArc, projectile, lastFrame = 0;
// Mount units: one scene unit = 100 mm. Overall blaster length is source-based;
// local shell shape and mount envelope remain provisional until measured.
const mountSpec={scaleMM:100, blasterLengthMM:685, baseMM:[360,300,12.7], gapMM:140, pivotHeightMM:250, yawHeight:.89, pitchHeight:2.5, muzzleX:3.30, boreY:.31, sensorX:2.62,sensorY:.94};
const viewport = $('viewport');
const parts = {};

function material(color, roughness = .55, metalness = 0) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }
const mat = { orange:material('#ec632b', .34), orangeLight:material('#f57b3c', .4), navy:material('#253747', .48), dark:material('#29372f', .45), black:material('#18231e', .5), ivory:material('#e5e8d6', .55), white:material('#f9faed'), metal:material('#a6b1a2', .3, .7), rubber:material('#455146', .75), wood:material('#cdbb91', .86), print:material('#bbc6a7', .8), lime:material('#c6e682', .4), teal:material('#7b9a83', .5) };
function box(parent, w, h, d, x, y, z, m, radius = .04) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(radius,w/4,h/4,d/4)),m);
  mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function cylinder(parent, r1, r2, h, x, y, z, m, axis='y', segments=48) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),m);
  mesh.position.set(x,y,z); if(axis==='x') mesh.rotation.z=Math.PI/2; if(axis==='z') mesh.rotation.x=Math.PI/2;
  mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function ring(parent,r,t,x,y,z,m,axis='y') {
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,96),m); mesh.position.set(x,y,z);
  if(axis==='y') mesh.rotation.x=Math.PI/2; if(axis==='x') mesh.rotation.y=Math.PI/2;
  parent.add(mesh);return mesh;
}
function line(parent, points, color, opacity=1) {
  const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(mesh);return mesh;
}
function textTexture(text, color='#e9f1dc', background=null) {
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
  if(background){ctx.fillStyle=background;ctx.fillRect(0,0,512,128);}
  ctx.fillStyle=color;ctx.font='bold 51px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67);
  return new THREE.CanvasTexture(c);
}
function decal(parent,text,w,h,x,y,z,color) {
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:textTexture(text,color),transparent:true,depthWrite:false}));
  mesh.position.set(x,y,z); parent.add(mesh);return mesh;
}

function initScene() {
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  renderer.domElement.setAttribute('aria-label','Three-dimensional Clickshot turret with independent yaw and pitch axes');
  viewport.appendChild(renderer.domElement);scene=new THREE.Scene();
  camera=new THREE.OrthographicCamera(-5,5,4,-4,.1,100);camera.position.set(-8,7,12);
  controls=new OrbitControls(camera,renderer.domElement);controls.target.set(2.7,1.9,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minZoom=.65;controls.maxZoom=2;controls.minPolarAngle=.18;controls.maxPolarAngle=Math.PI/2-.04;controls.enablePan=false;controls.update();
  scene.add(new THREE.HemisphereLight('#f6f9e8','#a1ad92',2.6));
  const sun=new THREE.DirectionalLight('#fff6dc',4.1);sun.position.set(-3,9,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.03;sun.shadow.bias=-.0001;sun.shadow.radius=4;scene.add(sun);
  const fill=new THREE.DirectionalLight('#d8e9fb',1.8);fill.position.set(5,4,-4);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:'#697c52',opacity:.19}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.position.y=-.025;scene.add(ground);
  const grid=new THREE.GridHelper(20,40,'#c5cfb8','#d5ddca');grid.position.y=-.02;grid.material.transparent=true;grid.material.opacity=.16;scene.add(grid);
  const assembly=new THREE.Group();scene.add(assembly);parts.assembly=assembly;
  // Proposed 360 x 300 x 12.7 mm plywood base; feet and slots allow table clamps.
  box(assembly,3.6,.127,3.0,0,.12,0,mat.wood,.025);
  for(let i=0;i<4;i++)box(assembly,3.59,.006,2.99,0,.067+i*.028,0,mat.ivory,.001);
  for(const x of [-1.50,1.50])for(const z of [-1.18,1.18]){
    cylinder(assembly,.12,.14,.08,x,.02,z,mat.rubber);
    cylinder(assembly,.04,.04,.02,x,.194,z,mat.metal);
  }
  for(const x of [-1.55,1.55])box(assembly,.08,.012,.35,x,.188,0,mat.dark,.02);
  // Bought 4-inch bearing: 101.6 mm square, ~54 mm center opening.
  // Four printed risers provide room for the 42.9 mm tall yaw servo underneath.
  for(const x of [-.43,.43])for(const z of [-.43,.43]){
    cylinder(assembly,.10,.12,.47,x,.43,z,mat.print);
    cylinder(assembly,.025,.025,.56,x,.43,z,mat.metal);
  }
  function bearingPlate(parent,y){
    const sh=new THREE.Shape();sh.moveTo(-.508,-.508);sh.lineTo(.508,-.508);sh.lineTo(.508,.508);sh.lineTo(-.508,.508);sh.closePath();
    const hole=new THREE.Path();hole.absarc(0,0,.270,0,Math.PI*2,true);sh.holes.push(hole);
    const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.015,bevelEnabled:false}),mat.metal);m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;m.castShadow=true;parent.add(m);
  }
  bearingPlate(assembly,.67);ring(assembly,.38,.025,0,.712,0,mat.metal);ring(assembly,.38,.012,0,.737,0,mat.dark);
  for(const x of [-.43,.43])for(const z of [-.43,.43])cylinder(assembly,.04,.04,.02,x,.69,z,mat.dark);
  box(assembly,.407,.429,.197,0,.414,0,mat.dark,.02);
  box(assembly,.60,.08,.32,0,.22,0,mat.print,.02);
  cylinder(assembly,.075,.075,.07,0,.66,0,mat.ivory);
  // Microcontroller on its own standoffs, visible at the front of the base.
  const micro=box(assembly,.62,.045,.39,-.73,.31,.78,mat.teal,.025);
  box(assembly,.2,.035,.2,-.73,.35,.78,mat.black,.005);
  for(let i=0;i<5;i++) box(assembly,.05,.01,.07,-.97+i*.12,.34,.95,mat.metal,.003);
  box(assembly,.12,.08,.1,-.73,.33,.54,mat.metal,.008);
  for(let i=0;i<3;i++) cylinder(assembly,.015,.015,.012,-.93+i*.08,.36,.69,i===0?mat.lime:mat.orange);
  // The entire yoke rotates about the vertical yaw axis.
  yawGroup=new THREE.Group();yawGroup.position.y=mountSpec.yawHeight;assembly.add(yawGroup);
  bearingDeck=new THREE.Group();yawGroup.add(bearingDeck);
  bearingPlate(bearingDeck,-.14);
  box(bearingDeck,2.2,.12,2.0,0,.02,0,mat.print,.025);
  // Two printable cheek assemblies, each split into bolted flat sections.
  for(const z of [-.76,.76]){
    box(bearingDeck,.56,2.50,.12,-.05,1.28,z,mat.print,.02);
    box(bearingDeck,.92,.12,.40,-.05,.14,z,mat.print,.025);
    box(bearingDeck,.60,.42,.06,-.05,1.30,z+(z>0?.10:-.10),mat.print,.02);
    for(const x of [-.20,.10])for(const y of [1.17,1.43])cylinder(bearingDeck,.035,.035,.03,x,y,z+(z>0?.14:-.14),mat.metal,'z');
    const shape=new THREE.Shape();shape.moveTo(-.45,0);shape.lineTo(.3,0);shape.lineTo(-.05,.85);shape.closePath();
    const gusset=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:false}),mat.print);gusset.position.set(0,.20,z-.05);gusset.castShadow=true;bearingDeck.add(gusset);
    cylinder(bearingDeck,.17,.17,.15,-.05,mountSpec.pitchHeight,z,mat.print,'z');
    cylinder(bearingDeck,.11,.11,.075,-.05,mountSpec.pitchHeight,z+(z>0?.055:-.055),mat.metal,'z');
    cylinder(bearingDeck,.04,.04,.10,-.05,mountSpec.pitchHeight,z+(z>0?.055:-.055),mat.dark,'z');
    for(const x of [-.32,.22])cylinder(bearingDeck,.03,.03,.02,x,.21,z+(z>0?.12:-.12),mat.metal);
    for(let i=0;i<24;i++)box(bearingDeck,.54,.005,.003,-.05,.35+i*.082,z+(z>0?.061:-.061),mat.ivory,.001);
  }
  // Standard positional pitch servo; the horn screws to a printed torque adapter.
  box(bearingDeck,.407,.429,.197,-.05,2.33,1.04,mat.dark,.02);
  box(bearingDeck,.60,.08,.25,-.05,2.20,1.04,mat.print,.02);
  for(const x of [-.29,.19])cylinder(bearingDeck,.025,.025,.035,x,2.20,1.17,mat.metal,'z');
  cylinder(bearingDeck,.06,.06,.08,-.05,2.5,.89,mat.ivory,'z');
  pitchGroup=new THREE.Group();pitchGroup.position.set(-.05,mountSpec.pitchHeight,0);yawGroup.add(pitchGroup);
  // Short M8 side pivots leave the receiver and magazine completely open.
  for(const z of [-.72,.72]){
    cylinder(pitchGroup,.04,.04,.40,0,0,z,mat.metal,'z');
    cylinder(pitchGroup,.065,.065,.055,0,0,z+(z>0?.22:-.22),mat.metal,'z',6);
    cylinder(pitchGroup,.06,.06,.10,0,0,z+(z>0?.10:-.10),mat.metal,'z');
  }
  cylinder(pitchGroup,.16,.16,.055,0,0,.88,mat.print,'z');
  box(pitchGroup,.28,.05,.025,0,0,.93,mat.ivory,.012);
  for(const x of [-.10,.10])cylinder(pitchGroup,.018,.018,.025,x,0,.95,mat.metal,'z');
  cradle=new THREE.Group();pitchGroup.add(cradle);
  for(const z of [-.55,.55]){
    box(cradle,2.20,.12,.13,0,-.38,z,mat.print,.025);
    box(cradle,.38,.46,.13,0,-.12,z,mat.print,.025);
    for(const x of [-.77,.77]){
      box(cradle,.15,.40,.13,x,-.14,z,mat.print,.02);
      box(cradle,.18,.04,.16,x,.08,z,mat.rubber,.01);
      box(cradle,.40,.012,.055,x,-.30,z+(z>0?.075:-.075),mat.dark,.016);
      cylinder(cradle,.025,.025,.02,x,-.29,z+(z>0?.075:-.075),mat.metal);
    }
  }
  for(const x of [-1.02,1.02])box(cradle,.12,.12,1.2,x,-.38,0,mat.print,.02);
  const gun=new THREE.Group();cradle.add(gun);parts.gun=gun;
  // Rapidstrike CS-18 silhouette. 685 mm end-to-end envelope, extended stock.
  box(gun,2.45,.94,.90,-.1,.35,0,mat.navy,.10);
  box(gun,1.65,.13,.93,-.12,.85,0,mat.navy,.025);
  for(const z of [-.46,.46]){
    box(gun,.92,.37,.025,-.70,.43,z,mat.orange,.03);
    box(gun,.87,.52,.025,.39,.21,z,mat.navy,.045);
    for(let i=0;i<4;i++){const v=box(gun,.065,.23,.02,.17+i*.16,.19,z+(z>0?.02:-.02),mat.dark,.01);v.rotation.z=-.5;}
  }
  // Blue ventilated front shroud with the original orange muzzle and battery housing.
  box(gun,1.80,.74,.85,2.0,.38,0,mat.navy,.08);
  box(gun,1.65,.22,.78,1.99,-.08,0,mat.orange,.035);
  box(gun,1.88,.11,.70,2.01,.83,0,mat.orange,.025);
  box(gun,.13,.96,.98,2.98,.35,0,mat.orange,.045);
  cylinder(gun,.18,.18,.30,3.12,.31,0,mat.orange,'x');
  cylinder(gun,.13,.13,.02,3.28,.31,0,mat.dark,'x');
  ring(gun,.16,.022,3.29,.31,0,mat.orangeLight,'x');
  for(const z of [-.44,.44])for(let i=0;i<7;i++)box(gun,.045,.28,.018,1.45+i*.18,.24,z,mat.dark,.006).rotation.z=-.3;
  // Stock, grip and carry handle preserve the uncut blaster's proportions.
  box(gun,1.32,.16,.24,-2.0,.52,0,mat.dark,.025);
  box(gun,1.32,.15,.24,-2.0,.16,0,mat.dark,.025);
  const stock=box(gun,.95,.60,.56,-2.93,.42,0,mat.dark,.045);stock.rotation.z=.07;
  box(gun,.19,.89,.65,-3.46,.23,0,mat.dark,.05);
  box(gun,.12,.67,.56,-3.52,.23,0,mat.orange,.035);
  const grip=box(gun,.45,1.12,.42,-1.04,-.45,0,mat.dark,.055);grip.rotation.z=-.21;
  box(gun,.44,.12,.46,-1.15,-1.0,0,mat.orange,.025);
  box(gun,.68,.09,.08,-.55,-.43,.22,mat.dark,.015);
  box(gun,.09,.38,.08,-.22,-.27,.22,mat.dark,.015);
  box(gun,2.13,.12,.36,-.33,1.40,0,mat.navy,.025);
  for(const x of [-1.29,.63])box(gun,.18,.55,.36,x,1.15,0,mat.navy,.025);
  box(gun,.95,.035,.55,-.12,.96,0,mat.orange,.015); // Jam door stays between the straps.
  for(let i=0;i<9;i++)box(gun,.045,.04,.32,-.85+i*.15,1.49,0,mat.metal,.004);
  // Loaded 18-dart magazine, open space below the cradle.
  box(gun,.59,1.88,.35,.30,-.93,0,material('#dc8943',.4),.025);
  for(let i=0;i<10;i++)box(gun,.45,.025,.025,.30,-.13-i*.17,.19,mat.orange,.005);
  box(gun,.68,.10,.43,.30,-1.88,0,mat.orange,.02);
  for(const x of [-.78,.80]){
    box(gun,.10,.025,.99,x,.86,0,mat.rubber,.006);
    for(const z of [-.49,.49])box(gun,.10,.84,.025,x,.43,z,mat.rubber,.006);
    box(gun,.15,.12,.04,x,.19,.52,mat.dark,.01);
  }
  box(gun,.38,.19,.30,1.65,1.05,0,mat.dark,.025);
  cylinder(gun,.06,.06,.04,1.86,1.05,0,mat.black,'x');
  cylinder(gun,.037,.037,.044,1.864,1.05,0,material('#739e9d',.1,.5),'x');
  box(gun,.07,.16,.28,2.58,.94,0,mat.teal,.008);
  for(const z of [-.075,.075])cylinder(gun,.03,.03,.02,2.625,.94,z,mat.black,'x');
  decal(gun,'RAPIDSTRIKE',.77,.16,-.70,.43,.478,'#4a4535');
  decal(gun,'CS-18',.45,.14,.4,.28,.481,'#dbe5ef');
  // A translucent reference preserves the camera-centered pose during range trim.
  parts.referencePivot=new THREE.Group();parts.referencePivot.position.copy(pitchGroup.position);yawGroup.add(parts.referencePivot);
  parts.referenceGun=gun.clone();parts.referenceGun.traverse(child=>{if(child.isMesh){child.material=new THREE.MeshBasicMaterial({color:'#6b8595',wireframe:true,transparent:true,opacity:.12,depthWrite:false});child.castShadow=false;child.receiveShadow=false;}});
  parts.referencePivot.add(parts.referenceGun);parts.referencePivot.visible=false;
  // Flexible cable service loop follows the rotating structure.
  const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.9,.35,-.43),new THREE.Vector3(-1.1,.05,-.54),new THREE.Vector3(-.8,-.18,-.48),new THREE.Vector3(-.4,.08,-.45)]);
  const cable=new THREE.Mesh(new THREE.TubeGeometry(cableCurve,30,.027,8,false),mat.black);pitchGroup.add(cable);
  // Subtle schematic guides make the two axes legible.
  const yawPoints=[];for(let i=0;i<=70;i++){const a=-1.1+i/70*2.2;yawPoints.push([Math.cos(a)*1.51,.28,Math.sin(a)*1.51]);}
  yawArc=line(assembly,yawPoints,'#df6a39',.7);
  const pitchPoints=[];for(let i=0;i<=45;i++){const a=-.35+i/45*1.05;pitchPoints.push([Math.cos(a)*1.08,Math.sin(a)*1.08,1.27]);}
  pitchArc=line(pitchGroup,pitchPoints,'#718f5c',.65);
  com=new THREE.Group();pitchGroup.add(com);ring(com,.105,.014,0,0,.65,mat.lime,'z');line(com,[[-.18,0,.65],[.18,0,.65]],'#b2da72');line(com,[[0,-.18,.65],[0,.18,.65]],'#b2da72');com.visible=false;
  sightLine=line(scene,[[0,0,0],[1,0,0]],'#df783d',.85);
  buildPlywoodAlternative();
  buildRange();
  projectile=new THREE.Group();cylinder(projectile,.055,.055,.35,0,0,0,mat.teal,'x');cylinder(projectile,.06,.06,.08,.2,0,0,mat.orange,'x');scene.add(projectile);projectile.visible=false;
  const ro=new ResizeObserver(resize);ro.observe(viewport);setView();
}

// Alternative: ordinary plywood cuts and bought bearings, with no tall printed yoke.
function buildPlywoodAlternative(){
  const root=new THREE.Group();scene.add(root);root.visible=false;
  const birch=material('#d5b784',.9),edge=material('#ad8858',.9),plyLight=material('#ead1a5',.9);
  function plywood(parent,w,h,d,x,y,z,vertical=false){
    const board=box(parent,w,h,d,x,y,z,birch,.012);
    // Visible lamination lines and restrained grain communicate ordinary sheet material.
    if(vertical){
      for(let i=1;i<6;i++)box(parent,w+.002,.014,.002,x,y-h/2+i*h/6,z+d/2+.002,edge,.001);
      for(let i=0;i<4;i++)box(parent,.008,h*.90,.002,x-w*.34+i*w*.22,y,z+d/2+.004,plyLight,.001);
    }else{
      for(let i=1;i<5;i++)box(parent,w+.002,.006,d+.002,x,y-h/2+i*h/5,z,i%2?edge:plyLight,.001);
      for(let i=0;i<6;i++)box(parent,w*.96,.002,.008,x,y+h/2+.003,z-d*.38+i*d*.15,edge,.001);
    }
    return board;
  }
  plywood(root,3.6,.127,3,0,.12,0);
  for(const x of [-1.5,1.5])for(const z of [-1.18,1.18])cylinder(root,.12,.14,.08,x,.02,z,mat.rubber);
  // Two table-clamp silhouettes, on the fixed plate rather than moving structure.
  for(const x of [-1.62,1.62]){
    box(root,.24,.05,.55,x,.22,1.26,mat.dark,.012);
    box(root,.07,.34,.12,x,.06,1.49,mat.dark,.008);
    cylinder(root,.025,.025,.32,x,-.01,1.25,mat.metal);
    box(root,.25,.04,.04,x,-.14,1.25,mat.dark,.008);
  }
  // Four sawn wood blocks leave space for a coaxial servo below the turntable.
  for(const x of [-.43,.43])for(const z of [-.43,.43]){
    plywood(root,.22,.47,.22,x,.43,z,true);
    cylinder(root,.025,.025,.56,x,.43,z,mat.metal);
  }
  function turntablePlate(parent,y){
    const shape=new THREE.Shape();shape.moveTo(-.508,-.508);shape.lineTo(.508,-.508);shape.lineTo(.508,.508);shape.lineTo(-.508,.508);shape.closePath();
    const hole=new THREE.Path();hole.absarc(0,0,.270,0,Math.PI*2,true);shape.holes.push(hole);
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.015,bevelEnabled:false}),mat.metal);
    mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
  }
  turntablePlate(root,.68);
  ring(root,.38,.025,0,.714,0,mat.metal);ring(root,.38,.012,0,.74,0,mat.dark);
  box(root,.407,.429,.197,0,.414,0,mat.dark,.02);
  box(root,.60,.07,.31,0,.22,0,mat.print,.012);
  cylinder(root,.07,.07,.10,0,.67,0,mat.ivory);
  cylinder(root,.15,.15,.045,0,.77,0,mat.ivory);
  cylinder(root,.12,.12,.10,0,.80,0,mat.print);
  const yaw=new THREE.Group();yaw.position.y=mountSpec.yawHeight;root.add(yaw);
  plywood(yaw,2.6,.127,2.15,0,.02,0);
  turntablePlate(yaw,-.14);
  // Straight side panels. Bearing bores stay in small, replaceable printed blocks.
  for(const z of [-.865,.865]){
    plywood(yaw,.90,2.70,.127,-.05,1.435,z,true);
    for(const x of [-.36,.25]){
      const outer=z+(z>0?.18:-.18);
      box(yaw,.17,.035,.42,x,.105,outer,mat.metal,.003);
      box(yaw,.17,.35,.035,x,.26,z+(z>0?.09:-.09),mat.metal,.003);
      cylinder(yaw,.03,.03,.02,x,.43,z+(z>0?.12:-.12),mat.dark,'z');
      cylinder(yaw,.03,.03,.02,x,.13,outer,mat.dark);
    }
    box(yaw,.40,.40,.09,-.05,2.5,z+(z>0?.09:-.09),mat.print,.02);
    ring(yaw,.084,.025,-.05,2.5,z+(z>0?.15:-.15),mat.metal,'z');
    for(const x of [-.19,.09])for(const y of [2.36,2.64])cylinder(yaw,.022,.022,.02,x,y,z+(z>0?.145:-.145),mat.dark,'z');
  }
  // Pitch servo is outside the frame; its short crank and rod drive the cradle.
  box(yaw,.68,.06,.45,-.55,1.53,1.10,mat.metal,.008);
  box(yaw,.407,.429,.197,-.55,1.78,1.20,mat.dark,.02);
  box(yaw,.12,.15,.13,-.55,1.95,1.32,mat.ivory,.008);
  const pitch=new THREE.Group();pitch.position.set(-.05,2.5,0);yaw.add(pitch);
  for(const z of [-.79,.79]){
    cylinder(pitch,.04,.04,.49,0,0,z,mat.metal,'z');
    cylinder(pitch,.065,.065,.055,0,0,z+(z>0?.25:-.25),mat.metal,'z',6);
    cylinder(pitch,.06,.06,.06,0,0,z+(z>0?.16:-.16),mat.metal,'z');
  }
  // A ladder cradle leaves the center open for the magazine and the grip.
  const frame=new THREE.Group();pitch.add(frame);
  for(const z of [-.64,.64]){
    plywood(frame,2.6,.127,.16,0,-.38,z);
    plywood(frame,.40,.42,.127,0,-.16,z,true);
    for(const x of [-.80,.80]){
      box(frame,.24,.38,.16,x,-.14,z,mat.print,.014);
      box(frame,.27,.05,.20,x,.07,z,mat.rubber,.01);
      box(frame,.10,.025,1.48,x,-.46,0,mat.rubber,.006);
      box(frame,.10,1.30,.025,x,.19,z>0?.73:-.73,mat.rubber,.006);
    }
  }
  for(const x of [-1.20,1.20])plywood(frame,.14,.127,1.44,x,-.38,0);
  const gun=parts.gun.clone();frame.add(gun);
  // Short lug on the moving side rail: linkage reaches the cradle, never the shell.
  box(pitch,.58,.10,.08,.24,-.20,1.20,mat.print,.012);
  const jointA=new THREE.Vector3(-.55,1.95,1.34);
  const movingLug=new THREE.Vector3(.45,-.20,1.34);
  const crank=cylinder(yaw,.025,.025,1,0,0,0,mat.ivory);
  const rod=cylinder(yaw,.017,.017,1,0,0,0,mat.orange);
  const elbow=cylinder(yaw,.035,.035,.04,0,0,1.34,mat.metal,'z');
  const lug=cylinder(yaw,.035,.035,.04,0,0,1.34,mat.metal,'z');
  const yawGuide=[];for(let i=0;i<=50;i++){const a=-.9+i/50*1.8;yawGuide.push([Math.cos(a)*1.5,.28,Math.sin(a)*1.5]);}
  line(root,yawGuide,'#df6a39',.6);
  const pitchGuide=[];for(let i=0;i<=40;i++){const a=-.30+i/40*.9;pitchGuide.push([Math.cos(a)*.9,Math.sin(a)*.9,1.5]);}
  line(pitch,pitchGuide,'#718f5c',.5);
  const balance=new THREE.Group();pitch.add(balance);ring(balance,.10,.012,0,0,1.10,mat.lime,'z');
  line(balance,[[-.16,0,1.1],[.16,0,1.1]],'#8aa36d');line(balance,[[0,-.16,1.1],[0,.16,1.1]],'#8aa36d');
  parts.plywood={root,yaw,pitch,frame,gun,crank,rod,elbow,lug,jointA,movingLug};
}
function positionRod(mesh,a,b){
  const delta=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);
  mesh.scale.y=delta.length();mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
}
function updatePlywood(){
  const p=parts.plywood,ex=state.actualExplode;
  p.yaw.rotation.y=-rad(state.actualYaw);p.pitch.rotation.z=rad(state.actualPitch);
  p.yaw.position.y=mountSpec.yawHeight+ex*.45;p.pitch.position.y=mountSpec.pitchHeight+ex*.55;p.frame.position.y=ex*.35;
  // In assembly view, solve a planar two-link closure for a fixed-length pushrod.
  // Exploded view intentionally separates joints and is not a drive configuration.
  const b=p.movingLug.clone().applyAxisAngle(new THREE.Vector3(0,0,1),p.pitch.rotation.z).add(p.pitch.position);
  const a=p.jointA,d=Math.hypot(b.x-a.x,b.y-a.y),r=.26,length=1.0;
  const angle=Math.atan2(b.y-a.y,b.x-a.x)+Math.acos(clamp((d*d+r*r-length*length)/(2*d*r),-1,1));
  const c=new THREE.Vector3(a.x+r*Math.cos(angle),a.y+r*Math.sin(angle),a.z);
  positionRod(p.crank,a,c);positionRod(p.rod,c,b);p.elbow.position.copy(c);p.lug.position.copy(b);
}

const pivot = new THREE.Vector3(-.05,mountSpec.yawHeight+mountSpec.pitchHeight,0);
const upAxis=new THREE.Vector3(0,1,0),pitchAxis=new THREE.Vector3(0,0,1);
const targetObjects=[],raycaster=new THREE.Raycaster();
const cameraFocal=470;
function worldDistance(range){return 5.3+range*1.50;}
function pointFor(yaw,pitch,range,bore=.31){
  return new THREE.Vector3(worldDistance(range),bore,0).applyAxisAngle(pitchAxis,rad(pitch)).add(new THREE.Vector3(-.05,mountSpec.pitchHeight,0)).applyAxisAngle(upAxis,-rad(yaw)).add(new THREE.Vector3(0,mountSpec.yawHeight,0));
}
function localPoint(x,y,z){pitchGroup.updateWorldMatrix(true,false);return pitchGroup.localToWorld(new THREE.Vector3(x,y,z));}
function setLine(mesh,start,end){const values=mesh.geometry.attributes.position;values.setXYZ(0,start.x,start.y,start.z);values.setXYZ(1,end.x,end.y,end.z);values.needsUpdate=true;mesh.geometry.computeBoundingSphere();if(mesh.isLine)mesh.computeLineDistances();}
function targetTexture(name){
  const c=document.createElement('canvas');c.width=512;c.height=512;const cx=c.getContext('2d');
  cx.fillStyle='#f0f3e5';cx.fillRect(0,0,512,512);
  for(const [r,color]of[[210,'#8c9f75'],[161,'#e9efdc'],[112,'#8c9f75'],[63,'#e9efdc'],[24,'#e27c47']]){cx.fillStyle=color;cx.beginPath();cx.arc(256,256,r,0,Math.PI*2);cx.fill();}
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function buildRange(){
  parts.rangeRoot=new THREE.Group();scene.add(parts.rangeRoot);
  targets.forEach((t,i)=>{
    const root=new THREE.Group();root.position.copy(pointFor(t.yaw,t.pitch,t.range));parts.rangeRoot.add(root);
    const board=new THREE.Group();board.rotation.set(0,.50,0);root.add(board);
    const plate=cylinder(board,.44,.44,.075,0,0,0,mat.ivory,'x');plate.userData.target=i;
    const surface=new THREE.Mesh(new THREE.CircleGeometry(.405,64),new THREE.MeshBasicMaterial({map:targetTexture(t.name),side:THREE.DoubleSide,toneMapped:false}));surface.rotation.y=-Math.PI/2;surface.position.x=-.043;surface.userData.target=i;board.add(surface);
    const back=surface.clone();back.position.x=.043;board.add(back);
    const halo=ring(board,.50,.022,0,0,0,material('#839e58',.5),'x');halo.visible=false;
    const postHeight=Math.max(root.position.y-.38,.4);
    box(root,.065,postHeight,.065,0,-.38-postHeight/2,0,mat.teal,.008);
    box(root,.90,.045,.55,0,-root.position.y+.04,0,mat.wood,.015);
    for(const z of [-.22,.22])box(root,.60,.09,.06,0,-root.position.y+.08,z,mat.dark,.008);
    targetObjects.push({root,board,plate,surface,halo,basePostHeight:postHeight,label:document.querySelector(`[data-world-target="${i}"]`)});
  });
  parts.desiredLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(1,0,0)]),new THREE.LineDashedMaterial({color:'#82a264',transparent:true,opacity:.55,dashSize:.11,gapSize:.11}));scene.add(parts.desiredLine);
  parts.beforeLine=line(scene,[[0,0,0],[1,0,0]],'#6b8595',.7);parts.beforeLine.visible=false;
  parts.sensorLine=line(scene,[[0,0,0],[1,0,0]],'#629c95',.9);parts.sensorLine.visible=false;
  parts.aimMarker=new THREE.Group();scene.add(parts.aimMarker);ring(parts.aimMarker,.13,.015,0,0,0,mat.orange,'x');parts.aimMarker.add(new THREE.Mesh(new THREE.SphereGeometry(.035,12,12),mat.orange));parts.aimMarker.visible=false;
  parts.pointTarget=new THREE.Group();scene.add(parts.pointTarget);ring(parts.pointTarget,.27,.02,0,0,0,mat.lime,'x');parts.pointTarget.visible=false;
  let down=null;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(state.mount||!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;
    const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
    const hit=raycaster.intersectObjects(targetObjects.flatMap(t=>[t.plate,t.surface]),false)[0];if(hit)pickTarget(hit.object.userData.target);
    down=null;
  });
}
function resize(){
  if(!renderer)return;const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h);
  const aspect=w/h;const vertical=state.mount?(aspect<1?4.8:3.8):Math.max(5.0,8.0/aspect);
  camera.left=-vertical*aspect;camera.right=vertical*aspect;camera.top=vertical;camera.bottom=-vertical;camera.updateProjectionMatrix();
}
function setView(side=false){
  const center=state.mount?new THREE.Vector3(0,2.3,0):new THREE.Vector3(3.3,3.2,.1);
  const direction=state.mount?(side?new THREE.Vector3(0,1.1,12):new THREE.Vector3(7,4.8,8.5)):(side?new THREE.Vector3(-1,3.7,14):new THREE.Vector3(-8,6.5,12));
  controls.target.copy(center);camera.position.copy(center).add(direction);camera.zoom=1;resize();controls.update();
  $('iso-view').classList.toggle('selected',!side);$('side-view').classList.toggle('selected',side);
}
function offset(){return state.mount?0:state.trimApplied;}
function finalPitch(){return clamp(state.pitch+offset(),-15,40);}
function isAligned(){return Math.abs(state.actualYaw-state.yaw)<.22&&Math.abs(state.actualPitch-finalPitch())<.22&&!state.sweep;}
function selectedPoint(){
  if(typeof state.selected==='number')return targetObjects[state.selected].root.position.clone();
  return pointFor(state.command?.yaw??state.yaw,state.command?.pitch??state.pitch,state.range);
}
const phaseCopy={
  0:['Start with a click.','Pick a target in either view. Follow its angles through the system.'],
  1:['1 · Target selected.','The laptop records where you clicked in the camera image.'],
  2:['2 · Calculate yaw and pitch.','Pixel offset from the image center becomes two angle commands.'],
  3:['3 · Send the angles.','The laptop sends yaw and pitch to the microcontroller over USB.'],
  4:['4 · Center the target.','The microcontroller moves both servos. Watch the orange aim marker meet the target.'],
  5:['5 · Read the rangefinder.','Once centered, the microcontroller samples the distance to the target.'],
  6:['6 · Apply range trim.','The microcontroller adds an illustrative pitch offset, then waits for your confirmation.']
};
function showPhase(phase){
  state.phase=phase;state.phaseElapsed=0;state.ready=false;state.paused=false;
  document.body.dataset.phase=String(phase);
  if(phase>=4&&state.command){state.yaw=state.command.yaw;state.pitch=state.command.pitch;}
  state.trimTarget=phase>=6&&state.compensation?(state.range-1)*1.2:0;state.trimApplied=0;
  if(phase===6&&state.command){state.actualYaw=state.command.yaw;state.actualPitch=state.command.pitch;}
  $('mcu-adjustment').hidden=phase!==6;$('replay-trim').hidden=phase!==6;$('trim-caption').hidden=phase!==6||state.mount;
  document.querySelector('.mcu-readouts').hidden=phase===6;
  $('mcu-title').textContent=phase===6?'Microcontroller · range trim':'Microcontroller';
  $('legend-before').textContent=phase===6?'Camera-centered pose':'Selected target';
  $('legend-before').previousElementSibling.className=phase===6?'blue':'green';
  $('legend-after').textContent=phase===6?'Range-adjusted aim':'Current aim';
  if(phase<4){state.yaw=state.selectionPose?.yaw??0;state.pitch=state.selectionPose?.pitch??0;state.actualYaw=state.yaw;state.actualPitch=state.pitch;}
  if(phase===5&&state.command){state.actualYaw=state.command.yaw;state.actualPitch=state.command.pitch;}
  document.querySelectorAll('[data-step]').forEach(b=>{const n=Number(b.dataset.step);b.classList.toggle('current',n===(phase||1));b.classList.toggle('done',n<phase);b.disabled=state.selected===null&&n>1;});
  const [title,detail]=phaseCopy[phase];$('step-title').textContent=title;$('step-detail').textContent=detail;
  $('usb-transfer').classList.toggle('sending',phase===3);
  $('usb-transfer').querySelector('span').textContent=phase===3&&state.command?`USB · ${state.command.yaw.toFixed(0)}° / ${state.command.pitch.toFixed(0)}°`:'USB';
  const messages=['Waiting for the laptop.','Target selected on laptop.','Laptop calculating angles.','Receiving angle packet…','Positioning yaw and pitch servos.','Centered. Sampling rangefinder…',`Range read. Adding +${(state.trimTarget||0).toFixed(1)}° to the pitch.`];
  const badges=['IDLE','WAITING','WAITING','RECEIVING','MOVING','MEASURING','TRIMMING'];
  $('mcu-message').textContent=messages[phase];$('mcu-badge').textContent=badges[phase];$('mcu').classList.toggle('active',phase>=3);
  const laptopMessages=['Click A, B or C to start the walkthrough.','Target located. Measuring image offset…','Converting image offset into yaw and pitch…','Sending yaw + pitch over USB…','Angles sent. Microcontroller is positioning.','The microcontroller now measures distance.','Target handoff complete. Waiting for confirmation.'];
  $('laptop-message').textContent=laptopMessages[phase];
  $('pause').disabled=phase===0;$('pause').textContent='Pause';$('replay').disabled=state.selected===null;
  updateInputs();
}
function pickTarget(index){
  if(state.mount)return;const target=targets[index];
  state.selected=index;state.range=target.range;state.sweep=false;state.trimApplied=0;state.paused=false;
  state.selectionPose={yaw:state.actualYaw,pitch:state.actualPitch};
  state.command={yaw:target.yaw,pitch:target.pitch};
  state.pixelOffset={x:cameraFocal*Math.tan(rad(target.yaw-state.actualYaw)),y:-cameraFocal*Math.tan(rad(target.pitch-state.actualPitch))};
  showPhase(1);
}
function replay(){
  const selected=typeof state.selected==='number'?state.selected:1;
  state.actualYaw=0;state.actualPitch=0;state.yaw=0;state.pitch=0;pickTarget(selected);
}
function updateInputs(){
  $('yaw').value=state.yaw;$('pitch').value=state.pitch;$('range').value=state.range;
  $('yaw-value').textContent=`${Math.round(state.yaw)}°`;$('pitch-value').textContent=`${Math.round(state.pitch)}°`;$('range-value').textContent=`${state.range.toFixed(1)} m`;
  for(const b of document.querySelectorAll('[data-target]'))b.classList.toggle('active',state.selected===Number(b.dataset.target));
  for(const t of targetObjects)t.label.classList.toggle('active',state.selected===t.plate.userData.target);
}
function manual(){
  state.sweep=false;state.selected=null;state.trimApplied=0;state.command=null;state.selectionPose={yaw:state.yaw,pitch:state.pitch};showPhase(0);
  $('laptop-message').textContent='Manual control. Click a target to return to the walkthrough.';
}
function fire(source='button'){
  if(state.mount||state.selected===null||!state.ready||performance.now()-state.shotTime<1200)return;
  state.shots++;state.shotTime=performance.now();state.paused=false;state.shotPending=true;
  $('step-title').textContent=source==='clap'?'Simulated clap confirmed.':'Foam shot confirmed.';
  $('step-detail').textContent='The microcontroller triggers the simulated flywheels and dart pusher.';
  $('mcu-message').textContent='Confirmed input → simulated firing output.';$('mcu-badge').textContent='FIRING';
  if(pitchGroup){
    pitchGroup.updateWorldMatrix(true,false);projectile.position.copy(localPoint(mountSpec.muzzleX,.31,0));projectile.quaternion.copy(pitchGroup.getWorldQuaternion(new THREE.Quaternion()));
    parts.shotOrigin=projectile.position.clone();parts.shotEnd=selectedPoint();projectile.visible=true;
  }
}
function switchMode(mount,variant='original'){
  state.mount=mount;state.mountVariant=variant;state.paused=false;state.actualExplode=0;state.actualYaw=0;state.actualPitch=0;state.sweep=false;state.explode=0;state.selected=null;state.yaw=0;state.pitch=0;state.trimApplied=0;
  $('demo-controls').hidden=mount;$('mount-controls').hidden=!mount;$('mount-labels').hidden=!mount;$('target-labels').hidden=mount;$('walkthrough').hidden=mount;$('mount-footer').hidden=!mount;
  document.querySelector('.world-pane').classList.toggle('mount-mode',mount);
  const alternative=mount&&variant==='plywood';
  for(const [id,active]of [['demo-tab',!mount],['mount-tab',mount&&!alternative],['plywood-tab',alternative]]){$(id).classList.toggle('active',active);$(id).setAttribute('aria-selected',String(active));}
  $('original-mount-summary').hidden=alternative;$('original-mount-notes').hidden=alternative;
  $('plywood-summary').hidden=!alternative;$('plywood-notes').hidden=!alternative;
  document.body.dataset.mountVariant=alternative?'plywood':'original';
  if(parts.plywood){parts.assembly.visible=!alternative;parts.plywood.root.visible=alternative;}
  $('cradle-label').textContent=alternative?'Flat plywood + angle brackets':'140 mm inner gap · proposed';
  $('pivot-label').textContent=alternative?'Bearing-supported pitch pivots':'250 mm pivot height · proposed';
  $('base-label').textContent=alternative?'Bought turntable · yaw':'360 × 300 mm plywood · proposed';
  $('mount-footer').innerHTML=alternative?'<span><i class="wood-dot"></i>Scrap plywood frame</span><span><i class="buy-dot"></i>Bought bearings + brackets</span><span><i class="print-dot"></i>Small printed adapters</span><span>Concept · measure before cutting</span>':'<span><i class="print-dot"></i>Printed PETG parts</span><span><i class="buy-dot"></i>Bought hardware</span><span>Allen keys · screwdriver · drill · 3D printer</span><span>No custom metal machining.</span>';
  $('world-title').textContent=mount?(alternative?'Plywood alternative':'Printed + off-the-shelf'):'Physical system';$('world-subtitle').textContent=mount?(alternative?'Flat cuts. Supported weight. Two axes.':'Supported pivots. Ordinary tools.'):'Same targets. Real movement.';
  $('world-help').textContent=mount?'Drag to inspect · Scroll to zoom':'Drag to orbit · Click a target';
  $('mount-sweep').textContent='↔ Move both axes';$('explode').value=0;$('explode-value').textContent='0%';
  document.querySelector('.laptop-pane').scrollTop=0;if(com)com.visible=mount;showPhase(0);setView();
}
const feed=$('camera-feed'),ctx=feed.getContext('2d');
function drawFeed(){
  const w=feed.width,h=feed.height;ctx.fillStyle='#1d2b20';ctx.fillRect(0,0,w,h);
  ctx.save();ctx.strokeStyle='#314535';ctx.lineWidth=1;
  const ox=-state.actualYaw*6,oy=state.actualPitch*6;
  for(let x=-800;x<1500;x+=90){ctx.beginPath();ctx.moveTo(x+ox,0);ctx.lineTo(x+ox,h);ctx.stroke();}
  for(let y=-600;y<1000;y+=90){ctx.beginPath();ctx.moveTo(0,y+oy);ctx.lineTo(w,y+oy);ctx.stroke();}
  targets.forEach((target,i)=>{
    const x=w/2+cameraFocal*Math.tan(rad(target.yaw-state.actualYaw)),y=h/2-cameraFocal*Math.tan(rad(target.pitch-state.actualPitch));
    if(Math.abs(target.yaw-state.actualYaw)>85||Math.abs(target.pitch-state.actualPitch)>85)return;
    ctx.fillStyle=state.selected===i?'#d7e3b7':'#a7b88c';ctx.fillRect(x-29,y-32,58,64);ctx.fillStyle='#304730';ctx.fillRect(x-22,y-25,44,50);
    ctx.strokeStyle=state.selected===i?'#daeabb':'#99ae7e';ctx.lineWidth=2;for(const r of[19,12,5]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle='#bccca4';ctx.font='20px monospace';ctx.textAlign='center';ctx.fillText(target.name,x,y+57);
    if(state.selected===i){ctx.strokeStyle='#e5f0c6';ctx.strokeRect(x-38,y-41,76,82);}
  });
  ctx.strokeStyle='#d0dfb7';ctx.globalAlpha=.6;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(w/2-13,h/2);ctx.lineTo(w/2+13,h/2);ctx.moveTo(w/2,h/2-13);ctx.lineTo(w/2,h/2+13);ctx.stroke();
  if(state.phase>=1&&state.phase<=3&&state.pixelOffset){
    const tx=w/2+state.pixelOffset.x,ty=h/2+state.pixelOffset.y;
    ctx.strokeStyle='#eab38a';ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(w/2,h/2);ctx.lineTo(tx,h/2);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
  }
  ctx.globalAlpha=.05;ctx.fillStyle='#d1e9b2';for(let y=0;y<h;y+=4)ctx.fillRect(0,y,w,1);ctx.restore();
}
feed.addEventListener('click',e=>{
  const rect=feed.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*feed.width,y=(e.clientY-rect.top)/rect.height*feed.height;
  const yaw=state.actualYaw+THREE.MathUtils.radToDeg(Math.atan((x-feed.width/2)/cameraFocal));
  const pitch=state.actualPitch-THREE.MathUtils.radToDeg(Math.atan((y-feed.height/2)/cameraFocal));
  let nearest=-1,distance=Infinity;targets.forEach((t,i)=>{const d=Math.hypot(t.yaw-yaw,t.pitch-pitch);if(d<distance){distance=d;nearest=i;}});
  if(distance<8){pickTarget(nearest);return;}
  state.selected='point';state.selectionPose={yaw:state.actualYaw,pitch:state.actualPitch};state.command={yaw:clamp(yaw,-60,60),pitch:clamp(pitch,-15,40)};
  state.pixelOffset={x:x-feed.width/2,y:y-feed.height/2};state.trimApplied=0;showPhase(1);
});
for(const button of document.querySelectorAll('[data-target]'))button.addEventListener('click',()=>pickTarget(Number(button.dataset.target)));
for(const button of document.querySelectorAll('[data-world-target]'))button.addEventListener('click',()=>pickTarget(Number(button.dataset.worldTarget)));
$('yaw').addEventListener('input',e=>{state.yaw=Number(e.target.value);manual();});$('pitch').addEventListener('input',e=>{state.pitch=Number(e.target.value);manual();});
$('range').addEventListener('input',e=>{
  state.range=Number(e.target.value);
  if(typeof state.selected==='number'){
    const t=targets[state.selected];t.range=state.range;const object=targetObjects[state.selected];const nextPoint=pointFor(t.yaw,t.pitch,t.range);
    const shift=nextPoint.clone().sub(object.root.position);object.root.position.copy(nextPoint);object.label.querySelector('span').textContent=`${state.range.toFixed(1)} m`;
    // The board moves in depth; its existing stand is resized to keep its feet on the ground.
    const post=object.root.children[1];post.scale.y=(nextPoint.y-.38)/object.basePostHeight;post.position.y=-.38-(nextPoint.y-.38)/2;
    for(const foot of object.root.children.slice(2))foot.position.y-=shift.y;
  }
  if(state.phase>=6)showPhase(6);updateInputs();
});
$('compensation').addEventListener('change',e=>{state.compensation=e.target.checked;if(state.phase>=6)showPhase(6);updateInputs();});
$('fire').addEventListener('click',()=>fire());$('clap').addEventListener('click',()=>fire('clap'));
$('replay-trim').addEventListener('click',()=>{if(state.selected!==null)showPhase(6);});
$('open-plywood-parts').addEventListener('click',()=>$('plywood-parts-dialog').showModal());
$('close-plywood-parts').addEventListener('click',()=>$('plywood-parts-dialog').close());
$('plywood-parts-dialog').addEventListener('click',e=>{if(e.target===$('plywood-parts-dialog'))$('plywood-parts-dialog').close();});
$('open-parts').addEventListener('click',()=>$('parts-dialog').showModal());
$('close-parts').addEventListener('click',()=>$('parts-dialog').close());
$('parts-dialog').addEventListener('click',e=>{if(e.target===$('parts-dialog'))$('parts-dialog').close();});
$('play-demo').addEventListener('click',()=>{state.actualYaw=0;state.actualPitch=0;pickTarget(1);});$('replay').addEventListener('click',replay);
$('pause').addEventListener('click',()=>{state.paused=!state.paused;$('pause').textContent=state.paused?'Resume':'Pause';});
for(const button of document.querySelectorAll('[data-step]'))button.addEventListener('click',()=>{
  const n=Number(button.dataset.step);if(state.selected===null){if(n===1)pickTarget(1);return;}showPhase(n);
});
$('demo-tab').addEventListener('click',()=>switchMode(false));$('mount-tab').addEventListener('click',()=>switchMode(true));$('plywood-tab').addEventListener('click',()=>switchMode(true,'plywood'));
for(const axis of ['yaw','pitch'])$('plywood-'+axis).addEventListener('input',e=>{state.sweep=false;state[axis]=Number(e.target.value);$('mount-sweep').textContent='↔ Move both axes';});
$('iso-view').addEventListener('click',()=>setView());$('side-view').addEventListener('click',()=>setView(true));
$('home').addEventListener('click',()=>{state.yaw=0;state.pitch=0;state.selected=null;state.sweep=false;state.explode=0;state.trimApplied=0;state.command=null;state.selectionPose={yaw:0,pitch:0};$('explode').value=0;$('explode-value').textContent='0%';$('mount-sweep').textContent='↔ Move both axes';showPhase(0);setView();});
$('explode').addEventListener('input',e=>{state.explode=Number(e.target.value)/100;$('explode-value').textContent=`${e.target.value}%`;});
$('mount-sweep').addEventListener('click',()=>{state.sweep=!state.sweep;$('mount-sweep').textContent=state.sweep?'Ⅱ Pause motion':'↔ Move both axes';});
// Keyboard access keeps the whole presentation usable without a mouse.
feed.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();pickTarget(1);}});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','BUTTON','SUMMARY'].includes(document.activeElement.tagName)){e.preventDefault();fire();}});
document.querySelector('.tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const ids=['demo-tab','mount-tab','plywood-tab'];const current=state.mount?(state.mountVariant==='plywood'?2:1):0;const next=(current+(e.key==='ArrowRight'?1:2))%3;switchMode(next!==0,next===2?'plywood':'original');$(ids[next]).focus();}});
function sequence(dt){
  if(state.mount||state.paused||state.phase===0)return;
  state.phaseElapsed+=dt;const t=state.phaseElapsed;
  if(state.phase===6){const u=clamp(t/3.2,0,1);state.trimApplied=(state.trimTarget||0)*u*u*(3-2*u);}
  if(state.phase===1&&t>.8)showPhase(2);
  else if(state.phase===2&&t>1.9)showPhase(3);
  else if(state.phase===3&&t>1.5)showPhase(4);
  else if(state.phase===4&&t>1.7&&isAligned())showPhase(5);
  else if(state.phase===5&&t>1.8)showPhase(6);
  else if(state.phase===6&&t>4.2&&isAligned()&&!state.ready){
    state.ready=true;$('step-title').textContent='Ready. You confirm the shot.';
    $('step-detail').textContent=`Range ${state.range.toFixed(1)} m → illustrative trim +${state.trimApplied.toFixed(1)}°. Button or simulated clap to confirm.`;
    $('mcu-message').textContent=`Range ${state.range.toFixed(1)} m · awaiting confirmation.`;$('mcu-badge').textContent='READY';
  }
}
function updateProjectedLabel(element,position,offsetX=0,offsetY=0){
  const p=position.clone().project(camera),w=viewport.clientWidth;
  const left=(p.x*.5+.5)*w+offsetX;
  element.style.left=`${offsetX?clamp(left,element.offsetWidth/2+10,w-element.offsetWidth/2-10):left}px`;
  element.style.top=`${(-p.y*.5+.5)*viewport.clientHeight+offsetY}px`;element.style.visibility=p.z>1||p.z< -1?'hidden':'visible';
}
function animate(now){
  requestAnimationFrame(animate);const dt=Math.min((now-lastFrame)/1000||.016,.1);lastFrame=now;
  sequence(dt);const smooth=state.paused?0:1-Math.exp(-dt*3.3);
  if(state.sweep){const alternative=state.mountVariant==='plywood';state.yaw=Math.sin(now*.0005)*(alternative?28:34);state.pitch=alternative?10+Math.sin(now*.0008)*14:9+Math.sin(now*.0008)*14;updateInputs();}
  if(state.mount&&state.mountVariant==='plywood'){for(const axis of ['yaw','pitch']){$('plywood-'+axis).value=state[axis];$('plywood-'+axis+'-value').textContent=`${degrees(state['actual'+axis[0].toUpperCase()+axis.slice(1)])}°`;}}
  state.actualYaw+=(state.yaw-state.actualYaw)*smooth;state.actualPitch+=(finalPitch()-state.actualPitch)*smooth;state.actualExplode+=(state.explode-state.actualExplode)*smooth;
  const aligned=isAligned(),firing=now-state.shotTime<1100;
  if(state.shotPending&&!firing){state.shotPending=false;if(!state.mount&&state.phase===6){$('mcu-badge').textContent='READY';$('mcu-message').textContent='Simulated shot complete. Waiting for another confirmation.';$('step-title').textContent='Foam shot complete.';$('step-detail').textContent='Choose another target, replay the steps, or confirm another simulated shot.';}}
  $('live-yaw').textContent=`${degrees(state.actualYaw)}°`;$('live-pitch').textContent=`${degrees(state.actualPitch)}°`;
  $('live-range').textContent=state.phase>=6?`${state.range.toFixed(1)}m`:state.phase===5&&state.phaseElapsed>1?`${state.range.toFixed(1)}m`:'—';
  $('fire').disabled=state.mount||!state.ready||!aligned||firing;$('clap').disabled=$('fire').disabled;
  $('scene-state').textContent=state.mount?'ASSEMBLY CONCEPT':firing?'SIMULATED SHOT':state.paused?'PAUSED':state.ready?'READY TO CONFIRM':['PICK A TARGET','TARGET SELECTED','CALCULATING','USB TRANSFER','CENTERING','READING RANGE','APPLYING TRIM'][state.phase];
  const calc=state.phase===2?clamp(state.phaseElapsed/1.25,0,1):state.phase>2?1:0;
  $('delta-x').textContent=state.phase>=1&&state.pixelOffset?String(Math.round(state.pixelOffset.x)):'—';$('delta-y').textContent=state.phase>=1&&state.pixelOffset?String(Math.round(state.pixelOffset.y)):'—';
  $('computed-yaw').textContent=state.phase>=2&&state.command?`${(state.command.yaw*calc).toFixed(1)}°`:'—';$('computed-pitch').textContent=state.phase>=2&&state.command?`${(state.command.pitch*calc).toFixed(1)}°`:'—';
  $('before-pitch').textContent=state.command?`${state.command.pitch.toFixed(1)}°`:'—';
  $('trim-value').textContent=`+${(state.trimTarget||0).toFixed(1)}°`;
  $('after-pitch').textContent=`${degrees(state.actualPitch)}°`;
  $('trim-angle').textContent=`↑ +${(state.trimTarget||0).toFixed(1)}° pitch`;
  $('trim-progress').style.width=`${clamp(state.phaseElapsed/3.2,0,1)*100}%`;
  drawFeed();
  if(renderer){
    yawGroup.rotation.y=-rad(state.actualYaw);pitchGroup.rotation.z=rad(state.actualPitch);
    const ex=state.actualExplode;yawGroup.position.y=mountSpec.yawHeight+ex*.45;pitchGroup.position.y=mountSpec.pitchHeight+ex*.55;cradle.position.y=ex*.35;
    yawArc.visible=state.mount;pitchArc.visible=state.mount;parts.rangeRoot.visible=!state.mount;
    const hasTarget=state.selected!==null&&!state.mount;
    const d=worldDistance(state.range),currentAim=localPoint(d,.31,0),muzzle=localPoint(mountSpec.muzzleX,.31,0);
    sightLine.visible=!state.mount;setLine(sightLine,muzzle,currentAim);
    parts.aimMarker.visible=!state.mount;parts.aimMarker.position.copy(currentAim);parts.aimMarker.quaternion.copy(pitchGroup.getWorldQuaternion(new THREE.Quaternion()));
    parts.referencePivot.visible=!state.mount&&state.phase===6;
    parts.referencePivot.position.copy(pitchGroup.position);parts.referencePivot.rotation.z=rad(state.command?.pitch||0);
    parts.beforeLine.visible=!state.mount&&state.phase===6&&hasTarget;
    if(parts.beforeLine.visible){parts.referencePivot.updateWorldMatrix(true,false);const start=parts.referencePivot.localToWorld(new THREE.Vector3(mountSpec.muzzleX,.31,0));setLine(parts.beforeLine,start,selectedPoint());}
    if(!state.mount&&state.phase===6)updateProjectedLabel($('trim-caption'),localPoint(2.7,1.4,0));
    parts.desiredLine.visible=hasTarget&&state.phase!==6;parts.sensorLine.visible=hasTarget&&state.phase===5;
    if(hasTarget){const target=selectedPoint();setLine(parts.desiredLine,muzzle,target);setLine(parts.sensorLine,localPoint(mountSpec.sensorX,mountSpec.sensorY,0),target);}
    parts.pointTarget.visible=state.selected==='point';if(parts.pointTarget.visible)parts.pointTarget.position.copy(selectedPoint());
    for(const [i,target]of targetObjects.entries()){
      target.halo.visible=state.selected===i;
      const hit=firing&&state.selected===i&&now-state.shotTime>620;
      target.halo.scale.setScalar(hit?1.15:1);
      updateProjectedLabel(target.label,target.root.position.clone().add(new THREE.Vector3(0,.74,0)));
    }
    if(state.mount&&state.mountVariant==='plywood'){
      updatePlywood();const p=parts.plywood;p.root.updateWorldMatrix(true,true);
      const spread=Math.min(viewport.clientWidth/1000,1);
      updateProjectedLabel($('cradle-label'),p.yaw.localToWorld(new THREE.Vector3(-1.5,1.3,-1.3)),-200*spread,0);
      updateProjectedLabel($('pivot-label'),p.yaw.localToWorld(new THREE.Vector3(.4,2.6,1.6)),195*spread,60);
      updateProjectedLabel($('base-label'),new THREE.Vector3(.45,.3,1.85),1,32);
    }else if(state.mount){
      updateProjectedLabel($('cradle-label'),localPoint(-2.3,-.2,1.4));
      updateProjectedLabel($('pivot-label'),new THREE.Vector3(.45,yawGroup.position.y+mountSpec.pitchHeight,1.8).applyAxisAngle(upAxis,yawGroup.rotation.y));
      updateProjectedLabel($('base-label'),new THREE.Vector3(.4,.12,1.7));
    }
    if(projectile.visible){
      const elapsed=(now-state.shotTime)/1000,u=clamp(elapsed/.78,0,1);projectile.position.lerpVectors(parts.shotOrigin,parts.shotEnd,u);projectile.position.y+=Math.sin(u*Math.PI)*.25;
      if(elapsed>.8)projectile.visible=false;
    }
    if(firing)parts.gun.position.x=-.035*Math.exp(-(now-state.shotTime)/90);else parts.gun.position.x=0;
    controls.update();renderer.render(scene,camera);
  }
}
try{initScene();}catch(e){$('scene-error').hidden=false;console.error('Unable to initialize 3D scene:',e);}
showPhase(0);updateInputs();document.querySelector('.laptop-pane').scrollTop=0;requestAnimationFrame(animate);
window.clickshot={mountSpec,getState:()=>({...state,aligned:isAligned(),finalPitch:finalPitch(),webgl:!!renderer}),targets};

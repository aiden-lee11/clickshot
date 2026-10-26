#!/usr/bin/env python3
"""Parametric Clickshot fit draft, millimeters. Read README.md before printing."""
from pathlib import Path
import argparse,csv,json,math,zipfile
import cadquery as cq
import trimesh
HERE=Path(__file__).resolve().parent
P=json.loads((HERE/'parameters.json').read_text()); OUT=HERE/'generated'
PARTS={};ITEMS=[];DATUMS={}

def block(x0,x1,y0,y1,z0,z1):
 return cq.Workplane('XY').box(x1-x0,y1-y0,z1-z0).translate(((x0+x1)/2,(y0+y1)/2,(z0+z1)/2))
def cyl(r,a,b):
 v=cq.Vector(*b).sub(cq.Vector(*a));return cq.Workplane(obj=cq.Solid.makeCylinder(r,v.Length,cq.Vector(*a),v.normalized()))
def hz(s,x,y,z0,z1,d):return s.cut(cyl(d/2,(x,y,z0),(x,y,z1)))
def hy(s,x,z,y0,y1,d):return s.cut(cyl(d/2,(x,y0,z),(x,y1,z)))
def slot(s,x,y,z0,z1,travel,d,angle=0):
 return s.cut(cq.Workplane('XY').slot2D(travel+d,d,angle).extrude(z1-z0).translate((x,y,z0)))
def register(name,s,qty,description,orientation=None,optional=False):
 s=s.clean()
 if len(s.solids().vals())!=1 or not s.val().isValid():raise RuntimeError(f'{name}: expected one valid solid')
 PARTS[name]=dict(shape=s,quantity=qty,description=description,orientation=orientation,optional=optional);return s
def place(name,s,xyz=(0,0,0),rot=None,kind='print',motion='yaw',part=None):
 if rot:s=s.rotate(*rot)
 ITEMS.append(dict(name=name,shape=s.translate(xyz),kind=kind,motion=motion,part=part))
def printed(name,xyz=(0,0,0),rot=None,motion='yaw',suffix=''):
 place(name+('_'+suffix if suffix else ''),PARTS[name]['shape'],xyz,rot,motion=motion,part=name)
def pitch_point(x,z,degrees):
 a=math.radians(degrees);return x*math.cos(a)-z*math.sin(a),x*math.sin(a)+z*math.cos(a)
def linkage(degrees):
 tx,tz=pitch_point(P['drive_pin_x'],P['drive_pin_z'],degrees);sx,sz=P['pitch_servo_x'],P['pitch_servo_z']
 dx,dz=tx-sx,tz-sz;d=math.hypot(dx,dz);r,rod=P['servo_crank_radius'],P['pushrod_pin_distance']
 c=(d*d+r*r-rod*rod)/(2*d*r)
 if not -1<c<1:raise RuntimeError(f'Pitch {degrees}: linkage cannot close without toggle')
 a=math.atan2(dz,dx)-math.acos(c)
 return dict(alpha_deg=math.degrees(a),crank=(sx+r*math.cos(a),sz+r*math.sin(a)),target=(tx,tz))

def build():
 m4,m3=P['m4_clearance'],P['m3_clearance'];t,g=P['cheek_thickness'],P['clear_gap'];cy=g/2+t/2
 split,pivot=P['cheek_split_height'],P['pivot_height'];bt=P['base_thickness'];pb=bt+P['yaw_post_height']
 bb=pb+P['bearing_platform_thickness'];db=bb+P['turntable_thickness'];dt=db+P['deck_thickness'];pz=dt+pivot
 DATUMS.update(deck_top=dt,pivot_z=pz,pitch_axis=[0,0,pz],yaw_axis=[0,0,0])
 # Turntable mounting faces are blank: transfer-drill the actual purchased pattern.
 # The supplier's 3-inch bearing circle is NOT a mounting-hole pitch.
 for side,name in [(-1,'yaw_deck_left'),(1,'yaw_deck_right')]:
  lo,hi=(-P['deck_length']/2,-.15) if side<0 else (.15,P['deck_length']/2)
  s=hz(block(lo,hi,-P['deck_width']/2,P['deck_width']/2,0,P['deck_thickness']),0,0,-1,11,24)
  for yy in [-cy,cy]:
   for x in [-42,42]:
    for y in [yy-15,yy+15]:s=hz(s,x,y,-1,11,m4)
  for y in [-80,80]:
   for x in [-18,18]:s=hz(s,x,y,-1,11,m4)
  for x in [-17,17]:
   for y in [-10,10]:s=hz(s,x,y,-1,11,m4)
  register(name,s,1,'Half deck. Transfer-drill actual turntable pattern, clear of race and fasteners.');printed(name,(0,0,db))
 s=block(-35,35,-10,10,0,6)
 for x in [-18,18]:s=hz(s,x,0,-1,7,m4)
 register('deck_joiner',s,2,'Under-deck splice; M4 through-bolts.')
 for i,y in enumerate([-80,80]):printed('deck_joiner',(0,y,db-6),suffix=str(i))
 s=hz(block(-70,70,-70,70,0,P['bearing_platform_thickness']),0,0,-1,P['bearing_platform_thickness']+1,P['turntable_opening'])
 for x in [-60,60]:
  for y in [-60,60]:s=hz(s,x,y,-1,9,m4)
 register('bearing_platform',s,1,'Fixed lower turntable plate. Transfer-drill bearing pattern before assembly.');printed('bearing_platform',(0,0,pb),motion='fixed')
 s=hz(cyl(8,(0,0,0),(0,0,P['yaw_post_height'])),0,0,-1,P['yaw_post_height']+1,m4)
 register('yaw_post',s,4,'Fixed platform support; long M4 through-bolt into plywood.')
 for i,(x,y) in enumerate(( (x,y) for x in [-60,60] for y in [-60,60] )):printed('yaw_post',(x,y,bt),motion='fixed',suffix=str(i))
 lower=block(-40,40,-t/2,t/2,0,split).union(block(-50,50,-24,24,0,12))
 for x in [-42,42]:
  for y in [-15,15]:lower=hz(lower,x,y,-1,13,m4)
 for x in [-22,22]:lower=hy(lower,x,split-20,-t/2-1,t/2+1,m4)
 for x in [-32,22]:
  for sign in [-1,1]:lower=lower.union(cq.Workplane('YZ').polyline([(sign*5,10),(sign*23,10),(sign*5,68)]).close().extrude(10).translate((x,0,0)))
 register('lower_cheek',lower,2,'Gusseted foot and lower upright. Print on foot; M4 through-bolts.')
 upper=hy(block(-40,40,-t/2,t/2,split,pivot+24),0,pivot,-t/2-1,t/2+1,P['cheek_spacer_passage'])
 sd=P['bearing_width']+P['seat_axial_allowance']
 upper=upper.cut(cyl(P['bearing_seat_diameter']/2,(0,t/2-sd,pivot),(0,t/2+1,pivot)))
 for x in [-22,22]:upper=hy(upper,x,split+20,-t/2-1,t/2+1,m4)
 for x in [-16,16]:
  for z in [pivot-16,pivot+16]:upper=hy(upper,x,z,-t/2-1,t/2+1,m3)
 for x in [-32,32]:
  for z in [pivot+P['pitch_servo_z']-36,pivot+P['pitch_servo_z']+18]:upper=hy(upper,x,z,-t/2-1,t/2+1,m4)
 register('upper_cheek',upper,2,'Outward-facing bearing/sleeve pocket. Print flat with pocket up.',90)
 s=block(-32,32,0,6,split-35,split+35)
 for x in [-22,22]:
  for z in [split-20,split+20]:s=hy(s,x,z,-1,7,m4)
 register('cheek_splice',s,4,'Two splice plates per cheek, one per face.',90)
 s=hy(block(-20,20,0,4,-20,20),0,0,-1,5,18)
 for x in [-16,16]:
  for z in [-16,16]:s=hy(s,x,z,-1,5,m3)
 register('bearing_retainer',s,2,'Outer-ring capture, 18 mm relief clears nominal 16 mm pivot washers.',-90)
 s=hz(cyl(P['sleeve_od']/2,(0,0,0),(0,0,P['bearing_width'])),0,0,-1,8,P['sleeve_bore'])
 register('optional_pitch_sleeve',s,2,'Replaces each 608 bearing; fit-test friction/wear. Do not install both.',optional=True)
 bi=cy+t/2-sd;eo=bi-P['pivot_spacer_length'];ry=eo-P['ear_thickness']-P['rail_width']/2
 rt=-P['rail_top_below_pivot'];rb=rt-P['rail_height'];DATUMS.update(rail_y=ry,ear_outer=eo,bearing_inner=bi)
 s=block(-P['cradle_length']/2,P['cradle_length']/2,-P['rail_width']/2,P['rail_width']/2,rb,rt)
 for x in [-90,90]:s=hz(s,x,0,rb-1,rt+1,m4)
 for x in [-15,15]:s=hy(s,x,(rb+rt)/2,-9,9,m4)
 for x in [-P['saddle_spacing']/2,P['saddle_spacing']/2]:s=slot(s,x,0,rb-1,rt+1,18,m4)
 register('cradle_rail',s,2,'200 mm rail. Slots adjust padded saddles along the blaster.')
 s=block(-8,8,-ry-8,ry+8,rb-8,rb)
 for y in [-ry,ry]:s=hz(s,0,y,rb-9,rb+1,m4)
 register('rear_crossmember',s,1,'Rear crossmember below rails; M4 through-bolts.')
 s=block(-8,8,-ry-8,P['drive_tower_outer_y'],rb-8,rb)
 s=s.union(block(-8,8,P['drive_tower_outer_y']-6,P['drive_tower_outer_y'],rb,P['drive_pin_z']+10))
 for y in [-ry,ry]:s=hz(s,0,y,rb-9,rb+1,m4)
 s=hy(s,0,P['drive_pin_z'],P['drive_tower_outer_y']-7,P['drive_tower_outer_y']+1,m3)
 register('front_drive_crossmember',s,1,'Front crossmember and outboard pitch-drive arm; M3 pin. Print on flat crossmember bottom.')
 s=hy(block(-25,25,0,P['ear_thickness'],rb,24),0,0,-1,P['ear_thickness']+1,P['pivot_passage'])
 for x in [-15,15]:s=hy(s,x,(rb+rt)/2,-1,P['ear_thickness']+1,m4)
 register('cradle_pivot_ear',s,2,'Bolts outside rail. M8 pivot clamps to this rotating ear.',90)
 s=hz(block(-18,18,-12,12,0,P['saddle_height']),0,0,-1,P['saddle_height']+1,m4)
 s=s.cut(cyl(4.5,(0,0,P['saddle_height']-5),(0,0,P['saddle_height']+1)))
 for x in [-12,12]:s=s.cut(block(x-2,x+2,-13,13,6,17))
 register('saddle_block',s,4,'Flat contact + 3 mm soft pad. Strap slots. Measure shell before fitting.')
 # Bought horns engage servo splines. No printed spline teeth.
 s=hz(cyl(25,(0,0,0),(0,0,6)),0,0,-1,7,12)
 for a in [0,90,180,270]:
  th=math.radians(a);s=slot(s,11.5*math.cos(th),11.5*math.sin(th),-1,7,7,P['horn_screw_clearance'],a)
 for x in [-17,17]:
  for y in [-10,10]:s=hz(s,x,y,-1,7,m4)
 register('yaw_horn_adapter',s,1,'50 mm disc, four deck bolts, radial slots for bought horn.');printed('yaw_horn_adapter',(0,0,db-6))
 s=hz(cyl(16,(0,0,0),(0,0,4)).union(block(0,26,-6,6,0,4)),0,0,-1,5,12)
 for x in [-11.5,11.5]:s=slot(s,x,0,-1,5,5,P['horn_screw_clearance'],90)
 s=hz(s,P['servo_crank_radius'],0,-1,5,m3)
 register('pitch_crank_adapter',s,1,'Bolts to supplied horn; 20 mm M3 linkage pin radius. Central spline-screw access.')
 s=block(-42,42,-24,24,0,6);off=P['servo_output_offset'];bl=P['servo_body_length']+P['servo_body_clearance'];bw=P['servo_body_width']+P['servo_body_clearance']
 s=s.cut(block(off-bl/2,off+bl/2,-bw/2,bw/2,-1,7))
 for x in [off-P['servo_tab_pitch']/2,off+P['servo_tab_pitch']/2]:
  for y in [-P['servo_tab_row_pitch']/2,P['servo_tab_row_pitch']/2]:s=slot(s,x,y,-1,7,4,m3,90)
 for x in [-32,32]:
  for y in [-18,18]:s=hz(s,x,y,-1,7,m4)
 register('servo_carrier',s,1,'Yaw template: measure servo tabs, shaft offset and flange-to-horn datums before print.')
 pitch_carrier=s.union(block(-42,42,-44,-24,0,6))
 for x in [-32,32]:pitch_carrier=hz(pitch_carrier,x,-36,-1,7,m4)
 register('pitch_servo_carrier',pitch_carrier,1,'Pitch carrier: use lower -36 mm row and upper +18 mm row for posts. Middle row is unused, preserving the yaw template.')
 yf=db-P['yaw_horn_adapter_thickness']-P['yaw_tab_to_horn'];ys=yf-6-bt
 for name,h in [('yaw_servo_post',ys),('pitch_servo_post',P['pitch_servo_post_length'])]:
  s=hz(cyl(6.5,(0,0,0),(0,0,h)),0,0,-1,h+1,m4);register(name,s,4,'M4 through-bolted standoff; length depends on servo/horn datums.')
 printed('servo_carrier',(0,0,yf-6),motion='fixed',suffix='yaw')
 for i,(x,y) in enumerate(( (x,y) for x in [-32,32] for y in [-18,18] )):printed('yaw_servo_post',(x,y,bt),motion='fixed',suffix=str(i))
 cf=cy+t/2+P['pitch_servo_post_length'];cb=cf+6
 printed('pitch_servo_carrier',(P['pitch_servo_x'],cb,pz+P['pitch_servo_z']),((0,0,0),(1,0,0),90),suffix='pitch')
 for i,(x,z) in enumerate(( (x,z) for x in [-32,32] for z in [-36,18] )):printed('pitch_servo_post',(x+P['pitch_servo_x'],cy+t/2,pz+P['pitch_servo_z']+z),((0,0,0),(1,0,0),-90),suffix=str(i))
 for side in [-1,1]:
  rot=((0,0,0),(0,0,1),180) if side<0 else None
  printed('lower_cheek',(0,side*cy,dt),rot,suffix=str(side));printed('upper_cheek',(0,side*cy,dt),rot,suffix=str(side))
  for face in [-1,1]:printed('cheek_splice',(0,side*cy+(t/2 if face>0 else -t/2-6),dt),suffix=f'{side}_{face}')
  printed('bearing_retainer',(0,side*(cy+t/2),pz),rot,suffix=str(side))
  printed('cradle_rail',(0,side*ry,pz),motion='pitch',suffix=str(side))
  printed('cradle_pivot_ear',(0,side*(eo-P['ear_thickness']),pz),rot,motion='pitch',suffix=str(side))
  for i,x in enumerate([-P['saddle_spacing']/2,P['saddle_spacing']/2]):printed('saddle_block',(x,side*ry,pz+rt),motion='pitch',suffix=f'{side}_{i}')
  ring=cyl(11,(0,0,0),(0,P['bearing_width'],0)).cut(cyl(4,(0,-1,0),(0,P['bearing_width']+1,0)))
  place('608_bearing_'+str(side),ring,(0,side*bi,pz),rot,kind='hardware')
  sleeve=PARTS['optional_pitch_sleeve']['shape'].rotate((0,0,0),(1,0,0),-90)
  place('sleeve_alternative_'+str(side),sleeve,(0,side*bi,pz),rot,kind='alternative',part='optional_pitch_sleeve')
  spacer=cyl(6,(0,0,0),(0,P['pivot_spacer_length'],0)).cut(cyl(4.1,(0,-1,0),(0,P['pivot_spacer_length']+1,0)))
  place('pivot_spacer_'+str(side),spacer,(0,side*eo,pz),rot,kind='hardware',motion='pitch')
  shaft=cyl(4,(0,side*(eo-P['ear_thickness']-1.6),pz),(0,side*(eo-P['ear_thickness']-1.6+60),pz))
  place('M8_pivot_reference_'+str(side),shaft,kind='hardware',motion='pitch')
  # Nominal washers + hex head/nut make the pivot retention stack inspectable.
  washer=cyl(8,(0,0,0),(0,1.6,0)).cut(cyl(4.3,(0,-1,0),(0,3,0)))
  for label,yy in [('inner',eo-P['ear_thickness']-1.6),('outer',bi+P['bearing_width'])]:
   place('M8_washer_'+label+'_'+str(side),washer,(0,side*yy,pz),rot,kind='hardware',motion='pitch')
  hexhead=cq.Workplane('XY').polygon(6,13/math.cos(math.pi/6)).extrude(5.3).rotate((0,0,0),(1,0,0),-90)
  place('M8_head_'+str(side),hexhead,(0,side*(eo-P['ear_thickness']-1.6-5.3),pz),rot,kind='hardware',motion='pitch')
  nut=cq.Workplane('XY').polygon(6,13/math.cos(math.pi/6)).extrude(8)
  nut=hz(nut,0,0,-1,9,8).rotate((0,0,0),(1,0,0),-90)
  place('M8_nut_'+str(side),nut,(0,side*(bi+P['bearing_width']+1.6),pz),rot,kind='hardware',motion='pitch')
 printed('rear_crossmember',(-90,0,pz),motion='pitch');printed('front_drive_crossmember',(P['drive_pin_x'],0,pz),motion='pitch')
 sol=linkage(0);s=PARTS['pitch_crank_adapter']['shape'].rotate((0,0,0),(1,0,0),90).rotate((0,0,0),(0,1,0),-sol['alpha_deg'])
 crank_y=cb-P['pitch_tab_to_horn']
 place('pitch_crank_adapter',s,(P['pitch_servo_x'],crank_y,pz+P['pitch_servo_z']),motion='crank',part='pitch_crank_adapter')
 DATUMS.update(crank_pivot=[P['pitch_servo_x'],P['linkage_plane_y'],pz+P['pitch_servo_z']],neutral_crank_deg=sol['alpha_deg'])
 a=(sol['crank'][0],P['linkage_plane_y'],pz+sol['crank'][1]);b=(sol['target'][0],P['linkage_plane_y'],pz+sol['target'][1])
 place('pushrod_reference',cyl(1.5,a,b),kind='hardware',motion='linkage')
 for name,pt,y0,y1 in [('servo_joint_pin',a,95,105),('cradle_joint_pin',b,87,101)]:place(name,cyl(1.5,(pt[0],y0,pt[2]),(pt[0],y1,pt[2])),kind='hardware',motion='linkage')
 body=block(off-P['servo_body_length']/2,off+P['servo_body_length']/2,-P['servo_body_width']/2,P['servo_body_width']/2,-P['servo_body_height'],0)
 place('yaw_servo_envelope',body,(0,0,yf),kind='hardware',motion='fixed')
 place('yaw_bought_horn_reference',cyl(16,(0,0,db-8),(0,0,db-6)),kind='hardware')
 place('yaw_servo_shaft_reference',cyl(3.5,(0,0,yf),(0,0,db-8)),kind='hardware')
 place('pitch_bought_horn_reference',cyl(16,(P['pitch_servo_x'],crank_y,pz+P['pitch_servo_z']),(P['pitch_servo_x'],crank_y+2,pz+P['pitch_servo_z'])),kind='hardware',motion='crank')
 place('pitch_servo_shaft_reference',cyl(3.5,(P['pitch_servo_x'],crank_y+2,pz+P['pitch_servo_z']),(P['pitch_servo_x'],cb,pz+P['pitch_servo_z'])),kind='hardware')
 place('pitch_servo_envelope',body,(P['pitch_servo_x'],cb,pz+P['pitch_servo_z']),((0,0,0),(1,0,0),90),kind='hardware')
 base=block(-180,180,-150,150,0,bt)
 for x,y in [(x,y) for x in [-60,60] for y in [-60,60]]+[(x,y) for x in [-32,32] for y in [-18,18]]:base=hz(base,x,y,-1,bt+1,m4)
 place('plywood_base',base,kind='wood',motion='fixed')
 ring=hz(block(-50.8,50.8,-50.8,50.8,0,P['turntable_thickness']),0,0,-1,9,P['turntable_opening'])
 place('turntable_envelope',ring,(0,0,bb),kind='hardware',motion='fixed')
 shell=block(-170,200,-50,50,-38,72).union(block(200,342.5,-27.5,27.5,-5,45)).union(block(-342.5,-170,-20,20,-5,40))
 shell=shell.union(block(-150,-110,-22.5,22.5,-160,-38)).union(block(-25,15,-32.5,32.5,-170,-38))
 place('unmeasured_blaster_envelope',shell,(0,0,pz),kind='envelope',motion='pitch')
 s=block(-60,60,-27,27,0,9)
 for x,d in [(-44,8.2),(-24,8.4),(0,22.0),(30,22.2)]:s=hz(s,x,0,-1,10,d)
 register('fit_coupon',s,1,'Left to right: 8.2 / 8.4 / 22.0 / 22.2 mm test holes. Print first.',optional=True)

def moved(item,yaw=0,pitch=0):
 s=item['shape']
 if item['motion']=='linkage':
  sol=linkage(pitch);a=sol['crank'];b=sol['target'];y=P['linkage_plane_y'];pz=DATUMS['pivot_z']
  if item['name']=='pushrod_reference':s=cyl(1.5,(a[0],y,pz+a[1]),(b[0],y,pz+b[1]))
  else:
   pt=a if item['name'].startswith('servo') else b
   y0,y1=(95,105) if item['name'].startswith('servo') else (87,101)
   s=cyl(1.5,(pt[0],y0,pz+pt[1]),(pt[0],y1,pz+pt[1]))
 if item['motion']=='pitch':s=s.rotate((0,0,DATUMS['pivot_z']),(0,1,DATUMS['pivot_z']),-pitch)
 elif item['motion']=='crank':
  c=DATUMS['crank_pivot'];s=s.rotate(c,(c[0],c[1]+1,c[2]),-(linkage(pitch)['alpha_deg']-DATUMS['neutral_crank_deg']))
 if item['motion']!='fixed':s=s.rotate((0,0,0),(0,0,1),yaw)
 return s

def overlap(a,b):
 ba,bb=a.val().BoundingBox(),b.val().BoundingBox()
 if min(ba.xmax,bb.xmax)<=max(ba.xmin,bb.xmin)+.01 or min(ba.ymax,bb.ymax)<=max(ba.ymin,bb.ymin)+.01 or min(ba.zmax,bb.zmax)<=max(ba.zmin,bb.zmin)+.01:return 0
 return sum(s.Volume() for s in a.intersect(b).solids().vals())

def export(audit=True):
 OUT.mkdir(exist_ok=True)
 for f in ['stl','step','preview']:
  (OUT/f).mkdir(exist_ok=True)
  for old in (OUT/f).iterdir():
   if old.suffix in ['.stl','.step']:old.unlink()
 manifest=dict(status=P['status'],units='mm',parameters=P,datums=DATUMS,parts=[],assembly=[])
 for name,item in PARTS.items():
  raw=item['shape'];s=raw
  if item['orientation']:s=s.rotate((0,0,0),(1,0,0),item['orientation'])
  bb=s.val().BoundingBox();s=s.translate((-bb.xmin,-bb.ymin,-bb.zmin));target=OUT/'stl'/f'{name}.stl'
  cq.exporters.export(s,str(target),tolerance=.08,angularTolerance=.12);cq.exporters.export(raw,str(OUT/'step'/f'{name}.step'))
  mesh=trimesh.load_mesh(target)
  if not mesh.is_watertight or len(mesh.split())!=1:raise RuntimeError(f'{name}: STL not one watertight solid')
  bb=s.val().BoundingBox();dims=[round(bb.xlen,2),round(bb.ylen,2),round(bb.zlen,2)]
  fit=dims[0]+2*P['brim_margin']<=P['printer_bed_x']+.001 and dims[1]+2*P['brim_margin']<=P['printer_bed_y']+.001 and dims[2]<=P['printer_bed_z']+.001
  if not fit:raise RuntimeError(f'{name}: exceeds bed with brim: {dims}')
  manifest['parts'].append({k:v for k,v in item.items() if k not in ['shape','orientation']}|dict(name=name,dimensions_mm=dims,volume_mm3=round(raw.val().Volume(),1),stl=f'stl/{name}.stl',step=f'step/{name}.step',watertight=True,fits_configured_bed=True))
  print(f'{name}: {dims} mm; qty {item["quantity"]}; valid + watertight + bed fits',flush=True)
 assembly=cq.Assembly(name='Clickshot_prototype_fit_draft');colors=dict(print=(.66,.72,.57),hardware=(.24,.29,.28),wood=(.71,.56,.36),envelope=(.93,.53,.28),alternative=(.37,.59,.72))
 for item in ITEMS:
  if item['kind'] not in ['alternative','envelope']:assembly.add(item['shape'],name=item['name'],color=cq.Color(*colors[item['kind']]))
  cq.exporters.export(item['shape'],str(OUT/'preview'/f'{item["name"]}.stl'),tolerance=.16,angularTolerance=.18)
  manifest['assembly'].append({k:v for k,v in item.items() if k!='shape'}|dict(mesh=f'preview/{item["name"]}.stl'))
 assembly.export(str(OUT/'clickshot-assembly.step'));collisions=[];samples=[];hardware_collisions=[]
 if audit:
  prints=[i for i in ITEMS if i['kind']=='print']
  for yaw,pitch in [(0,0),(-30,-5),(30,-5),(-30,25),(30,25),(0,10),(0,20)]:
   solids=[moved(i,yaw,pitch) for i in prints]
   for ai,a in enumerate(prints):
    for bi in range(ai+1,len(prints)):
     b=prints[bi];v=overlap(solids[ai],solids[bi])
     if v>.2:collisions.append(dict(yaw=yaw,pitch=pitch,a=a['name'],b=b['name'],overlap_mm3=round(v,2)))
   samples.append(dict(yaw=yaw,pitch=pitch))
  # Sample bought-part reference clearances, including the moving rod and pins.
  hardware=[i for i in ITEMS if i['kind'] in ['hardware','wood']]
  for yaw,pitch in [(0,0),(-30,-5),(30,25),(0,10),(0,20)]:
   ps=[moved(i,yaw,pitch) for i in prints];hs=[moved(i,yaw,pitch) for i in hardware]
   for ai,a in enumerate(prints):
    for bi,b in enumerate(hardware):
     v=overlap(ps[ai],hs[bi])
     if v>.2:hardware_collisions.append(dict(yaw=yaw,pitch=pitch,a=a['name'],b=b['name'],overlap_mm3=round(v,2)))
  print('Sampled printed-part collisions:',len(collisions),'Hardware-reference collisions:',len(hardware_collisions),flush=True)
 ls=[]
 for pitch in range(-5,26):
  sol=linkage(pitch);a,b=sol['crank'],sol['target'];e=abs(math.hypot(a[0]-b[0],a[1]-b[1])-P['pushrod_pin_distance']);assert e<1e-6
  ls.append(dict(pitch=pitch,crank_deg=round(sol['alpha_deg'],4),closure_error_mm=e))
 manifest['validation']=dict(all_parts_valid_solids=True,all_stls_watertight=True,bed_fit_checked=True,printed_part_collision_samples=samples,printed_part_collisions=collisions,sampled_hardware_reference_collisions=hardware_collisions,linkage_samples=ls,hardware_interfaces_measured=False,blaster_fit_measured=False,hardware_clearance_and_fastener_access_fully_checked=False,continuous_motion_collision_proven=False,loaded_strength_tested=False)
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 with (OUT/'printed-parts.csv').open('w') as f:
  w=csv.writer(f);w.writerow(['Part','Qty','Optional','Print bounding box mm','Description'])
  for p in manifest['parts']:w.writerow([p['name'],p['quantity'],p['optional'],' x '.join(map(str,p['dimensions_mm'])),p['description']])
 if collisions or hardware_collisions:
  for c in collisions+hardware_collisions:print(c,flush=True)
  raise RuntimeError('Resolve printed-part interference before delivering draft')
 bundle()
 print('CAD exports, geometric audit and download pack completed.',flush=True)

def bundle():
 # Keep the downloadable archive synchronized with checked-in CAD sources/exports.
 m=json.loads((OUT/'manifest.json').read_text())
 if m['validation']['printed_part_collisions'] or m['validation']['sampled_hardware_reference_collisions']:
  raise RuntimeError('Cannot package a draft with known intersections')
 if not m['validation']['printed_part_collision_samples']:
  raise RuntimeError('Run the full collision audit before packaging')
 target=HERE/'clickshot-cad-prototype.zip'
 with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED) as z:
  for path in sorted(HERE.rglob('*')):
   if not path.is_file() or path==target or any(x in path.parts for x in ['.venv','__pycache__']):continue
   if path.name.startswith('.') and path.name!='.gitignore':continue
   z.write(path,Path('clickshot-cad')/path.relative_to(HERE))
 with zipfile.ZipFile(target) as z:
  if z.testzip() is not None:raise RuntimeError('CAD archive integrity check failed')

if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--skip-collision-audit',action='store_true',help='Iteration only; final exports need full audit.');args=ap.parse_args();build();export(not args.skip_collision_audit)

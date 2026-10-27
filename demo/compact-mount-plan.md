# Compact inverted mount — material-first concept

This is a **third presentation mock**, alongside the original printed mount and plywood alternative. It does not replace their models or the existing CAD pack. Open **Compact inverted** to move yaw/pitch, animate both axes, separate the assembly or ghost the omitted shell envelope.

## Why this is smaller

The retained receiver is inverted so the spring-fed magazine sits above it. Stock, decorative front shroud, grip and carry-handle envelopes are omitted. Their removal is an assumption for the mock, **not a cutting guide**. Preserve the feed path, flywheel enclosure, pusher, magazine latch, jam-door function and shell attachment structure until their functions and load paths are understood on the actual blaster. The remaining ~340 mm core length and 84 mm receiver width are illustrative, not measured stripped-blaster dimensions.

The camera and rangefinder stay upright on a cradle bracket; they do not inherit the receiver's 180-degree roll. This keeps the displayed camera image upright.

The proposed pitch axis sits **100 mm above the deck**, compared with 250 mm in the original scene. Two short cutout cheeks replace the tall split uprights. Two small padded saddles and light side rails replace the large cradle. Keep space between the saddles for the inverted jam door, and leave the magazine removal path open above.

The yaw bearing sits close to the plywood. A **fixed outboard servo with a crank and pushrod** turns the yoke; it avoids the raised bearing platform and its four support posts. A second outboard servo/linkage drives pitch. Servo bodies, horns, joints, fastener access and link clearances remain approximate. The tradeoff is more linkage fitting/calibration, and limited motion. The base keeps the controller and battery off the moving receiver.

## Proposed envelope and material comparison

| Item | Original scene | Compact concept |
|---|---:|---:|
| Plywood blank | 360 × 300 × 12.7 mm | 260 × 220 × 12.7 mm |
| Blank area | 108,000 mm² | 57,200 mm²; about **47% less** |
| Pitch axis above deck | 250 mm | 100 mm; **60% lower** |
| Inner cheek gap | 140 mm | 116 mm; fit assumption |
| Deck envelope | 220 × 200 mm | 160 × 140 mm, open web |
| Demonstrated travel | Scene-dependent | Yaw ±25°, pitch -10° to +25° |

The on-screen plastic comparison sums volumes of meshes assigned to the printed-part material in each scene. It includes overlaps between render solids and excludes hardware, receiver shell, infill, slicer supports and print orientation effects. It is a **comparison of modeled solid envelopes**, not a filament quote, actual mass or proof of a minimum-material structure. The original scene and its later fabrication CAD are different geometries; this number does not compare against the CAD pack. No stiffness, fatigue or loaded torque target has been established. Wall thicknesses (8 mm cheeks and roughly 7–8 mm deck/rail webs) are sketch dimensions for a future prototype, not verified print specifications.

## Balance and inverted operation

Inversion reduces the clearance needed **under** the receiver. It does not necessarily lower the loaded center of mass: the magazine moves upward and its mass changes as darts are used. Find the loaded balance point after stripping the blaster, and locate/adjust the pitch pivots accordingly. Straps and saddle spacing must keep the body from sliding or twisting without blocking the magazine latch or jam door. The circular balance mark in the mock only indicates the intended pivot, not a measured center of mass.

Inverted feeding, pusher return and jam access must be tested with the real blaster; the mock does not establish them. Check the shorter frame for shell/servo/linkage clearance through travel. Clamp the smaller base to the table—the smaller footprint is not a stability guarantee. The magazine-up arrangement also needs adequate overhead clearance.

## Drive geometry and next step

The assembled animation solves two planar crank/rod closures. Yaw uses a 30 mm crank and 90 mm rod pin spacing; pitch uses a 24 mm crank and 100 mm rod pin spacing. These are model dimensions only, not selected hardware. Printed horn extensions would bolt to supplied servo horns, never substitute for their spline interface. The non-linear horn angles need calibration and travel limits; servo stroke and torque must be checked on the bought parts. Linkages are hidden when separated because an exploded layout is not an operating configuration.

Use two supported short pivot shafts, with fit-tested plain sleeves or bearings; do not hang the blaster's weight on a servo output alone. Reuse the existing bought turntable and candidate servo classes only after checking the real requirements. Examples: [Rockler turntable](https://www.rockler.com/low-profile-lazy-susans), [Adafruit standard positional servo](https://www.adafruit.com/product/1142). No new price or loaded suitability is implied.

The next engineering step is to measure the retained core and its loaded balance, confirm inverted feeding and service access, choose real joint/servo hardware, then make a dimensioned CAD revision. The existing `/cad/` download is the **earlier printed mount**, not fabrication CAD for this concept.

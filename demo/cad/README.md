# Clickshot printed mount — prototype CAD v0.1

**Editable CAD for a first fit prototype, in millimeters.** The existing presentation mounts remain available. This CAD refines the printed option with an external pitch linkage and adds interchangeable printed sleeve pivots. It is not a measured Rapidstrike model or a load-tested assembly.

## Open and use

- Open **`generated/clickshot-assembly.step`** in FreeCAD, Fusion, Onshape or another STEP-capable CAD application. It contains separate named solids for printed parts and simplified bought hardware. It excludes the unmeasured blaster envelope and alternative sleeves.
- **`generated/step/`** contains individual editable B-rep solids. STEP preserves geometry, not a native feature history; use the generator for parameter changes.
- **`generated/stl/`** contains one print-oriented file per design. Parts sit on Z=0. STL is unitless: import in **mm**. Quantities and optional parts are in `generated/printed-parts.csv`.
- **`index.html`** is an interactive preview of the exported CAD meshes, with yaw/pitch, an exploded layout, part highlighting and a sleeve/bearing toggle. Open it through the demo server (`/cad/`), rather than as a `file://` page.
- `clickshot-cad-prototype.zip` bundles the sources, geometry and these notes. The browser preview imports Three.js from the parent demo's installed dependencies; STEP/STL files work independently.

## What to print first

1. Print **`fit_coupon.stl`**. Left to right, its holes are 8.2, 8.4, 22.0 and 22.2 mm. Try the actual pivot hardware and bearing. Tune `bearing_seat_diameter` and `sleeve_bore` to the result, rather than forcing a tight bearing into a part.
2. Print **one upper cheek** and **one optional sleeve** if using sleeve pivots. Check bearing/sleeve fit, the retainer, and that a smooth pivot shaft turns freely. Choose two 608 bearings **or** two sleeves; they occupy the same seats.
3. Print a **servo carrier** as a fit template only after measuring the servo. The pitch carrier is extended so its lower support posts clear the pushrod. Use its outer lower row (-36 mm) and upper row (+18 mm); the middle row is unused.
4. Check the saddles against the actual shell and loaded balance. Then generate the full set with the adjusted dimensions.

Assumed bed: **220 × 220 × 250 mm**, with **5 mm brim space per side**. The longest individual part is a 200 mm cradle rail. Tall cheeks are split into two bolted pieces; the yaw deck is two halves. Existing printer/filament are assumed available. PETG is a candidate material, not a validated strength specification. Have Ford staff review orientation, layer loading and the prototype before choosing final print settings. Printer supports and slicer settings have not been validated.

## Dimensions and what is provisional

| Datum | CAD value | Status |
|---|---:|---|
| Plywood base | 360 × 300 × 12.7 mm | Proposed; separate cut part |
| Yaw deck | 220 × 200 × 10 mm | Two printed halves |
| Gap between upright inner faces | 140 mm | Adjust after measuring the blaster |
| Pitch axis above deck top | 250 mm | Proposed magazine/grip clearance |
| Upright split above deck | 125 mm | Splice moved below the cradle sweep |
| Cradle rails | 200 × 16 × 14 mm | Two rails |
| Rail center spacing | 89.6 mm | 73.6 mm nominal clear opening |
| Saddle spacing | 130 mm | Each saddle slides ±9 mm |
| Pitch seats | 22.2 mm diameter × 7.2 mm deep | Fit-test against 22 × 7 mm bearing/sleeve |
| Optional sleeve | 22 mm OD × 8.4 mm bore × 7 mm long | Printed fit experiment; wear/friction untested |
| Turntable | 101.6 mm square, 53.975 mm opening, 7.9375 mm thick | Supplier reference envelope |
| Pitch crank | 20 mm pin radius | Bolts to a supplied servo horn |
| Pitch pushrod | 95 mm pin-to-pin | Includes the joint ends; not the bare rod cut length |
| Demonstrated travel | yaw ±30°, pitch -5° to +25° | Sampled geometry only, no mechanical end stops |

The orange blaster is an **illustrative 685 mm envelope** with guessed receiver, magazine and grip dimensions. It is deliberately excluded from the STEP assembly and is not used as evidence of fit. The commercial reference supplies approximate length only. Measure the real shell, magazine-removal path, jam-door travel and center of mass with batteries and darts installed. The four flat padded saddles may need different heights/contours to suit your shell.

The Adafruit servo reference supplies a 40.7 × 19.7 × 42.9 mm body and 25-tooth spline. The following CAD defaults are **unmeasured placeholders**, not manufacturer dimensions: 49 mm tab-hole pitch, 10 mm tab-row pitch, 10 mm shaft offset, and 12 mm yaw / 8 mm pitch flange-to-horn distances. Measure these and the actual horn hole pattern before printing carriers/adapters. No printed part engages the servo spline directly.

**Turntable holes are intentionally not predrilled in CAD.** Rockler publishes a 3-inch *bearing-circle diameter*, which is not the mounting-hole spacing. Use the actual bearing as the drilling template, as its instructions describe. Resolve top/bottom plate fastener access before installing the servos. Trial-fit screw lengths so they cannot touch the opposite rotating plate or race. The blank lower bearing platform adds a printable drilling surface and separates its mounting from the fixed support posts.

## How it assembles

1. Cut the plywood base. The STEP base has eight M4 clearance holes: four platform-post holes at X/Y = ±60 mm, and four yaw-servo-post holes at X = ±32, Y = ±18 mm. Transfer-mark these from the CAD or measure them; do not print a screen image as a drilling template.
2. Bolt the four 60 mm posts and the fixed 140 × 140 × 8 mm bearing platform to the base. Transfer-drill and install the bottom turntable plate. The fixed yaw-servo carrier has separate 51.94 mm posts.
3. Dry-fit the yaw servo, bought horn and 50 mm adapter through the center opening. The carrier/horn stack must match the measured servo; change the post length rather than loading the servo shaft axially. Fit the top bearing plate to the joined deck. Follow the bearing manufacturer's fastening/access procedure; its plates do not separate.
4. Join deck halves with two underside splice bars. Bolt the two lower cheeks to the deck, then join each upper cheek using one splice plate on each face.
5. Assemble the open cradle: two rails, rear crossmember, front drive crossmember and two pivot ears. Add four saddles and soft pads. Straps go through the saddle slots and around the shell; straps/pads are not modeled solids. Check that screw heads remain recessed beneath the pads.
6. Fit two 608 bearings **or** two printed sleeves, then the retainers. Assemble the two short M8 pivots. Inside to outside: bolt head → washer → cradle ear → 10 mm spacer → bearing/sleeve → washer → locknut. The 13 mm cheek passage clears the spacer; the 8.6 mm ear passage clears the pivot. Use a verified smooth shank across the bearing/sleeve, not thread crests. Check washer/spacer contact is confined to the inner bearing race and never rubs the shields. Tune axial shims/retainers to the actual stack; avoid binding or side play.
7. Install the outboard pitch carrier on four 24 mm posts. Mount the servo with tab fastener heads toward the servo body and nuts toward the horn, keeping hardware out of the rod's path. Fit the bought horn, printed crank and a proper pushrod with joint ends; nominal pin-to-pin distance is 95 mm. Adjust joint spacers so the rod stays in the 97 mm Y plane. Joint bodies, fastener heads, wiring and actual horn thickness still need an in-person clearance check.
8. With servos disconnected from the load, verify both axes move freely. Strap the loaded blaster in place and slide it to balance at the pitch pivots. If the saddle travel cannot reach the loaded balance point, relocate the saddles/cradle before powering the servo. Clamp the base to the table. Add physical stops and cable slack, then calibrate with slow limited movement.

Bearings/sleeves support the weight; servos provide rotation. Balancing reduces the gravity torque but does not eliminate inertia, friction or acceleration loads. Neither this model nor the listed candidate servo proves the required torque or printed-part strength.

## Bought hardware for this CAD revision

This table is a **provisional assembly schedule, not a priced quote**. It supersedes the presentation's generic fastener quantities for this CAD revision. The existing shopping totals have not been recalculated for the added linkage, longer pivot bolts and hardware here. Confirm actual stacks and available class/Ford stock before buying.

| Joint / component | Starting hardware quantity | Starting length / selection |
|---|---:|---|
| Yaw turntable | 1 | Rockler 4-inch or measured equivalent; transfer-drill pattern |
| Pitch rotation support | 2 | 608 bearings, or two optional printed sleeves |
| Short pitch pivots | 2 bolts | M8 × 60 mm **partially threaded**, smooth shank across ear + spacer + bearing; verify actual shank length |
| Pivot retention | 2 locknuts + 4 washers | M8; nominal washer 16 mm OD, 1.6 mm thick; verify cap relief |
| Pivot spacers | 2 | 8 mm ID × 12 mm OD × 10 mm; confirm inner-race contact |
| Deck joiners + yaw horn adapter | 8 screws | M4 × 25 mm, nuts + washers |
| Cheek feet + cradle crossmembers | 12 screws | M4 × 30 mm, nuts + washers |
| Upright splices | 8 screws | M4 × 35 mm, nuts + washers |
| Cradle ears | 4 screws | M4 × 40 mm, nuts + washers |
| Saddles | 4 screws | M4 × 40–45 mm; recess socket heads, verify pad clearance |
| Fixed bearing platform/posts/base | 4 screws | M4 × 90 mm, nuts + washers |
| Yaw servo carrier/posts/base | 4 screws | M4 × 80 mm, nuts + washers |
| Pitch carrier/posts/cheek | 4 screws | M4 × 50 mm, nuts + washers |
| Bearing retainers | 8 screws | M3 × 25 mm, nuts + washers |
| Servo mounting tabs | 8 screws | M3 × 16 mm starting point; match bought servo holes |
| Horn attachment | 4–6 small screws + spline screws | Match the actual supplied horns; 2.5 mm adapter slots are clearance, not tapped holes |
| Pitch linkage | 1 rod + 2 joint ends | Adjustable 95 mm overall pin spacing; joints matching M3 pins, joint spacers and retainers |
| Turntable mounting | 8 nominal fixings | #6 or supplier-specified system; select length from trial fit, not a generic through-bolt assumption |
| Shell attachment | 2 straps + 4 pads | Measure shell circumference; keep jam door/magazine accessible |
| Motion limits / base restraint | As needed | Two suitable table clamps; physical stops, strain relief and cable clearance to resolve |

Not every small fastener or joint body is modeled. Servo bodies, horns, turntable, M8 pivots and linkage are simplified references, not vendor STEP drawings.

## Regenerate and audit

```sh
cd demo/cad
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python generate.py
```

Edit **`parameters.json`**, regenerate, and inspect the resulting STEP and viewer. Keep units in mm. Major topology changes (new servo layout, different bearing style, substantially different cradle length) also need generator edits; not every mounting coordinate is independently parameterized. Default output is supplied so teammates do not need Python to inspect or slice it. Do not commit `.venv`.

`generate.py` checks each printed part is one valid B-rep solid and each STL is one connected watertight mesh. It checks each oriented part against the configured bed plus brim margin, printed-part intersections in seven poses, simplified hardware-to-print clearance in five poses, and planar linkage closure at every whole degree from -5° to +25°. `generated/manifest.json` records results and unchecked items. It does **not** prove continuous collision clearance, actual shell fit, printed strength, servo capability, stability or access with tools. The mathematical linkage is illustrative until purchased joint geometry and servo calibration are fitted.

## References

- [Adafruit 1142 servo body/spline specifications](https://www.adafruit.com/product/1142)
- [Rockler turntable specifications](https://www.rockler.com/low-profile-lazy-susans) and [manufacturer mounting instructions](https://go.rockler.com/tech/28951-985.pdf)
- [Igus: plain-bearing load, movement and wear considerations](https://www.igus.com/plastic-bearings/resources/plain-bearings-faq)
- [Published approximate Rapidstrike length, licensed Nerf guide p.72](https://mail.powerhousearena.com/pow/POW!%20PDFs/NERF.pdf#page=38)

No new commercial hardware has been selected or purchased as part of creating this CAD.

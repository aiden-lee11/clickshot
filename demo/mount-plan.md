# Rapidstrike CS-18 mount — prototype envelope and buy list

This plan accompanies the Clickshot presentation mock. It is an assembly concept, not a dimensioned CAD release, fit guarantee or structural validation. The listed quantities are for a first prototype and must be reconciled with the final CAD and the hardware you already own. No purchases have been made.

## Dimension basis

The screenshot identifies a Nerf N-Strike Elite Rapidstrike CS-18. The licensed **Ultimate Nerf Blaster Book**, printed page 72 (PDF page 38), lists a length of **27 inches / 68.5 cm**. The mock uses **685 mm** as an approximate overall reference with the long stock shown. That number is a reference length; the book is not a Hasbro mechanical drawing. Local shell geometry, receiver width, loaded height and center of gravity are not established by the screenshot.

[Licensed Nerf reference, p.72](https://mail.powerhousearena.com/pow/POW!%20PDFs/NERF.pdf#page=38)

[Hasbro Rapidstrike instructions — component locations and access door](https://www.hasbro.com/common/documents/dad2af6f1c4311ddbd0b0800200c9a66/2B48833750569047F598BEBD4AA242BA.pdf)

### Proposed starting envelope

These dimensions are design choices to make the full-size concept concrete. They are **not measured Rapidstrike fit dimensions**.

| Feature | Starting size | Basis |
|---|---:|---|
| Blaster overall reference | Approximately 685 mm | Published licensed reference |
| Plywood base | 360 × 300 × 12.7 mm | Proposed; clamp to the demonstration table |
| Printed yaw deck | 220 × 200 mm | Proposed; split the deck if required by printer bed size |
| Clear spacing between cheek plates | 140 mm | Proposed; replace after measuring the shell at the saddles |
| Pitch pivot height | 250 mm above deck datum | Proposed; check the loaded magazine, grip and stock sweep |
| Saddle rail length | 220 mm | Proposed; slide the blaster to balance it when loaded |
| Bought yaw bearing | 101.6 mm square; ~54 mm center opening; ~7.94 mm thick | Rockler #28969 dimensions |
| Bought pitch bearing | 8 mm bore × 22 mm OD × 7 mm width | 608ZZ component dimensions |
| Candidate servo case | 40.7 × 19.7 × 42.9 mm | Adafruit 1142 component dimensions |

The 3D mount uses one scene unit per 100 mm. Target distances are compressed for presentation and are independent of the mount's size reference. The blaster is a procedural approximation, not a scan.

## Candidate purchase list

Use existing equivalent hardware where available. Links are supplier references checked on October 26, 2026; stock, prices and shipping can change. Prices below are a USD snapshot, before tax and shipping. Allowances are planning estimates rather than supplier quotes; confirm availability and final CAD quantities before ordering.

| Prototype quantity | Item and link | Use / selection notes |
|---:|---|---|
| 2 | [Adafruit 1142 positional metal-gear servo](https://www.adafruit.com/product/1142) | Yaw and pitch. 4.8–6 V; standard included horns. Candidate only: confirm loaded balance, acceleration requirements and continuous operating torque before ordering. A stall-torque rating is not a continuous operating rating. |
| 1 | [Rockler 4-inch square lazy-Susan bearing, #28969](https://www.rockler.com/low-profile-lazy-susans) | Select the 4-inch square version. The bearing supports yaw loads; the servo supplies rotation. Hardware is sold separately. |
| 2 | [VXB MR608-ZZ bearings](https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di) | Supported short pitch pivots on both sides of the open cradle. 8 × 22 × 7 mm. |
| 2 | [M8 × 1.25 × 40 mm partial-thread hex bolts, Bolt Depot #5817](https://boltdepot.com/Product-Details?product=5817) | Use the smooth shank at the bearing. Verify the actual shank and final stack; bolt length is a prototype starting point. |
| 2 | [M8 × 1.25 nyloc nuts, #4797](https://boltdepot.com/Product-Details?product=4797) | Pivot retention. |
| 4 starting quantity | [M8 flat washers, #4518](https://boltdepot.com/Product-Details?product=4518) | Against the printed ears/retainers, with spacers locating the inner race. A washer must not rub a bearing shield or outer race. |
| 1 pack of 4 | [ServoCity 8 mm ID × 12 mm OD × 10 mm steel spacers](https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/) | Inner-race spacing. Adapt the printed ears to the bought spacer length; verify inner-race contact and free rotation. |
| About 16, final CAD dependent | [M4 × 20 mm socket screws, #23080](https://boltdepot.com/Product-Details?product=23080) | Cheek lap joints and printed flanges. Add matching M4 nuts and washers; confirm each stack length. |
| 4 long + 4 short, final CAD dependent | [#6-32 pan-head machine screws and nuts](https://boltdepot.com/BrowseList?F_Head_style=Pan&F_Thread_count=32) | Rockler specifies #6 mounting screws. Long screws pass through the base and printed risers; short screws attach the top deck. A 3/4-inch length is only a starting point for the deck; measure the final stack. Select #6 diameter in the supplier catalog. |
| Supplied with servo / as required | Servo tab screws, matching horns and horn screws | Use the servo-supplied screws where appropriate. Any additional small fasteners depend on the selected servo and printed adapters. |
| 1 offcut/panel | [1/2-inch birch plywood project panel](https://www.homedepot.com/p/311925833) | Cut the proposed 360 × 300 mm base; reuse a suitable offcut if available. |
| 2 lengths | [VELCRO ONE-WRAP heavy-duty roll](https://www.velcro.com/products/organization/heavy-duty-one-wrap-roll/) | Cut after measuring the shell circumference. Add reused soft pads under the saddles. |
| Printer access + existing spools | Printing supplies — $0 new spend | PETG is the planned material; confirm a suitable existing material before printing cheeks, cradle, risers, bearing retainers and servo adapters. No strength or print-orientation validation has been performed. |

The mount list does not include the existing blaster, microcontroller, range sensor, camera, MOSFET circuit or servo power system. The servo supply must match the selected servo voltage and combined measured peak current; it is not powered through the laptop USB port. The simulation's dimensions and candidate servos do not validate the electrical system.

## Cost snapshot — USD, October 26, 2026

| Purchase quantity | Linked item | Unit / pack cost | Line cost |
|---:|---|---:|---:|
| 2 | [Adafruit 1142 servos](https://www.adafruit.com/product/1142) | $19.95 each | $39.90 |
| 1 | [Rockler 4-inch square bearing, #28969](https://www.rockler.com/low-profile-lazy-susans) | $5.99 each | $5.99 |
| 2 | [VXB MR608-ZZ bearings](https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di) | $7.77 each | $15.54 |
| 2 | [M8 × 40 mm bolts, #5817](https://boltdepot.com/Product-Details?product=5817) | $0.68 each | $1.36 |
| 2 + 4 | [M8 nuts, #4797](https://boltdepot.com/Product-Details?product=4797) + [washers, #4518](https://boltdepot.com/Product-Details?product=4518) | $0.17 / nut + $0.08 / washer | $0.66 |
| 1 pack of 4 | [ServoCity spacers](https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/) | $1.99 / pack | $1.99 |
| About 16 screws + nuts/washers | [M4 × 20 mm screws, #23080](https://boltdepot.com/Product-Details?product=23080) | $0.20 / screw + $3.00 nuts/washers allowance | **$6.20 est.** |
| About 8 screws + nuts | [#6-32 mounting hardware](https://boltdepot.com/BrowseList?F_Head_style=Pan&F_Thread_count=32) | $4.00 allowance; final lengths TBD | **$4.00 est.** |
| 1 panel | [1/2-inch 2 × 2 ft birch plywood panel](https://www.homedepot.com/p/311925833) | $14.72 / panel | $14.72 |
| 1 roll → 2 straps | [ONE-WRAP roll](https://www.velcro.com/products/organization/heavy-duty-one-wrap-roll/) | $8.00 allowance / roll | **$8.00 est.** |
| Printer access + existing spools | Printing supplies | $0 new spend | **$0.00 — owned** |

| Budget case | Estimated materials cost |
|---|---:|
| Listed-price subtotal | $83.36 |
| Prototype allowances ($3 M4 hardware + $4 #6 hardware + $8 straps) | $15.00 |
| **Buy other mount materials; owned printing supplies** | **$98.36** |
| **If Ford supplies plywood + common fasteners at no project charge** | **$71.42** |

Both cases assume access to a 3D printer and already-owned filament at **$0 new spend**, per the project assumptions. Straps remain budgeted in both cases. The conditional Ford case subtracts $26.94: plywood $14.72 plus pivot and general mounting fasteners $12.22. Equivalent stock and any charges must be confirmed with staff. A full plywood panel and strap roll are budgeted in the first case; print mass remains unknown.

For a consistent comparison using these same assumptions, the plywood alternative totals **$115.93** for other purchases or **$81.42** if Ford covers its wood and common hardware. Its additional $10 pitch-linkage allowance accounts for the difference between the two Ford cases. Easier fabrication does not establish lower purchased-part cost.

These totals cover only the candidate mount list. They exclude the blaster, microcontroller, camera, range sensor, MOSFET circuit and servo power system. Tools, table clamps and soft pads are assumed available; servo horns and small servo screws are assumed supplied. Any extra adapters or fasteners must be added after CAD and a hardware check. Prices are not a stock guarantee or an order quotation.

## Ordinary assembly approach

1. Print each tall cheek as two flat sections with a bolted lap joint. Print the open cradle, bearing retainers, risers and horn adapters separately; fit these to the actual bought hardware.
2. Drill the plywood for the bearing/riser fasteners and table clamps. The raised turntable gives the coaxial yaw servo space below it. Resolve servo alignment, horn access and bearing mounting-hole access in CAD; no custom machined coupling is assumed.
3. Bolt the cheeks to the yaw deck. Retain each bearing's outer ring in its printed housing. Each side has its own short pivot bolt; there is no shaft through the blaster.
4. Use the inner-race spacers to prevent clamping the rotating cradle against the fixed cheeks. The pitch servo horn bolts to a printed drive adapter, while the two bearings support the pivot load.
5. Strap the blaster to the open cradle and slide it until the **loaded** balance point is at the pivot line. Keep the jam door, battery access and magazine release/removal path usable.
6. Measure clearances through the intended travel before finalizing parts. Check receiver width at both saddles, loaded magazine/grip clearance, stock sweep and cable slack. Check joint stiffness, bearing freedom and loaded torque on the prototype.

All local-fit dimensions remain provisional until those measurements are available. The screenshot's external dimensions alone cannot determine a reliable print fit.

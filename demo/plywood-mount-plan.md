# Plywood mount alternative — six-week prototype concept

This is an alternative to the original printed mount, which remains in `mount-plan.md` and in the **Original mount** tab. Open **Plywood alternative** to orbit the model, move yaw/pitch independently, animate both axes or separate the parts.

## What changes

- A scrap-plywood yaw deck and two straight plywood uprights replace the large printed yoke and its split joints.
- Ordinary bought angle brackets attach the uprights to the deck.
- An open ladder cradle made from plywood strips supports the padded saddles. Straps secure the intact blaster; the center stays open for the magazine and grip.
- The bought 4-inch turntable supports yaw. Four sawn wood blocks provide room below it for a coaxial positional servo. Its horn connects to a small adapter under the deck.
- Two short 8 mm pivots and 608 bearings support pitch. A second positional servo drives a short crank/pushrod attached to the cradle. It does not directly support the blaster's weight.
- Only bearing holders, saddle pads and servo/horn adapters need small prints. Bearing holders bolt to the uprights and can be replaced independently.

The 3D scene solves a planar crank/pushrod closure while assembled so that its ends remain connected during motion. This is an illustrative linkage, not a validated mechanical design. The exploded view deliberately separates joints and is not an operating configuration. Linkage dimensions, servo mounting-tab location, clearance and calibration must be resolved around the bought parts.

## Proposed envelope — measure before cutting

The alternative retains the approximately 685 mm Rapidstrike reference and 360 × 300 × 12.7 mm base from the original plan. Proposed deck: 260 × 215 mm. Proposed clear gap: 160 mm between 12.7 mm uprights. Proposed pitch-axis height: 250 mm above the deck datum. These are starting dimensions, not measured shell-fit dimensions or released CAD.

Show limited travel first: yaw ±30°, pitch −5° to +25°. The automatic sweep stays within that envelope. The demo does not prove collision clearance, stability or servo torque. Check the loaded magazine, stock, grip, jam door, wiring and magazine-removal path through the entire intended range.

## Prototype parts

| Part | Starting quantity | Source / action |
|---|---:|---|
| Plywood base, deck, uprights and cradle strips | Cut from suitable stock | Check Ford scrap first; confirm available thickness and usable size |
| Wood riser blocks and ordinary angle brackets | 4 blocks / 4 brackets | Check Ford; use bought equivalents if unavailable |
| 4-inch lazy-Susan bearing | 1 | [Rockler #28969](https://www.rockler.com/low-profile-lazy-susans) |
| 608ZZ pitch bearings | 2 | [VXB MR608-ZZ](https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di) |
| Short M8 pivot bolts, spacers, washers and locknuts | 2 pivot assemblies | As described in the original mount plan; verify actual shank and stack |
| Positional servos with horns | 2 | Candidate from original list; select after measuring loaded balance and required torque |
| Pitch linkage, clevises/ball joints and fixings | 1 assembly | Select with servo and cradle geometry; do not substitute wire bent around loose holes as a finished joint |
| Straps and soft pads | 2 straps / 4 pads | Reuse suitable material or buy a roll |
| Small printed adapters | As needed | Confirm material, fit, print orientation and fees with Ford |

## Shopping list — USD snapshot, October 26, 2026

The separate **View plywood shopping list** button in the alternative tab opens this BOM. Supplier prices are snapshots, not stock guarantees. Estimates marked **est.** are planning allowances. Candidate items still need fit/torque checks; the linkage catalog is not a final fitted kit.

| Qty | Item / supplier | Unit / pack | Line cost | Sourcing |
|---|---|---|---:|---|
| 2 | [Positional metal-gear servos](https://www.adafruit.com/product/1142) | $19.95 each | $39.90 | Budget to buy / quote |
| 1 | [4-inch square turntable bearing](https://www.rockler.com/low-profile-lazy-susans) | $5.99 each | $5.99 | Budget to buy / quote |
| 2 | [608ZZ pitch bearings](https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di) | $7.77 each | $15.54 | Budget to buy / quote |
| 1 pack | [8 × 12 × 10 mm steel spacers](https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/) | $1.99 / pack | $1.99 | Budget to buy / quote |
| 2 | [M8 × 40 mm pivot bolts](https://boltdepot.com/Product-Details?product=5817) | $0.68 each | $1.36 | Check Ford first |
| 2 + 4 | [M8 locknuts](https://boltdepot.com/Product-Details?product=4797) + [washers](https://boltdepot.com/Product-Details?product=4518) | $0.17 nut / $0.08 washer | $0.66 | Check Ford first |
| 1 panel | [1/2-inch birch plywood](https://www.homedepot.com/p/311925833) | $14.72 / panel | $14.72 | Check Ford first |
| 4 blocks | [Wood riser stock](https://design.northwestern.edu/about/design-facilities/prototyping-lab.html) | $5 / batch allowance | $5.00 est. | Check Ford first |
| 1 pack | [2-inch steel angle brackets](https://www.homedepot.com/p/327600254) | $4.77 / pack | $4.77 | Check Ford first |
| 1 batch | [Mounting screws, nuts + washers](https://boltdepot.com/Catalog) | $8 / batch allowance | $8.00 est. | Check Ford first |
| 1 set | [Pitch pushrod + two joint ends](https://www.servocity.com/linkages-threaded-rods/) | $10 / set allowance | $10.00 est. | Budget to buy / quote |
| 1 roll | [Straps + reused soft pads](https://www.velcro.com/products/organization/heavy-duty-one-wrap-roll/) | $8 / roll allowance | $8.00 est. | Budget to buy / quote |
| 1 batch | [Small printed adapters](https://design.northwestern.edu/about/design-facilities/corner-makery.html) | $10 / batch allowance | $10.00 est. | Budget to buy / quote |

| Budget case | Estimated cost |
|---|---:|
| Listed-price subtotal | $84.93 |
| Planning allowances | $41.00 |
| **Buy materials + print allowance** | **$125.93** |
| **If Ford supplies tagged wood + common hardware at no project charge** | **$91.42** |

Both totals include two candidate aiming servos. The $41 allowance comprises $5 riser wood, $8 mounting fasteners, $10 pitch linkage, $8 strap roll and $10 printing/material. The $10 printing allowance is not a Ford quote, full-spool purchase or known print mass. Replace it with a quote for the actual files.

The Ford case subtracts $34.51: plywood $14.72, riser wood $5.00, brackets $4.77, pivot bolts/nuts/washers $2.02 and general fasteners $8.00. None of that stock is confirmed free; inspect quantities, condition and dimensions with staff. This detailed shopping budget replaces the earlier rough $25–40 structural allowance. Printing and linkage selection remain unresolved costs.

Borrow/reuse two suitable table clamps, soft pads, tools and servo-supplied horns/screws; add their cost if unavailable. Mounting fastener quantities/lengths follow final stack dimensions: 4 long and 4 short #6 fasteners for the turntable, plus upright-bracket, bearing-holder and servo-adapter fixings. Do not assume supplied wood screws suit the plywood thickness.

Totals exclude tax, shipping, the blaster, webcam, range sensor, motor drivers and power supplies. The micro:bit, cables and resistors are class-provided. This list is an alternative to the original BOM; do not buy both mount lists or count their servos twice.

## Assembly sequence

1. Measure the loaded blaster and find its balance point. Confirm the required magazine/grip clearance and aim travel before cutting.
2. Cut the flat panels and cradle strips. Clamp the uprights together when drilling corresponding mounting holes; ask Shop staff about an alignment jig for the pitch pivots.
3. Mount the turntable above the wood risers; resolve fastener access and coaxial yaw-servo/horn alignment before enclosing it.
4. Bolt the uprights to the deck with angle brackets. Add bearing blocks and short pivots. Check free rotation before connecting the pitch servo.
5. Strap the blaster into the cradle and slide it to balance about the pitch axis. Set hard travel limits that avoid the stock, magazine, uprights and wiring.
6. Connect and calibrate the pitch linkage; its angle-to-servo mapping is generally nonlinear. Test both axes with the loaded assembly before integrating targeting.

## Ford resources checked October 26, 2026

- [Corner Makery](https://design.northwestern.edu/about/design-facilities/corner-makery.html): publishes access to scrap under the Carvey mill, Bambu X1 Carbon printers and supplied filament. Stock sizes, PETG availability and any project charges remain unconfirmed.
- [Prototyping and Fabrication Lab](https://design.northwestern.edu/about/design-facilities/prototyping-lab.html): woodworking, hand tools, measurement equipment, staff help and fabrication materials primarily for class projects. Orientation is required. No public fastener inventory guarantees the needed sizes for free.
- [Rapid Prototyping Lab](https://make.northwestern.edu/facilties/machine-shops-prototyping-labs/rapid-prototyping-3d-printing-lab.html): professional printing is a charged service; obtain a quote rather than assuming all Ford printing is free.

The prototype remains an assembly concept. The original printed model and its purchase list are preserved for comparison.

# Recommended hybrid — complete shopping list

Prices checked October 27, 2026. USD; before tax, shipping and tariffs. Candidate BOM for the trimmed, inverted Rapidstrike on the plywood hybrid mount. Choose this list instead of adding together the earlier mount lists.

- **Remaining purchases: $272.24 estimated.**
- **If Ford supplies all tagged items at no charge: $221.57 estimated** (saves $50.67).
- Listed-price subtotal: $163.24. Planning allowances marked EST.: $109.00.
- These totals assume an existing donor blaster, magazine, stock battery tray and webcam, as stated in the project notes. Class micro:bit, cables, resistors, printer access and filament are already covered.
- The full estimate exceeds the original $120 project allowance. Check available lab supplies before ordering; prices do not guarantee stock or fit.

## 01 / Mount + movement — $136.09

| Qty | Part / supplier | Unit or pack | Line total | Selection notes |
|---:|---|---:|---:|---|
| 2 | [Positional metal-gear servos](https://www.adafruit.com/product/1142) | $19.95 / each | $39.90 | Adafruit 1142. One yaw, one pitch; horns included. Candidate only: weigh and balance the stripped, loaded assembly before checking torque and travel. |
| 1 | [4-inch lazy-Susan bearing](https://www.rockler.com/low-profile-lazy-susans) | $5.99 / each | $5.99 | Select Rockler #28969, 4-inch square. Supports yaw above four risers; transfer-drill its actual mounting pattern. |
| 2 | [608ZZ pitch bearings](https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di) | $7.77 / each | $15.54 | VXB MR608-ZZ, 8 × 22 × 7 mm. One per side, retained in small printed housings. |
| 1 | [8 mm ID steel spacers, pack of 4](https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/) | $1.99 / pack | $1.99 | 12 mm OD × 10 mm long. Adapt the pivot stack so spacers contact inner races without rubbing shields. |
| 1 | [1/2-inch plywood, 2 × 2 ft panel](https://www.homedepot.com/p/311925833) · CHECK FORD FIRST | $14.72 / panel | $14.72 | Enough for the proposed 300 × 260 base, 180 × 180 deck and two ~80 × 121 mm uprights, with offcuts. Check actual thickness. |
| 1 | [Wood stock for four riser blocks](https://design.northwestern.edu/about/design-facilities/prototyping-lab.html) · CHECK FORD FIRST | $5.00 / batch | $5.00 EST. | Cut four ~60 mm-high blocks; final footprint must support bearing screws. Scrap first. |
| 1 | [2-inch corner braces, pack of 4](https://www.homedepot.com/p/327600254) · CHECK FORD FIRST | $4.77 / pack | $4.77 | Everbilt 24520. Two braces per upright. Confirm hole locations and screw access. |
| 1 | [Two M8 pivot bolt sets](https://boltdepot.com/Metric_hex_bolts) · CHECK FORD FIRST | $4.00 / pair of sets | $4.00 EST. | Includes 2 partially threaded bolts, 2 locknuts and 4 washers. Select length AND smooth-shank length after measuring the complete pivot stack; not a fixed M8 × 40 order. |
| 1 | [Remaining mount fasteners](https://boltdepot.com/Catalog) · CHECK FORD FIRST | $12.00 / batch | $12.00 EST. | Budget for 8 #6 turntable fixings, ~16 brace fixings, ~12 M3/M4 bearing-holder/servo/adapter fixings and 8 riser fixings, with matching nuts/washers. Counts and lengths remain provisional. |
| 1 | [Pitch pushrod + two joint ends](https://www.servocity.com/linkages-threaded-rods/) | $10.00 / set | $10.00 EST. | One linkage only. Match rod, ends, pins and horn holes together; mock is 100 mm pin-to-pin / 24 mm crank radius. Catalog link, not a fitted kit. |
| 1 | [Reusable strap roll](https://www.velcro.com/products/organization/heavy-duty-one-wrap-roll/) | $8.00 / roll | $8.00 EST. | Cut two straps around the trimmed receiver and saddles. Keep magazine removal and jam access clear. |
| 1 | [Thin foam/rubber padding](https://www.homedepot.com/b/Hardware-Weather-Stripping/N-5yc1vZc291) | $4.00 / small pack | $4.00 EST. | Pads for both saddles and base contact points; offcuts are fine. Avoid compressing or obstructing the mechanism. |
| 2 | [Table clamps](https://www.homedepot.com/p/205512965) · CHECK FORD FIRST | $5.09 / each | $10.18 | BESSEY CM20, 2-inch opening. Check table + base thickness first; borrow suitable larger clamps if needed. |

## 02 / Sensing + controller interfaces — $25.55

| Qty | Part / supplier | Unit or pack | Line total | Selection notes |
|---:|---|---:|---:|---|
| 1 | [VL53L4CX distance-sensor breakout](https://www.adafruit.com/product/5425) | $14.95 / each | $14.95 | Your original link: Adafruit 5425. This is VL53L4CX, NOT the VL53L0X named in the proposal. Pick one model before writing the C driver; nominal maximum range is not a guaranteed dart-target range. |
| 1 | [micro:bit edge breakout with headers](https://www.sparkfun.com/sparkfun-qwiic-micro-bit-breakout-with-headers.html) | $6.25 / each | $6.25 | SparkFun BOB-16446. Exposes pins for I²C, two servo signals, two motor commands and two analog feedback inputs. Skip this purchase if class supplies an equivalent. |
| 2 | [10 kΩ linear potentiometers](https://www.adafruit.com/product/562) | $0.95 / each | $1.90 | One yaw and one pitch feedback sensor, as in the proposal. Print couplers/brackets; these are not modeled yet. Keep travel inside the pot stops and ADC signals within the micro:bit 3 V rail. |
| 1 | [74AHCT125 logic buffer](https://www.adafruit.com/product/1787) | $1.50 / each | $1.50 | 5 V-powered 3 V-to-5 V signal buffer for the servo command lines. Do not use it to send 5 V into micro:bit inputs or I²C. |
| 1 | [100 mm STEMMA QT / Qwiic cable](https://www.adafruit.com/product/4210) | $0.95 / cable | $0.95 | Connects breakout to range sensor. Budgeted separately because class cables may not include the small JST-SH connector; use a longer matching cable if routing needs it. |

## 03 / Power + blaster switching — $95.60

| Qty | Part / supplier | Unit or pack | Line total | Selection notes |
|---:|---|---:|---:|---|
| 1 | [Regulated 5 V, 10 A servo supply](https://www.adafruit.com/product/658) | $29.95 / each | $29.95 | Adafruit 658, mains cord included. Supplies aiming servos and 5 V logic interface; verify combined servo peak load. A suitable borrowed lab supply replaces this purchase. |
| 1 | [Four C alkaline cells](https://www.homedepot.com/p/300284185) | $9.27 / 4-pack | $9.27 | Energizer E93BP-4. Keep the stock 4-cell tray and stock motors at nominal 6 V. Secure the tray on the fixed base; no upgraded motors or lithium battery/charger budgeted. |
| 1 | [TC4427A dual gate-driver IC](https://www.digikey.com/en/products/detail/microchip-technology/TC4427ACPA/418665) | $1.78 / each | $1.78 | 8-pin DIP candidate. A 5 V supply lets 3.3 V commands drive the two MOSFET gates properly. This IC drives gates, not motors. |
| 2 | [IRLZ44NPBF power MOSFETs](https://www.digikey.com/en/products/detail/infineon-technologies/IRLZ44NPBF/811808) | $1.80 / each | $3.60 | Candidate low-side switches: one for the flywheel pair, one for the pusher. Use the gate driver; do not select by gate-threshold voltage or advertised maximum amps. Validate current, heating and pusher stopping behavior. |
| 1 | [Flyback rectifier set](https://www.st.com/resource/en/datasheet/stps20l40c.pdf) | $6.00 / set | $6.00 EST. | Budget for two power-rectifier packages, one per switched motor branch; STPS20L40CT is a candidate reference. Select wiring, pulse/current ratings and thermal arrangement from measured motor current. |
| 1 | [Bulk + decoupling capacitor set](https://www.digikey.com/en/products/category/capacitors/3) | $5.00 / set | $5.00 EST. | Budget: 1 servo-rail bulk capacitor, 2 motor-branch bulk capacitors, 3 motor-noise ceramics and local bypass capacitors for both ICs. Final capacitance, voltage rating and placement follow the circuit. |
| 1 | [Power wire + terminations](https://www.digikey.com/en/products/category/cables-wires/22) | $12.00 / batch | $12.00 EST. | Allow ~3 m of stranded power wire plus mating removable connectors, heat-shrink and strain relief. Choose gauge and connector ratings from startup current; class signal/USB cables are already covered. |
| 1 | [5 V power input + distribution](https://www.pololu.com/category/19/connectors) | $8.00 / set | $8.00 EST. | Matching 2.1 mm supply input/pigtail and two servo power branches. Select for measured current; a generic low-current barrel adapter or breadboard power rail is not assumed adequate. |
| 1 | [Two fuse holders + fuse assortment](https://www.digikey.com/en/products/category/circuit-protection/9) | $7.00 / set | $7.00 EST. | One protected servo supply branch and one protected blaster battery branch. Select fuses to protect the wiring while tolerating measured startup pulses. |
| 1 | [DC-rated power cutoff switch](https://www.digikey.com/en/products/category/switches/15) | $5.00 / each | $5.00 EST. | A suitable two-pole switch can interrupt both motor/servo power rails while USB logic remains powered. Match DC voltage/current ratings and wiring to the actual loads. |
| 1 | [Prototype board + mounting / thermal parts](https://www.adafruit.com/category/124) | $8.00 / batch | $8.00 EST. | Perfboard, IC sockets/headers, small enclosure or printed cover, standoffs and candidate heatsinks/insulators. Use adequately sized soldered conductors for motor current; validate heating. Resistors are class-provided. |

## 04 / Target + consumables — $15.00

| Qty | Part / supplier | Unit or pack | Line total | Selection notes |
|---:|---|---:|---:|---|
| 1 | [Compatible foam darts](https://shop.hasbro.com/en-us/nerf) | $10.00 / small pack | $10.00 EST. | Fresh Rapidstrike-compatible darts for repeatable tests; reuse straight, unworn existing darts to remove this allowance. |
| 1 | [Bright orange target + dart backstop](https://www.duckbrand.com/products/duck-tape/colors/neon-orange-188-in-x-15-yd) | $5.00 / set | $5.00 EST. | Orange card/tape on a stationary target, with a separate suitable dart-catching backstop made from available cardboard/fabric. Verify the material stops darts; target-only allowance assumes scrap backstop material. |

## Already covered / borrow

- Class-provided micro:bit, USB/signal cables and resistors.
- Existing laptop, 3D-printer access and filament: $0 new spend for saddles, rails, bearing holders, servo adapters, pot couplers and covers.
- Reuse the donor Rapidstrike, magazine, stock motors/pusher, battery tray and webcam from the project notes. This assumes the webcam can be attached to the moving cradle.
- Borrow workshop tools, soldering equipment, multimeter and a current-limited test supply for measurements. These tools are not in the purchase total.

## Only if missing — not included in the total

| Qty | Part / supplier | Unit or pack | Line total | Selection notes |
|---:|---|---:|---:|---|
| 1 | [Used Rapidstrike donor, magazine + tray](https://www.ebay.com/sch/i.html?_nkw=nerf+rapidstrike+cs18) | $35.00 / allowance | $35.00 EST. | Only if the existing donor is unavailable. Verify working flywheels/pusher and included magazine/tray. Marketplace search, not a verified listing. |
| 1 | [Small USB webcam](https://www.logitech.com/en-us/products/webcams.html) | $25.00 / allowance | $25.00 EST. | Only if the existing webcam cannot be reused. Check USB cable length, mounting, frame rate and camera support before choosing a model. |

Both replacements add $60.00 in allowances; neither is a verified fitted-product quote.

## Assumptions and selection notes

- This is one complete candidate BOM for the Recommended hybrid, not an addition to either earlier mount list. Prices checked October 27, 2026, in USD; exclude tax, shipping, tariffs and repeat battery/dart purchases. EST. means a planning allowance, not a quoted fitted product. Catalog links show where to select unresolved parts.

- The Ford case removes only the tagged wood, braces, pivot/general fasteners and two clamps, if staff can supply suitable equivalents at no project charge. Stock and borrowing availability are unconfirmed. It keeps servos, bearings, spacers, linkage, straps, padding and all electrical purchases.

- Before ordering fit-dependent parts, measure the trimmed receiver with magazine, camera and wiring installed; confirm inverted feeding and access. Set the loaded balance point, then finalize servo torque, pivot stacks, linkage length and fastener lengths. The recommended mock has no released fabrication CAD; the older CAD pack is a different mount.

- The proposed motor circuit is a budgeted custom two-channel circuit, not a plug-in wiring kit. Measure startup/stall demands using appropriate lab equipment before selecting final switches, suppression, wire, fuses and thermal parts. A jam or loss of power can leave the pusher between positions; retain or implement a return-to-home strategy before treating one command as one dart.

- Power plan: micro:bit from laptop USB; aiming servos/interfaces from regulated 5 V; stock blaster motors from the retained nominal 6 V cell tray. Use a common logic reference with deliberate high-current return routing. Do not feed either motor rail into the micro:bit 3 V pin. A schematic and physical validation are still required.

- The linked VL53L4CX and proposed VL53L0X need different drivers. Choose one before purchase; no second distance sensor is included. The two external pots preserve the proposed axis-feedback sensors; confirm the class rubric and implement their couplings. The on-board A/B button can confirm firing at $0; clap input can use the built-in microphone only on micro:bit V2.

- Buy in stages: first test the donor and borrowed power supplies, then assemble and balance the mount, then integrate sensing and motor switching. If class supplies the listed 5 V supply or breakout, subtract their line totals once. The original $120 allowance is below the full purchase estimate even in the conditional Ford case.

## Technical references

- [Hasbro Rapidstrike manual — 4 C cells, stock mechanism](https://www.hasbro.com/common/documents/dad2af6f1c4311ddbd0b0800200c9a66/2B48833750569047F598BEBD4AA242BA.pdf)
- [TC4427A datasheet — supply and input logic levels](https://ww1.microchip.com/downloads/aemDocuments/documents/APID/ProductDocuments/DataSheets/20001423J.pdf)
- [IRLZ44N datasheet — gate-drive conditions and thermal ratings](https://www.infineon.com/assets/row/public/documents/24/49/infineon-irlz44n-datasheet-en.pdf)
- [STPS20L40C candidate rectifier datasheet](https://www.st.com/resource/en/datasheet/stps20l40c.pdf)
- [Recommended mount mock notes](recommended-mount-plan.md)

This list does not modify the earlier mount scenes or CAD. No purchases are made by viewing the list.

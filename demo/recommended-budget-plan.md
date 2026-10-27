# Recommended build — path toward $120

The previous $272.24 list was a retail reference for the whole project; earlier ~$100 lists covered the mount and aiming servos. Both aiming servos are now confirmed owned, removing $39.90 from new purchases. This plan preserves two-axis movement, ranging, external position feedback and blaster switching.

**Parts if all resources below are confirmed: $62.75.** This leaves $57.25 within $120 for tax, shipping and missing supplies. It is a target, not a guaranteed checkout total. Consolidate class orders or use local pickup; multi-vendor shipping may exceed the reserve.

**Without the extra class breakout/pots and existing C cells: $80.17 in parts before tax/shipping.**

## Plan to buy

| Qty | Purchase | Unit / pack | Line total |
|---:|---|---:|---:|
| 1 | [4-inch lazy-Susan bearing](https://www.rockler.com/low-profile-lazy-susans) | $5.99 / each | $5.99 |
| 1 | [Two 8 × 22 × 7 mm pitch bearings](https://www.servocity.com/8mm-id-x-22mm-od-non-flanged-ball-bearing-2-pack/) | $3.99 / 2-pack | $3.99 |
| 1 | [8 mm ID steel spacers, pack of 4](https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/) | $1.99 / pack | $1.99 |
| 1 | [Pitch pushrod + two joint ends](https://www.servocity.com/linkages-threaded-rods/) | $10.00 / set | $10.00 EST. |
| 1 | [VL53L4CX distance-sensor breakout](https://www.adafruit.com/product/5425) | $14.95 / each | $14.95 |
| 1 | [74AHCT125 logic buffer](https://www.adafruit.com/product/1787) | $1.50 / each | $1.50 |
| 1 | [100 mm STEMMA QT / Qwiic cable](https://www.adafruit.com/product/4210) | $0.95 / cable | $0.95 |
| 1 | [TC4427A dual gate-driver IC](https://www.digikey.com/en/products/detail/microchip-technology/TC4427ACPA/418665) | $1.78 / each | $1.78 |
| 2 | [IRLZ44NPBF power MOSFETs](https://www.digikey.com/en/products/detail/infineon-technologies/IRLZ44NPBF/811808) | $1.80 / each | $3.60 |
| 1 | [Flyback rectifier set](https://www.st.com/resource/en/datasheet/stps20l40c.pdf) | $6.00 / set | $6.00 EST. |
| 1 | [Two fuse holders + fuse assortment](https://www.digikey.com/en/products/category/circuit-protection/9) | $7.00 / set | $7.00 EST. |
| 1 | [DC-rated power cutoff switch](https://www.digikey.com/en/products/category/switches/15) | $5.00 / each | $5.00 EST. |
| | **Parts subtotal** | | **$62.75** |

EST. denotes a planning allowance, not a fitted kit. Prices checked October 27, 2026. For current/fit selection notes see [the retail reference](recommended-shopping-list.md).

## Already covered

- Confirmed by the user: both aiming servos, micro:bit, class cables/resistors, 3D printer access and filament. The owned servo models are unspecified: verify their voltage/current, torque, horn spline and mounting dimensions; the prior Adafruit servo is a budget reference, not an identification of these servos.
- Reuse assumed from project notes: laptop, webcam, donor Rapidstrike, magazine, stock motors/pusher and battery tray. Fresh batteries are a separate check.

## Resource checks — not confirmed free stock

### Check Ford / Shop — avoids $50.67

Scrap plywood, four riser blocks, braces or equivalent gussets, pivot bolts, common fasteners and two borrowed clamps. Northwestern documents fastener stock and access to scrap material; sizes, availability and charges need staff confirmation. [Source](https://make.northwestern.edu/facilties/equipment-categories.html).

### Check class / electronics lab — avoids $62.95

Borrow a regulated 5 V supply with enough current for both servos, with suitable rated leads/distribution. Ask for power wire, capacitors, a solderable prototype board and any mounting/thermal parts required by testing. Published lab equipment and common-component stock do not guarantee the exact parts, current rating or permission to take supplies. [Source](https://ndm736.github.io/mechatronics/).

### Reuse / make from scraps — avoids $27.00

Use existing straps, padding and straight foam darts; make the orange target and a suitable dart-catching backstop from available card/fabric. If straps are unavailable, print fitted retaining caps using existing filament and class bolts, then verify retention and mechanism clearance. [Source](https://design.northwestern.edu/about/design-facilities/corner-makery.html).

### Extra checks to reach ~$62.75 — avoids $17.42

Class micro:bit edge breakout ($6.25) + two 10 kΩ pots ($1.90), and usable existing C cells ($9.27). These have NOT been confirmed. If missing, buy them: the parts subtotal becomes $80.17. Keep the pots for the proposed external-sensor requirement.

Northwestern's [Corner Makery page](https://design.northwestern.edu/about/design-facilities/corner-makery.html) explicitly allows use of the scrap bin under the mill. It does not guarantee suitable plywood dimensions or stock. [MAKE Northwestern](https://make.northwestern.edu/facilties/equipment-categories.html) lists fastener stock in the Shop and electronics resources in separate labs. The [mechatronics lab guide](https://ndm736.github.io/mechatronics/) documents power supplies, wire, capacitors and common ICs; exact part availability, charges and access/loan permission must be confirmed.

## Exact reconciliation against the prior $272.24 estimate

| Change | Saving |
|---|---:|
| Both aiming servos already owned | $39.90 |
| ServoCity bearing 2-pack instead of two VXB singles | $11.55 |
| Ford wood, fixings/braces and borrowed clamps | $50.67 |
| Borrow lab servo power; use lab wiring, capacitors and prototype board | $62.95 |
| Reuse straps, padding, darts and scrap target material | $27.00 |
| Class breakout + two pots; usable existing C cells | $17.42 |
| **Total reduction** | **$209.49** |

## If resources are missing

- Missing class breakout: add $6.25. Missing two pots: add $1.90. Missing usable C cells: add $9.27. All three add $17.42, giving $80.17 in parts.
- Missing suitable regulated 5 V servo supply AND rated lab leads/distribution: add $29.95 + $8.00. Verify combined servo peak load; an arbitrary lab output is not automatically adequate.
- Missing the tagged Ford wood/hardware/clamps: add $50.67 at the reference allowances. Missing lab capacitors/wire/board: add $25. Missing reusable straps/padding/darts/target materials: add up to $27.
- Existing class cables cover USB and signals, not automatically the gauge/current rating needed for motors. Confirm suitable power wiring and terminations separately.
- Keep the budgeted rectifiers, fuses/cutoff and suitable current-rated wiring. Confirm motor current and heat with appropriate lab equipment before final electrical selection. Retain or implement pusher return-to-home behavior.
- The two pots remain for the proposal's external-sensor requirement. Confirm class-supplied equivalents; do not silently remove a rubric requirement to meet budget.

## MVP scope

Keep stock blaster motors and battery voltage. Confirm firing with the existing on-board button or laptop interface; micro:bit V2 also has a microphone if clap input is added later. No new trigger servo, motor upgrade, lithium battery/charger or external microphone is included. Manual +/- yaw/pitch with user confirmation remains a viable first software milestone; it does not remove the physical mount/electrical purchases.

The recommended mount remains a mock, not fabrication CAD. Measure the loaded balance and trimmed shell; verify inverted feeding, servo torque, pivots and linkage fit. The new bearing pack has the same nominal 8 × 22 × 7 mm envelope, not a guarantee of press fit.

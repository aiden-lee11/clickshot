# Clickshot — split walkthrough demo

Run `npm start` from `~/Developer/clickshot/demo`, then open http://127.0.0.1:4173. Run `npm install` if dependencies are missing. `npm run check` checks JavaScript syntax.

## Presentation

The laptop camera and the physical scene share targets A, B and C. Click a target in either view or select **Play example**. The six-step sequence shows:

1. A camera click selects a stationary target.
2. The laptop converts pixel offsets to yaw and pitch (pinhole-camera angle calculation, with illustrative intrinsics).
3. An animated USB packet hands the command to the microcontroller.
4. The microcontroller moves the yaw and pitch servos. The orange aim marker converges on the selected target.
5. Only after centering, the simulated rangefinder samples the target distance.
6. The microcontroller applies an illustrative pitch trim and waits for confirmation.

Use the step buttons to revisit a stage, Pause/Resume to explain it, and Replay to restart from the home pose. Confirm foam shot or Simulate clap animates a foam dart; each shot needs another confirmation. Manual controls are folded away. Drag the 3D scene to orbit; Isometric restores the presentation view.

All camera, serial, sensor, microphone and firing events are simulated. Range trim is `(range − 1) × 1.2°`, an illustrative animation convention, not a calibrated ballistic solution. The displayed physical distances are illustrative; the 3D stage compresses distance for legibility. The visible dart animation is a presentation effect.

## Buildable mount concept

The model distinguishes matte printed parts, bought metal hardware, and a plywood base:

- **Print:** two gusseted cheek plates, an open frame cradle with balance adjustment slots, servo pockets/adapters, and bearing retainers. Candidate material: PETG. Velcro-style straps and pads secure the shell without blocking the top jam door or magazine removal.
- **Buy:** two 608 bearings; M8 bolts with smooth sleeves/spacers, washers and locknuts for the two short side pivots; M3 fasteners; a lazy-Susan turntable bearing; two standard positional metal-gear hobby servos with matching horns; plywood and soft feet.
- The two short pivot bolts attach to opposite sides of the printed cradle. No shaft passes through the blaster. Bearings support the pitch pivots, and a horn screws into a printed adapter to transfer servo torque.
- The bought turntable is bolted between the base and printed yaw deck. Its bearing supports the vertical load. A coaxial servo/horn adapter turns the deck. Hardware fit, assembly access and cable slack must be resolved in CAD around the actual purchased parts.
- Align the loaded center of mass with the pitch pivots using the slotted cradle. The model is not dimensioned CAD or a structural validation. Measure blaster mass, loaded balance, clearances and required torque before buying servos. Bearing fit and printed-part strength need prototype checks. No custom metal machining is assumed; ordinary drilling and screw assembly are.

### Manufacturer and assembly references

- [Adafruit: 608 bearings installed in printed servo holders](https://learn.adafruit.com/animatronic-cosplay-wings/servos-assembly)
- [Pololu: standard-size servo bracket and M3 mounting](https://www.pololu.com/product/3435)
- [LILY Bearing: lazy-Susan bearing examples](https://www.lily-bearing.com/product/applications/lazy-susan-bearings/)
- [Adafruit: standard metal-gear servo example](https://www.adafruit.com/product/1142)

These are component examples, not a validated purchase list or a claim that a particular servo will carry this blaster. No prices or load ratings are assumed in the mock.

## Source

`index.html` contains the split presentation interface; `style.css` the responsive layout; `app.js` the procedural Three.js model, target coordinates and walkthrough state machine; `server.mjs` serves only on loopback. Three.js is pinned in the package lock and served locally. The app makes no remote runtime requests. Reference links only open when clicked.

## Rapidstrike and second-stage presentation revision

The procedural blaster now follows the full Rapidstrike CS-18 silhouette and a published approximate 685 mm length reference. The new `mount-plan.md` records the source, proposed 360 × 300 mm base, 140 mm inner gap and 250 mm pivot height, and a linked candidate BOM. Local shell geometry and fit remain provisional until measured. Open **Buildable mount → View mount shopping list** for the supplier table and a plan download.

The embedded stage has larger live readings and a dedicated before/trim/after pitch comparison. The correction ramps over 3.2 seconds, with a blue camera-centered ghost pose and reference ray. The actual gun angle and orange ray move by the displayed trim; the physical rotation is not artificially magnified. **Replay trim** restarts just that motion. The laptop's command values are smaller and fade after handoff. Styling for this revision is isolated in `stage-two.css`.

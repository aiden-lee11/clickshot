import { createBudgetPlan, budgetHTML } from './recommended-budget.js';

// Prices are integer USD cents. Both the dialog and Markdown export use this data.
export const priceDate = 'October 27, 2026';
const item = (qty, name, url, unitCents, unit, note, extra = {}) => ({ qty, name, url, unitCents, unit, note, ...extra });
export const shoppingGroups = [
  { id:'mount', name:'01 / Mount + movement', items:[
    item(2,'Positional metal-gear servos','https://www.adafruit.com/product/1142',1995,'each','Two aiming servos already owned, confirmed by the user. Adafruit 1142 is only the earlier budget reference; the actual model is unspecified. Verify voltage/current, torque, horn spline and mounting dimensions for the owned servos.',{owned:true}),
    item(1,'4-inch lazy-Susan bearing','https://www.rockler.com/low-profile-lazy-susans',599,'each','Select Rockler #28969, 4-inch square. Supports yaw above four risers; transfer-drill its actual mounting pattern.'),
    item(2,'608ZZ pitch bearings','https://vxb.com/products/mr608-zz-ball-bearing-double-shielded-bore-di',777,'each','VXB MR608-ZZ, 8 × 22 × 7 mm. One per side, retained in small printed housings.'),
    item(1,'8 mm ID steel spacers, pack of 4','https://www.servocity.com/8mm-id-steel-spacer-12mm-od-10mm-length-4-pack/',199,'pack','12 mm OD × 10 mm long. Adapt the pivot stack so spacers contact inner races without rubbing shields.'),
    item(1,'1/2-inch plywood, 2 × 2 ft panel','https://www.homedepot.com/p/311925833',1472,'panel','Enough for the proposed 300 × 260 base, 180 × 180 deck and two ~80 × 121 mm uprights, with offcuts. Check actual thickness.',{ford:true}),
    item(1,'Wood stock for four riser blocks','https://design.northwestern.edu/about/design-facilities/prototyping-lab.html',500,'batch','Cut four ~60 mm-high blocks; final footprint must support bearing screws. Scrap first.',{estimate:true,ford:true}),
    item(1,'2-inch corner braces, pack of 4','https://www.homedepot.com/p/327600254',477,'pack','Everbilt 24520. Two braces per upright. Confirm hole locations and screw access.',{ford:true}),
    item(1,'Two M8 pivot bolt sets','https://boltdepot.com/Metric_hex_bolts',400,'pair of sets','Includes 2 partially threaded bolts, 2 locknuts and 4 washers. Select length AND smooth-shank length after measuring the complete pivot stack; not a fixed M8 × 40 order.',{estimate:true,ford:true}),
    item(1,'Remaining mount fasteners','https://boltdepot.com/Catalog',1200,'batch','Budget for 8 #6 turntable fixings, ~16 brace fixings, ~12 M3/M4 bearing-holder/servo/adapter fixings and 8 riser fixings, with matching nuts/washers. Counts and lengths remain provisional.',{estimate:true,ford:true}),
    item(1,'Pitch pushrod + two joint ends','https://www.servocity.com/linkages-threaded-rods/',1000,'set','One linkage only. Match rod, ends, pins and horn holes together; mock is 100 mm pin-to-pin / 24 mm crank radius. Catalog link, not a fitted kit.',{estimate:true}),
    item(1,'Reusable strap roll','https://www.velcro.com/products/organization/heavy-duty-one-wrap-roll/',800,'roll','Cut two straps around the trimmed receiver and saddles. Keep magazine removal and jam access clear.',{estimate:true}),
    item(1,'Thin foam/rubber padding','https://www.homedepot.com/b/Hardware-Weather-Stripping/N-5yc1vZc291',400,'small pack','Pads for both saddles and base contact points; offcuts are fine. Avoid compressing or obstructing the mechanism.',{estimate:true}),
    item(2,'Table clamps','https://www.homedepot.com/p/205512965',509,'each','BESSEY CM20, 2-inch opening. Check table + base thickness first; borrow suitable larger clamps if needed.',{ford:true})
  ]},
  { id:'sensing', name:'02 / Sensing + controller interfaces', items:[
    item(1,'VL53L4CX distance-sensor breakout','https://www.adafruit.com/product/5425',1495,'each','Your original link: Adafruit 5425. This is VL53L4CX, NOT the VL53L0X named in the proposal. Pick one model before writing the C driver; nominal maximum range is not a guaranteed dart-target range.'),
    item(1,'micro:bit edge breakout with headers','https://www.sparkfun.com/sparkfun-qwiic-micro-bit-breakout-with-headers.html',625,'each','SparkFun BOB-16446. Exposes pins for I²C, two servo signals, two motor commands and two analog feedback inputs. Skip this purchase if class supplies an equivalent.'),
    item(2,'10 kΩ linear potentiometers','https://www.adafruit.com/product/562',95,'each','One yaw and one pitch feedback sensor, as in the proposal. Print couplers/brackets; these are not modeled yet. Keep travel inside the pot stops and ADC signals within the micro:bit 3 V rail.'),
    item(1,'74AHCT125 logic buffer','https://www.adafruit.com/product/1787',150,'each','5 V-powered 3 V-to-5 V signal buffer for the servo command lines. Do not use it to send 5 V into micro:bit inputs or I²C.'),
    item(1,'100 mm STEMMA QT / Qwiic cable','https://www.adafruit.com/product/4210',95,'cable','Connects breakout to range sensor. Budgeted separately because class cables may not include the small JST-SH connector; use a longer matching cable if routing needs it.')
  ]},
  { id:'power', name:'03 / Power + blaster switching', items:[
    item(1,'Regulated 5 V, 10 A servo supply','https://www.adafruit.com/product/658',2995,'each','Adafruit 658, mains cord included. Supplies aiming servos and 5 V logic interface; verify combined servo peak load. A suitable borrowed lab supply replaces this purchase.'),
    item(1,'Four C alkaline cells','https://www.homedepot.com/p/300284185',927,'4-pack','Energizer E93BP-4. Keep the stock 4-cell tray and stock motors at nominal 6 V. Secure the tray on the fixed base; no upgraded motors or lithium battery/charger budgeted.'),
    item(1,'TC4427A dual gate-driver IC','https://www.digikey.com/en/products/detail/microchip-technology/TC4427ACPA/418665',178,'each','8-pin DIP candidate. A 5 V supply lets 3.3 V commands drive the two MOSFET gates properly. This IC drives gates, not motors.'),
    item(2,'IRLZ44NPBF power MOSFETs','https://www.digikey.com/en/products/detail/infineon-technologies/IRLZ44NPBF/811808',180,'each','Candidate low-side switches: one for the flywheel pair, one for the pusher. Use the gate driver; do not select by gate-threshold voltage or advertised maximum amps. Validate current, heating and pusher stopping behavior.'),
    item(1,'Flyback rectifier set','https://www.st.com/resource/en/datasheet/stps20l40c.pdf',600,'set','Budget for two power-rectifier packages, one per switched motor branch; STPS20L40CT is a candidate reference. Select wiring, pulse/current ratings and thermal arrangement from measured motor current.',{estimate:true}),
    item(1,'Bulk + decoupling capacitor set','https://www.digikey.com/en/products/category/capacitors/3',500,'set','Budget: 1 servo-rail bulk capacitor, 2 motor-branch bulk capacitors, 3 motor-noise ceramics and local bypass capacitors for both ICs. Final capacitance, voltage rating and placement follow the circuit.',{estimate:true}),
    item(1,'Power wire + terminations','https://www.digikey.com/en/products/category/cables-wires/22',1200,'batch','Allow ~3 m of stranded power wire plus mating removable connectors, heat-shrink and strain relief. Choose gauge and connector ratings from startup current; class signal/USB cables are already covered.',{estimate:true}),
    item(1,'5 V power input + distribution','https://www.pololu.com/category/19/connectors',800,'set','Matching 2.1 mm supply input/pigtail and two servo power branches. Select for measured current; a generic low-current barrel adapter or breadboard power rail is not assumed adequate.',{estimate:true}),
    item(1,'Two fuse holders + fuse assortment','https://www.digikey.com/en/products/category/circuit-protection/9',700,'set','One protected servo supply branch and one protected blaster battery branch. Select fuses to protect the wiring while tolerating measured startup pulses.',{estimate:true}),
    item(1,'DC-rated power cutoff switch','https://www.digikey.com/en/products/category/switches/15',500,'each','A suitable two-pole switch can interrupt both motor/servo power rails while USB logic remains powered. Match DC voltage/current ratings and wiring to the actual loads.',{estimate:true}),
    item(1,'Prototype board + mounting / thermal parts','https://www.adafruit.com/category/124',800,'batch','Perfboard, IC sockets/headers, small enclosure or printed cover, standoffs and candidate heatsinks/insulators. Use adequately sized soldered conductors for motor current; validate heating. Resistors are class-provided.',{estimate:true})
  ]},
  { id:'demo', name:'04 / Target + consumables', items:[
    item(1,'Compatible foam darts','https://shop.hasbro.com/en-us/nerf',1000,'small pack','Fresh Rapidstrike-compatible darts for repeatable tests; reuse straight, unworn existing darts to remove this allowance.',{estimate:true}),
    item(1,'Bright orange target + dart backstop','https://www.duckbrand.com/products/duck-tape/colors/neon-orange-188-in-x-15-yd',500,'set','Orange card/tape on a stationary target, with a separate suitable dart-catching backstop made from available cardboard/fabric. Verify the material stops darts; target-only allowance assumes scrap backstop material.',{estimate:true})
  ]}
];

export const ownedItems = [
  'Two aiming servos already owned, plus class-provided micro:bit, USB/signal cables and resistors.',
  'Existing laptop, 3D-printer access and filament: $0 new spend for saddles, rails, bearing holders, servo adapters, pot couplers and covers.',
  'Reuse the donor Rapidstrike, magazine, stock motors/pusher, battery tray and webcam from the project notes. This assumes the webcam can be attached to the moving cradle.',
  'Borrow workshop tools, soldering equipment, multimeter and a current-limited test supply for measurements. These tools are not in the purchase total.'
];

export const replacementItems = [
  item(1,'Used Rapidstrike donor, magazine + tray','https://www.ebay.com/sch/i.html?_nkw=nerf+rapidstrike+cs18',3500,'allowance','Only if the existing donor is unavailable. Verify working flywheels/pusher and included magazine/tray. Marketplace search, not a verified listing.',{estimate:true}),
  item(1,'Small USB webcam','https://www.logitech.com/en-us/products/webcams.html',2500,'allowance','Only if the existing webcam cannot be reused. Check USB cable length, mounting, frame rate and camera support before choosing a model.',{estimate:true})
];

export const purchaseNotes = [
  'This is one complete candidate BOM for the Recommended hybrid, not an addition to either earlier mount list. Prices checked October 27, 2026, in USD; exclude tax, shipping, tariffs and repeat battery/dart purchases. EST. means a planning allowance, not a quoted fitted product. Catalog links show where to select unresolved parts.',
  'The Ford case removes only the tagged wood, braces, pivot/general fasteners and two clamps, if staff can supply suitable equivalents at no project charge. Stock and borrowing availability are unconfirmed. The two owned aiming servos cost $0 new spend in both cases. It keeps purchased bearings, spacers, linkage, straps, padding and the remaining electrical items.',
  'Before ordering fit-dependent parts, measure the trimmed receiver with magazine, camera and wiring installed; confirm inverted feeding and access. Set the loaded balance point, then finalize servo torque, pivot stacks, linkage length and fastener lengths. The recommended mock has no released fabrication CAD; the older CAD pack is a different mount.',
  'The proposed motor circuit is a budgeted custom two-channel circuit, not a plug-in wiring kit. Measure startup/stall demands using appropriate lab equipment before selecting final switches, suppression, wire, fuses and thermal parts. A jam or loss of power can leave the pusher between positions; retain or implement a return-to-home strategy before treating one command as one dart.',
  'Power plan: micro:bit from laptop USB; aiming servos/interfaces from regulated 5 V; stock blaster motors from the retained nominal 6 V cell tray. Use a common logic reference with deliberate high-current return routing. Do not feed either motor rail into the micro:bit 3 V pin. A schematic and physical validation are still required.',
  'The linked VL53L4CX and proposed VL53L0X need different drivers. Choose one before purchase; no second distance sensor is included. The two external pots preserve the proposed axis-feedback sensors; confirm the class rubric and implement their couplings. The on-board A/B button can confirm firing at $0; clap input can use the built-in microphone only on micro:bit V2.',
  'Buy in stages: first test the donor and borrowed power supplies, then assemble and balance the mount, then integrate sensing and motor switching. If class supplies the listed 5 V supply or breakout, subtract their line totals once. This retail reference exceeds $120; the separate class-project plan identifies additional lab/reuse savings and unconfirmed resource checks.'
];

const rows = shoppingGroups.flatMap(group => group.items);
export const shoppingTotals = {
  total: rows.reduce((sum,row)=>sum+(row.owned?0:row.qty*row.unitCents),0),
  ownedValue: rows.filter(row=>row.owned).reduce((sum,row)=>sum+row.qty*row.unitCents,0),
  allowances: rows.filter(row=>row.estimate).reduce((sum,row)=>sum+row.qty*row.unitCents,0),
  fordSaving: rows.filter(row=>row.ford).reduce((sum,row)=>sum+row.qty*row.unitCents,0),
  groups: Object.fromEntries(shoppingGroups.map(group=>[group.id,group.items.reduce((sum,row)=>sum+(row.owned?0:row.qty*row.unitCents),0)]))
};
export const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export const budgetPlan = createBudgetPlan(shoppingGroups, shoppingTotals);
const escapeHTML = text => String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const table = items => `<div class="parts-table-wrap"><table><thead><tr><th scope="col">Qty</th><th scope="col">Part / selection notes</th><th scope="col" class="price-cell">Unit / pack</th><th scope="col" class="price-cell">Line total</th></tr></thead><tbody>${items.map(row=>`<tr><td>${row.qty}</td><td><a href="${escapeHTML(row.url)}" target="_blank" rel="noreferrer">${escapeHTML(row.name)} ↗</a><p>${escapeHTML(row.note)}</p>${row.ford?'<small class="ford-tag">CHECK FORD FIRST</small>':''}</td><td class="price-cell">${row.owned?'$0 new spend':money(row.unitCents)}<small>${row.owned?'OWNED':'/ '+escapeHTML(row.unit)}</small></td><td class="price-cell line-total">${money(row.owned?0:row.qty*row.unitCents)}${row.estimate?'<small class="estimate-tag">EST.</small>':''}</td></tr>`).join('')}</tbody></table></div>`;

export function initRecommendedShopping() {
  const dialog=document.getElementById('recommended-parts-dialog');
  const totals=shoppingTotals;
  dialog.innerHTML=`<div class="dialog-top"><div><span class="section-label">RECOMMENDED HYBRID / COMPLETE PROJECT BOM</span><h2 id="recommended-parts-title">What we need to buy</h2></div><button class="dialog-close" id="close-recommended-parts" aria-label="Close recommended shopping list">×</button></div>
    ${budgetHTML(budgetPlan)}<details class="budget-retail"><summary>Retail fallback — ${money(totals.total)} with both servos owned</summary><div class="budget-retail-body"><p class="dialog-intro">The trimmed, inverted Rapidstrike on a plywood frame. Mount, sensing, power and demo supplies in one list.</p>
    <div class="cost-summary"><div><span>RETAIL REFERENCE</span><strong>${money(totals.total)} <small>est.</small></strong></div><div><span>IF FORD SUPPLIES TAGGED ITEMS</span><strong>${money(totals.total-totals.fordSaving)} <small>est.</small></strong></div></div>
    <p class="cost-note">USD · Checked ${priceDate} · Before tax, shipping &amp; tariffs.<br>${money(totals.total-totals.allowances)} in listed prices + ${money(totals.allowances)} in <span class="estimate-tag">EST.</span> allowances. Ford savings: ${money(totals.fordSaving)}, conditional.</p>
    <div class="shopping-owned"><b>Already covered / assumed reuse · $0</b><p>2 owned aiming servos · micro:bit · class cables + resistors · laptop · printer + filament</p><p>Donor blaster + magazine + stock tray and webcam assumed available from your project notes. Replacement budgets are separate below.</p></div>
    <a class="shopping-download" href="recommended-shopping-list.md" download>Download the complete list + notes ↓</a>
    <div class="shopping-sections">${shoppingGroups.map(group=>`<details open id="shopping-${group.id}"><summary><span>${escapeHTML(group.name)}</span><b>${money(totals.groups[group.id])}</b></summary>${table(group.items)}</details>`).join('')}</div>
    <div class="shopping-total"><span>Full purchase estimate</span><b>${money(totals.total)}</b></div>
    <details class="shopping-notes"><summary>Assumptions, selection checks + ways to save</summary><ul>${purchaseNotes.map(note=>`<li>${escapeHTML(note)}</li>`).join('')}</ul><h3>Covered resources</h3><ul>${ownedItems.map(note=>`<li>${escapeHTML(note)}</li>`).join('')}</ul><p><a href="https://www.hasbro.com/common/documents/dad2af6f1c4311ddbd0b0800200c9a66/2B48833750569047F598BEBD4AA242BA.pdf" target="_blank" rel="noreferrer">Hasbro Rapidstrike manual ↗</a> · <a href="https://ww1.microchip.com/downloads/aemDocuments/documents/APID/ProductDocuments/DataSheets/20001423J.pdf" target="_blank" rel="noreferrer">Gate-driver datasheet ↗</a> · <a href="recommended-mount-plan.md" download>Hybrid build notes ↓</a></p></details>
    <details class="shopping-notes"><summary>Only if missing: donor blaster / webcam · excluded from total</summary>${table(replacementItems)}<p>Add up to ${money(replacementItems.reduce((sum,row)=>sum+row.qty*row.unitCents,0))} in replacement allowances if both are needed.</p></details>
    <p class="cost-scope">Candidate BOM, not a fitted kit or validated electrical design. The full purchase estimate exceeds the original $120 allowance; confirm class/Ford resources before ordering. None of the linked parts has been purchased.</p></div></details>`;
  document.getElementById('open-recommended-parts').addEventListener('click',()=>dialog.showModal());
  document.getElementById('close-recommended-parts').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}

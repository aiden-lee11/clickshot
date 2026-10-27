const price = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const sum = rows => rows.reduce((total,row)=>total+row.qty*row.unitCents,0);
const escape = text => String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function createBudgetPlan(groups,totals) {
  const original=groups.flatMap(group=>group.items);
  const select=names=>names.map(name=>{
    const row=original.find(row=>row.name===name);
    if(!row)throw new Error('Missing budget reference: '+name);
    return row;
  });
  const ford=original.filter(row=>row.ford);
  const owned=original.filter(row=>row.owned);
  const lab=select(['Regulated 5 V, 10 A servo supply','Bulk + decoupling capacitor set','Power wire + terminations','5 V power input + distribution','Prototype board + mounting / thermal parts']);
  const reuse=select(['Reusable strap roll','Thin foam/rubber padding','Compatible foam darts','Bright orange target + dart backstop']);
  const extra=select(['micro:bit edge breakout with headers','10 kΩ linear potentiometers','Four C alkaline cells']);
  const omitted=new Set([...ford,...lab,...reuse,...owned]);
  const core=original.filter(row=>!omitted.has(row)).map(row=>row.name==='608ZZ pitch bearings'?{
    ...row,qty:1,name:'Two 8 × 22 × 7 mm pitch bearings',unitCents:399,unit:'2-pack',url:'https://www.servocity.com/8mm-id-x-22mm-od-non-flanged-ball-bearing-2-pack/',
    note:'ServoCity 1600-0722-0008. Same nominal 8 × 22 × 7 mm envelope as the mock; check fit and clearances. This replaces the two $7.77 bearings, saving $11.55.'
  }:row);
  const extraNames=new Set(extra.map(row=>row.name));
  const purchases=core.filter(row=>!extraNames.has(row.name));
  const total=sum(purchases);
  return { purchases,core,extra,ford,lab,reuse,owned,ownedSaving:sum(owned),total,coreTotal:sum(core),reserve:12000-total,bearingSaving:totals.total-sum(core)-sum(ford)-sum(lab)-sum(reuse),
    resources:[
      {title:'Check Ford / Shop',saving:sum(ford),text:'Scrap plywood, four riser blocks, braces or equivalent gussets, pivot bolts, common fasteners and two borrowed clamps. Northwestern documents fastener stock and access to scrap material; sizes, availability and charges need staff confirmation.',url:'https://make.northwestern.edu/facilties/equipment-categories.html'},
      {title:'Check class / electronics lab',saving:sum(lab),text:'Borrow a regulated 5 V supply with enough current for both servos, with suitable rated leads/distribution. Ask for power wire, capacitors, a solderable prototype board and any mounting/thermal parts required by testing. Published lab equipment and common-component stock do not guarantee the exact parts, current rating or permission to take supplies.',url:'https://ndm736.github.io/mechatronics/'},
      {title:'Reuse / make from scraps',saving:sum(reuse),text:'Use existing straps, padding and straight foam darts; make the orange target and a suitable dart-catching backstop from available card/fabric. If straps are unavailable, print fitted retaining caps using existing filament and class bolts, then verify retention and mechanism clearance.',url:'https://design.northwestern.edu/about/design-facilities/corner-makery.html'},
      {title:'Extra checks to reach ~'+price(total),saving:sum(extra),text:`Class micro:bit edge breakout ($6.25) + two 10 kΩ pots ($1.90), and usable existing C cells ($9.27). These have NOT been confirmed. If missing, buy them: the parts subtotal becomes ${price(sum(core))}. Keep the pots for the proposed external-sensor requirement.`,url:null}
    ]
  };
}

export function budgetHTML(plan) {
  return `<p class="dialog-intro">The earlier ~$100 estimates covered the mount. The $272.24 reference added sensing, power, switching and separate retail packs of consumables. You now have both aiming servos, removing ${price(plan.ownedSaving)} from new purchases.</p>
    <div class="cost-summary"><div><span>PARTS IF RESOURCES CONFIRMED</span><strong>${price(plan.total)} <small>est.</small></strong></div><div><span>ROOM WITHIN $120</span><strong>${price(plan.reserve)} <small>remaining</small></strong></div></div>
    <p class="budget-condition"><b>Conditional plan — resources are not confirmed.</b> The remaining ${price(plan.reserve)} must cover tax, shipping and any missing supplies. Consolidate orders through class or use local pickup where practical; this is not a guaranteed $120 checkout total.</p>
    <p class="cost-note">If the breakout, two pots and usable C cells are missing: <b>${price(plan.coreTotal)} in parts</b> before tax/shipping. If an adequate lab servo supply and rated leads are unavailable, add the $29.95 supply + $8 distribution allowance. Keep the electrical protection in the purchase list.</p>
    <div class="shopping-owned"><b>Already covered · $0 new spend</b><p>Confirmed by you: both aiming servos, micro:bit, class cables/resistors, printer + filament. Check the owned servos’ actual voltage/current and mounting dimensions; their model is not specified. Reuse the donor blaster, magazine, tray, webcam and laptop from the project notes.</p></div>
    <a class="shopping-download" href="recommended-budget-plan.md" download>Download the $120 plan + resource checklist ↓</a>
    <details open class="budget-buy"><summary>Plan to buy <b>${price(plan.total)}</b></summary><div class="parts-table-wrap"><table><thead><tr><th scope="col">Qty</th><th scope="col">Purchase / why</th><th scope="col" class="price-cell">Line total</th></tr></thead><tbody>${plan.purchases.map(row=>`<tr><td>${row.qty}${row.unit==='2-pack'?' pack':''}</td><td><a href="${escape(row.url)}" target="_blank" rel="noreferrer">${escape(row.name)} ↗</a><small>${row.unit==='each'?price(row.unitCents)+' each':escape(row.unit)}${row.name==='Two 8 × 22 × 7 mm pitch bearings'?' · replaces the $15.54 pair':''}</small></td><td class="price-cell line-total">${price(row.qty*row.unitCents)}${row.estimate?'<small class="estimate-tag">EST.</small>':''}</td></tr>`).join('')}</tbody></table></div></details>
    <div class="budget-resources"><h3>Get from class / Ford / reuse — check first</h3>${plan.resources.map(resource=>`<div><h4>${escape(resource.title)} <span>avoids ${price(resource.saving)}</span></h4><p>${escape(resource.text)}${resource.url?` <a href="${escape(resource.url)}" target="_blank" rel="noreferrer">Resource reference ↗</a>`:''}</p></div>`).join('')}</div>
    <p class="cost-note"><b>Same project functions:</b> two powered axes, range measurement, external pots and two-channel blaster switching remain. Use stock motors, the existing magazine and button confirmation; no extra trigger servo, battery upgrade, charger or separate clap sensor is needed for this MVP. Servo torque, motor current and mount fit still need checking.</p>
    <div class="budget-reconcile"><h3>Where the ${price(27224-plan.total)} reduction comes from</h3><p>Owned aiming servos ${price(plan.ownedSaving)} + cheaper bearing pair ${price(plan.bearingSaving)} + Ford wood/hardware/clamps ${price(sum(plan.ford))} + borrowed lab power/supplies ${price(sum(plan.lab))} + reuse/scraps ${price(sum(plan.reuse))} + breakout/pots/cells checks ${price(sum(plan.extra))}. Each saving is counted once.</p></div>`;
}

export function budgetMarkdown(plan) {
  return `# Recommended build — path toward $120

The previous $272.24 list was a retail reference for the whole project; earlier ~$100 lists covered the mount and aiming servos. Both aiming servos are now confirmed owned, removing ${price(plan.ownedSaving)} from new purchases. This plan preserves two-axis movement, ranging, external position feedback and blaster switching.

**Parts if all resources below are confirmed: ${price(plan.total)}.** This leaves ${price(plan.reserve)} within $120 for tax, shipping and missing supplies. It is a target, not a guaranteed checkout total. Consolidate class orders or use local pickup; multi-vendor shipping may exceed the reserve.

**Without the extra class breakout/pots and existing C cells: ${price(plan.coreTotal)} in parts before tax/shipping.**

## Plan to buy

| Qty | Purchase | Unit / pack | Line total |
|---:|---|---:|---:|
${plan.purchases.map(row=>`| ${row.qty} | [${row.name}](${row.url}) | ${price(row.unitCents)} / ${row.unit} | ${price(row.qty*row.unitCents)}${row.estimate?' EST.':''} |`).join('\n')}
| | **Parts subtotal** | | **${price(plan.total)}** |

EST. denotes a planning allowance, not a fitted kit. Prices checked October 27, 2026. For current/fit selection notes see [the retail reference](recommended-shopping-list.md).

## Already covered

- Confirmed by the user: both aiming servos, micro:bit, class cables/resistors, 3D printer access and filament. The owned servo models are unspecified: verify their voltage/current, torque, horn spline and mounting dimensions; the prior Adafruit servo is a budget reference, not an identification of these servos.
- Reuse assumed from project notes: laptop, webcam, donor Rapidstrike, magazine, stock motors/pusher and battery tray. Fresh batteries are a separate check.

## Resource checks — not confirmed free stock

${plan.resources.map(resource=>`### ${resource.title} — avoids ${price(resource.saving)}\n\n${resource.text}${resource.url?` [Source](${resource.url}).`:''}`).join('\n\n')}

Northwestern's [Corner Makery page](https://design.northwestern.edu/about/design-facilities/corner-makery.html) explicitly allows use of the scrap bin under the mill. It does not guarantee suitable plywood dimensions or stock. [MAKE Northwestern](https://make.northwestern.edu/facilties/equipment-categories.html) lists fastener stock in the Shop and electronics resources in separate labs. The [mechatronics lab guide](https://ndm736.github.io/mechatronics/) documents power supplies, wire, capacitors and common ICs; exact part availability, charges and access/loan permission must be confirmed.

## Exact reconciliation against the prior $272.24 estimate

| Change | Saving |
|---|---:|
| Both aiming servos already owned | ${price(plan.ownedSaving)} |
| ServoCity bearing 2-pack instead of two VXB singles | ${price(plan.bearingSaving)} |
| Ford wood, fixings/braces and borrowed clamps | ${price(sum(plan.ford))} |
| Borrow lab servo power; use lab wiring, capacitors and prototype board | ${price(sum(plan.lab))} |
| Reuse straps, padding, darts and scrap target material | ${price(sum(plan.reuse))} |
| Class breakout + two pots; usable existing C cells | ${price(sum(plan.extra))} |
| **Total reduction** | **${price(27224-plan.total)}** |

## If resources are missing

- Missing class breakout: add $6.25. Missing two pots: add $1.90. Missing usable C cells: add $9.27. All three add $17.42, giving ${price(plan.coreTotal)} in parts.
- Missing suitable regulated 5 V servo supply AND rated lab leads/distribution: add $29.95 + $8.00. Verify combined servo peak load; an arbitrary lab output is not automatically adequate.
- Missing the tagged Ford wood/hardware/clamps: add ${price(sum(plan.ford))} at the reference allowances. Missing lab capacitors/wire/board: add $25. Missing reusable straps/padding/darts/target materials: add up to $27.
- Existing class cables cover USB and signals, not automatically the gauge/current rating needed for motors. Confirm suitable power wiring and terminations separately.
- Keep the budgeted rectifiers, fuses/cutoff and suitable current-rated wiring. Confirm motor current and heat with appropriate lab equipment before final electrical selection. Retain or implement pusher return-to-home behavior.
- The two pots remain for the proposal's external-sensor requirement. Confirm class-supplied equivalents; do not silently remove a rubric requirement to meet budget.

## MVP scope

Keep stock blaster motors and battery voltage. Confirm firing with the existing on-board button or laptop interface; micro:bit V2 also has a microphone if clap input is added later. No new trigger servo, motor upgrade, lithium battery/charger or external microphone is included. Manual +/- yaw/pitch with user confirmation remains a viable first software milestone; it does not remove the physical mount/electrical purchases.

The recommended mount remains a mock, not fabrication CAD. Measure the loaded balance and trimmed shell; verify inverted feeding, servo torque, pivots and linkage fit. The new bearing pack has the same nominal 8 × 22 × 7 mm envelope, not a guarantee of press fit.
`;
}

import { writeFile } from 'node:fs/promises';
import { shoppingGroups, shoppingTotals, ownedItems, replacementItems, purchaseNotes, money, priceDate } from '../recommended-shopping.js';

const table = items => ['| Qty | Part / supplier | Unit or pack | Line total | Selection notes |','|---:|---|---:|---:|---|',...items.map(row=>`| ${row.qty} | [${row.name}](${row.url})${row.ford?' · CHECK FORD FIRST':''} | ${money(row.unitCents)} / ${row.unit} | ${money(row.qty*row.unitCents)}${row.estimate?' EST.':''} | ${row.note} |`)].join('\n');
const t=shoppingTotals;
const output=`# Recommended hybrid — complete shopping list

Prices checked ${priceDate}. USD; before tax, shipping and tariffs. Candidate BOM for the trimmed, inverted Rapidstrike on the plywood hybrid mount. Choose this list instead of adding together the earlier mount lists.

- **Remaining purchases: ${money(t.total)} estimated.**
- **If Ford supplies all tagged items at no charge: ${money(t.total-t.fordSaving)} estimated** (saves ${money(t.fordSaving)}).
- Listed-price subtotal: ${money(t.total-t.allowances)}. Planning allowances marked EST.: ${money(t.allowances)}.
- These totals assume an existing donor blaster, magazine, stock battery tray and webcam, as stated in the project notes. Class micro:bit, cables, resistors, printer access and filament are already covered.
- The full estimate exceeds the original $120 project allowance. Check available lab supplies before ordering; prices do not guarantee stock or fit.

${shoppingGroups.map(group=>`## ${group.name} — ${money(t.groups[group.id])}\n\n${table(group.items)}`).join('\n\n')}

## Already covered / borrow

${ownedItems.map(note=>'- '+note).join('\n')}

## Only if missing — not included in the total

${table(replacementItems)}

Both replacements add ${money(replacementItems.reduce((sum,row)=>sum+row.qty*row.unitCents,0))} in allowances; neither is a verified fitted-product quote.

## Assumptions and selection notes

${purchaseNotes.map(note=>'- '+note).join('\n\n')}

## Technical references

- [Hasbro Rapidstrike manual — 4 C cells, stock mechanism](https://www.hasbro.com/common/documents/dad2af6f1c4311ddbd0b0800200c9a66/2B48833750569047F598BEBD4AA242BA.pdf)
- [TC4427A datasheet — supply and input logic levels](https://ww1.microchip.com/downloads/aemDocuments/documents/APID/ProductDocuments/DataSheets/20001423J.pdf)
- [IRLZ44N datasheet — gate-drive conditions and thermal ratings](https://www.infineon.com/assets/row/public/documents/24/49/infineon-irlz44n-datasheet-en.pdf)
- [STPS20L40C candidate rectifier datasheet](https://www.st.com/resource/en/datasheet/stps20l40c.pdf)
- [Recommended mount mock notes](recommended-mount-plan.md)

This list does not modify the earlier mount scenes or CAD. No purchases are made by viewing the list.
`;
await writeFile(new URL('../recommended-shopping-list.md',import.meta.url),output);
console.log(JSON.stringify(t,null,2));

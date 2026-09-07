# Free-resource design and accuracy release

The pro forma and downloadable models had not received the same depth of product review as the main conversion pages. This release gives the complete free collection a consistent visual identity and corrects identified financial defects. A resource is not complete when its link works: the interface, calculations, export, download, printout and onward inquiry all need review.

## Result and design decisions

- `/proforma.html` now uses the personal site's wordmark, shared navigation/footer, forest and ivory palette, restrained blue actions and editorial headings. Inputs, annual results, the operating statement and exit estimate have distinct jobs. Unsupported A–F investment grades are removed.
- `/resources/` brings the five existing offerings together. The workflow worksheet leads toward operating-system work; the pro forma and Excel models support financial inquiries. Every offering remains ungated, with accurate format and scope descriptions.
- `/workflow-check/` supports typing notes and printing them. Notes are deliberately temporary: an explanation appears before the fields. JavaScript-disabled visitors receive an honest blank-paper fallback, not editable notes that disappear on printing.
- All three Excel downloads have coordinated branding, input/formula distinctions, explicit units, assumptions, print setup and finance contact links. Original URLs remain valid. The homepage and collection use a release query on download links to bypass older browser caches.
- Resource-specific sharing cards, titles, descriptions, canonical URLs, crawlable copy, schema and sitemap entries match the offer. Social cards are generated from `tools/render-resource-previews.cjs`; no new font, UI-library or image dependency is loaded by the calculator itself.
- Contextual conversations retain `topic=finance` for the pro forma and `topic=ai` for the worksheet. The mixed collection uses the general inquiry. Opening a conversation does not attach entered financial data.

## Calculation corrections and conventions

The dependency-free `proforma-model.js` is the sole calculation source. `proforma-ui.js` handles presentation and local scenarios. All monetary examples are illustrative USD assumptions, not market data or recommendations.

- Zero-interest borrowing still repays principal. Monthly payments and remaining balances handle partial final years and stop at payoff.
- Fixed management expenses survive the projection and grow with expense inflation. Percentage management follows effective income.
- Exactly N operating years are shown, with no initial growth applied to Year 1. Exit value uses forward Year N+1 NOI, then deducts selling costs and remaining debt.
- NOI is shown before the separately disclosed reserve and capital allowances. Those costs reduce cash flow once. Undefined denominators remain unavailable; an all-cash purchase has no debt-coverage ratio.
- Leasing and tenant-improvement bases and timing are explicit. Inactive invalid drafts do not block the selected basis; the UI retains the draft and explains normalized exported values.
- Legacy v3 scenarios preserve valid entries with migration notes for changed conventions. Blank, malformed and unsupported imports never replace an open scenario. Device saving is opt-in; denied storage does not break calculations or file export.

Workbook corrections include annual ACV-to-monthly-revenue conversion, churn-inclusive retention and active-customer tracking; linked depreciation, capital expenditure, cash flow and balance-sheet reconciliation; and acquisition cash flows including interest, principal and exit proceeds. MOIC includes later equity contributions, separating an exit-year operating shortfall from sale proceeds under the disclosed funding convention. IRR uses net annual equity cash flows. The acquisition workbook remains a simplified return model, not full purchase accounting or due diligence.

Primary definition references: [Fannie Mae operating statement](https://multifamily.fanniemae.com/media/document/pdf/form-4254), [OCC CRE lending handbook](https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/commercial-real-estate-lending/pub-ch-commercial-real-estate.pdf), and [CFPB amortization explanation](https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/). These support definitions; the page explicitly discloses model-specific conventions where underwriting practice varies.

## Verification and repeatable gates

Build and stage before testing published metadata:

```sh
node build-blog.js
node stage-public.cjs
python3 tools/validate-public.py
node --test tests/proforma-model.test.cjs
PLAYWRIGHT_MODULE=/path/to/playwright node --test tests/app-behavior.test.cjs tests/layout-regression.test.cjs tests/preview-metadata.test.cjs tests/proforma-ui.test.cjs
```

The model suite contains 28 independent and boundary cases. Browser coverage checks 320/390/768/1440px, focus/labels, mode changes, invalid input, imports/exports, inert HTML-like text, unavailable or malformed storage, actual opt-in save/reload/readback, resource links, printing and the no-JavaScript alternative. Existing main-site inquiry/menu/layout tests remain required. Local browser routes block outbound writes; no real inquiry was submitted for this release.

Workbook verification covers 17 independent numerical scenarios before export and again after importing the packaged XLSX files. All 959 formula cells have cached values and no formula errors; all nine sheets were rendered and reviewed. Native print areas and links were structurally inspected. Recalculation used the bundled spreadsheet engine plus independent arithmetic; native desktop Excel/Numbers and physical workbook printing were not separately tested.

Manual review also covers all resource layouts, actual browser PDF pages, long worksheet notes and responsive line-break spacing. Keep the following regression lessons:

1. Document overflow passing is insufficient: inspect narrow currency cells and scenario titles for mid-number or mid-name clipping.
2. A hidden inactive numeric field must not silently block results. Preserve the raw draft and make any export normalization visible.
3. Put a literal space around responsive `<br>` elements. Hiding a line break must not join words in mobile or print output.
4. Validate the printable artifact itself: brand attribution, assumptions, complete notes, all table columns, and no focused-field decoration.
5. Recalculate every altered workbook, compare independent numerical fixtures and changed-input scenarios, and re-import the exported file. Formatting must not overwrite formulas or hide unreconciled balances.
6. Return calculations must include cash contributions and distributions with explicit timing. Do not net a funded operating shortfall against a later sale when reporting gross MOIC contributions.
7. Hash the actual live downloads against the verified files. Version download links after changing files with long browser caching.
8. Preserve the explicit public staging allowlist. Never publish private render sources, internal reports, real scenarios, tax identifiers or credentials.

## Limits and measurement

The calculator is a rental-property screening model. It does not model lease rollover, taxes, refinancing, balloons, rent recoveries or partner distributions. Internal precision is retained; displayed dollars are rounded. Actual lender schedules may differ by cent rounding.

Browser/PDF verification uses Chromium with desktop-emulated viewports; physical iOS devices, assistive-technology sessions and physical printers were not exercised. Workbook verification details and engine limitations are retained with the private release evidence. This is tested model behavior, not a universal accuracy guarantee.

The design makes the resources easier to use and connects them to relevant inquiries. Qualified-inquiry and conversion uplift still require observed traffic evidence. Do not label this statistically optimal or invent a lift. Existing inquiry fields and server persistence are unchanged.

Deployment is the normal reviewed Git push to `main` followed by verification of the Netlify published commit, actual live UI and download hashes. Historical deployment deletion is a separate privacy action and is not authorized by this release.

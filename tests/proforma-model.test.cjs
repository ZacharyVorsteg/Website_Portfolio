'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../proforma-model.js');
const copy = value => JSON.parse(JSON.stringify(value));
function close(actual, expected, tolerance = 1e-7) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
}
function neutral(overrides = {}) {
  const input = copy(model.defaultInputs);
  for (const key of ['closingCosts', 'immediateRepairs', 'laundryIncome', 'parkingIncome', 'otherIncome', 'vacancyPct', 'realEstateTaxes', 'insurance', 'repairsMaintenance', 'utilities', 'management', 'managementPct', 'trash', 'landscaping', 'reserves', 'capitalReserves', 'leaseCommissions', 'leaseCommissionsPct', 'tenantImprovements', 'tenantImprovementsPSF', 'annualRentIncrease', 'annualExpenseIncrease']) input[key] = 0;
  return { ...input, purchasePrice: 240000, downPaymentPct: 100, managementMode: 'fixed', units: [{ id: 'one', unitNumber: 'Unit 1', tenant: '', sqft: 1000, rent: 1000 }], ...overrides };
}
function finiteTree(value) {
  if (typeof value === 'number') assert.ok(Number.isFinite(value), 'Model output contains a non-finite number');
  else if (value && typeof value === 'object') Object.values(value).forEach(finiteTree);
}

test('independent fixed-rate amortization fixture', () => {
  close(model.monthlyPayment(375000, 7, 30), 2494.884356921934);
  close(model.loanBalance(375000, 7, 30, 60), 352993.46196671965);
  const result = model.calculate(neutral({ purchasePrice: 500000, downPaymentPct: 25, interestRate: 7, loanTermYears: 30 }));
  close(result.annualDebtService, 29938.61228306321);
  close(result.exit.loanBalance, 352993.46196671965);
});

test('zero-interest loan pays principal and stops after its term', () => {
  close(model.monthlyPayment(12000, 0, 2), 500);
  close(model.loanBalance(12000, 0, 2, 18), 3000);
  const result = model.calculate(neutral({ purchasePrice: 12000, downPaymentPct: 0, interestRate: 0, loanTermYears: 2, projectionYears: 3 }));
  assert.deepEqual(result.years.map(y => y.debtService), [6000, 6000, 0]);
  assert.deepEqual(result.years.map(y => y.loanBalance), [6000, 0, 0]);
  assert.deepEqual(result.years.map(y => y.principalPaid), [6000, 6000, 0]);
  assert.deepEqual(result.years.map(y => y.interestPaid), [0, 0, 0]);
  assert.equal(result.years[2].dscr, null);
});

test('partial-year amortization charges only the remaining monthly payments', () => {
  const result = model.calculate(neutral({ purchasePrice: 18000, downPaymentPct: 0, interestRate: 0, loanTermYears: 1.5, projectionYears: 3 }));
  assert.deepEqual(result.years.map(y => y.debtService), [12000, 6000, 0]);
  assert.deepEqual(result.years.map(y => y.beginningLoanBalance), [18000, 6000, 0]);
  assert.deepEqual(result.years.map(y => y.loanBalance), [6000, 0, 0]);
  const oneMonth = model.calculate(neutral({ purchasePrice: 1000, downPaymentPct: 0, interestRate: 12, loanTermYears: 1 / 12 }));
  close(oneMonth.annualDebtService, 1010);
  assert.equal(oneMonth.years[0].loanBalance, 0);
});

test('closed-form balance agrees with independent month-by-month repayment', () => {
  for (const [principal, rate, years, paid] of [[100000, 5, 30, 180], [42000, 19.5, 5, 37], [98765, 0, 2, 23], [100000, 0.0000001, 30, 359]]) {
    const payment = model.monthlyPayment(principal, rate, years);
    let runningBalance = principal;
    for (let month = 0; month < paid; month++) runningBalance -= payment - runningBalance * rate / 1200;
    close(model.loanBalance(principal, rate, years, paid), runningBalance, 1e-6);
    assert.equal(model.loanBalance(principal, rate, years, years * 12), 0);
    assert.equal(model.loanBalance(principal, rate, years, years * 12 + 120), 0);
  }
  // Independent 80-digit Decimal month-by-month recurrence; ordinary doubles lose precision here.
  close(model.loanBalance(1000, 100, 50, 550), 981.7234302988808);
  assert.equal(model.loanBalance(1000, 100, 50, 600), 0);
});

test('cash purchase has no debt and undefined debt-coverage ratios', () => {
  const result = model.calculate(neutral({ purchasePrice: 0.29, loanTermYears: 0 }));
  assert.equal(result.loanAmount, 0);
  assert.equal(result.monthlyMortgage, 0);
  assert.equal(result.dscr, null);
  assert.equal(result.dscrAfterReserves, null);
  assert.ok(result.years.every(y => y.debtService === 0 && y.loanBalance === 0 && y.dscr === null));
});

test('fixed management survives every projection and grows with expenses', () => {
  const result = model.calculate(neutral({ units: [{ id: 'one', rent: 2000, sqft: 1000 }], management: 1200, managementPct: 99, managementMode: 'fixed', realEstateTaxes: 3600, annualRentIncrease: 3, annualExpenseIncrease: 2 }));
  close(result.noi, 19200);
  close(result.years[1].egr, 24720);
  close(result.years[1].management, 1224);
  close(result.years[1].opex - result.years[1].management, 3672);
  close(result.years[1].noi, 19824);
});

test('percentage management tracks effective revenue and ignores inactive fixed cost', () => {
  const result = model.calculate(neutral({ units: [{ id: 'one', rent: 2000, sqft: 1000 }], management: 99999, managementPct: 10, managementMode: 'percent', vacancyPct: 10, otherIncome: 100, annualRentIncrease: 10, annualExpenseIncrease: 50 }));
  close(result.effectiveGrossRevenue, 22680);
  close(result.calcManagement, 2268);
  close(result.years[1].management, 2494.8);
});

test('operating year 1 is uninflated and exactly N years are returned', () => {
  const result = model.calculate(neutral({ annualRentIncrease: 10, projectionYears: 3, startYear: 2027 }));
  assert.deepEqual(result.years.map(y => [y.year, y.calendarYear]), [[1, 2027], [2, 2028], [3, 2029]]);
  close(result.years[0].annualRent, 12000);
  close(result.years[1].annualRent, 13200);
  close(result.years[2].annualRent, 14520);
  assert.equal(result.exit.year, 3);
  assert.equal(result.exit.calendarYear, 2029);
  assert.equal(result.exit.forwardYear, 4);
  close(result.exit.forwardNOI, 15972);
  assert.equal(model.calculate(neutral({ projectionYears: 1 })).years.length, 1);
});

test('independent five-year sale fixture uses forward NOI and net equity', () => {
  const result = model.calculate(neutral({ purchasePrice: 300000, downPaymentPct: 25, interestRate: 6, loanTermYears: 30, units: [{ id: 'one', rent: 3000, sqft: 1000 }], vacancyPct: 5, managementMode: 'percent', managementPct: 8, realEstateTaxes: 9000, annualRentIncrease: 3, annualExpenseIncrease: 2, projectionYears: 5, exitCapRate: 6, sellingCostsPct: 6 }));
  close(result.years[4].noi, 25671.11975784001);
  close(result.exit.forwardNOI, 26538.672244975198);
  close(result.exit.value, 442311.20408292);
  close(result.exit.sellingCosts, 26538.672244975198);
  close(result.exit.loanBalance, 209372.3028513432);
  close(result.exit.netProceeds, 206400.22898660155);
  assert.notEqual(result.exit.value, result.years[4].noi / 0.06);
});

test('sale may return negative net proceeds; no favorable clamp or reserve recovery', () => {
  const result = model.calculate(neutral({ purchasePrice: 1000000, downPaymentPct: 0, units: [{ id: 'one', rent: 100, sqft: 1000 }], capitalReserves: 10000, sellingCostsPct: 100 }));
  assert.ok(result.exit.value > 0);
  close(result.exit.netProceeds, -result.exit.loanBalance);
});

test('reserves reduce cash flow once and do not reduce the disclosed NOI', () => {
  const result = model.calculate(neutral({ reserves: 1200, capitalReserves: 1000, realEstateTaxes: 2000, management: 1000, annualExpenseIncrease: 2 }));
  close(result.totalOperatingExpenses, 3000);
  close(result.noi, 9000);
  close(result.annualReserves, 2200);
  close(result.cashFlowBeforeDebt, 6800);
  close(result.years[1].annualReserves, 2244);
  assert.ok(result.warnings.some(w => w.code === 'separate-reserves'));
  assert.equal(model.defaultInputs.reserves, 0);
  assert.equal(model.defaultInputs.capitalReserves, 2200);
});

test('DSCR convention and after-reserve alternative are explicit', () => {
  const result = model.calculate(neutral({ purchasePrice: 12000, downPaymentPct: 0, interestRate: 0, loanTermYears: 2, capitalReserves: 1200, leaseCommissions: 600 }));
  close(result.dscr, 2);
  close(result.dscrAfterReserves, 1.8);
  close(result.cashFlowAfterDebt, 4200);
});

test('fixed leasing and TI modes ignore inactive alternatives and apply year-1 timing', () => {
  const result = model.calculate(neutral({ leaseCommissions: 1200, leaseCommissionsPct: 50, leaseCommissionsMode: 'fixed', tenantImprovements: 2000, tenantImprovementsPSF: 500, tenantImprovementsMode: 'fixed', annualExpenseIncrease: 20 }));
  assert.deepEqual(result.years.map(y => y.leaseCommissions), [1200, 0, 0, 0, 0]);
  assert.deepEqual(result.years.map(y => y.tenantImprovements), [2000, 0, 0, 0, 0]);
  close(result.cashFlowBeforeDebt, 8800);
});

test('annual percentage leasing uses unit rent only; TI PSF uses area and expense growth', () => {
  const result = model.calculate(neutral({ otherIncome: 10000, vacancyPct: 50, leaseCommissions: 99999, leaseCommissionsPct: 10, leaseCommissionsMode: 'percent', leaseCommissionsTiming: 'annual', tenantImprovements: 99999, tenantImprovementsPSF: 2, tenantImprovementsMode: 'psf', tenantImprovementsTiming: 'annual', annualRentIncrease: 10, annualExpenseIncrease: 20 }));
  close(result.calcLeaseCommissions, 1200);
  close(result.years[1].leaseCommissions, 1320);
  close(result.calcTenantImprovements, 2000);
  close(result.years[1].tenantImprovements, 2400);
});

test('annual fixed leasing allowance grows once with expenses', () => {
  const result = model.calculate(neutral({ leaseCommissions: 1000, leaseCommissionsTiming: 'annual', annualExpenseIncrease: 10, annualRentIncrease: 50 }));
  close(result.years[1].leaseCommissions, 1100);
});

test('invalid inactive fee alternatives are disclosed and normalized without changing the raw draft', () => {
  const pairs = [
    ['managementMode', 'fixed', 'managementPct', 'percent'],
    ['managementMode', 'percent', 'management', 'fixed'],
    ['leaseCommissionsMode', 'fixed', 'leaseCommissionsPct', 'percent'],
    ['leaseCommissionsMode', 'percent', 'leaseCommissions', 'fixed'],
    ['tenantImprovementsMode', 'fixed', 'tenantImprovementsPSF', 'psf'],
    ['tenantImprovementsMode', 'psf', 'tenantImprovements', 'fixed'],
  ];
  for (const [mode, inactiveMode, field, activeMode] of pairs) for (const invalid of [-1, '', 'not a number', Infinity]) {
    const draft = neutral({ [mode]: inactiveMode, [field]: invalid });
    const validation = model.validateInputs(draft);
    assert.equal(validation.valid, true, `${field} is inactive`);
    assert.equal(validation.inputs[field], 0);
    assert.equal(draft[field], invalid, 'Normalization must not erase the UI draft');
    assert.ok(validation.warnings.some(w => w.field === field && w.code === 'inactive-ignored'));
    const result = model.calculate(draft);
    assert.ok(result.warnings.some(w => w.field === field && w.code === 'inactive-ignored'));
    finiteTree(result);
    const active = model.validateInputs({ ...draft, [mode]: activeMode });
    assert.equal(active.valid, false, `${field} becomes invalid when selected`);
    assert.ok(active.errors.some(e => e.field === field));
  }
  const validInactive = model.normalizeInputs(neutral({ managementMode: 'fixed', managementPct: 7 }));
  assert.equal(validInactive.managementPct, 7, 'Valid inactive inputs survive mode changes and exports');
});

test('acquisition cash includes repairs; operational TI is a separate year-1 cash use', () => {
  const result = model.calculate(neutral({ purchasePrice: 100000, downPaymentPct: 25, closingCosts: 3000, immediateRepairs: 2000, tenantImprovements: 1000 }));
  close(result.totalCashRequired, 30000);
  close(result.calcTenantImprovements, 1000);
  close(result.cashOnCash, result.cashFlowAfterDebt / 30000 * 100);
  assert.equal(result.roi, result.cashOnCash);
});

test('zero denominators and unsupported income-capitalized exits return null', () => {
  const zero = model.calculate(neutral({ purchasePrice: 0, units: [], loanTermYears: 0, exitCapRate: 0 }));
  for (const key of ['pricePerSqft', 'pricePerUnit', 'ltv', 'capRate', 'cashOnCash', 'roi', 'grossRentMultiplier', 'dscr', 'expenseRatio']) assert.equal(zero[key], null, key);
  for (const key of ['value', 'sellingCosts', 'netProceeds']) assert.equal(zero.exit[key], null, key);
  const negative = model.calculate(neutral({ realEstateTaxes: 20000 }));
  assert.equal(negative.noi, -8000);
  assert.equal(negative.exit.value, null);
  assert.ok(negative.cashOnCash < 0);
  assert.ok(negative.warnings.some(w => w.code === 'nonpositive-noi'));
  finiteTree(zero);
  finiteTree(negative);
});

test('100% vacancy and -100% growth produce finite explicit zero/negative income', () => {
  const vacant = model.calculate(neutral({ vacancyPct: 100, managementMode: 'percent', managementPct: 10, insurance: 1200 }));
  assert.equal(vacant.effectiveGrossRevenue, 0);
  assert.equal(vacant.calcManagement, 0);
  assert.equal(vacant.expenseRatio, null);
  const stopped = model.calculate(neutral({ annualRentIncrease: -100, annualExpenseIncrease: -100, insurance: 1000 }));
  assert.equal(stopped.noi, 11000);
  assert.equal(stopped.years[1].noi, 0);
  finiteTree(vacant);
  finiteTree(stopped);
});

test('extreme supported magnitudes never expose NaN or Infinity', () => {
  finiteTree(model.calculate(neutral({ purchasePrice: Number.MIN_VALUE, exitCapRate: Number.MIN_VALUE, projectionYears: 50, annualRentIncrease: 100, annualExpenseIncrease: 100, tenantImprovementsPSF: 1e12, tenantImprovementsMode: 'psf', tenantImprovementsTiming: 'annual' })));
  close(model.monthlyPayment(12000, 1e-300, 2), 500);
  close(model.loanBalance(12000, 1e-300, 2, 18), 3000);
});

test('v3 imports preserve keys, infer legacy modes, and disclose corrected cost conventions', () => {
  const input = neutral({ management: 1200, managementPct: 0, leaseCommissions: 100, leaseCommissionsPct: 4, tenantImprovements: 100, tenantImprovementsPSF: 2, reserves: 1200, capitalReserves: 1000 });
  delete input.schemaVersion;
  for (const key of Object.keys(model.modeRules)) delete input[key];
  const result = model.validateInputs({ version: '3.0', exported: 'example', data: input });
  assert.equal(result.valid, true);
  assert.equal(result.inputs.schemaVersion, 4);
  assert.equal(result.inputs.managementMode, 'fixed');
  assert.equal(result.inputs.leaseCommissionsMode, 'percent');
  assert.equal(result.inputs.tenantImprovementsMode, 'psf');
  assert.equal(result.inputs.leaseCommissionsTiming, 'annual');
  assert.equal(result.inputs.tenantImprovementsTiming, 'annual');
  assert.equal(result.inputs.reserves, 1200);
  assert.equal(result.inputs.capitalReserves, 1000);
  assert.ok(result.warnings.some(w => w.code === 'migrated-v3'));
  assert.ok(result.warnings.some(w => w.code === 'separate-reserves'));
  const legacyPartial = model.normalizeInputs({ propertyName: 'Legacy example' });
  assert.equal(legacyPartial.reserves, 1200);
  assert.equal(legacyPartial.capitalReserves, 1000);
});

test('v4 imports round-trip and do not accidentally get legacy defaults', () => {
  const raw = neutral({ tenantImprovementsTiming: 'annual', tenantImprovements: 500 });
  assert.deepEqual(model.normalizeInputs({ version: '4.0', data: raw }), model.normalizeInputs(raw));
  const noInnerVersion = model.normalizeInputs({ version: '4.0', data: { propertyName: 'Fresh example' } });
  assert.equal(noInnerVersion.reserves, 0);
  assert.equal(noInnerVersion.capitalReserves, 2200);
  assert.equal(noInnerVersion.leaseCommissionsTiming, 'year1');
  assert.equal(model.validateInputs({ version: '3.0', data: raw }).valid, false);
  assert.equal(model.validateInputs({ version: '5.0', data: raw }).valid, false);
  assert.equal(model.validateInputs({ schemaVersion: 5 }).valid, false);
});

test('strict numeric input accepts complete decimal numbers and rejects ambiguous coercion', () => {
  const valid = model.normalizeInputs({ ...neutral(), purchasePrice: ' 240000.50 ', vacancyPct: '5e0', interestRate: '.5' });
  assert.equal(valid.purchasePrice, 240000.5);
  assert.equal(valid.vacancyPct, 5);
  assert.equal(valid.interestRate, 0.5);
  for (const value of ['', ' ', null, true, false, '1,000', '$500', '3abc', '0x10', NaN, Infinity, -Infinity, {}, []]) {
    const result = model.validateInputs({ ...neutral(), purchasePrice: value });
    assert.equal(result.valid, false);
    assert.equal(result.inputs, null);
    assert.ok(result.errors.some(e => e.field === 'purchasePrice'));
    assert.throws(() => model.calculate({ ...neutral(), purchasePrice: value }), model.ValidationError);
  }
});

test('invalid bounds, enum values, term precision, and date ranges cannot calculate', () => {
  for (const update of [{ purchasePrice: -1 }, { interestRate: 101 }, { downPaymentPct: -1 }, { vacancyPct: 101 }, { managementPct: 101, managementMode: 'percent' }, { annualRentIncrease: -101 }, { annualExpenseIncrease: 101 }, { loanTermYears: 1.01 }, { loanTermYears: 0, downPaymentPct: 0 }, { loanTermYears: 1e-12, downPaymentPct: 0 }, { projectionYears: 0 }, { projectionYears: 1.5 }, { projectionYears: 51 }, { startYear: 9999 }, { sellingCostsPct: 101 }, { managementMode: 'both' }, { tenantImprovementsTiming: 'monthly' }, { propertyName: 'x'.repeat(257) }, { units: [{ rent: -1 }] }]) {
    assert.equal(model.validateInputs({ ...neutral(), ...update }).valid, false, Object.keys(update).join(','));
  }
  for (const value of [null, [], 1, 'property', new Date(), new Map()]) assert.equal(model.validateInputs(value).valid, false);
  assert.equal(model.validateInputs({ ...neutral(), units: Array.from({ length: 1001 }, () => ({ rent: 0, sqft: 0 })) }).valid, false);
  assert.equal(model.calculate(neutral({ projectionYears: 50 })).years.length, 50);
});

test('loan helpers reject impossible or nonnumeric assumptions', () => {
  for (const args of [[-1, 7, 30], [1000, -1, 30], [1000, 7, 0], [1000, 7, 1e-12], [1000, 7, 1.01], [1000, 7, 51], ['1000', 7, 30], [1000, Infinity, 30]]) assert.throws(() => model.monthlyPayment(...args), RangeError);
  for (const paid of [-1, 0.5, Infinity, '12']) assert.throws(() => model.loanBalance(1000, 7, 30, paid), RangeError);
  assert.equal(model.monthlyPayment(0, 0, 0), 0);
  assert.equal(model.loanBalance(0, 0, 0, 0), 0);
});

test('unit IDs normalize safely, numeric zero remains zero, and unknown fields are discarded', () => {
  const result = model.normalizeInputs({ ...neutral(), unknownField: 'discard', units: [{ id: 'same', rent: 0, sqft: 0 }, { id: 'same', rent: '0', sqft: '0' }, { id: '<invalid>', rent: 0, sqft: 0 }] });
  assert.equal(new Set(result.units.map(u => u.id)).size, 3);
  assert.ok(result.units.every(u => /^[A-Za-z0-9_-]{1,64}$/.test(u.id) && u.rent === 0 && u.sqft === 0));
  assert.equal(Object.hasOwn(result, 'unknownField'), false);
  const polluted = JSON.parse('{"schemaVersion":4,"__proto__":{"injected":true}}');
  assert.equal(Object.hasOwn(model.normalizeInputs(polluted), '__proto__'), false);
  assert.equal({}.injected, undefined);
});

test('calculation is deterministic, isolated from caller mutations, and defaults are protected', () => {
  const raw = neutral();
  const before = JSON.stringify(raw);
  const first = model.calculate(raw);
  assert.equal(JSON.stringify(raw), before);
  assert.deepEqual(first, model.calculate(raw));
  first.inputs.units[0].rent = 99999;
  assert.equal(raw.units[0].rent, 1000);
  assert.equal(model.calculate(raw).monthlyRent, 1000);
  assert.throws(() => { model.defaultInputs.units[0].rent = 0; }, TypeError);
});

test('same pure API works as a browser global without Node or network dependencies', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../proforma-model.js'), 'utf8'), context);
  assert.ok(context.ProformaModel);
  close(context.ProformaModel.monthlyPayment(12000, 0, 2), 500);
  assert.equal(context.ProformaModel.calculate().years.length, 5);
  assert.equal(context.document, undefined);
  assert.equal(context.localStorage, undefined);
});

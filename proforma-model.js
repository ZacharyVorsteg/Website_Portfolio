(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.ProformaModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const defaultInputs = {
    schemaVersion: 4, propertyName: 'My Investment Property', propertyAddress: '',
    purchasePrice: 500000, closingCosts: 10000, immediateRepairs: 0,
    downPaymentPct: 25, interestRate: 7, loanTermYears: 30,
    units: Array.from({ length: 4 }, (_, i) => ({ id: String(i + 1), unitNumber: `Unit ${i + 1}`, tenant: '', sqft: 800, rent: 1500 })),
    laundryIncome: 0, parkingIncome: 0, otherIncome: 0, vacancyPct: 5,
    realEstateTaxes: 6000, insurance: 2400, repairsMaintenance: 2000, utilities: 1800,
    management: 0, managementPct: 8, managementMode: 'percent', trash: 600, landscaping: 600,
    reserves: 0, capitalReserves: 2200,
    leaseCommissions: 0, leaseCommissionsPct: 0, leaseCommissionsMode: 'fixed', leaseCommissionsTiming: 'year1',
    tenantImprovements: 0, tenantImprovementsPSF: 0, tenantImprovementsMode: 'fixed', tenantImprovementsTiming: 'year1',
    annualRentIncrease: 3, annualExpenseIncrease: 2, projectionYears: 5,
    exitCapRate: 6, sellingCostsPct: 0, startYear: 2026,
  };
  const moneyFields = ['purchasePrice', 'closingCosts', 'immediateRepairs', 'laundryIncome', 'parkingIncome', 'otherIncome', 'realEstateTaxes', 'insurance', 'repairsMaintenance', 'utilities', 'management', 'trash', 'landscaping', 'reserves', 'capitalReserves', 'leaseCommissions', 'tenantImprovements', 'tenantImprovementsPSF'];
  const fieldRules = Object.fromEntries(moneyFields.map(key => [key, { min: 0, max: 1e12, step: 0.01 }]));
  for (const key of ['downPaymentPct', 'interestRate', 'vacancyPct', 'managementPct', 'leaseCommissionsPct', 'exitCapRate', 'sellingCostsPct']) fieldRules[key] = { min: 0, max: 100, step: 0.01 };
  for (const key of ['annualRentIncrease', 'annualExpenseIncrease']) fieldRules[key] = { min: -100, max: 100, step: 0.01 };
  fieldRules.loanTermYears = { min: 0, max: 50, step: 1 / 12 };
  fieldRules.projectionYears = { min: 1, max: 50, step: 1, integer: true };
  fieldRules.startYear = { min: 1900, max: 9999, step: 1, integer: true };
  const unitRules = { rent: { min: 0, max: 1e9, step: 0.01 }, sqft: { min: 0, max: 1e9, step: 0.01 } };
  const modeRules = {
    managementMode: ['percent', 'fixed'], leaseCommissionsMode: ['percent', 'fixed'], tenantImprovementsMode: ['psf', 'fixed'],
    leaseCommissionsTiming: ['annual', 'year1'], tenantImprovementsTiming: ['annual', 'year1'],
  };
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const record = value => value !== null && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
  const clone = value => JSON.parse(JSON.stringify(value));
  const ratio = (numerator, denominator, scale = 1) => {
    const value = denominator > 0 ? numerator / denominator * scale : NaN;
    return Number.isFinite(value) ? value : null;
  };
  function issue(field, code, message) { return { field, code, message }; }
  class ValidationError extends Error {
    constructor(errors) { super('Please correct the marked assumptions.'); this.name = 'ValidationError'; this.errors = errors; }
  }

  function validateInputs(raw) {
    const errors = [], warnings = [];
    let source = raw === undefined ? clone(defaultInputs) : raw;
    let envelopeVersion;
    if (record(source) && own(source, 'data')) {
      envelopeVersion = source.version;
      if (envelopeVersion !== undefined && !['3', '3.0', '4', '4.0'].includes(String(envelopeVersion))) errors.push(issue('version', 'version', 'Unsupported import version.'));
      source = source.data;
    }
    if (!record(source)) return { valid: false, inputs: null, errors: [issue('inputs', 'type', 'Inputs must be a property object.')], warnings };
    if (own(source, 'schemaVersion') && ![3, 4, '3', '4'].includes(source.schemaVersion)) errors.push(issue('schemaVersion', 'version', 'Unsupported input version.'));
    if (envelopeVersion !== undefined && own(source, 'schemaVersion') && Number(envelopeVersion) !== Number(source.schemaVersion)) errors.push(issue('schemaVersion', 'version', 'The import and input versions must agree.'));
    const legacy = Number(envelopeVersion) === 3 || Number(source.schemaVersion) === 3 || (envelopeVersion === undefined && !own(source, 'schemaVersion') && Object.keys(defaultInputs).some(key => own(source, key)));
    const defaults = clone(defaultInputs);
    if (legacy) { defaults.reserves = 1200; defaults.capitalReserves = 1000; defaults.leaseCommissionsTiming = 'annual'; defaults.tenantImprovementsTiming = 'annual'; }
    const result = { schemaVersion: 4 };
    function number(value, field, rule, destination = errors) {
      const candidate = typeof value === 'number' ? value : typeof value === 'string' && /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()) ? Number(value.trim()) : NaN;
      if (!Number.isFinite(candidate)) { destination.push(issue(field, 'number', 'Enter a finite number.')); return 0; }
      if (candidate < rule.min || candidate > rule.max || (rule.integer && !Number.isInteger(candidate))) destination.push(issue(field, 'range', `Enter ${rule.integer ? 'a whole number' : 'a number'} from ${rule.min} to ${rule.max}.`));
      return candidate;
    }
    function text(value, field, max) {
      if (typeof value !== 'string' || value.length > max) { errors.push(issue(field, 'text', `Enter text up to ${max} characters.`)); return ''; }
      return value;
    }
    const numericErrors = new Map();
    for (const [key, rule] of Object.entries(fieldRules)) {
      const fieldErrors = [];
      result[key] = number(own(source, key) ? source[key] : defaults[key], key, rule, fieldErrors);
      numericErrors.set(key, fieldErrors);
    }
    for (const [key, max] of [['propertyName', 256], ['propertyAddress', 512]]) result[key] = text(own(source, key) ? source[key] : defaults[key], key, max);
    const inferred = { managementMode: result.managementPct > 0 ? 'percent' : 'fixed', leaseCommissionsMode: result.leaseCommissionsPct > 0 ? 'percent' : 'fixed', tenantImprovementsMode: result.tenantImprovementsPSF > 0 ? 'psf' : 'fixed' };
    for (const [key, choices] of Object.entries(modeRules)) {
      result[key] = own(source, key) ? source[key] : legacy && inferred[key] ? inferred[key] : defaults[key];
      if (!choices.includes(result[key])) errors.push(issue(key, 'mode', 'Choose one of the available calculation modes.'));
    }
    const inactiveFields = new Map();
    for (const [mode, label, bases] of [
      ['managementMode', 'management', { percent: 'management', fixed: 'managementPct' }],
      ['leaseCommissionsMode', 'leasing commission', { percent: 'leaseCommissions', fixed: 'leaseCommissionsPct' }],
      ['tenantImprovementsMode', 'tenant improvement', { psf: 'tenantImprovements', fixed: 'tenantImprovementsPSF' }],
    ]) if (own(bases, result[mode])) inactiveFields.set(bases[result[mode]], label);
    for (const [field, fieldErrors] of numericErrors) {
      if (fieldErrors.length && inactiveFields.has(field)) {
        result[field] = 0;
        warnings.push(issue(field, 'inactive-ignored', `An unused ${inactiveFields.get(field)} alternative is invalid and is ignored. Saved files use 0 for that alternative; review it before switching basis.`));
      } else errors.push(...fieldErrors);
    }
    const units = own(source, 'units') ? source.units : defaults.units;
    result.units = [];
    if (!Array.isArray(units) || units.length > 1000) errors.push(issue('units', 'units', 'Use a unit list with at most 1,000 rows.'));
    else {
      const used = new Set();
      units.forEach((unit, index) => {
        const prefix = `units.${index}`;
        if (!record(unit)) { errors.push(issue(prefix, 'unit', 'Each unit must be an object.')); return; }
        let id = typeof unit.id === 'string' ? unit.id : '';
        if (!/^[A-Za-z0-9_-]{1,64}$/.test(id) || used.has(id)) {
          id = `unit-${index + 1}`;
          let suffix = 1;
          while (used.has(id)) id = `unit-${index + 1}-${suffix++}`;
          warnings.push(issue(prefix + '.id', 'id', 'A missing or duplicate unit identifier was replaced.'));
        }
        used.add(id);
        result.units.push({ id, unitNumber: text(own(unit, 'unitNumber') ? unit.unitNumber : `Unit ${index + 1}`, prefix + '.unitNumber', 64), tenant: text(own(unit, 'tenant') ? unit.tenant : '', prefix + '.tenant', 256), sqft: number(own(unit, 'sqft') ? unit.sqft : 0, prefix + '.sqft', unitRules.sqft), rent: number(own(unit, 'rent') ? unit.rent : 0, prefix + '.rent', unitRules.rent) });
      });
    }
    if (Math.abs(result.loanTermYears * 12 - Math.round(result.loanTermYears * 12)) > 1e-8) errors.push(issue('loanTermYears', 'months', 'The loan term must contain a whole number of months.'));
    if (result.purchasePrice > 0 && result.downPaymentPct < 100 && Math.round(result.loanTermYears * 12) < 1) errors.push(issue('loanTermYears', 'loan-term', 'A financed purchase needs an amortization term of at least one month.'));
    if (result.startYear + result.projectionYears > 9999) errors.push(issue('startYear', 'year', 'The forward exit year must not exceed 9999.'));
    if (legacy) warnings.push(issue('schemaVersion', 'migrated-v3', 'Legacy inputs were migrated. Reserves are now shown below NOI. Existing leasing and improvement allowances remain annual; review their timing.'));
    if (result.reserves > 0 && result.capitalReserves > 0) warnings.push(issue('reserves', 'separate-reserves', 'Both reserve allowances reduce cash flow once. Confirm they cover different costs.'));
    if (!result.units.length) warnings.push(issue('units', 'no-units', 'No units are modeled; unit-based ratios are unavailable.'));
    if (!result.exitCapRate) warnings.push(issue('exitCapRate', 'exit-unavailable', 'Exit value is unavailable without a positive exit capitalization rate.'));
    return { valid: errors.length === 0, inputs: errors.length ? null : result, errors, warnings };
  }
  function normalizeInputs(raw) {
    const result = validateInputs(raw);
    if (!result.valid) throw new ValidationError(result.errors);
    return result.inputs;
  }
  function loanTerms(principal, annualRatePct, termYears) {
    if (![principal, annualRatePct, termYears].every(Number.isFinite) || principal < 0 || principal > 1e12 || annualRatePct < 0 || annualRatePct > 100 || termYears < 0 || termYears > 50 || Math.abs(termYears * 12 - Math.round(termYears * 12)) > 1e-8 || (principal > 0 && Math.round(termYears * 12) < 1)) throw new RangeError('Invalid amortizing-loan assumptions.');
    return { months: Math.round(termYears * 12), rate: annualRatePct / 1200 };
  }
  function monthlyPayment(principal, annualRatePct, termYears) {
    const { months, rate } = loanTerms(principal, annualRatePct, termYears);
    if (!principal) return 0;
    // log1p/expm1 avoid loss of precision when the note rate approaches zero.
    return rate === 0 ? principal / months : principal * (rate / -Math.expm1(-months * Math.log1p(rate)));
  }
  function loanBalance(principal, annualRatePct, termYears, paymentsMade) {
    const { months, rate } = loanTerms(principal, annualRatePct, termYears);
    if (!Number.isInteger(paymentsMade) || paymentsMade < 0) throw new RangeError('Payments made must be a nonnegative whole number.');
    if (!principal || paymentsMade >= months) return 0;
    if (!paymentsMade) return principal;
    if (!rate) return principal * (months - paymentsMade) / months;
    return principal * (Math.expm1(-(months - paymentsMade) * Math.log1p(rate)) / Math.expm1(-months * Math.log1p(rate)));
  }

  function calculate(raw) {
    const validation = validateInputs(raw);
    if (!validation.valid) throw new ValidationError(validation.errors);
    const input = validation.inputs, warnings = validation.warnings.slice();
    const totalUnits = input.units.length;
    const totalSqft = input.units.reduce((sum, unit) => sum + unit.sqft, 0);
    const monthlyRent = input.units.reduce((sum, unit) => sum + unit.rent, 0), annualRent = monthlyRent * 12;
    const annualOtherIncome = (input.laundryIncome + input.parkingIncome + input.otherIncome) * 12;
    const downPayment = input.purchasePrice * (input.downPaymentPct / 100), loanAmount = input.purchasePrice * (1 - input.downPaymentPct / 100);
    const monthlyMortgage = monthlyPayment(loanAmount, input.interestRate, input.loanTermYears), months = Math.round(input.loanTermYears * 12);
    const totalCashRequired = downPayment + input.closingCosts + input.immediateRepairs;
    // This model shows reserves, leasing commissions and TI below NOI; lender conventions can differ.
    const baseOpex = ['realEstateTaxes', 'insurance', 'repairsMaintenance', 'utilities', 'trash', 'landscaping'].reduce((sum, key) => sum + input[key], 0);
    function operatingYear(year) {
      const rentGrowth = (1 + input.annualRentIncrease / 100) ** (year - 1), expenseGrowth = (1 + input.annualExpenseIncrease / 100) ** (year - 1);
      const rent = annualRent * rentGrowth, otherIncome = annualOtherIncome * rentGrowth;
      const gpi = rent + otherIncome, vacancy = gpi * input.vacancyPct / 100, egr = gpi - vacancy;
      const management = input.managementMode === 'percent' ? egr * input.managementPct / 100 : input.management * expenseGrowth;
      const opex = baseOpex * expenseGrowth + management, noi = egr - opex;
      const leaseCommissions = input.leaseCommissionsTiming === 'year1' && year !== 1 ? 0 : input.leaseCommissionsMode === 'percent' ? rent * input.leaseCommissionsPct / 100 : input.leaseCommissions * expenseGrowth;
      const tenantImprovements = input.tenantImprovementsTiming === 'year1' && year !== 1 ? 0 : (input.tenantImprovementsMode === 'psf' ? totalSqft * input.tenantImprovementsPSF : input.tenantImprovements) * expenseGrowth;
      const reserveAllowance = input.reserves * expenseGrowth, capitalReserves = input.capitalReserves * expenseGrowth, annualReserves = reserveAllowance + capitalReserves;
      const leasingCap = leaseCommissions + tenantImprovements + annualReserves, cfBeforeDebt = noi - leasingCap;
      const startMonth = (year - 1) * 12, paidMonths = Math.max(0, Math.min(12, months - startMonth));
      const beginningLoanBalance = loanBalance(loanAmount, input.interestRate, input.loanTermYears, startMonth);
      const endingLoanBalance = loanBalance(loanAmount, input.interestRate, input.loanTermYears, year * 12);
      const debtService = monthlyMortgage * paidMonths, principalPaid = Math.max(0, beginningLoanBalance - endingLoanBalance);
      const interestPaid = Math.max(0, debtService - principalPaid), cfAfterDebt = cfBeforeDebt - debtService;
      return { year, calendarYear: input.startYear + year - 1, annualRent: rent, annualOtherIncome: otherIncome, gpi, vacancy, egr, management, opex, noi, leaseCommissions, tenantImprovements, reserves: reserveAllowance, capitalReserves, annualReserves, leasingCap, cfBeforeDebt, debtService, cfAfterDebt, beginningLoanBalance, loanBalance: endingLoanBalance, principalPaid, interestPaid, cashOnCash: ratio(cfAfterDebt, totalCashRequired, 100), dscr: ratio(noi, debtService), dscrAfterReserves: ratio(noi - annualReserves, debtService) };
    }
    const years = Array.from({ length: input.projectionYears }, (_, i) => operatingYear(i + 1));
    const first = years[0], forward = operatingYear(input.projectionYears + 1);
    const value = forward.noi > 0 ? ratio(forward.noi, input.exitCapRate / 100) : null;
    if (forward.noi <= 0) warnings.push(issue('exit', 'nonpositive-noi', 'A positive income-capitalized exit value is unavailable when forward NOI is not positive.'));
    if (forward.noi > 0 && input.exitCapRate > 0 && value === null) warnings.push(issue('exit', 'numeric-range', 'Exit value is outside the supported numeric range.'));
    const sellingCosts = value === null ? null : value * (input.sellingCostsPct / 100);
    const balance = years.at(-1).loanBalance;
    const exit = { year: input.projectionYears, calendarYear: input.startYear + input.projectionYears - 1, forwardYear: input.projectionYears + 1, forwardNOI: forward.noi, value, sellingCosts, loanBalance: balance, netProceeds: value === null ? null : value - sellingCosts - balance };
    return {
      inputs: input, warnings, totalUnits, totalSqft, monthlyRent, annualRent, annualOtherIncome,
      pricePerSqft: ratio(input.purchasePrice, totalSqft), pricePerUnit: ratio(input.purchasePrice, totalUnits),
      grossPotentialIncome: first.gpi, vacancyLoss: first.vacancy, effectiveGrossRevenue: first.egr,
      downPayment, loanAmount, ltv: ratio(loanAmount, input.purchasePrice, 100), monthlyMortgage, annualDebtService: first.debtService, totalCashRequired,
      realEstateTaxes: input.realEstateTaxes, insurance: input.insurance, repairsMaintenance: input.repairsMaintenance, utilities: input.utilities,
      calcManagement: first.management, trash: input.trash, landscaping: input.landscaping, reserves: input.reserves, capitalReserves: input.capitalReserves,
      annualReserves: first.annualReserves, totalOperatingExpenses: first.opex, noi: first.noi,
      calcLeaseCommissions: first.leaseCommissions, calcTenantImprovements: first.tenantImprovements, totalLeasingCapitalCosts: first.leasingCap,
      cashFlowBeforeDebt: first.cfBeforeDebt, cashFlowAfterDebt: first.cfAfterDebt,
      capRate: ratio(first.noi, input.purchasePrice, 100), cashOnCash: first.cashOnCash, roi: first.cashOnCash,
      grossRentMultiplier: ratio(input.purchasePrice, annualRent), dscr: first.dscr, dscrAfterReserves: first.dscrAfterReserves,
      expenseRatio: ratio(first.opex, first.egr, 100), years, exit,
    };
  }
  function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
  return freeze({ defaultInputs, fieldRules, unitRules, modeRules, ValidationError, normalizeInputs, validateInputs, calculate, monthlyPayment, loanBalance });
});

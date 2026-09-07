(() => {
  'use strict';
  const model = window.ProformaModel;
  const byId = id => document.getElementById(id);
  const status = byId('tool-status');
  if (!model) {
    status.textContent = 'The calculator could not load. Reload this page, or use the financial templates in the resource collection.';
    return;
  }
  const STORE = 'zv-proforma-v4', LEGACY = 'proforma-v3';
  const copy = value => JSON.parse(JSON.stringify(value));
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const dollars = value => Number.isFinite(value) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(value) === 0 ? 0 : value) : '—';
  const number = value => Number.isFinite(value) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value) === 0 ? 0 : value) : '—';
  const percent = value => Number.isFinite(value) ? value.toFixed(2) + '%' : '—';
  let inputs = copy(model.defaultInputs), lastResult = null, example = true, migrationWarnings = [], storageAvailable = true;
  function announce(message) { status.textContent = message; }
  const remember = byId('remember-scenario');
  try {
    const current = localStorage.getItem(STORE), legacy = localStorage.getItem(LEGACY);
    if (current || legacy) {
      const result = model.validateInputs(JSON.parse(current || legacy));
      if (!result.valid) throw new Error('invalid saved input');
      inputs = result.inputs; migrationWarnings = result.warnings; example = false; remember.checked = Boolean(current);
      announce(current ? 'Restored the scenario saved on this device.' : 'Restored your earlier scenario. Review the assumptions, then save a file or choose to remember updates.');
    }
  } catch (error) {
    if (error.name === 'SecurityError') {
      storageAvailable = false; remember.disabled = true;
      announce('Device storage is unavailable. You can still calculate, print and save a scenario file.');
    } else announce('The earlier saved scenario could not be opened. The example is ready; your saved copy has not been overwritten.');
  }
  function fieldLimits(input, rules) {
    if (!rules) return;
    input.min = String(rules.min); input.max = String(rules.max);
    input.step = rules.integer ? '1' : 'any';
  }
  const controls = [...document.querySelectorAll('[data-field]')];
  for (const control of controls) {
    fieldLimits(control, model.fieldRules[control.dataset.field]);
    const ids = new Set((control.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
    ids.add(control.id + "-error");control.setAttribute("aria-describedby", [...ids].join(" "));
  }
  function syncModes() {
    for (const region of document.querySelectorAll('[data-mode]')) {
      const [key, value] = region.dataset.mode.split(':');
      region.hidden = inputs[key] !== value;
      for (const control of region.querySelectorAll('input')) control.disabled = region.hidden;
    }
  }
  function unitField(unit, index, key, label, type, prefix = '') {
    const id = `unit-${index}-${key}`, max = key === 'unitNumber' ? 64 : 256;
    return `<div class="field"><label for="${id}">${label}</label><div class="field-control">${prefix ? `<span aria-hidden="true">${prefix}</span>` : ''}<input id="${id}" type="${type}" data-unit="${index}" data-unit-field="${key}" value="${escape(unit[key])}" ${type === 'number' ? 'inputmode="decimal" step="any" min="0" max="1000000000"' : `maxlength="${max}"`} aria-describedby="${id}-error"></div><span class="field-error" id="${id}-error"></span></div>`;
  }
  function renderUnits() {
    byId('rent-roll').innerHTML = inputs.units.map((unit, index) => `<section class="rent-unit" aria-labelledby="unit-title-${index}"><div class="unit-heading"><h3 id="unit-title-${index}">Rent roll · ${index + 1}</h3><button type="button" class="unit-remove" data-remove-unit="${index}" aria-label="Remove unit ${index + 1}" ${inputs.units.length <= 1 ? 'disabled' : ''}>Remove</button></div><div class="field-grid">${unitField(unit,index,'unitNumber','Unit label','text')}${unitField(unit,index,'tenant','Tenant / status · optional','text')}${unitField(unit,index,'sqft','Area · sq ft','number')}${unitField(unit,index,'rent','Potential rent / month','number','$')}</div></section>`).join('');
    byId('add-unit').disabled = inputs.units.length >= 1000;
  }
  function populate() {
    for (const control of controls) control.value = inputs[control.dataset.field];
    renderUnits(); syncModes();
  }
  function inputFor(field) {
    const match = /^units\.(\d+)\.(\w+)$/.exec(field);
    return match ? byId(`unit-${match[1]}-${match[2]}`) : byId(field);
  }
  function errors(errors) {
    for (const field of document.querySelectorAll('.field.has-error')) field.classList.remove('has-error');
    for (const input of document.querySelectorAll('[aria-invalid]')) input.removeAttribute('aria-invalid');
    for (const node of document.querySelectorAll('.field-error')) node.textContent = '';
    const box = byId('validation-summary'); box.hidden = !errors.length;
    box.replaceChildren();
    if (!errors.length) return;
    const intro = document.createElement('strong'); intro.textContent = `Check ${errors.length} assumption${errors.length === 1 ? '' : 's'} to update the results.`; box.append(intro);
    const list = document.createElement('ul');
    for (const error of errors.slice(0, 8)) {
      const input = inputFor(error.field), field = input?.closest('.field');
      const label = field?.querySelector('label')?.textContent || 'Scenario input';
      if (field) {
        field.classList.add('has-error'); input.setAttribute('aria-invalid', 'true');
        field.querySelector('.field-error').textContent = error.message;
      }
      const item = document.createElement('li');
      if (input && !input.disabled) {
        const link = document.createElement('a'); link.href = '#' + input.id; link.className = 'model-error-link';
        link.textContent = label + ': ' + error.message; link.addEventListener('click', event => {event.preventDefault();input.scrollIntoView({block:'center'});input.focus({preventScroll:true});});item.append(link);
      } else item.textContent = label + ': ' + error.message;
      list.append(item);
    }
    box.append(list);
  }
  function ledger(target, rows) {
    byId(target).innerHTML = rows.map(([label, value, style = '']) => `<div class="ledger-row ${style}"><dt>${escape(label)}</dt><dd class="${style === 'total' && Number.isFinite(value) && value < 0 ? 'negative' : ''}">${dollars(value)}</dd></div>`).join('');
  }
  function persist() {
    if (!remember.checked || !lastResult) return;
    try { localStorage.setItem(STORE, JSON.stringify({version:'4.0',data:lastResult.inputs})); }
    catch { remember.checked = false; announce('This device could not save the scenario. Use Save scenario to keep a file instead.'); }
  }
  function renderResults() {
    syncModes();
    const validation = model.validateInputs(inputs); errors(validation.errors);
    lastResult = validation.valid ? model.calculate(validation.inputs) : null;
    const calc = lastResult, warningBox = byId('model-warnings');
    const warnings = [...migrationWarnings, ...validation.warnings, ...(calc?.warnings || [])];
    const messages = [...new Set(warnings.map(warning => warning.message))];
    warningBox.hidden = !messages.length; warningBox.replaceChildren();
    if (messages.length) { const list = document.createElement('ul');for(const message of messages){const item=document.createElement('li');item.textContent=message;list.append(item);}warningBox.append(list); }
    byId('scenario-kind').textContent = example ? 'Illustrative example · Replace the assumptions' : 'Your scenario · Assumptions are not verified';
    byId('summary-cashflow').textContent = dollars(calc?.cashFlowAfterDebt);
    byId('summary-cashflow').classList.toggle('negative', Boolean(calc && calc.cashFlowAfterDebt < 0));
    byId('summary-coc').textContent = percent(calc?.cashOnCash);
    byId('summary-coc').classList.toggle('negative', Boolean(calc && calc.cashOnCash < 0));
    byId('summary-cap').textContent = percent(calc?.capRate);
    byId('summary-dscr').textContent = !calc ? '—' : calc.loanAmount === 0 ? 'No debt' : calc.dscr === null ? '—' : calc.dscr.toFixed(2) + '×';
    document.querySelectorAll('[data-result]').forEach(node => {node.textContent=dollars(calc?.[node.dataset.result]);});
    byId('total-area').textContent = calc ? number(calc.totalSqft) + ' sq ft' : '—';
    const value = key => calc ? calc[key] : null;
    const debit = key => calc ? -calc[key] : null;
    ledger('operating-ledger', [
      ['Potential rent',value('annualRent')],['Other income',value('annualOtherIncome')],['Vacancy & collection loss',debit('vacancyLoss')],
      ['Effective income',value('effectiveGrossRevenue'),'subtotal'],['Operating expenses',debit('totalOperatingExpenses')],['Net operating income',value('noi'),'subtotal'],
      ['Replacement & other reserves',debit('annualReserves')],['Leasing commissions',debit('calcLeaseCommissions')],['Tenant improvements',debit('calcTenantImprovements')],['Debt service',debit('annualDebtService')],['Annual cash flow',value('cashFlowAfterDebt'),'total']
    ]);
    byId('projection-title').textContent = calc ? `${calc.years.length}-year cash-flow forecast.` : 'Cash flow over the holding period.';
    byId('projection-rows').innerHTML = calc ? calc.years.map(year => `<tr><th scope="row">Year ${year.year}<br><small>${year.calendarYear}</small></th>${['egr','opex','noi','leasingCap','debtService','cfAfterDebt','loanBalance'].map(key => `<td class="${year[key] < 0 ? 'negative' : ''}">${dollars(year[key])}</td>`).join('')}</tr>`).join('') : '<tr><td colspan="8">Correct the marked assumptions to see the forecast.</td></tr>';
    ledger('exit-ledger', [
      ['Forward-year NOI',calc?.exit.forwardNOI],['Estimated gross sale value',calc?.exit.value],['Selling costs',calc?.exit.sellingCosts == null ? null : -calc.exit.sellingCosts],['Remaining loan balance',calc ? -calc.exit.loanBalance : null],['Net sale proceeds',calc?.exit.netProceeds,'total']
    ]);
    byId('export-scenario').disabled = !calc; byId('print-scenario').disabled = !calc;
    document.querySelector('.result-overview').setAttribute('aria-busy',String(!calc));
    byId('proforma-tool').dataset.ready = 'true';
    persist();
  }
  function update(event) {
    const target = event.target;
    if (target.dataset.field) {
      const key = target.dataset.field; inputs[key] = target.value;
    } else if (target.dataset.unitField) inputs.units[Number(target.dataset.unit)][target.dataset.unitField] = target.value;
    else return;
    example = false; renderResults();
  }
  byId('assumptions').addEventListener('input', update);
  byId('assumptions').addEventListener('change', event => { if (event.target.tagName === 'SELECT') update(event); });
  byId('rent-roll').addEventListener('click', event => {
    const button = event.target.closest('[data-remove-unit]');if (!button || inputs.units.length <= 1) return;
    const index=Number(button.dataset.removeUnit);inputs.units.splice(index,1);example=false;renderUnits();renderResults();
    byId(`unit-${Math.min(index,inputs.units.length-1)}-unitNumber`)?.focus();announce('Unit removed. Cash flow has been updated.');
  });
  byId('add-unit').addEventListener('click', () => {
    if(inputs.units.length>=1000)return;
    const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : 'unit-' + Date.now() + '-' + inputs.units.length;
    inputs.units.push({id,unitNumber:'Unit '+(inputs.units.length+1),tenant:'',sqft:0,rent:0});example=false;renderUnits();renderResults();
    byId(`unit-${inputs.units.length-1}-unitNumber`)?.focus();announce('Unit added with zero area and rent. Enter its assumptions.');
  });
  remember.addEventListener('change', () => {
    if (remember.checked) {persist();if(remember.checked)announce('Valid scenario updates will be saved on this device. Keep a separate scenario file if you need a backup.');}
    else {
      try {localStorage.removeItem(STORE);localStorage.removeItem(LEGACY);announce('Saved device copies removed. The open scenario stays available until you leave this page.');}
      catch {announce('The browser could not remove its saved copy. Manage this site’s data in your browser settings.');}
    }
  });
  byId('export-scenario').addEventListener('click', () => {
    if (!lastResult) return;
    const documentData = {version:'4.0',exported:new Date().toISOString(),data:lastResult.inputs};
    const blob = new Blob([JSON.stringify(documentData,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    const name=(lastResult.inputs.propertyName || 'property').replace(/[^a-z0-9_-]/gi,'-').replace(/-+/g,'-').slice(0,70);
    link.href=url;link.download='proforma-'+name+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    announce('Scenario file prepared (.json). It contains the property details you entered; keep it somewhere you trust.');
  });
  byId('import-scenario').addEventListener('click',()=>byId('import-file').click());
  byId('import-file').addEventListener('change', async event => {
    const file=event.target.files[0];event.target.value='';if(!file)return;
    if(file.size>1024*1024){announce('Choose a scenario JSON file smaller than 1 MB. The current scenario has not changed.');return;}
    try {
      const raw=JSON.parse(await file.text()),data=raw?.data || raw;
      if(!data || !Object.hasOwn(data,'purchasePrice') || !Array.isArray(data.units))throw Error('not a scenario');
      const result=model.validateInputs(raw);if(!result.valid)throw Error('invalid scenario');
      inputs=result.inputs;migrationWarnings=result.warnings;example=false;populate();renderResults();
      announce('Scenario opened. Review the assumptions and any migration notes before using the result.');
    } catch {announce('That file is not a supported, valid scenario. The current scenario has not changed.');}
  });
  byId('reset-scenario').addEventListener('click',()=>{
    if(!window.confirm('Replace the open scenario with the illustrative example? Save a scenario file first if you want to keep it.'))return;
    inputs=copy(model.defaultInputs);migrationWarnings=[];example=true;populate();renderResults();announce('Illustrative example restored. Replace its assumptions with your own figures.');
  });
  function preparePrint(){
    let title=byId('print-scenario-title');if(!title){title=document.createElement('p');title.id='print-scenario-title';title.className='print-scenario-title';document.querySelector('.result-overview').before(title);}
    title.textContent=lastResult ? [lastResult.inputs.propertyName,lastResult.inputs.propertyAddress].filter(Boolean).join(' · ') : '';
    for(const detail of document.querySelectorAll('.method-grid details')){detail.dataset.beforePrint=String(detail.open);detail.open=true;}
  }
  function finishPrint(){for(const detail of document.querySelectorAll('.method-grid details')){if(detail.dataset.beforePrint!==undefined){detail.open=detail.dataset.beforePrint==='true';delete detail.dataset.beforePrint;}}}
  window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',finishPrint);
  byId('print-scenario').addEventListener('click',()=>{if(lastResult)window.print();});
  populate();renderResults();
})();

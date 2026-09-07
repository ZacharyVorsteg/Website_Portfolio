(() => {
  const fields = [...document.querySelectorAll('.worksheet-steps textarea')];
  fields.forEach(field => { field.disabled = false; });
  function preparePrint() {
    fields.forEach((field, index) => {document.getElementById('worksheet-print-' + (index + 1)).textContent = field.value;});
  }
  window.addEventListener('beforeprint', preparePrint);
  document.getElementById('print-worksheet').addEventListener('click', () => {preparePrint();window.print();});
})();

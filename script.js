(function () {
  const form = document.getElementById('calc-form');
  const resultGrid = document.getElementById('result-grid');

  function round(val, decimals = 4) {
    const k = Math.pow(10, decimals);
    return Math.round(val * k) / k;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const inkCm3 = parseFloat(document.getElementById('ink').value) || 0;
    const linearMeters = parseFloat(document.getElementById('linearMeters').value) || 0;
    const coverage = Math.min(100, Math.max(0, parseFloat(document.getElementById('coverage').value) || 100));

    if (width <= 0 || height <= 0) {
      resultGrid.innerHTML = '<p class="placeholder">Ширината и височината трябва да са положителни.</p>';
      return;
    }

    // Площ на клишето в мм² и см²
    const areaMm2 = width * height;
    const areaCm2 = areaMm2 / 100;

    // Вала пренася 50% върху 1 см², клишето предава 50% на филма → 50% × 50% = 25% от кубатурата
    const effectiveInkCm3 = inkCm3 * 0.25;

    // Консумация мастило с ефективната кубатура (25% пренос) × % запълненост на клишето
    const inkConsumptionCm3Raw = (effectiveInkCm3 > 0 && linearMeters > 0) ? (1000 * effectiveInkCm3 * linearMeters) / height : 0;
    const inkConsumptionCm3 = inkConsumptionCm3Raw * (coverage / 100);
    const inkConsumptionLiters = inkConsumptionCm3 / 1000;

    const html = [
      { label: 'Площ на клишето', value: round(areaMm2, 2), unit: 'мм²' },
      { label: 'Площ (см²)', value: round(areaCm2, 2), unit: 'см²' },
    ];

    if (linearMeters > 0) {
      html.push(
        { label: 'Консумация мастило', value: round(inkConsumptionLiters, 3), unit: 'л', highlight: true },
        { label: 'Консумация мастило', value: round(inkConsumptionCm3, 2), unit: 'см³' }
      );
    }

    resultGrid.innerHTML = html
      .map(
        (r) =>
          '<div class="result-row' + (r.highlight ? ' result-row--main' : '') + '">' +
          '<span class="result-label">' + r.label + '</span>' +
          '<span class="result-value">' + r.value + ' <span class="unit">' + r.unit + '</span></span>' +
          '</div>'
      )
      .join('');
  });
})();

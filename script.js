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

    // Площ на клишето в см²
    const areaCm2 = (width * height) / 100;

    // Кубатурата е см³ за 1 m². Ефективен пренос 25% от кубатурата за 1 m²
    const effectiveInkPerSqM = inkCm3 * 0.25; // см³/m²

    // Печатна площ = частта от клишето, запълнена с печат (площ × % запълненост)
    const printedAreaCm2 = areaCm2 * (coverage / 100);

    // Отпечатана площ в m² за консумация = ширина (m) × линейни метри
    const areaM2 = (width / 1000) * linearMeters;
    const inkConsumptionCm3Raw = (effectiveInkPerSqM > 0 && areaM2 > 0) ? effectiveInkPerSqM * areaM2 : 0;
    const inkConsumptionCm3 = inkConsumptionCm3Raw * (coverage / 100);
    const inkConsumptionLiters = inkConsumptionCm3 / 1000;

    const html = [
      { label: 'Площ на клишето', value: round(areaCm2, 2), unit: 'см²' },
      { label: 'Печатна площ:', value: round(printedAreaCm2, 2), unit: 'см²' },
    ];

    if (linearMeters > 0) {
      html.push(
        { label: 'Консумация мастило', value: round(inkConsumptionLiters, 3), unit: 'л', highlight: true }
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

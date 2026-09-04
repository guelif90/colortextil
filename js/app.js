/**
 * ColorTextil Studio - Main Application Controller
 * Coordinación de vistas, formulador inverso, detección en fotos, balanza e historial.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =================================================================
  // Estado Global de la Aplicación
  // =================================================================
  const AppState = {
    activeTab: 'matcherTab',
    fabricType: 'light', // 'light' (acramina) | 'dark' (laca)
    currentTarget: {
      r: 228,
      g: 0,
      b: 102,
      hex: '#E40066'
    },
    currentFormula: null,
    currentSimRecipe: {
      baseId: 'clear',
      pigments: {
        yellow_lemon: 0,
        yellow_warm: 0,
        magenta_ruby: 0,
        red_scarlet: 0,
        cyan_blue: 0,
        navy_blue: 0,
        green_emerald: 0,
        violet_carbazole: 0,
        black_carbon: 0,
        white_titanium: 0
      }
    },
    activeWeighingBatch: {
      formula: null,
      totalGrams: 250,
      tareMode: true
    },
    selectedBrand: 'genesis' // 'genesis' (Uruguay/Brasil) | 'vortex' (Argentina) | 'generic'
  };

  // =================================================================
  // Referencias a Elementos del DOM
  // =================================================================
  const DOM = {
    // Pestañas
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabViews: document.querySelectorAll('.tab-view'),
    regionalBrandSelect: document.getElementById('regionalBrandSelect'),

    // Formulador y Fotos
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('fileInput'),
    imageCanvas: document.getElementById('imageCanvas'),
    canvasPlaceholder: document.getElementById('canvasPlaceholder'),
    loupeContainer: document.getElementById('loupeContainer'),
    loupeCanvas: document.getElementById('loupeCanvas'),
    paletteChips: document.getElementById('paletteChips'),
    sampleBtns: document.querySelectorAll('.sample-btn'),
    demoSwatch1: document.getElementById('demoSwatch1'),
    demoSwatch2: document.getElementById('demoSwatch2'),
    demoSwatch3: document.getElementById('demoSwatch3'),

    // Inputs de color objetivo
    targetColorNative: document.getElementById('targetColorNative'),
    targetColorHex: document.getElementById('targetColorHex'),
    targetColorRgbLabel: document.getElementById('targetColorRgbLabel'),
    fabricLightBtn: document.getElementById('fabricLightBtn'),
    fabricDarkBtn: document.getElementById('fabricDarkBtn'),
    formulaTypeBadge: document.getElementById('formulaTypeBadge'),
    calculateFormulaBtn: document.getElementById('calculateFormulaBtn'),

    // Comparativas y Receta
    matchTargetSide: document.getElementById('matchTargetSide'),
    matchTargetHex: document.getElementById('matchTargetHex'),
    matchSimSide: document.getElementById('matchSimSide'),
    matchSimHex: document.getElementById('matchSimHex'),
    matchDeltaE: document.getElementById('matchDeltaE'),
    matchQualityBadge: document.getElementById('matchQualityBadge'),
    overpigmentAlert: document.getElementById('overpigmentAlert'),
    overpigmentText: document.getElementById('overpigmentText'),
    recipeIngredientsList: document.getElementById('recipeIngredientsList'),
    sendToWeighingBtn: document.getElementById('sendToWeighingBtn'),
    openSaveModalBtn: document.getElementById('openSaveModalBtn'),

    // Simulador Libre
    simBaseSelect: document.getElementById('simBaseSelect'),
    pigmentSlidersContainer: document.getElementById('pigmentSlidersContainer'),
    resetSimSlidersBtn: document.getElementById('resetSimSlidersBtn'),
    simTotalPigmentBadge: document.getElementById('simTotalPigmentBadge'),
    simWetBox: document.getElementById('simWetBox'),
    simWetHex: document.getElementById('simWetHex'),
    simDryBox: document.getElementById('simDryBox'),
    simDryHex: document.getElementById('simDryHex'),
    swatchWhiteShirt: document.getElementById('swatchWhiteShirt'),
    swatchGrayShirt: document.getElementById('swatchGrayShirt'),
    swatchBlackShirt: document.getElementById('swatchBlackShirt'),
    simBreakdownList: document.getElementById('simBreakdownList'),
    sendSimToWeighingBtn: document.getElementById('sendSimToWeighingBtn'),
    openSaveSimModalBtn: document.getElementById('openSaveSimModalBtn'),

    // Ficha de Pesaje
    customBatchInput: document.getElementById('customBatchInput'),
    batchPillBtns: document.querySelectorAll('.batch-pills .pill-btn'),
    shirtCountInput: document.getElementById('shirtCountInput'),
    shirtCoverageSelect: document.getElementById('shirtCoverageSelect'),
    applyShirtEstimateBtn: document.getElementById('applyShirtEstimateBtn'),
    scaleModeTare: document.getElementById('scaleModeTare'),
    weighingTableBody: document.getElementById('weighingTableBody'),
    additivesList: document.getElementById('additivesList'),
    technicalSpecsBox: document.getElementById('technicalSpecsBox'),
    printTicketBtn: document.getElementById('printTicketBtn'),
    printTicketTitle: document.getElementById('printTicketTitle'),
    printTicketDate: document.getElementById('printTicketDate'),
    printTicketBase: document.getElementById('printTicketBase'),
    printTicketTotalGrams: document.getElementById('printTicketTotalGrams'),

    // Fórmulas Guardadas
    savedRecipesGrid: document.getElementById('savedRecipesGrid'),
    noSavedRecipesNotice: document.getElementById('noSavedRecipesNotice'),
    savedCountBadge: document.getElementById('savedCountBadge'),
    searchSavedInput: document.getElementById('searchSavedInput'),

    // Modal
    saveRecipeModal: document.getElementById('saveRecipeModal'),
    saveRecipeTitle: document.getElementById('saveRecipeTitle'),
    saveRecipeClient: document.getElementById('saveRecipeClient'),
    saveRecipeNotes: document.getElementById('saveRecipeNotes'),
    cancelSaveModalBtn: document.getElementById('cancelSaveModalBtn'),
    confirmSaveRecipeBtn: document.getElementById('confirmSaveRecipeBtn')
  };

  // =================================================================
  // Inicialización del Inspector de Imágenes y Gotero
  // =================================================================
  const imageDetector = new ImageDetector({
    canvas: DOM.imageCanvas,
    loupeCanvas: DOM.loupeCanvas,
    loupeContainer: DOM.loupeContainer,
    onColorPicked: (color) => {
      setTargetColor(color.hex);
      calculateCurrentFormula();
    },
    onPaletteExtracted: (palette) => {
      renderPaletteChips(palette);
    }
  });

  // =================================================================
  // Navegación por Pestañas
  // =================================================================
  function switchTab(targetId) {
    DOM.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetId);
    });
    DOM.tabViews.forEach(view => {
      view.classList.toggle('active', view.id === targetId);
    });
    AppState.activeTab = targetId;

    if (targetId === 'savedTab') {
      renderSavedRecipesList();
    } else if (targetId === 'weighingTab') {
      renderWeighingSheet();
    }
  }

  DOM.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.target));
  });

  // =================================================================
  // Manejo de Carga de Fotos (Drop, File picker, Pegar Ctrl+V)
  // =================================================================
  DOM.dropzone.addEventListener('click', () => DOM.fileInput.click());

  DOM.fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  DOM.dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.dropzone.classList.add('dragover');
  });

  DOM.dropzone.addEventListener('dragleave', () => {
    DOM.dropzone.classList.remove('dragover');
  });

  DOM.dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  // Pegar directamente con Ctrl+V desde cualquier parte de la ventana
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData ? e.clipboardData.items : [];
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        handleImageFile(blob);
        break;
      }
    }
  });

  function handleImageFile(file) {
    if (DOM.canvasPlaceholder) {
      DOM.canvasPlaceholder.style.display = 'none';
    }
    imageDetector.loadFile(file);
  }

  // Selector de tamaño de muestreo (1x1, 3x3, 5x5 px)
  DOM.sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.sampleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      imageDetector.sampleSize = parseInt(btn.dataset.size, 10);
    });
  });

  // Renderizar chips de paleta K-Means
  function renderPaletteChips(palette) {
    DOM.paletteChips.innerHTML = '';
    if (!palette || palette.length === 0) return;

    palette.forEach((item, idx) => {
      const chip = document.createElement('div');
      chip.className = 'palette-chip' + (idx === 0 ? ' active' : '');
      chip.innerHTML = `
        <div class="palette-chip-swatch" style="background-color: ${item.hex}"></div>
        <span class="palette-chip-hex">${item.hex}</span>
        <span class="palette-chip-pct">${item.percentage}%</span>
      `;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        setTargetColor(item.hex);
        calculateCurrentFormula();
      });
      DOM.paletteChips.appendChild(chip);
    });
  }

  // Generador de Muestras Textiles de Prueba (Canvas SVG Texturizado)
  function createDemoFabricTexture(primaryColor, secondaryColor, label) {
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 400;
    const ctx = c.getContext('2d');

    // Fondo base
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, c.width, c.height);

    // Textura de entramado textil (algodón / jersey)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 0; x < c.width; x += 4) {
      ctx.fillRect(x, 0, 1.5, c.height);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let y = 0; y < c.height; y += 4) {
      ctx.fillRect(0, y, c.width, 1.5);
    }

    // Gráfico estampado simulado
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(300, 200, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 300, 205);

    return c.toDataURL('image/png');
  }

  DOM.demoSwatch1.addEventListener('click', () => {
    if (DOM.canvasPlaceholder) DOM.canvasPlaceholder.style.display = 'none';
    imageDetector.loadImageFromUrl(createDemoFabricTexture('#4A5B42', '#70885E', 'VERDE MILITAR'));
  });

  DOM.demoSwatch2.addEventListener('click', () => {
    if (DOM.canvasPlaceholder) DOM.canvasPlaceholder.style.display = 'none';
    imageDetector.loadImageFromUrl(createDemoFabricTexture('#D99B26', '#FFB703', 'MOSTAZA TEXTIL'));
  });

  DOM.demoSwatch3.addEventListener('click', () => {
    if (DOM.canvasPlaceholder) DOM.canvasPlaceholder.style.display = 'none';
    imageDetector.loadImageFromUrl(createDemoFabricTexture('#112244', '#1E3A8A', 'AZUL MARINO'));
  });

  // =================================================================
  // Selección y Cambio de Color Objetivo
  // =================================================================
  function setTargetColor(hex) {
    hex = hex.toUpperCase();
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return;

    const rgb = ColorMath.hexToRgb(hex);
    AppState.currentTarget = { ...rgb, hex };

    DOM.targetColorNative.value = hex;
    DOM.targetColorHex.value = hex;
    DOM.targetColorRgbLabel.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  DOM.targetColorNative.addEventListener('input', (e) => {
    setTargetColor(e.target.value);
  });

  DOM.targetColorNative.addEventListener('change', () => {
    calculateCurrentFormula();
  });

  DOM.targetColorHex.addEventListener('change', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      setTargetColor(val);
      calculateCurrentFormula();
    }
  });

  // Selección de tipo de prenda
  DOM.fabricLightBtn.addEventListener('click', () => {
    DOM.fabricLightBtn.classList.add('active');
    DOM.fabricDarkBtn.classList.remove('active');
    AppState.fabricType = 'light';
    DOM.formulaTypeBadge.textContent = 'Telas Claras (Acramina)';
    calculateCurrentFormula();
  });

  DOM.fabricDarkBtn.addEventListener('click', () => {
    DOM.fabricDarkBtn.classList.add('active');
    DOM.fabricLightBtn.classList.remove('active');
    AppState.fabricType = 'dark';
    DOM.formulaTypeBadge.textContent = 'Telas Oscuras (Laca Blanca)';
    calculateCurrentFormula();
  });

  // =================================================================
  // Cálculo de Fórmula Óptima (Color Matcher Inverso)
  // =================================================================
  function calculateCurrentFormula() {
    const targetRgb = {
      r: AppState.currentTarget.r,
      g: AppState.currentTarget.g,
      b: AppState.currentTarget.b
    };

    const formula = PigmentEngine.findBestFormula(targetRgb, AppState.fabricType);
    AppState.currentFormula = formula;

    // Actualizar comparativa visual
    DOM.matchTargetSide.style.backgroundColor = formula.target.hex;
    DOM.matchTargetHex.textContent = formula.target.hex;
    DOM.matchSimSide.style.backgroundColor = formula.simulated.dry.hex;
    DOM.matchSimHex.textContent = formula.simulated.dry.hex;

    // Métricas Delta E
    DOM.matchDeltaE.textContent = `ΔE ${formula.deltaE.toFixed(1)}`;
    DOM.matchQualityBadge.className = `delta-badge ${formula.quality.badgeClass}`;
    DOM.matchQualityBadge.textContent = formula.quality.label;

    // Alerta de sobrepigmentación
    if (formula.isOverpigmented) {
      DOM.overpigmentAlert.style.display = 'flex';
      DOM.overpigmentText.textContent = `Atención: Carga de pigmento (${formula.totalPigmentPercent}%) excede el límite recomendado de ${formula.base.maxPigmentPercent}% para ${formula.base.name}. Podría comprometer la solidez al lavado.`;
    } else {
      DOM.overpigmentAlert.style.display = 'none';
    }

    // Renderizar desglose de ingredientes en porcentajes
    renderFormulaBreakdown(formula);
  }

  DOM.calculateFormulaBtn.addEventListener('click', () => {
    calculateCurrentFormula();
  });

  function renderFormulaBreakdown(formula) {
    DOM.recipeIngredientsList.innerHTML = '';
    const brand = AppState.selectedBrand || 'genesis';
    const brandProfile = PigmentEngine.REGIONAL_BRANDS[brand] || PigmentEngine.REGIONAL_BRANDS.genesis;

    // Fila de la Base
    const baseRow = document.createElement('div');
    baseRow.className = 'ingredient-row';
    const baseDot = formula.base.id === 'white_opaque' ? '#FFFFFF' : '#E8E4D9';
    const commercialBaseName = (brandProfile.baseNames && brandProfile.baseNames[formula.base.id])
      ? brandProfile.baseNames[formula.base.id]
      : formula.base.name;

    baseRow.innerHTML = `
      <div class="ingredient-info">
        <span class="color-dot" style="background-color: ${baseDot}"></span>
        <div>
          <div class="ingredient-name">${commercialBaseName}</div>
          <div class="ingredient-tag">${formula.base.category} • ${brandProfile.name}</div>
        </div>
      </div>
      <div class="ingredient-percent">${formula.basePercent.toFixed(1)}%</div>
    `;
    DOM.recipeIngredientsList.appendChild(baseRow);

    // Filas de Pigmentos
    for (const [pigId, percent] of Object.entries(formula.pigments)) {
      const pig = PigmentEngine.PIGMENTS[pigId];
      if (!pig) continue;

      const brandItem = (pig.brands && pig.brands[brand]) ? pig.brands[brand] : { name: pig.name, code: pig.code };

      const pigRow = document.createElement('div');
      pigRow.className = 'ingredient-row';
      pigRow.innerHTML = `
        <div class="ingredient-info">
          <span class="color-dot" style="background-color: ${pig.hex}"></span>
          <div>
            <div class="ingredient-name">${brandItem.name}</div>
            <div class="ingredient-tag">${brandItem.code} (${pig.code})</div>
          </div>
        </div>
        <div class="ingredient-percent">${percent.toFixed(2)}%</div>
      `;
      DOM.recipeIngredientsList.appendChild(pigRow);
    }
  }

  // Enviar fórmula calculada al módulo de balanza
  DOM.sendToWeighingBtn.addEventListener('click', () => {
    if (!AppState.currentFormula) calculateCurrentFormula();
    AppState.activeWeighingBatch.formula = AppState.currentFormula;
    switchTab('weighingTab');
  });

  // =================================================================
  // Simulador Libre de Mezclas (Laboratorio)
  // =================================================================
  function initSimulatorSliders() {
    DOM.pigmentSlidersContainer.innerHTML = '';
    const brand = AppState.selectedBrand || 'genesis';

    for (const [id, pig] of Object.entries(PigmentEngine.PIGMENTS)) {
      const brandItem = (pig.brands && pig.brands[brand]) ? pig.brands[brand] : { name: pig.name, code: pig.code };
      const currentVal = AppState.currentSimRecipe.pigments[id] || 0;

      const group = document.createElement('div');
      group.className = 'slider-group';
      group.innerHTML = `
        <div class="slider-header">
          <div class="slider-title-wrap">
            <span class="color-dot" style="background-color: ${pig.hex}"></span>
            <span class="slider-title">${brandItem.name}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${brandItem.code}</span>
          </div>
          <span class="slider-value-badge" id="val_${id}">${currentVal.toFixed(1)}%</span>
        </div>
        <input type="range" class="range-slider" id="slider_${id}" data-pig="${id}" min="0" max="8" step="0.1" value="${currentVal}">
      `;

      const slider = group.querySelector('.range-slider');
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        AppState.currentSimRecipe.pigments[id] = val;
        group.querySelector(`#val_${id}`).textContent = `${val.toFixed(1)}%`;
        updateSimResults();
      });

      DOM.pigmentSlidersContainer.appendChild(group);
    }
  }

  DOM.simBaseSelect.addEventListener('change', (e) => {
    AppState.currentSimRecipe.baseId = e.target.value;
    updateSimResults();
  });

  DOM.resetSimSlidersBtn.addEventListener('click', () => {
    for (const id in AppState.currentSimRecipe.pigments) {
      AppState.currentSimRecipe.pigments[id] = 0;
      const slider = document.getElementById(`slider_${id}`);
      if (slider) slider.value = 0;
      const valBadge = document.getElementById(`val_${id}`);
      if (valBadge) valBadge.textContent = '0.0%';
    }
    updateSimResults();
  });

  function updateSimResults() {
    const baseId = AppState.currentSimRecipe.baseId;
    const activePigments = {};

    for (const [id, val] of Object.entries(AppState.currentSimRecipe.pigments)) {
      if (val > 0) activePigments[id] = val;
    }

    const sim = PigmentEngine.simulateMixture(baseId, activePigments);

    // Actualizar badge de carga de pigmento
    DOM.simTotalPigmentBadge.textContent = `${sim.totalPigmentPercent}% Pigmento`;
    if (sim.isOverpigmented) {
      DOM.simTotalPigmentBadge.style.color = 'var(--accent-danger)';
      DOM.simTotalPigmentBadge.style.background = 'rgba(239, 71, 111, 0.2)';
    } else {
      DOM.simTotalPigmentBadge.style.color = 'var(--primary)';
      DOM.simTotalPigmentBadge.style.background = 'rgba(0, 229, 255, 0.1)';
    }

    // Actualizar Swatches Húmedo vs Curado
    DOM.simWetBox.style.backgroundColor = sim.wet.hex;
    DOM.simWetHex.textContent = sim.wet.hex;
    DOM.simDryBox.style.backgroundColor = sim.dry.hex;
    DOM.simDryHex.textContent = sim.dry.hex;

    // Actualizar Siluetas de Prenda
    DOM.swatchWhiteShirt.style.backgroundColor = sim.dry.hex;
    DOM.swatchGrayShirt.style.backgroundColor = sim.dry.hex;

    // Si la base es transparente y el fondo es negro, la tinta se oscurece drásticamente
    if (baseId === 'clear') {
      const darkLab = { L: sim.dry.lab.L * 0.35, a: sim.dry.lab.a * 0.6, b: sim.dry.lab.b * 0.6 };
      const darkRgb = ColorMath.labToRgb(darkLab.L, darkLab.a, darkLab.b);
      DOM.swatchBlackShirt.style.backgroundColor = ColorMath.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b);
    } else {
      DOM.swatchBlackShirt.style.backgroundColor = sim.dry.hex;
    }

    // Actualizar desglose en lista
    renderSimBreakdown(sim, activePigments);
  }

  function renderSimBreakdown(sim, activePigments) {
    DOM.simBreakdownList.innerHTML = '';
    const baseInfo = PigmentEngine.BASES[sim.baseId];

    const baseRow = document.createElement('div');
    baseRow.className = 'ingredient-row';
    baseRow.innerHTML = `
      <div class="ingredient-info">
        <span class="color-dot" style="background-color: ${baseInfo.id === 'white_opaque' ? '#FFF' : '#E8E4D9'}"></span>
        <span class="ingredient-name">${baseInfo.name}</span>
      </div>
      <span class="ingredient-percent">${sim.basePercent}%</span>
    `;
    DOM.simBreakdownList.appendChild(baseRow);

    for (const [id, val] of Object.entries(activePigments)) {
      const pig = PigmentEngine.PIGMENTS[id];
      const pigRow = document.createElement('div');
      pigRow.className = 'ingredient-row';
      pigRow.innerHTML = `
        <div class="ingredient-info">
          <span class="color-dot" style="background-color: ${pig.hex}"></span>
          <span class="ingredient-name">${pig.name}</span>
        </div>
        <span class="ingredient-percent">${val}%</span>
      `;
      DOM.simBreakdownList.appendChild(pigRow);
    }
  }

  DOM.sendSimToWeighingBtn.addEventListener('click', () => {
    const baseId = AppState.currentSimRecipe.baseId;
    const activePigments = {};
    for (const [id, val] of Object.entries(AppState.currentSimRecipe.pigments)) {
      if (val > 0) activePigments[id] = val;
    }
    const sim = PigmentEngine.simulateMixture(baseId, activePigments);
    const baseInfo = PigmentEngine.BASES[baseId];

    AppState.activeWeighingBatch.formula = {
      base: baseInfo,
      basePercent: sim.basePercent,
      pigments: activePigments,
      totalPigmentPercent: sim.totalPigmentPercent,
      simulated: sim
    };

    switchTab('weighingTab');
  });

  // =================================================================
  // Ficha de Pesaje para Balanza de Taller
  // =================================================================
  function renderWeighingSheet() {
    let formula = AppState.activeWeighingBatch.formula;
    if (!formula) {
      if (!AppState.currentFormula) calculateCurrentFormula();
      formula = AppState.currentFormula;
      AppState.activeWeighingBatch.formula = formula;
    }

    const totalGrams = AppState.activeWeighingBatch.totalGrams;
    const scaleData = PigmentEngine.scaleRecipe(formula, totalGrams, AppState.selectedBrand);
    const tareMode = AppState.activeWeighingBatch.tareMode;

    DOM.weighingTableBody.innerHTML = '';

    scaleData.ingredients.forEach((item, index) => {
      const tr = document.createElement('tr');
      const targetDisplay = tareMode ? `${item.accumGrams} g` : `${item.netGrams} g`;

      tr.innerHTML = `
        <td><span class="scale-step-badge">${index + 1}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span class="color-dot" style="background-color: ${item.colorDot}"></span>
            <div>
              <strong style="color: #ffffff;">${item.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.notes || ''}</div>
            </div>
          </div>
        </td>
        <td><span style="font-size: 0.8rem; color: var(--text-muted);">${item.category}</span></td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">${item.percent}%</td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600; color: #ffffff;">${item.netGrams} g</td>
        <td style="text-align: right;" class="scale-digit">${targetDisplay}</td>
        <td style="text-align: center;">
          <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
        </td>
      `;
      DOM.weighingTableBody.appendChild(tr);
    });

    // Aditivos recomendados
    DOM.additivesList.innerHTML = '';
    scaleData.additives.forEach(add => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: 600;">
          <span style="color: #ffffff;">• ${add.name}</span>
          <span style="color: var(--primary); font-family: var(--font-mono);">${add.suggestedGrams} g (${add.suggestedPercent}%)</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.9rem;">${add.purpose}</div>
      `;
      DOM.additivesList.appendChild(li);
    });

    // Parámetros técnicos
    DOM.technicalSpecsBox.innerHTML = `
      <div><strong>Hilatura de Malla Sugerida:</strong> <span style="color: var(--accent-green); font-weight: 600;">${scaleData.technicalRecommendations.mesh}</span></div>
      <div><strong>Temperatura de Curado:</strong> <span style="color: #ffffff;">${scaleData.technicalRecommendations.cure}</span></div>
      <div><strong>Limpieza de Pantallas:</strong> <span style="color: var(--text-muted);">${scaleData.technicalRecommendations.cleanUp}</span></div>
      <div style="font-size: 0.8rem; color: var(--accent-amber);">💡 ${scaleData.technicalRecommendations.maxPigmentNote}</div>
    `;

    // Metadatos para impresión
    DOM.printTicketDate.textContent = new Date().toLocaleString('es-ES');
    DOM.printTicketBase.textContent = scaleData.baseName;
    DOM.printTicketTotalGrams.textContent = `${totalGrams} g`;
  }

  // Píldoras de selección de lote
  DOM.batchPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.batchPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const g = parseInt(btn.dataset.grams, 10);
      DOM.customBatchInput.value = g;
      AppState.activeWeighingBatch.totalGrams = g;
      renderWeighingSheet();
    });
  });

  DOM.customBatchInput.addEventListener('change', (e) => {
    const val = Math.max(10, parseInt(e.target.value, 10) || 250);
    AppState.activeWeighingBatch.totalGrams = val;
    DOM.batchPillBtns.forEach(b => b.classList.remove('active'));
    renderWeighingSheet();
  });

  // Estimador por Prendas
  DOM.applyShirtEstimateBtn.addEventListener('click', () => {
    const shirts = parseInt(DOM.shirtCountInput.value, 10) || 20;
    const coverage = DOM.shirtCoverageSelect.value;
    const baseId = AppState.activeWeighingBatch.formula ? AppState.activeWeighingBatch.formula.base.id : 'clear';
    const estimate = RecipeManager.estimateInkNeeds(shirts, coverage, baseId);

    AppState.activeWeighingBatch.totalGrams = estimate.recommendedTotalGrams;
    DOM.customBatchInput.value = estimate.recommendedTotalGrams;
    DOM.batchPillBtns.forEach(b => b.classList.remove('active'));
    renderWeighingSheet();
  });

  // Modo Balanza Tara
  DOM.scaleModeTare.addEventListener('change', (e) => {
    AppState.activeWeighingBatch.tareMode = e.target.checked;
    renderWeighingSheet();
  });

  // Botón Imprimir Ficha
  DOM.printTicketBtn.addEventListener('click', () => {
    window.print();
  });

  // =================================================================
  // Modal y Gestión de Fórmulas Guardadas
  // =================================================================
  function openSaveModal(defaultTitle = '') {
    DOM.saveRecipeTitle.value = defaultTitle || `Color ${AppState.currentTarget.hex}`;
    DOM.saveRecipeClient.value = '';
    DOM.saveRecipeNotes.value = '';
    DOM.saveRecipeModal.classList.add('active');
  }

  DOM.openSaveModalBtn.addEventListener('click', () => {
    openSaveModal();
  });

  DOM.openSaveSimModalBtn.addEventListener('click', () => {
    openSaveModal('Mezcla Simulador ' + new Date().toLocaleDateString());
  });

  DOM.cancelSaveModalBtn.addEventListener('click', () => {
    DOM.saveRecipeModal.classList.remove('active');
  });

  DOM.confirmSaveRecipeBtn.addEventListener('click', () => {
    const title = DOM.saveRecipeTitle.value.trim() || 'Receta sin título';
    const client = DOM.saveRecipeClient.value.trim();
    const notes = DOM.saveRecipeNotes.value.trim();

    let formulaToSave = AppState.currentFormula;
    if (AppState.activeTab === 'simulatorTab') {
      const baseId = AppState.currentSimRecipe.baseId;
      const activePigments = {};
      for (const [id, val] of Object.entries(AppState.currentSimRecipe.pigments)) {
        if (val > 0) activePigments[id] = val;
      }
      const sim = PigmentEngine.simulateMixture(baseId, activePigments);
      formulaToSave = {
        target: { hex: sim.dry.hex, rgb: sim.dry.rgb },
        base: PigmentEngine.BASES[baseId],
        basePercent: sim.basePercent,
        pigments: activePigments,
        totalPigmentPercent: sim.totalPigmentPercent,
        deltaE: 0,
        simulated: sim
      };
    }

    if (!formulaToSave) return;

    RecipeManager.saveRecipe({
      title,
      client,
      notes,
      targetColor: formulaToSave.target ? formulaToSave.target.hex : formulaToSave.simulated.dry.hex,
      simulatedColor: formulaToSave.simulated.dry.hex,
      baseId: formulaToSave.base.id,
      baseName: formulaToSave.base.name,
      basePercent: formulaToSave.basePercent,
      pigments: formulaToSave.pigments,
      totalPigmentPercent: formulaToSave.totalPigmentPercent,
      deltaE: formulaToSave.deltaE,
      fabricType: AppState.fabricType,
      targetGrams: AppState.activeWeighingBatch.totalGrams
    });

    DOM.saveRecipeModal.classList.remove('active');
    alert('¡Receta guardada exitosamente en tu biblioteca!');
    renderSavedRecipesList();
  });

  // Renderizar Biblioteca de Recetas
  function renderSavedRecipesList(query = '') {
    const recipes = RecipeManager.getSavedRecipes();
    DOM.savedCountBadge.textContent = `${recipes.length} Fórmulas`;

    const filtered = query
      ? recipes.filter(r => 
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.client.toLowerCase().includes(query.toLowerCase()) ||
          r.targetColor.toLowerCase().includes(query.toLowerCase())
        )
      : recipes;

    DOM.savedRecipesGrid.innerHTML = '';

    if (filtered.length === 0) {
      DOM.noSavedRecipesNotice.style.display = 'block';
      return;
    }
    DOM.noSavedRecipesNotice.style.display = 'none';

    filtered.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '1.25rem';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.85rem;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #ffffff;">${rec.title}</h3>
            ${rec.client ? `<div style="font-size: 0.78rem; color: var(--primary);">${rec.client}</div>` : ''}
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${rec.dateFormatted}</div>
          </div>
          <div style="width: 38px; height: 38px; border-radius: 50%; background-color: ${rec.simulatedColor}; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.5);"></div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.85rem;">
          <strong>Base:</strong> ${rec.baseName} (${rec.basePercent}%)<br>
          <strong>Carga Pigmento:</strong> ${rec.totalPigmentPercent}%
        </div>

        ${rec.notes ? `<div style="font-size: 0.78rem; background: rgba(255,255,255,0.03); padding: 0.5rem; border-radius: 6px; margin-bottom: 1rem; color: var(--text-subtle);">📝 ${rec.notes}</div>` : ''}

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.6rem;">
          <button class="btn-secondary load-recipe-btn" style="padding: 0.45rem; font-size: 0.82rem;">
            <span>⚖️</span> Cargar en Balanza
          </button>
          <button class="btn-secondary delete-recipe-btn" style="padding: 0.45rem 0.7rem; color: var(--accent-danger);" title="Eliminar receta">
            <span>🗑️</span>
          </button>
        </div>
      `;

      card.querySelector('.load-recipe-btn').addEventListener('click', () => {
        AppState.activeWeighingBatch.formula = {
          base: PigmentEngine.BASES[rec.baseId] || PigmentEngine.BASES.clear,
          basePercent: rec.basePercent,
          pigments: rec.pigments,
          totalPigmentPercent: rec.totalPigmentPercent,
          simulated: PigmentEngine.simulateMixture(rec.baseId, rec.pigments)
        };
        switchTab('weighingTab');
      });

      card.querySelector('.delete-recipe-btn').addEventListener('click', () => {
        if (confirm(`¿Seguro que deseas eliminar la receta "${rec.title}"?`)) {
          RecipeManager.deleteRecipe(rec.id);
          renderSavedRecipesList(DOM.searchSavedInput.value.trim());
        }
      });

      DOM.savedRecipesGrid.appendChild(card);
    });
  }

  DOM.searchSavedInput.addEventListener('input', (e) => {
    renderSavedRecipesList(e.target.value.trim());
  });

  // Cambio de marca regional (Gênesis, Vortex, Genérico)
  if (DOM.regionalBrandSelect) {
    DOM.regionalBrandSelect.addEventListener('change', (e) => {
      AppState.selectedBrand = e.target.value;
      initSimulatorSliders();
      if (AppState.currentFormula) renderFormulaBreakdown(AppState.currentFormula);
      renderWeighingSheet();
      updateSimResults();
    });
  }

  // Registro del Service Worker para funcionamiento offline (PWA / APK)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('Service Worker registrado correctamente (Modo Offline activo):', reg.scope);
      }).catch((err) => {
        console.log('Nota sobre Service Worker:', err);
      });
    });
  }

  // =================================================================
  // Inicialización de la Aplicación
  // =================================================================
  initSimulatorSliders();
  calculateCurrentFormula();
  updateSimResults();
});

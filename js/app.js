/**
 * ColorTextil Studio - Mobile-First Precision Controller
 * Diseñado para flujo táctil rápido, sobrio y ergonómico en el taller textil.
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
      tareMode: true,
      currentStep: 0
    },
    selectedBrand: 'genesis' // 'genesis' (Uruguay/Brasil) | 'vortex' (Argentina) | 'generic'
  };

  // =================================================================
  // Referencias a Elementos del DOM
  // =================================================================
  const DOM = {
    // Navegación Inferior Móvil (Bottom Tabs)
    bottomTabBtns: document.querySelectorAll('.bottom-tab-btn'),
    tabViews: document.querySelectorAll('.tab-view'),
    regionalBrandSelect: document.getElementById('regionalBrandSelect'),
    installAppBtn: document.getElementById('installAppBtn'),

    // Formulador y Captura
    touchUploadTrigger: document.getElementById('touchUploadTrigger'),
    fileInput: document.getElementById('fileInput'),
    canvasSection: document.getElementById('canvasSection'),
    closeCanvasBtn: document.getElementById('closeCanvasBtn'),
    imageCanvas: document.getElementById('imageCanvas'),
    canvasPlaceholder: document.getElementById('canvasPlaceholder'),
    loupeContainer: document.getElementById('loupeContainer'),
    loupeCanvas: document.getElementById('loupeCanvas'),
    paletteStripContainer: document.getElementById('paletteStripContainer'),
    paletteChips: document.getElementById('paletteChips'),
    demoSwatch1: document.getElementById('demoSwatch1'),
    demoSwatch2: document.getElementById('demoSwatch2'),
    demoSwatch3: document.getElementById('demoSwatch3'),

    // Inputs de color y tela
    targetColorNative: document.getElementById('targetColorNative'),
    targetColorHex: document.getElementById('targetColorHex'),
    targetColorRgbLabel: document.getElementById('targetColorRgbLabel'),
    fabricLightBtn: document.getElementById('fabricLightBtn'),
    fabricDarkBtn: document.getElementById('fabricDarkBtn'),
    calculateFormulaBtn: document.getElementById('calculateFormulaBtn'),

    // Comparativa y Tarjeta de Receta
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

    // Mezclador Libre
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
    sendSimToWeighingBtn: document.getElementById('sendSimToWeighingBtn'),

    // Balanza Digital HUD
    scaleCurrentStepBadge: document.getElementById('scaleCurrentStepBadge'),
    scaleCurrentIngredientName: document.getElementById('scaleCurrentIngredientName'),
    scaleTargetReading: document.getElementById('scaleTargetReading'),
    scaleReadingModeCaption: document.getElementById('scaleReadingModeCaption'),
    scalePrevStepBtn: document.getElementById('scalePrevStepBtn'),
    scaleNextStepBtn: document.getElementById('scaleNextStepBtn'),
    customBatchInput: document.getElementById('customBatchInput'),
    batchPillBtns: document.querySelectorAll('.batch-pill-btn'),
    scaleModeTare: document.getElementById('scaleModeTare'),
    printTicketBtn: document.getElementById('printTicketBtn'),
    weighChecklistContainer: document.getElementById('weighChecklistContainer'),
    additivesList: document.getElementById('additivesList'),
    technicalSpecsBox: document.getElementById('technicalSpecsBox'),

    // Guardadas
    savedRecipesGrid: document.getElementById('savedRecipesGrid'),
    noSavedRecipesNotice: document.getElementById('noSavedRecipesNotice'),
    savedCountBadge: document.getElementById('savedCountBadge'),
    searchSavedInput: document.getElementById('searchSavedInput'),

    // Modales
    saveRecipeModal: document.getElementById('saveRecipeModal'),
    saveRecipeTitle: document.getElementById('saveRecipeTitle'),
    saveRecipeClient: document.getElementById('saveRecipeClient'),
    saveRecipeNotes: document.getElementById('saveRecipeNotes'),
    cancelSaveModalBtn: document.getElementById('cancelSaveModalBtn'),
    confirmSaveRecipeBtn: document.getElementById('confirmSaveRecipeBtn'),
    installInstructionsModal: document.getElementById('installInstructionsModal'),
    closeInstallModalBtn: document.getElementById('closeInstallModalBtn')
  };

  // =================================================================
  // Inspector de Imágenes y Gotero
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
  // Navegación Inferior (Bottom Tab Bar)
  // =================================================================
  function switchTab(targetId) {
    DOM.bottomTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetId);
    });
    DOM.tabViews.forEach(view => {
      view.classList.toggle('active', view.id === targetId);
    });
    AppState.activeTab = targetId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetId === 'savedTab') {
      renderSavedRecipesList();
    } else if (targetId === 'weighingTab') {
      renderWeighingSheet();
    }
  }

  DOM.bottomTabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.target));
  });

  // =================================================================
  // Carga de Fotos Táctil (Cámara o Galería)
  // =================================================================
  function openCanvasView() {
    if (DOM.canvasSection) DOM.canvasSection.style.display = 'block';
    if (DOM.canvasPlaceholder) DOM.canvasPlaceholder.style.display = 'none';
  }

  if (DOM.closeCanvasBtn && DOM.canvasSection) {
    DOM.closeCanvasBtn.addEventListener('click', () => {
      DOM.canvasSection.style.display = 'none';
    });
  }

  if (DOM.touchUploadTrigger && DOM.fileInput) {
    DOM.touchUploadTrigger.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        openCanvasView();
        imageDetector.loadFile(e.target.files[0]);
      }
    });
  }

  // Pegar directo con Ctrl+V
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData ? e.clipboardData.items : [];
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        openCanvasView();
        imageDetector.loadFile(item.getAsFile());
        break;
      }
    }
  });

  // Muestras de prueba rápidas
  function createDemoTexture(primary, secondary, label) {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 300;
    const ctx = c.getContext('2d');
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, c.width, c.height);

    // Textura textil sutil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 0; x < c.width; x += 4) ctx.fillRect(x, 0, 1.5, c.height);
    for (let y = 0; y < c.height; y += 4) ctx.fillRect(0, y, c.width, 1.5);

    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.arc(200, 150, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 200, 156);
    return c.toDataURL('image/png');
  }

  DOM.demoSwatch1.addEventListener('click', () => {
    openCanvasView();
    imageDetector.loadImageFromUrl(createDemoTexture('#4A5B42', '#70885E', 'VERDE MILITAR'));
  });
  DOM.demoSwatch2.addEventListener('click', () => {
    openCanvasView();
    imageDetector.loadImageFromUrl(createDemoTexture('#D99B26', '#FFB703', 'MOSTAZA CÁLIDO'));
  });
  DOM.demoSwatch3.addEventListener('click', () => {
    openCanvasView();
    imageDetector.loadImageFromUrl(createDemoTexture('#112244', '#1E3A8A', 'AZUL MARINO'));
  });

  // Renderizar chips de paleta K-Means horizontal
  function renderPaletteChips(palette) {
    if (!palette || palette.length === 0) {
      if (DOM.paletteStripContainer) DOM.paletteStripContainer.style.display = 'none';
      return;
    }

    if (DOM.paletteStripContainer) DOM.paletteStripContainer.style.display = 'block';
    DOM.paletteChips.innerHTML = '';

    palette.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'palette-item' + (idx === 0 ? ' active' : '');
      el.innerHTML = `
        <div class="palette-swatch-box" style="background-color: ${item.hex}"></div>
        <span class="palette-item-pct">${item.percentage}%</span>
      `;
      el.addEventListener('click', () => {
        document.querySelectorAll('.palette-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        setTargetColor(item.hex);
        calculateCurrentFormula();
      });
      DOM.paletteChips.appendChild(el);
    });
  }

  // =================================================================
  // Selección y Cambio de Color
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
    calculateCurrentFormula();
  });

  DOM.targetColorHex.addEventListener('input', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      setTargetColor(val);
      calculateCurrentFormula();
    }
  });

  // Segmented Control de Tela
  DOM.fabricLightBtn.addEventListener('click', () => {
    DOM.fabricLightBtn.classList.add('active');
    DOM.fabricDarkBtn.classList.remove('active');
    AppState.fabricType = 'light';
    calculateCurrentFormula();
  });

  DOM.fabricDarkBtn.addEventListener('click', () => {
    DOM.fabricDarkBtn.classList.add('active');
    DOM.fabricLightBtn.classList.remove('active');
    AppState.fabricType = 'dark';
    calculateCurrentFormula();
  });

  // =================================================================
  // Cálculo de Fórmula Óptima
  // =================================================================
  function calculateCurrentFormula() {
    const targetRgb = {
      r: AppState.currentTarget.r,
      g: AppState.currentTarget.g,
      b: AppState.currentTarget.b
    };

    const formula = PigmentEngine.findBestFormula(targetRgb, AppState.fabricType);
    AppState.currentFormula = formula;

    // Actualizar dual swatch
    DOM.matchTargetSide.style.backgroundColor = formula.target.hex;
    DOM.matchTargetHex.textContent = formula.target.hex;
    DOM.matchSimSide.style.backgroundColor = formula.simulated.dry.hex;
    DOM.matchSimHex.textContent = formula.simulated.dry.hex;

    // Métrica Delta E
    DOM.matchDeltaE.textContent = `ΔE ${formula.deltaE.toFixed(1)}`;
    DOM.matchQualityBadge.className = `delta-quality-tag ${formula.quality.badgeClass}`;
    DOM.matchQualityBadge.textContent = formula.quality.label;

    // Alerta sobrepigmentación
    if (formula.isOverpigmented) {
      DOM.overpigmentAlert.style.display = 'block';
      DOM.overpigmentText.textContent = `Atención: Carga de pigmento (${formula.totalPigmentPercent}%) supera el ${formula.base.maxPigmentPercent}% de seguridad.`;
    } else {
      DOM.overpigmentAlert.style.display = 'none';
    }

    renderFormulaBreakdown(formula);
  }

  DOM.calculateFormulaBtn.addEventListener('click', () => calculateCurrentFormula());

  function renderFormulaBreakdown(formula) {
    DOM.recipeIngredientsList.innerHTML = '';
    const brand = AppState.selectedBrand || 'genesis';
    const brandProfile = PigmentEngine.REGIONAL_BRANDS[brand] || PigmentEngine.REGIONAL_BRANDS.genesis;
    const batchGrams = AppState.activeWeighingBatch.totalGrams || 250;

    // Fila Base
    const baseRow = document.createElement('div');
    baseRow.className = 'ingredient-item';
    const baseDot = formula.base.id === 'white_opaque' ? '#FFFFFF' : '#E8E4D9';
    const commercialBase = (brandProfile.baseNames && brandProfile.baseNames[formula.base.id])
      ? brandProfile.baseNames[formula.base.id]
      : formula.base.name;
    const baseG = ((formula.basePercent / 100) * batchGrams).toFixed(1);

    baseRow.innerHTML = `
      <div class="ingredient-meta">
        <span class="color-dot" style="background-color: ${baseDot}"></span>
        <div>
          <div class="ingredient-title">${commercialBase}</div>
          <div class="ingredient-subtitle">${formula.base.category}</div>
        </div>
      </div>
      <div class="ingredient-values-wrap">
        <span class="ingredient-percentage">${formula.basePercent.toFixed(1)}%</span>
        <span class="ingredient-grams-preview">${baseG} g</span>
      </div>
    `;
    DOM.recipeIngredientsList.appendChild(baseRow);

    // Filas Pigmentos
    for (const [pigId, percent] of Object.entries(formula.pigments)) {
      const pig = PigmentEngine.PIGMENTS[pigId];
      if (!pig) continue;
      const brandItem = (pig.brands && pig.brands[brand]) ? pig.brands[brand] : { name: pig.name, code: pig.code };
      const pigG = ((percent / 100) * batchGrams).toFixed(2);

      const row = document.createElement('div');
      row.className = 'ingredient-item';
      row.innerHTML = `
        <div class="ingredient-meta">
          <span class="color-dot" style="background-color: ${pig.hex}"></span>
          <div>
            <div class="ingredient-title">${brandItem.name}</div>
            <div class="ingredient-subtitle">${brandItem.code}</div>
          </div>
        </div>
        <div class="ingredient-values-wrap">
          <span class="ingredient-percentage">${percent.toFixed(2)}%</span>
          <span class="ingredient-grams-preview">${pigG} g</span>
        </div>
      `;
      DOM.recipeIngredientsList.appendChild(row);
    }
  }

  DOM.sendToWeighingBtn.addEventListener('click', () => {
    if (!AppState.currentFormula) calculateCurrentFormula();
    AppState.activeWeighingBatch.formula = AppState.currentFormula;
    AppState.activeWeighingBatch.currentStep = 0;
    switchTab('weighingTab');
  });

  // =================================================================
  // Mezclador Libre (Sliders táctiles)
  // =================================================================
  function initSimulatorSliders() {
    DOM.pigmentSlidersContainer.innerHTML = '';
    const brand = AppState.selectedBrand || 'genesis';

    for (const [id, pig] of Object.entries(PigmentEngine.PIGMENTS)) {
      const brandItem = (pig.brands && pig.brands[brand]) ? pig.brands[brand] : { name: pig.name, code: pig.code };
      const currentVal = AppState.currentSimRecipe.pigments[id] || 0;

      const row = document.createElement('div');
      row.className = 'slider-touch-row';
      row.innerHTML = `
        <div class="slider-touch-header">
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span class="color-dot" style="background-color: ${pig.hex}"></span>
            <span>${brandItem.name} <small style="color:var(--text-muted); font-size:0.7rem;">(${brandItem.code})</small></span>
          </div>
          <span class="slider-touch-val" id="val_${id}">${currentVal.toFixed(1)}%</span>
        </div>
        <input type="range" class="range-slider" id="slider_${id}" data-pig="${id}" min="0" max="8" step="0.1" value="${currentVal}">
      `;

      const slider = row.querySelector('.range-slider');
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        AppState.currentSimRecipe.pigments[id] = val;
        row.querySelector(`#val_${id}`).textContent = `${val.toFixed(1)}%`;
        updateSimResults();
      });

      DOM.pigmentSlidersContainer.appendChild(row);
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

    DOM.simTotalPigmentBadge.textContent = `${sim.totalPigmentPercent}% Pigmento`;
    DOM.simWetBox.style.backgroundColor = sim.wet.hex;
    DOM.simWetHex.textContent = sim.wet.hex;
    DOM.simDryBox.style.backgroundColor = sim.dry.hex;
    DOM.simDryHex.textContent = sim.dry.hex;

    DOM.swatchWhiteShirt.style.backgroundColor = sim.dry.hex;
    DOM.swatchGrayShirt.style.backgroundColor = sim.dry.hex;

    if (baseId === 'clear') {
      const darkLab = { L: sim.dry.lab.L * 0.35, a: sim.dry.lab.a * 0.6, b: sim.dry.lab.b * 0.6 };
      const darkRgb = ColorMath.labToRgb(darkLab.L, darkLab.a, darkLab.b);
      DOM.swatchBlackShirt.style.backgroundColor = ColorMath.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b);
    } else {
      DOM.swatchBlackShirt.style.backgroundColor = sim.dry.hex;
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
    AppState.activeWeighingBatch.currentStep = 0;
    switchTab('weighingTab');
  });

  // =================================================================
  // Modo Balanza Digital de Taller
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
    const ingredients = scaleData.ingredients;

    // Asegurar índice de paso válido
    if (AppState.activeWeighingBatch.currentStep >= ingredients.length) {
      AppState.activeWeighingBatch.currentStep = ingredients.length - 1;
    }
    if (AppState.activeWeighingBatch.currentStep < 0) {
      AppState.activeWeighingBatch.currentStep = 0;
    }

    const currentIdx = AppState.activeWeighingBatch.currentStep;
    const currentItem = ingredients[currentIdx] || ingredients[0];

    // Actualizar Visor HUD
    DOM.scaleCurrentStepBadge.textContent = `Paso ${currentIdx + 1} de ${ingredients.length}`;
    DOM.scaleCurrentIngredientName.textContent = currentItem.name;
    const readingVal = tareMode ? currentItem.accumGrams : currentItem.netGrams;
    DOM.scaleTargetReading.textContent = `${readingVal} g`;
    DOM.scaleReadingModeCaption.textContent = tareMode
      ? `Lectura acumulada en balanza (Tara continua)`
      : `Peso neto individual del componente`;

    // Lista interactiva de componentes
    DOM.weighChecklistContainer.innerHTML = '';
    ingredients.forEach((item, index) => {
      const row = document.createElement('div');
      const isCurrent = index === currentIdx;
      const isPast = index < currentIdx;

      row.className = 'weigh-check-item' + (isCurrent ? ' current-step' : '') + (isPast ? ' done' : '');
      const displayG = tareMode ? `${item.accumGrams} g` : `${item.netGrams} g`;
      const statusIcon = isPast ? '✓' : (index + 1);

      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.55rem;">
          <span class="step-num-bubble">${statusIcon}</span>
          <div>
            <div style="font-weight:600; font-size:0.86rem;">${item.name}</div>
            <div style="font-size:0.68rem; color:var(--text-muted);">${item.notes || ''}</div>
          </div>
        </div>
        <div style="font-family:var(--font-mono); font-weight:700; font-size:0.92rem; color:${isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)'};">
          ${displayG}
        </div>
      `;

      row.addEventListener('click', () => {
        AppState.activeWeighingBatch.currentStep = index;
        renderWeighingSheet();
      });

      DOM.weighChecklistContainer.appendChild(row);
    });

    // Aditivos
    DOM.additivesList.innerHTML = '';
    scaleData.additives.forEach(add => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:600;">
          <span>• ${add.name}</span>
          <span style="color:var(--accent-primary); font-family:var(--font-mono);">${add.suggestedGrams} g (${add.suggestedPercent}%)</span>
        </div>
        <div style="color:var(--text-muted); font-size:0.72rem; margin-left:0.75rem;">${add.purpose}</div>
      `;
      DOM.additivesList.appendChild(li);
    });

    // Parámetros técnicos
    DOM.technicalSpecsBox.innerHTML = `
      <div><strong>Malla Sugerida:</strong> <span style="color:var(--accent-success);">${scaleData.technicalRecommendations.mesh}</span></div>
      <div><strong>Curado Térmico:</strong> ${scaleData.technicalRecommendations.cure}</div>
      <div>💡 ${scaleData.technicalRecommendations.maxPigmentNote}</div>
    `;
  }

  // Navegación de pasos de balanza
  if (DOM.scalePrevStepBtn) {
    DOM.scalePrevStepBtn.addEventListener('click', () => {
      if (AppState.activeWeighingBatch.currentStep > 0) {
        AppState.activeWeighingBatch.currentStep--;
        renderWeighingSheet();
      }
    });
  }

  if (DOM.scaleNextStepBtn) {
    DOM.scaleNextStepBtn.addEventListener('click', () => {
      const formula = AppState.activeWeighingBatch.formula || AppState.currentFormula;
      const count = formula ? Object.keys(formula.pigments).length + 1 : 1;
      if (AppState.activeWeighingBatch.currentStep < count - 1) {
        AppState.activeWeighingBatch.currentStep++;
        renderWeighingSheet();
      }
    });
  }

  // Píldoras de tamaño de lote
  DOM.batchPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.batchPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const g = parseInt(btn.dataset.grams, 10);
      DOM.customBatchInput.value = g;
      AppState.activeWeighingBatch.totalGrams = g;
      renderWeighingSheet();
      if (AppState.currentFormula) renderFormulaBreakdown(AppState.currentFormula);
    });
  });

  DOM.customBatchInput.addEventListener('change', (e) => {
    const val = Math.max(10, parseInt(e.target.value, 10) || 250);
    AppState.activeWeighingBatch.totalGrams = val;
    DOM.batchPillBtns.forEach(b => b.classList.remove('active'));
    renderWeighingSheet();
    if (AppState.currentFormula) renderFormulaBreakdown(AppState.currentFormula);
  });

  DOM.scaleModeTare.addEventListener('change', (e) => {
    AppState.activeWeighingBatch.tareMode = e.target.checked;
    renderWeighingSheet();
  });

  DOM.printTicketBtn.addEventListener('click', () => window.print());

  // =================================================================
  // Modal y Gestión de Guardadas
  // =================================================================
  DOM.openSaveModalBtn.addEventListener('click', () => {
    DOM.saveRecipeTitle.value = `Color ${AppState.currentTarget.hex}`;
    DOM.saveRecipeClient.value = '';
    DOM.saveRecipeNotes.value = '';
    DOM.saveRecipeModal.classList.add('active');
  });

  DOM.cancelSaveModalBtn.addEventListener('click', () => {
    DOM.saveRecipeModal.classList.remove('active');
  });

  DOM.confirmSaveRecipeBtn.addEventListener('click', () => {
    const title = DOM.saveRecipeTitle.value.trim() || 'Receta sin título';
    const client = DOM.saveRecipeClient.value.trim();
    const notes = DOM.saveRecipeNotes.value.trim();
    const formula = AppState.currentFormula;
    if (!formula) return;

    RecipeManager.saveRecipe({
      title,
      client,
      notes,
      targetColor: formula.target.hex,
      simulatedColor: formula.simulated.dry.hex,
      baseId: formula.base.id,
      baseName: formula.base.name,
      basePercent: formula.basePercent,
      pigments: formula.pigments,
      totalPigmentPercent: formula.totalPigmentPercent,
      deltaE: formula.deltaE,
      fabricType: AppState.fabricType,
      targetGrams: AppState.activeWeighingBatch.totalGrams
    });

    DOM.saveRecipeModal.classList.remove('active');
    renderSavedRecipesList();
    switchTab('savedTab');
  });

  function renderSavedRecipesList(query = '') {
    const recipes = RecipeManager.getSavedRecipes();
    DOM.savedCountBadge.textContent = `${recipes.length} Recetas`;

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
      card.style.background = 'var(--bg-surface-elevated)';
      card.style.border = '1px solid var(--border-subtle)';
      card.style.borderRadius = 'var(--radius-sm)';
      card.style.padding = '0.75rem';

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.45rem;">
          <div>
            <div style="font-weight:700; font-size:0.92rem;">${rec.title}</div>
            ${rec.client ? `<div style="font-size:0.74rem; color:var(--accent-primary);">${rec.client}</div>` : ''}
            <div style="font-size:0.68rem; color:var(--text-muted);">${rec.dateFormatted}</div>
          </div>
          <div style="width:28px; height:28px; border-radius:50%; background-color:${rec.simulatedColor}; border:1px solid rgba(255,255,255,0.2);"></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr auto; gap:0.5rem; margin-top:0.6rem;">
          <button class="btn-action-main load-btn" style="min-height:36px; padding:0.4rem; font-size:0.8rem;">
            ⚖️ Cargar en Balanza
          </button>
          <button class="btn-action-secondary delete-btn" style="min-height:36px; padding:0.4rem 0.65rem; color:var(--accent-danger); margin-top:0;">
            🗑️
          </button>
        </div>
      `;

      card.querySelector('.load-btn').addEventListener('click', () => {
        AppState.activeWeighingBatch.formula = {
          base: PigmentEngine.BASES[rec.baseId] || PigmentEngine.BASES.clear,
          basePercent: rec.basePercent,
          pigments: rec.pigments,
          totalPigmentPercent: rec.totalPigmentPercent,
          simulated: PigmentEngine.simulateMixture(rec.baseId, rec.pigments)
        };
        AppState.activeWeighingBatch.currentStep = 0;
        switchTab('weighingTab');
      });

      card.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`¿Eliminar la receta "${rec.title}"?`)) {
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

  // Selector regional de marcas
  if (DOM.regionalBrandSelect) {
    DOM.regionalBrandSelect.addEventListener('change', (e) => {
      AppState.selectedBrand = e.target.value;
      initSimulatorSliders();
      if (AppState.currentFormula) renderFormulaBreakdown(AppState.currentFormula);
      renderWeighingSheet();
      updateSimResults();
    });
  }

  // Instalación de App PWA
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  if (DOM.installAppBtn) {
    DOM.installAppBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') DOM.installAppBtn.style.display = 'none';
        deferredPrompt = null;
      } else {
        if (DOM.installInstructionsModal) DOM.installInstructionsModal.classList.add('active');
      }
    });
  }

  if (DOM.closeInstallModalBtn && DOM.installInstructionsModal) {
    DOM.closeInstallModalBtn.addEventListener('click', () => {
      DOM.installInstructionsModal.classList.remove('active');
    });
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW note:', err));
    });
  }

  // Inicialización
  initSimulatorSliders();
  calculateCurrentFormula();
  updateSimResults();
});

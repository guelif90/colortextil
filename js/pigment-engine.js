/**
 * ColorTextil Studio - Pigment Engine & Inverse Formulator
 * Modelo de síntesis sustractiva y optimización para serigrafía textil al agua.
 */

const PigmentEngine = {
  // Catálogo de materias primas estándar para serigrafía al agua
  PIGMENTS: {
    yellow_lemon: {
      id: 'yellow_lemon',
      name: 'Amarillo Limón',
      code: 'P.Y. 74',
      brands: {
        genesis: { name: 'Amarelo Limão', code: 'Sericor T.5801' },
        vortex: { name: 'Amarillo Limón', code: 'Colores Tex 101' },
        generic: { name: 'Amarillo Limón', code: 'P.Y. 74' }
      },
      hex: '#FFE500',
      rgb: { r: 255, g: 229, b: 0 },
      lab: { L: 89.2, a: -12.4, b: 88.5 },
      tintPower: 1.0,
      description: 'Amarillo primario frío de alta pureza. Ideal para verdes brillantes y tonos cítricos.'
    },
    yellow_warm: {
      id: 'yellow_warm',
      name: 'Amarillo Oro / Cálido',
      code: 'P.Y. 83',
      brands: {
        genesis: { name: 'Amarelo Ouro', code: 'Sericor T.5802' },
        vortex: { name: 'Amarillo Cromo / Oro', code: 'Colores Tex 102' },
        generic: { name: 'Amarillo Cálido', code: 'P.Y. 83' }
      },
      hex: '#FFB700',
      rgb: { r: 255, g: 183, b: 0 },
      lab: { L: 78.5, a: 18.2, b: 82.0 },
      tintPower: 1.1,
      description: 'Amarillo dorado cálido. Base para naranjas limpios y tonos tierra.'
    },
    magenta_ruby: {
      id: 'magenta_ruby',
      name: 'Rojo Rubí / Magenta',
      code: 'P.R. 122',
      brands: {
        genesis: { name: 'Rubí / Magenta', code: 'Sericor T.5807' },
        vortex: { name: 'Magenta Textil', code: 'Colores Tex 205' },
        generic: { name: 'Rojo Rubí / Magenta', code: 'P.R. 122' }
      },
      hex: '#E40066',
      rgb: { r: 228, g: 0, b: 102 },
      lab: { L: 47.8, a: 72.5, b: 12.3 },
      tintPower: 1.25,
      description: 'Magenta primario puro. Esencial para violetas, fucsias, morados y rojos limpios.'
    },
    red_scarlet: {
      id: 'red_scarlet',
      name: 'Rojo Vivo / Fuego',
      code: 'P.R. 254',
      brands: {
        genesis: { name: 'Vermelho Vivo', code: 'Sericor T.5805' },
        vortex: { name: 'Rojo Vivo / Fuego', code: 'Colores Tex 201' },
        generic: { name: 'Rojo Escarlata', code: 'P.R. 254' }
      },
      hex: '#D91E18',
      rgb: { r: 217, g: 30, b: 24 },
      lab: { L: 45.2, a: 64.8, b: 49.5 },
      tintPower: 1.2,
      description: 'Rojo vivo cálido. Gran poder cubriente para rojos plenos y bermellones.'
    },
    cyan_blue: {
      id: 'cyan_blue',
      name: 'Azul Cyan / Médio',
      code: 'P.B. 15:3',
      brands: {
        genesis: { name: 'Azul Médio (Cyan)', code: 'Sericor T.5810' },
        vortex: { name: 'Azul Cyan', code: 'Colores Tex 301' },
        generic: { name: 'Azul Cyan', code: 'P.B. 15:3' }
      },
      hex: '#0085CA',
      rgb: { r: 0, g: 133, b: 202 },
      lab: { L: 52.4, a: -14.6, b: -45.2 },
      tintPower: 1.35,
      description: 'Azul ftalocianina puro. Primario sustractivo para turquesas, verdes y azules limpios.'
    },
    navy_blue: {
      id: 'navy_blue',
      name: 'Azul Marino / Royal',
      code: 'P.B. 15:1',
      brands: {
        genesis: { name: 'Azul Marinho / Royal', code: 'Sericor T.5811' },
        vortex: { name: 'Azul Marino', code: 'Colores Tex 303' },
        generic: { name: 'Azul Marino', code: 'P.B. 15:1' }
      },
      hex: '#0C2340',
      rgb: { r: 12, g: 35, b: 64 },
      lab: { L: 16.5, a: 2.1, b: -25.8 },
      tintPower: 1.5,
      description: 'Azul profundo de muy alto poder de tinción. Base para tonos oscuros y marinos.'
    },
    green_emerald: {
      id: 'green_emerald',
      name: 'Verde Bandeira / Esmeralda',
      code: 'P.G. 7',
      brands: {
        genesis: { name: 'Verde Bandeira', code: 'Sericor T.5815' },
        vortex: { name: 'Verde Esmeralda', code: 'Colores Tex 401' },
        generic: { name: 'Verde Esmeralda', code: 'P.G. 7' }
      },
      hex: '#008E5A',
      rgb: { r: 0, g: 142, b: 90 },
      lab: { L: 51.0, a: -52.4, b: 18.2 },
      tintPower: 1.3,
      description: 'Verde ftalocianina intenso y limpio. Brillo superior sin empalidecer.'
    },
    violet_carbazole: {
      id: 'violet_carbazole',
      name: 'Violeta',
      code: 'P.V. 23',
      brands: {
        genesis: { name: 'Violeta', code: 'Sericor T.5818' },
        vortex: { name: 'Violeta Textil', code: 'Colores Tex 501' },
        generic: { name: 'Violeta Carbazol', code: 'P.V. 23' }
      },
      hex: '#511B68',
      rgb: { r: 81, g: 27, b: 104 },
      lab: { L: 23.5, a: 39.8, b: -35.2 },
      tintPower: 1.6,
      description: 'Violeta de altísima concentración y solidez a la luz y al lavado.'
    },
    black_carbon: {
      id: 'black_carbon',
      name: 'Negro',
      code: 'P.Bk. 7',
      brands: {
        genesis: { name: 'Preto Concentrado', code: 'Sericor T.5820' },
        vortex: { name: 'Negro Carbón', code: 'Colores Tex 901' },
        generic: { name: 'Negro Carbón', code: 'P.Bk. 7' }
      },
      hex: '#181818',
      rgb: { r: 24, g: 24, b: 24 },
      lab: { L: 10.2, a: 0.1, b: -0.2 },
      tintPower: 2.0,
      description: 'Negro intenso para sombras, desaturación controlada y grises neutros.'
    },
    white_titanium: {
      id: 'white_titanium',
      name: 'Blanco Concentrado',
      code: 'P.W. 6',
      brands: {
        genesis: { name: 'Branco Concentrado', code: 'Sericor T.5800' },
        vortex: { name: 'Blanco Textil', code: 'Colores Tex 001' },
        generic: { name: 'Blanco Titanio', code: 'P.W. 6' }
      },
      hex: '#FAFAFA',
      rgb: { r: 250, g: 250, b: 250 },
      lab: { L: 98.2, a: -0.2, b: 0.8 },
      tintPower: 0.9,
      description: 'Dióxido de titanio acuoso para entonación y ajuste de luminosidad.'
    }
  },

  // Perfiles de marcas regionales
  REGIONAL_BRANDS: {
    genesis: {
      id: 'genesis',
      name: 'Gênesis Sericor T.58',
      region: 'Uruguay / Brasil (Centro Serigráfico, Cromos)',
      baseNames: {
        clear: 'Hidrocryl Incolor T.5600 (Acramina)',
        white_opaque: 'Hidrocryl Branco T.5601 / Hidromix',
        neutral_semi: 'Hidrocryl Neutro T.5602'
      },
      additives: {
        retarder: 'Retardador Hidrocryl Gênesis (Glicol) 2-4%',
        fixer: 'Fixador Gênesis T.5690 (1-2%)'
      }
    },
    vortex: {
      id: 'vortex',
      name: 'Vortex Colores Tex',
      region: 'Argentina / Río de la Plata',
      baseNames: {
        clear: 'Carrier Acuoso Incoloro Vortex',
        white_opaque: 'Carrier Cubritivo Blanco Vortex',
        neutral_semi: 'Carrier Semitransparente Vortex'
      },
      additives: {
        retarder: 'Gel Retardante Vortex Tex (2-5%)',
        fixer: 'Fijador / Catalizador Vortex (1.5%)'
      }
    },
    generic: {
      id: 'generic',
      name: 'Genérico Internacional (Color Index)',
      region: 'Mercosur / Estándar',
      baseNames: {
        clear: 'Base Transparente (Acramina)',
        white_opaque: 'Laca Blanca Cubritiva (Opaca)',
        neutral_semi: 'Base Neutra / Semitransparente'
      },
      additives: {
        retarder: 'Propilenglicol / Retardante textil 2-4%',
        fixer: 'Fijador textil en frío 1-2%'
      }
    }
  },

  // Tipos de bases para serigrafía textil al agua
  BASES: {
    clear: {
      id: 'clear',
      name: 'Base Transparente (Acramina)',
      category: 'Telas Claras',
      description: 'Aglutinante translúcido para prendas blancas o colores pasteles claros. Tacto cero.',
      maxPigmentPercent: 6.0,
      optimalMesh: '77 - 120 hilos/cm',
      cureTemp: '150°C - 160°C por 2-3 min (o plancha 160°C 15s)',
      retarderPercent: 2.0,
      baseColor: { r: 250, g: 248, b: 242, opacity: 0.15 },
      lightAbsorption: 0.02
    },
    white_opaque: {
      id: 'white_opaque',
      name: 'Laca Blanca Cubritiva',
      category: 'Telas Oscuras',
      description: 'Base opaca con alto contenido de dióxido de titanio. Gran poder cubriente sobre prendas negras.',
      maxPigmentPercent: 8.0,
      optimalMesh: '43 - 62 hilos/cm',
      cureTemp: '150°C - 160°C por 3 min',
      retarderPercent: 3.5,
      baseColor: { r: 252, g: 252, b: 252, opacity: 1.0 },
      lightAbsorption: 0.05
    },
    neutral_semi: {
      id: 'neutral_semi',
      name: 'Base Semitransparente / Neutra',
      category: 'Telas Medias / Vivos',
      description: 'Mezcla balanceada 50% transparente + 50% laca blanca. Para colores vivos sobre prendas de color.',
      maxPigmentPercent: 7.0,
      optimalMesh: '55 - 77 hilos/cm',
      cureTemp: '150°C - 160°C por 2.5 min',
      retarderPercent: 3.0,
      baseColor: { r: 250, g: 250, b: 248, opacity: 0.65 },
      lightAbsorption: 0.035
    }
  },

  /**
   * Simula la mezcla sustractiva de tintas al agua considerando
   * base seleccionada y porcentajes de pigmentos.
   * @param {string} baseId - 'clear', 'white_opaque' o 'neutral_semi'
   * @param {Object} pigmentPercents - Ej: { yellow_lemon: 3.5, cyan_blue: 0.8 }
   * @returns {Object} { wetRgb, wetLab, dryRgb, dryLab, totalPigmentPercent, isOverpigmented }
   */
  simulateMixture(baseId, pigmentPercents) {
    const base = this.BASES[baseId] || this.BASES.clear;
    let totalPigment = 0;
    
    // Suma de pigmentos
    for (const id in pigmentPercents) {
      if (pigmentPercents[id] > 0) {
        totalPigment += pigmentPercents[id];
      }
    }

    const isOverpigmented = totalPigment > base.maxPigmentPercent;
    const basePercent = Math.max(0, 100 - totalPigment);

    // Modelo de absorción espectral simplificado (CMYK-RGB absorbancia)
    // Inicializamos absorbancia con la de la base
    let absR = base.lightAbsorption;
    let absG = base.lightAbsorption;
    let absB = base.lightAbsorption;

    // Si es laca blanca o base semitransparente, añade scattering (dispersión blanca)
    const scattering = baseId === 'white_opaque' ? 0.85 : (baseId === 'neutral_semi' ? 0.45 : 0.05);

    // Factor de saturación por carga de pigmento
    // Cada pigmento absorbe luz en ciertas bandas según su color complementario
    for (const [id, percent] of Object.entries(pigmentPercents)) {
      if (!percent || percent <= 0) continue;
      const pig = this.PIGMENTS[id];
      if (!pig) continue;

      // Fracción efectiva ponderada por poder tintóreo
      const weight = (percent / 100) * pig.tintPower;

      // Absorbancia por componente complementario
      // Por ejemplo, pigmento amarillo absorbe azul:
      const normR = 1 - (pig.rgb.r / 255);
      const normG = 1 - (pig.rgb.g / 255);
      const normB = 1 - (pig.rgb.b / 255);

      // En tintas al agua la absorción crece exponencialmente (Beer-Lambert)
      absR += normR * weight * 14.0;
      absG += normG * weight * 14.0;
      absB += normB * weight * 14.0;
    }

    // Transmitancia / Reflectancia sobre fondo blanco estándar
    let reflR = Math.exp(-absR);
    let reflG = Math.exp(-absG);
    let reflB = Math.exp(-absB);

    // Modulación con el scattering de la base blanca
    if (scattering > 0) {
      // El dióxido de titanio refleja luz blanca difusa, elevando el piso de color
      reflR = reflR * (1 - scattering * 0.7) + scattering * 0.95;
      reflG = reflG * (1 - scattering * 0.7) + scattering * 0.95;
      reflB = reflB * (1 - scattering * 0.7) + scattering * 0.95;
    }

    // Convertir reflectancias a RGB [0-255] para tinta húmeda (en pote)
    let wetR = Math.max(0, Math.min(255, Math.round(reflR * 255)));
    let wetG = Math.max(0, Math.min(255, Math.round(reflG * 255)));
    let wetB = Math.max(0, Math.min(255, Math.round(reflB * 255)));

    // Si la base es transparente pura y casi no hay pigmento, muestra el tono translúcido del aglutinante
    if (baseId === 'clear' && totalPigment < 0.1) {
      wetR = 248; wetG = 248; wetB = 245;
    }

    const wetLab = ColorMath.rgbToLab(wetR, wetG, wetB);
    const wetHex = ColorMath.rgbToHex(wetR, wetG, wetB);

    // Simulación de Secado (Wet-to-Dry shift):
    // Al evaporarse el agua, la película de polímero acrílico se compacta.
    // La luminosidad L* baja entre 4% y 9%, y la saturación aumenta ligeramente.
    const dryLab = {
      L: Math.max(8, wetLab.L * 0.93 - 2),
      a: wetLab.a * 1.05,
      b: wetLab.b * 1.05
    };

    const dryRgb = ColorMath.labToRgb(dryLab.L, dryLab.a, dryLab.b);
    const dryHex = ColorMath.rgbToHex(dryRgb.r, dryRgb.g, dryRgb.b);

    return {
      baseId,
      basePercent: Number(basePercent.toFixed(2)),
      totalPigmentPercent: Number(totalPigment.toFixed(2)),
      isOverpigmented,
      maxAllowed: base.maxPigmentPercent,
      wet: {
        rgb: { r: wetR, g: wetG, b: wetB },
        lab: wetLab,
        hex: wetHex
      },
      dry: {
        rgb: dryRgb,
        lab: dryLab,
        hex: dryHex
      }
    };
  },

  /**
   * Optimiza y busca la mejor receta para alcanzar un color objetivo (Inverse Color Matcher)
   * @param {Object} targetRgb - { r, g, b }
   * @param {string} fabricType - 'light' (telas claras/acramina) o 'dark' (telas oscuras/laca)
   * @returns {Object} Mejor receta encontrada con desglose y métricas Delta E
   */
  findBestFormula(targetRgb, fabricType = 'light') {
    const targetLab = ColorMath.rgbToLab(targetRgb.r, targetRgb.g, targetRgb.b);
    const preferredBase = fabricType === 'dark' ? 'white_opaque' : 'clear';
    const baseInfo = this.BASES[preferredBase];
    const maxPigment = baseInfo.maxPigmentPercent;

    // Lista de pigmentos candidatos
    const pigmentIds = Object.keys(this.PIGMENTS);

    // Estrategia de optimización inteligente en serigrafía:
    // Los serigrafistas usan típicamente 1 a 3 pigmentos máximo para evitar tonalidades sucias (grisáceas).
    // Analizamos el matiz cromático del objetivo para preseleccionar pigmentos afines.

    let bestRecipe = null;
    let minDeltaE = Infinity;

    // Función auxiliar para evaluar una combinación candidata
    const evaluateCandidate = (baseId, candidatePigments) => {
      const sim = this.simulateMixture(baseId, candidatePigments);
      // Evaluamos respecto al color seco (que es el resultado final en la tela)
      const de = ColorMath.deltaE2000(targetLab, sim.dry.lab);
      if (de < minDeltaE) {
        minDeltaE = de;
        bestRecipe = {
          baseId,
          pigments: { ...candidatePigments },
          deltaE: de,
          sim
        };
      }
    };

    // 1. Detección de color claro/pastel que requiera laca blanca incluso en tela clara
    let baseToUse = preferredBase;
    if (fabricType === 'light' && targetLab.L > 78 && Math.hypot(targetLab.a, targetLab.b) > 15) {
      // Tonos pasteles luminosos (como amarillo suave, rosa pastel, celeste bebé)
      // requieren laca blanca o semitransparente para dar cuerpo al color
      baseToUse = 'neutral_semi';
    }

    // 2. Muestreo de combinaciones de 1 pigmento (monopigmento)
    for (const p1 of pigmentIds) {
      if (p1 === 'white_titanium' && baseToUse === 'white_opaque') continue;
      for (let w1 = 0.2; w1 <= maxPigment; w1 += 0.4) {
        evaluateCandidate(baseToUse, { [p1]: Number(w1.toFixed(2)) });
      }
    }

    // 3. Muestreo guiado de 2 pigmentos (combinación principal + entonador)
    for (let i = 0; i < pigmentIds.length; i++) {
      const p1 = pigmentIds[i];
      for (let j = i + 1; j < pigmentIds.length; j++) {
        const p2 = pigmentIds[j];
        // Evitar mezclar pigmentos mutuamente opuestos innecesariamente
        if (p1 === 'cyan_blue' && p2 === 'red_scarlet' && targetLab.L > 40) continue;

        for (let w1 = 0.4; w1 <= maxPigment - 0.2; w1 += 0.8) {
          for (let w2 = 0.2; w2 <= maxPigment - w1; w2 += 0.6) {
            evaluateCandidate(baseToUse, {
              [p1]: Number(w1.toFixed(2)),
              [p2]: Number(w2.toFixed(2))
            });
          }
        }
      }
    }

    // 4. Refinamiento fino de 2 y 3 pigmentos con optimización local (descenso de gradiente estocástico)
    if (bestRecipe) {
      let currentBestPigments = { ...bestRecipe.pigments };
      let currentBase = bestRecipe.baseId;

      // Intentar añadir un toque de negro para sombras o blanco/amarillo para matizar
      const adjusters = ['black_carbon', 'yellow_lemon', 'white_titanium'];
      for (const adj of adjusters) {
        if (!currentBestPigments[adj]) {
          for (let wAdj = 0.05; wAdj <= 0.8; wAdj += 0.15) {
            const testCandidate = { ...currentBestPigments, [adj]: Number(wAdj.toFixed(2)) };
            const sum = Object.values(testCandidate).reduce((a, b) => a + b, 0);
            if (sum <= maxPigment) {
              evaluateCandidate(currentBase, testCandidate);
            }
          }
        }
      }

      // Micropulsos de ajuste en los pesos de los pigmentos ganadores
      const activePigs = Object.keys(bestRecipe.pigments);
      for (let iter = 0; iter < 40; iter++) {
        const mutated = { ...bestRecipe.pigments };
        for (const pig of activePigs) {
          const delta = (Math.random() - 0.5) * 0.3;
          mutated[pig] = Math.max(0.02, Number((mutated[pig] + delta).toFixed(2)));
        }
        const totalW = Object.values(mutated).reduce((a, b) => a + b, 0);
        if (totalW <= maxPigment) {
          evaluateCandidate(bestRecipe.baseId, mutated);
        }
      }
    }

    // Si aún así no encontró (caso extremo), devolvemos receta por defecto
    if (!bestRecipe) {
      bestRecipe = {
        baseId: preferredBase,
        pigments: { yellow_lemon: 1.5, cyan_blue: 0.5 },
        deltaE: 10,
        sim: this.simulateMixture(preferredBase, { yellow_lemon: 1.5, cyan_blue: 0.5 })
      };
    }

    // Filtramos pigmentos que quedaron en cero o despreciables (< 0.02%)
    const cleanPigments = {};
    for (const [id, val] of Object.entries(bestRecipe.pigments)) {
      if (val >= 0.03) {
        cleanPigments[id] = Number(val.toFixed(2));
      }
    }

    // Recalcular simulación definitiva
    const finalSim = this.simulateMixture(bestRecipe.baseId, cleanPigments);
    const finalDeltaE = ColorMath.deltaE2000(targetLab, finalSim.dry.lab);
    const evalResult = ColorMath.evaluateDeltaE(finalDeltaE);

    return {
      target: {
        rgb: targetRgb,
        lab: targetLab,
        hex: ColorMath.rgbToHex(targetRgb.r, targetRgb.g, targetRgb.b)
      },
      base: this.BASES[bestRecipe.baseId],
      basePercent: finalSim.basePercent,
      pigments: cleanPigments,
      totalPigmentPercent: finalSim.totalPigmentPercent,
      isOverpigmented: finalSim.isOverpigmented,
      deltaE: Number(finalDeltaE.toFixed(2)),
      quality: evalResult,
      simulated: finalSim
    };
  },

  /**
   * Calcula la receta escalada en gramos para un lote específico (ej. 250 g)
   * @param {Object} formulaResult - Objeto generado por findBestFormula o simulador
   * @param {number} totalGrams - Gramos totales deseados (ej. 100, 250, 500, 1000)
   * @param {string} brand - 'genesis' (Uruguay/Brasil), 'vortex' (Argentina), o 'generic'
   * @returns {Object} Ficha de pesaje con gramos individuales y acumulados para balanza
   */
  scaleRecipe(formulaResult, totalGrams = 250, brand = 'genesis') {
    const brandProfile = this.REGIONAL_BRANDS[brand] || this.REGIONAL_BRANDS.genesis;
    const baseInfo = formulaResult.base;
    const baseGrams = Number(((formulaResult.basePercent / 100) * totalGrams).toFixed(1));

    const commercialBaseName = (brandProfile.baseNames && brandProfile.baseNames[baseInfo.id]) 
      ? brandProfile.baseNames[baseInfo.id] 
      : baseInfo.name;

    const ingredients = [];
    let runningAccumulator = 0;

    // 1. Ingrediente principal: Base
    runningAccumulator += baseGrams;
    ingredients.push({
      type: 'base',
      id: baseInfo.id,
      name: commercialBaseName,
      category: 'Base Aglutinante',
      percent: formulaResult.basePercent,
      netGrams: baseGrams,
      accumGrams: Number(runningAccumulator.toFixed(1)),
      colorDot: baseInfo.id === 'white_opaque' ? '#FFFFFF' : '#E8E4D9',
      notes: `${baseInfo.category} • ${brandProfile.name}`
    });

    // 2. Pigmentos
    for (const [pigId, percent] of Object.entries(formulaResult.pigments)) {
      const pig = this.PIGMENTS[pigId];
      if (!pig) continue;
      const netG = Number(((percent / 100) * totalGrams).toFixed(2));
      runningAccumulator += netG;

      const brandItem = (pig.brands && pig.brands[brand]) ? pig.brands[brand] : { name: pig.name, code: pig.code };

      ingredients.push({
        type: 'pigment',
        id: pig.id,
        name: brandItem.name,
        code: brandItem.code,
        category: 'Pigmento Concentrado',
        percent: percent,
        netGrams: netG,
        accumGrams: Number(runningAccumulator.toFixed(1)),
        colorDot: pig.hex,
        notes: `${brandItem.code} (${pig.code})`
      });
    }

    // 3. Aditivos recomendados de la industria según marca regional
    const retarderGrams = Number(((baseInfo.retarderPercent / 100) * totalGrams).toFixed(1));
    const suggestedMesh = baseInfo.optimalMesh;
    const cureTemp = baseInfo.cureTemp;

    return {
      totalGrams,
      brand: brandProfile,
      baseName: commercialBaseName,
      ingredients,
      totalPigmentPercent: formulaResult.totalPigmentPercent,
      additives: [
        {
          name: brandProfile.additives.retarder,
          purpose: 'Evita el secado y tapado prematuro de la tinta en la malla durante la tirada.',
          suggestedPercent: baseInfo.retarderPercent,
          suggestedGrams: retarderGrams
        },
        {
          name: brandProfile.additives.fixer,
          purpose: 'Catalizador que asegura el anclaje y solidez al lavado en curado estándar o temperatura ambiente.',
          suggestedPercent: 1.5,
          suggestedGrams: Number((0.015 * totalGrams).toFixed(1))
        }
      ],
      technicalRecommendations: {
        mesh: suggestedMesh,
        cure: cureTemp,
        cleanUp: 'Agua tibia con jabón neutro inmediatamente después de estampar.',
        maxPigmentNote: `Límite seguro: ${baseInfo.maxPigmentPercent}% para evitar pérdida de solidez al frote.`
      }
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = PigmentEngine;
}

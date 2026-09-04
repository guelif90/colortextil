/**
 * ColorTextil Studio - Recipe Manager & Workshop Scale Helper
 * Gestión de recetas guardadas, escalado de lotes para balanza y exportación para taller.
 */

const RecipeManager = {
  STORAGE_KEY: 'colortextil_saved_recipes_v1',

  /**
   * Obtiene la lista de recetas guardadas desde LocalStorage
   */
  getSavedRecipes() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer recetas guardadas:', e);
      return [];
    }
  },

  /**
   * Guarda una nueva receta en el historial
   */
  saveRecipe(recipeData) {
    const recipes = this.getSavedRecipes();
    const newRecipe = {
      id: 'rec_' + Date.now(),
      title: recipeData.title || 'Receta sin título',
      client: recipeData.client || '',
      date: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      targetColor: recipeData.targetColor,
      simulatedColor: recipeData.simulatedColor,
      baseId: recipeData.baseId,
      baseName: recipeData.baseName,
      basePercent: recipeData.basePercent,
      pigments: recipeData.pigments,
      totalPigmentPercent: recipeData.totalPigmentPercent,
      deltaE: recipeData.deltaE,
      fabricType: recipeData.fabricType || 'light',
      targetGrams: recipeData.targetGrams || 250,
      notes: recipeData.notes || ''
    };

    recipes.unshift(newRecipe);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
      return newRecipe;
    } catch (e) {
      console.error('Error guardando receta:', e);
      return null;
    }
  },

  /**
   * Elimina una receta por ID
   */
  deleteRecipe(id) {
    const recipes = this.getSavedRecipes().filter(r => r.id !== id);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Estima gramos necesarios según cantidad de prendas y tipo de diseño
   * @param {number} shirtsCount - Cantidad de remeras a estampar
   * @param {string} coverage - 'small' (pecho chico), 'medium' (A4 medio), 'full' (A3 pleno/fondo)
   * @param {string} baseType - 'clear' o 'white_opaque'
   */
  estimateInkNeeds(shirtsCount, coverage = 'medium', baseType = 'clear') {
    // Consumo promedio en serigrafía textil al agua por remera:
    // Base Acramina (malla 90-120):
    // - Pecho chico: ~4g / prenda
    // - Frente A4 estándar: ~10g / prenda
    // - Frente A3 pleno: ~18g / prenda
    // Base Laca (malla 43-62, película más densa):
    // - Pecho chico: ~7g / prenda
    // - Frente A4 estándar: ~16g / prenda
    // - Frente A3 pleno: ~28g / prenda

    const rates = {
      clear: { small: 4, medium: 10, full: 18 },
      white_opaque: { small: 7, medium: 16, full: 28 },
      neutral_semi: { small: 5.5, medium: 13, full: 23 }
    };

    const rateTable = rates[baseType] || rates.clear;
    const perShirt = rateTable[coverage] || rateTable.medium;

    // Se suma un 20% de reserva para la manigueta y el marco
    const netGrams = shirtsCount * perShirt;
    const safetyMargin = Math.max(30, Math.round(netGrams * 0.2));
    const totalGrams = Math.round(netGrams + safetyMargin);

    return {
      shirtsCount,
      coverage,
      perShirtGrams: perShirt,
      safetyMarginGrams: safetyMargin,
      recommendedTotalGrams: totalGrams
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = RecipeManager;
}

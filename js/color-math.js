/**
 * ColorTextil Studio - Color Mathematics & CIEDE2000 Engine
 * Implementación de precisión para serigrafía textil según normas ISO/CIE.
 */

const ColorMath = {
  /**
   * Convierte un valor HEX (#RRGGBB) a RGB [0-255]
   */
  hexToRgb(hex) {
    let cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  /**
   * Convierte RGB [0-255] a HEX (#RRGGBB)
   */
  rgbToHex(r, g, b) {
    const toHex = (n) => {
      const clamped = Math.max(0, Math.min(255, Math.round(n)));
      return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  },

  /**
   * Convierte sRGB [0-255] a espacio de color XYZ (Iluminante D65, Observador 2°)
   */
  rgbToXyz(r, g, b) {
    // Normalización y corrección gamma (sRGB a lineal)
    let rLinear = r / 255;
    let gLinear = g / 255;
    let bLinear = b / 255;

    rLinear = rLinear > 0.04045 ? Math.pow((rLinear + 0.055) / 1.055, 2.4) : rLinear / 12.92;
    gLinear = gLinear > 0.04045 ? Math.pow((gLinear + 0.055) / 1.055, 2.4) : gLinear / 12.92;
    bLinear = bLinear > 0.04045 ? Math.pow((bLinear + 0.055) / 1.055, 2.4) : bLinear / 12.92;

    rLinear *= 100;
    gLinear *= 100;
    bLinear *= 100;

    // Matriz de transformación sRGB a CIE XYZ
    const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
    const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750;
    const z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041;

    return { x, y, z };
  },

  /**
   * Convierte XYZ a CIELAB (L*, a*, b*)
   */
  xyzToLab(x, y, z) {
    // Referencia blanca D65
    const refX = 95.047;
    const refY = 100.000;
    const refZ = 108.883;

    let xNorm = x / refX;
    let yNorm = y / refY;
    let zNorm = z / refZ;

    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);

    const fx = f(xNorm);
    const fy = f(yNorm);
    const fz = f(zNorm);

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b = 200 * (fy - fz);

    return { L, a, b };
  },

  /**
   * Convierte RGB directo a CIELAB
   */
  rgbToLab(r, g, b) {
    const xyz = this.rgbToXyz(r, g, b);
    return this.xyzToLab(xyz.x, xyz.y, xyz.z);
  },

  /**
   * Convierte CIELAB (L*, a*, b*) a XYZ
   */
  labToXyz(L, a, b) {
    const refX = 95.047;
    const refY = 100.000;
    const refZ = 108.883;

    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const fInv = (t) => {
      const t3 = t * t * t;
      return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
    };

    const x = refX * fInv(fx);
    const y = refY * fInv(fy);
    const z = refZ * fInv(fz);

    return { x, y, z };
  },

  /**
   * Convierte XYZ a sRGB [0-255]
   */
  xyzToRgb(x, y, z) {
    const xNorm = x / 100;
    const yNorm = y / 100;
    const zNorm = z / 100;

    let rLinear = xNorm * 3.2404542 + yNorm * -1.5371385 + zNorm * -0.4985314;
    let gLinear = xNorm * -0.9692660 + yNorm * 1.8760108 + zNorm * 0.0415560;
    let bLinear = xNorm * 0.0556434 + yNorm * -0.2040259 + zNorm * 1.0572252;

    const toSrgb = (c) => {
      const clamped = Math.max(0, Math.min(1, c));
      return clamped > 0.0031308 ? 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055 : 12.92 * clamped;
    };

    return {
      r: Math.round(toSrgb(rLinear) * 255),
      g: Math.round(toSrgb(gLinear) * 255),
      b: Math.round(toSrgb(bLinear) * 255)
    };
  },

  /**
   * Convierte CIELAB directo a sRGB
   */
  labToRgb(L, a, b) {
    const xyz = this.labToXyz(L, a, b);
    return this.xyzToRgb(xyz.x, xyz.y, xyz.z);
  },

  /**
   * Cálculo de CIEDE2000 (Delta E 2000)
   * Estándar internacional textil para evaluar tolerancia cromática.
   */
  deltaE2000(lab1, lab2, kL = 1, kC = 1, kH = 1) {
    const L1 = lab1.L, a1 = lab1.a, b1 = lab1.b;
    const L2 = lab2.L, a2 = lab2.a, b2 = lab2.b;

    const avgL = (L1 + L2) / 2;
    const C1 = Math.hypot(a1, b1);
    const C2 = Math.hypot(a2, b2);
    const avgC = (C1 + C2) / 2;

    const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
    const a1Prime = a1 * (1 + G);
    const a2Prime = a2 * (1 + G);

    const C1Prime = Math.hypot(a1Prime, b1);
    const C2Prime = Math.hypot(a2Prime, b2);
    const avgCPrime = (C1Prime + C2Prime) / 2;

    const rad2deg = (rad) => (rad * 180) / Math.PI;
    const deg2rad = (deg) => (deg * Math.PI) / 180;

    let h1Prime = rad2deg(Math.atan2(b1, a1Prime));
    if (h1Prime < 0) h1Prime += 360;

    let h2Prime = rad2deg(Math.atan2(b2, a2Prime));
    if (h2Prime < 0) h2Prime += 360;

    let deltaHPrime;
    if (Math.abs(h1Prime - h2Prime) <= 180) {
      deltaHPrime = h2Prime - h1Prime;
    } else if (h2Prime <= h1Prime) {
      deltaHPrime = h2Prime - h1Prime + 360;
    } else {
      deltaHPrime = h2Prime - h1Prime - 360;
    }

    const deltaLPrime = L2 - L1;
    const deltaCPrime = C2Prime - C1Prime;
    const deltaBigHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deg2rad(deltaHPrime / 2));

    let avgHPrime;
    if (Math.abs(h1Prime - h2Prime) <= 180) {
      avgHPrime = (h1Prime + h2Prime) / 2;
    } else if (h1Prime + h2Prime < 360) {
      avgHPrime = (h1Prime + h2Prime + 360) / 2;
    } else {
      avgHPrime = (h1Prime + h2Prime - 360) / 2;
    }

    const T =
      1 -
      0.17 * Math.cos(deg2rad(avgHPrime - 30)) +
      0.24 * Math.cos(deg2rad(2 * avgHPrime)) +
      0.32 * Math.cos(deg2rad(3 * avgHPrime + 6)) -
      0.20 * Math.cos(deg2rad(4 * avgHPrime - 63));

    const sL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
    const sC = 1 + 0.045 * avgCPrime;
    const sH = 1 + 0.015 * avgCPrime * T;

    const deltaTheta = 30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));
    const R_C = 2 * Math.sqrt(Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7)));
    const R_T = -Math.sin(deg2rad(2 * deltaTheta)) * R_C;

    const termL = deltaLPrime / (kL * sL);
    const termC = deltaCPrime / (kC * sC);
    const termH = deltaBigHPrime / (kH * sH);

    const deltaE = Math.sqrt(
      Math.pow(termL, 2) +
      Math.pow(termC, 2) +
      Math.pow(termH, 2) +
      R_T * termC * termH
    );

    return Math.max(0, deltaE);
  },

  /**
   * Interpreta el nivel de coincidencia según Delta E 2000 en serigrafía
   */
  evaluateDeltaE(de) {
    if (de < 1.0) {
      return {
        level: 'perfect',
        label: 'Igualado Perfecto',
        desc: 'Diferencia imperceptible a simple vista por el ojo humano.',
        badgeClass: 'badge-success'
      };
    } else if (de < 2.2) {
      return {
        level: 'good',
        label: 'Muy Buena Aproximación',
        desc: 'Tolerancia comercial estándar óptima para producción textil.',
        badgeClass: 'badge-primary'
      };
    } else if (de < 3.8) {
      return {
        level: 'acceptable',
        label: 'Aceptable con Variación',
        desc: 'Ligera diferencia visual perceptible bajo luz directa.',
        badgeClass: 'badge-warning'
      };
    } else {
      return {
        level: 'distant',
        label: 'Aproximado / Fuera de Gama',
        desc: 'Diferencia notable; requiere ajuste de base o pigmento adicional.',
        badgeClass: 'badge-danger'
      };
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = ColorMath;
}

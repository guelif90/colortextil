/**
 * ColorTextil Studio - Image Detector, Magnifier Loupe & Palette Extractor
 * Detección de color en fotos de telas y estampados textiles con K-Means y Lupa interactiva.
 */

class ImageDetector {
  constructor(options = {}) {
    this.canvas = options.canvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d', { willReadFrequently: true }) : null;
    this.loupeCanvas = options.loupeCanvas;
    this.loupeCtx = this.loupeCanvas ? this.loupeCanvas.getContext('2d') : null;
    this.loupeContainer = options.loupeContainer;
    
    this.sampleSize = 3; // 1 = 1x1, 3 = 3x3, 5 = 5x5 px promedio
    this.currentImage = null;
    this.imageLoaded = false;
    this.onColorPicked = options.onColorPicked || (() => {});
    this.onPaletteExtracted = options.onPaletteExtracted || (() => {});

    this.initEvents();
  }

  initEvents() {
    if (!this.canvas) return;

    // Movimiento del cursor sobre el canvas -> activar lupa
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));

    // Soporte táctil (Touch)
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleMouseMove(touch, true);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      this.handleClick(touch, true);
      this.handleMouseLeave();
    });
  }

  /**
   * Carga una imagen a partir de un File o Blob
   */
  loadFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.loadImageFromUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Carga una imagen a partir de una URL o Base64 Data URL
   */
  loadImageFromUrl(url) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.currentImage = img;
      this.imageLoaded = true;
      this.renderImage();
      this.extractDominantPalette();
    };
    img.src = url;
  }

  /**
   * Dibuja la imagen en el canvas adaptando tamaño
   */
  renderImage() {
    if (!this.currentImage || !this.canvas) return;

    const maxWidth = 800;
    const maxHeight = 500;
    let w = this.currentImage.naturalWidth;
    let h = this.currentImage.naturalHeight;

    if (w > maxWidth || h > maxHeight) {
      const ratio = Math.min(maxWidth / w, maxHeight / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }

    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(this.currentImage, 0, 0, w, h);
  }

  /**
   * Obtiene las coordenadas relativas al canvas
   */
  getCanvasCoords(e, isTouch = false) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clientX = isTouch ? e.clientX : e.clientX;
    const clientY = isTouch ? e.clientY : e.clientY;

    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
      screenX: clientX,
      screenY: clientY
    };
  }

  /**
   * Muestra la lupa y actualiza el color bajo la mira
   */
  handleMouseMove(e, isTouch = false) {
    if (!this.imageLoaded) return;
    const { x, y, screenX, screenY } = this.getCanvasCoords(e, isTouch);

    if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) {
      this.handleMouseLeave();
      return;
    }

    const color = this.sampleColorAt(x, y, this.sampleSize);
    this.drawLoupe(x, y, color, screenX, screenY, isTouch);
  }

  handleMouseLeave() {
    if (this.loupeContainer) {
      this.loupeContainer.style.display = 'none';
    }
  }

  handleClick(e, isTouch = false) {
    if (!this.imageLoaded) return;
    const { x, y } = this.getCanvasCoords(e, isTouch);

    if (x >= 0 && y >= 0 && x < this.canvas.width && y < this.canvas.height) {
      const color = this.sampleColorAt(x, y, this.sampleSize);
      this.onColorPicked(color);
    }
  }

  /**
   * Muestrea un área de radio NxN alrededor de (x, y) y promedia para mitigar ruido de tejido
   */
  sampleColorAt(x, y, size = 3) {
    const half = Math.floor(size / 2);
    const startX = Math.max(0, x - half);
    const startY = Math.max(0, y - half);
    const w = Math.min(this.canvas.width - startX, size);
    const h = Math.min(this.canvas.height - startY, size);

    const imgData = this.ctx.getImageData(startX, startY, w, h);
    const data = imgData.data;

    let sumR = 0, sumG = 0, sumB = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 50) { // Ignorar píxeles casi transparentes
        sumR += data[i];
        sumG += data[i + 1];
        sumB += data[i + 2];
        count++;
      }
    }

    const r = count > 0 ? Math.round(sumR / count) : 0;
    const g = count > 0 ? Math.round(sumG / count) : 0;
    const b = count > 0 ? Math.round(sumB / count) : 0;
    const hex = ColorMath.rgbToHex(r, g, b);

    return { r, g, b, hex, x, y };
  }

  /**
   * Renderiza el visor ampliado (lupa con zoom 6x y retícula)
   */
  drawLoupe(sourceX, sourceY, sampledColor, screenX, screenY, isTouch = false) {
    if (!this.loupeCanvas || !this.loupeContainer) return;

    this.loupeContainer.style.display = 'block';

    const containerW = 140;
    const containerH = 150;
    let posX, posY;

    if (isTouch) {
      // En móvil, la lupa se eleva claramente por encima del pulgar
      posX = screenX - containerW / 2;
      posY = screenY - containerH - 35;
      if (posY < 10) posY = screenY + 45; // Si está muy cerca del borde superior, mostrar abajo
    } else {
      posX = screenX + 20;
      posY = screenY - containerH / 2;
    }

    if (posX < 10) posX = 10;
    if (posX + containerW > window.innerWidth - 10) {
      posX = window.innerWidth - containerW - 10;
    }
    if (posY < 10) posY = 10;
    if (posY + containerH > window.innerHeight - 10) {
      posY = window.innerHeight - containerH - 10;
    }

    this.loupeContainer.style.left = `${posX}px`;
    this.loupeContainer.style.top = `${posY}px`;

    // Dibujar región ampliada en el canvas de la lupa
    const loupeW = this.loupeCanvas.width;
    const loupeH = this.loupeCanvas.height;
    const zoom = 7;
    const srcRadius = Math.floor(loupeW / (zoom * 2));

    this.loupeCtx.imageSmoothingEnabled = false; // Píxeles nítidos para ver el hilado
    this.loupeCtx.clearRect(0, 0, loupeW, loupeH);

    // Dibujar fondo de tablero de ajedrez (para transparencias)
    this.drawCheckerboard(this.loupeCtx, loupeW, loupeH);

    this.loupeCtx.drawImage(
      this.canvas,
      Math.max(0, sourceX - srcRadius),
      Math.max(0, sourceY - srcRadius),
      srcRadius * 2,
      srcRadius * 2,
      0,
      0,
      loupeW,
      loupeH
    );

    // Retícula / Mira central
    const cx = loupeW / 2;
    const cy = loupeH / 2;
    this.loupeCtx.strokeStyle = '#FFFFFF';
    this.loupeCtx.lineWidth = 1.5;
    this.loupeCtx.shadowColor = '#000000';
    this.loupeCtx.shadowBlur = 3;

    // Círculo central que muestra el área de muestreo
    this.loupeCtx.strokeRect(cx - 5, cy - 5, 10, 10);
    this.loupeCtx.beginPath();
    this.loupeCtx.moveTo(cx - 15, cy);
    this.loupeCtx.lineTo(cx + 15, cy);
    this.loupeCtx.moveTo(cx, cy - 15);
    this.loupeCtx.lineTo(cx, cy + 15);
    this.loupeCtx.stroke();
    this.loupeCtx.shadowBlur = 0;

    // Actualizar texto del color en el contenedor de la lupa
    const swatch = this.loupeContainer.querySelector('.loupe-swatch');
    const hexText = this.loupeContainer.querySelector('.loupe-hex');
    const rgbText = this.loupeContainer.querySelector('.loupe-rgb');

    if (swatch) swatch.style.backgroundColor = sampledColor.hex;
    if (hexText) hexText.textContent = sampledColor.hex;
    if (rgbText) rgbText.textContent = `RGB(${sampledColor.r}, ${sampledColor.g}, ${sampledColor.b})`;
  }

  drawCheckerboard(ctx, w, h) {
    const size = 8;
    ctx.fillStyle = '#1e222d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2d3342';
    for (let i = 0; i < w; i += size * 2) {
      for (let j = 0; j < h; j += size * 2) {
        ctx.fillRect(i, j, size, size);
        ctx.fillRect(i + size, j + size, size, size);
      }
    }
  }

  /**
   * Extracción de paleta dominante mediante K-Means Clustering
   */
  extractDominantPalette(k = 5) {
    if (!this.imageLoaded || !this.canvas) return;

    // Reducir escala para procesar rápido (100x100 píxeles es suficiente)
    const smallW = 100;
    const smallH = Math.max(1, Math.round((this.canvas.height / this.canvas.width) * smallW));
    const offscreen = document.createElement('canvas');
    offscreen.width = smallW;
    offscreen.height = smallH;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(this.canvas, 0, 0, smallW, smallH);

    const imgData = offCtx.getImageData(0, 0, smallW, smallH).data;
    const pixels = [];

    // Recolectar píxeles filtrando transparentes
    for (let i = 0; i < imgData.length; i += 4) {
      if (imgData[i + 3] > 120) {
        pixels.push({
          r: imgData[i],
          g: imgData[i + 1],
          b: imgData[i + 2]
        });
      }
    }

    if (pixels.length === 0) return;

    // Inicialización de centroides (K-Means++)
    let centroids = [];
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

    while (centroids.length < k) {
      let maxDistSq = -1;
      let nextCentroid = pixels[0];

      // Muestreo probabilístico ponderado por distancia cuadrada
      for (let i = 0; i < Math.min(200, pixels.length); i++) {
        const p = pixels[Math.floor(Math.random() * pixels.length)];
        let minDistSq = Infinity;
        for (const c of centroids) {
          const d = Math.pow(p.r - c.r, 2) + Math.pow(p.g - c.g, 2) + Math.pow(p.b - c.b, 2);
          if (d < minDistSq) minDistSq = d;
        }
        if (minDistSq > maxDistSq) {
          maxDistSq = minDistSq;
          nextCentroid = p;
        }
      }
      centroids.push(nextCentroid);
    }

    // Iteraciones K-Means (8 pasadas son suficientes para convergencia rápida)
    const maxIters = 8;
    for (let iter = 0; iter < maxIters; iter++) {
      const clusters = Array.from({ length: k }, () => []);

      for (const p of pixels) {
        let nearestIdx = 0;
        let minDist = Infinity;
        for (let j = 0; j < k; j++) {
          const c = centroids[j];
          const dist = Math.pow(p.r - c.r, 2) + Math.pow(p.g - c.g, 2) + Math.pow(p.b - c.b, 2);
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = j;
          }
        }
        clusters[nearestIdx].push(p);
      }

      // Recalcular centroides
      for (let j = 0; j < k; j++) {
        if (clusters[j].length > 0) {
          let sumR = 0, sumG = 0, sumB = 0;
          for (const p of clusters[j]) {
            sumR += p.r;
            sumG += p.g;
            sumB += p.b;
          }
          centroids[j] = {
            r: Math.round(sumR / clusters[j].length),
            g: Math.round(sumG / clusters[j].length),
            b: Math.round(sumB / clusters[j].length),
            count: clusters[j].length
          };
        }
      }
    }

    // Ordenar paleta por frecuencia de píxeles
    const palette = centroids
      .filter(c => c.count && c.count > 0)
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .map(c => ({
        r: c.r,
        g: c.g,
        b: c.b,
        hex: ColorMath.rgbToHex(c.r, c.g, c.b),
        percentage: Number(((c.count / pixels.length) * 100).toFixed(1))
      }));

    this.onPaletteExtracted(palette);
    return palette;
  }
}

if (typeof module !== 'undefined') {
  module.exports = ImageDetector;
}

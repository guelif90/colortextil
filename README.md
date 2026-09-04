# 🎨 ColorTextil Studio
### Formulación Profesional y Mezcla de Tintas Textiles al Agua para Serigrafía

Software diseñado para serigrafistas textiles del Río de la Plata y Mercosur (Uruguay, Argentina y Brasil). Permite detectar colores a partir de fotos con lupa/gotero y K-Means, calcular fórmulas precisas de base y pigmentos con tolerancia **CIEDE2000 ($\Delta E_{00}$)**, dosificar en modo tara acumulada para balanzas digitales y guardar recetas de clientes.

---

## 🚀 Características Principales

- **📸 Detección en Fotos:** Gotero con lupa de aumento (7x) con retícula y selector de muestreo (1x1, 3x3 y 5x5 px) para promediar la textura del tejido de algodón. Extracción automática de paleta dominante con algoritmo K-Means.
- **🎯 Formulador Inverso de Tintas:** Calcula la combinación óptima de base y pigmentos según el fondo textil:
  - *Telas Claras:* Base Acramina translúcida (tacto cero, máx. 6% pigmento).
  - *Telas Oscuras:* Laca Blanca Cubritiva con Dióxido de Titanio (máx. 8% pigmento).
- **🇺🇾 Marcas Comerciales del Mercosur Integradas:**
  - **Gênesis Tintas (Uruguay & Brasil):** Línea Sericor T.58 (T.5801 Amarelo Limão, T.5802 Amarelo Ouro, T.5805 Vermelho Vivo, T.5807 Rubí, T.5810 Azul Médio Cyan, T.5811 Azul Marinho, T.5815 Verde Bandeira, T.5818 Violeta, T.5820 Preto) sobre bases Hidrocryl T.5600 y T.5601.
  - **Vortex Argentina:** Línea Colores Tex y Carrier acuoso.
  - **Color Index Estándar Internacional.**
- **⚖️ Ficha de Pesaje para Balanza Digital:**
  - Escalado de lotes en gramos (100g, 250g, 500g, 1000g o personalizado).
  - Estimador de consumo por cantidad de remeras.
  - Modo Balanza con tara acumulada.
  - Dosificación de aditivos (retardante de secado y fijador textil).
  - Botón de impresión directa (`🖨️`) de orden de taller.
- **🧪 Laboratorio Libre:** Sliders interactivos con simulación en tiempo real del efecto de secado (*Wet-to-Dry shift*) sobre remeras blanca, gris melange y negra.
- **📱 PWA & Android:** Listo para instalarse directamente en teléfonos y tablets Android con funcionamiento 100% offline.

---

## 🌐 Cómo Hostearlo Gratis en GitHub Pages

Al ser una aplicación 100% estática (HTML5, CSS3, JavaScript puro), se hostea en **GitHub Pages** en 2 minutos:

1. Crea un repositorio nuevo en GitHub (ej: `colortextil`).
2. En tu terminal o consola:
   ```bash
   git init
   git add .
   git commit -m "ColorTextil Studio v1.0"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/colortextil.git
   git push -u origin main
   ```
3. En GitHub, entra a tu repositorio ➔ **Settings** ➔ **Pages**:
   - En **Source**, selecciona: `Deploy from a branch`.
   - En **Branch**, selecciona: `main` / `/(root)` y dale **Save**.
4. ¡Listo! En 1 minuto tendrás tu enlace activo:
   `https://TU-USUARIO.github.io/colortextil/`

### 📲 Cómo Instalarlo como App en tu Celular Android:
Abre tu enlace de GitHub Pages en **Google Chrome** en tu celular, toca los tres puntos (`⋮`) y pulsa **"Instalar aplicación"**. Se instalará en tu pantalla de inicio como una app nativa y funcionará incluso sin conexión a internet en el taller.

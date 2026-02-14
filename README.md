# 💕 Mensaje Especial - San Valentín 2026

Una página web romántica interactiva creada especialmente para el 14 de febrero.

## ✨ Características

- 🎊 **Modal de bienvenida** con fotos rotativas y cálculo del tiempo de relación
- 💖 Mensajes de amor personalizados
- ⏰ Modal que aparece después de 14 segundos
- 🔐 Sistema de clave secreta
- 💕 Pregunta especial interactiva
- 🎯 Botón travieso que se mueve
- 🎵 Control de música de fondo con playlist automática
- 🎥 Video romántico en miniatura con navegación
- 📱 Diseño responsive para móviles
- 🎉 Efectos visuales y animaciones

## 🚀 Cómo usar

1. Abre la página en tu navegador
2. **Disfruta del modal de bienvenida** con fotos que cambian cada segundo
3. Verás el tiempo exacto que llevan juntos (calculado automáticamente desde el 1 de julio 2024)
4. Haz clic en **"Continuar"** para iniciar la música y la experiencia
5. Disfruta de los mensajes románticos
6. Espera 14 segundos para la sorpresa
7. Ingresa la clave secreta: **"amor2026"**
8. Responde la pregunta especial ¡Si te atreves! 😉

## 🖼️ Modal de Bienvenida

### Características especiales:
- 📸 **Fotos rotativas**: Muestra 5 fotos que cambian cada segundo con efecto de zoom
- ⏱️ **Cálculo automático**: Calcula el tiempo exacto de relación desde el 1 de julio 2024 a las 8:00 PM
- 🎨 **Diseño atractivo**: Gradiente morado con overlay y animaciones suaves
- 🎵 **Inicio de música**: Al hacer clic en "Continuar", inicia la playlist automáticamente

### Fotos requeridas:
Coloca las siguientes fotos en la carpeta `assets/foto/`:
- `nosotros1.jpeg`
- `nosotros2.jpeg`
- `nosotros3.jpeg`
- `nosotros4.jpeg`
- `nosotros5.jpeg`

### Personalización:
Para cambiar la fecha de inicio de la relación, edita la variable en `script.js`:
```javascript
// Fecha de inicio de la relación: 1 de Julio 2024, 8:00 PM
const RELATIONSHIP_START = new Date('2024-07-01T20:00:00');
```

## 🎵 Música y Audio

### 🎶 Playlist Automática
El sistema reproduce automáticamente todos los archivos de audio de la carpeta `assets/audio/` en secuencia:

1. **Detección automática**: El código busca todos los archivos .mp3 disponibles
2. **Reproducción en bucle**: Cuando termina una canción, continúa con la siguiente
3. **Control manual**: Botón 🎵/🔇 para pausar/reanudar
4. **Optimizado**: Compatible con políticas de autoplay de navegadores modernos

### Archivos de audio actuales:
- `onlyHope.mp3`
- `dicenqueYo.mp3`
- `salioelSol.mp3`
- `solito.mp3`
- `WhatsApp Video 2026-02-13 at 8.12.34 PM.mp3`

Para agregar más música:
1. Descarga canciones en formato .mp3
2. Colócalas en la carpeta `assets/audio/`
3. El sistema las detectará automáticamente

### Estructura de carpetas para audio:
```
📁 tu-proyecto/
├── assets/
│   └── audio/
│       ├── romantic-song.mp3
│       └── romantic-song.ogg (opcional)
├── index.html
└── ...
```

### Sugerencias de música libre:
- [YouTube Audio Library](https://studio.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw/music)
- [Freesound.org](https://freesound.org/)
- [Pixabay Music](https://pixabay.com/music/)

## 🎥 Video

Para agregar videos románticos:
1. Descarga o crea videos románticos cortos
2. Colócalos en la carpeta `assets/video/`
3. Nombra el principal como `100AÑOS.mp4` (o cambia el nombre en el código)
4. Agrega más videos con nombres como `video2.mp4`, `video3.mp4`, etc.
5. Los videos se reproducen secuencialmente y luego se repiten

### Estructura de carpetas para video:
```
📁 tu-proyecto/
├── assets/
│   └── video/
│       ├── 100AÑOS.mp4        # Video principal
│       ├── video2.mp4         # Segundo video
│       ├── video3.mp4         # Tercer video
│       └── video4.mp4         # Más videos...
├── index.html
└── ...
```

### Características del video playlist:
- ▶️ Reproducción automática (sin sonido)
- ⏸️ Controles de pausa/reproducción
- ⏮️ Botón para video anterior
- ⏭️ Botón para siguiente video
- 🔄 Reproducción en bucle infinito
- 📊 Contador de videos (ej: 2/5)
- ❌ Botón para cerrar
- 📱 Responsive en móviles
- 🔇 Siempre silenciado para no interferir con la música

## 📱 Compatibilidad

- ✅ Chrome (móvil y escritorio)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ Edge
- ✅ Dispositivos móviles
- ✅ Tablets

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (Animaciones y efectos)
- JavaScript (ES6+)
- Responsive Design
- CSS Grid y Flexbox

## 📁 Estructura del proyecto

```
📁 14Febrero2026/
├── 📄 index.html          # Página principal
├── 📄 styles.css          # Estilos y animaciones
├── 📄 script.js           # Funcionalidad JavaScript
├── 📄 README.md           # Documentación
├── 📄 .gitignore          # Archivos ignorados por Git
└── 📁 assets/             # Recursos multimedia
    ├── 📁 audio/          # Archivos de música
    │   ├── 🎵 romantic-song.mp3
    │   └── 🎵 romantic-song.ogg (opcional)
    └── 📁 video/          # Archivos de video
        ├── 🎥 romantic-video.mp4
        └── 🎥 romantic-video.webm (opcional)
```

### 🚀 Para GitHub Pages:
Una vez que tengas todos los archivos, tu repositorio estará listo para GitHub Pages sin configuración adicional.

## 💝 Creado con amor

Esta página fue creada especialmente para el 14 de febrero de 2026.
¡Que tengas un día lleno de amor! ❤️

---

*"En el cielo de mi corazón, tú eres la estrella que más brilla"* ⭐

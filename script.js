// Variables globales
// no usan fetch() para evitar errores de CORS al abrir archivos localmente
let welcomeModal = null;
let welcomeContinue = null;
let secretModal = null;
let questionModal = null;
let finalMessage = null;
let noButton = null;
let yesButton = null;
let backgroundMusic = null;
let musicToggle = null;
let backgroundVideo = null;
let videoThumbnail = null;
let videoCounter = null;

// Variables para el control del botón "No"
let isMovingButton = false;
let buttonMoveInterval = null;

// Variables para el control de videos
let videoPlaylist = [
    'assets/video/100AÑOS.mp4',
    'assets/video/AMORboda.mp4',
    'assets/video/AMORcaminando.mp4',
    'assets/video/AMORchau.mp4',
    'assets/video/AMORdisco.mp4',
    'assets/video/AMORcitos.mp4',
    'assets/video/AMORmirador.mp4'
];
let currentVideoIndex = 0;
let isVideoPlaying = true;

// Variables para el control de audios
let audioPlaylist = [
    'assets/audio/onlyHope.mp3',
    'assets/audio/dicenqueYo.mp3',
    'assets/audio/100.mp3'
];
let currentAudioIndex = 0;
let isAudioPlaying = true;

// Canciones especiales (fuera de la playlist normal)
const SPECIAL_SONGS = {
    question: 'assets/audio/solito.mp3',
    celebration: 'assets/audio/salioelSol.mp3'
};

let isPlayingSpecialSong = false; // Flag para saber si está reproduciendo una canción especial

// Variables para evitar duplicar event listeners
let audioListenersAdded = false;

// Variable para evitar llamadas duplicadas al evento ended
let isTransitioningAudio = false;

// Variables para el cronómetro de bienvenida
let timerInterval = null;

// Fecha de inicio de la relación: 1 de Julio 2024, 8:00 PM
const RELATIONSHIP_START = new Date('2024-07-01T20:00:00');

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos
    welcomeModal = document.getElementById('welcomeModal');
    welcomeContinue = document.getElementById('welcomeContinue');
    secretModal = document.getElementById('secretModal');
    questionModal = document.getElementById('questionModal');
    finalMessage = document.getElementById('finalMessage');
    noButton = document.getElementById('noButton');
    yesButton = document.getElementById('yesButton');
    backgroundMusic = document.getElementById('backgroundMusic');
    musicToggle = document.getElementById('musicToggle');
    backgroundVideo = document.getElementById('backgroundVideo');
    videoThumbnail = document.getElementById('videoThumbnail');
    videoCounter = document.getElementById('videoCounter');
    
    // La fecha secreta: 01/07/2024
    // Input tipo date devuelve formato ISO: YYYY-MM-DD (2024-07-01)
    const SECRET_DATE = "2024-07-01";
    
    // Mostrar modal de bienvenida primero
    showWelcomeModal();
    
    // Configurar música con playlist (pero NO iniciar automáticamente aún)
    setupMusicPlaylist();
    
    // Configurar video
    setupVideo();
    
    // Configurar control de visibilidad de modales
    setupModalVisibility();
    
    // Manejar botón de continuar del modal de bienvenida
    welcomeContinue.addEventListener('click', function() {
        const inputValue = document.getElementById('secretInput').value.trim();
        
        // Validar la fecha secreta (formato ISO: YYYY-MM-DD)
        if (inputValue === SECRET_DATE) {
            hideWelcomeModal();
            
            // Iniciar la música cuando el usuario hace clic en continuar
            startPlaylistAutomatically();
            
            // Configurar el temporizador para mostrar el modal de pregunta después de 14 segundos
            setTimeout(() => {
                showQuestionModal();
            }, 14000);
        } else {
            // Efecto de shake si la clave es incorrecta
            const welcomeContent = welcomeModal.querySelector('.welcome-content');
            welcomeContent.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                welcomeContent.style.animation = 'modalSlideIn 0.8s ease-out';
            }, 500);
            
            // Limpiar el input
            document.getElementById('secretInput').value = '';
            document.getElementById('secretInput').focus();
        }
    });
    
    // Permitir enviar con Enter en el input de clave
    document.getElementById('secretInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            welcomeContinue.click();
        }
    });
    
    // Manejar respuesta "Sí"
    yesButton.addEventListener('click', function() {
        hideQuestionModal();
        showFinalMessage(true);
    });
    
    // Manejar cierre del mensaje final
    document.getElementById('closeFinalMessage').addEventListener('click', function() {
        finalMessage.style.display = 'none';
        updateVideoVisibility();
        
        // Volver a la playlist normal
        console.log('🔄 Volviendo a la playlist normal');
        isPlayingSpecialSong = false;
        isTransitioningAudio = true;
        loadAudio(0); // Empezar desde el principio
        
        if (isAudioPlaying) {
            backgroundMusic.addEventListener('canplaythrough', function playNormal() {
                backgroundMusic.play().then(() => {
                    console.log('▶️ Playlist normal reanudada');
                    isTransitioningAudio = false;
                }).catch(e => {
                    console.error('❌ Error:', e.message);
                    isTransitioningAudio = false;
                });
            }, { once: true });
        } else {
            isTransitioningAudio = false;
        }
    });
    
    // Manejar respuesta "No" con comportamiento especial mejorado
    setupNoButtonBehavior();
    
    // Configurar comportamiento para móviles
    setupMobileBehavior();
    
    // Iniciar slideshows de fotos en los message-cards
    setupCardPhotoSlideshow();
});

// Configurar música con playlist automática
function setupMusicPlaylist() {
    if (musicToggle && backgroundMusic && !audioListenersAdded) {
        audioListenersAdded = true; // Evitar duplicar listeners
        
        // Configurar volumen
        backgroundMusic.volume = 0.5;
        
        // Mostrar duración real cuando se cargue
        backgroundMusic.addEventListener('loadedmetadata', function() {
            console.log(`⏱️ Duración del audio: ${Math.floor(backgroundMusic.duration / 60)}:${String(Math.floor(backgroundMusic.duration % 60)).padStart(2, '0')}`);
        });
        
        // Control manual de música
        musicToggle.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    console.log('🎵 Música reanudada');
                    musicToggle.textContent = '🔇';
                    musicToggle.classList.remove('paused');
                    musicToggle.title = 'Pausar música';
                    isAudioPlaying = true;
                }).catch(e => {
                    console.error('❌ Error al reproducir música:', e.message);
                });
            } else {
                backgroundMusic.pause();
                console.log('🔇 Música pausada');
                musicToggle.textContent = '🎵';
                musicToggle.classList.add('paused');
                musicToggle.title = 'Reproducir música';
                isAudioPlaying = false;
            }
        });
        
        // Cuando termina un audio, pasar al siguiente
        // IMPORTANTE: Este evento solo se dispara cuando el audio REALMENTE termina
        backgroundMusic.addEventListener('ended', function() {
            // Prevenir llamadas duplicadas
            if (isTransitioningAudio) {
                return;
            }
            
            // Si estamos reproduciendo una canción especial, repetirla en bucle
            if (isPlayingSpecialSong) {
                console.log('🔁 Canción especial en bucle...');
                backgroundMusic.currentTime = 0;
                backgroundMusic.play().catch(e => {
                    console.error('❌ Error al repetir:', e.message);
                });
                return;
            }
            
            // Solo cambiar si el audio terminó naturalmente (no fue detenido manualmente)
            if (backgroundMusic.currentTime > 0 && backgroundMusic.ended) {
                console.log('🎵 Canción terminada, cambiando a la siguiente...');
                isTransitioningAudio = true;
                
                // Cambiar inmediatamente
                nextAudio();
            }
        });
        
        // Manejar errores de carga
        backgroundMusic.addEventListener('error', function(e) {
            console.error('❌ Error cargando audio:', audioPlaylist[currentAudioIndex]);
            console.log('🔄 Intentando siguiente audio...');
            
            // Intentar siguiente audio si hay error
            if (audioPlaylist.length > 1) {
                setTimeout(() => {
                    nextAudio();
                }, 1000);
            } else {
                console.log('❌ No hay más audios disponibles');
                musicToggle.textContent = '🚫';
                musicToggle.title = 'Audio no disponible';
            }
        });
        
        // Cargar e iniciar el primer audio automáticamente
        loadAudio(currentAudioIndex);
        startPlaylistAutomatically();
    }
}

// Cargar un audio específico
function loadAudio(index) {
    if (index >= 0 && index < audioPlaylist.length) {
        const audioSrc = audioPlaylist[index];
        
        console.log(`🎵 Cargando: ${audioSrc.split('/').pop()}`);
        
        // Actualizar índice
        currentAudioIndex = index;
        
        // Cambiar la fuente del audio
        backgroundMusic.src = audioSrc;
        
        // Precargar el audio
        backgroundMusic.load();
    } else {
        console.error('❌ Índice de audio inválido:', index);
    }
}

// Ir al siguiente audio
function nextAudio() {
    let nextIndex = currentAudioIndex + 1;
    
    // Si llegamos al final, volver al principio
    if (nextIndex >= audioPlaylist.length) {
        nextIndex = 0;
    }
    
    loadAudio(nextIndex);
    
    // Si estaba reproduciendo, continuar reproduciendo
    if (isAudioPlaying) {
        // Esperar a que el nuevo audio esté listo
        const playNext = () => {
            backgroundMusic.play()
                .then(() => {
                    console.log('▶️ Reproduciendo: ' + audioPlaylist[currentAudioIndex].split('/').pop());
                    isTransitioningAudio = false;
                })
                .catch(e => {
                    console.error('❌ Error:', e.message);
                    isTransitioningAudio = false;
                });
        };
        
        // Esperar a que esté listo para reproducir
        backgroundMusic.addEventListener('canplaythrough', playNext, { once: true });
    } else {
        isTransitioningAudio = false;
    }
}

// Iniciar la playlist automáticamente al cargar la página
function startPlaylistAutomatically() {
    console.log('🎵 Iniciando playlist automáticamente...');
    
    // Esperar un momento para que el audio esté completamente cargado
    setTimeout(() => {
        backgroundMusic.play().then(() => {
            console.log('✅ Playlist iniciada automáticamente');
            musicToggle.textContent = '🔇';
            musicToggle.classList.remove('paused');
            musicToggle.title = 'Pausar música';
            musicToggle.style.animation = '';
            isAudioPlaying = true;
        }).catch(e => {
            console.log('🔒 Reproducción automática bloqueada por el navegador');
            console.log('💡 Mostrando indicador para el usuario...');
            
            // Mostrar indicador visual para hacer clic
            showClickToPlayIndicator();
            
            // Hacer que el botón de música parpadee para llamar la atención
            musicToggle.textContent = '🎵';
            musicToggle.classList.add('paused');
            musicToggle.title = '¡Haz clic para iniciar la música!';
            musicToggle.style.animation = 'pulse 1.5s ease-in-out infinite';
            
            // Iniciar con primera interacción
            const startWithClick = () => {
                backgroundMusic.play().then(() => {
                    console.log('🎵 Música iniciada por el usuario');
                    musicToggle.textContent = '🔇';
                    musicToggle.classList.remove('paused');
                    musicToggle.style.animation = '';
                    musicToggle.title = 'Pausar música';
                    isAudioPlaying = true;
                    
                    // Remover el indicador visual
                    removeClickToPlayIndicator();
                }).catch(err => {
                    console.log('❌ Error al iniciar música:', err);
                });
            };
            
            document.addEventListener('click', startWithClick, { once: true });
            document.addEventListener('touchstart', startWithClick, { once: true });
        });
    }, 100);
}

// Mostrar indicador visual para hacer clic e iniciar la música
function showClickToPlayIndicator() {
    // Verificar si ya existe el indicador
    if (document.getElementById('clickToPlayIndicator')) {
        return;
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'clickToPlayIndicator';
    indicator.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.1em;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease-out, pulse 2s ease-in-out infinite;
            cursor: pointer;
            text-align: center;
        ">
            🎵 Haz clic para iniciar la música 🎵
        </div>
    `;
    
    // Agregar animaciones CSS si no existen
    if (!document.getElementById('clickIndicatorStyles')) {
        const style = document.createElement('style');
        style.id = 'clickIndicatorStyles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes pulse {
                0%, 100% {
                    transform: translateX(-50%) scale(1);
                }
                50% {
                    transform: translateX(-50%) scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
    
    // Hacer que el indicador también inicie la música al hacer clic
    indicator.addEventListener('click', () => {
        backgroundMusic.play().then(() => {
            console.log('🎵 Música iniciada por clic en el indicador');
            musicToggle.textContent = '🔇';
            musicToggle.classList.remove('paused');
            musicToggle.style.animation = '';
            musicToggle.title = 'Pausar música';
            isAudioPlaying = true;
            removeClickToPlayIndicator();
        }).catch(err => {
            console.log('❌ Error al iniciar música:', err);
        });
    });
}

// Remover el indicador visual
function removeClickToPlayIndicator() {
    const indicator = document.getElementById('clickToPlayIndicator');
    if (indicator) {
        indicator.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 300);
    }
}

// Función para mostrar el modal de pregunta
function showQuestionModal() {
    questionModal.style.display = 'block';
    updateVideoVisibility();
    
    // Cambiar a la canción especial "solito.mp3"
    console.log('💕 Cambiando a canción especial: solito.mp3');
    isPlayingSpecialSong = true;
    isTransitioningAudio = true;
    
    backgroundMusic.src = SPECIAL_SONGS.question;
    backgroundMusic.load();
    
    if (isAudioPlaying) {
        backgroundMusic.addEventListener('canplaythrough', function playSolito() {
            backgroundMusic.play().then(() => {
                console.log('▶️ Reproduciendo canción especial del modal de pregunta');
                isTransitioningAudio = false;
            }).catch(e => {
                console.error('❌ Error:', e.message);
                isTransitioningAudio = false;
            });
        }, { once: true });
    } else {
        isTransitioningAudio = false;
    }
}

// Función para ocultar el modal de pregunta
function hideQuestionModal() {
    questionModal.style.display = 'none';
    updateVideoVisibility();
}

// Función para mostrar el mensaje final
function showFinalMessage(isYes) {
    const title = document.getElementById('finalTitle');
    const text = document.getElementById('finalText');
    
    if (isYes) {
        title.textContent = '💕 Obviamente dirías que sí 💕';
        text.innerHTML = `
            <div style="
                max-width: 650px;
                margin: 0 auto;
                text-align: center;
                line-height: 1.9;
                padding: 20px;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 20px;
                backdrop-filter: blur(10px);
            ">
                <p style="
                    margin: 20px 0;
                    font-size: 1.3em;
                    font-weight: 600;
                    color: #ff6b9d;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
                ">
                    Bueno amorcita 💝
                </p>
                
                <div style="
                    background: rgba(255, 107, 157, 0.15);
                    border-left: 4px solid #ff6b9d;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 10px;
                ">
                    <p style="margin: 10px 0; font-size: 1.1em;">
                        💃 <strong>Nada de fiestas</strong> porque tienes que estudiar
                    </p>
                    <p style="margin: 10px 0; font-size: 1.1em;">
                        🎁 <strong>Nada de regalos</strong> porque ya hasta te adelanté tu regalo de cumpleaños
                    </p>
                    <p style="margin: 10px 0; font-size: 1.1em;">
                        🌻 <strong>Nada de flores</strong> porque ya te regalé girasoles y rosas
                    </p>
                </div>
                
                <p style="
                    margin: 25px 0;
                    font-size: 1.25em;
                    font-weight: 700;
                    color: #ffd93d;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    animation: pulse 2s ease-in-out infinite;
                ">
                    ¿Cuál es el plan dirás? 🤔
                </p>
                
                <div style="
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.2) 0%, rgba(255, 23, 68, 0.2) 100%);
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 15px;
                    border: 2px solid rgba(255, 107, 157, 0.3);
                ">
                    <p style="
                        margin: 15px 0;
                        font-size: 1.2em;
                        font-weight: 600;
                        color: #fff;
                        line-height: 1.8;
                    ">
                        💖 Pues seguir amándote y que este tipo de detalles no falte,<br>
                        <span style="color: #ffd93d;">esa es mi chamba</span>
                    </p>
                </div>
                
                <div style="
                    background: rgba(255, 217, 61, 0.15);
                    border: 2px dashed #ffd93d;
                    padding: 18px;
                    margin: 25px 0;
                    border-radius: 12px;
                ">
                    <p style="
                        margin: 0;
                        font-size: 1.15em;
                        color: #ffd93d;
                        font-weight: 500;
                    ">
                        🍗 Y bueno me merezco una salchipapita creo,<br>
                        con su broaster y su ajicito <strong>CREO</strong><br>
                        por ser tan chévere 😎
                    </p>
                </div>
                
                <p style="
                    margin: 30px 0 20px 0;
                    font-size: 2em;
                    font-weight: bold;
                    color: #ff1744;
                    text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
                    animation: heartbeat 1.5s ease-in-out infinite;
                    letter-spacing: 2px;
                ">
                    TE AMO ❤️
                </p>
            </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    10%, 30% { transform: scale(1.1); }
                    20%, 40% { transform: scale(1); }
                }
            </style>
        `;

        // Cambiar a la canción especial "salioelSol.mp3"
        console.log('☀️ Cambiando a canción de celebración: salioelSol.mp3');
        isPlayingSpecialSong = true;
        isTransitioningAudio = true;
        
        backgroundMusic.src = SPECIAL_SONGS.celebration;
        backgroundMusic.load();
        
        if (isAudioPlaying) {
            backgroundMusic.addEventListener('canplaythrough', function playSalioElSol() {
                backgroundMusic.play().then(() => {
                    console.log('▶️ Reproduciendo canción de celebración');
                    isTransitioningAudio = false;
                }).catch(e => {
                    console.error('❌ Error:', e.message);
                    isTransitioningAudio = false;
                });
            }, { once: true });
        } else {
            isTransitioningAudio = false;
        }
        
        // Crear confeti
        createConfetti();
    } else {
        title.textContent = '💔 Pero... ¿estás segura?';
        text.innerHTML = `
            Derrepente estas de sueño mi vida, descansa un ratito y vuelve a pensarlo ya?
            <br>Por si acaso te mando fotos del Eritos y yo para que te animes un poco más 😘
            <div style="
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 25px;
                flex-wrap: wrap;
            ">
                <img src="assets/foto/eros1.jpeg" alt="Eros 1" style="
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 15px;
                    border: 3px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <img src="assets/foto/eros2.jpeg" alt="Eros 2" style="
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 15px;
                    border: 3px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </div>
        `;
    }
    
    finalMessage.style.display = 'block';
    updateVideoVisibility();
}

// Configurar el comportamiento especial del botón "No"
function setupNoButtonBehavior() {
    let clickAttempts = 0;
    const maxAttempts = 1;
    
    // Función para obtener una posición aleatoria válida
    function getRandomPosition() {
        const modal = document.querySelector('.question-modal');
        const modalRect = modal.getBoundingClientRect();
        const buttonRect = noButton.getBoundingClientRect();
        
        // Área disponible dentro del modal
        const minX = 20;
        const maxX = modalRect.width - buttonRect.width - 20;
        const minY = 100; // Debajo del texto
        const maxY = modalRect.height - buttonRect.height - 20;
        
        return {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY
        };
    }
    
    // Función para mover el botón
    function moveButton() {
        if (isMovingButton) return;
        
        isMovingButton = true;
        const newPos = getRandomPosition();
        
        // Aplicar nueva posición con animación suave
        noButton.style.position = 'absolute';
        noButton.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        noButton.style.left = newPos.x + 'px';
        noButton.style.top = newPos.y + 'px';
        noButton.style.transform = 'scale(0.9) rotate(' + (Math.random() * 20 - 10) + 'deg)';
        
        // Restaurar después de la animación
        setTimeout(() => {
            noButton.style.transform = 'scale(1) rotate(0deg)';
            isMovingButton = false;
        }, 300);
        
        clickAttempts++;
        
        // Mensaje motivacional después de varios intentos
        switch (clickAttempts) {
            case 1:
                showTemporaryMessage("¡Uy, parece que te equivocaste! 😄");
                break;
            case 2:
                showTemporaryMessage("Otravez? mmmm...... 🤔");
                break;
            case 3:
                showTemporaryMessage("¡Sé que quieres decir que sí! 💖");
                break;
            case 4:
                showTemporaryMessage("Ya peeeeeeeeeeeeeeeeeeeeeeeeee...");
                break;
            case 5:
                showTemporaryMessage("Ya ves como eressssssssssssss");
                break;
            case 6:
                showTemporaryMessage("Me lo voy molestarshhhhhhhhh");
                break;
            case 7:
                showTemporaryMessage("Es porque soy negro verdad?");
                break;
            case 8:
                showTemporaryMessage("Ahhhh pero luego no me insistas!");
                break;
            case 9:
                showTemporaryMessage("Yo que queria darte mi tesorito");
                break;
            case 10:
                showTemporaryMessage("Ya no diré nada");
                break;
            case 11:
                showTemporaryMessage("Si no quieres, no quieres pe");
                break;
            case 12:
                showTemporaryMessage("...");
                break;
            case 13:
                showTemporaryMessage("Asi va ser...");
                break;
            case 14:
                showTemporaryMessage("Todo un día haciendo la pagina para que me chotees");
                break;
            case 15:
                showTemporaryMessage("Me hubiera ido a comer una salchipapa, la seño ya cerró");
                break;
        }
    }
    
    // Event listeners para el botón "No"
    // SOLO se mueve cuando se hace clic, NO en hover
    // noButton.addEventListener('mouseenter', moveButton); // DESACTIVADO
    // noButton.addEventListener('mouseover', moveButton);  // DESACTIVADO
    // noButton.addEventListener('focus', moveButton);      // DESACTIVADO
    
    // Manejar clics persistentes
    noButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Evitar duplicación si viene de un touchstart reciente (en móviles)
        const now = Date.now();
        if (window.lastTouchTime && (now - window.lastTouchTime < 500)) {
            return; // Ignorar este click porque ya fue manejado por touchstart
        }
        
        if (clickAttempts >= maxAttempts) {
            hideQuestionModal();
            showFinalMessage(false);
            
            setTimeout(() => {
                finalMessage.style.display = 'none';
                showQuestionModal();
                resetNoButton();
            }, 3000);
        } else {
            // Mover el botón cuando se hace clic
            moveButton();
        }
    });
}

// Función para resetear el botón "No"
function resetNoButton() {
    noButton.style.position = 'relative';
    noButton.style.left = 'auto';
    noButton.style.top = 'auto';
    noButton.style.transform = 'none';
    noButton.style.transition = '';
    isMovingButton = false;
    clickAttempts = 0;
}

// Función para mostrar mensajes temporales
function showTemporaryMessage(message) {
    const tempMsg = document.createElement('div');
    tempMsg.textContent = message;
    tempMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #d63384 0%, #e83e8c 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 30px;
        font-size: 1.3em;
        font-weight: bold;
        z-index: 10001;
        animation: fadeInOut 3s ease-in-out;
        pointer-events: none;
        box-shadow: 0 10px 40px rgba(214, 51, 132, 0.5);
        text-align: center;
        max-width: 80%;
        min-width: 300px;
        border: 3px solid rgba(255, 255, 255, 0.4);
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(tempMsg);
    
    setTimeout(() => {
        if (document.body.contains(tempMsg)) {
            document.body.removeChild(tempMsg);
        }
    }, 3000);
}

// Crear efecto de confeti
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 30);
    }
}

// Crear una pieza individual de confeti
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
    
    document.body.appendChild(confetti);
    
    // Animación de caída
    let pos = -10;
    let rotation = 0;
    const fall = setInterval(() => {
        pos += Math.random() * 5 + 2;
        rotation += Math.random() * 10 - 5;
        confetti.style.top = pos + 'px';
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        if (pos > window.innerHeight) {
            clearInterval(fall);
            if (document.body.contains(confetti)) {
                document.body.removeChild(confetti);
            }
        }
    }, 16);
}

// Configurar video de fondo con playlist
function setupVideo() {
    if (backgroundVideo && videoThumbnail && videoCounter) {
        // Cargar el primer video
        loadVideo(currentVideoIndex);
        updateVideoCounter();
        
        // Auto-avance cuando termina un video
        backgroundVideo.addEventListener('ended', function() {
            nextVideo();
        });
        
        // Manejar errores de carga de video
        backgroundVideo.addEventListener('error', function() {
            console.log(`❌ Error cargando video: ${videoPlaylist[currentVideoIndex]}`);
            console.log('🔄 Intentando siguiente video...');
            
            if (videoPlaylist.length > 1) {
                setTimeout(() => {
                    nextVideo();
                }, 1000);
            } else {
                console.log('❌ No hay videos disponibles');
                videoThumbnail.classList.add('hidden');
            }
        });
        
        // Evento cuando el video está listo para reproducir
        backgroundVideo.addEventListener('loadeddata', function() {
            if (isVideoPlaying) {
                backgroundVideo.play().catch(e => {
                    console.log('Reproducción automática de video bloqueada');
                    isVideoPlaying = false;
                });
            }
        });
    }
}


// Cargar un video específico
function loadVideo(index) {
    if (index >= 0 && index < videoPlaylist.length) {
        const videoSrc = videoPlaylist[index];
        backgroundVideo.src = videoSrc;
        currentVideoIndex = index;
        updateVideoCounter();
        
        if (isVideoPlaying) {
            backgroundVideo.play().catch(e => {
                console.log('No se pudo reproducir automáticamente');
                isVideoPlaying = false;
            });
        }
    }
}

// Ir al siguiente video
function nextVideo() {
    let nextIndex = currentVideoIndex + 1;
    
    if (nextIndex >= videoPlaylist.length) {
        nextIndex = 0;
    }
    
    loadVideo(nextIndex);
}

// Ir al video anterior
function previousVideo() {
    let prevIndex = currentVideoIndex - 1;
    
    if (prevIndex < 0) {
        prevIndex = videoPlaylist.length - 1;
    }
    
    loadVideo(prevIndex);
}

// Actualizar contador de videos
function updateVideoCounter() {
    if (videoCounter && videoPlaylist.length > 0) {
        videoCounter.textContent = `${currentVideoIndex + 1}/${videoPlaylist.length}`;
    }
}

// Función para actualizar visibilidad del video
function updateVideoVisibility() {
    if (videoThumbnail) {
        const isAnyModalVisible = (welcomeModal && welcomeModal.style.display === 'block') ||
                                 (questionModal && questionModal.style.display === 'block') ||
                                 (finalMessage && finalMessage.style.display === 'block');
        
        if (isAnyModalVisible) {
            videoThumbnail.classList.add('hidden');
        } else {
            videoThumbnail.classList.remove('hidden');
        }
    }
}

// Configurar visibilidad del video según los modales
function setupModalVisibility() {
    function isAnyModalVisible() {
        return (welcomeModal && welcomeModal.style.display === 'block') ||
               (questionModal && questionModal.style.display === 'block') ||
               (finalMessage && finalMessage.style.display === 'block');
    }
    
    function updateVideoVisibility() {
        if (videoThumbnail) {
            if (isAnyModalVisible()) {
                videoThumbnail.classList.add('hidden');
            } else {
                videoThumbnail.classList.remove('hidden');
            }
        }
    }
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                updateVideoVisibility();
            }
        });
    });
    
    if (welcomeModal) observer.observe(welcomeModal, { attributes: true });
    if (secretModal) observer.observe(secretModal, { attributes: true });
    if (questionModal) observer.observe(questionModal, { attributes: true });
    if (finalMessage) observer.observe(finalMessage, { attributes: true });
    
    updateVideoVisibility();
}

// Función para hacer que los corazones flotantes se muevan
function animateFloatingHearts() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        const moveHeart = () => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = 3000 + Math.random() * 2000;
            
            heart.style.transition = `all ${duration}ms ease-in-out`;
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            
            setTimeout(moveHeart, duration);
        };
        
        setTimeout(moveHeart, index * 500);
    });
}

// Iniciar animación de corazones cuando la página carga
window.addEventListener('load', () => {
    setTimeout(animateFloatingHearts, 1000);
});

// Agregar efecto de partículas adicional
function createRomanticParticles() {
    setInterval(() => {
        if (Math.random() < 0.3) {
            const particle = document.createElement('div');
            particle.textContent = ['💖', '💕', '🌹', '✨', '💝'][Math.floor(Math.random() * 5)];
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.opacity = '0.7';
            
            document.body.appendChild(particle);
            
            let pos = window.innerHeight;
            const rise = setInterval(() => {
                pos -= 2;
                particle.style.top = pos + 'px';
                particle.style.opacity = (pos / window.innerHeight) * 0.7;
                
                if (pos < -50) {
                    clearInterval(rise);
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                }
            }, 50);
        }
    }, 1000);
}

// Iniciar partículas románticas
setTimeout(createRomanticParticles, 2000);

// Optimización para dispositivos móviles
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && window.innerHeight <= 1024);
}

// Ajustar comportamiento para móviles
function setupMobileBehavior() {
    if (isMobileDevice()) {
        // En móviles, agregar evento táctil para el botón "No"
        noButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            // Registrar el tiempo del toque para evitar duplicación con click
            if (window.lastTouchTime === undefined) {
                window.lastTouchTime = 0;
            }
            window.lastTouchTime = Date.now();
            
            if (!isMovingButton) {
                moveButton();
            }
        }, { passive: false });
        
        // En móviles, hacer los videos más pequeños
        if (videoThumbnail) {
            videoThumbnail.style.width = '100px';
            videoThumbnail.style.height = '75px';
        }
        
        console.log('🎵 Optimizado para móvil');
    }
}

// Calcular el tiempo de relación
function calculateRelationshipTime() {
    const now = new Date();
    const diff = now - RELATIONSHIP_START;
    
    // Calcular el tiempo total en diferentes unidades
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calcular años completos
    const years = Math.floor(totalDays / 365.25);
    
    // Calcular meses completos (después de restar los años)
    const daysAfterYears = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(daysAfterYears / 30.44);
    
    // Calcular días completos (después de restar años y meses)
    const days = Math.floor(daysAfterYears - (months * 30.44));
    
    // Calcular horas (del día actual)
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Calcular minutos (de la hora actual)
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Calcular segundos
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    };
}

// Actualizar el cronómetro digital
function updateDigitalTimer() {
    const time = calculateRelationshipTime();
    
    // Actualizar cada elemento del cronómetro
    const timerYears = document.getElementById('timerYears');
    const timerMonths = document.getElementById('timerMonths');
    const timerDays = document.getElementById('timerDays');
    const timerHours = document.getElementById('timerHours');
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    
    if (timerYears) timerYears.textContent = time.years;
    if (timerMonths) timerMonths.textContent = time.months;
    if (timerDays) timerDays.textContent = time.days;
    if (timerHours) timerHours.textContent = String(time.hours).padStart(2, '0');
    if (timerMinutes) timerMinutes.textContent = String(time.minutes).padStart(2, '0');
    if (timerSeconds) timerSeconds.textContent = String(time.seconds).padStart(2, '0');
}

// Iniciar actualización del cronómetro
function startDigitalTimer() {
    // Actualizar inmediatamente
    updateDigitalTimer();
    
    // Actualizar cada segundo
    timerInterval = setInterval(updateDigitalTimer, 1000);
}

// Detener actualización del cronómetro
function stopDigitalTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Mostrar modal de bienvenida
function showWelcomeModal() {
    if (welcomeModal) {
        welcomeModal.style.display = 'block';
        
        // Iniciar cronómetro digital
        startDigitalTimer();
        
        updateVideoVisibility();
    }
}

// Ocultar modal de bienvenida
function hideWelcomeModal() {
    if (welcomeModal) {
        welcomeModal.style.display = 'none';
        
        // El cronómetro del footer ya está visible y funcionando
        // No es necesario hacer nada más con el cronómetro
        
        updateVideoVisibility();
    }
}

// ========================================
// SLIDESHOW DE FOTOS EN MESSAGE CARDS
// ========================================

// Configurar el slideshow de fotos en cada message-card
function setupCardPhotoSlideshow() {
    // Configuración de fotos para cada card (7 fotos por card con nomenclatura amorcitos)
    const cardPhotos = {
        1: ['amorcitos1.jpeg', 'amorcitos2.jpeg', 'amorcitos3.jpeg', 'amorcitos4.jpeg', 'amorcitos5.jpeg', 'amorcitos6.jpeg', 'amorcitos7.jpeg'],
        2: ['amorcitos8.jpeg', 'amorcitos9.jpeg', 'amorcitos10.jpeg', 'amorcitos11.jpeg', 'amorcitos12.jpeg', 'amorcitos13.jpeg', 'amorcitos14.jpeg'],
        3: ['amorcitos15.jpeg', 'amorcitos16.jpeg', 'amorcitos17.jpeg', 'amorcitos18.jpeg', 'amorcitos19.jpeg', 'amorcitos20.jpeg', 'amorcitos21.jpeg'],
        4: ['amorcitos22.jpeg', 'amorcitos23.jpeg', 'amorcitos24.jpeg', 'amorcitos25.jpeg', 'amorcitos26.jpeg', 'amorcitos27.jpeg', 'amorcitos28.jpeg']
    };
    
    // Obtener todas las tarjetas
    const cards = document.querySelectorAll('.message-card[data-card]');
    
    cards.forEach(card => {
        const cardNumber = parseInt(card.getAttribute('data-card'));
        const photos = cardPhotos[cardNumber];
        
        if (!photos) return;
        
        // Obtener el contenedor de fotos
        const photoContainer = card.querySelector('.card-photo-container');
        if (!photoContainer) return;
        
        // Limpiar contenedor
        photoContainer.innerHTML = '';
        
        // Crear elementos img para todas las fotos
        photos.forEach((photo, index) => {
            const img = document.createElement('img');
            img.classList.add('card-photo');
            img.src = `assets/foto/${photo}`;
            img.alt = `Recuerdo ${cardNumber}-${index + 1}`;
            
            // La primera foto se muestra activa
            if (index === 0) {
                img.classList.add('active');
            }
            
            photoContainer.appendChild(img);
        });
        
        // Iniciar rotación automática para esta tarjeta
        let currentIndex = 0;
        setInterval(() => {
            const images = photoContainer.querySelectorAll('.card-photo');
            
            // Remover clase active de la imagen actual
            images[currentIndex].classList.remove('active');
            
            // Avanzar al siguiente índice (circular)
            currentIndex = (currentIndex + 1) % images.length;
            
            // Agregar clase active a la nueva imagen
            images[currentIndex].classList.add('active');
        }, 1000); // Cambiar cada 1 segundo
    });
}
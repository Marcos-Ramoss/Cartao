// Variáveis globais
let stream = null;
let webcamVideo = null;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    webcamVideo = document.getElementById('webcam');
    
    // Adicionar efeito de digitação na carta
    typeWriterEffect();
    
    // Adicionar efeitos de hover nos botões
    addButtonEffects();
    
    // Adicionar efeitos de partículas
    createParticles();
    
    // Detectar se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reduzir intensidade das animações em mobile
        const floatingElements = document.querySelectorAll('.floating-image, .floating-gif');
        floatingElements.forEach(element => {
            element.style.animationDuration = '12s';
        });
        
        // Otimizar para touch
        optimizeForTouch();
    }
    
    // Efeitos para as imagens flutuantes
    const floatingImages = document.querySelectorAll('.floating-image, .floating-gif');
    
    floatingImages.forEach(image => {
        image.style.pointerEvents = 'auto';
        image.style.cursor = 'pointer';
        
        // Usar touchstart para mobile e click para desktop
        const eventType = isMobile ? 'touchstart' : 'click';
        
        image.addEventListener(eventType, function(e) {
            if (eventType === 'touchstart') {
                e.preventDefault(); // Prevenir zoom em mobile
            }
            
            // Efeito de clique
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Criar partículas especiais (reduzidas em mobile)
            if (isMobile) {
                createMobileImageParticles(this);
            } else {
                createImageParticles(this);
            }
        });
    });
});

// Efeito de digitação na carta
function typeWriterEffect() {
    const paragraphs = document.querySelectorAll('.letter-content p');
    paragraphs.forEach((paragraph, index) => {
        const text = paragraph.textContent;
        paragraph.textContent = '';
        paragraph.style.opacity = '0';
        
        setTimeout(() => {
            paragraph.style.opacity = '1';
            let i = 0;
            const typeInterval = setInterval(() => {
                paragraph.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 30);
        }, index * 1000);
    });
}

// Adicionar efeitos nos botões
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function() {
            // Efeito de clique
            this.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 150);
        });
    });
}

// Criar partículas flutuantes
function createParticles() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = '✨';
        particle.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            pointer-events: none;
            z-index: 0;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
        `;
        container.appendChild(particle);
    }
}

// Adicionar CSS para partículas flutuantes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
        100% {
            transform: translateY(0px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Função para mostrar surpresa
function showSurprise() {
    const surprise = document.getElementById('surprise');
    surprise.style.display = 'flex';
    
    // Adicionar efeito de confete
    createConfetti();
    
    // Tocar som de surpresa (se disponível)
    playSurpriseSound();
}

// Função para esconder surpresa
function hideSurprise() {
    const surprise = document.getElementById('surprise');
    surprise.style.display = 'none';
}

// Função para mostrar espelho/webcam
async function showMirror() {
    const mirror = document.getElementById('mirror');
    mirror.style.display = 'flex';
    
    try {
        // Solicitar acesso à webcam
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 400 },
                height: { ideal: 300 },
                facingMode: 'user'
            } 
        });
        
        webcamVideo.srcObject = stream;
        webcamVideo.play();
        
        // Adicionar efeito de moldura
        addFrameEffect();
        
    } catch (error) {
        console.error('Erro ao acessar webcam:', error);
        showWebcamError();
    }
}

// Função para esconder espelho/webcam
function hideMirror() {
    const mirror = document.getElementById('mirror');
    mirror.style.display = 'none';
    
    // Parar a webcam
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    if (webcamVideo) {
        webcamVideo.srcObject = null;
    }
}

// Adicionar efeito de moldura na webcam
function addFrameEffect() {
    const frame = document.querySelector('.mirror-frame');
    frame.style.animation = 'frameGlow 2s ease-in-out infinite alternate';
    
    // Adicionar CSS para o efeito de moldura
    const frameStyle = document.createElement('style');
    frameStyle.textContent = `
        @keyframes frameGlow {
            0% {
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 107, 157, 0.5);
            }
            100% {
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 107, 157, 0.8);
            }
        }
    `;
    document.head.appendChild(frameStyle);
}

// Mostrar erro se webcam não estiver disponível
function showWebcamError() {
    const mirror = document.getElementById('mirror');
    const video = document.getElementById('webcam');
    
    video.style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="padding: 40px; text-align: center;">
            <h3>😔 Webcam não disponível</h3>
            <p>Mas você ainda é linda(o) demais! 💕</p>
            <p style="font-size: 0.9em; margin-top: 20px;">
                Para usar a webcam, permita o acesso quando solicitado.
            </p>
        </div>
    `;
    
    mirror.querySelector('.mirror-frame').appendChild(errorDiv);
}

// Criar efeito de confete
function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#ffb3d1', '#e91e63', '#ff4081'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remover confete após animação
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Adicionar CSS para confete
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Tocar som de surpresa (usando Web Audio API)
function playSurpriseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Som não disponível');
    }
}

// Efeito de hover na carta
document.addEventListener('DOMContentLoaded', function() {
    const letter = document.querySelector('.letter');
    
    letter.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 15px 40px rgba(255, 179, 209, 0.4)';
    });
    
    letter.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(255, 179, 209, 0.2)';
    });
});

// Efeito de clique nos corações
document.addEventListener('DOMContentLoaded', function() {
    const hearts = document.querySelectorAll('.heart');
    
    hearts.forEach(heart => {
        heart.addEventListener('click', function() {
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '1';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.opacity = '0.7';
            }, 300);
        });
    });
});

// Adicionar efeito de parallax suave
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hearts-container');
    const speed = scrolled * 0.5;
    
    parallax.style.transform = `translateY(${speed}px)`;
});

// Função para adicionar mais corações dinamicamente
function addMoreHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const newHeart = document.createElement('div');
    newHeart.className = 'heart';
    newHeart.innerHTML = ['❤️', '💖', '💕', '💗', '💓', '💝', '💘', '💞'][Math.floor(Math.random() * 8)];
    newHeart.style.left = Math.random() * 100 + '%';
    newHeart.style.animationDelay = Math.random() * 6 + 's';
    
    heartsContainer.appendChild(newHeart);
    
    // Remover coração após animação
    setTimeout(() => {
        newHeart.remove();
    }, 6000);
}

// Adicionar corações periodicamente
setInterval(addMoreHearts, 3000);

// Efeito de digitação no título
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('.card-header h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeTitle = setInterval(() => {
        title.textContent += originalText.charAt(i);
        i++;
        if (i >= originalText.length) {
            clearInterval(typeTitle);
        }
    }, 100);
});

// Adicionar efeito de shake nos botões quando clicados
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Adicionar CSS para shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Criar partículas especiais quando clicar nas imagens
function createImageParticles(imageElement) {
    const rect = imageElement.getBoundingClientRect();
    const colors = ['#ff6b9d', '#c44569', '#ffb3d1', '#e91e63', '#ff4081'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1002;
            animation: imageParticle ${Math.random() * 2 + 1}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Adicionar CSS para partículas das imagens
const imageParticleStyle = document.createElement('style');
imageParticleStyle.textContent = `
    @keyframes imageParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(imageParticleStyle);

// Otimizar para dispositivos touch
function optimizeForTouch() {
    // Reduzir número de partículas em mobile
    const heartsContainer = document.querySelector('.hearts-container');
    const hearts = heartsContainer.querySelectorAll('.heart');
    
    // Manter apenas alguns corações em mobile para melhor performance
    if (hearts.length > 4) {
        for (let i = 4; i < hearts.length; i++) {
            hearts[i].style.display = 'none';
        }
    }
    
    // Reduzir frequência de criação de novos corações
    clearInterval(window.heartInterval);
    window.heartInterval = setInterval(addMoreHearts, 5000); // A cada 5 segundos em vez de 3
}

// Criar partículas otimizadas para mobile
function createMobileImageParticles(imageElement) {
    const rect = imageElement.getBoundingClientRect();
    const colors = ['#ff6b9d', '#c44569', '#ffb3d1'];
    
    // Menos partículas em mobile
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1002;
            animation: mobileImageParticle ${Math.random() * 1.5 + 0.8}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

// Adicionar CSS para partículas mobile
const mobileParticleStyle = document.createElement('style');
mobileParticleStyle.textContent = `
    @keyframes mobileImageParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(mobileParticleStyle); 
class AudioSystem {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.button = null;
        this.progressBar = null;
        this.volumeSlider = null;
        this.volumeButton = null;
        this.volumePanel = null;
        this.currentVolume = 0.5;

        this.init();
    }

    init() {
        this.createAudioElement();
        this.createControlButton();
        this.hideAudioButton();
        this.addFavicon();
        this.addBackgroundVideo();
    }

    hideAudioButton() {
        if (this.volumeControl) {
            this.volumeControl.style.display = 'none';
        }
    }

    showAudioButton() {
        if (this.volumeControl) {
            this.volumeControl.style.display = 'block';
        }
    }

    createAudioElement() {
        this.audio = new Audio();
        this.audio.src = 'audio.mp3';
        this.audio.loop = true;
        this.audio.volume = this.currentVolume;


        this.audio.addEventListener('loadstart', () => {
            console.log('Ładowanie muzyki...');
        });

        this.audio.addEventListener('canplay', () => {
            console.log('Muzyka gotowa do odtwarzania');
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Błąd ładowania muzyki:', e);
        });
    }

    createControlButton() {

        this.volumeControl = document.createElement('div');
        this.volumeControl.className = 'volume-control';
        this.volumeControl.innerHTML = `
            <button class="volume-btn" id="volumeToggle">
                <i class="fas fa-volume-up"></i>
            </button>
            <div class="volume-panel" id="volumePanel">
            <div class="volume-slider-vertical" id="volumeSlider">
                <div class="volume-track">
                    <div class="volume-fill"></div>
                </div>
                <img src="photo.png" alt="Volume Image" class="volume-image" />
            </div>
            </div>
        `;


        const style = document.createElement('style');
        style.textContent = `
            /* Volume Control Styles */
            .volume-control {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideInRight 0.5s ease-out;
            }

            .volume-btn {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.6), rgba(220, 38, 38, 0.3));
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(220, 38, 38, 0.3);
            }

            .volume-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s ease;
            }

            .volume-btn:hover::before {
                left: 100%;
            }

            .volume-btn:hover {
                background: linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(220, 38, 38, 0.5));
                transform: scale(1.1);
                box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
            }
            
            .volume-btn.active {
                opacity: 0.3;
                transform: scale(0.8);
                pointer-events: none;
            }

            .volume-panel {
                position: absolute;
                top: 60px;
                right: 0;
                background: rgba(220, 38, 38, 0.15);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(220, 38, 38, 0.3);
                border-radius: 12px;
                padding: 8px;
                width: 40px;
                height: 120px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transform: translateY(-10px) scale(0.9);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .volume-panel.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            .volume-slider-vertical {
                height: 100px;
                width: 8px;
                position: relative;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
            }

            .volume-track {
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                position: relative;
                overflow: hidden;
            }

            .volume-fill {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50%;
                background: linear-gradient(180deg, #f87171, #ef4444, #dc2626);
                border-radius: 4px;
                transition: height 0.2s ease;
            }

            .volume-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                animation: shimmerVertical 2s infinite;
            }

            @keyframes shimmerVertical {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100%); }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.volumeControl);

        this.volumeButton = document.getElementById('volumeToggle');
        this.volumePanel = document.getElementById('volumePanel');
        this.volumeSlider = document.getElementById('volumeSlider');

        this.volumeButton.addEventListener('click', () => this.toggleVolumePanel());


        this.setupVolumeControls();


        document.addEventListener('click', (e) => {
            if (!e.target.closest('.volume-control')) {
                this.volumePanel.classList.remove('active');
                this.volumeButton.classList.remove('active');
            }
        });
    }

    setupVolumeControls() {

        let isDragging = false;

        const updateVolume = (e) => {
            const rect = this.volumeSlider.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
            this.setVolume(percent);
        };

        this.volumeSlider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateVolume(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateVolume(e);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        this.volumeSlider.addEventListener('click', updateVolume);


        this.updateVolumeSlider();
    }

    setVolume(volume) {
        this.currentVolume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.currentVolume;
        }
        this.updateVolumeSlider();
        this.updateVolumeIcon();
    }

    updateVolumeSlider() {
        const volumeFill = this.volumeSlider.querySelector('.volume-fill');
        const percent = this.currentVolume * 100;

        volumeFill.style.height = percent + '%';
    }

    updateVolumeIcon() {
        const icon = this.volumeButton.querySelector('i');
        if (this.currentVolume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.currentVolume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    toggleVolumePanel() {
        this.volumePanel.classList.toggle('active');
        this.volumeButton.classList.toggle('active');
    }

    addFavicon() {

        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach(favicon => favicon.remove());


        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/svg+xml';
        favicon.href = 'https://cdn.discordapp.com/avatars/1150391381752299652/9c881d4734afcd3e3a6fb537b15ddfc7.png?size=256';
        document.head.appendChild(favicon);
    }

    addBackgroundVideo() {

        const videoBackground = document.createElement('div');
        videoBackground.className = 'video-background';
        videoBackground.innerHTML = `
            <video autoplay muted loop id="bgVideo">
                <source src="background.mp4" type="video/mp4">

            </video>
        `;


        const videoStyle = document.createElement('style');
        videoStyle.textContent = `
            .video-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -2;
                overflow: hidden;
            }

            #bgVideo {
                position: absolute;
                top: 50%;
                left: 50%;
                min-width: 100%;
                min-height: 100%;
                width: auto;
                height: auto;
                transform: translate(-50%, -50%);
                opacity: 0.3;
                filter: hue-rotate(0deg) saturate(1.2) brightness(0.7);
                transition: all 0.3s ease;
            }

            .video-background::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(ellipse at center, rgba(220, 38, 38, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);
                z-index: 1;
            }
        `;

        document.head.appendChild(videoStyle);
        document.body.insertBefore(videoBackground, document.body.firstChild);


        const video = document.getElementById('bgVideo');
        video.addEventListener('error', () => {
            console.log('Błąd ładowania video - używam gradientowe tło');
            videoBackground.style.background = 'radial-gradient(ellipse at center, #1a0000 0%, #000000 100%)';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
});

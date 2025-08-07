console.log("script.js loaded");

const DISCORD_USER_ID = '1150391381752299652';
const SERVER_ID = '1333082938656428042';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;


const DISCORD_INVITE_API = `https://discord.com/api/v9/invites/BxsUUa96wc?with_counts=true&with_expiration=true`;
const DISCORD_WIDGET_API = `https://discord.com/api/guilds/${SERVER_ID}/widget.json`;

// Views Counter System
class ViewsCounter {
    constructor() {
        this.storageKey = 'bio_page_views';
        this.visitorKey = 'bio_visitor_id';
        this.init();
    }

    init() {
        this.generateVisitorId();
        this.updateViews();
    }

    generateVisitorId() {
        let visitorId = localStorage.getItem(this.visitorKey);
        if (!visitorId) {
            // Generuj unikalny ID dla odwiedzającego
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.visitorKey, visitorId);
            
            // Zwiększ liczbę wyświetleń tylko dla nowych odwiedzających
            this.incrementViews();
        }
    }

    incrementViews() {
        let currentViews = parseInt(localStorage.getItem(this.storageKey)) || 0;
        currentViews++;
        localStorage.setItem(this.storageKey, currentViews.toString());
        console.log('Views incremented to:', currentViews);
    }

    getViews() {
        return parseInt(localStorage.getItem(this.storageKey)) || 0;
    }

    updateViews() {
        const viewsCount = this.getViews();
        const viewsCountElement = document.getElementById('views-count');
        
        console.log('Updating views display. Current count:', viewsCount);
        
        if (viewsCountElement) {
            // Formatuj liczbę (np. 1234 -> 1.2K)
            const formattedViews = this.formatNumber(viewsCount);
            viewsCountElement.textContent = formattedViews;
            console.log('Views display updated to:', formattedViews);
        } else {
            console.error('views-count element not found!');
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    showCounter() {
        const counter = document.getElementById('views-counter');
        if (counter) {
            counter.style.display = 'block';
        }
    }

    // Funkcja do testowania - resetuje licznik
    resetViews() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.visitorKey);
        console.log('Views counter reset');
        this.updateViews();
    }
}

// Globalna funkcja do testowania licznika
window.resetViewsCounter = function() {
    localStorage.removeItem('bio_page_views');
    localStorage.removeItem('bio_visitor_id');
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const revealScreen = document.getElementById('reveal-screen');
    const mainContent = document.getElementById('main-content');
    const audioSystem = new AudioSystem();
    const viewsCounter = new ViewsCounter();


    revealScreen.addEventListener('click', function() {
        console.log("Reveal screen clicked");

        revealScreen.classList.add('hidden');
        

        setTimeout(() => {
            mainContent.classList.add('visible');
            fetchDiscordData();
            fetchServerData();
            startDataRefresh();
            audioSystem.showAudioButton();
            if (!audioSystem.isPlaying) {
                audioSystem.audio.play();
                audioSystem.isPlaying = true;
            }
        }, 500);
        

        setTimeout(() => {
            startTextAnimation();
        }, 100);
        

        setTimeout(() => {
            revealScreen.style.display = 'none';
        }, 1000);
    });


    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });


    const roles = document.querySelectorAll('.role');
    roles.forEach(role => {
        role.addEventListener('click', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    

    const badges = document.querySelectorAll('.badge');
    badges.forEach((badge, index) => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.zIndex = '10';
            this.classList.add('show-tooltip');
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.zIndex = '1';
            this.classList.remove('show-tooltip');
        });
        

        badge.style.animationDelay = `${index * 0.1}s`;
    });
    

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        setupCardTiltEffect(profileCard);
    }
    

    document.addEventListener('mousemove', function(e) {
        const orbs = document.querySelectorAll('.gradient-orb');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const moveX = (x - 0.5) * 100 * speed;
            const moveY = (y - 0.5) * 100 * speed;
            
            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    

    function typeWriter(element, text, delay = 50) {
        element.innerHTML = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, delay);
            }
        }
        type();
    }
    

    function createFloatingParticles() {
        const container = document.body;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'rgba(220, 38, 38, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '-1';
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            container.appendChild(particle);
            

            function animateParticle() {
                const newX = Math.random() * window.innerWidth;
                const newY = Math.random() * window.innerHeight;
                
                particle.style.transition = 'all 15s linear';
                particle.style.left = newX + 'px';
                particle.style.top = newY + 'px';
                particle.style.opacity = Math.random();
                
                setTimeout(animateParticle, 15000);
            }
            
            setTimeout(animateParticle, Math.random() * 1000);
        }
    }
    

    setTimeout(() => {
        if (mainContent.classList.contains('visible')) {
            createFloatingParticles();
        }
    }, 2000);
});


async function fetchDiscordData() {
    try {
        console.log('Próbuję pobrać dane z Lanyard API...');
        const response = await fetch(LANYARD_API);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Otrzymane dane z Lanyard:', data);
        
        if (data.success) {
            const user = data.data;
            console.log('Pobrano dane użytkownika:', user);
            console.log('Activities:', user.activities);
            updateDiscordProfile(user);
        } else {
            console.log('Lanyard API nie zwrócił success - używam danych domyślnych');
            updateDiscordProfile(null);
        }
    } catch (error) {
        console.error('Błąd Lanyard API - używam danych domyślnych:', error);
        updateDiscordProfile(null);
    }
}


async function fetchServerData() {
    try {

        const inviteResponse = await fetch(DISCORD_INVITE_API);
        
        if (inviteResponse.ok) {
            const inviteData = await inviteResponse.json();
            console.log('Pobrano dane z invite:', inviteData);
            updateServerInfoFromInvite(inviteData);
            return;
        }
        

        const widgetResponse = await fetch(DISCORD_WIDGET_API);
        
        if (widgetResponse.ok) {
            const widgetData = await widgetResponse.json();
            console.log('Pobrano dane z widget:', widgetData);
            updateServerInfo(widgetData);
            return;
        }
        
        console.log('Wszystkie API serwera niedostępne - używam domyślnych danych');
        updateServerInfo(null);
        
    } catch (error) {
        console.log('Błąd pobierania danych serwera:', error);
        updateServerInfo(null);
    }
}


function updateServerInfoFromInvite(inviteData) {
    const serverCard = document.querySelector('.server-card');
    const serverName = serverCard.querySelector('h3');
    const serverStats = serverCard.querySelector('p');
    const serverAvatar = serverCard.querySelector('.server-avatar');
    
    if (inviteData && inviteData.guild) {
        const guild = inviteData.guild;
        

        serverName.innerHTML = `${guild.name} <img src="https://discordresources.com/img/server/Verified.svg" class="server-verified-badge">`;
        

        const onlineCount = inviteData.approximate_presence_count || 0;
        const totalMembers = inviteData.approximate_member_count || 0;
        
        serverStats.innerHTML = `<span class="inline-status-dot online"></span> ${onlineCount} Online  <span class="inline-status-dot offline"></span> ${totalMembers} Members`;
        

        if (guild.icon) {
            const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`;
            serverAvatar.src = iconUrl;
        }
    }
}


function updateServerInfo(serverData) {
    const serverCard = document.querySelector('.server-card');
    const serverName = serverCard.querySelector('h3');
    const serverStats = serverCard.querySelector('p');
    const serverAvatar = serverCard.querySelector('.server-avatar');
    
    if (serverData && serverData.name) {

        serverName.innerHTML = `${serverData.name} <i class="fas fa-check-circle verified"></i>`;
        
        const onlineCount = serverData.presence_count || 0;
        const totalMembers = serverData.members ? serverData.members.length : 0;
        
        serverStats.innerHTML = `<span class="inline-status-dot online"></span> ${onlineCount} Online  <span class="inline-status-dot offline"></span> ${totalMembers} Members`;
        
        if (serverData.id && serverData.icon) {
            const iconUrl = `https://cdn.discordapp.com/icons/${serverData.id}/${serverData.icon}.png?size=64`;
            serverAvatar.src = iconUrl;
        }
    } else {

        serverName.innerHTML = `My Server <img src="https://discordresources.com/img/server/Verified.svg" class="server-verified-badge">`;
        serverStats.innerHTML = `<span class="inline-status-dot offline"></span> API Error  <span class="inline-status-dot offline"></span> API Error`;
    }
}


function startDataRefresh() {
    setInterval(() => {
        fetchDiscordData();
        fetchServerData();
    }, 30000);
}


function updateDiscordProfile(userData) {
    const avatar = document.getElementById('discordAvatar');
    const username = document.getElementById('discordUsername');
    
    if (userData && userData.discord_user) {

        const user = userData.discord_user;
        

        if (user.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
            avatar.src = avatarUrl;
            console.log('Ustawiam avatar:', avatarUrl);
        } else {

            const defaultAvatarNum = (parseInt(user.id) >> 22) % 6;
            avatar.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNum}.png`;
        }
        

        const displayName = user.global_name || user.display_name || user.username;
        username.textContent = displayName;
        console.log('Ustawiam nazwę użytkownika:', displayName);
        

        updateActivityDisplay(userData.activities || []);
        

        updateUserCard(userData);
    } else {

        username.textContent = 'youngdaxxs';

        avatar.src = `https://cdn.discordapp.com/avatars/1150391381752299652/9c881d4734afcd3e3a6fb537b15ddfc7.png?size=256`;
        
        updateUserCard(null);
        

        updateActivityDisplay([]);
    }
}

function getDiscordBadges(public_flags) {
    const BADGES = [
        { flag: 1 << 0, icon: 'staff', title: 'Discord Staff' },
        { flag: 1 << 1, icon: 'partner', title: 'Partner' },
        { flag: 1 << 2, icon: 'hypesquad', title: 'HypeSquad Events' },
        { flag: 1 << 3, icon: 'bug_hunter_1', title: 'Bug Hunter Level 1' },
        { flag: 1 << 6, icon: 'hypesquad_bravery', title: 'HypeSquad Bravery' },
        { flag: 1 << 7, icon: 'hypesquad_brilliance', title: 'HypeSquad Brilliance' },
        { flag: 1 << 8, icon: 'hypesquad_balance', title: 'HypeSquad Balance' },
        { flag: 1 << 9, icon: 'early_supporter', title: 'Early Supporter' },
        { flag: 1 << 14, icon: 'bug_hunter_2', title: 'Bug Hunter Level 2' },
        { flag: 1 << 16, icon: 'verified_bot_dev', title: 'Verified Bot Developer' },
        { flag: 1 << 17, icon: 'certified_moderator', title: 'Certified Moderator' },
        { flag: 1 << 22, icon: 'active_developer', title: 'Active Developer' }
    ];
const ICONS = {
    staff: '<img src="https://discordresources.com/img/staff.svg" title="Discord Staff" class="discord-badge">',
    partner: '<img src="https://discordresources.com/img/partner.svg" title="Partner" class="discord-badge">',
    hypesquad: '<img src="https://discordresources.com/img/hypesquadevents.svg" title="HypeSquad Events" class="discord-badge">',
    bug_hunter_1: '<img src="https://discordresources.com/img/bughunterlevel1.svg" title="Bug Hunter Level 1" class="discord-badge">',
    hypesquad_bravery: '<img src="https://discordresources.com/img/hypesquadbravery.svg" title="HypeSquad Bravery" class="discord-badge">',
    hypesquad_brilliance: '<img src="https://discordresources.com/img/hypesquadbrilliance.svg" title="HypeSquad Brilliance" class="discord-badge">',
    hypesquad_balance: '<img src="https://discordresources.com/img/hypesquadbalance.svg" title="HypeSquad Balance" class="discord-badge">',
    early_supporter: '<img src="https://discordresources.com/img/earlysupporter.svg" title="Early Supporter" class="discord-badge">',
    bug_hunter_2: '<img src="https://discordresources.com/img/bughunterlevel2.svg" title="Bug Hunter Level 2" class="discord-badge">',
    verified_bot_dev: '<img src="https://discordresources.com/img/verifiedbotdeveloper.svg" title="Verified Bot Developer" class="discord-badge">',
    certified_moderator: '<img src="https://discordresources.com/img/certifiedmoderator.svg" title="Certified Moderator" class="discord-badge">',
    active_developer: '<img src="https://discordresources.com/img/activedeveloper.svg" title="Active Developer" class="discord-badge">',
    nitro: '<img src="https://discordresources.com/img/nitro.svg" title="Nitro" class="discord-badge">',
    boosting: '<img src="https://discordresources.com/img/serverbooster.svg" title="Server Booster" class="discord-badge">',
    bot: '<img src="https://discordresources.com/img/bot.svg" title="Bot" class="discord-badge">',
    system: '<img src="https://discordresources.com/img/system.svg" title="System" class="discord-badge">',
    developer: '<img src="https://discordresources.com/img/developer.svg" title="Developer" class="discord-badge">',
    moderator: '<img src="https://discordresources.com/img/moderator.svg" title="Moderator" class="discord-badge">',
    bug_hunter: '<img src="https://discordresources.com/img/bughunter.svg" title="Bug Hunter" class="discord-badge">',
    hypesquad_house_1: '<img src="https://discordresources.com/img/hypesquadbravery.svg" title="HypeSquad Bravery" class="discord-badge">',
    hypesquad_house_2: '<img src="https://discordresources.com/img/hypesquadbrilliance.svg" title="HypeSquad Brilliance" class="discord-badge">',
    hypesquad_house_3: '<img src="https://discordresources.com/img/hypesquadbalance.svg" title="HypeSquad Balance" class="discord-badge">'
};
    let badges = [];
    BADGES.forEach(badge => {
        if ((public_flags & badge.flag) === badge.flag && ICONS[badge.icon]) {
            badges.push(ICONS[badge.icon]);
        }
    });
    return badges.join('');
}


function updateUserCard(userData) {
    const userCardAvatar = document.getElementById('userCardAvatar');
    const userCardName = document.getElementById('userCardName');
    const userCardStatus = document.getElementById('userCardStatus');
    const userCardBadge = document.getElementById('userCardBadge');
    


    if (userData && userData.discord_user) {
        const user = userData.discord_user;

        console.log('LANYARD activities:', userData.activities);


        if (user.avatar) {
            userCardAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        }


        let tag = "";
        if (user.global_name) {
            tag = user.global_name;
        } else if (user.username && user.discriminator && user.discriminator !== "0") {
            tag = `${user.username}#${user.discriminator}`;
        } else {
            tag = user.username;
        }

        userCardName.innerHTML = `
            ${tag}
            <span class="verified-badges" style="margin-left:1px;">
                ${getDiscordBadges(user.public_flags)}
            </span>
        `;


        let customStatus = null;
        if (userData.activities && Array.isArray(userData.activities)) {
            customStatus = userData.activities.find(act => act.type === 4);
        }

        console.log('customStatus:', customStatus);

        if (customStatus && customStatus.state) {
            const emoji = customStatus.emoji
                ? (customStatus.emoji.id
                    ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" alt="" style="width:1.2em;height:1.2em;vertical-align:-0.2em;margin-right:0.3em;">`
                    : customStatus.emoji.name + ' ')
                : '';
            userCardStatus.innerHTML = `${emoji}<span style="color:#ffffff;">${customStatus.state}</span>`;
        } else {
            userCardStatus.innerHTML = `<span style="color:#888;">Brak statusu</span>`;
        }


        userCardBadge.innerHTML = `<span><i class="fas fa-bolt"></i> FK</span>`;
    } else {

        userCardAvatar.src = `https://cdn.discordapp.com/avatars/1150391381752299652/9c881d4734afcd3e3a6fb537b15ddfc7.png?size=128`;
        userCardName.innerHTML = `𝕯𝖆𝖝𝖝𝖘𝖊 <span class="verified-badges" style="margin-left:1px;">
            <i class="fas fa-check-circle"></i>
            <i class="fas fa-crown"></i>
            <i class="fas fa-star"></i>
        </span>`;
        userCardStatus.innerHTML = `<span style="color:#888;">Brak statusu</span>`;
        userCardBadge.innerHTML = `<span><i class="fas fa-bolt"></i> FK</span>`;
    }
}


function updateActivityDisplay(activities) {
    const activityDisplay = document.getElementById('activity-display');
    if (!activityDisplay) return;
    

    const gaming = activities.find(activity => activity.type === 0);
    const listening = activities.find(activity => activity.type === 2 && activity.name === 'Spotify');
    
    let activityText = '';
    
    if (gaming) {
        activityText = `Gra w ${gaming.name}`;
    } else if (listening) {
        activityText = `Słucham ${listening.details || 'muzyki'} na Spotify`;
    } else {
        activityText = '';
    }
    

    if (activityText) {
        activityDisplay.textContent = activityText;
        activityDisplay.style.display = 'block';
        

        setupActivityHoverEffects(activityDisplay);
    } else {
        activityDisplay.style.display = 'none';
    }
}


function setupCardTiltEffect(card) {
    let isHovering = false;
    
    card.addEventListener('mouseenter', function() {
        isHovering = true;
        // Usuń transition na czas hover dla płynności
        card.style.transition = 'box-shadow 0.3s ease';
    });
    
    card.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Oblicz pozycję myszy względem środka karty
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        
        // Ograniczenie wartości do zakresu -1 do 1
        const clampedX = Math.max(-1, Math.min(1, deltaX));
        const clampedY = Math.max(-1, Math.min(1, deltaY));
        
        // Oblicz kąty obrotu (maksymalnie ±15 stopni)
        const rotateX = clampedY * -15;
        const rotateY = clampedX * 15;
        
        // Zastosuj transformację z lekkim powiększeniem
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.03, 1.03, 1.03)
        `;
        
        // Dodaj subtelny efekt świecenia
        card.style.boxShadow = `
            0 25px 50px rgba(220, 38, 38, 0.25),
            0 0 40px rgba(220, 38, 38, 0.15)
        `;
    });
    
    card.addEventListener('mouseleave', function() {
        isHovering = false;
        // Przywróć transition dla smooth powrotu
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Reset do normalnego stanu
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = 'none';
    });
}

// Smooth animacje hover dla aktywności
function setupActivityHoverEffects(element) {
    // Usuń poprzednie event listenery jeśli istnieją
    element.removeEventListener('mousemove', element._mouseMoveHandler);
    element.removeEventListener('mouseleave', element._mouseLeaveHandler);
    
    // Funkcja obsługująca ruch myszy
    element._mouseMoveHandler = function(e) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Oblicz odległość od środka elementu
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        // Oblicz kąt obrotu (maksymalnie ±15 stopni)
        const rotateX = deltaY * -15;
        const rotateY = deltaX * 15;
        
        // Zastosuj transformację
        element.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    // Funkcja resetująca po opuszczeniu elementu
    element._mouseLeaveHandler = function() {
        element.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    };
    
    // Dodaj event listenery
    element.addEventListener('mousemove', element._mouseMoveHandler);
    element.addEventListener('mouseleave', element._mouseLeaveHandler);
}

// Animacja tekstów w górnym lewym rogu
function startTextAnimation() {
    const animatedTexts = document.querySelector('.animated-texts');
    const slides = document.querySelectorAll('.slide-text');
    let currentSlide = 0;
    
    console.log('Uruchamiam animację tekstów', slides.length);
    
    if (!animatedTexts || slides.length === 0) {
        console.log('Nie znaleziono elementów do animacji');
        return;
    }
    
    // Wymuś pokazanie animowanych tekstów
    console.log('WYMUSZAM pokazanie animowanych tekstów!');
    animatedTexts.style.cssText = 'position: fixed !important; top: 30px !important; left: 30px !important; z-index: 1001 !important; opacity: 1 !important; visibility: visible !important; display: block !important;';
    animatedTexts.classList.add('visible');
    
    // Wymuś reset wszystkich slajdów
    slides.forEach((slide, index) => {
        slide.style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; display: block !important; opacity: 0 !important; transform: translateY(20px) !important;';
        slide.classList.remove('active', 'exit');
        console.log(`SLIDE ${index}:`, slide.textContent);
    });
    
    // Wymuś pokazanie pierwszego slajdu
    if (slides[0]) {
        slides[0].style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; display: block !important; opacity: 1 !important; transform: translateY(0) !important;';
        slides[0].classList.add('active');
        console.log('PIERWSZY SLIDE AKTYWNY:', slides[0].textContent);
    }
    
    function nextSlide() {
        console.log('ZMIANA SLAJDU:', currentSlide, '->', (currentSlide + 1) % slides.length);
        
        // Ukryj obecny slajd
        if (slides[currentSlide]) {
            slides[currentSlide].style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; display: block !important; opacity: 0 !important; transform: translateY(-20px) !important;';
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].classList.add('exit');
        }
        
        // Przejdź do następnego slajdu
        currentSlide = (currentSlide + 1) % slides.length;
        
        setTimeout(() => {
            // Usuń klasę exit i pokaż nowy slajd
            slides.forEach(slide => slide.classList.remove('exit'));
            
            if (slides[currentSlide]) {
                slides[currentSlide].style.cssText = 'position: absolute !important; top: 0 !important; left: 0 !important; display: block !important; opacity: 1 !important; transform: translateY(0) !important;';
                slides[currentSlide].classList.add('active');
                console.log('NOWY AKTYWNY SLIDE:', slides[currentSlide].textContent);
            }
        }, 400);
    }
    
    // Zmiana slajdu co 3 sekundy
    setInterval(nextSlide, 3000);
}

// Odświeżanie danych Discord co 30 sekund
setInterval(() => {
    if (document.getElementById('main-content').classList.contains('visible')) {
        fetchDiscordData();
    }
}, 30000);

// Funkcje pomocnicze dla animacji
function addGlowEffect(element, color = 'rgba(220, 38, 38, 0.5)') {
    element.addEventListener('mouseenter', function() {
        this.style.boxShadow = `0 0 20px ${color}`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
}

// Dodanie efektów glow do wszystkich interaktywnych elementów
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const interactiveElements = document.querySelectorAll('.social-link, .badge, .join-btn');
        interactiveElements.forEach(element => {
            addGlowEffect(element);
        });
    }, 1500);
});
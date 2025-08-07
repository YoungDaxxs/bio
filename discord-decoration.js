class DiscordProfileDecoration {
    constructor(targetElement) {
        this.targetElement = targetElement;
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {

        this.canvas = document.createElement('canvas');
        this.canvas.width = 200;
        this.canvas.height = 200;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '40%';
        this.canvas.style.left = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.ctx = this.canvas.getContext('2d');
        
        const decorationContainer = document.createElement('div');
        decorationContainer.style.position = 'relative';
        decorationContainer.style.display = 'inline-block';
        

        const parent = this.targetElement.parentNode;
        parent.insertBefore(decorationContainer, this.targetElement);
        decorationContainer.appendChild(this.canvas);
        decorationContainer.appendChild(this.targetElement);
        

        this.targetElement.style.position = 'relative';
        this.targetElement.style.zIndex = '2';
        

        this.animate();
    }
    
    drawDecoration() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 25;
        

        for (let ring = 0; ring < 3; ring++) {
            const ringRadius = radius + (ring * 8) + Math.sin(this.time * 0.8 + ring) * 3;
            const opacity = 0.6 - (ring * 0.15);
            

            const colorPhase = this.time + ring * 2;
            const red1 = Math.floor(255 * (0.5 + 0.5 * Math.sin(colorPhase)));
            const green1 = Math.floor(100 * (0.3 + 0.3 * Math.sin(colorPhase + 1)));
            const blue1 = Math.floor(50 * (0.2 + 0.2 * Math.sin(colorPhase + 2)));
            
            const red2 = Math.floor(200 * (0.6 + 0.4 * Math.sin(colorPhase + 1.5)));
            const green2 = Math.floor(50 * (0.2 + 0.3 * Math.sin(colorPhase + 2.5)));
            const blue2 = Math.floor(80 * (0.3 + 0.2 * Math.sin(colorPhase + 3)));
            

            const gradient = this.ctx.createRadialGradient(
                centerX, centerY, ringRadius - 2,
                centerX, centerY, ringRadius + 4
            );
            
            gradient.addColorStop(0, `rgba(${red1}, ${green1}, ${blue1}, 0)`);
            gradient.addColorStop(0.3, `rgba(${red1}, ${green1}, ${blue1}, ${opacity * 0.8})`);
            gradient.addColorStop(0.6, `rgba(${red2}, ${green2}, ${blue2}, ${opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${opacity * 0.3})`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, ringRadius + 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.time * 0.3;
            const particleRadius = radius + 15 + Math.sin(this.time * 1.2 + i) * 8;
            const x = centerX + Math.cos(angle) * particleRadius;
            const y = centerY + Math.sin(angle) * particleRadius;
            

            const particlePhase = this.time * 2 + i * 0.5;
            const red = Math.floor(255 * (0.6 + 0.4 * Math.sin(particlePhase)));
            const green = Math.floor(150 * (0.3 + 0.7 * Math.sin(particlePhase + 1)));
            const blue = Math.floor(100 * (0.2 + 0.8 * Math.sin(particlePhase + 2)));
            

            const particleGradient = this.ctx.createRadialGradient(x, y, 0, x, y, 6);
            particleGradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${0.8 + Math.sin(this.time * 2 + i) * 0.2})`);
            particleGradient.addColorStop(0.5, `rgba(${Math.floor(red * 0.8)}, ${Math.floor(green * 0.6)}, ${Math.floor(blue * 0.4)}, 0.6)`);
            particleGradient.addColorStop(1, `rgba(${Math.floor(red * 0.4)}, ${Math.floor(green * 0.2)}, ${Math.floor(blue * 0.1)}, 0)`);
            
            this.ctx.fillStyle = particleGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3 + Math.sin(this.time * 3 + i) * 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        

        const shimmerGradient = this.ctx.createRadialGradient(
            centerX, centerY, radius - 5,
            centerX, centerY, radius + 2
        );
        
        const shimmerIntensity = 0.4 + Math.sin(this.time * 1.5) * 0.3;
        const borderPhase = this.time * 1.2;
        const borderRed = Math.floor(255 * (0.7 + 0.3 * Math.sin(borderPhase)));
        const borderGreen = Math.floor(200 * (0.4 + 0.6 * Math.sin(borderPhase + 1)));
        const borderBlue = Math.floor(150 * (0.3 + 0.7 * Math.sin(borderPhase + 2)));
        
        shimmerGradient.addColorStop(0, `rgba(${borderRed}, ${borderGreen}, ${borderBlue}, 0)`);
        shimmerGradient.addColorStop(0.7, `rgba(${borderRed}, ${Math.floor(borderGreen * 0.7)}, ${Math.floor(borderBlue * 0.5)}, ${shimmerIntensity})`);
        shimmerGradient.addColorStop(1, `rgba(${Math.floor(borderRed * 0.6)}, ${Math.floor(borderGreen * 0.3)}, ${Math.floor(borderBlue * 0.2)}, ${shimmerIntensity * 0.5})`);
        
        this.ctx.strokeStyle = shimmerGradient;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    animate() {
        this.drawDecoration();
        this.time += 0.02;
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}


function addDiscordDecoration(selector) {
    const element = document.querySelector(selector);
    if (element) {
        return new DiscordProfileDecoration(element);
    } else {
        console.error('Element nie został znaleziony:', selector);
        return null;
    }
}


document.addEventListener('DOMContentLoaded', function() {

    setTimeout(() => {
        addDiscordDecoration('.profile-avatar');
    }, 1000);
});
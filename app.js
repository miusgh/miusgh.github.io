// 虚拟逗猫棒应用主文件
class CatTeaserApp {
    constructor() {
        this.currentScreen = 'welcome';
        this.hands = null;
        this.camera = null;
        this.canvas = null;
        this.ctx = null;
        this.video = null;
        this.isRunning = false;
        this.handDetected = false;
        this.lastHandPosition = null;
        
        // 逗猫棒物理参数



        
        this.teaserLength = 200;
        this.segmentCount = 20;
        this.segmentLength = this.teaserLength / this.segmentCount;
        this.segments = [];
        this.gravity = 0.2; // 减少重力
        this.damping = 0.98; // 增加阻尼，减少摆动
        this.stiffness = 0.3; // 增加刚度，更直接跟随
        
        // 逗猫棒样式系统
        this.currentStyle = 0;
        this.teaserStyles = [
            {
                name: "经典逗猫棒",
                color: "#ff6b6b",
                lineWidth: 4,
                shadowBlur: 15,
                endRadius: 10,
                endColor: "#ff6b6b",
                endInnerColor: "#ffffff",
                pattern: "solid"
            },
            {
                name: "彩虹逗猫棒",
                color: "#ff6b6b",
                lineWidth: 5,
                shadowBlur: 20,
                endRadius: 12,
                endColor: "#ff6b6b",
                endInnerColor: "#ffffff",
                pattern: "rainbow"
            },
            {
                name: "激光逗猫棒",
                color: "#00ffff",
                lineWidth: 3,
                shadowBlur: 25,
                endRadius: 8,
                endColor: "#00ffff",
                endInnerColor: "#ffffff",
                pattern: "laser"
            },
            {
                name: "火焰逗猫棒",
                color: "#ff4500",
                lineWidth: 6,
                shadowBlur: 30,
                endRadius: 15,
                endColor: "#ff4500",
                endInnerColor: "#ffff00",
                pattern: "fire"
            },
            {
                name: "星光逗猫棒",
                color: "#9370db",
                lineWidth: 4,
                shadowBlur: 18,
                endRadius: 10,
                endColor: "#9370db",
                endInnerColor: "#ffffff",
                pattern: "sparkle"
            },
            {
                name: "闪电逗猫棒",
                color: "#ffff00",
                lineWidth: 4,
                shadowBlur: 22,
                endRadius: 10,
                endColor: "#ffff00",
                endInnerColor: "#ffffff",
                pattern: "lightning"
            },
            {
                name: "魔法棒",
                color: "#ff69b4",
                lineWidth: 3,
                shadowBlur: 20,
                endRadius: 12,
                endColor: "#ff69b4",
                endInnerColor: "#ffffff",
                pattern: "magic"
            },
            {
                name: "蝴蝶逗猫棒",
                color: "#ff1493",
                lineWidth: 4,
                shadowBlur: 16,
                endRadius: 8,
                endColor: "#ff1493",
                endInnerColor: "#ffffff",
                pattern: "butterfly"
            },
            {
                name: "泡泡逗猫棒",
                color: "#87ceeb",
                lineWidth: 3,
                shadowBlur: 12,
                endRadius: 6,
                endColor: "#87ceeb",
                endInnerColor: "#ffffff",
                pattern: "bubble"
            },
            {
                name: "音符逗猫棒",
                color: "#32cd32",
                lineWidth: 4,
                shadowBlur: 18,
                endRadius: 10,
                endColor: "#32cd32",
                endInnerColor: "#ffffff",
                pattern: "music"
            },
            {
                name: "雪花逗猫棒",
                color: "#b0e0e6",
                lineWidth: 3,
                shadowBlur: 15,
                endRadius: 8,
                endColor: "#b0e0e6",
                endInnerColor: "#ffffff",
                pattern: "snowflake"
            },
            {
                name: "烟花逗猫棒",
                color: "#ff6347",
                lineWidth: 5,
                shadowBlur: 25,
                endRadius: 14,
                endColor: "#ff6347",
                endInnerColor: "#ffff00",
                pattern: "firework"
            },
            {
                name: "彩虹独角兽",
                color: "#ff69b4",
                lineWidth: 6,
                shadowBlur: 30,
                endRadius: 16,
                endColor: "#ff69b4",
                endInnerColor: "#ffffff",
                pattern: "unicorn"
            },
            {
                name: "极光逗猫棒",
                color: "#00ff7f",
                lineWidth: 4,
                shadowBlur: 28,
                endRadius: 11,
                endColor: "#00ff7f",
                endInnerColor: "#ffffff",
                pattern: "aurora"
            },
            {
                name: "水晶逗猫棒",
                color: "#e6e6fa",
                lineWidth: 3,
                shadowBlur: 20,
                endRadius: 9,
                endColor: "#e6e6fa",
                endInnerColor: "#ffffff",
                pattern: "crystal"
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeHands();
        this.updateStyleDisplay();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.requestCameraPermission();
        });

        document.getElementById('retry-permission').addEventListener('click', () => {
            this.requestCameraPermission();
        });

        document.getElementById('back-to-welcome').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        document.getElementById('error-back-btn').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });

        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // 添加样式切换按钮事件
        document.getElementById('prev-style-btn').addEventListener('click', () => {
            this.prevStyle();
        });

        document.getElementById('next-style-btn').addEventListener('click', () => {
            this.nextStyle();
        });

        // 添加双击屏幕随机切换样式
        let lastClickTime = 0;
        document.getElementById('game-screen').addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClickTime;
            
            if (timeDiff < 300 && timeDiff > 0) {
                // 双击事件
                e.preventDefault();
                this.randomStyle();
            }
            lastClickTime = currentTime;
        });

        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'game') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prevStyle();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextStyle();
                        break;
                    case 'r':
                    case 'R':
                        e.preventDefault();
                        this.randomStyle();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.randomStyle();
                        break;
                }
            }
        });
    }

    async initializeHands() {
        try {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults((results) => {
                this.onHandResults(results);
            });

        } catch (error) {
            console.error('初始化手部识别失败:', error);
            this.showError('手部识别模型加载失败，请刷新页面重试');
        }
    }

    async requestCameraPermission() {
        try {
            this.showScreen('loading');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });

            this.video = document.getElementById('video');
            this.video.srcObject = stream;
            
            await new Promise((resolve) => {
                this.video.onloadedmetadata = resolve;
            });

            this.setupCanvas();
            this.startHandTracking();
            this.showScreen('game');
            this.startGameLoop();

        } catch (error) {
            console.error('摄像头访问失败:', error);
            if (error.name === 'NotAllowedError') {
                this.showScreen('permission');
            } else {
                this.showError('摄像头访问失败，请检查设备权限设置');
            }
        }
    }

    setupCanvas() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            console.log('画布尺寸:', this.canvas.width, 'x', this.canvas.height);
            this.initializeTeaserSegments();
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    initializeTeaserSegments() {
        this.segments = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: centerX,
                y: centerY + i * this.segmentLength,
                vx: 0,
                vy: 0,
                targetX: centerX,
                targetY: centerY + i * this.segmentLength
            });
        }
        
        console.log('初始化逗猫棒段:', this.segments.length, '段');
    }

    startHandTracking() {
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                if (this.hands) {
                    await this.hands.send({ image: this.video });
                }
            },
            width: 1280,
            height: 720
        });
        
        this.camera.start();
    }

    onHandResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const indexFinger = landmarks[8];
            const x = indexFinger.x * this.canvas.width;
            const y = indexFinger.y * this.canvas.height;
            
            this.handDetected = true;
            this.lastHandPosition = { x, y };
            this.updateHandStatus(`手部已识别 ✋ (${Math.round(x)}, ${Math.round(y)})`);
            
            // 调试信息
            console.log('手部位置:', x, y, '段数:', this.segments.length);
            
        } else {
            this.handDetected = false;
            this.updateHandStatus('等待手部... ✋');
        }
    }

    updateHandStatus(text) {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = text;
        }
    }

    startGameLoop() {
        this.isRunning = true;
        console.log('游戏循环启动');
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.updateTeaserPhysics();
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }

    updateTeaserPhysics() {
        if (!this.handDetected || !this.lastHandPosition) return;

        const handX = this.lastHandPosition.x;
        const handY = this.lastHandPosition.y;

        // 第一段直接跟随手指
        this.segments[0].x = handX;
        this.segments[0].y = handY;
        this.segments[0].vx = 0;
        this.segments[0].vy = 0;

        // 其他段更直接地跟随前一段
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const prevSegment = this.segments[i - 1];

            // 计算理想位置（保持段长度）
            const dx = segment.x - prevSegment.x;
            const dy = segment.y - prevSegment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let targetX, targetY;
            if (distance > 0) {
                targetX = prevSegment.x + (dx / distance) * this.segmentLength;
                targetY = prevSegment.y + (dy / distance) * this.segmentLength;
            } else {
                targetX = prevSegment.x;
                targetY = prevSegment.y + this.segmentLength;
            }
            
            // 更直接的跟随，减少摆动
            const moveX = (targetX - segment.x) * this.stiffness;
            const moveY = (targetY - segment.y) * this.stiffness;
            
            segment.x += moveX;
            segment.y += moveY;
            
            // 添加轻微的重力效果
            segment.y += this.gravity;
            
            // 重置速度，减少摆动
            segment.vx = 0;
            segment.vy = 0;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.handDetected && this.segments.length > 0) {
            this.drawTeaserStick();
            // 绘制手部位置点
            this.ctx.fillStyle = '#00ff00';
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(this.lastHandPosition.x, this.lastHandPosition.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加边框
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    drawTeaserStick() {
        this.ctx.save();
        
        const style = this.teaserStyles[this.currentStyle];
        
        // 绘制逗猫棒线条
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // 根据样式绘制不同的效果
        switch (style.pattern) {
            case 'rainbow':
                this.drawRainbowTeaser(style);
                break;
            case 'laser':
                this.drawLaserTeaser(style);
                break;
            case 'fire':
                this.drawFireTeaser(style);
                break;
            case 'sparkle':
                this.drawSparkleTeaser(style);
                break;
            case 'lightning':
                this.drawLightningTeaser(style);
                break;
            case 'magic':
                this.drawMagicTeaser(style);
                break;
            case 'butterfly':
                this.drawButterflyTeaser(style);
                break;
            case 'bubble':
                this.drawBubbleTeaser(style);
                break;
            case 'music':
                this.drawMusicTeaser(style);
                break;
            case 'snowflake':
                this.drawSnowflakeTeaser(style);
                break;
            case 'firework':
                this.drawFireworkTeaser(style);
                break;
            case 'unicorn':
                this.drawUnicornTeaser(style);
                break;
            case 'aurora':
                this.drawAuroraTeaser(style);
                break;
            case 'crystal':
                this.drawCrystalTeaser(style);
                break;
            default:
                this.drawSolidTeaser(style);
        }
        
        this.ctx.restore();
    }

    drawSolidTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        this.drawTeaserEnd(style);
    }

    drawRainbowTeaser(style) {
        const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
        
        for (let i = 0; i < this.segments.length - 1; i++) {
            const color = colors[i % colors.length];
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = style.lineWidth;
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = style.shadowBlur;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.segments[i].x, this.segments[i].y);
            this.ctx.lineTo(this.segments[i + 1].x, this.segments[i + 1].y);
            this.ctx.stroke();
        }
        
        this.drawTeaserEnd(style);
    }

    drawLaserTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制激光束
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加激光脉冲效果
        const time = Date.now() * 0.01;
        this.ctx.shadowBlur = style.shadowBlur + Math.sin(time) * 10;
        this.ctx.stroke();
        
        this.drawTeaserEnd(style);
    }

    drawFireTeaser(style) {
        const colors = ['#ff4500', '#ff6347', '#ff7f50', '#ff8c00'];
        
        for (let i = 0; i < this.segments.length - 1; i++) {
            const color = colors[i % colors.length];
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = style.lineWidth - (i * 0.1);
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = style.shadowBlur;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.segments[i].x, this.segments[i].y);
            this.ctx.lineTo(this.segments[i + 1].x, this.segments[i + 1].y);
            this.ctx.stroke();
        }
        
        this.drawTeaserEnd(style);
    }

    drawSparkleTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加星光效果
        const time = Date.now() * 0.005;
        for (let i = 0; i < this.segments.length; i += 3) {
            const segment = this.segments[i];
            const sparkleSize = 2 + Math.sin(time + i) * 2;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, sparkleSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    drawLightningTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制闪电效果
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const prevSegment = this.segments[i - 1];
            
            // 添加闪电的锯齿效果
            const midX = (prevSegment.x + segment.x) / 2 + (Math.random() - 0.5) * 10;
            const midY = (prevSegment.y + segment.y) / 2 + (Math.random() - 0.5) * 10;
            
            this.ctx.lineTo(midX, midY);
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        this.drawTeaserEnd(style);
    }

    drawTeaserEnd(style) {
        if (this.segments.length > 0) {
            const lastSegment = this.segments[this.segments.length - 1];
            
            // 绘制外圈
            this.ctx.fillStyle = style.endColor;
            this.ctx.shadowBlur = style.shadowBlur + 5;
            this.ctx.beginPath();
            this.ctx.arc(lastSegment.x, lastSegment.y, style.endRadius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制内圈
            this.ctx.fillStyle = style.endInnerColor;
            this.ctx.beginPath();
            this.ctx.arc(lastSegment.x, lastSegment.y, style.endRadius * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // 魔法棒效果
    drawMagicTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制魔法棒主体
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加魔法星星效果
        const time = Date.now() * 0.003;
        for (let i = 0; i < this.segments.length; i += 2) {
            const segment = this.segments[i];
            const starSize = 3 + Math.sin(time + i) * 2;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.moveTo(segment.x, segment.y - starSize);
            this.ctx.lineTo(segment.x + starSize * 0.5, segment.y - starSize * 0.5);
            this.ctx.lineTo(segment.x + starSize, segment.y);
            this.ctx.lineTo(segment.x + starSize * 0.5, segment.y + starSize * 0.5);
            this.ctx.lineTo(segment.x, segment.y + starSize);
            this.ctx.lineTo(segment.x - starSize * 0.5, segment.y + starSize * 0.5);
            this.ctx.lineTo(segment.x - starSize, segment.y);
            this.ctx.lineTo(segment.x - starSize * 0.5, segment.y - starSize * 0.5);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    // 蝴蝶效果
    drawButterflyTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制蝴蝶身体
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加蝴蝶翅膀效果
        const time = Date.now() * 0.005;
        for (let i = 0; i < this.segments.length; i += 3) {
            const segment = this.segments[i];
            const wingSize = 8 + Math.sin(time + i) * 4;
            
            // 左翅膀
            this.ctx.fillStyle = '#ff69b4';
            this.ctx.beginPath();
            this.ctx.ellipse(segment.x - wingSize, segment.y, wingSize, wingSize * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 右翅膀
            this.ctx.beginPath();
            this.ctx.ellipse(segment.x + wingSize, segment.y, wingSize, wingSize * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    // 泡泡效果
    drawBubbleTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制泡泡串
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加泡泡效果
        const time = Date.now() * 0.002;
        for (let i = 0; i < this.segments.length; i += 2) {
            const segment = this.segments[i];
            const bubbleSize = 6 + Math.sin(time + i) * 3;
            
            // 泡泡外圈
            this.ctx.strokeStyle = '#87ceeb';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, bubbleSize, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // 泡泡高光
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(segment.x - bubbleSize * 0.3, segment.y - bubbleSize * 0.3, bubbleSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    // 音符效果
    drawMusicTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制音符串
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加音符效果
        const time = Date.now() * 0.004;
        for (let i = 0; i < this.segments.length; i += 4) {
            const segment = this.segments[i];
            const noteSize = 5 + Math.sin(time + i) * 2;
            
            this.ctx.fillStyle = '#32cd32';
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, noteSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 音符尾巴
            this.ctx.strokeStyle = '#32cd32';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(segment.x + noteSize, segment.y);
            this.ctx.lineTo(segment.x + noteSize, segment.y - noteSize * 2);
            this.ctx.stroke();
        }
        
        this.drawTeaserEnd(style);
    }

    // 雪花效果
    drawSnowflakeTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制雪花串
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加雪花效果
        const time = Date.now() * 0.003;
        for (let i = 0; i < this.segments.length; i += 3) {
            const segment = this.segments[i];
            const snowSize = 4 + Math.sin(time + i) * 2;
            
            this.ctx.strokeStyle = '#b0e0e6';
            this.ctx.lineWidth = 1;
            
            // 绘制雪花
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI) / 3;
                this.ctx.beginPath();
                this.ctx.moveTo(segment.x, segment.y);
                this.ctx.lineTo(
                    segment.x + Math.cos(angle) * snowSize,
                    segment.y + Math.sin(angle) * snowSize
                );
                this.ctx.stroke();
            }
        }
        
        this.drawTeaserEnd(style);
    }

    // 烟花效果
    drawFireworkTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制烟花串
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加烟花爆炸效果
        const time = Date.now() * 0.006;
        for (let i = 0; i < this.segments.length; i += 2) {
            const segment = this.segments[i];
            const fireworkSize = 8 + Math.sin(time + i) * 4;
            
            const colors = ['#ff6347', '#ff4500', '#ff8c00', '#ffff00'];
            for (let j = 0; j < 8; j++) {
                const angle = (j * Math.PI) / 4;
                const color = colors[j % colors.length];
                
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(segment.x, segment.y);
                this.ctx.lineTo(
                    segment.x + Math.cos(angle) * fireworkSize,
                    segment.y + Math.sin(angle) * fireworkSize
                );
                this.ctx.stroke();
            }
        }
        
        this.drawTeaserEnd(style);
    }

    // 彩虹独角兽效果
    drawUnicornTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制独角兽身体
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加彩虹鬃毛效果
        const time = Date.now() * 0.004;
        const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
        
        for (let i = 0; i < this.segments.length; i += 2) {
            const segment = this.segments[i];
            const maneSize = 6 + Math.sin(time + i) * 3;
            const color = rainbowColors[i % rainbowColors.length];
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, maneSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    // 极光效果
    drawAuroraTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制极光主体
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加极光波纹效果
        const time = Date.now() * 0.002;
        const auroraColors = ['#00ff7f', '#00ffff', '#0080ff', '#8000ff'];
        
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const waveSize = 3 + Math.sin(time + i * 0.5) * 2;
            const color = auroraColors[i % auroraColors.length];
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, waveSize, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
        this.drawTeaserEnd(style);
    }

    // 水晶效果
    drawCrystalTeaser(style) {
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.lineWidth;
        this.ctx.shadowColor = style.color;
        this.ctx.shadowBlur = style.shadowBlur;
        
        // 绘制水晶主体
        this.ctx.beginPath();
        this.ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.ctx.lineTo(segment.x, segment.y);
        }
        
        this.ctx.stroke();
        
        // 添加水晶折射效果
        const time = Date.now() * 0.003;
        for (let i = 0; i < this.segments.length; i += 2) {
            const segment = this.segments[i];
            const crystalSize = 5 + Math.sin(time + i) * 2;
            
            // 水晶面
            this.ctx.fillStyle = 'rgba(230, 230, 250, 0.8)';
            this.ctx.beginPath();
            this.ctx.moveTo(segment.x, segment.y - crystalSize);
            this.ctx.lineTo(segment.x + crystalSize * 0.5, segment.y);
            this.ctx.lineTo(segment.x, segment.y + crystalSize);
            this.ctx.lineTo(segment.x - crystalSize * 0.5, segment.y);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 水晶高光
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.beginPath();
            this.ctx.arc(segment.x - crystalSize * 0.2, segment.y - crystalSize * 0.2, crystalSize * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.drawTeaserEnd(style);
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        this.showScreen('error');
    }

    restart() {
        this.isRunning = false;
        if (this.camera) {
            this.camera.stop();
        }
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
        this.showScreen('welcome');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    nextStyle() {
        this.currentStyle = (this.currentStyle + 1) % this.teaserStyles.length;
        this.updateStyleDisplay();
        console.log('切换到样式:', this.teaserStyles[this.currentStyle].name);
    }

    prevStyle() {
        this.currentStyle = (this.currentStyle - 1 + this.teaserStyles.length) % this.teaserStyles.length;
        this.updateStyleDisplay();
    }

    randomStyle() {
        let newStyle;
        do {
            newStyle = Math.floor(Math.random() * this.teaserStyles.length);
        } while (newStyle === this.currentStyle && this.teaserStyles.length > 1);
        
        this.currentStyle = newStyle;
        this.updateStyleDisplay();
    }

    updateStyleDisplay() {
        const styleName = document.getElementById('style-name');
        const styleNumber = document.getElementById('style-number');
        const styleIndicator = document.getElementById('style-indicator');
        const styleTransition = document.getElementById('style-transition');
        const transitionText = document.getElementById('transition-text');
        const styleChangeEffect = document.getElementById('style-change-effect');
        
        if (styleName) {
            styleName.textContent = this.teaserStyles[this.currentStyle].name;
        }
        
        if (styleNumber) {
            styleNumber.textContent = `${this.currentStyle + 1} / ${this.teaserStyles.length}`;
        }
        
        // 显示样式切换指示器
        if (styleIndicator) {
            styleIndicator.classList.add('show');
            setTimeout(() => {
                styleIndicator.classList.remove('show');
            }, 2000);
        }
        
        // 显示样式切换动画
        if (styleTransition && transitionText) {
            transitionText.textContent = this.teaserStyles[this.currentStyle].name;
            styleTransition.classList.add('show');
            
            setTimeout(() => {
                styleTransition.classList.add('hide');
                setTimeout(() => {
                    styleTransition.classList.remove('show', 'hide');
                }, 500);
            }, 1000);
        }
        
        // 显示样式切换特效
        if (styleChangeEffect) {
            styleChangeEffect.classList.add('show');
            setTimeout(() => {
                styleChangeEffect.classList.remove('show');
            }, 500);
        }
        
        console.log('切换到样式:', this.teaserStyles[this.currentStyle].name);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CatTeaserApp();
});

window.addEventListener('error', (event) => {
    console.error('应用错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});

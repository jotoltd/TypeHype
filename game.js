(() => {
    'use strict';

    const WORDS = {
        kids: ['cat', 'dog', 'sun', 'hat', 'run', 'big', 'red', 'box', 'fox', 'bug', 'cup', 'bed', 'pen', 'top', 'map', 'egg', 'pig', 'ant', 'boy', 'girl', 'fish', 'duck', 'frog', 'lamp', 'tree', 'star', 'moon', 'ball', 'kite', 'book', 'apple', 'bear', 'bird', 'milk', 'shoe', 'sock', 'hand', 'foot', 'nose', 'smile', 'jump', 'play', 'swim', 'blue', 'pink', 'green'],
        easy: ['jump', 'type', 'code', 'wave', 'neon', 'rush', 'flux', 'byte', 'glow', 'dash', 'apex', 'nova', 'void', 'zone', 'sync', 'beam', 'core', 'grid'],
        medium: ['system', 'vector', 'matrix', 'cipher', 'quantum', 'hyper', 'cyber', 'pixel', 'laser', 'fusion', 'nebula', 'orbit', 'plasma', 'signal', 'binary', 'rocket', 'future', 'energy', 'kernel', 'stream'],
        hard: ['algorithm', 'frequency', 'bandwidth', 'interface', 'multiverse', 'synthetic', 'encryption', 'paradigm', 'rendezvous', 'atmosphere', 'hyperspace', 'singularity', 'telescopic', 'vibration', 'convergence', 'propulsion', 'nanosphere', 'dimension', 'supernova', 'telepathy']
    };

    const HYPE_TEXT = 'hype';
    const HYPE_BONUS = 200;

    const BOSS_PHRASES = [
        'SYSTEM OVERRIDE',
        'QUANTUM BREACH',
        'SINGULARITY CORE',
        'HYPERNOVA PROTOCOL',
        'DIMENSIONAL RIFT',
        'COSMIC ANNIHILATOR',
        'VOID CONVERGENCE',
        'ENTROPY CASCADE'
    ];
    const KIDS_BOSS_PHRASES = [
        'BIG CAT DOG',
        'SUN MOON STAR',
        'RED BLUE PINK',
        'FISH FROG DUCK'
    ];
    const BOSS_BONUS = 500;
    const BOSS_WAVE_INTERVAL = 5;

    const ACHIEVEMENTS = [
        { id: 'first_hype', icon: '🌈', name: 'First HYPE', desc: 'Type a HYPE word', check: s => s.hypeTyped >= 1 },
        { id: 'streak_10', icon: '🔥', name: 'On Fire', desc: '10x streak', check: s => s.bestStreak >= 10 },
        { id: 'streak_25', icon: '⚡', name: 'Unstoppable', desc: '25x streak', check: s => s.bestStreak >= 25 },
        { id: 'wave_10', icon: '🌊', name: 'Deep Diver', desc: 'Reach Wave 10', check: s => s.maxWave >= 10 },
        { id: 'wave_20', icon: '🚀', name: 'Hyperspace', desc: 'Reach Wave 20', check: s => s.maxWave >= 20 },
        { id: 'words_100', icon: '💯', name: 'Centurion', desc: 'Destroy 100 words', check: s => s.totalWordsTyped >= 100 },
        { id: 'words_500', icon: '🗡️', name: 'Word Slayer', desc: 'Destroy 500 words', check: s => s.totalWordsTyped >= 500 },
        { id: 'score_5000', icon: '⭐', name: 'High Roller', desc: 'Score 5000 total', check: s => s.totalScore >= 5000 },
        { id: 'boss_slayer', icon: '👑', name: 'Boss Slayer', desc: 'Defeat a boss', check: s => s.bossesDefeated >= 1 },
        { id: 'boss_5', icon: '🏆', name: 'Champion', desc: 'Defeat 5 bosses', check: s => s.bossesDefeated >= 5 },
        { id: 'gold_rush', icon: '💰', name: 'Gold Rush', desc: 'Destroy a golden word', check: s => s.goldenWords >= 1 },
        { id: 'flawless', icon: '💎', name: 'Flawless', desc: '10 perfect words in one run', check: s => s.perfectWords >= 10 },
        { id: 'speed_demon', icon: '🏎️', name: 'Speed Demon', desc: 'Reach 60 WPM', check: s => s.wpm >= 60 },
        { id: 'survivor', icon: '🛡️', name: 'Survivor', desc: 'Survive 2 minutes', check: s => s.runTime >= 120 },
        { id: 'sharpshooter', icon: '🎯', name: 'Sharpshooter', desc: '95% accuracy, 20+ words', check: s => s.accuracy >= 95 && s.wordsDestroyed >= 20 }
    ];

    const POWERUP_TYPES = {
        HEAL: { color: '#00ff88', label: 'Heal', effect: 'health' },
        SLOW: { color: '#00f0ff', label: 'Slow Motion', effect: 'slow' },
        FREEZE: { color: '#9fd8ff', label: 'Deep Freeze', effect: 'freeze' },
        BOMB: { color: '#ff3b6b', label: 'Nova Bomb', effect: 'bomb' },
        SHIELD: { color: '#a0ff00', label: 'Shield', effect: 'shield' },
        DOUBLE: { color: '#ffd700', label: '2X Score', effect: 'double' }
    };
    const KIDS_POWERUP_TEXT = { HEAL: 'HEAL', SLOW: 'SLOW', FREEZE: 'ICE', BOMB: 'BOMB', SHIELD: 'SAFE', DOUBLE: 'TWO' };

    const DIFFICULTY = {
        kids: { spawnBase: 3.6, spawnMin: 2.0, speedMult: 0.45, hardChance: 0, mediumChance: 0 },
        easy: { spawnBase: 2.8, spawnMin: 1.2, speedMult: 0.65, hardChance: 0.05, mediumChance: 0.30 },
        normal: { spawnBase: 2.2, spawnMin: 0.55, speedMult: 1.0, hardChance: 0.12, mediumChance: 0.35 },
        hard: { spawnBase: 1.6, spawnMin: 0.35, speedMult: 1.35, hardChance: 0.25, mediumChance: 0.45 },
        insane: { spawnBase: 1.1, spawnMin: 0.18, speedMult: 1.75, hardChance: 0.40, mediumChance: 0.45 }
    };

    const CONFIG = {
        spawnDistance: 90,
        despawnDistance: 8,
        dangerDistance: 26,
        baseSpeed: 16,
        fov: 75,
        cameraZ: 0,
        wordFont: '900 56px "Segoe UI", Roboto, sans-serif',
        powerUpFont: '900 60px "Segoe UI", Roboto, sans-serif',
        colors: {
            untyped: '#ffffff',
            untypedGlow: 'rgba(0, 240, 255, 0.35)',
            typed: '#00f0ff',
            typedGlow: 'rgba(0, 240, 255, 0.85)',
            matched: '#a0ff00',
            warning: '#ff3b6b'
        }
    };

    let scene, camera, renderer;
    let starField, tunnelRings = [];
    let nebulaMesh = null;
    let words = [];
    let particles = [];
    let targetWord = null;
    let spawnTimer = 0;
    let powerUpTimer = 0;
    let hypeTimer = 0;
    let lastTime = 0;
    let gameActive = false;
    let paused = false;
    let score = 0;
    let streak = 0;
    let bestStreak = 0;
    let health = 100;
    let wave = 1;
    let timeElapsed = 0;
    let currentDifficulty = 'normal';
    let audioEnabled = false;
    let bossActive = false;
    let screenShakeIntensity = 0;
    let hypeTypedCount = 0;
    let bossesDefeated = 0;
    let runId = 0;
    let demoMode = true;
    let demoSpawnTimer = 0;
    let adTimer = 5;
    let adEntities = [];
    let bannerTimer = null;
    const activeEffects = {
        slow: { active: false, endTime: 0 },
        multiplier: { active: false, endTime: 0 },
        shield: { active: false },
        freeze: { active: false, endTime: 0 }
    };

    class AudioManager {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
            this.musicGain = null;
            this.musicTimer = null;
            this.musicStep = 0;
            this.muted = false;
        }

        init() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.ctx) {
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.35;
                this.masterGain.connect(this.ctx.destination);
                audioEnabled = true;
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
        }

        tone(freq, type, duration, when = 0, dest = this.masterGain, volume = 0.35) {
            if (this.muted || !audioEnabled || !this.ctx) return;
            const t = this.ctx.currentTime + when;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(t);
            osc.stop(t + duration + 0.05);
        }

        chord(freqs, type, duration, when = 0) {
            freqs.forEach((f, i) => this.tone(f, type, duration, when + i * 0.04));
        }

        playType() { this.tone(720 + Math.random() * 180, 'sine', 0.07); }
        playHit() { this.tone(220, 'triangle', 0.18); this.tone(110, 'sawtooth', 0.25, 0.05); }
        playDestroy() { this.tone(880, 'square', 0.1); this.tone(1320, 'square', 0.16, 0.05); }
        playPowerUp() { this.chord([440, 660, 990], 'sine', 0.14); }
        playDamage() { this.tone(140, 'sawtooth', 0.4); this.tone(80, 'sawtooth', 0.35, 0.08); }
        playGameOver() { this.tone(330, 'sawtooth', 0.4); this.tone(220, 'sawtooth', 0.5, 0.25); this.tone(110, 'sawtooth', 0.7, 0.55); }
        playHypeSpawn() { this.chord([523, 659, 784, 1046], 'sine', 0.25); }
        playHypeDestroy() { this.chord([392, 523, 659, 784, 1046, 1318], 'sawtooth', 0.55); }
        playShieldHit() { this.tone(260, 'sine', 0.25); this.tone(520, 'sine', 0.35, 0.08); }
        playWaveAdvance() { this.tone(440, 'triangle', 0.12); this.tone(660, 'triangle', 0.18, 0.1); }
        playClick() { this.tone(900, 'sine', 0.04); }

        startMusic() {
            if (!this.ctx || this.musicTimer) return;
            this.musicGain = this.ctx.createGain();
            this.musicGain.connect(this.masterGain);
            this.musicStep = 0;
            const bass = [110, 110, 130.81, 98, 110, 110, 146.83, 164.81];
            const arp = [440, 523.25, 659.25, 587.33, 440, 523.25, 783.99, 659.25];
            this.musicTimer = setInterval(() => {
                const i = this.musicStep % 8;
                this.tone(bass[i], 'triangle', 0.26, 0, this.musicGain, 0.22);
                this.tone(arp[i], 'sine', 0.14, 0, this.musicGain, 0.08);
                if (this.musicStep % 8 === 0) this.tone(55, 'sine', 0.6, 0, this.musicGain, 0.25);
                this.musicStep++;
            }, 175);
        }

        stopMusic() {
            if (this.musicTimer) {
                clearInterval(this.musicTimer);
                this.musicTimer = null;
            }
            if (this.musicGain) {
                this.musicGain.disconnect();
                this.musicGain = null;
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            if (this.masterGain) {
                this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime, 0.02);
            }
            return this.muted;
        }

        setMuted(value) {
            this.muted = !!value;
            if (this.masterGain) {
                this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.35, this.ctx.currentTime, 0.02);
            }
        }
    }

    class LeaderboardManager {
        static KEY = 'typehype_leaderboard_v1';

        static load() {
            try {
                const raw = localStorage.getItem(this.KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }

        static save(entries) {
            try {
                localStorage.setItem(this.KEY, JSON.stringify(entries.slice(0, 8)));
            } catch (e) {}
        }

        static add(entry) {
            const entries = this.load();
            entries.push(entry);
            entries.sort((a, b) => b.score - a.score);
            this.save(entries);
            return entries;
        }

        static isHighScore(score) {
            const entries = this.load();
            return entries.length < 8 || score > entries[entries.length - 1].score;
        }
    }

    const THEMES = {
        neon: {
            name: 'Neon',
            cost: 0,
            preview: 'linear-gradient(135deg, #00f0ff, #7d2cff)',
            colors: {
                tunnel: 0x2a1a6a,
                stars: 0x8899ff,
                fog: 0x050510,
                untypedGlow: 'rgba(0, 240, 255, 0.35)',
                typed: '#00f0ff',
                typedGlow: 'rgba(0, 240, 255, 0.85)',
                healthHigh: ['#00f0ff', '#7d2cff']
            }
        },
        matrix: {
            name: 'Matrix',
            cost: 2000,
            preview: 'linear-gradient(135deg, #00ff44, #003300)',
            colors: {
                tunnel: 0x0a3a0a,
                stars: 0x00ff44,
                fog: 0x001100,
                untypedGlow: 'rgba(0, 255, 68, 0.35)',
                typed: '#00ff44',
                typedGlow: 'rgba(0, 255, 68, 0.85)',
                healthHigh: ['#00ff44', '#008800']
            }
        },
        sunset: {
            name: 'Sunset',
            cost: 5000,
            preview: 'linear-gradient(135deg, #ff4080, #ffcc00)',
            colors: {
                tunnel: 0x4a1030,
                stars: 0xff6699,
                fog: 0x1a0508,
                untypedGlow: 'rgba(255, 100, 150, 0.35)',
                typed: '#ff4080',
                typedGlow: 'rgba(255, 64, 128, 0.85)',
                healthHigh: ['#ff4080', '#ffcc00']
            }
        },
        ocean: {
            name: 'Ocean',
            cost: 10000,
            preview: 'linear-gradient(135deg, #66ccff, #0066ff)',
            colors: {
                tunnel: 0x0a2a4a,
                stars: 0x66ccff,
                fog: 0x001020,
                untypedGlow: 'rgba(100, 200, 255, 0.35)',
                typed: '#66ccff',
                typedGlow: 'rgba(100, 200, 255, 0.85)',
                healthHigh: ['#66ccff', '#0066ff']
            }
        },
        plasma: {
            name: 'Plasma',
            cost: 20000,
            preview: 'linear-gradient(135deg, #ff00ff, #aa00ff)',
            colors: {
                tunnel: 0x3a0066,
                stars: 0xff00ff,
                fog: 0x100020,
                untypedGlow: 'rgba(255, 0, 255, 0.35)',
                typed: '#ff00ff',
                typedGlow: 'rgba(255, 0, 255, 0.85)',
                healthHigh: ['#ff00ff', '#aa00ff']
            }
        }
    };

    class StatsManager {
        static KEY = 'typehype_stats_v1';

        static load() {
            const defaults = {
                totalScore: 0,
                runs: 0,
                totalWordsTyped: 0,
                totalKeystrokes: 0,
                totalCorrectKeystrokes: 0,
                bestStreak: 0,
                longestTime: 0,
                maxWave: 0,
                totalBossesDefeated: 0
            };
            try {
                const raw = localStorage.getItem(this.KEY);
                const parsed = raw ? JSON.parse(raw) : null;
                if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return defaults;
                return { ...defaults, ...parsed };
            } catch (e) {
                return defaults;
            }
        }

        static save(stats) {
            try {
                localStorage.setItem(this.KEY, JSON.stringify(stats));
            } catch (e) {}
        }

        static addRun(run) {
            const stats = this.load();
            stats.runs++;
            stats.totalScore += run.score || 0;
            stats.totalWordsTyped += run.wordsDestroyed || 0;
            stats.totalKeystrokes += run.keystrokes || 0;
            stats.totalCorrectKeystrokes += run.correctKeystrokes || 0;
            if (run.bestStreak > stats.bestStreak) stats.bestStreak = run.bestStreak;
            if (run.time > stats.longestTime) stats.longestTime = run.time;
            if (run.wave > (stats.maxWave || 0)) stats.maxWave = run.wave;
            stats.totalBossesDefeated = (stats.totalBossesDefeated || 0) + (run.bossesDefeated || 0);
            this.save(stats);
            return stats;
        }
    }

    class CosmeticsManager {
        static KEY = 'typehype_cosmetics_v1';

        static load() {
            const defaults = { selected: 'neon', unlocked: ['neon'] };
            try {
                const raw = localStorage.getItem(this.KEY);
                return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
            } catch (e) {
                return defaults;
            }
        }

        static save(state) {
            try {
                localStorage.setItem(this.KEY, JSON.stringify(state));
            } catch (e) {}
        }

        static unlock(themeId, totalScore) {
            const state = this.load();
            if (state.unlocked.includes(themeId)) return true;
            if (totalScore >= (THEMES[themeId]?.cost || Infinity)) {
                state.unlocked.push(themeId);
                this.save(state);
                return true;
            }
            return false;
        }

        static select(themeId) {
            const state = this.load();
            if (!state.unlocked.includes(themeId)) return false;
            state.selected = themeId;
            this.save(state);
            return true;
        }
    }

    let currentTheme = CosmeticsManager.load().selected;
    const globalStats = StatsManager.load();
    let runStats = { keystrokes: 0, correctKeystrokes: 0, wordsDestroyed: 0, perfectWords: 0, goldenDestroyed: 0, startTime: 0 };
    let lastEffectsHtml = '';

    class AchievementManager {
        static KEY = 'typehype_achievements_v1';

        static load() {
            try {
                const raw = localStorage.getItem(this.KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }

        static save(list) {
            try {
                localStorage.setItem(this.KEY, JSON.stringify(list));
            } catch (e) {}
        }

        static getStats() {
            const minutes = Math.max(timeElapsed, 1) / 60;
            return {
                hypeTyped: hypeTypedCount,
                bestStreak: Math.max(globalStats.bestStreak, bestStreak),
                maxWave: Math.max(globalStats.maxWave || 0, wave),
                totalWordsTyped: globalStats.totalWordsTyped + runStats.wordsDestroyed,
                totalScore: globalStats.totalScore + score,
                bossesDefeated: (globalStats.totalBossesDefeated || 0) + bossesDefeated,
                wpm: Math.round((runStats.correctKeystrokes / 5) / minutes),
                accuracy: runStats.keystrokes > 0 ? (runStats.correctKeystrokes / runStats.keystrokes) * 100 : 100,
                runTime: timeElapsed,
                wordsDestroyed: runStats.wordsDestroyed,
                perfectWords: runStats.perfectWords || 0,
                goldenWords: runStats.goldenDestroyed || 0
            };
        }

        static checkAll() {
            const unlocked = this.load();
            const stats = this.getStats();
            const newlyUnlocked = [];
            for (const ach of ACHIEVEMENTS) {
                if (unlocked.includes(ach.id)) continue;
                if (ach.check(stats)) {
                    unlocked.push(ach.id);
                    newlyUnlocked.push(ach);
                }
            }
            if (newlyUnlocked.length) {
                this.save(unlocked);
                newlyUnlocked.forEach((a, i) => {
                    setTimeout(() => showAchievementToast(a), i * 1200);
                });
            }
        }
    }

    const audio = new AudioManager();

    const ui = {
        startScreen: document.getElementById('start-screen'),
        gameOverScreen: document.getElementById('game-over-screen'),
        pauseScreen: document.getElementById('pause-screen'),
        hud: document.getElementById('hud'),
        typingTarget: document.getElementById('typing-target'),
        targetTyped: document.getElementById('target-typed'),
        targetUntyped: document.getElementById('target-untyped'),
        score: document.getElementById('score'),
        streak: document.getElementById('streak'),
        wave: document.getElementById('wave'),
        healthFill: document.querySelector('.health-fill'),
        finalScore: document.getElementById('final-score'),
        finalStreak: document.getElementById('final-streak'),
        finalWave: document.getElementById('final-wave'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        difficultyBtns: document.querySelectorAll('.difficulty-btn'),
        leaderboardList: document.getElementById('leaderboard-list'),
        leaderboardListEnd: document.getElementById('leaderboard-list-end'),
        newHighScore: document.getElementById('new-highscore'),
        powerUpToast: document.getElementById('powerup-toast'),
        activeEffects: document.getElementById('active-effects'),
        screenFlash: document.getElementById('screen-flash'),
        customizeScreen: document.getElementById('customize-screen'),
        themeGrid: document.getElementById('theme-grid'),
        customizeBtn: document.getElementById('customize-btn'),
        backBtn: document.getElementById('back-btn'),
        menuBtn: document.getElementById('menu-btn'),
        globalStats: {
            totalScore: document.getElementById('stat-total-score'),
            runs: document.getElementById('stat-runs'),
            bestStreak: document.getElementById('stat-best-streak'),
            longestTime: document.getElementById('stat-longest-time')
        },
        runStats: {
            wpm: document.getElementById('run-wpm'),
            accuracy: document.getElementById('run-accuracy'),
            words: document.getElementById('run-words'),
            time: document.getElementById('run-time')
        },
        virtualKeyboard: document.getElementById('virtual-keyboard'),
        soundToggle: document.getElementById('sound-toggle'),
        soundIcon: document.getElementById('sound-icon'),
        comboMeter: document.getElementById('combo-meter'),
        comboBarFill: document.querySelector('.combo-bar-fill'),
        bossBanner: document.getElementById('boss-banner'),
        achievementToast: document.getElementById('achievement-toast'),
        keyRippleLayer: document.getElementById('key-ripple-layer'),
        achievementsScreen: document.getElementById('achievements-screen'),
        achievementsBtn: document.getElementById('achievements-btn'),
        achievementsBackBtn: document.getElementById('achievements-back-btn'),
        achievementGrid: document.getElementById('achievement-grid'),
        hudWpm: document.getElementById('hud-wpm'),
        hudAcc: document.getElementById('hud-acc'),
        dangerVignette: document.getElementById('danger-vignette'),
        scorePopupLayer: document.getElementById('score-popup-layer'),
        resumeBtn: document.getElementById('resume-btn'),
        pauseMenuBtn: document.getElementById('pause-menu-btn')
    };

    function init() {
        const container = document.getElementById('canvas-container');

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(THEMES[currentTheme].colors.fog, 0.015);

        camera = new THREE.PerspectiveCamera(CONFIG.fov, window.innerWidth / window.innerHeight, 0.1, 300);
        camera.position.z = CONFIG.cameraZ;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        createStarField();
        createTunnel();
        createNebula();
        applyTheme(currentTheme);

        window.addEventListener('resize', onResize);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) setPaused(true);
        });
        window.addEventListener('blur', () => setPaused(true));
        ui.startBtn.addEventListener('click', () => { audio.init(); audio.playClick(); startGame(); });
        ui.restartBtn.addEventListener('click', () => { audio.init(); audio.playClick(); startGame(); });
        ui.menuBtn.addEventListener('click', () => { audio.playClick(); returnToMenu(); });
        ui.customizeBtn.addEventListener('click', () => { audio.playClick(); showCustomize(); });
        ui.backBtn.addEventListener('click', () => { audio.playClick(); hideCustomize(); });
        ui.achievementsBtn.addEventListener('click', () => { audio.playClick(); showAchievements(); });
        ui.achievementsBackBtn.addEventListener('click', () => { audio.playClick(); hideAchievements(); });
        ui.resumeBtn.addEventListener('click', () => { audio.playClick(); setPaused(false); });
        ui.pauseMenuBtn.addEventListener('click', () => { audio.playClick(); quitToMenu(); });

        renderer.domElement.addEventListener('pointerdown', onPointerDown);

        ui.soundToggle.addEventListener('click', () => {
            audio.init();
            const muted = audio.toggleMute();
            updateSoundIcon(muted);
            try {
                if (muted) localStorage.setItem('typehype_muted', '1');
                else localStorage.removeItem('typehype_muted');
            } catch (e) {}
        });

        let savedMuted = null;
        try {
            savedMuted = localStorage.getItem('typehype_muted');
        } catch (e) {}
        if (savedMuted) {
            audio.setMuted(true);
        }
        updateSoundIcon(audio.muted);

        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';

        let savedDifficulty = null;
        try {
            savedDifficulty = localStorage.getItem('typehype_difficulty');
        } catch (e) {}
        if (savedDifficulty && DIFFICULTY[savedDifficulty]) {
            currentDifficulty = savedDifficulty;
            ui.difficultyBtns.forEach(b => b.classList.remove('selected'));
            const savedBtn = document.querySelector(`.difficulty-btn[data-difficulty="${savedDifficulty}"]`);
            if (savedBtn) savedBtn.classList.add('selected');
        }

        ui.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentDifficulty = btn.dataset.difficulty;
                try {
                    localStorage.setItem('typehype_difficulty', currentDifficulty);
                } catch (e) {}
                ui.difficultyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                audio.playClick();
                if (demoMode) {
                    words.forEach(w => {
                        scene.remove(w.sprite);
                        w.sprite.material.map.dispose();
                        w.sprite.material.dispose();
                    });
                    words = [];
                    demoSpawnTimer = 0.3;
                }
            });
        });

        generateVirtualKeyboard();
        renderGlobalStats();
        renderThemeGrid();
        renderLeaderboard();
        renderAchievementGrid();
        lastTime = performance.now();
        renderer.setAnimationLoop(animate);
    }

    function updateSoundIcon(muted) {
        if (!ui.soundIcon) return;
        ui.soundToggle.classList.toggle('muted', muted);
        ui.soundIcon.innerHTML = muted
            ? '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'
            : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }

    function applyTheme(themeId) {
        const theme = THEMES[themeId];
        if (!theme) return;
        currentTheme = themeId;
        scene.fog.color.setHex(theme.colors.fog);
        if (starField) starField.material.color.setHex(theme.colors.stars);
        tunnelRings.forEach(ring => ring.material.color.setHex(theme.colors.tunnel));
        CONFIG.colors.untypedGlow = theme.colors.untypedGlow;
        CONFIG.colors.typed = theme.colors.typed;
        CONFIG.colors.typedGlow = theme.colors.typedGlow;
    }

    function renderGlobalStats() {
        const stats = globalStats;
        ui.globalStats.totalScore.textContent = stats.totalScore.toLocaleString();
        ui.globalStats.runs.textContent = stats.runs;
        ui.globalStats.bestStreak.textContent = stats.bestStreak;
        ui.globalStats.longestTime.textContent = `${Math.floor(stats.longestTime)}s`;
    }

    function renderThemeGrid() {
        const state = CosmeticsManager.load();
        ui.themeGrid.innerHTML = Object.entries(THEMES).map(([id, theme]) => {
            const unlocked = state.unlocked.includes(id);
            const selected = state.selected === id;
            return `
                <div class="theme-card ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}" data-theme="${id}">
                    <div class="theme-preview" style="background: ${theme.preview}"></div>
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-cost">${unlocked ? (selected ? 'Selected' : 'Owned') : `Unlock at ${theme.cost.toLocaleString()} pts`}</div>
                </div>
            `;
        }).join('');

        ui.themeGrid.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => {
                const themeId = card.dataset.theme;
                const state = CosmeticsManager.load();
                if (!state.unlocked.includes(themeId)) {
                    if (CosmeticsManager.unlock(themeId, globalStats.totalScore)) {
                        applyTheme(themeId);
                        renderThemeGrid();
                        renderGlobalStats();
                    }
                    return;
                }
                if (CosmeticsManager.select(themeId)) {
                    applyTheme(themeId);
                    renderThemeGrid();
                }
            });
        });
    }

    function showCustomize() {
        ui.startScreen.classList.add('hidden');
        ui.customizeScreen.classList.remove('hidden');
        renderThemeGrid();
    }

    function hideCustomize() {
        ui.customizeScreen.classList.add('hidden');
        ui.startScreen.classList.remove('hidden');
        renderGlobalStats();
    }

    function showAchievements() {
        ui.startScreen.classList.add('hidden');
        ui.achievementsScreen.classList.remove('hidden');
        renderAchievementGrid();
    }

    function hideAchievements() {
        ui.achievementsScreen.classList.add('hidden');
        ui.startScreen.classList.remove('hidden');
        renderGlobalStats();
    }

    function renderAchievementGrid() {
        const unlocked = AchievementManager.load();
        ui.achievementGrid.innerHTML = ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
                    <div class="ach-card-icon">${ach.icon}</div>
                    <div class="ach-card-name">${ach.name}</div>
                    <div class="ach-card-desc">${ach.desc}</div>
                </div>
            `;
        }).join('');
    }

    function showAchievementToast(ach) {
        ui.achievementToast.innerHTML = `
            <div class="ach-icon">${ach.icon}</div>
            <div class="ach-title">${ach.name}</div>
            <div class="ach-desc">${ach.desc}</div>
        `;
        ui.achievementToast.classList.remove('hidden');
        setTimeout(() => {
            ui.achievementToast.classList.add('hidden');
        }, 3500);
    }

    function createNebula() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const geometry = new THREE.PlaneGeometry(200, 200);
        nebulaMesh = new THREE.Mesh(geometry, material);
        nebulaMesh.position.z = -180;
        nebulaMesh.userData.canvas = canvas;
        nebulaMesh.userData.ctx = ctx;
        nebulaMesh.userData.time = 0;
        scene.add(nebulaMesh);
    }

    function updateNebula(dt) {
        if (!nebulaMesh) return;
        const u = nebulaMesh.userData;
        u.time += dt;
        const ctx = u.ctx;
        const w = u.canvas.width;
        const h = u.canvas.height;
        const theme = THEMES[currentTheme];

        ctx.clearRect(0, 0, w, h);

        const blobs = [
            { x: 0.3 + Math.sin(u.time * 0.3) * 0.15, y: 0.4 + Math.cos(u.time * 0.25) * 0.12, r: 0.35, color: theme.colors.typed },
            { x: 0.7 + Math.cos(u.time * 0.2) * 0.15, y: 0.6 + Math.sin(u.time * 0.35) * 0.12, r: 0.3, color: '#7d2cff' },
            { x: 0.5 + Math.sin(u.time * 0.4) * 0.2, y: 0.3 + Math.cos(u.time * 0.3) * 0.15, r: 0.25, color: theme.colors.typed }
        ];

        blobs.forEach(blob => {
            const cx = blob.x * w;
            const cy = blob.y * h;
            const radius = blob.r * w * (0.8 + Math.sin(u.time * 0.5 + blob.x * 10) * 0.2);
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            grad.addColorStop(0, blob.color + '40');
            grad.addColorStop(0.5, blob.color + '15');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        });

        nebulaMesh.material.map.needsUpdate = true;
        nebulaMesh.material.opacity = 0.3 + Math.sin(u.time * 0.5) * 0.08;
    }

    function updateComboMeter() {
        if (!ui.comboMeter) return;
        if (streak < 2) {
            ui.comboMeter.classList.add('hidden');
            ui.comboMeter.classList.remove('active', 'hot', 'fire');
            return;
        }
        ui.comboMeter.classList.remove('hidden');
        const pct = Math.min(streak / 25, 1) * 100;
        ui.comboBarFill.style.width = `${pct}%`;
        ui.comboMeter.classList.remove('active', 'hot', 'fire');
        if (streak >= 20) {
            ui.comboMeter.classList.add('fire');
        } else if (streak >= 10) {
            ui.comboMeter.classList.add('hot');
        } else {
            ui.comboMeter.classList.add('active');
        }
    }

    function createKeyRipple() {
        if (!ui.keyRippleLayer) return;
        const ripple = document.createElement('div');
        ripple.className = 'key-ripple';
        ripple.style.left = `${Math.random() * 80 + 10}%`;
        ripple.style.top = `${Math.random() * 60 + 20}%`;
        ui.keyRippleLayer.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    }

    function triggerScreenShake(intensity = 1) {
        screenShakeIntensity = Math.max(screenShakeIntensity, intensity);
    }

    function updateScreenShake(dt) {
        if (screenShakeIntensity > 0) {
            const shake = screenShakeIntensity * 0.8;
            camera.position.x = (Math.random() - 0.5) * shake;
            camera.position.y = (Math.random() - 0.5) * shake;
            screenShakeIntensity = Math.max(0, screenShakeIntensity - dt * 4);
            if (screenShakeIntensity <= 0) {
                camera.position.x = 0;
                camera.position.y = 0;
            }
        }
    }

    function showBanner(text, duration = 2500, isWave = false) {
        ui.bossBanner.textContent = text;
        ui.bossBanner.classList.toggle('wave-banner', isWave);
        ui.bossBanner.classList.remove('hidden');
        clearTimeout(bannerTimer);
        bannerTimer = setTimeout(() => {
            ui.bossBanner.classList.add('hidden');
        }, duration);
    }

    function spawnScorePopup(position, text, color) {
        if (!ui.scorePopupLayer) return;
        const v = position.clone();
        v.project(camera);
        if (v.z > 1) return;
        const el = document.createElement('div');
        el.className = 'score-popup';
        el.textContent = text;
        el.style.color = color;
        el.style.left = `${(v.x * 0.5 + 0.5) * window.innerWidth}px`;
        el.style.top = `${(-v.y * 0.5 + 0.5) * window.innerHeight}px`;
        ui.scorePopupLayer.appendChild(el);
        setTimeout(() => el.remove(), 950);
    }

    function createBossTexture(text, typedLength) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 40;
        ctx.font = '900 48px "Segoe UI", Roboto, sans-serif';
        const metrics = ctx.measureText(text);
        canvas.width = Math.ceil(metrics.width + padding * 2);
        canvas.height = 120;

        ctx.font = '900 48px "Segoe UI", Roboto, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const typed = text.slice(0, typedLength).toUpperCase();
        const untyped = text.slice(typedLength).toUpperCase();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (typed) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 30;
            ctx.fillText(typed, centerX - metrics.width / 2 + ctx.measureText(typed).width / 2, centerY);
        }

        const untypedX = centerX + ctx.measureText(typed).width / 2;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#ff3b6b');
        gradient.addColorStop(0.5, '#ff0066');
        gradient.addColorStop(1, '#ff00cc');
        ctx.shadowColor = '#ff3b6b';
        ctx.shadowBlur = 35;
        ctx.fillStyle = gradient;
        ctx.fillText(untyped, untypedX, centerY);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return { texture, aspect: canvas.width / canvas.height };
    }

    function spawnBossWord() {
        const pool = currentDifficulty === 'kids' ? KIDS_BOSS_PHRASES : BOSS_PHRASES;
        const text = pool[Math.floor(Math.random() * pool.length)].toLowerCase();
        const { texture, aspect } = createBossTexture(text.toUpperCase(), 0);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        const baseScale = 8;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        sprite.position.set(0, 0, -CONFIG.spawnDistance);

        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const speed = CONFIG.baseSpeed * diff.speedMult * 0.5;

        const entity = {
            text,
            sprite,
            typed: '',
            speed,
            isTarget: false,
            isBoss: true,
            wobble: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        words.push(entity);
        bossActive = true;
        showBanner('BOSS INCOMING');
        audio.playHypeSpawn();
        return entity;
    }

    function returnToMenu() {
        endGameCleanup();
        demoMode = true;
        demoSpawnTimer = 0.5;
        adTimer = 3;
        clearAds();
        words.forEach(w => {
            scene.remove(w.sprite);
            w.sprite.material.map.dispose();
            w.sprite.material.dispose();
        });
        words = [];
        clearParticles();
        ui.gameOverScreen.classList.add('hidden');
        ui.startScreen.classList.remove('hidden');
        ui.comboMeter.classList.add('hidden');
        ui.bossBanner.classList.add('hidden');
        renderLeaderboard();
        renderGlobalStats();
        renderAchievementGrid();
    }

    function generateVirtualKeyboard() {
        const rows = [
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
        ];
        const rowEls = ui.virtualKeyboard.querySelectorAll('.keyboard-row');
        rows.forEach((row, i) => {
            rowEls[i].innerHTML = row.split('').map(char =>
                `<button class="key" data-key="${char}">${char.toUpperCase()}</button>`
            ).join('');
        });

        ui.virtualKeyboard.querySelectorAll('.key').forEach(key => {
            key.addEventListener('pointerdown', e => {
                e.preventDefault();
                handleKeyInput(key.dataset.key);
                key.classList.add('pressed');
                setTimeout(() => key.classList.remove('pressed'), 120);
            });
        });
    }

    function onPointerDown(e) {
        if (!gameActive || paused || e.target.closest('.virtual-keyboard')) return;
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const sprites = words.map(w => w.sprite);
        const intersects = raycaster.intersectObjects(sprites);
        if (intersects.length > 0) {
            const wordEntity = words.find(w => w.sprite === intersects[0].object);
            if (wordEntity) setTarget(wordEntity);
        }
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function renderLeaderboard(listEl = ui.leaderboardList) {
        const entries = LeaderboardManager.load();
        if (entries.length === 0) {
            listEl.innerHTML = '<li><span>No scores yet</span><span></span></li>';
            return;
        }
        listEl.innerHTML = entries.map((e, i) => `
            <li>
                <span><span class="leaderboard-rank">${i + 1}.</span>${escapeHtml(e.score)}<span class="leaderboard-difficulty">${escapeHtml(e.difficulty)}</span></span>
                <span>Wave ${escapeHtml(e.wave)}</span>
            </li>
        `).join('');
    }

    function createStarField() {
        const geometry = new THREE.BufferGeometry();
        const count = 1200;
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 180;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
            speeds[i] = 0.5 + Math.random() * 1.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        const material = new THREE.PointsMaterial({
            color: 0x8899ff,
            size: 0.35,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        starField = new THREE.Points(geometry, material);
        scene.add(starField);
    }

    function createTunnel() {
        const ringCount = 18;
        const ringGeo = new THREE.RingGeometry(18, 18.4, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x2a1a6a,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
        });

        for (let i = 0; i < ringCount; i++) {
            const ring = new THREE.Mesh(ringGeo, ringMat.clone());
            ring.position.z = -10 - i * 12;
            ring.userData.baseZ = ring.position.z;
            scene.add(ring);
            tunnelRings.push(ring);
        }
    }

    function createWordTexture(word, typedLength = 0, isTarget = false, isGolden = false) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 24;
        ctx.font = CONFIG.wordFont;
        const metrics = ctx.measureText(word.toUpperCase());
        canvas.width = Math.ceil(metrics.width + padding * 2);
        canvas.height = 92;

        ctx.font = CONFIG.wordFont;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const typed = word.slice(0, typedLength).toUpperCase();
        const untyped = word.slice(typedLength).toUpperCase();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const untypedColor = isGolden ? '#ffd700' : CONFIG.colors.untyped;
        const glowColor = isGolden ? 'rgba(255, 215, 0, 0.65)' : CONFIG.colors.untypedGlow;

        if (isTarget || isGolden) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = isGolden ? 30 : 24;
        }

        if (typed) {
            ctx.fillStyle = isGolden ? '#fff3b0' : CONFIG.colors.typed;
            ctx.shadowColor = isGolden ? 'rgba(255, 215, 0, 0.9)' : CONFIG.colors.typedGlow;
            ctx.shadowBlur = 30;
            ctx.fillText(typed, centerX - metrics.width / 2 + ctx.measureText(typed).width / 2, centerY);
        }

        const untypedX = centerX + ctx.measureText(typed).width / 2;
        ctx.fillStyle = untypedColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isTarget ? 24 : 16;
        ctx.fillText(untyped, untypedX, centerY);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return { texture, aspect: canvas.width / canvas.height };
    }

    function createWordEntity(text, difficultyFactor, speedMult = 1, isGolden = false) {
        const { texture, aspect } = createWordTexture(text, 0, false, isGolden);

        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);

        const baseScale = 3.6;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        const angle = (Math.random() - 0.5) * 1.4;
        const radius = (Math.random() - 0.5) * 18;
        const yOffset = (Math.random() - 0.5) * 12;

        sprite.position.set(
            Math.sin(angle) * 16 + radius,
            yOffset,
            -CONFIG.spawnDistance
        );

        const speed = CONFIG.baseSpeed * speedMult * (0.85 + Math.random() * 0.35) * (1 + difficultyFactor * 0.18);

        const entity = {
            text,
            sprite,
            typed: '',
            speed,
            isTarget: false,
            isGolden,
            perfect: true,
            wobble: Math.random() * Math.PI * 2,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        words.push(entity);
        return entity;
    }

    function pickWordPool(diff) {
        if (currentDifficulty === 'kids') return WORDS.kids;
        const roll = Math.random();
        if (roll < diff.hardChance) return WORDS.hard;
        if (roll < diff.hardChance + diff.mediumChance) return WORDS.medium;
        return WORDS.easy;
    }

    function spawnWord() {
        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const rawFactor = Math.min((wave - 1) * 0.25 + timeElapsed * 0.015, 3.5);
        const difficultyFactor = currentDifficulty === 'kids' ? rawFactor * 0.2 : rawFactor;
        const pool = pickWordPool(diff);
        const text = pool[Math.floor(Math.random() * pool.length)];
        createWordEntity(text, difficultyFactor, diff.speedMult, Math.random() < 0.08);
    }

    function createHypeTexture(typedLength) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const text = HYPE_TEXT.toUpperCase();
        const padding = 34;
        ctx.font = CONFIG.wordFont;
        const metrics = ctx.measureText(text);
        canvas.width = Math.ceil(metrics.width + padding * 2);
        canvas.height = 100;

        ctx.font = CONFIG.wordFont;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const typed = text.slice(0, typedLength);
        const untyped = text.slice(typedLength);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (typed) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 30;
            ctx.fillText(typed, centerX - metrics.width / 2 + ctx.measureText(typed).width / 2, centerY);
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#ff0066');
        gradient.addColorStop(0.16, '#ff6600');
        gradient.addColorStop(0.33, '#ffcc00');
        gradient.addColorStop(0.5, '#00ff66');
        gradient.addColorStop(0.66, '#0099ff');
        gradient.addColorStop(0.83, '#6600ff');
        gradient.addColorStop(1, '#ff00cc');

        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 28;
        ctx.fillStyle = gradient;

        const untypedX = centerX + ctx.measureText(typed).width / 2;
        ctx.fillText(untyped, untypedX, centerY);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return { texture, aspect: canvas.width / canvas.height };
    }

    function createPowerUpTexture(text, typedLength, colorHex) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 28;
        ctx.font = CONFIG.powerUpFont;
        const metrics = ctx.measureText(text);
        canvas.width = Math.ceil(metrics.width + padding * 2);
        canvas.height = 100;

        ctx.font = CONFIG.powerUpFont;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const typed = text.slice(0, typedLength).toUpperCase();
        const untyped = text.slice(typedLength).toUpperCase();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 35;

        if (typed) {
            ctx.fillStyle = '#ffffff';
            ctx.fillText(typed, centerX - metrics.width / 2 + ctx.measureText(typed).width / 2, centerY);
        }

        const untypedX = centerX + ctx.measureText(typed).width / 2;
        ctx.fillStyle = colorHex;
        ctx.fillText(untyped, untypedX, centerY);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return { texture, aspect: canvas.width / canvas.height };
    }

    function createPowerUpEntity(typeKey) {
        const type = POWERUP_TYPES[typeKey];
        const displayText = currentDifficulty === 'kids' ? KIDS_POWERUP_TEXT[typeKey] : typeKey;
        const { texture, aspect } = createPowerUpTexture(displayText, 0, type.color);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        const baseScale = 4.2;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        sprite.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 16,
            -CONFIG.spawnDistance
        );

        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const speed = CONFIG.baseSpeed * diff.speedMult * (1.1 + timeElapsed * 0.012);

        const entity = {
            text: displayText,
            sprite,
            typed: '',
            speed,
            isTarget: false,
            isPowerUp: true,
            powerUpType: typeKey,
            powerUpColor: type.color,
            wobble: Math.random() * Math.PI * 2,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        words.push(entity);
        return entity;
    }

    function spawnPowerUp() {
        const keys = Object.keys(POWERUP_TYPES);
        const typeKey = keys[Math.floor(Math.random() * keys.length)];
        createPowerUpEntity(typeKey);
    }

    function spawnHypeWord() {
        audio.playHypeSpawn();
        const { texture, aspect } = createHypeTexture(0);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        const baseScale = 5.8;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        sprite.position.set(
            (Math.random() - 0.5) * 22,
            (Math.random() - 0.5) * 12,
            -CONFIG.spawnDistance
        );

        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const speed = CONFIG.baseSpeed * diff.speedMult * 0.85;

        const entity = {
            text: HYPE_TEXT,
            sprite,
            typed: '',
            speed,
            isTarget: false,
            isHype: true,
            isPowerUp: false,
            wobble: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.7,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        words.push(entity);
        return entity;
    }

    function setTarget(wordEntity) {
        if (targetWord && targetWord !== wordEntity) {
            targetWord.isTarget = false;
            targetWord.typed = '';
            targetWord.perfect = false;
            updateWordTexture(targetWord);
        }
        targetWord = wordEntity;
        if (wordEntity) {
            wordEntity.isTarget = true;
            updateWordTexture(wordEntity);
        }
        updateTargetOverlay();
    }

    function updateWordTexture(wordEntity) {
        const oldMaterial = wordEntity.sprite.material;
        let result;
        if (wordEntity.isBoss) {
            result = createBossTexture(wordEntity.text.toUpperCase(), wordEntity.typed.length);
        } else if (wordEntity.isHype) {
            result = createHypeTexture(wordEntity.typed.length);
        } else if (wordEntity.isPowerUp) {
            result = createPowerUpTexture(wordEntity.text, wordEntity.typed.length, wordEntity.powerUpColor);
        } else {
            result = createWordTexture(wordEntity.text, wordEntity.typed.length, wordEntity.isTarget, wordEntity.isGolden);
        }
        const oldTexture = oldMaterial.map;
        oldMaterial.map = result.texture;
        oldMaterial.needsUpdate = true;
        if (oldTexture) oldTexture.dispose();
        wordEntity.sprite.scale.x = wordEntity.originalScale.y * result.aspect;
    }

    function updateTargetOverlay() {
        if (!targetWord) {
            ui.typingTarget.classList.add('hidden');
            ui.targetTyped.textContent = '';
            ui.targetUntyped.textContent = '';
            return;
        }
        ui.targetTyped.textContent = targetWord.typed.toUpperCase();
        ui.targetUntyped.textContent = targetWord.text.slice(targetWord.typed.length).toUpperCase();
        ui.typingTarget.classList.remove('hidden');
    }

    function getEffectiveSpeed(entity) {
        const now = performance.now();
        if (activeEffects.freeze.active && now < activeEffects.freeze.endTime) return 0;
        let speed = entity.speed;
        if (activeEffects.slow.active && now < activeEffects.slow.endTime) {
            speed *= 0.45;
        }
        return speed;
    }

    function showToast(message, color) {
        ui.powerUpToast.textContent = message;
        ui.powerUpToast.style.color = color;
        ui.powerUpToast.style.border = `1px solid ${color}`;
        ui.powerUpToast.style.boxShadow = `0 0 30px ${color}40`;
        ui.powerUpToast.classList.remove('hidden');
        setTimeout(() => {
            ui.powerUpToast.classList.add('hidden');
        }, 1500);
    }

    function updateActiveEffectsUI() {
        const badges = [];
        const now = performance.now();
        if (activeEffects.slow.active && now < activeEffects.slow.endTime) {
            const remaining = Math.ceil((activeEffects.slow.endTime - now) / 1000);
            badges.push(`<span class="effect-badge slow">Slow ${remaining}s</span>`);
        }
        if (activeEffects.freeze.active && now < activeEffects.freeze.endTime) {
            const remaining = Math.ceil((activeEffects.freeze.endTime - now) / 1000);
            badges.push(`<span class="effect-badge freeze">Ice ${remaining}s</span>`);
        }
        if (activeEffects.multiplier.active && now < activeEffects.multiplier.endTime) {
            const remaining = Math.ceil((activeEffects.multiplier.endTime - now) / 1000);
            badges.push(`<span class="effect-badge multiplier">2X ${remaining}s</span>`);
        }
        if (activeEffects.shield.active) {
            badges.push(`<span class="effect-badge shield">Shield</span>`);
        }
        const html = badges.join('');
        if (html !== lastEffectsHtml) {
            lastEffectsHtml = html;
            ui.activeEffects.innerHTML = html;
            ui.activeEffects.classList.toggle('hidden', !badges.length);
        }
    }

    function applyPowerUpEffect(typeKey) {
        const type = POWERUP_TYPES[typeKey];
        audio.playPowerUp();
        showToast(type.label, type.color);

        switch (type.effect) {
            case 'health':
                health = Math.min(100, health + 25);
                createExplosion(new THREE.Vector3(0, 0, -15), type.color);
                break;
            case 'slow':
                activeEffects.slow.active = true;
                activeEffects.slow.endTime = performance.now() + 5000;
                break;
            case 'freeze':
                activeEffects.freeze.active = true;
                activeEffects.freeze.endTime = performance.now() + 3500;
                break;
            case 'shield':
                activeEffects.shield.active = true;
                break;
            case 'double':
                activeEffects.multiplier.active = true;
                activeEffects.multiplier.endTime = performance.now() + 8000;
                break;
            case 'bomb':
                bombEffect();
                break;
        }
        updateHUD();
        updateActiveEffectsUI();
    }

    function bombEffect() {
        for (let i = words.length - 1; i >= 0; i--) {
            const w = words[i];
            if (w.isPowerUp) continue;
            if (w.isBoss) {
                bossActive = false;
                bossesDefeated++;
            }
            runStats.wordsDestroyed++;
            createExplosion(w.sprite.position, CONFIG.colors.warning);
            if (targetWord === w) setTarget(null);
            scene.remove(w.sprite);
            w.sprite.material.map.dispose();
            w.sprite.material.dispose();
            words.splice(i, 1);
        }
        score += 50;
        advanceWave();
        AchievementManager.checkAll();
    }

    function findBestTargetForKey(key) {
        const char = key.toLowerCase();
        let best = null;
        let bestScore = -Infinity;

        for (const w of words) {
            if (w.typed.length > 0) continue;
            if (w.text[0].toLowerCase() !== char) continue;
            const remaining = Math.max(1, -CONFIG.despawnDistance - w.sprite.position.z);
            const proximity = 1 / remaining;
            if (proximity > bestScore) {
                bestScore = proximity;
                best = w;
            }
        }
        return best;
    }

    function setPaused(value) {
        const wasPaused = paused;
        paused = !!value && gameActive;
        if (ui.pauseScreen) ui.pauseScreen.classList.toggle('hidden', !paused);
        if (paused && !wasPaused) {
            const now = performance.now();
            runStats.pausedAt = now;
            for (const key of ['slow', 'multiplier', 'freeze']) {
                const effect = activeEffects[key];
                if (effect.active && now < effect.endTime) {
                    effect.remaining = effect.endTime - now;
                }
            }
        } else if (!paused && wasPaused) {
            const now = performance.now();
            if (runStats.pausedAt !== undefined) {
                runStats.startTime += now - runStats.pausedAt;
                delete runStats.pausedAt;
            }
            for (const key of ['slow', 'multiplier', 'freeze']) {
                const effect = activeEffects[key];
                if (effect.active && effect.remaining !== undefined) {
                    effect.endTime = now + effect.remaining;
                    delete effect.remaining;
                }
            }
        }
    }

    function onKeyDown(e) {
        if (e.repeat) return;
        if (e.key === 'Escape') {
            if (gameActive) setPaused(!paused);
            return;
        }
        if (!gameActive) {
            if (e.key === 'Enter' && (!ui.startScreen.classList.contains('hidden') || !ui.gameOverScreen.classList.contains('hidden'))) {
                startGame();
            }
            return;
        }
        if (paused) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
            e.preventDefault();
        }
        handleKeyInput(e.key);
    }

    function handleKeyInput(key) {
        if (!gameActive || paused) return;

        if (key === 'Backspace' && targetWord) {
            if (targetWord.typed.length > 0) {
                targetWord.typed = targetWord.typed.slice(0, -1);
                updateWordTexture(targetWord);
                updateTargetOverlay();
                audio.playClick();
            }
            return;
        }

        if (key.length !== 1) {
            if (key === 'Enter' && targetWord) {
                setTarget(null);
            }
            return;
        }

        const char = key.toLowerCase();
        runStats.keystrokes++;
        createKeyRipple();

        if (targetWord) {
            const nextChar = targetWord.text[targetWord.typed.length].toLowerCase();
            if (char === nextChar) {
                runStats.correctKeystrokes++;
                audio.playType();
                targetWord.typed += char;
                streak++;
                if (streak > bestStreak) bestStreak = streak;
                if (targetWord.typed.length === targetWord.text.length) {
                    destroyWord(targetWord, true);
                } else {
                    updateWordTexture(targetWord);
                    updateTargetOverlay();
                }
                updateHUD();
            } else {
                audio.playHit();
                streak = 0;
                targetWord.perfect = false;
                updateHUD();
            }
        } else {
            const candidate = findBestTargetForKey(char);
            if (candidate) {
                runStats.correctKeystrokes++;
                audio.playType();
                candidate.typed = char;
                streak++;
                setTarget(candidate);
                updateHUD();
            }
        }
    }

    function destroyWord(wordEntity, byPlayer) {
        if (targetWord === wordEntity) {
            setTarget(null);
        }

        if (wordEntity.isBoss) {
            if (byPlayer) {
                runStats.wordsDestroyed++;
                bossesDefeated++;
                audio.playHypeDestroy();
                const bossBonus = BOSS_BONUS + streak * 10;
                score += bossBonus;
                spawnScorePopup(wordEntity.sprite.position, `+${bossBonus}`, '#ff00cc');
                createMegaExplosion(wordEntity.sprite.position);
                createMegaExplosion(wordEntity.sprite.position.clone().add(new THREE.Vector3(5, 0, 0)));
                flashScreen();
                showToast('BOSS DEFEATED!', '#ff00cc');
                triggerScreenShake(2);
                bossActive = false;
            }
            scene.remove(wordEntity.sprite);
            wordEntity.sprite.material.map.dispose();
            wordEntity.sprite.material.dispose();
            words = words.filter(w => w !== wordEntity);
            advanceWave();
            updateHUD();
            AchievementManager.checkAll();
            return;
        }

        if (wordEntity.isHype) {
            if (byPlayer) {
                runStats.wordsDestroyed++;
                hypeTypedCount++;
                audio.playHypeDestroy();
                const hypeBonus = HYPE_BONUS + streak * 5;
                score += hypeBonus;
                spawnScorePopup(wordEntity.sprite.position, `+${hypeBonus}`, '#ff00cc');
                createMegaExplosion(wordEntity.sprite.position);
                flashScreen();
                showToast('HYPE!', '#ff00cc');
                createExplosion(wordEntity.sprite.position, '#ffffff', 64);
            }
            scene.remove(wordEntity.sprite);
            wordEntity.sprite.material.map.dispose();
            wordEntity.sprite.material.dispose();
            words = words.filter(w => w !== wordEntity);
            advanceWave();
            updateHUD();
            AchievementManager.checkAll();
            return;
        }

        if (wordEntity.isPowerUp) {
            if (byPlayer) {
                applyPowerUpEffect(wordEntity.powerUpType);
                score += 5;
            }
            scene.remove(wordEntity.sprite);
            wordEntity.sprite.material.map.dispose();
            wordEntity.sprite.material.dispose();
            words = words.filter(w => w !== wordEntity);
            updateHUD();
            return;
        }

        if (byPlayer) {
            runStats.wordsDestroyed++;
            audio.playDestroy();
            const wordLen = wordEntity.text.length;
            const basePoints = 10 * wordLen + Math.floor(streak / 5) * 5;
            const multiplier = (activeEffects.multiplier.active && performance.now() < activeEffects.multiplier.endTime) ? 2 : 1;
            let points = basePoints * multiplier * (wordEntity.isGolden ? 3 : 1);
            let popupLabel = `+${points}`;
            const popupColor = wordEntity.isGolden || wordEntity.perfect ? '#ffd700' : CONFIG.colors.typed;
            if (wordEntity.isGolden) runStats.goldenDestroyed++;
            if (wordEntity.perfect) {
                points += 5 * wordLen;
                runStats.perfectWords++;
                popupLabel = `PERFECT +${points}`;
            }
            score += points;
            spawnScorePopup(wordEntity.sprite.position, popupLabel, popupColor);
            createExplosion(wordEntity.sprite.position, wordEntity.isGolden ? '#ffd700' : CONFIG.colors.typed);
        }

        scene.remove(wordEntity.sprite);
        wordEntity.sprite.material.map.dispose();
        wordEntity.sprite.material.dispose();
        words = words.filter(w => w !== wordEntity);

        advanceWave();
        updateHUD();
        AchievementManager.checkAll();
    }

    function createExplosion(position, color, particleCount = 24) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 8 + Math.random() * 16;
            velocities.push({
                x: speed * Math.sin(phi) * Math.cos(theta),
                y: speed * Math.sin(phi) * Math.sin(theta),
                z: speed * Math.cos(phi)
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color, size: 0.45, transparent: true, opacity: 1 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        particles.push({ mesh: points, velocities, age: 0, life: 1.2 });
    }

    function disposeParticle(p) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
    }

    function clearParticles() {
        particles.forEach(disposeParticle);
        particles = [];
    }

    function createMegaExplosion(position) {
        const colors = [0xff0066, 0xff6600, 0xffcc00, 0x00ff66, 0x0099ff, 0x6600ff, 0xffffff];
        colors.forEach((color, i) => {
            setTimeout(() => {
                createExplosion(
                    position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4)),
                    color,
                    28
                );
            }, i * 50);
        });
    }

    function flashScreen(kind) {
        if (!ui.screenFlash) return;
        ui.screenFlash.classList.toggle('danger', kind === 'danger');
        ui.screenFlash.classList.add('active');
        setTimeout(() => {
            ui.screenFlash.classList.remove('active');
        }, 80);
    }

    function damagePlayer() {
        if (!gameActive) return;
        if (activeEffects.shield.active) {
            activeEffects.shield.active = false;
            updateActiveEffectsUI();
            showToast('Shield Absorbed', '#a0ff00');
            audio.playShieldHit();
            return;
        }
        audio.playDamage();
        health -= 12;
        streak = 0;
        flashScreen('danger');
        triggerScreenShake(1.5);
        if (health <= 0) health = 0;
        updateHUD();
        if (health <= 0) endGame();
    }

    function advanceWave() {
        const newWave = 1 + Math.floor(score / 400);
        if (newWave > wave) {
            const bossDue = Math.floor(newWave / BOSS_WAVE_INTERVAL) > Math.floor(wave / BOSS_WAVE_INTERVAL);
            wave = newWave;
            audio.playWaveAdvance();
            showBanner(`WAVE ${wave}`, 1600, true);
            if (bossDue && !bossActive) {
                const scheduledRun = runId;
                setTimeout(() => {
                    if (gameActive && runId === scheduledRun && !bossActive) {
                        spawnBossWord();
                    }
                }, 1500);
            }
        }
    }

    function updateHUD() {
        ui.score.textContent = score;
        ui.streak.textContent = streak;
        ui.wave.textContent = wave;
        ui.healthFill.style.width = `${health}%`;
        updateComboMeter();

        const mins = (performance.now() - runStats.startTime) / 60000;
        ui.hudWpm.textContent = mins > 0.01 ? Math.round((runStats.correctKeystrokes / 5) / mins) : 0;
        ui.hudAcc.textContent = runStats.keystrokes > 0
            ? `${Math.round((runStats.correctKeystrokes / runStats.keystrokes) * 100)}%`
            : '—';

        const theme = THEMES[currentTheme];
        if (health > 50) {
            ui.healthFill.style.background = `linear-gradient(90deg, ${theme.colors.healthHigh[0]}, ${theme.colors.healthHigh[1]})`;
        } else if (health > 25) {
            ui.healthFill.style.background = 'linear-gradient(90deg, #ffcc00, #ff3b6b)';
        } else {
            ui.healthFill.style.background = 'linear-gradient(90deg, #ff3b6b, #900020)';
        }
    }

    function updateVirtualKeyboardVisibility() {
        const showKeyboard = gameActive && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
        ui.virtualKeyboard.classList.toggle('hidden', !showKeyboard);
    }

    function startGame() {
        audio.init();
        audio.startMusic();
        demoMode = false;
        setPaused(false);
        clearAds();

        words.forEach(w => {
            scene.remove(w.sprite);
            w.sprite.material.map.dispose();
            w.sprite.material.dispose();
        });
        words = [];
        clearParticles();
        targetWord = null;

        activeEffects.slow.active = false;
        activeEffects.multiplier.active = false;
        activeEffects.shield.active = false;
        activeEffects.freeze.active = false;
        updateActiveEffectsUI();
        ui.powerUpToast.classList.add('hidden');
        ui.activeEffects.classList.add('hidden');
        ui.screenFlash.classList.remove('active');
        ui.dangerVignette.classList.remove('active');

        score = 0;
        streak = 0;
        bestStreak = 0;
        health = 100;
        wave = 1;
        timeElapsed = 0;
        spawnTimer = 0;
        powerUpTimer = 4;
        hypeTimer = 8;
        bossActive = false;
        runId++;
        hypeTypedCount = 0;
        bossesDefeated = 0;
        screenShakeIntensity = 0;
        adTimer = 5;
        runStats = { keystrokes: 0, correctKeystrokes: 0, wordsDestroyed: 0, perfectWords: 0, goldenDestroyed: 0, startTime: performance.now() };

        ui.startScreen.classList.add('hidden');
        ui.customizeScreen.classList.add('hidden');
        ui.achievementsScreen.classList.add('hidden');
        ui.gameOverScreen.classList.add('hidden');
        ui.hud.classList.remove('hidden');
        ui.typingTarget.classList.add('hidden');

        updateHUD();
        gameActive = true;
        updateVirtualKeyboardVisibility();
        lastTime = performance.now();
    }

    function endGameCleanup() {
        ui.virtualKeyboard.classList.add('hidden');
    }

    function quitToMenu() {
        gameActive = false;
        setPaused(false);
        audio.stopMusic();
        targetWord = null;
        bossActive = false;
        activeEffects.slow.active = false;
        activeEffects.multiplier.active = false;
        activeEffects.shield.active = false;
        activeEffects.freeze.active = false;
        updateActiveEffectsUI();
        ui.hud.classList.add('hidden');
        ui.typingTarget.classList.add('hidden');
        ui.activeEffects.classList.add('hidden');
        ui.powerUpToast.classList.add('hidden');
        ui.screenFlash.classList.remove('active');
        ui.dangerVignette.classList.remove('active');
        returnToMenu();
    }

    function endGame() {
        if (!gameActive) return;
        gameActive = false;
        setPaused(false);
        demoMode = true;
        demoSpawnTimer = 1;
        targetWord = null;
        bossActive = false;
        activeEffects.slow.active = false;
        activeEffects.multiplier.active = false;
        activeEffects.shield.active = false;
        activeEffects.freeze.active = false;
        updateActiveEffectsUI();
        audio.stopMusic();
        audio.playGameOver();
        ui.hud.classList.add('hidden');
        ui.typingTarget.classList.add('hidden');
        ui.activeEffects.classList.add('hidden');
        ui.powerUpToast.classList.add('hidden');
        ui.screenFlash.classList.remove('active');
        ui.virtualKeyboard.classList.add('hidden');
        ui.comboMeter.classList.add('hidden');
        ui.bossBanner.classList.add('hidden');
        ui.dangerVignette.classList.remove('active');
        ui.gameOverScreen.classList.remove('hidden');
        ui.finalScore.textContent = score;
        ui.finalStreak.textContent = bestStreak;
        ui.finalWave.textContent = wave;

        const runTime = Math.max(0, (performance.now() - runStats.startTime) / 1000);
        runStats.time = runTime;
        runStats.score = score;
        runStats.wave = wave;
        runStats.bestStreak = bestStreak;
        runStats.bossesDefeated = bossesDefeated;

        const minutes = runTime / 60;
        const wpm = minutes > 0 ? Math.round((runStats.correctKeystrokes / 5) / minutes) : 0;
        const accuracy = runStats.keystrokes > 0 ? Math.round((runStats.correctKeystrokes / runStats.keystrokes) * 100) : 0;

        ui.runStats.wpm.textContent = wpm;
        ui.runStats.accuracy.textContent = `${accuracy}%`;
        ui.runStats.words.textContent = runStats.wordsDestroyed;
        ui.runStats.time.textContent = `${Math.floor(runTime)}s`;

        AchievementManager.checkAll();
        const isHigh = LeaderboardManager.isHighScore(score);
        if (score > 0) {
            LeaderboardManager.add({ score, wave, streak: bestStreak, difficulty: currentDifficulty, date: Date.now() });
        }
        StatsManager.addRun(runStats);
        Object.assign(globalStats, StatsManager.load());
        renderGlobalStats();
        renderLeaderboard(ui.leaderboardListEnd);
        renderLeaderboard(ui.leaderboardList);
        ui.newHighScore.classList.toggle('hidden', !isHigh || score === 0);
    }

    function update(dt) {
        if (!gameActive) {
            if (demoMode) {
                updateDemoMode(dt);
            }
            updateBackground(dt);
            return;
        }

        timeElapsed += dt;
        spawnTimer -= dt;
        powerUpTimer -= dt;

        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const spawnInterval = Math.max(diff.spawnMin, diff.spawnBase - wave * 0.22 - timeElapsed * 0.012);
        if (spawnTimer <= 0) {
            spawnWord();
            spawnTimer = spawnInterval;
        }

        if (powerUpTimer <= 0) {
            spawnPowerUp();
            powerUpTimer = 7 + Math.random() * 6;
        }

        hypeTimer -= dt;
        if (hypeTimer <= 0) {
            spawnHypeWord();
            hypeTimer = 12 + Math.random() * 10;
        }

        const now = performance.now();
        if (activeEffects.slow.active && now >= activeEffects.slow.endTime) activeEffects.slow.active = false;
        if (activeEffects.multiplier.active && now >= activeEffects.multiplier.endTime) activeEffects.multiplier.active = false;
        if (activeEffects.freeze.active && now >= activeEffects.freeze.endTime) activeEffects.freeze.active = false;
        updateActiveEffectsUI();

        let closestZ = -Infinity;

        for (let i = words.length - 1; i >= 0; i--) {
            const w = words[i];
            if (!w.isPowerUp && !w.isHype) {
                closestZ = Math.max(closestZ, w.sprite.position.z);
            }
            w.sprite.position.z += getEffectiveSpeed(w) * dt;
            w.wobble += dt * 2.5;
            w.sprite.position.y += Math.sin(w.wobble) * 0.015;

            if (w.isBoss) {
                w.sprite.material.rotation += w.rotationSpeed * dt;
                const bossPulse = 1.2 + Math.sin(w.wobble * 2) * 0.15;
                w.sprite.scale.set(
                    w.originalScale.x * bossPulse,
                    w.originalScale.y * bossPulse,
                    1
                );
            } else if (w.isHype) {
                w.sprite.material.rotation += w.rotationSpeed * dt;
                const hypePulse = 1.3 + Math.sin(w.wobble * 3) * 0.2;
                w.sprite.scale.set(
                    w.originalScale.x * hypePulse,
                    w.originalScale.y * hypePulse,
                    1
                );
            } else {
                const scalePulse = w.isTarget ? 1.15 + Math.sin(w.wobble * 2) * 0.06 : 1;
                w.sprite.scale.set(
                    w.originalScale.x * scalePulse,
                    w.originalScale.y * scalePulse,
                    1
                );
            }

            if (w.sprite.position.z > -CONFIG.despawnDistance) {
                if (!w.isPowerUp && !w.isHype) damagePlayer();
                createExplosion(w.sprite.position, CONFIG.colors.warning);
                if (targetWord === w) setTarget(null);
                scene.remove(w.sprite);
                w.sprite.material.map.dispose();
                w.sprite.material.dispose();
                words.splice(i, 1);
                if (w.isBoss) {
                    bossActive = false;
                    showToast('BOSS ESCAPED', CONFIG.colors.warning);
                }
            }
        }

        ui.dangerVignette.classList.toggle('active', closestZ > -CONFIG.dangerDistance);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.age += dt;
            const positions = p.mesh.geometry.attributes.position.array;
            for (let j = 0; j < p.velocities.length; j++) {
                positions[j * 3] += p.velocities[j].x * dt;
                positions[j * 3 + 1] += p.velocities[j].y * dt;
                positions[j * 3 + 2] += p.velocities[j].z * dt;
            }
            p.mesh.geometry.attributes.position.needsUpdate = true;
            p.mesh.material.opacity = Math.max(0, 1 - p.age / p.life);
            if (p.age >= p.life) {
                disposeParticle(p);
                particles.splice(i, 1);
            }
        }

        const speed = 18 * dt;
        for (const ring of tunnelRings) {
            ring.position.z += speed;
            if (ring.position.z > 5) {
                ring.position.z = -CONFIG.spawnDistance + 10;
            }
        }

        updateNebula(dt);
        updateScreenShake(dt);
        updateAds(dt);
        updateStarfield(dt);
    }

    function updateStarfield(dt) {
        const starPositions = starField.geometry.attributes.position.array;
        const starSpeeds = starField.geometry.attributes.speed.array;
        for (let i = 0; i < starSpeeds.length; i++) {
            starPositions[i * 3 + 2] += starSpeeds[i] * dt * 30;
            if (starPositions[i * 3 + 2] > 30) {
                starPositions[i * 3 + 2] = -200;
                starPositions[i * 3] = (Math.random() - 0.5) * 180;
                starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            }
        }
        starField.geometry.attributes.position.needsUpdate = true;
    }

    function updateBackground(dt) {
        const speed = 18 * dt;
        for (const ring of tunnelRings) {
            ring.position.z += speed;
            if (ring.position.z > 5) {
                ring.position.z = -CONFIG.spawnDistance + 10;
            }
        }
        updateNebula(dt);
        updateStarfield(dt);
    }

    function updateDemoMode(dt) {
        demoSpawnTimer -= dt;
        if (demoSpawnTimer <= 0) {
            spawnDemoWord();
            demoSpawnTimer = 1.5 + Math.random() * 1.5;
        }
        updateAds(dt);

        for (let i = words.length - 1; i >= 0; i--) {
            const w = words[i];
            w.sprite.position.z += w.speed * dt;
            w.wobble += dt * 2.5;
            w.sprite.position.y += Math.sin(w.wobble) * 0.015;
            const scalePulse = 1 + Math.sin(w.wobble * 2) * 0.06;
            w.sprite.scale.set(
                w.originalScale.x * scalePulse,
                w.originalScale.y * scalePulse,
                1
            );

            if (w.sprite.position.z > 5) {
                scene.remove(w.sprite);
                w.sprite.material.map.dispose();
                w.sprite.material.dispose();
                words.splice(i, 1);
                if (w.isBoss) bossActive = false;
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.age += dt;
            const positions = p.mesh.geometry.attributes.position.array;
            for (let j = 0; j < p.velocities.length; j++) {
                positions[j * 3] += p.velocities[j].x * dt;
                positions[j * 3 + 1] += p.velocities[j].y * dt;
                positions[j * 3 + 2] += p.velocities[j].z * dt;
            }
            p.mesh.geometry.attributes.position.needsUpdate = true;
            p.mesh.material.opacity = Math.max(0, 1 - p.age / p.life);
            if (p.age >= p.life) {
                disposeParticle(p);
                particles.splice(i, 1);
            }
        }
    }

    function spawnDemoWord() {
        if (!DIFFICULTY[currentDifficulty]) currentDifficulty = 'normal';
        const diff = DIFFICULTY[currentDifficulty];
        const pool = pickWordPool(diff);
        const text = pool[Math.floor(Math.random() * pool.length)];
        const { texture, aspect } = createWordTexture(text, 0, false);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(material);
        const baseScale = 3.6;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        const angle = (Math.random() - 0.5) * 1.4;
        const radius = (Math.random() - 0.5) * 18;
        const yOffset = (Math.random() - 0.5) * 12;

        sprite.position.set(
            Math.sin(angle) * 16 + radius,
            yOffset,
            -CONFIG.spawnDistance
        );

        const speed = CONFIG.baseSpeed * diff.speedMult * 0.7 * (0.85 + Math.random() * 0.35);

        const entity = {
            text,
            sprite,
            typed: '',
            speed,
            isTarget: false,
            wobble: Math.random() * Math.PI * 2,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        words.push(entity);
    }

    const AD_SIGNS = [
        { text: 'HYPER COLA', color: '#ff3b6b' },
        { text: 'NEON RAMEN', color: '#ffb020' },
        { text: 'STAR SHIPPING', color: '#00f0ff' },
        { text: 'VOID MOTORS', color: '#a0ff00' },
        { text: 'ORBITAL TV', color: '#ff00cc' },
        { text: 'PIXEL PETS', color: '#7d2cff' }
    ];

    function roundedRectPath(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    function createAdTexture(text, colorHex) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '800 42px "Segoe UI", Roboto, sans-serif';
        const metrics = ctx.measureText(text);
        canvas.width = Math.ceil(metrics.width + 110);
        canvas.height = 118;

        ctx.font = '800 42px "Segoe UI", Roboto, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 5;
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 24;
        roundedRectPath(ctx, 12, 12, canvas.width - 24, canvas.height - 24, 22);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, cx, cy - 12);

        ctx.font = '600 16px "Segoe UI", Roboto, sans-serif';
        ctx.shadowBlur = 8;
        ctx.fillStyle = colorHex;
        ctx.fillText('· SPONSORED ·', cx, cy + 28);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return { texture, aspect: canvas.width / canvas.height };
    }

    function spawnAdSign() {
        const sign = AD_SIGNS[Math.floor(Math.random() * AD_SIGNS.length)];
        const { texture, aspect } = createAdTexture(sign.text, sign.color);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.85 });
        const sprite = new THREE.Sprite(material);
        const baseScale = 5;
        sprite.scale.set(baseScale * aspect, baseScale, 1);

        const side = Math.random() < 0.5 ? -1 : 1;
        sprite.position.set(
            side * (24 + sprite.scale.x / 2 + Math.random() * 8),
            (Math.random() - 0.5) * 14,
            -CONFIG.spawnDistance
        );

        const speed = CONFIG.baseSpeed * 0.4 * (0.8 + Math.random() * 0.4);

        const entity = {
            sprite,
            speed,
            wobble: Math.random() * Math.PI * 2,
            driftX: side * 0.4,
            originalScale: { x: sprite.scale.x, y: sprite.scale.y }
        };

        scene.add(sprite);
        adEntities.push(entity);
    }

    function updateAds(dt) {
        adTimer -= dt;
        if (adTimer <= 0) {
            spawnAdSign();
            adTimer = 8 + Math.random() * 10;
        }

        for (let i = adEntities.length - 1; i >= 0; i--) {
            const ad = adEntities[i];
            ad.sprite.position.z += ad.speed * dt;
            ad.wobble += dt * 1.5;
            ad.sprite.position.x += Math.sin(ad.wobble) * 0.02 + ad.driftX * dt;
            ad.sprite.position.y += Math.cos(ad.wobble) * 0.015;

            const pulse = 1 + Math.sin(ad.wobble * 2) * 0.05;
            ad.sprite.scale.set(
                ad.originalScale.x * pulse,
                ad.originalScale.y * pulse,
                1
            );

            if (ad.sprite.position.z > 10) {
                scene.remove(ad.sprite);
                ad.sprite.material.map.dispose();
                ad.sprite.material.dispose();
                adEntities.splice(i, 1);
            }
        }
    }

    function clearAds() {
        adEntities.forEach(ad => {
            scene.remove(ad.sprite);
            ad.sprite.material.map.dispose();
            ad.sprite.material.dispose();
        });
        adEntities = [];
    }

    function animate(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        if (!paused) update(dt);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updateVirtualKeyboardVisibility();
    }

    init();
})();

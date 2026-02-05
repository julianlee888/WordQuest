/**
 * Word Quest - Utilities
 */

const Utils = {
    // 日期格式化
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    // 取得今天日期字串
    getToday() {
        return this.formatDate(new Date());
    },

    // 計算兩個日期相差天數
    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // 檢查是否為連續天
    isConsecutiveDay(lastDate) {
        if (!lastDate) return false;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return this.formatDate(lastDate) === this.formatDate(yesterday);
    },

    // 隨機打亂陣列
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // 從陣列隨機取 n 個
    randomPick(array, n) {
        return this.shuffle(array).slice(0, n);
    },

    // 防抖函數
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 節流函數
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 本地儲存
    storage: {
        get(key) {
            try {
                const item = localStorage.getItem(`wordquest_${key}`);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(`wordquest_${key}`, JSON.stringify(value));
            } catch (e) {
                console.error('Storage set error:', e);
            }
        },

        remove(key) {
            localStorage.removeItem(`wordquest_${key}`);
        },

        clear() {
            Object.keys(localStorage)
                .filter(key => key.startsWith('wordquest_'))
                .forEach(key => localStorage.removeItem(key));
        }
    },

    // 計算經驗值等級
    calculateLevel(exp) {
        // 每級需要的經驗值遞增
        // Level 1: 0-99, Level 2: 100-299, Level 3: 300-599...
        let level = 1;
        let expNeeded = 100;
        let totalExp = 0;

        while (exp >= totalExp + expNeeded) {
            totalExp += expNeeded;
            level++;
            expNeeded = level * 100;
        }

        const currentLevelExp = exp - totalExp;
        const progress = (currentLevelExp / expNeeded) * 100;

        return { level, progress, expNeeded, currentLevelExp };
    },

    // 計算星星數量（根據正確率）
    calculateStars(correct, total) {
        const percentage = (correct / total) * 100;
        if (percentage >= 90) return 3;
        if (percentage >= 70) return 2;
        if (percentage >= 50) return 1;
        return 0;
    },

    // 語音合成（發音）
    speak(text, lang = 'en-US') {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('瀏覽器不支援語音合成']);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9;
            utterance.pitch = 1;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);

            speechSynthesis.speak(utterance);
        });
    },

    // 產生唯一 ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 複製到剪貼簿
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.error('Copy failed:', e);
            return false;
        }
    },

    // 動畫框架
    animate(element, animation, duration = 500) {
        return new Promise(resolve => {
            element.style.animation = `${animation} ${duration}ms ease`;
            element.addEventListener('animationend', () => {
                element.style.animation = '';
                resolve();
            }, { once: true });
        });
    },

    // 等待
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // 週幾中文
    getWeekdayName(date) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return days[new Date(date).getDay()];
    },

    // 劍橋等級名稱
    getCambridgeLevelName(level) {
        const names = {
            'preA1': 'Pre A1 Starters',
            'A1': 'A1 Movers',
            'A2': 'A2 Flyers',
            'KET': 'A2 Key (KET)',
            'PET': 'B1 Preliminary (PET)',
            'FCE': 'B2 First (FCE)'
        };
        return names[level] || level;
    },

    // 等級顏色
    getLevelColor(level) {
        const colors = {
            'preA1': '#10b981',
            'A1': '#3b82f6',
            'A2': '#8b5cf6',
            'KET': '#f59e0b',
            'PET': '#ec4899',
            'FCE': '#ef4444'
        };
        return colors[level] || '#7c3aed';
    }
};

window.Utils = Utils;

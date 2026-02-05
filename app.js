/**
 * Word Quest - Main Application
 */

const App = {
    // 初始化應用
    async init() {
        console.log('🎮 Word Quest 啟動中...');

        try {
            // 模擬載入動畫
            await this.simulateLoading();
            console.log('✅ 載入動畫完成');

            // 初始化認證
            console.log('🔐 初始化認證...');
            const user = await Auth.init();
            console.log('✅ 認證初始化完成, user:', user ? '已登入' : '未登入');

            if (user) {
                // 已登入，直接進入使用者登入後流程
                console.log('🚀 使用者已登入，進入遊戲...');
                await this.onUserLoggedIn();
            } else {
                // 顯示登入畫面（這會自動隱藏載入畫面）
                console.log('📱 顯示登入畫面...');
                UI.showScreen('login-screen');
                this.bindLoginEvents();
            }

        } catch (error) {
            console.error('初始化失敗:', error);
            UI.showToast('載入失敗，請重新整理頁面', 'error');
            // 即使出錯也顯示登入畫面
            UI.showScreen('login-screen');
            this.bindLoginEvents();
        }
    },

    // 模擬載入動畫
    async simulateLoading() {
        return new Promise(resolve => {
            const progress = document.querySelector('.loading-progress');
            const text = document.querySelector('.loading-text');

            const messages = [
                '正在載入冒險世界...',
                '準備單字寶庫...',
                '召喚遊戲精靈...',
                '即將開始冒險！'
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < messages.length) {
                    text.textContent = messages[i];
                    i++;
                }
            }, 400);

            setTimeout(() => {
                clearInterval(interval);
                resolve();
            }, 2000);
        });
    },

    // 綁定登入事件
    bindLoginEvents() {
        const loginBtn = document.getElementById('google-login-btn');

        loginBtn?.addEventListener('click', async () => {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="animate-spin">⏳</span> 登入中...';

            try {
                await Auth.signInWithGoogle();
                await this.onUserLoggedIn();
            } catch (error) {
                console.error('登入失敗:', error);
                UI.showToast('登入失敗，請稍後再試', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = `
                    <svg class="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    使用 Google 帳號登入
                `;
            }
        });
    },

    // 使用者登入後
    async onUserLoggedIn() {
        const profile = await UserData.getProfile();

        // 更新連續天數
        await UserData.updateStreak();

        // 檢查是否需要等級測試
        if (!profile.currentLevel) {
            // 首次登入，進行等級測試
            UI.showScreen('level-test-screen');
            this.startLevelTest();
        } else {
            // 直接進入遊戲
            UI.showScreen('game-screen');
            UI.bindEvents();
            await UI.refreshDashboard();

            // 歡迎訊息
            const today = Utils.getToday();
            if (profile.lastActiveDate !== today) {
                UI.showToast(`歡迎回來！連續 ${profile.streak} 天了！🔥`, 'success');
            }
        }
    },

    // 等級測試
    testQuestions: [],
    testIndex: 0,
    testCorrect: 0,

    startLevelTest() {
        // 從各等級抽取題目
        const levels = ['preA1', 'A1', 'A2', 'KET', 'PET', 'FCE'];
        this.testQuestions = [];

        levels.forEach(level => {
            const levelWords = WordBank.words.filter(w => w.level === level);
            const selected = Utils.randomPick(levelWords, 2);
            this.testQuestions.push(...selected.map(word => ({
                word: word.word,
                correct: word.chinese,
                level: level,
                options: this.generateTestOptions(word)
            })));
        });

        // 打亂順序（但保持由易到難的趨勢）
        this.testIndex = 0;
        this.testCorrect = 0;
        this.testResults = [];

        this.renderTestQuestion();
    },

    generateTestOptions(word) {
        // 取得同等級的其他單字作為干擾選項
        const sameLevel = WordBank.words.filter(w => w.level === word.level && w.id !== word.id);
        const others = Utils.randomPick(sameLevel, 3).map(w => w.chinese);
        return Utils.shuffle([word.chinese, ...others]);
    },

    renderTestQuestion() {
        const area = document.getElementById('test-question-area');
        const progress = document.getElementById('test-progress-fill');
        const progressText = document.getElementById('test-progress-text');

        if (this.testIndex >= this.testQuestions.length) {
            this.finishLevelTest();
            return;
        }

        const question = this.testQuestions[this.testIndex];
        const percent = (this.testIndex / this.testQuestions.length) * 100;

        progress.style.width = `${percent}%`;
        progressText.textContent = `${this.testIndex} / ${this.testQuestions.length}`;

        area.innerHTML = `
            <div class="test-question animate-fade-in">
                <h3 class="test-word">${question.word}</h3>
                <div class="test-options">
                    ${question.options.map(opt => `
                        <button class="test-option" data-answer="${opt}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        // 綁定選項點擊
        area.querySelectorAll('.test-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                const isCorrect = answer === question.correct;

                // 視覺回饋
                if (isCorrect) {
                    btn.classList.add('correct');
                    this.testCorrect++;
                    this.testResults.push({ level: question.level, correct: true });
                } else {
                    btn.classList.add('wrong');
                    // 顯示正確答案
                    area.querySelectorAll('.test-option').forEach(b => {
                        if (b.dataset.answer === question.correct) {
                            b.classList.add('correct');
                        }
                    });
                    this.testResults.push({ level: question.level, correct: false });
                }

                // 禁用所有選項
                area.querySelectorAll('.test-option').forEach(b => b.disabled = true);

                // 下一題
                setTimeout(() => {
                    this.testIndex++;
                    this.renderTestQuestion();
                }, 1000);
            });
        });
    },

    async finishLevelTest() {
        // 計算結果 - 根據各等級正確率決定等級
        const levelScores = {};
        const levels = ['preA1', 'A1', 'A2', 'KET', 'PET', 'FCE'];

        levels.forEach(level => {
            const levelResults = this.testResults.filter(r => r.level === level);
            const correct = levelResults.filter(r => r.correct).length;
            levelScores[level] = correct / levelResults.length;
        });

        // 找到最高通過的等級（正確率 >= 50%）
        let determinedLevel = 'preA1';
        for (const level of levels) {
            if (levelScores[level] >= 0.5) {
                determinedLevel = level;
            } else {
                break; // 一旦某等級沒過，就停止
            }
        }

        // 顯示結果
        const area = document.getElementById('test-question-area');
        area.classList.add('hidden');

        const result = document.getElementById('test-result');
        result.classList.remove('hidden');

        const levelEmojis = {
            'preA1': '🌱',
            'A1': '🌿',
            'A2': '🌳',
            'KET': '⭐',
            'PET': '🌟',
            'FCE': '👑'
        };

        result.innerHTML = `
            <div class="animate-zoom-in">
                <div class="result-level">${levelEmojis[determinedLevel]}</div>
                <h2 class="result-title">你的起始等級是 ${determinedLevel}！</h2>
                <p class="result-desc">
                    ${Utils.getCambridgeLevelName(determinedLevel)}<br>
                    正確率：${Math.round((this.testCorrect / this.testQuestions.length) * 100)}%
                </p>
                <button id="start-adventure" class="btn btn-primary btn-glow">
                    🎮 開始冒險！
                </button>
            </div>
        `;

        // 儲存等級
        await UserData.updateProfile({ currentLevel: determinedLevel });

        // 檢查等級成就
        await Achievements.check('cambridge_level');

        // 綁定開始按鈕
        document.getElementById('start-adventure').addEventListener('click', async () => {
            UI.showScreen('game-screen');
            UI.bindEvents();
            await UI.refreshDashboard();
            UI.showToast('歡迎來到 Word Quest！開始你的冒險吧！🎮', 'success');
        });
    }
};

// 啟動應用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;

/**
 * Word Quest - UI Module
 */

const UI = {
    // 顯示/隱藏畫面
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
        }
    },

    // 顯示視圖（在遊戲畫面內切換）
    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        const target = document.getElementById(`${viewId}-view`);
        if (target) {
            target.classList.remove('hidden');
        }
    },

    // 顯示 Toast 通知
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // 更新玩家資訊顯示
    async updatePlayerInfo() {
        const profile = await UserData.getProfile();
        if (!profile) return;

        const user = Auth.getUser();

        // 頭像
        const avatar = document.getElementById('player-avatar');
        if (avatar) {
            avatar.src = user?.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + (user?.uid || 'default');
        }

        // 名稱
        const name = document.getElementById('player-name');
        if (name) {
            name.textContent = profile.displayName || user?.displayName || '冒險者';
        }

        // 等級
        const levelInfo = Utils.calculateLevel(profile.exp || 0);
        const levelBadge = document.getElementById('player-level-badge');
        if (levelBadge) {
            levelBadge.textContent = `Lv.${levelInfo.level}`;
        }

        // 經驗值條
        const expFill = document.getElementById('exp-fill');
        if (expFill) {
            expFill.style.width = `${levelInfo.progress}%`;
        }

        // 連續天數
        const streak = document.getElementById('streak-count');
        if (streak) {
            streak.textContent = profile.streak || 0;
        }

        // 總積分
        const points = document.getElementById('total-points');
        if (points) {
            points.textContent = profile.totalPoints || 0;
        }

        // 學習單字數
        const logs = await UserData.getLearningLog();
        const wordsLearned = document.getElementById('words-learned');
        if (wordsLearned) {
            wordsLearned.textContent = logs.length;
        }
    },

    // 更新今日進度
    async updateDailyProgress() {
        const profile = await UserData.getProfile();
        const progress = await UserData.getTodayProgress();
        const target = profile?.dailyLimit || 10;

        // 更新日期
        const dateEl = document.getElementById('daily-date');
        if (dateEl) {
            const today = new Date();
            dateEl.textContent = `${today.getMonth() + 1}/${today.getDate()} (${Utils.getWeekdayName(today)})`;
        }

        // 更新數字
        const learnedEl = document.getElementById('daily-learned');
        const targetEl = document.getElementById('daily-target');
        if (learnedEl) learnedEl.textContent = progress.newWords;
        if (targetEl) targetEl.textContent = target;

        // 更新進度環
        const progressRing = document.getElementById('daily-progress-ring');
        if (progressRing) {
            const percentage = Math.min(progress.newWords / target, 1);
            const circumference = 2 * Math.PI * 45; // r=45
            const offset = circumference * (1 - percentage);
            progressRing.style.strokeDashoffset = offset;
        }

        // 更新按鈕狀態
        const startBtn = document.getElementById('start-learning-btn');
        if (startBtn) {
            if (progress.newWords >= target) {
                startBtn.innerHTML = '<span class="btn-icon">✅</span> 今日目標完成！';
                startBtn.classList.add('btn-success');
            }
        }
    },

    // 更新複習統計
    async updateReviewStats() {
        const toReview = await UserData.getWordsToReview();
        const mastered = await UserData.getMasteredCount();

        const toReviewEl = document.getElementById('words-to-review');
        const masteredEl = document.getElementById('mastered-words');

        if (toReviewEl) toReviewEl.textContent = toReview.length;
        if (masteredEl) masteredEl.textContent = mastered;
    },

    // 更新週統計圖表
    async updateWeeklyChart() {
        const stats = await UserData.getWeeklyStats();
        const chartEl = document.getElementById('weekly-chart');
        if (!chartEl) return;

        const maxCount = Math.max(...stats.map(s => s.count), 1);

        chartEl.innerHTML = stats.map(stat => {
            const height = (stat.count / maxCount) * 80 + 10;
            return `
                <div class="chart-bar-wrapper">
                    <div class="chart-bar" style="height: ${height}px" title="${stat.count} 個單字">
                    </div>
                    <span class="chart-label">${stat.day}</span>
                </div>
            `;
        }).join('');
    },

    // 更新劍橋等級進度
    async updateCambridgeProgress() {
        const logs = await UserData.getLearningLog();
        const learnedWordIds = new Set(logs.map(l => l.wordId));

        const levels = ['preA1', 'A1', 'A2', 'KET', 'PET', 'FCE'];
        const container = document.getElementById('cambridge-levels');
        if (!container) return;

        container.innerHTML = levels.map(level => {
            const levelWords = WordBank.words.filter(w => w.level === level);
            const learnedCount = levelWords.filter(w => learnedWordIds.has(w.id)).length;
            const total = levelWords.length;
            const percentage = total > 0 ? (learnedCount / total) * 100 : 0;
            const color = Utils.getLevelColor(level);

            return `
                <div class="cambridge-level">
                    <span class="level-name" style="color: ${color}">${level}</span>
                    <div class="level-bar">
                        <div class="level-fill" style="width: ${percentage}%; background: ${color}"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // 更新排行榜
    async updateLeaderboard(type = 'weekly') {
        const entries = await UserData.getLeaderboard(type);
        const container = document.getElementById('leaderboard-list');
        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = '<p class="no-data">尚無排行資料</p>';
            return;
        }

        container.innerHTML = entries.map((entry, index) => `
            <div class="leaderboard-entry">
                <span class="leaderboard-rank">${index + 1}</span>
                <img class="leaderboard-avatar" 
                     src="${entry.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + entry.uid}" 
                     alt="Avatar">
                <span class="leaderboard-name">${entry.displayName || '冒險者'}</span>
                <span class="leaderboard-points">${entry.totalPoints || 0}</span>
            </div>
        `).join('');
    },

    // 綁定事件
    bindEvents() {
        // 開始學習按鈕
        document.getElementById('start-learning-btn')?.addEventListener('click', () => {
            this.startLearning();
        });

        // 複習按鈕
        document.getElementById('start-review-btn')?.addEventListener('click', () => {
            this.startReview();
        });

        // 遊戲按鈕
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameType = btn.dataset.game;
                this.showView('game');
                Games.startGame(gameType);
            });
        });

        // 每日上限選擇
        document.querySelectorAll('.limit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                document.querySelectorAll('.limit-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const limit = parseInt(btn.dataset.limit);
                await UserData.updateProfile({ dailyLimit: limit });
                this.updateDailyProgress();
            });
        });

        // 選單按鈕
        document.getElementById('menu-btn')?.addEventListener('click', () => {
            document.getElementById('side-menu').classList.remove('hidden');
            document.getElementById('menu-overlay').classList.remove('hidden');
        });

        document.getElementById('close-menu')?.addEventListener('click', this.closeMenu);
        document.getElementById('menu-overlay')?.addEventListener('click', this.closeMenu);

        // 選單項目
        document.getElementById('menu-dashboard')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('dashboard');
            this.closeMenu();
        });

        document.getElementById('menu-achievements')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('achievements');
            Achievements.render('achievements-grid');
            this.closeMenu();
        });

        document.getElementById('menu-logout')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await Auth.signOut();
            location.reload();
        });

        // 返回按鈕
        document.getElementById('back-to-dashboard')?.addEventListener('click', () => {
            this.showView('dashboard');
            this.refreshDashboard();
        });

        document.getElementById('exit-game')?.addEventListener('click', () => {
            this.showView('dashboard');
            this.refreshDashboard();
        });

        document.getElementById('exit-review')?.addEventListener('click', () => {
            this.showView('dashboard');
            this.refreshDashboard();
        });

        document.getElementById('exit-achievements')?.addEventListener('click', () => {
            this.showView('dashboard');
        });

        // 成就查看全部
        document.getElementById('view-all-achievements')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showView('achievements');
            Achievements.render('achievements-grid');
        });

        // 排行榜分頁
        document.querySelectorAll('.leaderboard-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.leaderboard-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateLeaderboard(btn.dataset.tab);
            });
        });
    },

    closeMenu() {
        document.getElementById('side-menu').classList.add('hidden');
        document.getElementById('menu-overlay').classList.add('hidden');
    },

    // 開始學習
    async startLearning() {
        const profile = await UserData.getProfile();
        const progress = await UserData.getTodayProgress();
        const remaining = (profile?.dailyLimit || 10) - progress.newWords;

        if (remaining <= 0) {
            this.showToast('今日學習目標已完成！試試複習或遊戲吧！', 'info');
            return;
        }

        // 取得未學過的單字
        const logs = await UserData.getLearningLog();
        const learnedIds = new Set(logs.map(l => l.wordId));
        const level = profile?.currentLevel || 'A1';

        let newWords = WordBank.words.filter(w =>
            !learnedIds.has(w.id) &&
            WordBank.getLevelOrder(w.level) <= WordBank.getLevelOrder(level)
        );

        if (newWords.length === 0) {
            // 沒有新單字了，嘗試下一等級
            newWords = WordBank.words.filter(w => !learnedIds.has(w.id));
        }

        if (newWords.length === 0) {
            this.showToast('恭喜！你已經學完所有單字！', 'success');
            return;
        }

        this.learningWords = Utils.randomPick(newWords, Math.min(remaining, newWords.length));
        this.learningIndex = 0;
        this.sessionStreak = 0;

        this.showView('learning');
        this.renderLearningCard();
    },

    learningWords: [],
    learningIndex: 0,
    sessionStreak: 0,

    renderLearningCard() {
        if (this.learningIndex >= this.learningWords.length) {
            this.finishLearning();
            return;
        }

        const word = this.learningWords[this.learningIndex];

        // 更新進度
        document.getElementById('learning-current').textContent = this.learningIndex + 1;
        document.getElementById('learning-total').textContent = this.learningWords.length;
        document.getElementById('session-streak').textContent = this.sessionStreak;

        // 更新卡片
        document.getElementById('word-level-tag').textContent = word.level;
        document.getElementById('current-word').textContent = word.word;
        document.getElementById('word-chinese').textContent = word.chinese;
        document.getElementById('word-pos').textContent = word.pos;
        document.getElementById('word-example').textContent = `"${word.example}"`;
        document.getElementById('word-example-cn').textContent = word.exampleCn || '';

        // 重置卡片狀態
        const card = document.getElementById('word-card');
        card.classList.remove('flipped');

        // 綁定卡片翻轉
        card.onclick = () => card.classList.toggle('flipped');

        // 發音按鈕
        document.getElementById('play-pronunciation').onclick = (e) => {
            e.stopPropagation();
            Utils.speak(word.word);
        };

        // 知道/不知道按鈕
        document.getElementById('know-btn').onclick = () => this.handleWordResponse(true);
        document.getElementById('review-btn').onclick = () => this.handleWordResponse(false);
    },

    async handleWordResponse(known) {
        const word = this.learningWords[this.learningIndex];

        // 記錄學習
        await UserData.addLearningLog(word.id, known ? 'learned' : 'reviewing', word.level);

        // 更新積分和經驗
        const points = known ? 10 : 5;
        await UserData.addPoints(points);
        const expResult = await UserData.addExp(points);

        // 顯示積分動畫
        this.showPointsAnimation(points);

        if (known) {
            this.sessionStreak++;
        } else {
            this.sessionStreak = 0;
        }

        // 檢查成就
        await Achievements.check('word_learned');

        // 下一個單字
        this.learningIndex++;
        this.renderLearningCard();
    },

    showPointsAnimation(points) {
        const el = document.createElement('div');
        el.className = 'points-animation';
        el.textContent = `+${points}`;
        el.style.left = '50%';
        el.style.top = '50%';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    },

    async finishLearning() {
        this.showToast(`太棒了！學習了 ${this.learningWords.length} 個新單字！`, 'success');
        this.showView('dashboard');
        await this.refreshDashboard();
        await Achievements.check('learning_complete');
    },

    // 開始複習
    async startReview() {
        const wordIds = await UserData.getWordsToReview();

        if (wordIds.length === 0) {
            this.showToast('目前沒有需要複習的單字！', 'info');
            return;
        }

        this.reviewWords = wordIds.map(id => WordBank.words.find(w => w.id === id)).filter(Boolean);
        this.reviewIndex = 0;

        this.showView('review');
        this.renderReviewCard();
    },

    reviewWords: [],
    reviewIndex: 0,

    renderReviewCard() {
        if (this.reviewIndex >= this.reviewWords.length) {
            this.finishReview();
            return;
        }

        const word = this.reviewWords[this.reviewIndex];

        document.getElementById('review-current').textContent = this.reviewIndex + 1;
        document.getElementById('review-total').textContent = this.reviewWords.length;
        document.getElementById('review-word').textContent = word.word;
        document.getElementById('review-meaning').textContent = word.chinese;
        document.getElementById('review-example').textContent = word.example;

        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');
        flashcard.onclick = () => flashcard.classList.toggle('flipped');

        document.getElementById('review-play-sound').onclick = (e) => {
            e.stopPropagation();
            Utils.speak(word.word);
        };

        // 複習評分按鈕
        const ratings = ['again', 'hard', 'good', 'easy'];
        ratings.forEach(rating => {
            document.getElementById(`review-${rating}`).onclick = () => this.handleReviewRating(rating);
        });
    },

    async handleReviewRating(rating) {
        const word = this.reviewWords[this.reviewIndex];

        const statusMap = {
            'again': 'reviewing',
            'hard': 'reviewing',
            'good': 'learned',
            'easy': 'mastered'
        };

        await UserData.addLearningLog(word.id, statusMap[rating], word.level);

        const points = rating === 'easy' ? 15 : rating === 'good' ? 10 : 5;
        await UserData.addPoints(points);
        await UserData.addExp(points);

        this.showPointsAnimation(points);

        this.reviewIndex++;
        this.renderReviewCard();
    },

    async finishReview() {
        this.showToast('複習完成！', 'success');
        this.showView('dashboard');
        await this.refreshDashboard();
    },

    // 刷新儀表板
    async refreshDashboard() {
        await Promise.all([
            this.updatePlayerInfo(),
            this.updateDailyProgress(),
            this.updateReviewStats(),
            this.updateWeeklyChart(),
            this.updateCambridgeProgress(),
            this.updateLeaderboard(),
            Achievements.renderRecent('recent-achievements')
        ]);
    }
};

window.UI = UI;

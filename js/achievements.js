/**
 * Word Quest - Achievements Module
 */

const Achievements = {
    // 成就定義
    definitions: [
        // 學習相關
        { id: 'first_word', name: '初心者', desc: '學會第一個單字', icon: '🌱', condition: { type: 'words_learned', count: 1 } },
        { id: 'words_10', name: '初級學徒', desc: '學會 10 個單字', icon: '📚', condition: { type: 'words_learned', count: 10 } },
        { id: 'words_50', name: '中級學徒', desc: '學會 50 個單字', icon: '📖', condition: { type: 'words_learned', count: 50 } },
        { id: 'words_100', name: '進階學徒', desc: '學會 100 個單字', icon: '🎓', condition: { type: 'words_learned', count: 100 } },
        { id: 'words_500', name: '單字達人', desc: '學會 500 個單字', icon: '🏆', condition: { type: 'words_learned', count: 500 } },

        // 連續天數
        { id: 'streak_3', name: '三日持續', desc: '連續學習 3 天', icon: '🔥', condition: { type: 'streak', days: 3 } },
        { id: 'streak_7', name: '週間勇士', desc: '連續學習 7 天', icon: '💪', condition: { type: 'streak', days: 7 } },
        { id: 'streak_30', name: '月間傳說', desc: '連續學習 30 天', icon: '👑', condition: { type: 'streak', days: 30 } },
        { id: 'streak_100', name: '百日霸主', desc: '連續學習 100 天', icon: '🌟', condition: { type: 'streak', days: 100 } },

        // 遊戲相關
        { id: 'first_game', name: '遊戲新手', desc: '完成第一場遊戲', icon: '🎮', condition: { type: 'games_played', count: 1 } },
        { id: 'perfect_game', name: '完美通關', desc: '遊戲獲得 3 顆星', icon: '⭐', condition: { type: 'perfect_game' } },
        { id: 'games_10', name: '遊戲愛好者', desc: '完成 10 場遊戲', icon: '🕹️', condition: { type: 'games_played', count: 10 } },

        // 等級相關
        { id: 'level_a1', name: 'A1 入門者', desc: '達到 A1 等級', icon: '🥉', condition: { type: 'cambridge_level', level: 'A1' } },
        { id: 'level_a2', name: 'A2 探索者', desc: '達到 A2 等級', icon: '🥈', condition: { type: 'cambridge_level', level: 'A2' } },
        { id: 'level_ket', name: 'KET 挑戰者', desc: '達到 KET 等級', icon: '🥇', condition: { type: 'cambridge_level', level: 'KET' } },
        { id: 'level_pet', name: 'PET 征服者', desc: '達到 PET 等級', icon: '🏅', condition: { type: 'cambridge_level', level: 'PET' } },
        { id: 'level_fce', name: 'FCE 大師', desc: '達到 FCE 等級', icon: '🎖️', condition: { type: 'cambridge_level', level: 'FCE' } },

        // 特殊成就
        { id: 'early_bird', name: '早起鳥兒', desc: '早上 6-8 點學習', icon: '🐦', condition: { type: 'time_range', start: 6, end: 8 } },
        { id: 'night_owl', name: '夜貓子', desc: '晚上 10-12 點學習', icon: '🦉', condition: { type: 'time_range', start: 22, end: 24 } },
        { id: 'master_10', name: '精通者', desc: '精通 10 個單字', icon: '✨', condition: { type: 'words_mastered', count: 10 } }
    ],

    // 取得使用者已解鎖成就
    async getUnlocked() {
        const user = Auth.getUser();
        if (!user) return [];

        if (FirebaseConfig.isConfigured()) {
            try {
                const snapshot = await FirebaseConfig.db
                    .collection('users').doc(user.uid)
                    .collection('achievements')
                    .get();
                return snapshot.docs.map(doc => doc.id);
            } catch (e) {
                console.error('取得成就失敗:', e);
                return [];
            }
        } else {
            return Utils.storage.get('achievements') || [];
        }
    },

    // 解鎖成就
    async unlock(achievementId) {
        const user = Auth.getUser();
        if (!user) return false;

        const unlocked = await this.getUnlocked();
        if (unlocked.includes(achievementId)) return false; // 已解鎖

        const achievement = this.definitions.find(a => a.id === achievementId);
        if (!achievement) return false;

        if (FirebaseConfig.isConfigured()) {
            try {
                await FirebaseConfig.db
                    .collection('users').doc(user.uid)
                    .collection('achievements')
                    .doc(achievementId)
                    .set({
                        unlockedAt: new Date().toISOString()
                    });
            } catch (e) {
                console.error('解鎖成就失敗:', e);
                return false;
            }
        } else {
            unlocked.push(achievementId);
            Utils.storage.set('achievements', unlocked);
        }

        // 顯示成就彈出視窗
        this.showPopup(achievement);

        // 給予獎勵
        await UserData.addPoints(50);
        await UserData.addExp(25);

        return true;
    },

    // 顯示成就彈出視窗
    showPopup(achievement) {
        const popup = document.getElementById('achievement-popup');
        document.getElementById('achievement-name').textContent = achievement.name;
        document.getElementById('achievement-desc').textContent = achievement.desc;
        popup.querySelector('.achievement-icon').textContent = achievement.icon;

        popup.classList.remove('hidden');

        setTimeout(() => {
            popup.classList.add('hidden');
        }, 3000);
    },

    // 檢查成就條件
    async check(eventType, data = {}) {
        const profile = await UserData.getProfile();
        const logs = await UserData.getLearningLog();

        for (const achievement of this.definitions) {
            const condition = achievement.condition;

            switch (condition.type) {
                case 'words_learned':
                    if (logs.length >= condition.count) {
                        await this.unlock(achievement.id);
                    }
                    break;

                case 'streak':
                    if (profile && profile.streak >= condition.days) {
                        await this.unlock(achievement.id);
                    }
                    break;

                case 'games_played':
                    const gamesPlayed = Utils.storage.get('gamesPlayed') || 0;
                    if (eventType === 'game_complete') {
                        Utils.storage.set('gamesPlayed', gamesPlayed + 1);
                        if (gamesPlayed + 1 >= condition.count) {
                            await this.unlock(achievement.id);
                        }
                    }
                    break;

                case 'perfect_game':
                    if (eventType === 'game_complete' && data.stars === 3) {
                        await this.unlock(achievement.id);
                    }
                    break;

                case 'cambridge_level':
                    if (profile && profile.currentLevel === condition.level) {
                        await this.unlock(achievement.id);
                    }
                    break;

                case 'time_range':
                    const hour = new Date().getHours();
                    if (hour >= condition.start && hour < condition.end) {
                        await this.unlock(achievement.id);
                    }
                    break;

                case 'words_mastered':
                    const mastered = logs.filter(l => l.status === 'mastered').length;
                    if (mastered >= condition.count) {
                        await this.unlock(achievement.id);
                    }
                    break;
            }
        }
    },

    // 渲染成就列表
    async render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const unlocked = await this.getUnlocked();

        container.innerHTML = this.definitions.map(achievement => {
            const isUnlocked = unlocked.includes(achievement.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
            `;
        }).join('');
    },

    // 渲染最近解鎖的成就
    async renderRecent(containerId, limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const unlocked = await this.getUnlocked();
        const recent = unlocked.slice(-limit).reverse();

        if (recent.length === 0) {
            container.innerHTML = `
                <div class="achievement-placeholder">
                    <span>🎖️</span>
                    <p>完成任務解鎖成就！</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recent.map(id => {
            const achievement = this.definitions.find(a => a.id === id);
            if (!achievement) return '';
            return `
                <div class="achievement-mini">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            `;
        }).join('');
    }
};

window.Achievements = Achievements;

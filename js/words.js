/**
 * Word Quest - User Data Module
 */

const UserData = {
    // 取得使用者資料
    async getProfile() {
        const user = Auth.getUser();
        if (!user) return null;

        if (FirebaseConfig.isConfigured()) {
            try {
                const doc = await FirebaseConfig.db.collection('users').doc(user.uid).get();
                return doc.exists ? doc.data() : null;
            } catch (e) {
                console.error('取得使用者資料失敗:', e);
                return null;
            }
        } else {
            return Utils.storage.get('profile');
        }
    },

    // 儲存使用者資料
    async saveProfile(profile) {
        const user = Auth.getUser();
        if (!user) return false;

        if (FirebaseConfig.isConfigured()) {
            try {
                await FirebaseConfig.db.collection('users').doc(user.uid).set(profile, { merge: true });
                return true;
            } catch (e) {
                console.error('儲存使用者資料失敗:', e);
                return false;
            }
        } else {
            Utils.storage.set('profile', profile);
            return true;
        }
    },

    // 更新特定欄位
    async updateProfile(updates) {
        const profile = await this.getProfile();
        if (!profile) return false;

        const updated = { ...profile, ...updates };
        return this.saveProfile(updated);
    },

    // 取得學習紀錄
    async getLearningLog(date = null) {
        const user = Auth.getUser();
        if (!user) return [];

        if (FirebaseConfig.isConfigured()) {
            try {
                let query = FirebaseConfig.db
                    .collection('users').doc(user.uid)
                    .collection('learningLogs');

                if (date) {
                    query = query.where('date', '==', date);
                }

                const snapshot = await query.orderBy('timestamp', 'desc').limit(100).get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (e) {
                console.error('取得學習紀錄失敗:', e);
                return [];
            }
        } else {
            const logs = Utils.storage.get('learningLogs') || [];
            if (date) {
                return logs.filter(log => log.date === date);
            }
            return logs;
        }
    },

    // 新增學習紀錄
    async addLearningLog(wordId, status, level) {
        const user = Auth.getUser();
        if (!user) return false;

        const log = {
            wordId,
            status, // 'learned', 'reviewing', 'mastered'
            level,
            date: Utils.getToday(),
            timestamp: new Date().toISOString(),
            reviewCount: 1,
            lastReview: new Date().toISOString()
        };

        if (FirebaseConfig.isConfigured()) {
            try {
                await FirebaseConfig.db
                    .collection('users').doc(user.uid)
                    .collection('learningLogs')
                    .doc(wordId)
                    .set(log, { merge: true });
                return true;
            } catch (e) {
                console.error('新增學習紀錄失敗:', e);
                return false;
            }
        } else {
            const logs = Utils.storage.get('learningLogs') || [];
            const existingIndex = logs.findIndex(l => l.wordId === wordId);

            if (existingIndex >= 0) {
                logs[existingIndex] = { ...logs[existingIndex], ...log };
            } else {
                logs.push(log);
            }

            Utils.storage.set('learningLogs', logs);
            return true;
        }
    },

    // 取得今日學習進度
    async getTodayProgress() {
        const today = Utils.getToday();
        const logs = await this.getLearningLog(today);

        return {
            newWords: logs.filter(l => l.status === 'learned').length,
            reviewed: logs.filter(l => l.status === 'reviewing').length,
            total: logs.length
        };
    },

    // 取得待複習單字
    async getWordsToReview() {
        const logs = await this.getLearningLog();
        const today = new Date();

        return logs.filter(log => {
            if (log.status === 'mastered') return false;

            const lastReview = new Date(log.lastReview);
            const daysSince = Utils.daysBetween(lastReview, today);

            // 間隔複習演算法（簡化版）
            const intervals = [1, 3, 7, 14, 30];
            const reviewCount = log.reviewCount || 1;
            const nextInterval = intervals[Math.min(reviewCount - 1, intervals.length - 1)];

            return daysSince >= nextInterval;
        }).map(log => log.wordId);
    },

    // 取得已精通單字數
    async getMasteredCount() {
        const logs = await this.getLearningLog();
        return logs.filter(l => l.status === 'mastered').length;
    },

    // 取得每週學習統計
    async getWeeklyStats() {
        const logs = await this.getLearningLog();
        const stats = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = Utils.formatDate(date);

            const dayLogs = logs.filter(l => l.date === dateStr);
            stats.push({
                date: dateStr,
                day: Utils.getWeekdayName(date),
                count: dayLogs.length
            });
        }

        return stats;
    },

    // 更新連續天數
    async updateStreak() {
        const profile = await this.getProfile();
        if (!profile) return 0;

        const today = Utils.getToday();
        const lastActive = profile.lastActiveDate;

        let newStreak = profile.streak || 0;

        if (lastActive === today) {
            // 今天已經登入過
            return newStreak;
        } else if (Utils.isConsecutiveDay(lastActive)) {
            // 連續天數 +1
            newStreak++;
        } else if (lastActive !== today) {
            // 中斷了，重置為 1
            newStreak = 1;
        }

        await this.updateProfile({
            streak: newStreak,
            lastActiveDate: today
        });

        return newStreak;
    },

    // 新增經驗值
    async addExp(amount) {
        const profile = await this.getProfile();
        if (!profile) return;

        const newExp = (profile.exp || 0) + amount;
        const levelInfo = Utils.calculateLevel(newExp);

        await this.updateProfile({
            exp: newExp
        });

        // 檢查升級
        const oldLevel = Utils.calculateLevel(profile.exp || 0).level;
        if (levelInfo.level > oldLevel) {
            return { levelUp: true, newLevel: levelInfo.level };
        }

        return { levelUp: false, newLevel: levelInfo.level };
    },

    // 新增積分
    async addPoints(amount) {
        const profile = await this.getProfile();
        if (!profile) return;

        await this.updateProfile({
            totalPoints: (profile.totalPoints || 0) + amount
        });
    },

    // 取得排行榜
    async getLeaderboard(type = 'weekly') {
        if (FirebaseConfig.isConfigured()) {
            try {
                const snapshot = await FirebaseConfig.db
                    .collection('users')
                    .where('role', '==', 'student')
                    .orderBy('totalPoints', 'desc')
                    .limit(10)
                    .get();

                return snapshot.docs.map((doc, index) => ({
                    rank: index + 1,
                    ...doc.data()
                }));
            } catch (e) {
                console.error('取得排行榜失敗:', e);
                return [];
            }
        } else {
            // 本地模式只有自己
            const profile = await this.getProfile();
            return profile ? [{ rank: 1, ...profile }] : [];
        }
    }
};

window.UserData = UserData;

/**
 * Word Quest - Authentication Module
 */

const Auth = {
    currentUser: null,

    // 初始化認證
    async init() {
        if (FirebaseConfig.isConfigured()) {
            return this.initFirebaseAuth();
        } else {
            return this.initLocalAuth();
        }
    },

    // Firebase 認證
    async initFirebaseAuth() {
        return new Promise((resolve) => {
            FirebaseConfig.auth.onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    };
                    resolve(this.currentUser);
                } else {
                    this.currentUser = null;
                    resolve(null);
                }
            });
        });
    },

    // 本地認證（無 Firebase 時使用）
    async initLocalAuth() {
        const savedUser = Utils.storage.get('user');
        if (savedUser) {
            this.currentUser = savedUser;
        }
        return this.currentUser;
    },

    // Google 登入
    async signInWithGoogle() {
        if (FirebaseConfig.isConfigured()) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await FirebaseConfig.auth.signInWithPopup(provider);
                this.currentUser = {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                };

                // 檢查/建立使用者資料
                await this.ensureUserProfile();

                return this.currentUser;
            } catch (error) {
                console.error('Google 登入失敗:', error);
                throw error;
            }
        } else {
            // 本地模式 - 模擬登入
            this.currentUser = {
                uid: 'local_' + Utils.generateId(),
                email: 'demo@wordquest.local',
                displayName: '冒險者',
                photoURL: null
            };
            Utils.storage.set('user', this.currentUser);
            await this.ensureUserProfile();
            return this.currentUser;
        }
    },

    // 確保使用者資料存在
    async ensureUserProfile() {
        if (!this.currentUser) return;

        const existingProfile = await UserData.getProfile();

        if (!existingProfile) {
            // 建立新使用者資料
            const newProfile = {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName,
                photoURL: this.currentUser.photoURL,
                createdAt: new Date().toISOString(),
                role: 'student', // student 或 teacher
                currentLevel: null, // 尚未測試
                exp: 0,
                totalPoints: 0,
                streak: 0,
                lastActiveDate: null,
                dailyLimit: 10,
                settings: {
                    soundEnabled: true,
                    notificationsEnabled: true
                }
            };

            await UserData.saveProfile(newProfile);
        }
    },

    // 登出
    async signOut() {
        if (FirebaseConfig.isConfigured()) {
            await FirebaseConfig.auth.signOut();
        }
        this.currentUser = null;
        Utils.storage.remove('user');
    },

    // 取得當前使用者
    getUser() {
        return this.currentUser;
    },

    // 是否已登入
    isLoggedIn() {
        return !!this.currentUser;
    }
};

window.Auth = Auth;

/**
 * Word Quest - Firebase Configuration
 * ⚠️ 使用者需要替換為自己的 Firebase 設定
 */

// Firebase 設定 - 請替換為您的專案設定
const firebaseConfig = {
    apiKey: "AIzaSyDnMKU845gFeZzIsyu4qNGh2FWo5z-tCls",
    authDomain: "wordquest-79321.firebaseapp.com",
    projectId: "wordquest-79321",
    storageBucket: "wordquest-79321.firebasestorage.app",
    messagingSenderId: "220901039915",
    appId: "1:220901039915:web:c9d697303c42abed546f6e",
    measurementId: "G-WNVGMZF7ED"
};

// 檢查是否已設定 Firebase
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

// 初始化 Firebase
let app, auth, db;

try {
    if (isFirebaseConfigured()) {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        // 啟用離線持久化
        db.enablePersistence().catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('多個分頁開啟，離線持久化僅在一個分頁中運作');
            } else if (err.code === 'unimplemented') {
                console.warn('瀏覽器不支援離線持久化');
            }
        });
        
        console.log('✅ Firebase 已初始化');
    } else {
        console.warn('⚠️ Firebase 尚未設定，使用本地儲存模式');
    }
} catch (error) {
    console.error('❌ Firebase 初始化失敗:', error);
}

// 導出設定狀態
window.FirebaseConfig = {
    isConfigured: isFirebaseConfigured,
    auth: auth,
    db: db
};


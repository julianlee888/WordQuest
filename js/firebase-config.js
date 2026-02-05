/**
 * Word Quest - Firebase Configuration
 * ⚠️ 使用者需要替換為自己的 Firebase 設定
 */

// Firebase 設定 - 請替換為您的專案設定
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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

/**
 * Word Quest - Teacher Dashboard
 */

const TeacherApp = {
    currentUser: null,
    students: [],
    customWords: [],

    async init() {
        // Check Firebase configuration
        this.updateFirebaseStatus();

        // Initialize authentication
        if (FirebaseConfig.isConfigured()) {
            FirebaseConfig.auth.onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = user;
                    this.onLoggedIn();
                } else {
                    this.showLogin();
                }
            });
        } else {
            // Local mode
            const savedUser = Utils.storage.get('teacher_user');
            if (savedUser) {
                this.currentUser = savedUser;
                this.onLoggedIn();
            } else {
                this.showLogin();
            }
        }

        this.bindEvents();
    },

    showLogin() {
        document.getElementById('teacher-login').classList.remove('hidden');
        document.getElementById('teacher-dashboard').classList.add('hidden');
    },

    async onLoggedIn() {
        document.getElementById('teacher-login').classList.add('hidden');
        document.getElementById('teacher-dashboard').classList.remove('hidden');
        document.getElementById('teacher-name').textContent = this.currentUser.displayName || '老師';

        // Load data
        await this.loadStudents();
        this.loadWordStats();
        this.updateStudentLink();
    },

    bindEvents() {
        // Login button
        document.getElementById('teacher-google-login')?.addEventListener('click', async () => {
            try {
                if (FirebaseConfig.isConfigured()) {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    await FirebaseConfig.auth.signInWithPopup(provider);
                } else {
                    // Local mode - simulate login
                    this.currentUser = {
                        uid: 'teacher_local',
                        displayName: '老師',
                        email: 'teacher@local'
                    };
                    Utils.storage.set('teacher_user', this.currentUser);
                    this.onLoggedIn();
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('登入失敗，請稍後再試');
            }
        });

        // Logout button
        document.getElementById('teacher-logout')?.addEventListener('click', async () => {
            if (FirebaseConfig.isConfigured()) {
                await FirebaseConfig.auth.signOut();
            }
            Utils.storage.remove('teacher_user');
            this.currentUser = null;
            this.showLogin();
        });

        // Navigation tabs
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Student search
        document.getElementById('student-search')?.addEventListener('input', (e) => {
            this.filterStudents(e.target.value);
        });

        // Export students
        document.getElementById('export-students')?.addEventListener('click', () => {
            this.exportStudents();
        });

        // Word level filter
        document.getElementById('level-filter')?.addEventListener('change', (e) => {
            this.filterWords(e.target.value);
        });

        // Add word button
        document.getElementById('add-word-btn')?.addEventListener('click', () => {
            document.getElementById('add-word-modal').classList.remove('hidden');
        });

        // Add word form
        document.getElementById('add-word-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWord(e.target);
        });

        // Import words button
        document.getElementById('import-words-btn')?.addEventListener('click', () => {
            document.getElementById('import-words-modal').classList.remove('hidden');
        });

        // CSV file selection
        document.getElementById('csv-file')?.addEventListener('change', (e) => {
            this.handleCsvFile(e.target.files[0]);
        });

        // Confirm import
        document.getElementById('confirm-import')?.addEventListener('click', () => {
            this.confirmImport();
        });

        // Download template
        document.getElementById('download-template')?.addEventListener('click', () => {
            this.downloadCsvTemplate();
        });

        // Copy link
        document.getElementById('copy-link-btn')?.addEventListener('click', () => {
            const input = document.getElementById('student-link');
            input.select();
            document.execCommand('copy');
            alert('已複製連結！');
        });

        // Download report
        document.getElementById('download-report')?.addEventListener('click', () => {
            this.downloadReport();
        });
    },

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`tab-${tabName}`).classList.remove('hidden');

        // Load tab-specific data
        if (tabName === 'words') {
            this.loadWordsList();
        } else if (tabName === 'reports') {
            this.loadReports();
        }
    },

    async loadStudents() {
        if (FirebaseConfig.isConfigured()) {
            try {
                const snapshot = await FirebaseConfig.db
                    .collection('users')
                    .where('role', '==', 'student')
                    .get();

                this.students = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();

                    // Get learning logs count
                    const logsSnapshot = await FirebaseConfig.db
                        .collection('users').doc(doc.id)
                        .collection('learningLogs')
                        .get();

                    return {
                        id: doc.id,
                        ...data,
                        wordsLearned: logsSnapshot.size
                    };
                }));
            } catch (error) {
                console.error('Error loading students:', error);
                this.students = [];
            }
        } else {
            // Local mode - demo data
            this.students = this.getDemoStudents();
        }

        this.renderStudents();
        this.updateStudentStats();
    },

    getDemoStudents() {
        return [
            { id: '1', displayName: '小明', email: 'ming@demo.com', photoURL: null, currentLevel: 'A1', wordsLearned: 45, streak: 7, totalPoints: 450, lastActiveDate: Utils.getToday() },
            { id: '2', displayName: '小華', email: 'hua@demo.com', photoURL: null, currentLevel: 'A2', wordsLearned: 78, streak: 12, totalPoints: 890, lastActiveDate: Utils.getToday() },
            { id: '3', displayName: '小美', email: 'mei@demo.com', photoURL: null, currentLevel: 'preA1', wordsLearned: 23, streak: 3, totalPoints: 230, lastActiveDate: '2026-02-04' },
            { id: '4', displayName: '小強', email: 'qiang@demo.com', photoURL: null, currentLevel: 'KET', wordsLearned: 156, streak: 25, totalPoints: 1560, lastActiveDate: Utils.getToday() },
            { id: '5', displayName: '小芳', email: 'fang@demo.com', photoURL: null, currentLevel: 'A1', wordsLearned: 34, streak: 0, totalPoints: 340, lastActiveDate: '2026-02-01' }
        ];
    },

    renderStudents(students = this.students) {
        const tbody = document.getElementById('students-tbody');
        if (!tbody) return;

        // Sort by points
        const sorted = [...students].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

        tbody.innerHTML = sorted.map((student, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="student-cell">
                        <img class="student-avatar" 
                             src="${student.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + student.id}" 
                             alt="">
                        <span>${student.displayName || '未命名'}</span>
                    </div>
                </td>
                <td>
                    <span class="level-tag" style="background: ${Utils.getLevelColor(student.currentLevel || 'preA1')}">
                        ${student.currentLevel || 'N/A'}
                    </span>
                </td>
                <td>${student.wordsLearned || 0}</td>
                <td>${student.streak || 0} 🔥</td>
                <td>${student.totalPoints || 0} ⭐</td>
                <td>${student.lastActiveDate || 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="TeacherApp.viewStudent('${student.id}')">
                        查看
                    </button>
                </td>
            </tr>
        `).join('');
    },

    updateStudentStats() {
        const today = Utils.getToday();
        const activeToday = this.students.filter(s => s.lastActiveDate === today).length;
        const totalWords = this.students.reduce((sum, s) => sum + (s.wordsLearned || 0), 0);

        document.getElementById('total-students').textContent = this.students.length;
        document.getElementById('active-today').textContent = activeToday;
        document.getElementById('total-words-learned').textContent = totalWords;

        // Calculate average progress (based on words learned vs total words)
        const totalAvailable = WordBank.words.length;
        const avgProgress = this.students.length > 0
            ? Math.round((totalWords / this.students.length / totalAvailable) * 100)
            : 0;
        document.getElementById('avg-progress').textContent = `${avgProgress}%`;
    },

    filterStudents(query) {
        const filtered = this.students.filter(s =>
            (s.displayName || '').toLowerCase().includes(query.toLowerCase()) ||
            (s.email || '').toLowerCase().includes(query.toLowerCase())
        );
        this.renderStudents(filtered);
    },

    viewStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modal = document.getElementById('student-detail-modal');
        const content = document.getElementById('student-detail-content');

        content.innerHTML = `
            <div class="student-detail">
                <div class="student-profile">
                    <img src="${student.photoURL || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + student.id}" 
                         alt="" class="detail-avatar">
                    <h3>${student.displayName || '未命名'}</h3>
                    <p>${student.email || ''}</p>
                </div>
                <div class="student-stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${student.currentLevel || 'N/A'}</span>
                        <span class="stat-label">目前等級</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${student.wordsLearned || 0}</span>
                        <span class="stat-label">已學單字</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${student.streak || 0}🔥</span>
                        <span class="stat-label">連續天數</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${student.totalPoints || 0}⭐</span>
                        <span class="stat-label">總積分</span>
                    </div>
                </div>
                <div class="student-activity">
                    <h4>最近活動</h4>
                    <p>最後登入：${student.lastActiveDate || 'N/A'}</p>
                    <p>註冊日期：${student.createdAt ? student.createdAt.split('T')[0] : 'N/A'}</p>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    },

    exportStudents() {
        const headers = ['名稱', 'Email', '等級', '已學單字', '連續天數', '總積分', '最後活躍'];
        const rows = this.students.map(s => [
            s.displayName || '',
            s.email || '',
            s.currentLevel || '',
            s.wordsLearned || 0,
            s.streak || 0,
            s.totalPoints || 0,
            s.lastActiveDate || ''
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        this.downloadFile('students_report.csv', csv, 'text/csv');
    },

    loadWordStats() {
        const stats = WordBank.getStats();
        document.getElementById('words-preA1').textContent = stats.preA1 || 0;
        document.getElementById('words-A1').textContent = stats.A1 || 0;
        document.getElementById('words-A2').textContent = stats.A2 || 0;
        document.getElementById('words-KET').textContent = stats.KET || 0;
        document.getElementById('words-PET').textContent = stats.PET || 0;
        document.getElementById('words-FCE').textContent = stats.FCE || 0;
        document.getElementById('current-word-count').textContent = stats.total || 0;
    },

    loadWordsList(level = 'all') {
        const words = level === 'all'
            ? WordBank.words
            : WordBank.getByLevel(level);

        const tbody = document.getElementById('words-tbody');
        if (!tbody) return;

        tbody.innerHTML = words.slice(0, 50).map(word => `
            <tr>
                <td><strong>${word.word}</strong></td>
                <td>${word.chinese}</td>
                <td>${word.pos}</td>
                <td>
                    <span class="level-tag" style="background: ${Utils.getLevelColor(word.level)}">
                        ${word.level}
                    </span>
                </td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
                    ${word.example || '-'}
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="TeacherApp.editWord('${word.id}')">
                        編輯
                    </button>
                </td>
            </tr>
        `).join('');

        if (words.length > 50) {
            tbody.innerHTML += `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--color-text-muted);">
                        顯示前 50 個結果，共 ${words.length} 個單字
                    </td>
                </tr>
            `;
        }
    },

    filterWords(level) {
        this.loadWordsList(level);
    },

    addWord(form) {
        const formData = new FormData(form);
        const newWord = {
            id: `custom_${Date.now()}`,
            word: formData.get('word'),
            chinese: formData.get('chinese'),
            pos: formData.get('pos'),
            level: formData.get('level'),
            example: formData.get('example') || '',
            exampleCn: formData.get('exampleCn') || ''
        };

        // Add to WordBank (runtime only)
        WordBank.words.push(newWord);

        // Save to localStorage for persistence
        this.customWords.push(newWord);
        Utils.storage.set('customWords', this.customWords);

        alert('單字已新增！');
        closeModal('add-word-modal');
        form.reset();
        this.loadWordStats();
        this.loadWordsList();
    },

    editWord(wordId) {
        const word = WordBank.getById(wordId);
        if (!word) return;

        // For now, just show an alert. Full implementation would open an edit modal.
        alert(`編輯功能開發中\n\n單字: ${word.word}\n中文: ${word.chinese}\n等級: ${word.level}`);
    },

    pendingImport: [],

    handleCsvFile(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());

            // Skip header
            const dataLines = lines.slice(1);

            this.pendingImport = dataLines.map((line, index) => {
                const parts = line.split(',');
                return {
                    id: `import_${Date.now()}_${index}`,
                    word: parts[0]?.trim() || '',
                    chinese: parts[1]?.trim() || '',
                    pos: parts[2]?.trim() || 'n. 名詞',
                    level: parts[3]?.trim() || 'A1',
                    example: parts[4]?.trim() || '',
                    exampleCn: parts[5]?.trim() || ''
                };
            }).filter(w => w.word && w.chinese);

            // Show preview
            document.getElementById('selected-file').textContent = file.name;
            document.getElementById('import-preview').classList.remove('hidden');
            document.getElementById('preview-content').innerHTML = `
                <table class="data-table">
                    <tr><th>單字</th><th>中文</th><th>等級</th></tr>
                    ${this.pendingImport.slice(0, 5).map(w => `
                        <tr><td>${w.word}</td><td>${w.chinese}</td><td>${w.level}</td></tr>
                    `).join('')}
                </table>
                <p>共 ${this.pendingImport.length} 個單字準備匯入</p>
            `;
            document.getElementById('confirm-import').disabled = false;
        };
        reader.readAsText(file);
    },

    confirmImport() {
        if (this.pendingImport.length === 0) return;

        // Add to WordBank
        WordBank.words.push(...this.pendingImport);

        // Save to localStorage
        this.customWords.push(...this.pendingImport);
        Utils.storage.set('customWords', this.customWords);

        alert(`成功匯入 ${this.pendingImport.length} 個單字！`);

        this.pendingImport = [];
        closeModal('import-words-modal');
        this.loadWordStats();
        this.loadWordsList();
    },

    downloadCsvTemplate() {
        const template = `word,chinese,pos,level,example,exampleCn
apple,蘋果,n. 名詞,preA1,I eat an apple.,我吃一顆蘋果。
book,書,n. 名詞,preA1,This is my book.,這是我的書。
run,跑,v. 動詞,A1,I run every morning.,我每天早上跑步。`;

        this.downloadFile('word_template.csv', template, 'text/csv');
    },

    loadReports() {
        // Simple bar charts
        this.renderSimpleChart('daily-users-chart', [
            { label: '一', value: 12 },
            { label: '二', value: 18 },
            { label: '三', value: 15 },
            { label: '四', value: 22 },
            { label: '五', value: 28 },
            { label: '六', value: 8 },
            { label: '日', value: 5 }
        ]);

        this.renderLevelDistribution();
    },

    renderSimpleChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const maxValue = Math.max(...data.map(d => d.value));

        container.innerHTML = `
            <div class="simple-chart">
                ${data.map(d => `
                    <div class="chart-bar-item">
                        <div class="chart-bar-fill" style="height: ${(d.value / maxValue) * 120}px"></div>
                        <span class="chart-bar-label">${d.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderLevelDistribution() {
        const container = document.getElementById('level-distribution-chart');
        if (!container) return;

        const levels = ['preA1', 'A1', 'A2', 'KET', 'PET', 'FCE'];
        const counts = levels.map(level =>
            this.students.filter(s => s.currentLevel === level).length
        );

        const maxCount = Math.max(...counts, 1);

        container.innerHTML = `
            <div class="simple-chart">
                ${levels.map((level, i) => `
                    <div class="chart-bar-item">
                        <div class="chart-bar-fill" style="height: ${(counts[i] / maxCount) * 120}px; background: ${Utils.getLevelColor(level)}"></div>
                        <span class="chart-bar-label">${level}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    downloadReport() {
        const report = {
            exportDate: new Date().toISOString(),
            totalStudents: this.students.length,
            totalWords: WordBank.words.length,
            students: this.students
        };

        this.downloadFile(
            `wordquest_report_${Utils.getToday()}.json`,
            JSON.stringify(report, null, 2),
            'application/json'
        );
    },

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    updateFirebaseStatus() {
        const statusEl = document.getElementById('firebase-status');
        if (!statusEl) return;

        if (FirebaseConfig.isConfigured()) {
            statusEl.classList.add('success');
            statusEl.innerHTML = `
                <span class="status-icon">✅</span>
                <span>Firebase 已連接</span>
            `;
        }
    },

    updateStudentLink() {
        const linkInput = document.getElementById('student-link');
        if (linkInput) {
            linkInput.value = window.location.origin + window.location.pathname.replace('teacher.html', 'index.html');
        }
    }
};

// Modal helper
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Load custom words from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedWords = Utils.storage.get('customWords') || [];
    if (savedWords.length > 0) {
        WordBank.words.push(...savedWords);
    }
    TeacherApp.customWords = savedWords;
    TeacherApp.init();
});

window.TeacherApp = TeacherApp;
window.closeModal = closeModal;

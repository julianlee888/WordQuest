/**
 * Word Quest - Games Module
 */

const Games = {
    currentGame: null,
    score: 0,
    correct: 0,
    total: 0,
    words: [],
    currentIndex: 0,

    // 開始配對遊戲
    async startMatchingGame() {
        this.currentGame = 'matching';
        this.score = 0;
        this.correct = 0;

        // 取得已學過的單字
        const logs = await UserData.getLearningLog();
        const learnedWordIds = logs.map(l => l.wordId);
        const learnedWords = WordBank.words.filter(w => learnedWordIds.includes(w.id));

        if (learnedWords.length < 4) {
            UI.showToast('需要先學習至少 4 個單字！', 'warning');
            return false;
        }

        // 隨機取 6 對
        this.words = Utils.randomPick(learnedWords, Math.min(6, learnedWords.length));
        this.total = this.words.length;

        this.renderMatchingGame();
        return true;
    },

    renderMatchingGame() {
        const gameArea = document.getElementById('game-area');
        const cards = [];

        // 建立配對卡片
        this.words.forEach((word, index) => {
            cards.push({ type: 'english', value: word.word, pairId: index });
            cards.push({ type: 'chinese', value: word.chinese, pairId: index });
        });

        const shuffled = Utils.shuffle(cards);

        gameArea.innerHTML = `
            <div class="matching-grid">
                ${shuffled.map((card, i) => `
                    <div class="match-card" data-index="${i}" data-pair="${card.pairId}" data-type="${card.type}">
                        ${card.value}
                    </div>
                `).join('')}
            </div>
        `;

        this.bindMatchingEvents();
    },

    bindMatchingEvents() {
        let selectedCard = null;
        const cards = document.querySelectorAll('.match-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('matched')) return;

                if (!selectedCard) {
                    selectedCard = card;
                    card.classList.add('selected');
                } else if (selectedCard === card) {
                    card.classList.remove('selected');
                    selectedCard = null;
                } else {
                    // 檢查配對
                    const pair1 = selectedCard.dataset.pair;
                    const pair2 = card.dataset.pair;
                    const type1 = selectedCard.dataset.type;
                    const type2 = card.dataset.type;

                    if (pair1 === pair2 && type1 !== type2) {
                        // 配對成功
                        selectedCard.classList.remove('selected');
                        selectedCard.classList.add('matched', 'answer-correct');
                        card.classList.add('matched', 'answer-correct');
                        this.correct++;
                        this.score += 10;
                        this.updateScore();

                        // 檢查遊戲結束
                        const matched = document.querySelectorAll('.match-card.matched');
                        if (matched.length === this.words.length * 2) {
                            setTimeout(() => this.endGame(), 500);
                        }
                    } else {
                        // 配對失敗
                        selectedCard.classList.add('answer-wrong');
                        card.classList.add('answer-wrong');

                        setTimeout(() => {
                            selectedCard.classList.remove('selected', 'answer-wrong');
                            card.classList.remove('answer-wrong');
                            selectedCard = null;
                        }, 500);
                        return;
                    }
                    selectedCard = null;
                }
            });
        });
    },

    // 開始拼字遊戲
    async startSpellingGame() {
        this.currentGame = 'spelling';
        this.score = 0;
        this.correct = 0;
        this.currentIndex = 0;

        const logs = await UserData.getLearningLog();
        const learnedWordIds = logs.map(l => l.wordId);
        const learnedWords = WordBank.words.filter(w => learnedWordIds.includes(w.id));

        if (learnedWords.length < 5) {
            UI.showToast('需要先學習至少 5 個單字！', 'warning');
            return false;
        }

        this.words = Utils.randomPick(learnedWords, Math.min(10, learnedWords.length));
        this.total = this.words.length;

        this.renderSpellingQuestion();
        return true;
    },

    renderSpellingQuestion() {
        if (this.currentIndex >= this.words.length) {
            this.endGame();
            return;
        }

        const word = this.words[this.currentIndex];
        const gameArea = document.getElementById('game-area');

        gameArea.innerHTML = `
            <div class="spelling-area">
                <div class="spelling-word">${word.chinese} (${word.pos})</div>
                <div class="spelling-input-area">
                    <input type="text" 
                           id="spelling-input" 
                           class="spelling-input" 
                           placeholder="輸入英文單字"
                           autocomplete="off"
                           spellcheck="false">
                    <div class="letter-hints">
                        ${word.word.split('').map((_, i) =>
            `<span class="letter-hint" data-index="${i}"></span>`
        ).join('')}
                    </div>
                    <button id="submit-spelling" class="btn btn-primary">確認</button>
                    <button id="hint-btn" class="btn btn-secondary">💡 提示</button>
                </div>
                <p class="spelling-progress">${this.currentIndex + 1} / ${this.total}</p>
            </div>
        `;

        const input = document.getElementById('spelling-input');
        const submitBtn = document.getElementById('submit-spelling');
        const hintBtn = document.getElementById('hint-btn');

        input.focus();

        // 即時顯示輸入
        input.addEventListener('input', () => {
            const hints = document.querySelectorAll('.letter-hint');
            const value = input.value.toLowerCase();
            hints.forEach((hint, i) => {
                if (value[i]) {
                    hint.textContent = value[i];
                    hint.classList.add('filled');
                } else {
                    hint.textContent = '';
                    hint.classList.remove('filled');
                }
            });
        });

        // 提交答案
        const submit = () => {
            const answer = input.value.toLowerCase().trim();
            if (answer === word.word.toLowerCase()) {
                this.correct++;
                this.score += 15;
                this.updateScore();
                UI.showToast('正確！🎉', 'success');
            } else {
                UI.showToast(`正確答案是: ${word.word}`, 'error');
            }
            this.currentIndex++;
            setTimeout(() => this.renderSpellingQuestion(), 1000);
        };

        submitBtn.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });

        // 提示功能
        hintBtn.addEventListener('click', () => {
            const hints = document.querySelectorAll('.letter-hint');
            const firstEmpty = Array.from(hints).findIndex(h => !h.classList.contains('filled'));
            if (firstEmpty >= 0 && firstEmpty < word.word.length) {
                hints[firstEmpty].textContent = word.word[firstEmpty];
                hints[firstEmpty].classList.add('filled');
                input.value = Array.from(hints).map(h => h.textContent).join('');
                this.score = Math.max(0, this.score - 5); // 扣分
                this.updateScore();
            }
        });
    },

    // 開始聽力遊戲
    async startListeningGame() {
        this.currentGame = 'listening';
        this.score = 0;
        this.correct = 0;
        this.currentIndex = 0;

        const logs = await UserData.getLearningLog();
        const learnedWordIds = logs.map(l => l.wordId);
        const learnedWords = WordBank.words.filter(w => learnedWordIds.includes(w.id));

        if (learnedWords.length < 5) {
            UI.showToast('需要先學習至少 5 個單字！', 'warning');
            return false;
        }

        this.words = Utils.randomPick(learnedWords, Math.min(10, learnedWords.length));
        this.total = this.words.length;

        this.renderListeningQuestion();
        return true;
    },

    renderListeningQuestion() {
        if (this.currentIndex >= this.words.length) {
            this.endGame();
            return;
        }

        const word = this.words[this.currentIndex];
        const otherWords = Utils.randomPick(
            this.words.filter(w => w.id !== word.id),
            3
        );
        const options = Utils.shuffle([word, ...otherWords]);

        const gameArea = document.getElementById('game-area');

        gameArea.innerHTML = `
            <div class="listening-area">
                <button id="play-sound-btn" class="play-sound-btn btn">🔊</button>
                <p>聽發音，選擇正確的單字</p>
                <div class="listening-options">
                    ${options.map(opt => `
                        <button class="listening-option" data-word="${opt.word}">
                            ${opt.word}
                        </button>
                    `).join('')}
                </div>
                <p class="spelling-progress">${this.currentIndex + 1} / ${this.total}</p>
            </div>
        `;

        // 播放發音
        const playBtn = document.getElementById('play-sound-btn');
        playBtn.addEventListener('click', () => {
            Utils.speak(word.word);
        });

        // 自動播放一次
        setTimeout(() => Utils.speak(word.word), 300);

        // 選項點擊
        const optionBtns = document.querySelectorAll('.listening-option');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.dataset.word;

                if (selected === word.word) {
                    btn.classList.add('answer-correct');
                    this.correct++;
                    this.score += 10;
                    this.updateScore();
                } else {
                    btn.classList.add('answer-wrong');
                    // 顯示正確答案
                    optionBtns.forEach(b => {
                        if (b.dataset.word === word.word) {
                            b.classList.add('answer-correct');
                        }
                    });
                }

                // 禁用所有選項
                optionBtns.forEach(b => b.disabled = true);

                this.currentIndex++;
                setTimeout(() => this.renderListeningQuestion(), 1200);
            });
        });
    },

    // 開始填空遊戲
    async startFillBlankGame() {
        this.currentGame = 'fillblank';
        this.score = 0;
        this.correct = 0;
        this.currentIndex = 0;

        const logs = await UserData.getLearningLog();
        const learnedWordIds = logs.map(l => l.wordId);
        const learnedWords = WordBank.words.filter(w =>
            learnedWordIds.includes(w.id) && w.example
        );

        if (learnedWords.length < 5) {
            UI.showToast('需要先學習更多有例句的單字！', 'warning');
            return false;
        }

        this.words = Utils.randomPick(learnedWords, Math.min(10, learnedWords.length));
        this.total = this.words.length;

        this.renderFillBlankQuestion();
        return true;
    },

    renderFillBlankQuestion() {
        if (this.currentIndex >= this.words.length) {
            this.endGame();
            return;
        }

        const word = this.words[this.currentIndex];
        const sentence = word.example.replace(
            new RegExp(word.word, 'gi'),
            '<span class="blank-slot">____</span>'
        );

        const otherWords = Utils.randomPick(
            this.words.filter(w => w.id !== word.id).map(w => w.word),
            3
        );
        const options = Utils.shuffle([word.word, ...otherWords]);

        const gameArea = document.getElementById('game-area');

        gameArea.innerHTML = `
            <div class="fill-blank-area">
                <p class="fill-sentence">${sentence}</p>
                <p class="fill-hint">${word.chinese}</p>
                <div class="fill-options">
                    ${options.map(opt => `
                        <button class="fill-option" data-word="${opt}">${opt}</button>
                    `).join('')}
                </div>
                <p class="spelling-progress">${this.currentIndex + 1} / ${this.total}</p>
            </div>
        `;

        const optionBtns = document.querySelectorAll('.fill-option');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.dataset.word;
                const blankSlot = document.querySelector('.blank-slot');

                if (selected.toLowerCase() === word.word.toLowerCase()) {
                    btn.classList.add('answer-correct');
                    blankSlot.textContent = word.word;
                    blankSlot.style.color = 'var(--color-success)';
                    this.correct++;
                    this.score += 10;
                    this.updateScore();
                } else {
                    btn.classList.add('answer-wrong');
                    optionBtns.forEach(b => {
                        if (b.dataset.word.toLowerCase() === word.word.toLowerCase()) {
                            b.classList.add('answer-correct');
                        }
                    });
                }

                optionBtns.forEach(b => b.disabled = true);

                this.currentIndex++;
                setTimeout(() => this.renderFillBlankQuestion(), 1200);
            });
        });
    },

    updateScore() {
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) {
            scoreEl.textContent = this.score;
        }
    },

    async endGame() {
        const stars = Utils.calculateStars(this.correct, this.total);
        const expEarned = this.score;

        // 更新資料
        await UserData.addExp(expEarned);
        await UserData.addPoints(this.score);

        // 顯示結果
        const gameArea = document.getElementById('game-area');
        gameArea.classList.add('hidden');

        const resultArea = document.getElementById('game-result');
        resultArea.classList.remove('hidden');

        resultArea.innerHTML = `
            <div class="result-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
            <div class="result-score">+${this.score} 分</div>
            <div class="result-stats">
                <div class="result-stat">
                    <div class="result-stat-value">${this.correct}</div>
                    <div class="result-stat-label">正確</div>
                </div>
                <div class="result-stat">
                    <div class="result-stat-value">${this.total - this.correct}</div>
                    <div class="result-stat-label">錯誤</div>
                </div>
                <div class="result-stat">
                    <div class="result-stat-value">+${expEarned}</div>
                    <div class="result-stat-label">經驗值</div>
                </div>
            </div>
            <div class="result-actions">
                <button id="play-again" class="btn btn-primary">再玩一次</button>
                <button id="back-to-home" class="btn btn-secondary">返回首頁</button>
            </div>
        `;

        document.getElementById('play-again').addEventListener('click', () => {
            resultArea.classList.add('hidden');
            gameArea.classList.remove('hidden');
            this.startGame(this.currentGame);
        });

        document.getElementById('back-to-home').addEventListener('click', () => {
            UI.showView('dashboard');
        });

        // 檢查成就
        Achievements.check('game_complete', { game: this.currentGame, stars });
    },

    // 統一啟動遊戲
    async startGame(gameType) {
        document.getElementById('game-title').textContent = this.getGameTitle(gameType);
        document.getElementById('game-score').textContent = '0';
        document.getElementById('game-result').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');

        switch (gameType) {
            case 'matching':
                return this.startMatchingGame();
            case 'spelling':
                return this.startSpellingGame();
            case 'listening':
                return this.startListeningGame();
            case 'fillblank':
                return this.startFillBlankGame();
            default:
                console.error('未知遊戲類型:', gameType);
                return false;
        }
    },

    getGameTitle(type) {
        const titles = {
            'matching': '🎯 配對挑戰',
            'spelling': '✍️ 拼字大師',
            'listening': '👂 聽力訓練',
            'fillblank': '📝 填空達人'
        };
        return titles[type] || '遊戲';
    }
};

window.Games = Games;

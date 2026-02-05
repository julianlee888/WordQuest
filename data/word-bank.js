/**
 * Word Quest - Word Bank
 * 劍橋英檢分級單字庫
 */

const WordBank = {
    // 等級順序
    levelOrder: ['preA1', 'A1', 'A2', 'KET', 'PET', 'FCE'],

    getLevelOrder(level) {
        return this.levelOrder.indexOf(level);
    },

    // 單字資料庫
    words: [
        // ========== Pre A1 Starters (基礎) ==========
        { id: 'preA1_001', word: 'apple', chinese: '蘋果', pos: 'n. 名詞', level: 'preA1', example: 'I eat an apple every day.', exampleCn: '我每天吃一顆蘋果。' },
        { id: 'preA1_002', word: 'book', chinese: '書', pos: 'n. 名詞', level: 'preA1', example: 'This is my book.', exampleCn: '這是我的書。' },
        { id: 'preA1_003', word: 'cat', chinese: '貓', pos: 'n. 名詞', level: 'preA1', example: 'The cat is sleeping.', exampleCn: '貓在睡覺。' },
        { id: 'preA1_004', word: 'dog', chinese: '狗', pos: 'n. 名詞', level: 'preA1', example: 'I have a dog.', exampleCn: '我有一隻狗。' },
        { id: 'preA1_005', word: 'egg', chinese: '蛋', pos: 'n. 名詞', level: 'preA1', example: 'I like eggs.', exampleCn: '我喜歡蛋。' },
        { id: 'preA1_006', word: 'fish', chinese: '魚', pos: 'n. 名詞', level: 'preA1', example: 'The fish is in the water.', exampleCn: '魚在水裡。' },
        { id: 'preA1_007', word: 'green', chinese: '綠色', pos: 'adj. 形容詞', level: 'preA1', example: 'The tree is green.', exampleCn: '樹是綠色的。' },
        { id: 'preA1_008', word: 'happy', chinese: '快樂的', pos: 'adj. 形容詞', level: 'preA1', example: 'I am happy.', exampleCn: '我很快樂。' },
        { id: 'preA1_009', word: 'ice cream', chinese: '冰淇淋', pos: 'n. 名詞', level: 'preA1', example: 'I want ice cream.', exampleCn: '我想要冰淇淋。' },
        { id: 'preA1_010', word: 'jump', chinese: '跳', pos: 'v. 動詞', level: 'preA1', example: 'The frog can jump.', exampleCn: '青蛙會跳。' },
        { id: 'preA1_011', word: 'kite', chinese: '風箏', pos: 'n. 名詞', level: 'preA1', example: 'I fly a kite.', exampleCn: '我放風箏。' },
        { id: 'preA1_012', word: 'lion', chinese: '獅子', pos: 'n. 名詞', level: 'preA1', example: 'The lion is big.', exampleCn: '獅子很大。' },
        { id: 'preA1_013', word: 'milk', chinese: '牛奶', pos: 'n. 名詞', level: 'preA1', example: 'I drink milk.', exampleCn: '我喝牛奶。' },
        { id: 'preA1_014', word: 'nose', chinese: '鼻子', pos: 'n. 名詞', level: 'preA1', example: 'This is my nose.', exampleCn: '這是我的鼻子。' },
        { id: 'preA1_015', word: 'orange', chinese: '橘子', pos: 'n. 名詞', level: 'preA1', example: 'I like oranges.', exampleCn: '我喜歡橘子。' },
        { id: 'preA1_016', word: 'pen', chinese: '筆', pos: 'n. 名詞', level: 'preA1', example: 'I have a pen.', exampleCn: '我有一支筆。' },
        { id: 'preA1_017', word: 'queen', chinese: '女王', pos: 'n. 名詞', level: 'preA1', example: 'The queen is beautiful.', exampleCn: '女王很美麗。' },
        { id: 'preA1_018', word: 'red', chinese: '紅色', pos: 'adj. 形容詞', level: 'preA1', example: 'The apple is red.', exampleCn: '蘋果是紅色的。' },
        { id: 'preA1_019', word: 'sun', chinese: '太陽', pos: 'n. 名詞', level: 'preA1', example: 'The sun is hot.', exampleCn: '太陽很熱。' },
        { id: 'preA1_020', word: 'tree', chinese: '樹', pos: 'n. 名詞', level: 'preA1', example: 'The tree is tall.', exampleCn: '樹很高。' },

        // ========== A1 Movers (初階) ==========
        { id: 'A1_001', word: 'afternoon', chinese: '下午', pos: 'n. 名詞', level: 'A1', example: 'Good afternoon!', exampleCn: '午安！' },
        { id: 'A1_002', word: 'beautiful', chinese: '美麗的', pos: 'adj. 形容詞', level: 'A1', example: 'The flower is beautiful.', exampleCn: '花很美麗。' },
        { id: 'A1_003', word: 'classroom', chinese: '教室', pos: 'n. 名詞', level: 'A1', example: 'We are in the classroom.', exampleCn: '我們在教室裡。' },
        { id: 'A1_004', word: 'dinner', chinese: '晚餐', pos: 'n. 名詞', level: 'A1', example: 'Dinner is ready.', exampleCn: '晚餐準備好了。' },
        { id: 'A1_005', word: 'elephant', chinese: '大象', pos: 'n. 名詞', level: 'A1', example: 'The elephant is very big.', exampleCn: '大象非常大。' },
        { id: 'A1_006', word: 'favorite', chinese: '最喜歡的', pos: 'adj. 形容詞', level: 'A1', example: 'Blue is my favorite color.', exampleCn: '藍色是我最喜歡的顏色。' },
        { id: 'A1_007', word: 'garden', chinese: '花園', pos: 'n. 名詞', level: 'A1', example: 'There are flowers in the garden.', exampleCn: '花園裡有花。' },
        { id: 'A1_008', word: 'homework', chinese: '作業', pos: 'n. 名詞', level: 'A1', example: 'I do my homework every day.', exampleCn: '我每天做作業。' },
        { id: 'A1_009', word: 'important', chinese: '重要的', pos: 'adj. 形容詞', level: 'A1', example: 'This is important.', exampleCn: '這很重要。' },
        { id: 'A1_010', word: 'January', chinese: '一月', pos: 'n. 名詞', level: 'A1', example: 'My birthday is in January.', exampleCn: '我的生日在一月。' },
        { id: 'A1_011', word: 'kitchen', chinese: '廚房', pos: 'n. 名詞', level: 'A1', example: 'Mom is in the kitchen.', exampleCn: '媽媽在廚房。' },
        { id: 'A1_012', word: 'library', chinese: '圖書館', pos: 'n. 名詞', level: 'A1', example: 'I read books in the library.', exampleCn: '我在圖書館看書。' },
        { id: 'A1_013', word: 'morning', chinese: '早上', pos: 'n. 名詞', level: 'A1', example: 'Good morning!', exampleCn: '早安！' },
        { id: 'A1_014', word: 'newspaper', chinese: '報紙', pos: 'n. 名詞', level: 'A1', example: 'Dad reads the newspaper.', exampleCn: '爸爸看報紙。' },
        { id: 'A1_015', word: 'outside', chinese: '外面', pos: 'adv. 副詞', level: 'A1', example: 'Let\'s play outside.', exampleCn: '我們去外面玩吧。' },
        { id: 'A1_016', word: 'parent', chinese: '父母', pos: 'n. 名詞', level: 'A1', example: 'My parents love me.', exampleCn: '我的父母愛我。' },
        { id: 'A1_017', word: 'question', chinese: '問題', pos: 'n. 名詞', level: 'A1', example: 'I have a question.', exampleCn: '我有一個問題。' },
        { id: 'A1_018', word: 'remember', chinese: '記得', pos: 'v. 動詞', level: 'A1', example: 'I remember your name.', exampleCn: '我記得你的名字。' },
        { id: 'A1_019', word: 'sometimes', chinese: '有時候', pos: 'adv. 副詞', level: 'A1', example: 'Sometimes I walk to school.', exampleCn: '有時候我走路上學。' },
        { id: 'A1_020', word: 'together', chinese: '一起', pos: 'adv. 副詞', level: 'A1', example: 'Let\'s play together.', exampleCn: '我們一起玩吧。' },

        // ========== A2 Flyers (進階初級) ==========
        { id: 'A2_001', word: 'adventure', chinese: '冒險', pos: 'n. 名詞', level: 'A2', example: 'I love adventure stories.', exampleCn: '我喜歡冒險故事。' },
        { id: 'A2_002', word: 'believe', chinese: '相信', pos: 'v. 動詞', level: 'A2', example: 'I believe in you.', exampleCn: '我相信你。' },
        { id: 'A2_003', word: 'competition', chinese: '比賽', pos: 'n. 名詞', level: 'A2', example: 'I won the competition.', exampleCn: '我贏得了比賽。' },
        { id: 'A2_004', word: 'different', chinese: '不同的', pos: 'adj. 形容詞', level: 'A2', example: 'We are different.', exampleCn: '我們是不同的。' },
        { id: 'A2_005', word: 'experience', chinese: '經驗', pos: 'n. 名詞', level: 'A2', example: 'It was a great experience.', exampleCn: '這是很棒的經驗。' },
        { id: 'A2_006', word: 'famous', chinese: '著名的', pos: 'adj. 形容詞', level: 'A2', example: 'He is a famous singer.', exampleCn: '他是著名的歌手。' },
        { id: 'A2_007', word: 'geography', chinese: '地理', pos: 'n. 名詞', level: 'A2', example: 'I like geography class.', exampleCn: '我喜歡地理課。' },
        { id: 'A2_008', word: 'history', chinese: '歷史', pos: 'n. 名詞', level: 'A2', example: 'History is interesting.', exampleCn: '歷史很有趣。' },
        { id: 'A2_009', word: 'imagine', chinese: '想像', pos: 'v. 動詞', level: 'A2', example: 'Imagine you can fly.', exampleCn: '想像你可以飛。' },
        { id: 'A2_010', word: 'journey', chinese: '旅程', pos: 'n. 名詞', level: 'A2', example: 'The journey takes two hours.', exampleCn: '旅程需要兩小時。' },
        { id: 'A2_011', word: 'knowledge', chinese: '知識', pos: 'n. 名詞', level: 'A2', example: 'Knowledge is power.', exampleCn: '知識就是力量。' },
        { id: 'A2_012', word: 'language', chinese: '語言', pos: 'n. 名詞', level: 'A2', example: 'I learn a new language.', exampleCn: '我學習新語言。' },
        { id: 'A2_013', word: 'message', chinese: '訊息', pos: 'n. 名詞', level: 'A2', example: 'I got your message.', exampleCn: '我收到你的訊息了。' },
        { id: 'A2_014', word: 'nervous', chinese: '緊張的', pos: 'adj. 形容詞', level: 'A2', example: 'I feel nervous.', exampleCn: '我感到緊張。' },
        { id: 'A2_015', word: 'opinion', chinese: '意見', pos: 'n. 名詞', level: 'A2', example: 'What is your opinion?', exampleCn: '你的意見是什麼？' },
        { id: 'A2_016', word: 'popular', chinese: '受歡迎的', pos: 'adj. 形容詞', level: 'A2', example: 'This song is popular.', exampleCn: '這首歌很受歡迎。' },
        { id: 'A2_017', word: 'quickly', chinese: '快速地', pos: 'adv. 副詞', level: 'A2', example: 'He runs quickly.', exampleCn: '他跑得很快。' },
        { id: 'A2_018', word: 'responsible', chinese: '負責的', pos: 'adj. 形容詞', level: 'A2', example: 'She is responsible for this.', exampleCn: '她對此負責。' },
        { id: 'A2_019', word: 'suddenly', chinese: '突然地', pos: 'adv. 副詞', level: 'A2', example: 'Suddenly, it started raining.', exampleCn: '突然開始下雨了。' },
        { id: 'A2_020', word: 'traditional', chinese: '傳統的', pos: 'adj. 形容詞', level: 'A2', example: 'This is traditional food.', exampleCn: '這是傳統食物。' },

        // ========== KET (A2 Key) ==========
        { id: 'KET_001', word: 'accommodation', chinese: '住宿', pos: 'n. 名詞', level: 'KET', example: 'We need accommodation for tonight.', exampleCn: '我們今晚需要住宿。' },
        { id: 'KET_002', word: 'appointment', chinese: '預約', pos: 'n. 名詞', level: 'KET', example: 'I have an appointment at 3 PM.', exampleCn: '我下午三點有預約。' },
        { id: 'KET_003', word: 'available', chinese: '可用的', pos: 'adj. 形容詞', level: 'KET', example: 'Is this seat available?', exampleCn: '這個座位有人嗎？' },
        { id: 'KET_004', word: 'convenient', chinese: '方便的', pos: 'adj. 形容詞', level: 'KET', example: 'The location is convenient.', exampleCn: '這個位置很方便。' },
        { id: 'KET_005', word: 'department', chinese: '部門', pos: 'n. 名詞', level: 'KET', example: 'He works in the sales department.', exampleCn: '他在銷售部門工作。' },
        { id: 'KET_006', word: 'emergency', chinese: '緊急情況', pos: 'n. 名詞', level: 'KET', example: 'Call 119 in an emergency.', exampleCn: '緊急情況請打119。' },
        { id: 'KET_007', word: 'facilities', chinese: '設施', pos: 'n. 名詞', level: 'KET', example: 'The hotel has great facilities.', exampleCn: '這家飯店設施很好。' },
        { id: 'KET_008', word: 'government', chinese: '政府', pos: 'n. 名詞', level: 'KET', example: 'The government made a decision.', exampleCn: '政府做了決定。' },
        { id: 'KET_009', word: 'immediately', chinese: '立即', pos: 'adv. 副詞', level: 'KET', example: 'Please come immediately.', exampleCn: '請立即過來。' },
        { id: 'KET_010', word: 'instruction', chinese: '說明', pos: 'n. 名詞', level: 'KET', example: 'Read the instructions carefully.', exampleCn: '仔細閱讀說明。' },
        { id: 'KET_011', word: 'membership', chinese: '會員資格', pos: 'n. 名詞', level: 'KET', example: 'I renewed my membership.', exampleCn: '我更新了會員資格。' },
        { id: 'KET_012', word: 'necessary', chinese: '必要的', pos: 'adj. 形容詞', level: 'KET', example: 'It is necessary to study.', exampleCn: '學習是必要的。' },
        { id: 'KET_013', word: 'opportunity', chinese: '機會', pos: 'n. 名詞', level: 'KET', example: 'This is a great opportunity.', exampleCn: '這是個好機會。' },
        { id: 'KET_014', word: 'permission', chinese: '許可', pos: 'n. 名詞', level: 'KET', example: 'I need your permission.', exampleCn: '我需要你的許可。' },
        { id: 'KET_015', word: 'qualification', chinese: '資格', pos: 'n. 名詞', level: 'KET', example: 'What are your qualifications?', exampleCn: '你有什麼資格？' },
        { id: 'KET_016', word: 'recommend', chinese: '推薦', pos: 'v. 動詞', level: 'KET', example: 'I recommend this restaurant.', exampleCn: '我推薦這家餐廳。' },
        { id: 'KET_017', word: 'schedule', chinese: '時間表', pos: 'n. 名詞', level: 'KET', example: 'Check the bus schedule.', exampleCn: '查看公車時刻表。' },
        { id: 'KET_018', word: 'temperature', chinese: '溫度', pos: 'n. 名詞', level: 'KET', example: 'The temperature is high today.', exampleCn: '今天溫度很高。' },
        { id: 'KET_019', word: 'unfortunately', chinese: '不幸地', pos: 'adv. 副詞', level: 'KET', example: 'Unfortunately, I can\'t come.', exampleCn: '不幸的是，我不能來。' },
        { id: 'KET_020', word: 'volunteer', chinese: '志工', pos: 'n. 名詞', level: 'KET', example: 'I work as a volunteer.', exampleCn: '我當志工。' },

        // ========== PET (B1 Preliminary) ==========
        { id: 'PET_001', word: 'accomplish', chinese: '完成', pos: 'v. 動詞', level: 'PET', example: 'I accomplished my goal.', exampleCn: '我完成了我的目標。' },
        { id: 'PET_002', word: 'atmosphere', chinese: '氣氛', pos: 'n. 名詞', level: 'PET', example: 'The atmosphere is friendly.', exampleCn: '氣氛很友善。' },
        { id: 'PET_003', word: 'circumstances', chinese: '情況', pos: 'n. 名詞', level: 'PET', example: 'Under these circumstances, we must wait.', exampleCn: '在這種情況下，我們必須等待。' },
        { id: 'PET_004', word: 'consequence', chinese: '後果', pos: 'n. 名詞', level: 'PET', example: 'Think about the consequences.', exampleCn: '想想後果。' },
        { id: 'PET_005', word: 'determination', chinese: '決心', pos: 'n. 名詞', level: 'PET', example: 'She has great determination.', exampleCn: '她很有決心。' },
        { id: 'PET_006', word: 'enthusiasm', chinese: '熱情', pos: 'n. 名詞', level: 'PET', example: 'He showed great enthusiasm.', exampleCn: '他表現出極大的熱情。' },
        { id: 'PET_007', word: 'flexibility', chinese: '彈性', pos: 'n. 名詞', level: 'PET', example: 'The job requires flexibility.', exampleCn: '這份工作需要彈性。' },
        { id: 'PET_008', word: 'guarantee', chinese: '保證', pos: 'v. 動詞', level: 'PET', example: 'I guarantee it will work.', exampleCn: '我保證它會有效。' },
        { id: 'PET_009', word: 'hesitate', chinese: '猶豫', pos: 'v. 動詞', level: 'PET', example: 'Don\'t hesitate to ask.', exampleCn: '不要猶豫發問。' },
        { id: 'PET_010', word: 'independent', chinese: '獨立的', pos: 'adj. 形容詞', level: 'PET', example: 'She is very independent.', exampleCn: '她很獨立。' },
        { id: 'PET_011', word: 'maintain', chinese: '維持', pos: 'v. 動詞', level: 'PET', example: 'We must maintain our standards.', exampleCn: '我們必須維持我們的標準。' },
        { id: 'PET_012', word: 'negotiate', chinese: '談判', pos: 'v. 動詞', level: 'PET', example: 'We need to negotiate the price.', exampleCn: '我們需要談判價格。' },
        { id: 'PET_013', word: 'participate', chinese: '參與', pos: 'v. 動詞', level: 'PET', example: 'Everyone can participate.', exampleCn: '每個人都可以參與。' },
        { id: 'PET_014', word: 'persuade', chinese: '說服', pos: 'v. 動詞', level: 'PET', example: 'I persuaded him to come.', exampleCn: '我說服他來了。' },
        { id: 'PET_015', word: 'previous', chinese: '先前的', pos: 'adj. 形容詞', level: 'PET', example: 'In my previous job...', exampleCn: '在我先前的工作中...' },
        { id: 'PET_016', word: 'reliable', chinese: '可靠的', pos: 'adj. 形容詞', level: 'PET', example: 'He is a reliable person.', exampleCn: '他是可靠的人。' },
        { id: 'PET_017', word: 'significant', chinese: '重要的', pos: 'adj. 形容詞', level: 'PET', example: 'This is a significant change.', exampleCn: '這是重要的改變。' },
        { id: 'PET_018', word: 'sufficient', chinese: '足夠的', pos: 'adj. 形容詞', level: 'PET', example: 'Is this sufficient?', exampleCn: '這樣足夠嗎？' },
        { id: 'PET_019', word: 'therefore', chinese: '因此', pos: 'adv. 副詞', level: 'PET', example: 'Therefore, we must act now.', exampleCn: '因此，我們必須現在行動。' },
        { id: 'PET_020', word: 'whereas', chinese: '然而', pos: 'conj. 連接詞', level: 'PET', example: 'I like coffee, whereas she likes tea.', exampleCn: '我喜歡咖啡，然而她喜歡茶。' },

        // ========== FCE (B2 First) ==========
        { id: 'FCE_001', word: 'acknowledge', chinese: '承認', pos: 'v. 動詞', level: 'FCE', example: 'I acknowledge my mistake.', exampleCn: '我承認我的錯誤。' },
        { id: 'FCE_002', word: 'anticipate', chinese: '預期', pos: 'v. 動詞', level: 'FCE', example: 'We anticipate some difficulties.', exampleCn: '我們預期會有一些困難。' },
        { id: 'FCE_003', word: 'comprehensive', chinese: '全面的', pos: 'adj. 形容詞', level: 'FCE', example: 'This is a comprehensive report.', exampleCn: '這是一份全面的報告。' },
        { id: 'FCE_004', word: 'controversial', chinese: '有爭議的', pos: 'adj. 形容詞', level: 'FCE', example: 'It is a controversial topic.', exampleCn: '這是有爭議的話題。' },
        { id: 'FCE_005', word: 'deteriorate', chinese: '惡化', pos: 'v. 動詞', level: 'FCE', example: 'The situation deteriorated quickly.', exampleCn: '情況迅速惡化。' },
        { id: 'FCE_006', word: 'distinguish', chinese: '區分', pos: 'v. 動詞', level: 'FCE', example: 'Can you distinguish between them?', exampleCn: '你能區分它們嗎？' },
        { id: 'FCE_007', word: 'elaborate', chinese: '詳細說明', pos: 'v. 動詞', level: 'FCE', example: 'Could you elaborate on that?', exampleCn: '你能詳細說明嗎？' },
        { id: 'FCE_008', word: 'fundamental', chinese: '基本的', pos: 'adj. 形容詞', level: 'FCE', example: 'This is a fundamental principle.', exampleCn: '這是基本原則。' },
        { id: 'FCE_009', word: 'implication', chinese: '含義', pos: 'n. 名詞', level: 'FCE', example: 'What are the implications?', exampleCn: '有什麼含義？' },
        { id: 'FCE_010', word: 'inevitable', chinese: '不可避免的', pos: 'adj. 形容詞', level: 'FCE', example: 'Change is inevitable.', exampleCn: '改變是不可避免的。' },
        { id: 'FCE_011', word: 'justify', chinese: '證明...合理', pos: 'v. 動詞', level: 'FCE', example: 'Can you justify your decision?', exampleCn: '你能證明你的決定合理嗎？' },
        { id: 'FCE_012', word: 'legitimate', chinese: '合法的', pos: 'adj. 形容詞', level: 'FCE', example: 'This is a legitimate concern.', exampleCn: '這是合理的擔憂。' },
        { id: 'FCE_013', word: 'phenomenon', chinese: '現象', pos: 'n. 名詞', level: 'FCE', example: 'It is a natural phenomenon.', exampleCn: '這是自然現象。' },
        { id: 'FCE_014', word: 'predominant', chinese: '主要的', pos: 'adj. 形容詞', level: 'FCE', example: 'Blue is the predominant color.', exampleCn: '藍色是主要顏色。' },
        { id: 'FCE_015', word: 'presumably', chinese: '大概', pos: 'adv. 副詞', level: 'FCE', example: 'Presumably, he will come.', exampleCn: '大概他會來。' },
        { id: 'FCE_016', word: 'sophisticated', chinese: '複雜的', pos: 'adj. 形容詞', level: 'FCE', example: 'It is a sophisticated system.', exampleCn: '這是一個複雜的系統。' },
        { id: 'FCE_017', word: 'substantial', chinese: '大量的', pos: 'adj. 形容詞', level: 'FCE', example: 'We made substantial progress.', exampleCn: '我們取得了大量的進展。' },
        { id: 'FCE_018', word: 'thorough', chinese: '徹底的', pos: 'adj. 形容詞', level: 'FCE', example: 'We need a thorough investigation.', exampleCn: '我們需要徹底調查。' },
        { id: 'FCE_019', word: 'underlying', chinese: '潛在的', pos: 'adj. 形容詞', level: 'FCE', example: 'What is the underlying cause?', exampleCn: '潛在原因是什麼？' },
        { id: 'FCE_020', word: 'versatile', chinese: '多才多藝的', pos: 'adj. 形容詞', level: 'FCE', example: 'She is a versatile actress.', exampleCn: '她是一位多才多藝的演員。' }
    ],

    // 根據等級取得單字
    getByLevel(level) {
        return this.words.filter(w => w.level === level);
    },

    // 根據 ID 取得單字
    getById(id) {
        return this.words.find(w => w.id === id);
    },

    // 取得統計資訊
    getStats() {
        const stats = {};
        this.levelOrder.forEach(level => {
            stats[level] = this.getByLevel(level).length;
        });
        stats.total = this.words.length;
        return stats;
    }
};

window.WordBank = WordBank;

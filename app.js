// Данные этапов (полная версия)
const stages = {
    1: {
        title: "🍎 ЭТАП 1: ЗАРАЖЕНИЕ",
        description: "Безумный ученый Агриус провел неудачный эксперимент! Все животные на ферме стали зомби. Найдите зараженное яблоко с кодом.",
        task: "Отсканируйте QR-код на входе и найдите яблоко с кодом",
        hint: "Код состоит из слова и года через нижнее подчеркивание",
        fact: "Интересный факт: Первые фермы появились около 12 000 лет назад!",
        answer: "ЗАРАЖЕНИЕ_2024",
        points: 100
    },
    2: {
        title: "🥚 ЭТАП 2: ТАЙНА ЗОМБИ-ЯИЦ",
        description: "Зомби-куры снесли яйца со странными символами! Найдите все яйца и расшифруйте код.",
        task: "Найдите 5 яиц с символами в курятнике",
        hint: "Символы: Ω † ∞ ¤ § (введите их подряд)",
        fact: "Куры могут запомнить до 100 разных лиц!",
        answer: "Ω†∞¤§",
        points: 150
    },
    3: {
        title: "🦢 ЭТАП 3: ГУСИНОЕ СЕЛФИ",
        description: "Пройдите через территорию гусей-охранников и сделайте крутое селфи!",
        task: "Сделайте селфи с гусями и поделитесь в соцсетях",
        hint: "Используйте хэштег #ЗомбиФерма2024",
        fact: "Гуси образуют пары на всю жизнь!",
        answer: "ГУСИ_ОХРАННИКИ",
        points: 200
    },
    4: {
        title: "🦙 ЭТАП 4: ТАЙНА ЛАМЫ",
        description: "Лама на ферме знает секрет! Но она говорит только на языке жестов.",
        task: "Расшифруйте жесты ламы и найдите код",
        hint: "Код: 4 цифры (год основания фермы)",
        fact: "Ламы используются как сторожевые животные для охраны овец!",
        answer: "1998",
        points: 250
    },
    5: {
        title: "🦘 ЭТАП 5: ПРЫГАЮЩИЙ КЕНГУРУ",
        description: "Кенгуру-зомби прыгает по ферме и оставляет следы! Проследите за ним.",
        task: "Найдите все места, где прыгал кенгуру",
        hint: "Количество прыжков = код",
        fact: "Кенгуру не могут двигать задними лапами независимо друг от друга!",
        answer: "7",
        points: 300
    },
    6: {
        title: "🐄 ЭТАП 6: МОЛОКО ЗОМБИ",
        description: "Коровы дают зараженное молоко! Найдите антидот в молочном цеху.",
        task: "Решите головоломку с бутылками молока",
        hint: "Код: цвет бутылки + номер",
        fact: "Корова может узнать до 50 других коров!",
        answer: "ЗЕЛЕНЫЙ7",
        points: 350
    },
    7: {
        title: "🐑 ЭТАП 7: ОВЕЧЬЯ ШЕРСТЬ",
        description: "Овцы стали агрессивными! Успокойте их, найдя правильный подход.",
        task: "Посчитайте количество белых и черных овец",
        hint: "Код: белые_черные (например: 12_8)",
        fact: "Овцы имеют поле зрения 270 градусов!",
        answer: "15_10",
        points: 400
    },
    8: {
        title: "📱 ЭТАП 8: ТЕХНОЛОГИИ",
        description: "Найдите планшет с данными эксперимента! Взломайте пароль.",
        task: "Решите цифровую головоломку",
        hint: "Пароль: дата эксперимента (дд.мм.гггг)",
        fact: "Первые смартфоны появились в 1992 году!",
        answer: "15.03.2024",
        points: 450
    },
    9: {
        title: "🧩 ЭТАП 9: ПАЗЛ ЛАБОРАТОРИИ",
        description: "Соберите пазл с планом лаборатории! Найдите скрытое сообщение.",
        task: "Соберите пазл из 12 частей",
        hint: "Код: первые буквы слов на пазле",
        fact: "Самый большой пазл в мире состоит из 551,232 деталей!",
        answer: "СПАСИТЕФЕРМУ",
        points: 500
    },
    10: {
        title: "🔦 ЭТАП 10: НОЧНАЯ ОХОТА",
        description: "Ночью зомби-животные активнее! Найдите их с фонариком.",
        task: "Найдите 5 спрятанных предметов ночью",
        hint: "Код: количество найденных предметов",
        fact: "Многие животные видят в темноте в 6 раз лучше человека!",
        answer: "5",
        points: 550
    },
    11: {
        title: "🧪 ЭТАП 11: ЛАБОРАТОРИЯ",
        description: "Проберитесь в лабораторию Агриуса! Создайте антидот.",
        task: "Смешайте правильные ингредиенты",
        hint: "Код: формула антидота (например: A+B+C)",
        fact: "Первый антибиотик был открыт в 1928 году!",
        answer: "ЗЕЛЕНЬ+КРАСНЫЙ+СИНИЙ",
        points: 600
    },
    12: {
        title: "🎭 ЭТАП 12: МАСКАРАД",
        description: "Агриус спрятался среди зомби! Найдите его по особенностям.",
        task: "Найдите отличия у настоящего Агриуса",
        hint: "Код: количество отличий",
        fact: "Искусство маскировки существует тысячи лет!",
        answer: "3",
        points: 650
    },
    13: {
        title: "🏆 ЭТАП 13: ФИНАЛЬНАЯ БИТВА",
        description: "Последнее противостояние с Агриусом! Используйте антидот.",
        task: "Введите финальный код для спасения фермы",
        hint: "Код: общее количество животных на ферме",
        fact: "Ферма спасена! Вы стали героем!",
        answer: "42",
        points: 1000
    }
};
function endGame() {
    stopGame();
    
    const stageContent = document.getElementById('stage-content');
    const totalStages = Object.keys(stages).length;
    const completedStages = gameState.currentStage - 1;
    const completionPercent = Math.round((completedStages / totalStages) * 100);
    
    let title, message;
    if (completedStages === totalStages) {
        title = "🎉 ПОБЕДА!";
        message = "Вы полностью спасли ферму от зомби-вируса!";
    } else if (completedStages >= totalStages * 0.7) {
        title = "🥈 ОТЛИЧНЫЙ РЕЗУЛЬТАТ!";
        message = "Вы спасли большую часть фермы!";
    } else if (completedStages >= totalStages * 0.4) {
        title = "🥉 ХОРОШАЯ ПОПЫТКА!";
        message = "Вы спасли часть животных!";
    } else {
        title = "💪 ПРОДОЛЖАЙТЕ БОРОТЬСЯ!";
        message = "Ферма еще нуждается в вашей помощи!";
    }
    
    stageContent.innerHTML = `
        <div class="game-complete">
            <h2>${title}</h2>
            <p>${message}</p>
            
            <div class="final-stats">
                <div class="stat-item">
                    <span>🎯 Пройдено этапов:</span>
                    <span>${completedStages}/${totalStages} (${completionPercent}%)</span>
                </div>
                <div class="stat-item">
                    <span>🏆 Набрано очков:</span>
                    <span>${gameState.score}</span>
                </div>
                <div class="stat-item">
                    <span>⭐ Рейтинг:</span>
                    <span>${getRating(gameState.score)}</span>
                </div>
            </div>
            
            <div class="progress-bar" style="margin: 20px 0;">
                <div class="progress-fill" style="width: ${completionPercent}%"></div>
            </div>
            
            <div class="results-buttons">
                <button onclick="startGame()" class="btn-primary">🔄 ИГРАТЬ СНОВА</button>
                <button onclick="showMainMenu()" class="btn-secondary">🏠 ГЛАВНОЕ МЕНЮ</button>
                <button onclick="shareResults()" class="btn-secondary">📤 ПОДЕЛИТЬСЯ</button>
            </div>
        </div>
    `;
    
    // Отправляем данные в Telegram
    tg.sendData(JSON.stringify({
        action: 'game_complete',
        score: gameState.score,
        stages: completedStages,
        total_stages: totalStages,
        rating: getRating(gameState.score)
    }));
}

function getRating(score) {
    if (score >= 5000) return "🧙‍♂️ ЛЕГЕНДА ФЕРМЫ";
    if (score >= 4000) return "🏆 МАСТЕР СПАСЕНИЯ";
    if (score >= 3000) return "⭐ ГЕРОЙ ФЕРМЫ";
    if (score >= 2000) return "👍 ОПЫТНЫЙ ФЕРМЕР";
    if (score >= 1000) return "🌱 НАЧИНАЮЩИЙ";
    return "🎯 НОВИЧОК";
}

function shareResults() {
    const results = {
        score: gameState.score,
        stages: gameState.currentStage - 1,
        total: Object.keys(stages).length
    };
    
    const shareText = `Я прошел(а) ${results.stages} из ${results.total} этапов в игре "Зомби-Ферма" и набрал(а) ${results.score} очков! 🧟🏆\n\nПрисоединяйся: ${WEBAPP_URL}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой результат в Зомби-Ферме',
            text: shareText,
            url: WEBAPP_URL
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('📋 Результат скопирован! Поделитесь с друзьями!', 'success');
        });
    }
}

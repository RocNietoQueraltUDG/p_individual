export var gameA = function() {
    const back = '../resources/back.png';
    const resources = [
        '../resources/cb.png', '../resources/co.png',
        '../resources/sb.png', '../resources/so.png',
        '../resources/tb.png', '../resources/to.png'
    ];
    const card = {
        current: back,
        clickable: true,
        isDone: false,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, this.exposureTime);
        },
        goFront: function() {
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function(other) {
            if (this.front === other.front)
                this.isDone = other.isDone = true;
            return this.isDone;
        }
    };

    var lastCard;
    var options = JSON.parse(localStorage.getItem('options')) || {};
    var optionsM2 = JSON.parse(localStorage.getItem('optionsM2')) || {};
    var level = options.level || 1; // Start from level 1 if not set

    // Set options based on the level
    
    function setOptionsForLevel(level) {
        if (optionsM2.difficulty == "easy"){
            if (level === 1) {
                options = { pairs: 2, difficulty: 'easy' };
            } else if (level === 2) {
                options = { pairs: 3, difficulty: 'easy' };
            } else if (level === 3) {
                options = { pairs: 4, difficulty: 'normal' };
            } else if (level === 4) {
                options = { pairs: 5, difficulty: 'normal' };
            } else if (level === 5) {
                options = { pairs: 6, difficulty: 'normal' };
            } else if (level === 6) {
                options = { pairs: 6, difficulty: 'hard' };
            }
        }else if (optionsM2.difficulty == "normal"){
            if (level === 1) {
                options = { pairs: 2, difficulty: 'normal' };
            } else if (level === 2) {
                options = { pairs: 3, difficulty: 'normal' };
            } else if (level === 3) {
                options = { pairs: 4, difficulty: 'normal' };
            } else if (level === 4) {
                options = { pairs: 5, difficulty: 'normal' };
            } else if (level === 5) {
                options = { pairs: 6, difficulty: 'hard' };
            } else if (level === 6) {
                options = { pairs: 6, difficulty: 'hard' };
            }
        }else if (optionsM2.difficulty == "hard"){
            if (level === 1) {
                options = { pairs: 2, difficulty: 'hard' };
            } else if (level === 2) {
                options = { pairs: 3, difficulty: 'hard' };
            } else if (level === 3) {
                options = { pairs: 4, difficulty: 'hard' };
            } else if (level === 4) {
                options = { pairs: 5, difficulty: 'hard' };
            } else if (level === 5) {
                options = { pairs: 6, difficulty: 'hard' };
            } else if (level === 6) {
                options = { pairs: 6, difficulty: 'hard' };
            }
        }
    }

    function resetOptions() {
        options = { level: 1, pairs: 2, difficulty: 'easy', points: 100 };
        localStorage.setItem('options', JSON.stringify(options));
    }

    setOptionsForLevel(level);

    function updateScoreboard(name, points) {
        const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
        scoreboard.push({ name, points });
        localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
    }
    
    function resetScoreboard() {
        localStorage.removeItem('scoreboard');
    }
    
    var pairs = options.pairs || 2;
    var points = options.points || 100;
    var difficultySettings = {
        easy: { exposureTime: 2000, pointsEarned: 50, pointsLost: 10 },
        normal: { exposureTime: 1000, pointsEarned: 100, pointsLost: 15 },
        hard: { exposureTime: 500, pointsEarned: 150, pointsLost: 30 }
    };
    var difficulty = options.difficulty || 'normal';
    var { exposureTime, pointsEarned, pointsLost } = difficultySettings[difficulty];

    var cards = [];

    return {
        init: function(call) {
            var items = resources.slice();
            items.sort(() => Math.random() - 0.5);
            items = items.slice(0, pairs);
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5);

            card.exposureTime = exposureTime;

            cards = items.map(item => {
                let carta = Object.create(card, { front: { value: item }, callback: { value: call } });
                carta.current = carta.front;
                carta.clickable = false;
                carta.goBack();
                return carta;
            });

            return cards;
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront();
            if (lastCard) {
                if (card.front === lastCard.front) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("Has superat el nivell " + level);
                        level++;
                        if (level > 6) { // If there are no more levels
                            alert("Has completat tots els nivells amb " + points + " punts!");
                            const playerName = prompt("Introdueix el teu nom:");
                            updateScoreboard(playerName, points);
                            resetOptions();
                            window.location.replace("../"); // Go to the menu
                        }  else {
                            setOptionsForLevel(level);
                            options.level = level;
                            options.points = points+50;
                            localStorage.setItem('options', JSON.stringify(options));
                            window.location.reload(); // Reload the page with new level options
                        }
                    }
                    points += pointsEarned;
                    card.isDone = true;
                    lastCard.isDone = true;
                    lastCard = null;
                } else {
                    [card, lastCard].forEach(c => c.goBack());
                    points -= pointsLost;
                    if (points <= 0) {
                        alert("Has perdut");
                        resetOptions();
                        window.location.replace("../"); // Go to the menu
                    }
                    lastCard = null;
                }
            } else {
                lastCard = card;
            }
        },
        getOptions: function() {
            return options;
        },
        clearCards: function() {
            cards = [];
            lastCard = null;
        }
    }
}();
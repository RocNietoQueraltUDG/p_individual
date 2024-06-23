export var gameA = (function() {
    const back = 'back';
    const resources = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
    const cardTemplate = {
        current: back,
        front: null,
        clickable: true,
        isDone: false,
        callback: null,
        goBack: function() {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                if (this.callback) this.callback();
            }, this.exposureTime);
        },
        goFront: function(last) {
            if (last) last.waiting = false;
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
        if (optionsM2.difficulty == "easy") {
            if (level === 1) {
                options.pairs = 2;
                options.difficulty = 'easy';
            } else if (level === 2) {
                options.pairs = 3;
                options.difficulty = 'easy';
            } else if (level === 3) {
                options.pairs = 4;
                options.difficulty = 'normal';
            } else if (level === 4) {
                options.pairs = 5;
                options.difficulty = 'normal';
            } else if (level === 5) {
                options.pairs = 6;
                options.difficulty = 'normal';
            } else if (level === 6) {
                options.pairs = 6;
                options.difficulty = 'hard';
            }
        } else if (optionsM2.difficulty == "normal") {
            if (level === 1) {
                options.pairs = 2;
                options.difficulty = 'normal';
            } else if (level === 2) {
                options.pairs = 3;
                options.difficulty = 'normal';
            } else if (level === 3) {
                options.pairs = 4;
                options.difficulty = 'normal';
            } else if (level === 4) {
                options.pairs = 5;
                options.difficulty = 'normal';
            } else if (level === 5) {
                options.pairs = 6;
                options.difficulty = 'hard';
            } else if (level === 6) {
                options.pairs = 6;
                options.difficulty = 'hard';
            }
        } else if (optionsM2.difficulty == "hard") {
            if (level === 1) {
                options.pairs = 2;
                options.difficulty = 'hard';
            } else if (level === 2) {
                options.pairs = 3;
                options.difficulty = 'hard';
            } else if (level === 3) {
                options.pairs = 4;
                options.difficulty = 'hard';
            } else if (level === 4) {
                options.pairs = 5;
                options.difficulty = 'hard';
            } else if (level === 5) {
                options.pairs = 6;
                options.difficulty = 'hard';
            } else if (level === 6) {
                options.pairs = 6;
                options.difficulty = 'hard';
            }
        }
        localStorage.setItem('options', JSON.stringify(options));
    }

    function resetOptions() {
        options = { level: 1, pairs: 2, difficulty: 'easy', points: 100 };
        localStorage.setItem('options', JSON.stringify(options));
    }

    function updateScoreboard(name, points) {
        const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
        scoreboard.push({ name, points });
        localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
    }
    
    function mixResources() {
        var items = resources.slice();
        items.sort(() => Math.random() - 0.5);
        items = items.slice(0, options.pairs);
        items = items.concat(items);
        items.sort(() => Math.random() - 0.5);
        return items;
    }
    alert(level)
    setOptionsForLevel(level);
    alert(options.pairs)
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
        init: function(callback) {
            setOptionsForLevel(level); // Ensure options are set for the current level
            alert(`Number of pairs: ${options.pairs}`); // Show alert with the number of pairs

            var items = mixResources();
            cards = items.map(item => {
                let carta = Object.create(cardTemplate, {
                    front: { value: item },
                    callback: { value: callback },
                    exposureTime: { value: exposureTime }
                });
                carta.current = carta.front; // Set current state to front initially
                carta.clickable = false; // Cards are not clickable initially

                setTimeout(() => {
                    carta.goBack(); 
                });

                return carta;
            });
            return cards;
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) {
                if (card.front === lastCard.front) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("Has superat el nivell " + level);
                        level++;
                        if (options.pairs !=6){
                            options.pairs ++
                        }
                        if (level > 6) { // If there are no more levels
                            alert("Has completat tots els nivells amb " + points + " punts!");
                            const playerName = prompt("Introdueix el teu nom:");
                            updateScoreboard(playerName, points);
                            resetOptions();
                            window.location.replace("../"); // Go to the menu
                        }  else {
                            setOptionsForLevel(level);
                            options.level = level;
                            options.points = points + 50;
                            localStorage.setItem('options', JSON.stringify(options));
                            window.location.reload(); // Reload the page with new level options
                        }
                    }
                    points += pointsEarned;
                    card.isDone = true;
                    lastCard.isDone = true;
                    lastCard = null;
                } else {
                    card.goBack();
                    lastCard.goBack();
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
})();
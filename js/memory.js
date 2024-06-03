export var game = function () {
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png', '../resources/so.png', '../resources/tb.png', '../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function () {
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, this.exposureTime); // Use this.exposureTime for the exposure time
        },
        goFront: function (last) {
            if (last)
                this.waiting = last.waiting = false;
            else
                this.waiting = true;
            this.current = this.front;
            this.clickable = false;
            this.callback();
        },
        check: function (other) {
            if (this.front === other.front)
                this.isDone = other.isDone = true;
            return this.isDone;
        }
    };

    var lastCard;
    var options = JSON.parse(localStorage.getItem('options')); // Read options from localStorage

    if (!options) {
        options = {
            pairs: 2,
            difficulty: 'normal'
        };
    }

    var pairs = options.pairs || 2; // Use saved options or default value if nothing is in localStorage
    var points = 100;
    var difficultySettings = {
        easy: { exposureTime: 2000, pointsEarned: 50, pointsLost: 10 }, // Adjust exposure times, points earned, and points lost based on difficulty
        normal: { exposureTime: 1000, pointsEarned: 100, pointsLost: 25 },
        hard: { exposureTime: 500, pointsEarned: 150, pointsLost: 50 }
    };
    var difficulty = options.difficulty || 'normal';
    var { exposureTime, pointsEarned, pointsLost } = difficultySettings[difficulty];
    var cards = [];

    var mix = function () {
        var items = resources.slice(); // Copy the array
        items.sort(() => Math.random() - 0.5); // Randomize
        items = items.slice(0, pairs); // Use the selected number of pairs
        items = items.concat(items);
        items.sort(() => Math.random() - 0.5); // Randomize again
        card.exposureTime = exposureTime; // Assign the exposure time to the card
        return items;
    }

    return {
        init: function (call) {
            if (sessionStorage.load && localStorage.save) {
                let partida = JSON.parse(localStorage.save);
                pairs = partida.pairs;
                points = partida.points;
                partida.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    cards.push(it);
                    if (it.current != back && !it.waiting && !it.isDone) it.goBack();
                    else if (it.waiting) lastCard = it;
                });
                return cards;
            }
            else return mix().map(item => {
                cards.push(Object.create(card, { front: { value: item }, callback: { value: call } }));
                return cards[cards.length - 1];
            });
        },
        click: function (card) {
            if (!card.clickable) return;
            card.goFront();
            if (lastCard) { // Second card
                if (card.front === lastCard.front) {
                    pairs--;
                    if (pairs <= 0) {
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                    points += pointsEarned; // Add pointsEarned for a correct match
                }
                else {
                    [card, lastCard].forEach(c => c.goBack());
                    points -= pointsLost; // Subtract pointsLost for a wrong match
                    if (points <= 0) {
                        alert("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // First card
        },
        getOptions: function () { // Add this function to get game options
            return options;
        },
        save: function () {
            var partida = {
                pairs: pairs,
                points: points,
                cards: []
            };
            cards.forEach(c => {
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });
            localStorage.save = JSON.stringify(partida);
        },
        saveToServer: function () {
            var partida = {
                uuid: "unique-game-identifier", // Generate a unique UUID or get it from somewhere
                gameData: {
                    pairs: pairs,
                    points: points,
                    cards: []
                }
            };
            cards.forEach(c => {
                partida.gameData.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            });
            fetch('../php/save_game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(partida)
            })
                .then(response => response.text())
                .then(data => alert(data))
                .catch(error => console.error('Error:', error));
        },
        loadFromServer: function (callback) {
            var uuid = "unique-game-identifier"; // The same UUID used for saving
            fetch('../php/load_game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: uuid })
            })
                .then(response => response.json())
                .then(data => {
                    pairs = data.pairs;
                    points = data.points;
                    cards = [];
                    data.cards.forEach(item => {
                        let it = Object.create(card);
                        it.front = item.front;
                        it.current = item.current;
                        it.isDone = item.isDone;
                        it.waiting = item.waiting;
                        it.callback = callback;
                        cards.push(it);
                        if (it.current != back && !it.waiting && !it.isDone) it.goBack();
                        else if (it.waiting) lastCard = it;
                    });
                    callback();
                })
                .catch(error => console.error('Error:', error));
        }
    }
}();

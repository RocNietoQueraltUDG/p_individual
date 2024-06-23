export var game = (function() {
    const back = 'back';
    const resources = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
    const cardTemplate = {
        current: back,
        clickable: true,
        isDone: false,
        exposureTime: 1000,
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
    var options = JSON.parse(localStorage.getItem('options')) || { pairs: 2, difficulty: 'normal' };

    var difficultySettings = {
        easy: { exposureTime: 2000, pointsEarned: 50, pointsLost: 10 },
        normal: { exposureTime: 1000, pointsEarned: 100, pointsLost: 25 },
        hard: { exposureTime: 500, pointsEarned: 150, pointsLost: 50 }
    };

    var difficulty = options.difficulty || 'normal';
    var { exposureTime, pointsEarned, pointsLost } = difficultySettings[difficulty];
    var cards = [];

    function mixResources() {
        var items = resources.slice();
        items.sort(() => Math.random() - 0.5);
        items = items.slice(0, options.pairs);
        items = items.concat(items);
        items.sort(() => Math.random() - 0.5);
        return items;
    }

    function resetOptions() {
        options = { pairs: 2, difficulty: 'easy', points: 100 };
        localStorage.setItem('options', JSON.stringify(options));
    }

    return {
        init: function(callback) {
            var items = mixResources();
            cards = items.map(item => {
                let carta = Object.create(cardTemplate, {
                    front: { value: item },
                    callback: { value: callback },
                    exposureTime: { value: exposureTime }
                });
                carta.goBack();
                return carta;
            });
            return cards;
        },
        click: function(card) {
            if (!card.clickable) return;
            card.goFront(lastCard);
            if (lastCard) {
                if (card.front === lastCard.front) {
                    options.pairs--;
                    if (options.pairs <= 0) {
                        alert(`You won with ${options.points} points!`);
                        resetOptions();
                        window.location.replace("../");
                    }
                    options.points += pointsEarned;
                    card.isDone = true;
                    lastCard.isDone = true;
                    lastCard = null;
                } else {
                    card.goBack();
                    lastCard.goBack();
                    options.points -= pointsLost;
                    if (options.points <= 0) {
                        alert("You lost");
                        resetOptions();
                        window.location.replace("../");
                    }
                    lastCard = null;
                }
            } else {
                lastCard = card;
            }
        },
        save: function() {
            var saveData = {
                uuid: localStorage.uuid,
                pairs: options.pairs,
                points: options.points,
                cards: cards.map(c => ({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                }))
            };
            let saveJSON = JSON.stringify(saveData);
            fetch("../php/save.php", {
                method: "POST",
                body: saveJSON,
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch(err => {
                console.log(err);
                localStorage.save = saveJSON;
            })
            .finally(() => {
                window.location.replace("../");
            });
        }
    }
})();
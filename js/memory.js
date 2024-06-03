import { random_uuid } from './uuidlib.js';

export var game = function(){
    // ... (el codi existent)

    return {
        // ... (altres funcions existents)
        save: function() {
            var partida = {
                pairs: pairs,
                points: points,
                cards: cards.map(c => ({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                }))
            };
            localStorage.setItem('partida', JSON.stringify(partida));
        },
        saveToServer: function() {
            var uuid = localStorage.getItem('uuid');
            if (!uuid) {
                uuid = random_uuid();
                localStorage.setItem('uuid', uuid);
            }

            var partida = {
                uuid: uuid,
                gameData: {
                    pairs: pairs,
                    points: points,
                    cards: cards.map(c => ({
                        current: c.current,
                        front: c.front,
                        isDone: c.isDone,
                        waiting: c.waiting
                    }))
                }
            };

            fetch('save_game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(partida)
            }).then(response => response.text()).then(data => {
                console.log(data);
            }).catch((error) => {
                console.error('Error:', error);
            });
        },
        load: function(callback) {
            var partida = JSON.parse(localStorage.getItem('partida'));
            if (partida) {
                pairs = partida.pairs;
                points = partida.points;
                cards = partida.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = callback;
                    return it;
                });
                callback();
            } else {
                alert("No hi ha cap partida guardada.");
            }
        },
        loadFromServer: function(callback) {
            var uuid = localStorage.getItem('uuid');
            if (!uuid) {
                alert("No hi ha partida guardada.");
                return;
            }

            fetch('load_game.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: uuid })
            }).then(response => response.json()).then(data => {
                // Carregar la partida des del servidor
                pairs = data.pairs;
                points = data.points;
                cards = data.cards.map(item => {
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = callback;
                    return it;
                });
                callback();
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }
}();
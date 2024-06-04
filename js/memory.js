export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, this.exposureTime); 
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };

    var lastCard;
    var options = JSON.parse(localStorage.getItem('options')); 

    if (!options) {
        options = {
            pairs: 2,
            difficulty: 'normal'
        };
    }

    var pairs = options.pairs || 2; 
    var points = 100;
    var difficultySettings = {
        easy: { exposureTime: 2000, pointsEarned: 50, pointsLost: 10 }, 
        normal: { exposureTime: 1000, pointsEarned: 100, pointsLost: 25 },
        hard: { exposureTime: 500, pointsEarned: 150, pointsLost: 50 }
    };
  
    var difficulty = options.difficulty || 'normal';
    var { exposureTime, pointsEarned, pointsLost } = difficultySettings[difficulty];
    var cards = [];
    var mix = function(){
        var items = resources.slice(); 
        items.sort(() => Math.random() - 0.5); 
        items = items.slice(0, pairs); 
        items = items.concat(items);
        return items;
    }
    return {
        init: function (call){
            alert ("Function call");
            alert (sessionStorage.load);
            alert (localStorage.load);
            if (sessionStorage.load && localStorage.save){ //load game
                alert ("Loading Game");
                let partida = JSON.parse(localStorage.save);
                pairs = partida.pairs;
                points = partida.points;
                partida.cards.map(item=>{
                    let it = Object.create(card);
                    it.front = item.front;
                    it.current = item.current;
                    it.isDone = item.isDone;
                    it.waiting = item.waiting;
                    it.callback = call;
                    cards.push(it);
                    if (it. current != back && !it.waiting && !it.isDone) it.goBack();
                    else if (it.waiting) lastCard = it;
                });
                return cards
            }
            else{
            alert ("New Game");
            return mix().map(item => { // new game
                let carta = Object.create(card, { front: { value: item }, callback: { value: call } });
                carta.exposureTime = exposureTime; 
                carta.current = carta.front;
                carta.clickable = false;
                carta.goBack();
                cards.push(carta);
                return carta;
              })
            };
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){ 
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                    points += pointsEarned; 
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points -= pointsLost; 
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; 
        },
        getOptions: function() { 
            return options;
        },
        save: function (){
            var partida= {
                pairs: pairs,
                points: points,
                cards: []
            };
            cards.forEach(c=>{
                partida.cards.push({
                    current: c.current,
                    front: c.front,
                    isDone: c.isDone,
                    waiting: c.waiting
                });
            })
            localStorage.save = JSON.stringify(partida);
        }
    }
}();

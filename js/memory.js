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
            }, this.exposureTime); // Use this.exposureTime for the exposure time
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
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

    return {
        init: function (call){
            var carta_array = [];
            var items = resources.slice(); // Copy the array
            items.sort(() => Math.random() - 0.5); // Randomize
            items = items.slice(0, pairs); // Use the selected number of pairs
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Randomize again
            
            card.exposureTime = exposureTime; // Assign the exposure time to the card
            
            return items.map(item => {
                let carta = Object.create(card, { front: { value: item }, callback: { value: call } });
                carta.current = carta.front;
                carta.clickable = false;
                carta_array.push(carta);
                carta.goBack();
                return carta;
            });
        },
        click: function (card){
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){ // Second card
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                    points += pointsEarned; // Add pointsEarned for a correct match
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points -= pointsLost; // Subtract pointsLost for a wrong match
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // First card
        },
        getOptions: function() { // Add this function to get game options
            return options;
        }
    }
}();

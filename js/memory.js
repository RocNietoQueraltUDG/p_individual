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
            }, 1000);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };

    var lastCard;
    var pairs = 2;
    var points = 100;

    return {
        init: function (call){
            var carta_array = [];
            var items = resources.slice(); // Copy the array
            items.sort(() => Math.random() - 0.5); // Randomize
            items = items.slice(0, pairs); // Take the first 'pairs' elements
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Randomize again
            
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
            if (lastCard){ // Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    points-=25;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
            }
            else lastCard = card; // Primera carta
        }
    }
}();
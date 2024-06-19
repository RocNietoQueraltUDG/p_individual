import { gameA as gController } from "./memoryAdventure.js";

var gameA = $('#gameA');

$('#save').on('click', ()=> {
    gController.save();
    alert("Game Saved");
});

gController.init(updateSRC).forEach(function(card, indx){
    gameA.append('<img id="c'+indx+'" class="card" title="card">');
    card.pointer = $('#c'+indx);
    card.pointer.on('click', () => gController.click(card));
    card.pointer.attr("src", card.current);
});

function updateSRC(){
    this.pointer.attr("src", this.current);
}
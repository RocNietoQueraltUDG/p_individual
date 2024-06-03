import { game as gController } from './memory.js';

$(document).ready(function () {
    var game = $('#game');

    $('#save').on('click', () => gController.save());
    $('#saveServer').on('click', () => gController.saveToServer());
    $('#loadServer').on('click', () => gController.loadFromServer(updateGame));

    function updateGame() {
        game.empty();
        gController.init(updateSRC).forEach(function (card, indx) {
            game.append('<img id="c' + indx + '" class="card" title="card" src="' + card.current + '">');
            card.pointer = $('#c' + indx);
            card.pointer.on('click', () => gController.click(card));
        });
    }

    function updateSRC() {
        this.pointer.attr("src", this.current);
    }

    gController.init(updateSRC).forEach(function (card, indx) {
        game.append('<img id="c' + indx + '" class="card" title="card" src="' + card.current + '">');
        card.pointer = $('#c' + indx);
        card.pointer.on('click', () => gController.click(card));
    });
});
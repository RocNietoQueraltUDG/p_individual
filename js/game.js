import { game as gController } from './memory.js';

$(document).ready(function() {
    $('#save').on('click', () => gController.save());
    $('#saveServer').on('click', () => gController.saveToServer());
    $('#loadServer').on('click', () => gController.loadFromServer(updateSRC));

    // Funció per actualitzar el SRC de les imatges
    function updateSRC() {
        // Implementació per actualitzar el SRC de les imatges de les cartes
    }

    // Inicialització del joc
    gController.init(updateSRC);
});
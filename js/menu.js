$(document).ready(function() {
    $('#play').click(function() {
        window.location.assign("./html/game.html");
    });

    $('#options').click(function() {
        window.location.assign("./html/options.html");
    });

    $('#saves').click(function() {
        console.error("Opció no implementada");
    });

    $('#exit').click(function() {
        console.warn("No es pot sortir!");
    });
});
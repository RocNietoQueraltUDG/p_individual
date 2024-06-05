$(document).ready(function() {
    $('#play').click(function() {
        sessionStorage.load = false;
        window.location.assign("./html/game.html");
    });

    $('#options').click(function() {
        window.location.assign("./html/options.html");
    });

    $('#saves').click(function() {
        sessionStorage.load = true;
        window.location.assign("./html/game.html");
    });

    $('#exit').click(function() {
        console.warn("No es pot sortir!");
    });
});
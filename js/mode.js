$(document).ready(function() {
    $('#play').click(function() {
        sessionStorage.load = false;
        window.location.assign("./game.html");
    });
    $('#adventure').click(function() {
        sessionStorage.load = false;
        window.location.assign("./gameA.html");
    });
});
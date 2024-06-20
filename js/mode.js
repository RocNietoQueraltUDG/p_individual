$(document).ready(function() {
    $('#play').click(function() {
        sessionStorage= false;
        window.location.assign("./options.html");
    });
    $('#adventure').click(function() {
        sessionStorage= false;
        window.location.assign("./gameA.html");
    });
});
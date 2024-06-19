$(document).ready(function() {
    $('#play').click(function() {
        sessionStorage.load = false;
        window.location.assign("./html/game.html");
    });
    $('#adventure').click(function() {
        sessionStorage.load = false;
        window.location.assign("./html/gameA.html");
    });


    $('#options').click(function() {
        window.location.assign("./html/options.html");
    });

    $('#saves').click(function() {
        fetch(".php/load.php",{
            method: "POST",
            body: "",
            headers: {"content-type":"application/json; charset=UTF-8"}
        })
        .then(response=>{
            if(response.ok) response.text();
            else throw("PHP connection fail");
        })
        .then(partida=>sessionStorage.save = partida)
        .catch(err=>sessionStorage.save = localStorage.save)
        .finally(()=>window.location.assign("./html/game.html"))
    });

    $('#exit').click(function() {
        console.warn("No es pot sortir!");
    });
});
var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal'
    };
    
    var pairs = $('#pairs');
    var difficulty = $('#dif');
    var pointsLost = {
    easy: 10,
    normal: 25,
    hard: 50
};

var options = JSON.parse(localStorage.options || JSON.stringify(default_options));

    var options = JSON.parse(localStorage.options || JSON.stringify(default_options));
    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
    pairs.on('change', () => options.pairs = pairs.val());
    difficulty.on('change', () => options.difficulty = difficulty.val());

    return {
        applyChanges: function(){
            localStorage.setItem('options', JSON.stringify(options)); // Canvia localStorage.options per localStorage.setItem('options', ...)
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
            this.applyChanges(); // Afegeix aquesta línia per guardar els valors per defecte a localStorage
        },
        getOptions: function() {  
            return options;
        }
    }
}();

$('#default').on('click',function(){
    options.defaultValues();
});

$('#apply').on('click',function(){
    options.applyChanges();
    sessionStorage.removeItem("save");
    location.assign("../html/game.html");
});
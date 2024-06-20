var optionsM2 = function(){
    const default_optionsM2 = {
        difficulty: 'easy'
    };
    
    var difficulty = $('#dif');
    ;

var optionsM2 = JSON.parse(localStorage.optionsM2 || JSON.stringify(default_optionsM2));

    var optionsM2 = JSON.parse(localStorage.optionsM2 || JSON.stringify(default_optionsM2));
    difficulty.val(optionsM2.difficulty);
    difficulty.on('change', () => optionsM2.difficulty = difficulty.val());

    return {
        applyChanges: function(){
            localStorage.setItem('options', JSON.stringify(optionsM2)); // Canvia localStorage.options per localStorage.setItem('options', ...)
        },
        defaultValues: function(){
            optionsM2.difficulty = default_optionsM2.difficulty;
            difficulty.val(optionsM2.difficulty);
            this.applyChanges(); // Afegeix aquesta línia per guardar els valors per defecte a localStorage
        },
        getOptions: function() {  
            return optionsM2;
        }
    }
}();

$('#default').on('click',function(){
    optionsM2.defaultValues();
});

$('#apply').on('click',function(){
    optionsM2.applyChanges();
    sessionStorage.removeItem("save");
    location.assign("../");
});
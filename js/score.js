document.addEventListener("DOMContentLoaded", () => {
    const scoreList = document.getElementById('scoreList');
    const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];

    $('#exit').click(function() {
        window.location.assign("../");
    });

    scoreboard.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score.name}, Points: ${score.points}`;
        scoreList.appendChild(li);
    });
});
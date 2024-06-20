document.addEventListener("DOMContentLoaded", () => {
    const scoreList = document.getElementById('scoreList');
    const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];

    // Sort scoreboard by points in descending order
    scoreboard.sort((a, b) => b.points - a.points);

    // Display only the top 10 scores
    const topScores = scoreboard.slice(0, 10);

    topScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score.name}, Points: ${score.points}`;
        scoreList.appendChild(li);
    });

    // Event listener for the exit button
    document.getElementById('exit').addEventListener('click', function() {
        window.location.assign("../");
    });
});
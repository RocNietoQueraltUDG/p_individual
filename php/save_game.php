<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Connexió a la base de dades
    $servername = "localhost";
    $username = "username";
    $password = "password";
    $dbname = "database";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connexió fallida: " . $conn->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $uuid = $data['uuid'];
    $gameData = $conn->real_escape_string(json_encode($data['gameData']));

    $sql = "REPLACE INTO games (uuid, game_data) VALUES ('$uuid', '$gameData')";

    if ($conn->query($sql) === TRUE) {
        echo "Partida guardada correctament";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
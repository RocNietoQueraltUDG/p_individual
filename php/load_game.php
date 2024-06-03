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

    $sql = "SELECT game_data FROM games WHERE uuid='$uuid'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['game_data'];
    } else {
        echo "No s'ha trobat cap partida amb aquest UUID";
    }

    $conn->close();
}
?>
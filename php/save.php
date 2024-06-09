<?php
    session_start();
    $POST =json_decode(file_get_contents('php://input'),true);

    $_SESSION['pairs']= $_POST['pairs'];
    $_SESSION['points']= $_POST['points'];
    $_SESSION['cards']= $_POST['cards'];

    echo json_encode(true);
    $encodeCards = json_encode($_SESSION['cards']);

    $conn = oci_connect('u1986968','','ORCLCDB');
    $insert="INSERT INTO memory_save
    (uuid, pairs, points, cards )
    VALUES
    (:uuid, :pairs, :poits, :cards )";
    $comanda = oci_parse($conn, $insert);
    oci_bind_by_name($comanda, ":uuid", $_SESSION['uuid']);
    oci_bind_by_name($comanda, ":pairs", $_SESSION['pairs']);
    oci_bind_by_name($comanda, ":points", $_SESSION['points']);
    oci_bind_by_name($comanda, ":cards", $encodeCards);
    oci_execute($comanda);
?>
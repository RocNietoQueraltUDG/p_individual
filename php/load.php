<?php
    session_start();
    $ret = new stdClass();
    $ret->pairs = $SESSION['pairs'];
    $ret->pairs = $SESSION['points'];
    $ret->pairs = $SESSION['cards'];

    echo json_encode($ret)
?>
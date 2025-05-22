<?php
include("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$idAgendamiento = intval($_POST['agendamiento']);
$idBateria = intval($_POST['idBateria']);
$porcentajeUsado = intval($_POST['porcentaje']);

$query = "SELECT porcentaje_carga FROM bateria WHERE ID_bateria = $idBateria";
$batteryQ = mysqli_query($conexion, $query);
$row = mysqli_fetch_assoc($batteryQ);
$porcentajeAnt =$row["porcentaje_carga"];

$actualizacionB = "UPDATE bateria SET porcentaje_carga = $porcentajeAnt - $porcentajeUsado WHERE ID_bateria = $idBateria";
mysqli_query($conexion, $actualizacionB);  

$actualizacionA = "UPDATE agendamiento SET estado_agendamiento = 'finalizado', ID_bateria = $idBateria WHERE ID_agendamiento = $idAgendamiento";
mysqli_query($conexion, $actualizacionA);  

mysqli_close($conexion);

?>
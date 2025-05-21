<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$sql = "SELECT DISTINCT fecha FROM agendamiento";
$result = $conexion->query($sql);

$fechas = [];

while ($row = $result->fetch_assoc()) {
    $fechas[] = $row['fecha'];
}

echo json_encode($fechas);

mysqli_close($conexion);
?>
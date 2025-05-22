<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

$appt = $_POST["agendamiento"];
// $appt = 29;

$date = date("Y-m-d");

$querry = "SELECT hora_inicio, hora_final FROM agendamiento WHERE ID_agendamiento = '$appt'"; 

$result = mysqli_query($conexion, $querry);

$row = mysqli_fetch_assoc($result);

$inicio0 = $row["hora_inicio"];
$fin0 = $row["hora_final"];
$inicio = new DateTime($inicio0);
$fin = new DateTime($fin0);
$duracionMinutos = $inicio->diff($fin)->i + ($inicio->diff($fin)->h * 60);
$bateriaNecesaria = ceil(($duracionMinutos / 5) * 3);

$buscarBateria = "SELECT * 
FROM bateria 
WHERE porcentaje_carga > $bateriaNecesaria
AND ID_bateria NOT IN (
    SELECT ID_bateria 
    FROM agendamiento
    WHERE (
        ('$inicio0' < hora_final AND '$fin0' > hora_inicio AND $date = fecha)
    )
)
ORDER BY porcentaje_carga DESC";

$resultadoBateria = $conexion->query($buscarBateria);


if ($resultadoBateria && $resultadoBateria->num_rows > 0) {
    $data = [];
    while ($row = mysqli_fetch_assoc($resultadoBateria)) {
        $data[] = $row;
    }
    echo json_encode(["success" => true, "message" => "Baterias disponibles", "data" => $data]);
} else {
    echo json_encode(["success" => false, "message" => "No hay baterías disponibles con suficiente carga"]);
}


mysqli_close($conexion);
?>
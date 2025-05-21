<?php
include("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$querry = "SELECT * FROM bateria";
$date = date("Y-m-d");
$dateFilter = date("Y-m-d", strtotime("-7 days"));

$result = mysqli_query($conexion, $querry);

if (!$result) {
    echo json_encode(["error" => mysqli_error($conexion)]);
    exit;
}


$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $id_bateria = $row['ID_bateria'];
    $querryHist = "SELECT * FROM agendamiento WHERE ID_bateria = '$id_bateria' AND fecha >= '$dateFilter' AND fecha <= '$date'";
    $resultHist = mysqli_query($conexion, $querryHist);
    $dataHist = [];
    while ($rowHist = mysqli_fetch_assoc($resultHist)) {
        $dataHist[] = $rowHist;
    }
    
    $row['historial'] = $dataHist;

    $data[] = $row;
}

echo json_encode(["success" => true, "message" => "Agendamientos enviados", "data" => $data]);

mysqli_close($conexion);

?>
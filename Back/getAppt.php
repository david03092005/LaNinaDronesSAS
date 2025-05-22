<?php
include("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$dateFilter = date("Y-m-d", strtotime("+7 days"));
$date = date("Y-m-d");

$querry = "SELECT * FROM agendamiento";

if ($dateFilter) {
   $conditions[] = "fecha >= '$date' AND fecha <= '$dateFilter'";
   $querry .= " WHERE " . implode(" AND ", $conditions); 
}


$result = mysqli_query($conexion, $querry);

if (!$result) {
    echo json_encode(["error" => mysqli_error($conexion)]);
    exit;
}


$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $id_robot = $row['ID_robot'];
    $querryHist = "SELECT imagen_robot FROM robot WHERE ID_robot = '$id_robot'";
    $resultHist = mysqli_query($conexion, $querryHist);
    
    $rowHist = mysqli_fetch_assoc($resultHist);
    $row['imagen_robot'] = $rowHist["imagen_robot"];

    $data[] = $row;
}

echo json_encode(["success" => true,  "data" => $data]);

mysqli_close($conexion);

?>
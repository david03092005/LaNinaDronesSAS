<?php
include("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$dateFilter = date("Y-m-d", strtotime("-7 days"));
$date = date("Y-m-d");

$querry = "SELECT * FROM agendamiento WHERE fecha >= '$dateFilter' And fecha <= '$date'";

// if ($dateFilter) {
//    $conditions[] = "fecha >= '$dateFilter'";
//    $querry .= " WHERE " . implode(" AND ", $conditions); 
// }

$result = mysqli_query($conexion, $querry);

if (!$result) {
    echo json_encode(["error" => mysqli_error($conexion)]);
    exit;
}


$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode(["success" => true, "message" => "Agendamientos enviados", "data" => $data]);

mysqli_close($conexion);

?>
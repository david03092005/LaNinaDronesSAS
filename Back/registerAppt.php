<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$cedulaUsuario = intval($_POST['cedulaUsuario']);
$cedulaAdmin = intval($_POST['cedulaAdmin']);
$fecha = $_POST['fecha'];
$horaInicio = $_POST['horaInicio'];
$estado = $_POST['estado'];
$peso = intval($_POST['peso']);
$alto = intval($_POST['alto']);
$ancho = intval($_POST['ancho']);
$largo = intval($_POST['largo']);
$destino = ($_POST['destino']);

$idBateria = 5;


if (!$cedulaUsuario || !$cedulaAdmin || !$fecha || !$horaInicio || !$estado) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

if ($peso <0 || $alto<0 || $ancho<0 || $largo<0) {
    echo json_encode(["success" => false, "message" => "Ingrese datos validos"]);
    exit();
}


$buscarUser = "SELECT * FROM usuario WHERE cedula_usuario = $cedulaUsuario";
$usuarioQ = mysqli_query($conexion, $buscarUser);

if ($usuarioQ->num_rows == 1){
    $fila = $usuarioQ->fetch_assoc();
    if ($fila['estado'] == 'penalizado'){
        echo json_encode(["success" => false, "message" => "Usuario se encuentra penalizado, no puede hacer reserva"]);
        exit();
    }
}
else{
    echo json_encode(["success" => false, "message" => "No se encuentra usuario"]);
    exit();
}

// Calcular hora final (+1 hora)
$horaInicioObj = new DateTime($horaInicio);
$horaInicioObj->add(new DateInterval('PT1H'));
$horaFinal = $horaInicioObj->format('H:i:s');

//Baterias
/*
$buscarBateria = "SELECT * 
FROM bateria 
WHERE ID_bateria NOT IN (
    SELECT ID_bateria 
    FROM agendamiento
) LIMIT 1";

$resultadoBateria = $conexion->query($buscarBateria);

if ($resultadoBateria && $resultadoBateria->num_rows > 0) {
    $bateria = $resultadoBateria->fetch_assoc();
    $idBateria = $bateria['ID_bateria'];

    // Puedes usar $idBateriaSeleccionada para guardar el agendamiento luego
}
else{
    echo json_encode(["success" => false, "message" => "No hay baterias disponibles"]);
    exit();
}
*/

// Obtener todos los tipos de robots y filtrar los que cumplen con las dimensiones y peso
$sqlTipos = "SELECT tipo_robot, peso_maximo, dimensiones_maximas FROM tipo";
$resultTipos = $conexion->query($sqlTipos);

$tiposValidos = [];
while ($row = $resultTipos->fetch_assoc()) {
    $tipoRobot = $row['tipo_robot'];
    $pesoMaximo = intval($row['peso_maximo']);
    
    // Separar dimensiones
    list($altoMax, $anchoMax, $largoMax) = array_map('intval', explode(',', $row['dimensiones_maximas']));

    // Comparar dimensiones y peso
    if (
        $peso <= $pesoMaximo &&
        $alto <= $altoMax &&
        $ancho <= $anchoMax &&
        $largo <= $largoMax
    ) {
        $tiposValidos[] = $row['tipo_robot']; // Guardamos tipo 0 o 1
    }
}

if (empty($tiposValidos)) {
    echo json_encode(["success" => false, "message" => "Ningun tipo de robot puede manejar esas dimensiones/peso."]);
    exit();
}

// Obtener robots ocupados en ese horario
$sqlOcupados = "SELECT ID_robot FROM agendamiento
                WHERE fecha = ?
                AND (
                    (hora_inicio < ? AND hora_final > ?)
                )";
$stmtOcupados = $conexion->prepare($sqlOcupados);
$stmtOcupados->bind_param("sss", $fecha, $horaFinal, $horaInicio);
$stmtOcupados->execute();
$resultOcupados = $stmtOcupados->get_result();

$robotsOcupados = [];
while ($row = $resultOcupados->fetch_assoc()) {
    $robotsOcupados[] = $row['ID_robot'];
}

// Buscar un robot libre de los tipos válidos
$robotDisponible = null;
$tipoAsignado = null;

foreach ($tiposValidos as $tipoRobot) {
    $sqlRobots = "SELECT * FROM robot WHERE tipo = ?";
    $stmtRobots = $conexion->prepare($sqlRobots);
    $stmtRobots->bind_param("i", $tipoRobot);
    $stmtRobots->execute();
    $resultRobots = $stmtRobots->get_result();

    while ($robot = $resultRobots->fetch_assoc()) {
        if (!in_array($robot['ID_robot'], $robotsOcupados) AND $robot['estado_robot'] == 'activo') {
            $robotDisponible = $robot['ID_robot'];
            $tipoAsignado = $tipoRobot;
            break 2; // Salir de ambos bucles
        }
    }
}

if ($robotDisponible !== null) {
    // Insertar en la tabla agendamiento
    $sqlInsert = "INSERT INTO agendamiento (cedula_usuario, cedula_administrador, fecha, hora_inicio, hora_final, estado_agendamiento, ID_robot, destino)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmtInsert = $conexion->prepare($sqlInsert);
    $stmtInsert->bind_param("iissssis", $cedulaUsuario, $cedulaAdmin, $fecha, $horaInicio, $horaFinal, $estado, $robotDisponible, $destino);
    $stmtInsert->execute();

    echo json_encode([
        "success" => true,
        "message" => "Robot asignado exitosamente",
        "ID_robot" => $robotDisponible,
        "tipo_robot_asignado" => $tipoAsignado
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No hay robots disponibles en ese horario para esos parámetros."]);
}



mysqli_close($conexion);
?>
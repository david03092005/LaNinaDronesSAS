<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$cedula = $_POST['cedula_administrador'] ?? '';

if (!empty($cedula)) {
    // Buscar un administrador específico por cédula
    $consulta = "SELECT * FROM administrador WHERE cedula_administrador = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->bind_param("i", $cedula);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $admin = $resultado->fetch_assoc();
        echo json_encode(["success" => true, "data" => $admin]);
    } else {
        echo json_encode(["success" => false, "message" => "Administrador no encontrado"]);
    }

    $stmt->close();
} else {
    // Mostrar todos los administradores
    $consulta = "SELECT * FROM administrador";
    $resultado = $conexion->query($consulta);

    if ($resultado->num_rows > 0) {
        $administradores = [];
        while ($fila = $resultado->fetch_assoc()) {
            $administradores[] = $fila;
        }
        echo json_encode(["success" => true, "data" => $administradores]);
    } else {
        echo json_encode(["success" => false, "message" => "No hay administradores registrados"]);
    }
}

$conexion->close();
?>

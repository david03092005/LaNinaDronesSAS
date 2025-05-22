<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Validar datos recibidos
if (!isset($_POST['cedula_admin']) || !isset($_POST['cedula_logueado'])) {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos."
    ]);
    exit;
}

$cedulaEliminar = $_POST['cedula_admin'];
$cedulaLogueado = $_POST['cedula_logueado'];

if ($cedulaEliminar == $cedulaLogueado) {
    echo json_encode([
        "success" => false,
        "message" => "No puedes eliminarte a ti mismo."
    ]);
    exit;
}

// Usar $conexion directamente
$sql = "DELETE FROM administrador WHERE cedula_administrador = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $cedulaEliminar);
$success = $stmt->execute();

if ($success) {
    echo json_encode([
        "success" => true,
        "message" => "Administrador eliminado correctamente."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al eliminar el administrador."
    ]);
}

$stmt->close();
$conexion->close();
?>

<?php
include("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$cedula = $_POST['cedula_administrador'] ?? null;
$nombre_usuario = $_POST['nombre_usuario'] ?? null;
$contrasena = $_POST['contrasena'] ?? null;

if (!$cedula) {
    echo json_encode(["success" => false, "message" => "Falta la cédula del administrador"]);
    exit;
}

$consulta = "SELECT * FROM administrador WHERE cedula_administrador = $cedula";
$resultado = mysqli_query($conexion, $consulta);

if (mysqli_num_rows($resultado) === 0) {
    echo json_encode(["success" => false, "message" => "Administrador no encontrado"]);
    exit;
}
$campos = [];

if ($nombre_usuario) {
    $campos[] = "nombre_usuario = '$nombre_usuario'";
}

if ($contrasena) {
    // $hash = password_hash($contrasena, PASSWORD_DEFAULT);
    // $campos[] = "contraseña = '$hash'";
    $campos[] = "contraseña = '$contrasena'";
}


if (empty($campos)) {
    echo json_encode(["success" => false, "message" => "No se enviaron datos para actualizar"]);
    exit;
}

$sql = "UPDATE administrador SET " . implode(', ', $campos) . " WHERE cedula_administrador = $cedula";

if (mysqli_query($conexion, $sql)) {
    echo json_encode(["success" => true, "message" => "Administrador actualizado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar administrador"]);
}

mysqli_close($conexion);
?>

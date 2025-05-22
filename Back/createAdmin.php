<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Recibir datos desde el frontend
$nombre = $_POST['nombre_administrador'];
$cedula = $_POST['cedula_administrador'];
$contrasena = $_POST['contrasena'];

// Validación de datos obligatorios
if (!$nombre || !$cedula || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

// Verificar si la cédula ya existe en la tabla administrador
$verificacionCedula = "SELECT 1 FROM administrador WHERE cedula_administrador = '$cedula'";
$resultadoVerificacion = mysqli_query($conexion, $verificacionCedula);
if (mysqli_num_rows($resultadoVerificacion) > 0) {
    echo json_encode(["success" => false, "message" => "La cédula ya está registrada como administrador"]);
    exit();
}


// Generar nombre_usuario único basado en el nombre
$conteoQuery = "SELECT COUNT(*) as total FROM administrador WHERE nombre_administrador LIKE '$nombre%'";
$resultadoConteo = mysqli_query($conexion, $conteoQuery);
$filaConteo = mysqli_fetch_assoc($resultadoConteo);
$sufijo = $filaConteo['total'] + 1;
$nombreUsuario = $nombre . $sufijo;

// Insertar nuevo administrador
$queryAdmin = "INSERT INTO administrador (cedula_administrador, nombre_administrador, nombre_usuario, contraseña) 
               VALUES ('$cedula', '$nombre', '$nombreUsuario', '$contrasena')";

if ($conexion->query($queryAdmin) === TRUE) {
    echo json_encode([
        "success" => true,
        "message" => "Administrador registrado exitosamente",
        "usuario" => $nombreUsuario,
        "contrasena" => $contrasena
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al registrar administrador: " . $conexion->error
    ]);
}

mysqli_close($conexion);
?>

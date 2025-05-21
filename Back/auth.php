<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");


session_id('PHPSESSID');
session_start();

$codigo_2fa = $_POST['codigo_2fa'];
$usuario = $_SESSION['usuario_2fa'];
// echo $codigo_2fa;

// $codigo_2fa = 353575;

if (!$usuario || !$codigo_2fa) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

// Verificar si el código ingresado es correcto
if (isset($_SESSION['codigo_2fa']) && $codigo_2fa == $_SESSION['codigo_2fa']) {
    unset($_SESSION['codigo_2fa']); // Eliminar el código una vez verificado

    // Obtener los datos del usuario nuevamente
    $consulta = "SELECT * FROM administrador WHERE nombre_usuario = ?";
    $stmt = $conexion->prepare($consulta);
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "usuario" => $fila]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al obtener datos del usuario"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Código 2FA incorrecto"]);
}

mysqli_close($conexion);
?>

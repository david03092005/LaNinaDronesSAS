<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

session_id('PHPSESSID');

session_start();

$usuario = $_POST['usuario'] ?? null;
$contrasena = $_POST['contrasena'] ?? null;
// $usuario = "admin0";
// $contrasena = "admin0";

if (!$usuario || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

$verificacion = "SELECT * FROM administrador WHERE nombre_usuario = ?";
$stmt = $conexion->prepare($verificacion);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();

    if ($contrasena == $fila['contraseña']) { // Verifica la contraseña
        // Generar código 2FA
        $codigo_2fa = rand(100000, 999999);
        $_SESSION['codigo_2fa'] = $codigo_2fa;
        $_SESSION['usuario_2fa'] = $usuario;

        // Correo de destino
        $correo = "davidasz20053@gmail.com"; // Puedes obtenerlo de la BD si lo tienes almacenado

        // Enviar código por correo
        $asunto = "Código de autenticación";
        $mensaje = "Tu código de autenticación es: $codigo_2fa";
        $headers = "From: no-reply@tuweb.com\r\n";
        $headers .= "Reply-To: no-reply@tuweb.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        mail($correo, $asunto, $mensaje, $headers);

        echo json_encode(["success" => true, "fase" => "2fa", "message" => "Código 2FA enviado"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

session_write_close();
mysqli_close($conexion);
?>
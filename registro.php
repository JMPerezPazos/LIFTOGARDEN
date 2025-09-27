<?php
    include("conexion.php");

    if (isset($_POST['enviar'])) {
        $username =trim($_POST['nombre']);
        $email    =trim($_POST['email']);
        $pass     =trim($_POST['contraseña']);

        // Validación rápida
        if (empty($username) || empty($email) || empty($pass)) {
            die("❌ Faltan datos en el formulario.");
        }

        // Hashear la contraseña
        $pass_hashed = password_hash($pass, PASSWORD_DEFAULT, ['cost' => 12]);

        // Query de inserción
        $sql = "INSERT INTO usuario (NOMBRE, EMAIL, contraseña) 
                Values ('$username', '$email', '$pass_hashed')";

        $respuesta = mysqli_query($conex, $sql);

        if ($respuesta) {
            echo "✅ Registro exitoso";
        } else {
            echo "❌ Error al registrar: " . mysqli_error($conex);
        }
    }
?>


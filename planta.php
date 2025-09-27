<?php
    include("conexion.php");
    if (isset($_POST['añadir'])){
        if(strlen($_POST['plantName'] >=1)){
            $Nomb_plant =trim($_POST ['plantName']);
            $consumo =trim($_POST['consumition']);
            $agua =trim($_POST['water']);
            $vitamina =trim($_POST['vitamins']);
            $fertilizante =trim($_POST['fertilizer']);
            $consulta = "INSERT INTO Planta (Nombre, Cantidad_agua_restante, Cantidad_vitamina_restante, Cantidad_fertilizante_restante, Tipo_Consumo) Values ('$Nomb_plant', '$consumo', '$agua', '$vitamina', '$fertilizante')";
            $sql= mysqli_query($conex, $consulta);
        }
    }
?>
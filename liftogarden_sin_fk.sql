-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-09-2025 a las 17:53:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `liftogarden`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracionconsumo`
--

CREATE TABLE `configuracionconsumo` (
  `ID` int(11) NOT NULL,
  `Fecha` date DEFAULT NULL,
  `Cantidad_Agua` int(11) DEFAULT NULL,
  `Cantidad_Vitamina` int(11) DEFAULT NULL,
  `Cantidad_Fertilizante` int(11) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 1,
  `ID_planta` int(11) DEFAULT NULL,
  `ID_tipoconsumo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consumo`
--

CREATE TABLE `consumo` (
  `ID` int(11) NOT NULL,
  `Fecha` date DEFAULT NULL,
  `Cantidad_Agua` int(11) DEFAULT NULL,
  `Cantidad_Vitamina` int(11) DEFAULT NULL,
  `Cantidad_Fertilizante` int(11) DEFAULT NULL,
  `ID_planta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lecturasensor`
--

CREATE TABLE `lecturasensor` (
  `ID` int(11) NOT NULL,
  `Fecha` date DEFAULT NULL,
  `Valor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planta`
--

CREATE TABLE `planta` (
  `ID` int(11) NOT NULL,
  `Cantidad_Vitamina_Restante` int(11) DEFAULT NULL,
  `Cantidad_Fertilizante_Restante` int(11) DEFAULT NULL,
  `Cantidad_Agua_Restante` int(11) DEFAULT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `ID_usuario` int(11) DEFAULT NULL,
  `ID_tipoconsumo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensor`
--

CREATE TABLE `sensor` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoconsumo`
--

CREATE TABLE `tipoconsumo` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipoconsumo`
--

INSERT INTO `tipoconsumo` (`ID`, `Nombre`) VALUES
(3, 'alto'),
(1, 'Bajo'),
(2, 'medio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposensor`
--

CREATE TABLE `tiposensor` (
  `ID` int(11) NOT NULL,
  `Descripcion` varchar(60) DEFAULT NULL,
  `Unidad` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `NOMBRE` varchar(60) DEFAULT NULL,
  `EMAIL` varchar(60) DEFAULT NULL,
  `PASSWORD` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuracionconsumo`
--
ALTER TABLE `configuracionconsumo`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `consumo`
--
ALTER TABLE `consumo`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `lecturasensor`
--
ALTER TABLE `lecturasensor`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `planta`
--
ALTER TABLE `planta`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `tipoconsumo`
--
ALTER TABLE `tipoconsumo`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- Indices de la tabla `tiposensor`
--
ALTER TABLE `tiposensor`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `configuracionconsumo`
--
ALTER TABLE `configuracionconsumo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `consumo`
--
ALTER TABLE `consumo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lecturasensor`
--
ALTER TABLE `lecturasensor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planta`
--
ALTER TABLE `planta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sensor`
--
ALTER TABLE `sensor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoconsumo`
--
ALTER TABLE `tipoconsumo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tiposensor`
--
ALTER TABLE `tiposensor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `configuracionconsumo`
--
ALTER TABLE `configuracionconsumo`
  ADD CONSTRAINT `FK_configuracionconsumo_planta` FOREIGN KEY (`ID_planta`) REFERENCES `planta` (`ID`),
  ADD CONSTRAINT `FK_configuracionconsumo_tipoconsumo` FOREIGN KEY (`ID_tipoconsumo`) REFERENCES `tipoconsumo` (`ID`);

--
-- Filtros para la tabla `consumo`
--
ALTER TABLE `consumo`
  ADD CONSTRAINT `FK_consumo_planta` FOREIGN KEY (`ID_planta`) REFERENCES `planta` (`ID`),
  ADD CONSTRAINT `consumo_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `planta` (`ID`);

--
-- Filtros para la tabla `lecturasensor`
--
ALTER TABLE `lecturasensor`
  ADD CONSTRAINT `lecturasensor_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `sensor` (`ID`),
  ADD CONSTRAINT `lecturasensor_ibfk_2` FOREIGN KEY (`ID`) REFERENCES `sensor` (`ID`);

--
-- Filtros para la tabla `planta`
--
ALTER TABLE `planta`
  ADD CONSTRAINT `FK_planta_tipoconsumo` FOREIGN KEY (`ID_tipoconsumo`) REFERENCES `tipoconsumo` (`ID`),
  ADD CONSTRAINT `FK_planta_usuario` FOREIGN KEY (`ID_usuario`) REFERENCES `usuario` (`ID`);

--
-- Filtros para la tabla `sensor`
--
ALTER TABLE `sensor`
  ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `tiposensor` (`ID`),
  ADD CONSTRAINT `sensor_ibfk_2` FOREIGN KEY (`ID`) REFERENCES `planta` (`ID`),
  ADD CONSTRAINT `sensor_ibfk_3` FOREIGN KEY (`ID`) REFERENCES `lecturasensor` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module Modulos.Unidad1 where

import Data.Aeson (ToJSON(..), FromJSON, object, (.=), Value(..))
import GHC.Generics

----------------------------------------------------------------------
-- U1-T1: El Cambio de Paradigma — del "Cómo" al "Qué"
----------------------------------------------------------------------

data ReqParadigma = ReqParadigma
  { numeros :: [Int]
  } deriving (Show, Generic)
instance FromJSON ReqParadigma

-- Demostrativo: solución declarativa (describe el QUÉ)
sumaCuadradosPares :: [Int] -> Int
sumaCuadradosPares = sum . map (^ (2 :: Int)) . filter even

-- Caso real: reporte declarativo de ventas filtradas por estado
data Venta = Venta
  { ventaId     :: Int
  , ventaMonto  :: Double
  , ventaEstado :: String
  } deriving (Show, Generic)
instance FromJSON Venta
instance ToJSON Venta

data ReqReporte = ReqReporte
  { estadoObjetivo :: String
  , ventas         :: [Venta]
  } deriving (Show, Generic)
instance FromJSON ReqReporte

filtrarPorEstado :: String -> [Venta] -> [Venta]
filtrarPorEstado est = filter ((== est) . ventaEstado)

resumenVentas :: String -> [Venta] -> Value
resumenVentas est vs =
    let filtradas = filtrarPorEstado est vs
    in object [ "estado"            .= est
              , "cantidad_total"    .= length vs
              , "cantidad_filtrada" .= length filtradas
              , "total_monto"       .= sum (map ventaMonto filtradas)
              , "ventas"            .= filtradas ]

----------------------------------------------------------------------
-- U1-T2: El Poder del Pattern Matching Estructural
----------------------------------------------------------------------

data Figura
  = Circulo Double
  | Rectangulo Double Double
  | Triangulo Double Double
  deriving (Show)

-- Demostrativo: pattern matching sobre tipo algebraico
area :: Figura -> Double
area (Circulo r)      = pi * r * r
area (Rectangulo b h) = b * h
area (Triangulo b h)  = b * h / 2

-- Pattern matching sobre la estructura de la lista de parámetros
construirFigura :: String -> [Double] -> Maybe Figura
construirFigura "circulo"    (r:_)   = Just (Circulo r)
construirFigura "rectangulo" (b:h:_) = Just (Rectangulo b h)
construirFigura "triangulo"  (b:h:_) = Just (Triangulo b h)
construirFigura _            _       = Nothing

data ReqFigura = ReqFigura
  { figuraTipo   :: String
  , figuraParams :: [Double]
  } deriving (Show, Generic)
instance FromJSON ReqFigura

-- Caso real: router de eventos transaccionales (pattern matching + guardas)
data ReqEvento = ReqEvento
  { eventoTipo  :: String
  , eventoMonto :: Double
  } deriving (Show, Generic)
instance FromJSON ReqEvento

data Accion = Accion
  { accionCanal       :: String
  , accionPrioridad   :: String
  , accionRequierePin :: Bool
  } deriving (Show, Generic)
instance ToJSON Accion

enrutarEvento :: String -> Double -> Accion
enrutarEvento "deposito" monto
  | monto > 10000 = Accion "compliance"    "alta"  False
  | otherwise     = Accion "core-bancario" "baja"  False
enrutarEvento "retiro" monto
  | monto > 500   = Accion "cajero-auditado"     "media" True
  | otherwise     = Accion "cajero"              "baja"  True
enrutarEvento "transferencia" _ = Accion "switch-interbancario" "alta" True
enrutarEvento _               _ = Accion "rechazado"            "nula" False

----------------------------------------------------------------------
-- U1-T3: Funciones de Orden Superior (HOFs)
----------------------------------------------------------------------

data ReqHof = ReqHof
  { hofOperacion :: String
  , hofValores   :: [Double]
  } deriving (Show, Generic)
instance FromJSON ReqHof

-- Demostrativo: la misma maquinaria HOF aplicada a distintas operaciones
ejecutarHof :: String -> [Double] -> Value
ejecutarHof op xs = object
    [ "operacion" .= op
    , "entrada"   .= xs
    , "salida"    .= resultado op ]
  where
    resultado "duplicar"   = toJSON (map (* 2) xs)
    resultado "cuadrados"  = toJSON (map (** 2) xs)
    resultado "positivos"  = toJSON (filter (> 0) xs)
    resultado "mayores_10" = toJSON (filter (> 10) xs)
    resultado "suma"       = toJSON (sum xs)
    resultado "producto"   = toJSON (product xs)
    resultado _            = Null

-- Caso real: KPIs de ventas — agregación con folds como un reporte analítico
data ReqKpi = ReqKpi
  { montos :: [Double]
  } deriving (Show, Generic)
instance FromJSON ReqKpi

calcularKpi :: [Double] -> Value
calcularKpi [] = object [ "error" .= ("sin datos" :: String) ]
calcularKpi ms = object
    [ "cantidad" .= length ms
    , "total"    .= sum ms
    , "promedio" .= (sum ms / fromIntegral (length ms))
    , "maximo"   .= maximum ms
    , "minimo"   .= minimum ms ]

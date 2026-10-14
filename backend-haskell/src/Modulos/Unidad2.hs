{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

module Modulos.Unidad2 where

import Data.Aeson (ToJSON(..), FromJSON, object, (.=), Value)
import GHC.Generics

----------------------------------------------------------------------
-- U2-T1: Lambdas y la HOF Universal
----------------------------------------------------------------------

data ReqLambda = ReqLambda
  { lamExpresion :: String
  , lamValores   :: [Double]
  } deriving (Show, Generic)
instance FromJSON ReqLambda

-- Demostrativo: lambdas anónimas inyectadas en map (HOF universal)
aplicarLambda :: String -> Maybe ([Double] -> [Double])
aplicarLambda "inc"      = Just (map (\x -> x + 1))
aplicarLambda "doble"    = Just (map (\x -> x * 2))
aplicarLambda "cuadrado" = Just (map (\x -> x * x))
aplicarLambda "mitad"    = Just (map (\x -> x / 2))
aplicarLambda "abs"      = Just (map (\x -> abs x))
aplicarLambda _          = Nothing

-- Caso real: liquidación de pedido — pipeline de lambdas de negocio
data Item = Item
  { itemNombre   :: String
  , itemPrecio   :: Double
  , itemCantidad :: Int
  } deriving (Show, Generic)
instance FromJSON Item

data ReqPedido = ReqPedido
  { items :: [Item]
  } deriving (Show, Generic)
instance FromJSON ReqPedido

liquidacionPedido :: [Item] -> Value
liquidacionPedido items' =
    let subtotal  = \i -> itemPrecio i * fromIntegral (itemCantidad i)
        rebaja    = \s -> if s > 100 then s * 0.90 else s
        conIva    = \s -> s * 1.12
        pipeline  = conIva . rebaja
        lineas    = map (\i -> object [ "nombre"   .= itemNombre i
                                      , "subtotal" .= subtotal i
                                      , "final"    .= pipeline (subtotal i) ]) items'
        total     = sum (map (pipeline . subtotal) items')
    in object [ "lineas" .= lineas, "total_pedido" .= total ]

----------------------------------------------------------------------
-- U2-T2: Closures y Estado Encapsulado
----------------------------------------------------------------------

-- Payload de entrada para probar Closures
data ReqClosure = ReqClosure {
    factorBase :: Double,
    valores    :: [Double]
} deriving (Show, Generic)
instance FromJSON ReqClosure

data ResClosure = ResClosure {
    factorAplicado :: Double,
    resultados     :: [Double]
} deriving (Show, Generic)
instance ToJSON ResClosure

-- U2 T2: Generador de Closure
crearMultiplicador :: Double -> (Double -> Double)
crearMultiplicador factor = \x -> x * factor

-- Ejecutar sobre lista (HOF Map + Inmutabilidad)
ejecutarMapeoClosure :: Double -> [Double] -> [Double]
ejecutarMapeoClosure factor lista = map (crearMultiplicador factor) lista

-- Caso real: motor de tarifas — el closure encapsula la configuración vigente
data ConfigTarifa = ConfigTarifa
  { cfgIva     :: Double
  , cfgUmbral  :: Double
  , cfgPctDesc :: Double
  }

data ReqTarifa = ReqTarifa
  { iva       :: Double
  , umbral    :: Double
  , descuento :: Double
  , productos :: [Producto]
  } deriving (Show, Generic)
instance FromJSON ReqTarifa

data Producto = Producto
  { prodNombre :: String
  , prodPrecio :: Double
  } deriving (Show, Generic)
instance FromJSON Producto

data PrecioFinal = PrecioFinal
  { pfNombre  :: String
  , pfBase    :: Double
  , pfFinal   :: Double
  } deriving (Show, Generic)
instance ToJSON PrecioFinal

-- Fábrica: captura cfg en el entorno léxico de la lambda devuelta
crearCalculadoraPrecio :: ConfigTarifa -> (Double -> Double)
crearCalculadoraPrecio cfg = \precio ->
    let conDescuento = if precio >= cfgUmbral cfg
                         then precio * (1 - cfgPctDesc cfg)
                         else precio
    in conDescuento * (1 + cfgIva cfg)

calcularTarifas :: ConfigTarifa -> [Producto] -> [PrecioFinal]
calcularTarifas cfg productos' =
    let calcular = crearCalculadoraPrecio cfg
    in map (\p -> PrecioFinal (prodNombre p) (prodPrecio p) (calcular (prodPrecio p))) productos'

----------------------------------------------------------------------
-- U2-T3: El Principio de Inmutabilidad
----------------------------------------------------------------------

data ReqInmutable = ReqInmutable
  { inmOperacion :: String
  , inmLista     :: [Int]
  , inmElemento  :: Maybe Int
  } deriving (Show, Generic)
instance FromJSON ReqInmutable

-- Demostrativo: cada operación devuelve una lista NUEVA
transformarLista :: String -> Maybe Int -> [Int] -> [Int]
transformarLista "agregar_inicio" (Just e) xs = e : xs
transformarLista "agregar_final"  (Just e) xs = xs ++ [e]
transformarLista "duplicar"       _        xs = map (* 2) xs
transformarLista "quitar_pares"   _        xs = filter odd xs
transformarLista "invertir"       _        xs = reverse xs
transformarLista _                _        xs = xs

-- Caso real: ledger bancario — scanl produce la cadena de estados nuevos
data Movimiento = Movimiento
  { movTipo  :: String
  , movMonto :: Double
  } deriving (Show, Generic)
instance FromJSON Movimiento

data ReqLedger = ReqLedger
  { ledSaldo       :: Double
  , ledMovimientos :: [Movimiento]
  } deriving (Show, Generic)
instance FromJSON ReqLedger

aplicarMovimiento :: Double -> Movimiento -> Double
aplicarMovimiento saldo (Movimiento "credito" m) = saldo + m
aplicarMovimiento saldo (Movimiento "debito"  m) = saldo - m
aplicarMovimiento saldo _                        = saldo

historialSaldos :: Double -> [Movimiento] -> [Double]
historialSaldos = scanl aplicarMovimiento

procesarLedger :: Double -> [Movimiento] -> Value
procesarLedger inicial movs =
    let saldos = historialSaldos inicial movs
    in object [ "saldo_inicial" .= inicial
              , "saldos"        .= saldos
              , "saldo_final"   .= last saldos
              , "nota"          .= ("scanl: cada saldo es un valor nuevo; el inicial nunca se muta" :: String) ]

----------------------------------------------------------------------
-- U2-T4: Pureza y Efectos Secundarios
----------------------------------------------------------------------

-- U2 T4: Regla Pura de Verificación Ecuacional
verificarPureza :: Int -> (Int, Int, Bool)
verificarPureza n =
    let f x = x * 3 + 1
        ladoIzq = f n + f n
        ladoDer = 2 * f n
    in (ladoIzq, ladoDer, ladoIzq == ladoDer)

-- Caso real: liquidador de nómina — función 100% pura y auditable
data ReqNomina = ReqNomina
  { bruto       :: Double
  , deducciones :: [Double]
  } deriving (Show, Generic)
instance FromJSON ReqNomina

liquidarSueldo :: Double -> [Double] -> Double
liquidarSueldo br ds = br - sum ds

procesarNomina :: Double -> [Double] -> Value
procesarNomina b ds = object
    [ "bruto"              .= b
    , "deducciones"        .= ds
    , "total_deducciones"  .= sum ds
    , "neto"               .= liquidarSueldo b ds
    , "verificacion_pura"  .= (liquidarSueldo b ds + sum ds == b) ]

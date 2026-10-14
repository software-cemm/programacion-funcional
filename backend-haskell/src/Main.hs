{-# LANGUAGE OverloadedStrings #-}

import Web.Scotty
import Network.Wai.Middleware.Cors
import Data.Aeson (object, (.=))
import qualified Modulos.Unidad1 as U1
import qualified Modulos.Unidad2 as U2

main :: IO ()
main = scotty 3000 $ do
    -- CORS abierto para el frontend de Vite.
    -- simpleCors no admite Content-Type en el preflight, por eso se extiende
    -- la política explícitamente para POST con JSON.
    middleware $ cors $ const $ Just simpleCorsResourcePolicy
        { corsRequestHeaders = simpleHeaders ++ ["Content-Type", "Authorization"] }

    get "/api/health" $ do
        json $ object ["status" .= ("UPSE Functional Backend Operativo" :: String)]

    -- Endpoint: U1 T1 Cambio de Paradigma (demo declarativa)
    post "/api/u1/paradigma" $ do
        req <- jsonData :: ActionM U1.ReqParadigma
        json $ object [
            "entrada"            .= U1.numeros req,
            "resultado"          .= U1.sumaCuadradosPares (U1.numeros req),
            "receta_declarativa" .= ("sum . map (^2) . filter even" :: String)
          ]

    -- Endpoint: U1 T1 Caso real — reporte declarativo de ventas
    post "/api/u1/reporte-ventas" $ do
        req <- jsonData :: ActionM U1.ReqReporte
        json $ U1.resumenVentas (U1.estadoObjetivo req) (U1.ventas req)

    -- Endpoint: U1 T2 Pattern Matching (demo figuras)
    post "/api/u1/figuras" $ do
        req <- jsonData :: ActionM U1.ReqFigura
        json $ case U1.construirFigura (U1.figuraTipo req) (U1.figuraParams req) of
            Just f  -> object ["figura" .= show f, "area" .= U1.area f]
            Nothing -> object ["error" .= ("figura o parametros invalidos" :: String)]

    -- Endpoint: U1 T2 Caso real — router de eventos transaccionales
    post "/api/u1/eventos" $ do
        req <- jsonData :: ActionM U1.ReqEvento
        json $ U1.enrutarEvento (U1.eventoTipo req) (U1.eventoMonto req)

    -- Endpoint: U1 T3 HOFs (demo map/filter/fold)
    post "/api/u1/hof" $ do
        req <- jsonData :: ActionM U1.ReqHof
        json $ U1.ejecutarHof (U1.hofOperacion req) (U1.hofValores req)

    -- Endpoint: U1 T3 Caso real — KPIs de ventas por agregacion
    post "/api/u1/kpi" $ do
        req <- jsonData :: ActionM U1.ReqKpi
        json $ U1.calcularKpi (U1.montos req)

    -- Endpoint: U2 T1 Lambdas (demo)
    post "/api/u2/lambdas" $ do
        req <- jsonData :: ActionM U2.ReqLambda
        json $ case U2.aplicarLambda (U2.lamExpresion req) of
            Just f  -> object [ "expresion" .= U2.lamExpresion req
                              , "entrada"   .= U2.lamValores req
                              , "salida"    .= f (U2.lamValores req) ]
            Nothing -> object [ "error" .= ("lambda desconocida" :: String) ]

    -- Endpoint: U2 T1 Caso real — liquidación de pedido con pipeline de lambdas
    post "/api/u2/pipeline-pedidos" $ do
        req <- jsonData :: ActionM U2.ReqPedido
        json $ U2.liquidacionPedido (U2.items req)

    -- Endpoint: U2 T2 Closures
    post "/api/u2/closures" $ do
        req <- jsonData :: ActionM U2.ReqClosure
        let resultadosTransformados = U2.ejecutarMapeoClosure (U2.factorBase req) (U2.valores req)
        json $ U2.ResClosure (U2.factorBase req) resultadosTransformados

    -- Endpoint: U2 T2 Caso real — motor de tarifas (closure con config encapsulada)
    post "/api/u2/tarifas" $ do
        req <- jsonData :: ActionM U2.ReqTarifa
        let cfg = U2.ConfigTarifa (U2.iva req) (U2.umbral req) (U2.descuento req)
        json $ object [ "config"      .= object [ "iva" .= U2.iva req
                                                , "umbral" .= U2.umbral req
                                                , "descuento" .= U2.descuento req ]
                      , "resultados"  .= U2.calcularTarifas cfg (U2.productos req) ]

    -- Endpoint: U2 T3 Inmutabilidad (demo)
    post "/api/u2/inmutabilidad" $ do
        req <- jsonData :: ActionM U2.ReqInmutable
        let original = U2.inmLista req
        json $ object [ "operacion"        .= U2.inmOperacion req
                      , "original"         .= original
                      , "transformada"     .= U2.transformarLista (U2.inmOperacion req) (U2.inmElemento req) original
                      , "original_intacta" .= True ]

    -- Endpoint: U2 T3 Caso real — ledger bancario (scanl, cadena de estados)
    post "/api/u2/ledger" $ do
        req <- jsonData :: ActionM U2.ReqLedger
        json $ U2.procesarLedger (U2.ledSaldo req) (U2.ledMovimientos req)

    -- Endpoint: U2 T4 Pureza y Razonamiento Ecuacional
    get "/api/u2/pureza/:num" $ do
        n <- pathParam "num"
        let (izq, der, cumple) = U2.verificarPureza n
        json $ object [
            "valor_entrada" .= n,
            "f_x_mas_f_x"   .= izq,
            "dos_por_f_x"   .= der,
            "es_equivalente".= cumple
          ]

    -- Endpoint: U2 T4 Caso real — liquidador de nómina (función pura)
    post "/api/u2/nomina" $ do
        req <- jsonData :: ActionM U2.ReqNomina
        json $ U2.procesarNomina (U2.bruto req) (U2.deducciones req)
import React, { useState } from 'react';
import { Play, Sparkles, Code2, Percent } from 'lucide-react';

const PRODUCTOS_EJEMPLO = `[
  {"prodNombre": "Laptop",  "prodPrecio": 850},
  {"prodNombre": "Mouse",   "prodPrecio": 25},
  {"prodNombre": "Monitor", "prodPrecio": 120},
  {"prodNombre": "Cable",   "prodPrecio": 8}
]`;

export default function U2ClosuresView() {
  const [factor, setFactor] = useState(1.15);
  const [valoresTexto, setValoresTexto] = useState("100, 250, 400, 50");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [iva, setIva] = useState(0.12);
  const [umbral, setUmbral] = useState(100);
  const [descuento, setDescuento] = useState(0.10);
  const [productosJson, setProductosJson] = useState(PRODUCTOS_EJEMPLO);
  const [tarifas, setTarifas] = useState(null);
  const [error, setError] = useState(null);

  const probarClosure = async () => {
    setCargando(true);
    try {
      const arrayValores = valoresTexto.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
      const res = await fetch("http://localhost:3000/api/u2/closures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factorBase: parseFloat(factor),
          valores: arrayValores
        })
      });
      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const calcularTarifas = async () => {
    setError(null);
    let productos;
    try {
      productos = JSON.parse(productosJson);
    } catch {
      setError("JSON de productos inválido. Revisa el formato.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/u2/tarifas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iva: parseFloat(iva),
        umbral: parseFloat(umbral),
        descuento: parseFloat(descuento),
        productos
      })
    });
    setTarifas(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 2 · Tema 2: Closures y Fábricas de Funciones</h2>
        <p className="text-sm text-slate-500">
          Demostración interactiva: la función externa inyecta y congela un factor léxico en memoria inmutable,
          y la lambda devuelta procesa un array sin mutaciones de estado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Configuración */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-600" /> Parámetros del Entorno Léxico
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Factor a capturar en el Closure (Ej. 1.15 para IVA 15%):
            </label>
            <input
              type="number"
              step="0.01"
              value={factor}
              onChange={(e) => setFactor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Valores a procesar (separados por coma):
            </label>
            <input
              type="text"
              value={valoresTexto}
              onChange={(e) => setValoresTexto(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <button
            onClick={probarClosure}
            disabled={cargando}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
          >
            {cargando ? "Evaluando en Haskell..." : <><Play className="w-4 h-4 fill-white" /> Ejecutar Closure en Backend</>}
          </button>
        </div>

        {/* Panel de Resultados */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
              <span>Respuesta JSON del Servidor Haskell</span>
              <Sparkles className="w-4 h-4 text-brand-500" />
            </div>
            <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed">
              {resultado ? JSON.stringify(resultado, null, 2) : "// Presiona 'Ejecutar' para llamar a Scotty..."}
            </pre>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Endpoint: POST /api/u2/closures
          </div>
        </div>

        {/* Caso real: motor de tarifas */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Percent className="w-4 h-4 text-brand-600" /> Caso real: motor de tarifas
          </h3>
          <p className="text-xs text-slate-500">
            <code>crearCalculadoraPrecio cfg</code> captura la configuración una sola vez en el
            entorno léxico y genera la calculadora que se aplica a todo el catálogo.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">IVA:</label>
              <input type="number" step="0.01" value={iva} onChange={(e) => setIva(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Umbral desc.:</label>
              <input type="number" step="1" value={umbral} onChange={(e) => setUmbral(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">% desc.:</label>
              <input type="number" step="0.01" value={descuento} onChange={(e) => setDescuento(e.target.value)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Catálogo de productos (JSON):</label>
            <textarea rows={5} value={productosJson} onChange={(e) => setProductosJson(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button onClick={calcularTarifas}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Calcular Tarifas
          </button>
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Tarifas</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {tarifas ? JSON.stringify(tarifas, null, 2) : "// POST /api/u2/tarifas"}
          </pre>
          {tarifas?.resultados && (
            <div className="pt-3 border-t border-slate-800 space-y-1">
              {tarifas.resultados.map((r, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-400">{r.pfNombre}</span>
                  <span>${r.pfBase.toFixed(2)} → <span className="text-brand-400 font-semibold">${r.pfFinal.toFixed(2)}</span></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
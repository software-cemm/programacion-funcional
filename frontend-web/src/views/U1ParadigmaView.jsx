import React, { useState } from 'react';
import { Play, Sparkles, Shuffle, BarChart3 } from 'lucide-react';

const VENTAS_EJEMPLO = `[
  {"ventaId": 1, "ventaMonto": 120.50, "ventaEstado": "aprobada"},
  {"ventaId": 2, "ventaMonto": 89.99,  "ventaEstado": "pendiente"},
  {"ventaId": 3, "ventaMonto": 340.00, "ventaEstado": "aprobada"},
  {"ventaId": 4, "ventaMonto": 15.00,  "ventaEstado": "rechazada"},
  {"ventaId": 5, "ventaMonto": 210.75, "ventaEstado": "pendiente"}
]`;

export default function U1ParadigmaView() {
  const [numeros, setNumeros] = useState("1, 2, 3, 4, 5, 6");
  const [demo, setDemo] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [ventasJson, setVentasJson] = useState(VENTAS_EJEMPLO);
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);

  const probarParadigma = async () => {
    const arr = numeros.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    const res = await fetch("http://localhost:3000/api/u1/paradigma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numeros: arr })
    });
    setDemo(await res.json());
  };

  const generarReporte = async () => {
    setError(null);
    let ventas;
    try {
      ventas = JSON.parse(ventasJson);
    } catch {
      setError("JSON de ventas inválido. Revisa el formato.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/u1/reporte-ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estadoObjetivo: estado, ventas })
    });
    setReporte(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 1 · Tema 1: Del "Cómo" al "Qué"</h2>
        <p className="text-sm text-slate-500">
          El paradigma imperativo ordena pasos; el funcional describe la transformación.
          La misma solución expresada como composición declarativa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-brand-600" /> Demo: suma de cuadrados de pares
          </h3>
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700">
              <p className="font-bold mb-1">Imperativo (el CÓMO)</p>
              acc = 0<br />for x in lista:<br />&nbsp;&nbsp;if x % 2 == 0:<br />&nbsp;&nbsp;&nbsp;&nbsp;acc += x*x
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-700">
              <p className="font-bold mb-1">Funcional (el QUÉ)</p>
              sumaCuadradosPares =<br />&nbsp;&nbsp;sum . map (^2)<br />&nbsp;&nbsp;. filter even
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Números (separados por coma):</label>
            <input type="text" value={numeros} onChange={(e) => setNumeros(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={probarParadigma}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Evaluar Declarativamente
          </button>
          {demo && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
              Resultado: <span className="font-bold text-brand-700">{demo.resultado}</span>
              <span className="text-slate-500 text-xs ml-2">({demo.receta_declarativa})</span>
            </div>
          )}
        </div>

        {/* JSON demo */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Demo</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {demo ? JSON.stringify(demo, null, 2) : "// POST /api/u1/paradigma"}
          </pre>
        </div>

        {/* Caso real */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" /> Caso real: reporte de ventas declarativo
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Estado a filtrar:</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
              <option value="pendiente">pendiente</option>
              <option value="aprobada">aprobada</option>
              <option value="rechazada">rechazada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Dataset de ventas (JSON):</label>
            <textarea rows={6} value={ventasJson} onChange={(e) => setVentasJson(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button onClick={generarReporte}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Generar Reporte
          </button>
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Reporte</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {reporte ? JSON.stringify(reporte, null, 2) : "// POST /api/u1/reporte-ventas"}
          </pre>
        </div>
      </div>
    </div>
  );
}

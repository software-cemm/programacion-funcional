import React, { useState } from 'react';
import { Play, Sparkles, Sigma, LineChart } from 'lucide-react';

const OPERACIONES = [
  { id: "duplicar",   desc: "map (*2)" },
  { id: "cuadrados",  desc: "map (**2)" },
  { id: "positivos",  desc: "filter (>0)" },
  { id: "mayores_10", desc: "filter (>10)" },
  { id: "suma",       desc: "foldl (+) 0" },
  { id: "producto",   desc: "product" },
];

export default function U1HofView() {
  const [operacion, setOperacion] = useState("duplicar");
  const [valores, setValores] = useState("2, -4, 6, 8, 15");
  const [demo, setDemo] = useState(null);
  const [montos, setMontos] = useState("120.5, 89.99, 340, 15, 210.75");
  const [kpi, setKpi] = useState(null);

  const parseLista = (txt) =>
    txt.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));

  const ejecutarHof = async () => {
    const res = await fetch("http://localhost:3000/api/u1/hof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hofOperacion: operacion, hofValores: parseLista(valores) })
    });
    setDemo(await res.json());
  };

  const calcularKpi = async () => {
    const res = await fetch("http://localhost:3000/api/u1/kpi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montos: parseLista(montos) })
    });
    setKpi(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 1 · Tema 3: Funciones de Orden Superior</h2>
        <p className="text-sm text-slate-500">
          Funciones que reciben funciones: <code>map</code>, <code>filter</code> y <code>fold</code>{" "}
          son la maquinaria universal — cambia la función inyectada, no la estructura de recorrido.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Sigma className="w-4 h-4 text-brand-600" /> Demo: una maquinaria, seis operaciones
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Operación HOF:</label>
            <select value={operacion} onChange={(e) => setOperacion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
              {OPERACIONES.map(op => (
                <option key={op.id} value={op.id}>{op.id} — {op.desc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Valores (separados por coma):</label>
            <input type="text" value={valores} onChange={(e) => setValores(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={ejecutarHof}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Aplicar HOF
          </button>
        </div>

        {/* JSON demo */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Demo</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {demo ? JSON.stringify(demo, null, 2) : "// POST /api/u1/hof"}
          </pre>
        </div>

        {/* Caso real */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <LineChart className="w-4 h-4 text-brand-600" /> Caso real: KPIs de ventas por agregación
          </h3>
          <p className="text-xs text-slate-500">
            Un panel analítico real reduce un dataset con folds: total, promedio, máximo y mínimo.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Montos de ventas (separados por coma):</label>
            <input type="text" value={montos} onChange={(e) => setMontos(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={calcularKpi}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Calcular KPIs
          </button>
          {kpi && !kpi.error && (
            <div className="grid grid-cols-2 gap-2 text-center">
              {[["Total", kpi.total], ["Promedio", kpi.promedio?.toFixed(2)],
                ["Máximo", kpi.maximo], ["Mínimo", kpi.minimo]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{k}</p>
                  <p className="text-sm font-bold text-brand-700">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · KPIs</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {kpi ? JSON.stringify(kpi, null, 2) : "// POST /api/u1/kpi"}
          </pre>
        </div>
      </div>
    </div>
  );
}

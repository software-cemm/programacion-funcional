import React, { useState } from 'react';
import { Play, Sparkles, Shapes, Route } from 'lucide-react';

export default function U1PatternView() {
  const [figura, setFigura] = useState("circulo");
  const [params, setParams] = useState("3");
  const [resultadoFig, setResultadoFig] = useState(null);
  const [evento, setEvento] = useState("deposito");
  const [monto, setMonto] = useState(15000);
  const [resultadoEv, setResultadoEv] = useState(null);

  const calcularArea = async () => {
    const arr = params.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    const res = await fetch("http://localhost:3000/api/u1/figuras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ figuraTipo: figura, figuraParams: arr })
    });
    setResultadoFig(await res.json());
  };

  const enrutar = async () => {
    const res = await fetch("http://localhost:3000/api/u1/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventoTipo: evento, eventoMonto: parseFloat(monto) })
    });
    setResultadoEv(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 1 · Tema 2: Pattern Matching Estructural</h2>
        <p className="text-sm text-slate-500">
          Deconstruir datos por su forma: cada constructor algebraico recibe su propia ecuación,
          reemplazando cadenas de if/else por despacho estructural exhaustivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Shapes className="w-4 h-4 text-brand-600" /> Demo: áreas por pattern matching
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] font-mono text-slate-600">
            area (Circulo r)      = pi * r * r<br />
            area (Rectangulo b h) = b * h<br />
            area (Triangulo b h)  = b * h / 2
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Figura:</label>
            <select value={figura} onChange={(e) => setFigura(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
              <option value="circulo">circulo (r)</option>
              <option value="rectangulo">rectangulo (b, h)</option>
              <option value="triangulo">triangulo (b, h)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Parámetros (separados por coma):</label>
            <input type="text" value={params} onChange={(e) => setParams(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={calcularArea}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Calcular Área
          </button>
        </div>

        {/* JSON demo */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Demo</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {resultadoFig ? JSON.stringify(resultadoFig, null, 2) : "// POST /api/u1/figuras"}
          </pre>
        </div>

        {/* Caso real */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Route className="w-4 h-4 text-brand-600" /> Caso real: router de eventos transaccionales
          </h3>
          <p className="text-xs text-slate-500">
            Un switch real despacha eventos por tipo y monto: cada combinación
            (patrón + guarda) define canal, prioridad y si exige PIN.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de evento:</label>
            <select value={evento} onChange={(e) => setEvento(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
              <option value="deposito">deposito</option>
              <option value="retiro">retiro</option>
              <option value="transferencia">transferencia</option>
              <option value="otro">otro (desconocido)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Monto:</label>
            <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={enrutar}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Enrutar Evento
          </button>
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Router</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {resultadoEv ? JSON.stringify(resultadoEv, null, 2) : "// POST /api/u1/eventos"}
          </pre>
          {resultadoEv && (
            <p className="mt-2 text-xs">
              Canal: <span className="text-brand-400 font-semibold">{resultadoEv.accionCanal}</span> ·
              Prioridad: <span className="text-amber-400 font-semibold"> {resultadoEv.accionPrioridad}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

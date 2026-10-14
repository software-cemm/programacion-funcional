import React, { useState } from 'react';
import { Play, Sparkles, Snowflake, Landmark } from 'lucide-react';

const OPERACIONES = [
  { id: "agregar_inicio", desc: "e : xs (cons)" },
  { id: "agregar_final",  desc: "xs ++ [e]" },
  { id: "duplicar",       desc: "map (*2)" },
  { id: "quitar_pares",   desc: "filter odd" },
  { id: "invertir",       desc: "reverse" },
];

const MOVS_EJEMPLO = `[
  {"movTipo": "credito", "movMonto": 500},
  {"movTipo": "debito",  "movMonto": 120},
  {"movTipo": "credito", "movMonto": 300},
  {"movTipo": "debito",  "movMonto": 80},
  {"movTipo": "debito",  "movMonto": 200}
]`;

export default function U2InmutabilidadView() {
  const [operacion, setOperacion] = useState("duplicar");
  const [lista, setLista] = useState("1, 2, 3, 4, 5");
  const [elemento, setElemento] = useState(9);
  const [demo, setDemo] = useState(null);
  const [saldo, setSaldo] = useState(1000);
  const [movsJson, setMovsJson] = useState(MOVS_EJEMPLO);
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState(null);

  const transformar = async () => {
    const arr = lista.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    const res = await fetch("http://localhost:3000/api/u2/inmutabilidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inmOperacion: operacion, inmLista: arr, inmElemento: parseInt(elemento) || null })
    });
    setDemo(await res.json());
  };

  const procesar = async () => {
    setError(null);
    let movs;
    try {
      movs = JSON.parse(movsJson);
    } catch {
      setError("JSON de movimientos inválido. Revisa el formato.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/u2/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ledSaldo: parseFloat(saldo), ledMovimientos: movs })
    });
    setLedger(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 2 · Tema 3: El Principio de Inmutabilidad</h2>
        <p className="text-sm text-slate-500">
          En Haskell ningún dato se modifica: toda operación devuelve un valor nuevo.
          El original permanece intacto — la base de la transparencia referencial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-brand-600" /> Demo: transformar sin mutar
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Operación:</label>
            <select value={operacion} onChange={(e) => setOperacion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none">
              {OPERACIONES.map(op => <option key={op.id} value={op.id}>{op.id} — {op.desc}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Lista original (separada por coma):</label>
            <input type="text" value={lista} onChange={(e) => setLista(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Elemento (para agregar):</label>
            <input type="number" value={elemento} onChange={(e) => setElemento(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={transformar}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Transformar (sin mutar)
          </button>
          {demo && (
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <span className="text-slate-500">original: </span>
                <span className="text-slate-800 font-semibold">[{demo.original?.join(", ")}]</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                <span className="text-emerald-600">nueva: </span>
                <span className="text-emerald-800 font-semibold">[{demo.transformada?.join(", ")}]</span>
              </div>
              <p className="text-[11px] text-slate-500">✔ La lista original no fue modificada — se produjo un valor nuevo.</p>
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
            {demo ? JSON.stringify(demo, null, 2) : "// POST /api/u2/inmutabilidad"}
          </pre>
        </div>

        {/* Caso real */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <Landmark className="w-4 h-4 text-brand-600" /> Caso real: ledger de cuenta bancaria
          </h3>
          <p className="text-xs text-slate-500">
            <code>scanl</code> aplica cada movimiento produciendo la cadena completa de saldos —
            como un libro contable donde cada estado es un registro nuevo e inmutable.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Saldo inicial:</label>
            <input type="number" step="0.01" value={saldo} onChange={(e) => setSaldo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Movimientos (JSON):</label>
            <textarea rows={6} value={movsJson} onChange={(e) => setMovsJson(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button onClick={procesar}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Procesar Ledger
          </button>
          {ledger && (
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
              {ledger.saldos?.map((s, i) => (
                <React.Fragment key={i}>
                  <span className={`px-2 py-1 rounded-lg font-semibold ${
                    i === 0 ? "bg-slate-200 text-slate-700" :
                    i === ledger.saldos.length - 1 ? "bg-brand-600 text-white" :
                    s >= ledger.saldos[i-1] ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>{s.toFixed(2)}</span>
                  {i < ledger.saldos.length - 1 && <span className="text-slate-400">→</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Ledger</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {ledger ? JSON.stringify(ledger, null, 2) : "// POST /api/u2/ledger"}
          </pre>
        </div>
      </div>
    </div>
  );
}

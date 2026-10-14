import React, { useState } from 'react';
import { Play, Sparkles, FunctionSquare, ShoppingCart } from 'lucide-react';

const LAMBDAS = [
  { id: "inc",      desc: "\\x -> x + 1" },
  { id: "doble",    desc: "\\x -> x * 2" },
  { id: "cuadrado", desc: "\\x -> x * x" },
  { id: "mitad",    desc: "\\x -> x / 2" },
  { id: "abs",      desc: "\\x -> abs x" },
];

const ITEMS_EJEMPLO = `[
  {"itemNombre": "Laptop",    "itemPrecio": 850,  "itemCantidad": 1},
  {"itemNombre": "Mouse",     "itemPrecio": 25,   "itemCantidad": 2},
  {"itemNombre": "Monitor",   "itemPrecio": 120,  "itemCantidad": 1},
  {"itemNombre": "Teclado",   "itemPrecio": 45,   "itemCantidad": 3}
]`;

export default function U2LambdasView() {
  const [expresion, setExpresion] = useState("doble");
  const [valores, setValores] = useState("1, 2, 3, 4, 5");
  const [demo, setDemo] = useState(null);
  const [itemsJson, setItemsJson] = useState(ITEMS_EJEMPLO);
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  const aplicar = async () => {
    const arr = valores.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    const res = await fetch("http://localhost:3000/api/u2/lambdas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lamExpresion: expresion, lamValores: arr })
    });
    setDemo(await res.json());
  };

  const liquidar = async () => {
    setError(null);
    let items;
    try {
      items = JSON.parse(itemsJson);
    } catch {
      setError("JSON de items inválido. Revisa el formato.");
      return;
    }
    const res = await fetch("http://localhost:3000/api/u2/pipeline-pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    setPedido(await res.json());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 2 · Tema 1: Lambdas y la HOF Universal</h2>
        <p className="text-sm text-slate-500">
          Una lambda es una función anónima creada en el lugar donde se necesita.
          La HOF <code>map</code> la recibe y la aplica a cada elemento sin conocerla de antemano.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <FunctionSquare className="w-4 h-4 text-brand-600" /> Demo: map + lambda anónima
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Lambda a inyectar en map:</label>
            <select value={expresion} onChange={(e) => setExpresion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none">
              {LAMBDAS.map(l => <option key={l.id} value={l.id}>{l.id} — {l.desc}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Valores (separados por coma):</label>
            <input type="text" value={valores} onChange={(e) => setValores(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          <button onClick={aplicar}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Aplicar Lambda
          </button>
        </div>

        {/* JSON demo */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Demo</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {demo ? JSON.stringify(demo, null, 2) : "// POST /api/u2/lambdas"}
          </pre>
        </div>

        {/* Caso real */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-brand-600" /> Caso real: liquidación de pedido
          </h3>
          <p className="text-xs text-slate-500">
            Pipeline de lambdas de negocio: <code>subtotal → descuento (10% si &gt;100) → IVA (12%)</code>,
            aplicadas por composición a cada línea del pedido.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Items del pedido (JSON):</label>
            <textarea rows={6} value={itemsJson} onChange={(e) => setItemsJson(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none" />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button onClick={liquidar}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
            <Play className="w-4 h-4 fill-white" /> Liquidar Pedido
          </button>
          {pedido && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
              Total del pedido: <span className="font-bold text-brand-700">${pedido.total_pedido?.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* JSON caso real */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Respuesta JSON · Pedido</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
            {pedido ? JSON.stringify(pedido, null, 2) : "// POST /api/u2/pipeline-pedidos"}
          </pre>
        </div>
      </div>
    </div>
  );
}

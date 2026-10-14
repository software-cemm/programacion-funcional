import React, { useState } from 'react';
import { Play, Sparkles, ShieldCheck, Wallet } from 'lucide-react';

export default function U2PurezaView() {
    const [numero, setNumero] = useState(7);
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [bruto, setBruto] = useState(1500);
    const [deducciones, setDeducciones] = useState("150, 75.5, 30");
    const [nomina, setNomina] = useState(null);

    const verificarPureza = async () => {
        setCargando(true);
        try {
            const res = await fetch(`http://localhost:3000/api/u2/pureza/${numero}`);
            const data = await res.json();
            setResultado(data);
        } catch (err) {
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const liquidar = async () => {
        const arr = deducciones.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
        const res = await fetch("http://localhost:3000/api/u2/nomina", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bruto: parseFloat(bruto), deducciones: arr })
        });
        setNomina(await res.json());
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Unidad 2 · Tema 4: Pureza y Razonamiento Ecuacional</h2>
                <p className="text-sm text-slate-500">
                    Verificación en Haskell de que una función pura cumple la equivalencia
                    f(x) + f(x) ≡ 2 · f(x) para cualquier entrada, sin efectos secundarios.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel de Configuración */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-600" /> Parámetro de Entrada
                    </h3>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Valor entero de entrada (x):
                        </label>
                        <input
                            type="number"
                            step="1"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 font-mono">
                        f x = x * 3 + 1<br />
                        verificar: f n + f n ≡ 2 * f n
                    </div>

                    <button
                        onClick={verificarPureza}
                        disabled={cargando}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                    >
                        {cargando ? "Verificando en Haskell..." : <><Play className="w-4 h-4 fill-white" /> Verificar Equivalencia</>}
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
                            {resultado ? JSON.stringify(resultado, null, 2) : "// Presiona 'Verificar' para llamar a Scotty..."}
                        </pre>
                        {resultado && (
                            <p className={`mt-2 text-xs font-semibold ${resultado.es_equivalente ? "text-emerald-400" : "text-rose-400"}`}>
                                {resultado.es_equivalente ? "✔ Equivalencia demostrada (función pura)" : "✘ Equivalencia no cumplida"}
                            </p>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                        Endpoint: GET /api/u2/pureza/:num
                    </div>
                </div>

                {/* Caso real: liquidador de nómina */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-brand-600" /> Caso real: liquidador de nómina
                    </h3>
                    <p className="text-xs text-slate-500">
                        <code>liquidarSueldo = bruto − Σ deducciones</code> es una función pura:
                        el mismo rol de pagos siempre produce el mismo resultado auditable, sin efectos ocultos.
                    </p>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Sueldo bruto:</label>
                        <input type="number" step="0.01" value={bruto} onChange={(e) => setBruto(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Deducciones (separadas por coma):</label>
                        <input type="text" value={deducciones} onChange={(e) => setDeducciones(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                    </div>
                    <button onClick={liquidar}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition">
                        <Play className="w-4 h-4 fill-white" /> Liquidar Sueldo
                    </button>
                    {nomina && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm space-y-1">
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Bruto:</span><span className="font-semibold">${nomina.bruto?.toFixed(2)}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-500">Deducciones:</span><span className="font-semibold text-rose-600">−${nomina.total_deducciones?.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm border-t border-slate-200 pt-1"><span className="text-slate-700 font-medium">Neto a pagar:</span><span className="font-bold text-brand-700">${nomina.neto?.toFixed(2)}</span></div>
                        </div>
                    )}
                </div>

                {/* JSON caso real */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs shadow-sm flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                        <span>Respuesta JSON · Nómina</span>
                        <Sparkles className="w-4 h-4 text-brand-500" />
                    </div>
                    <pre className="mt-4 overflow-x-auto text-emerald-400 leading-relaxed flex-1">
                        {nomina ? JSON.stringify(nomina, null, 2) : "// POST /api/u2/nomina"}
                    </pre>
                    {nomina && (
                        <p className={`mt-2 text-xs font-semibold ${nomina.verificacion_pura ? "text-emerald-400" : "text-rose-400"}`}>
                            {nomina.verificacion_pura ? "✔ neto + deducciones = bruto (invariante cumplido)" : "✘ invariante violada"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

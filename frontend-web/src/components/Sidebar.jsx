import React from 'react';
import { Layers, ShieldCheck, Zap, GitBranch, Cpu, Database, Award } from 'lucide-react';

export const modulosSilabo = [
  {
    modulo: "Unidad 1: Fundamentos del Paradigma",
    temas: [
      { id: "u1-t1", nombre: "1. Del \"Cómo\" al \"Qué\"", disponible: true },
      { id: "u1-t2", nombre: "2. Pattern Matching Estructural", disponible: true },
      { id: "u1-t3", nombre: "3. Funciones de Orden Superior", disponible: true },
    ]
  },
  {
    modulo: "Unidad 2: Patrones Esenciales",
    temas: [
      { id: "u2-t1", nombre: "1. Lambdas y HOF Universal", disponible: true },
      { id: "u2-t2", nombre: "2. Closures y Estado Encapsulado", disponible: true },
      { id: "u2-t3", nombre: "3. El Principio de Inmutabilidad", disponible: true },
      { id: "u2-t4", nombre: "4. Pureza y Efectos Secundarios", disponible: true },
    ]
  },
  {
    modulo: "Unidad 3: Manejo de Efectos",
    temas: [
      { id: "u3-t1", nombre: "1. Ausencia de Valor (Maybe)", disponible: true },
      { id: "u3-t2", nombre: "2. Manejo de Errores (Either)", disponible: true },
      { id: "u3-t3", nombre: "3. Decoradores y Metaprogramación", disponible: false },
      { id: "u3-t4", nombre: "4. Generadores y Evaluación Lazy", disponible: true },
    ]
  },
  {
    modulo: "Unidad 4: Concurrencia y Arquitectura",
    temas: [
      { id: "u4-t1", nombre: "1. Concurrencia y Paralelismo", disponible: true },
      { id: "u4-t2", nombre: "2. Programación Asíncrona", disponible: false },
      { id: "u4-t3", nombre: "3. Testing Funcional (QuickCheck)", disponible: false },
      { id: "u4-t4", nombre: "4. Arquitectura de Software Funcional", disponible: false },
    ]
  },
  {
    modulo: "Unidad 5: Proyecto Final",
    temas: [
      { id: "u5-final", nombre: "Sistema Transaccional Completo", disponible: false, badge: "Próximamente" }
    ]
  }
];

export default function Sidebar({ temaActivo, setTemaActivo }) {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-brand-600 p-2 rounded-lg text-white">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base leading-tight">UPSE · Lab Funcional</h1>
          <p className="text-xs text-slate-400">Software - 5to Semestre</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {modulosSilabo.map((bloque, idx) => (
          <div key={idx}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-2">
              {bloque.modulo}
            </p>
            <div className="space-y-1">
              {bloque.temas.map((tema) => (
                <button
                  key={tema.id}
                  disabled={!tema.disponible}
                  onClick={() => setTemaActivo(tema.id)}
                  className={`w-full text-left text-xs font-medium px-3 py-2.5 rounded-lg transition-all flex items-center justify-between ${temaActivo === tema.id
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30"
                    : tema.disponible
                      ? "hover:bg-slate-800 text-slate-300"
                      : "opacity-40 cursor-not-allowed text-slate-500"
                    }`}
                >
                  <span className="truncate">{tema.nombre}</span>
                  {tema.badge && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30">
                      {tema.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
        <span>GHC 9.6 + React 18</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
      </div>
    </aside>
  );
}
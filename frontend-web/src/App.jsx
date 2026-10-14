import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import U1ParadigmaView from './views/U1ParadigmaView';
import U1PatternView from './views/U1PatternView';
import U1HofView from './views/U1HofView';
import U2LambdasView from './views/U2LambdasView';
import U2ClosuresView from './views/U2ClosuresView';
import U2InmutabilidadView from './views/U2InmutabilidadView';
import U2PurezaView from './views/U2PurezaView';

export default function App() {
  const [temaActivo, setTemaActivo] = useState("u2-t2");

  const renderContenido = () => {
    switch (temaActivo) {
      case "u1-t1":
        return <U1ParadigmaView />;
      case "u1-t2":
        return <U1PatternView />;
      case "u1-t3":
        return <U1HofView />;
      case "u2-t1":
        return <U2LambdasView />;
      case "u2-t2":
        return <U2ClosuresView />;
      case "u2-t3":
        return <U2InmutabilidadView />;
      case "u2-t4":
        return <U2PurezaView />;
      default:
        return (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Tema en Preparación</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Este módulo se habilitará conforme avancemos en el cronograma del sílabo.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar temaActivo={temaActivo} setTemaActivo={setTemaActivo} />
      <main className="flex-1 ml-80 p-8">
        <div className="max-w-5xl mx-auto">
          {renderContenido()}
        </div>
      </main>
    </div>
  );
}

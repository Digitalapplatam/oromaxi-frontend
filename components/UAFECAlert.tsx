'use client';

import { useState } from 'react';

interface Props {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UAFECAlert({ amount, onConfirm, onCancel }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const SOURCES = [
    'Salario / Ingresos laborales',
    'Actividad comercial / Negocio propio',
    'Ahorros personales',
    'Herencia / Donación',
    'Inversiones / Dividendos',
    'Venta de bienes',
    'Otro',
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!accepted || !sourceOfFunds || !purpose) return;
    setSubmitted(true);
    setTimeout(() => onConfirm(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-bg border border-yellow-600/50 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-yellow-400 text-xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-white font-bold">Verificación requerida</h2>
            <p className="text-yellow-400 text-xs">Cumplimiento UAFEC — Ecuador</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold">Información registrada</p>
            <p className="text-gray-light text-sm mt-1">Procesando tu oferta...</p>
          </div>
        ) : (
          <>
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-5">
              <p className="text-yellow-200 text-sm">
                Esta transacción supera <strong>$3,000</strong> (${amount.toLocaleString()}).
                Conforme a la <strong>Ley de Prevención de Lavado de Activos</strong> y regulaciones UAFEC,
                debemos registrar información adicional antes de proceder.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white font-semibold mb-2">
                  Origen de los fondos *
                </label>
                <select required value={sourceOfFunds} onChange={e => setSourceOfFunds(e.target.value)}
                  className="w-full bg-gray-dark border border-gray-dark rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500">
                  <option value="">Selecciona una opción</option>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white font-semibold mb-2">
                  Propósito de la transacción *
                </label>
                <textarea required value={purpose} onChange={e => setPurpose(e.target.value)}
                  rows={3} placeholder="Ej: Compra de joya para colección personal, inversión en oro..."
                  className="w-full bg-gray-dark border border-gray-dark rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 resize-none" />
              </div>

              <div className="bg-gray-dark rounded-lg p-4">
                <p className="text-gray-light text-xs mb-3">
                  OROMAXI verificará que el comprador y vendedor no aparezcan en listas restrictivas
                  (OFAC, ONU, GAFI) antes de aprobar la transacción. Este proceso puede tomar hasta 24 horas.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
                    className="mt-1 accent-yellow-500" />
                  <span className="text-white text-xs">
                    Declaro bajo juramento que los fondos provienen de actividades lícitas y autorizo
                    a OROMAXI a verificar mis datos conforme a la normativa antilavado vigente en Ecuador.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={onCancel}
                  className="flex-1 px-4 py-3 border border-gray-dark text-gray-light rounded-lg hover:border-red-500 hover:text-red-400 transition text-sm font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={!accepted || !sourceOfFunds || !purpose}
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-40 text-sm">
                  Confirmar y enviar oferta
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function SettingsPage() {
  const store = useStore();
  useEffect(()=>{ if (!store.ready) store.init(); }, [store]);

  async function exportData() {
    const json = await store.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `igreja-adoracao-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  }

  async function importData(file: File) {
    const text = await file.text();
    await store.importJson(text);
    alert('Dados importados com sucesso.');
  }

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-2">
      <section className="card">
        <h2 className="font-semibold mb-3">Backup</h2>
        <div className="flex gap-3">
          <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={exportData}>Exportar JSON</button>
          <label className="text-sm border rounded px-3 py-1 cursor-pointer">
            Importar JSON
            <input onChange={(e)=>{ const f = e.target.files?.[0]; if (f) importData(f); }} type="file" accept="application/json" className="hidden" />
          </label>
        </div>
        <p className="text-xs text-gray-600 mt-2">Os dados ficam salvos no seu navegador (IndexedDB).</p>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Prefer?ncias</h2>
        <div className="text-sm text-gray-600">Mais op??es em breve.</div>
      </section>
    </div>
  );
}

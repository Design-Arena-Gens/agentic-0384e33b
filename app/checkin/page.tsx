"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

export default function CheckinPage() {
  const store = useStore();
  useEffect(()=>{ if (!store.ready) store.init(); }, [store]);
  const [present, setPresent] = useState<Record<string, boolean>>({});

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-2">
      <section className="card">
        <h2 className="font-semibold mb-3">Check-in de Volunt?rios</h2>
        <div className="divide-y">
          {store.volunteers.map(v => (
            <label key={v.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{v.name}</div>
                <div className="text-xs text-gray-600">{v.roles.join(', ')}</div>
              </div>
              <input type="checkbox" checked={!!present[v.id]} onChange={(e)=>setPresent({...present, [v.id]: e.target.checked})} />
            </label>
          ))}
          {store.volunteers.length === 0 && <div className="text-sm text-gray-500">Cadastre volunt?rios para iniciar.</div>}
        </div>
        {store.volunteers.length > 0 && (
          <div className="mt-3 text-xs text-gray-600">Presentes: {Object.values(present).filter(Boolean).length}</div>
        )}
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Resumo</h2>
        <pre className="text-xs bg-gray-50 border rounded p-3 whitespace-pre-wrap">{JSON.stringify(present, null, 2)}</pre>
      </section>
    </div>
  );
}

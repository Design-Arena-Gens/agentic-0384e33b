"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

export default function VolunteersPage() {
  const store = useStore();
  useEffect(()=>{ if (!store.ready) store.init(); }, [store]);

  const [name, setName] = useState('');
  const [roles, setRoles] = useState('Vocal, Guitarra');

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="card">
        <h2 className="font-semibold mb-3">Cadastrar Volunt?rio</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded px-2 py-1" placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Email (opcional)" />
          <input className="border rounded px-2 py-1" placeholder="Fone (opcional)" />
          <input className="border rounded px-2 py-1 col-span-2" placeholder="Fun??es separadas por v?rgula" value={roles} onChange={(e)=>setRoles(e.target.value)} />
          <div className="col-span-2 flex justify-end">
            <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={async()=>{ if(name.trim()){ await store.addVolunteer({ name, roles: roles.split(',').map(x=>x.trim()).filter(Boolean) }); setName(''); } }}>Salvar</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Volunt?rios</h2>
        <div className="divide-y">
          {store.volunteers.map(v => (
            <div key={v.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-xs text-gray-600">{v.roles.join(', ')}</div>
              </div>
              <button className="text-xs text-red-600" onClick={()=>store.deleteVolunteer(v.id)}>Excluir</button>
            </div>
          ))}
          {store.volunteers.length === 0 && <div className="text-sm text-gray-500">Nenhum volunt?rio.</div>}
        </div>
      </section>
    </div>
  );
}

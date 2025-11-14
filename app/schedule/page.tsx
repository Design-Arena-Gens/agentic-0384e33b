"use client";

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';

export default function SchedulePage() {
  const store = useStore();
  const [date, setDate] = useState('');
  const [role, setRole] = useState('Vocal');
  const [volunteerId, setVolunteerId] = useState('');

  useEffect(()=>{ if (!store.ready) store.init(); }, [store]);

  const schedule = useMemo(()=> store.schedules.find(s=>s.date===date), [store.schedules, date]);

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-[320px,1fr]">
      <section className="card">
        <h2 className="font-semibold mb-3">Criar Escala</h2>
        <div className="space-y-2">
          <input type="date" className="border rounded px-2 py-1 w-full" value={date} onChange={(e)=>setDate(e.target.value)} />
          <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={async()=>{ if (date) await store.addSchedule({ date, positions: [] }); }}>Criar</button>
        </div>
        <div className="mt-4 text-sm text-gray-600">Selecione a data para editar a escala.</div>
      </section>

      <section className="card">
        {!date && <div className="text-sm text-gray-500">Escolha uma data para editar.</div>}
        {date && !schedule && <div className="text-sm text-gray-500">Crie a escala para {date}.</div>}
        {date && schedule && (
          <div className="space-y-4">
            <div className="font-medium">{date}</div>
            <div className="grid md:grid-cols-3 gap-3">
              <input className="border rounded px-2 py-1" placeholder="Fun??o" value={role} onChange={(e)=>setRole(e.target.value)} />
              <select className="border rounded px-2 py-1" value={volunteerId} onChange={(e)=>setVolunteerId(e.target.value)}>
                <option value="">-- Selecionar --</option>
                {store.volunteers.map(v=> <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={async()=>{
                const pos = { id: crypto.randomUUID(), role, volunteerId: volunteerId || undefined };
                await store.updateSchedule(schedule.id, { positions: [...schedule.positions, pos] });
              }}>Adicionar</button>
            </div>
            <div className="divide-y">
              {schedule.positions.map(p => (
                <div key={p.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm">{p.role}</div>
                    <div className="text-xs text-gray-600">{store.volunteers.find(v=>v.id===p.volunteerId)?.name ?? 'Em aberto'}</div>
                  </div>
                  <button className="text-xs text-red-600" onClick={()=>{
                    const next = schedule.positions.filter(x=>x.id!==p.id);
                    store.updateSchedule(schedule.id, { positions: next });
                  }}>Remover</button>
                </div>
              ))}
              {schedule.positions.length === 0 && <div className="text-sm text-gray-500">Nenhuma posi??o ainda.</div>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

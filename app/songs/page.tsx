"use client";

import { useEffect, useMemo, useState } from 'react';
import { useStore, Song } from '@/lib/store';
import { transposeLyrics, detectTransposeSteps } from '@/utils/chords';

export default function SongsPage() {
  const store = useStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Song | null>(null);
  const [targetKey, setTargetKey] = useState('C');

  useEffect(() => { if (!store.ready) store.init(); }, [store]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.songs;
    return store.songs.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      (s.artist ?? '').toLowerCase().includes(q) ||
      (s.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [store.songs, query]);

  const [form, setForm] = useState<Omit<Song, 'id'>>({ title: '', artist: '', key: 'C', lyrics: '' });

  const steps = useMemo(() => selected ? detectTransposeSteps(selected.key, targetKey) : 0, [selected, targetKey]);
  const transposedLyrics = useMemo(() => selected ? transposeLyrics(selected.lyrics, steps) : '', [selected, steps]);

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Cat?logo de Can??es</h2>
          <input
            placeholder="Buscar por t?tulo, artista ou tag"
            className="border rounded px-2 py-1 text-sm w-64"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </div>
        <div className="divide-y">
          {filtered.map((s) => (
            <div key={s.id} className="py-3 flex items-start justify-between gap-3">
              <button className="text-left" onClick={()=>{setSelected(s); setTargetKey(s.key);}}>
                <div className="font-medium">{s.title} <span className="badge ml-2">{s.key}</span></div>
                <div className="text-xs text-gray-600">{s.artist}</div>
              </button>
              <div className="flex items-center gap-2">
                <button className="text-xs text-red-600" onClick={()=>store.deleteSong(s.id)}>Excluir</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-6 text-sm text-gray-500">Nenhuma can??o encontrada.</div>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Cadastrar / Editar</h2>
        <form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); const id = await store.addSong(form); setForm({ title:'', artist:'', key:'C', lyrics:''}); const added = store.songs.find(x=>x.id===id) || null; setSelected(added);} }>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">T?tulo</label>
              <input className="border rounded px-2 py-1 w-full" required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-600">Artista</label>
              <input className="border rounded px-2 py-1 w-full" value={form.artist} onChange={(e)=>setForm({...form, artist:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-600">Tom (ex: C, D, Eb)</label>
              <input className="border rounded px-2 py-1 w-full" value={form.key} onChange={(e)=>setForm({...form, key:e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-600">Tags (separadas por v?rgula)</label>
              <input className="border rounded px-2 py-1 w-full" onChange={(e)=>setForm({...form, tags: e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})} />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600">Letra (+ cifras entre colchetes). Use linhas com # para se??es</label>
              <textarea className="border rounded px-2 py-1 w-full h-48" value={form.lyrics} onChange={(e)=>setForm({...form, lyrics:e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-primary-600 text-white text-sm rounded px-3 py-1">Salvar</button>
          </div>
        </form>
      </section>

      <section className="card lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Visualiza??o & Transposi??o</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Para o tom:</label>
            <input value={targetKey} onChange={(e)=>setTargetKey(e.target.value)} className="border rounded px-2 py-1 text-sm w-24" />
          </div>
        </div>
        {!selected && <div className="text-sm text-gray-500">Selecione uma can??o para visualizar.</div>}
        {selected && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-600 mb-2">Original: {selected.key} | Passos: {steps > 0 ? `+${steps}` : steps}</div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 border rounded p-3">{selected.lyrics}</pre>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-2">Transposto para {targetKey}</div>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 border rounded p-3">{transposedLyrics}</pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

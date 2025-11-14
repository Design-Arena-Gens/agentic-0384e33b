"use client";

import { useEffect, useMemo, useState } from 'react';
import { useStore, Setlist, Song, SetlistItem } from '@/lib/store';
import { splitSections } from '@/utils/chords';

export default function SetlistsPage() {
  const store = useStore();
  const [name, setName] = useState('Culto de Domingo');
  const [date, setDate] = useState<string>('');
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { if (!store.ready) store.init(); }, [store]);

  const active = useMemo(() => store.setlists.find(s=>s.id===activeId) ?? store.setlists[0], [store.setlists, activeId]);

  return (
    <div className="container-page py-8 grid gap-6 lg:grid-cols-[320px,1fr]">
      <section className="card">
        <h2 className="font-semibold mb-3">Planos</h2>
        <form className="space-y-2" onSubmit={async (e)=>{e.preventDefault(); const id = await store.addSetlist({ name, date, items: [] }); setActiveId(id);}}>
          <input className="border rounded px-2 py-1 w-full" placeholder="Nome do plano" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="border rounded px-2 py-1 w-full" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <button className="bg-primary-600 text-white text-sm rounded px-3 py-1">Criar</button>
        </form>
        <div className="mt-4 divide-y">
          {store.setlists.map(s => (
            <button key={s.id} onClick={()=>setActiveId(s.id)} className={`w-full text-left py-2 ${active?.id===s.id ? 'font-semibold' : ''}`}>
              <div>{s.name}</div>
              <div className="text-xs text-gray-600">{s.date}</div>
            </button>
          ))}
          {store.setlists.length === 0 && <div className="text-sm text-gray-500 py-4">Nenhum plano criado.</div>}
        </div>
      </section>

      <section className="card">
        {!active && <div className="text-sm text-gray-500">Crie ou selecione um plano.</div>}
        {active && (
          <div className="space-y-4">
            <header className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{active.name}</div>
                <div className="text-xs text-gray-600">{active.date}</div>
              </div>
              <div className="flex gap-2">
                <button className="text-red-600 text-sm" onClick={()=>store.deleteSetlist(active.id)}>Excluir</button>
                <button className="text-primary-700 text-sm" onClick={()=>store.setPresentation({ activeSetlistId: active.id })}>Usar no Apresentar</button>
              </div>
            </header>

            <AddItem />

            <ol className="space-y-3">
              {active.items.map((i) => (
                <li key={i.id} className="border rounded p-3 bg-gray-50 flex items-start justify-between">
                  <div>
                    {i.type === 'song' && <SongItem item={i} />}
                    {i.type === 'note' && <div className="text-sm"><span className="badge mr-2">Nota</span>{i.note}</div>}
                  </div>
                  <button className="text-xs text-red-600" onClick={()=>store.removeSetlistItem(active.id, i.id)}>Remover</button>
                </li>
              ))}
              {active.items.length === 0 && (
                <div className="text-sm text-gray-500">Adicione can??es e notas ao plano.</div>
              )}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}

function AddItem() {
  const store = useStore();
  const active = store.setlists.find(s=>s.id===store.presentation.activeSetlistId) || null;
  const [setlistId, setSetlistId] = useState<string>(active?.id ?? (store.setlists[0]?.id ?? ''));
  const [songId, setSongId] = useState<string>(store.songs[0]?.id ?? '');
  const [note, setNote] = useState('');

  useEffect(()=>{ if (!store.ready) store.init(); }, [store]);
  useEffect(()=>{ if (!setlistId && store.setlists[0]) setSetlistId(store.setlists[0].id); }, [store.setlists, setlistId]);
  useEffect(()=>{ if (!songId && store.songs[0]) setSongId(store.songs[0].id); }, [store.songs, songId]);

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="border rounded p-3">
        <div className="font-medium mb-2">Adicionar Can??o</div>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1 flex-1" value={songId} onChange={(e)=>setSongId(e.target.value)}>
            {store.songs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={()=>{ if(setlistId && songId) store.addSetlistItem(setlistId, { type:'song', songId } as Omit<Extract<SetlistItem,{type:'song'}>, 'id'>); }}>Adicionar</button>
        </div>
      </div>
      <div className="border rounded p-3">
        <div className="font-medium mb-2">Adicionar Nota</div>
        <div className="flex gap-2">
          <input className="border rounded px-2 py-1 flex-1" placeholder="Ex: Ora??o, Leitura, Avisos" value={note} onChange={(e)=>setNote(e.target.value)} />
          <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={()=>{ if(setlistId && note.trim()) { store.addSetlistItem(setlistId, { type:'note', note } as Omit<Extract<SetlistItem,{type:'note'}>, 'id'>); setNote(''); } }}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

function SongItem({ item }: { item: Extract<SetlistItem, {type:'song'}> }) {
  const store = useStore();
  const song = store.songs.find(s=>s.id===item.songId) as Song | undefined;
  if (!song) return <div className="text-sm text-gray-500">Can??o removida</div>;
  const sections = splitSections(song.lyrics);
  return (
    <div>
      <div className="text-sm font-medium">{song.title} <span className="badge ml-2">{song.key}</span></div>
      <div className="text-xs text-gray-600">{song.artist}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {sections.map((s, idx) => (
          <button key={idx} className="text-xs border rounded px-2 py-0.5" onClick={()=>{
            // push section quickly for presentation
            store.setPresentation({ activeSongId: song.id, activeSectionIndex: idx });
          }}>{s.name}</button>
        ))}
      </div>
    </div>
  );
}

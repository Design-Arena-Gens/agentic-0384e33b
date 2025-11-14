"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '@/lib/store';
import { splitSections, transposeLyrics, detectTransposeSteps } from '@/utils/chords';

export default function PresentPage() {
  const store = useStore();
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => { if (!store.ready) store.init(); }, [store]);
  useEffect(() => {
    const ch = new BroadcastChannel('presenter');
    channelRef.current = ch;
    return () => ch.close();
  }, []);

  const activeSet = store.setlists.find(s=>s.id===store.presentation.activeSetlistId);
  const activeSong = store.songs.find(s=>s.id===store.presentation.activeSongId);
  const sections = activeSong ? splitSections(activeSong.lyrics) : [];
  const section = sections[store.presentation.activeSectionIndex ?? 0];

  function showOnProjector(text: string) {
    channelRef.current?.postMessage({ type:'SHOW', text });
  }
  function clearProjector() { channelRef.current?.postMessage({ type:'CLEAR' }); }

  const transposed = useMemo(() => {
    if (!activeSong) return '';
    const steps = detectTransposeSteps(activeSong.key, activeSong.key); // same for now
    return transposeLyrics((section?.lines ?? []).join('\n'), steps);
  }, [activeSong, section]);

  return (
    <div className="container-page py-8 space-y-4">
      <h1 className="font-semibold">Apresenta??o</h1>
      {!activeSet && <div className="text-sm text-gray-500">Selecione um plano em Planos de Culto.</div>}
      {activeSet && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card">
            <div className="text-sm text-gray-600 mb-3">{activeSong ? activeSong.title : 'Sem can??o ativa'}</div>
            <pre className="whitespace-pre-wrap bg-gray-50 border rounded p-3 text-lg leading-relaxed min-h-[200px]">{transposed}</pre>
            <div className="mt-3 flex gap-2">
              <button className="bg-primary-600 text-white text-sm rounded px-3 py-1" onClick={()=>showOnProjector(transposed)}>Enviar ao Projetor</button>
              <button className="text-sm border rounded px-3 py-1" onClick={clearProjector}>Limpar</button>
            </div>
          </div>
          <div className="card">
            <div className="font-medium mb-2">Fluxo</div>
            <ol className="space-y-2">
              {activeSet.items.map((i) => (
                <li key={i.id}>
                  {i.type==='note' && <div className="text-xs text-gray-600">Nota: {i.note}</div>}
                  {i.type==='song' && (
                    <button className="text-left" onClick={()=>useStore.getState().setPresentation({ activeSongId: i.songId, activeSectionIndex: 0 })}>
                      <div className="text-sm">{store.songs.find(s=>s.id===i.songId)?.title}</div>
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      <div className="text-xs text-gray-500">Abra o Projetor em outra aba: /projector</div>
    </div>
  );
}

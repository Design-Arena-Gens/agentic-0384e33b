"use client";

import { useEffect, useRef, useState } from 'react';

export default function ProjectorPage() {
  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ch = new BroadcastChannel('presenter');
    ch.onmessage = (ev) => {
      const msg = ev.data;
      if (msg?.type === 'SHOW') setText(msg.text ?? '');
      if (msg?.type === 'CLEAR') setText('');
    };
    return () => ch.close();
  }, []);

  useEffect(() => {
    function fit() {
      const el = ref.current;
      if (!el) return;
      const fontBase = Math.max(24, Math.floor(window.innerHeight * 0.06));
      el.style.fontSize = fontBase + 'px';
      el.style.lineHeight = 1.2 as any;
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div ref={ref} className="whitespace-pre-wrap text-center max-w-5xl">{text}</div>
    </div>
  );
}

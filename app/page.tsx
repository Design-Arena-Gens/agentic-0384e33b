import Link from 'next/link';

export default function Page() {
  return (
    <div className="container-page py-8 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-2">Can??es</h2>
          <p className="text-sm text-gray-600 mb-3">Cat?logo, cifras, tom, se??es e transposi??o.</p>
          <Link href="/songs" className="text-primary-700 text-sm">Abrir</Link>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Planos de Culto</h2>
          <p className="text-sm text-gray-600 mb-3">Monte setlists, ordem do culto e tempo.</p>
          <Link href="/setlists" className="text-primary-700 text-sm">Abrir</Link>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Volunt?rios & Escala</h2>
          <p className="text-sm text-gray-600 mb-3">Equipes, fun??es e confirma??es.</p>
          <Link href="/volunteers" className="text-primary-700 text-sm">Abrir</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-2">Apresenta??o</h2>
          <p className="text-sm text-gray-600 mb-3">Letra no projetor, controle remoto.</p>
          <div className="flex gap-3">
            <Link href="/present" className="text-primary-700 text-sm">Controlar</Link>
            <Link href="/projector" target="_blank" className="text-primary-700 text-sm">Abrir Projetor</Link>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Check-in & Presen?a</h2>
          <p className="text-sm text-gray-600 mb-3">Registre equipes e membros.</p>
          <Link href="/checkin" className="text-primary-700 text-sm">Abrir</Link>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Configura??es</h2>
          <p className="text-sm text-gray-600 mb-3">Prefer?ncias, importa??o e exporta??o.</p>
          <Link href="/settings" className="text-primary-700 text-sm">Abrir</Link>
        </div>
      </div>
    </div>
  );
}

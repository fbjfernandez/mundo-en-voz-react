import { useState } from 'react';
import CarruselSeccion from './components/CarruselSeccion';
import ReproductorGlobal from './components/ReproductorGlobal';
import { libros } from './data/libros';

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [libroActivo, setLibroActivo] = useState(null);

  const librosFiltrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase())
  );

  const populares = librosFiltrados.filter(l => l.genero === "Populares");
  const terror    = librosFiltrados.filter(l => l.genero === "Terror");
  const comedia   = librosFiltrados.filter(l => l.genero === "Comedia");
  const medieval  = librosFiltrados.filter(l => l.genero === "Medieval");
  const romantico = librosFiltrados.filter(l => l.genero === "Romantico");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600">

      {/* ── Skip link para lectores de pantalla ── */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-base focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
      >
        Saltar al contenido principal
      </a>

      {/* ── Encabezado ── */}
      <header className="py-10 text-center" role="banner">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
          Mundo en Voz
        </h1>
        <p className="text-slate-400 text-sm mt-2">Plataforma de Audiolibros Accesibles</p>
      </header>

      {/* ── Buscador ── */}
      <section className="max-w-2xl mx-auto px-4 mb-12" aria-label="Buscador de audiolibros">
        <div className="relative">
          <label htmlFor="buscador-input" className="sr-only">Buscar por título o autor</label>
          <input
            id="buscador-input"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué deseas escuchar hoy? (Ej: Arte de la Guerra...)"
            className="w-full px-5 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all text-lg"
            aria-label="Buscar audiolibros por título o autor"
          />
        </div>
        {/* Anuncio en tiempo real para lectores de pantalla */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {busqueda
            ? `Se encontraron ${librosFiltrados.length} audiolibros para: ${busqueda}`
            : ''}
        </p>
      </section>

      {/* ── Carruseles ── */}
      <main
        id="contenido-principal"
        className={`max-w-7xl mx-auto px-4 space-y-16 pb-40`}
      >
        {populares.length > 0 && (
          <CarruselSeccion titulo="Libros Populares" libros={populares} onEscuchar={setLibroActivo} libroActivo={libroActivo} />
        )}
        {terror.length > 0 && (
          <CarruselSeccion titulo="Relatos de Terror" libros={terror} onEscuchar={setLibroActivo} libroActivo={libroActivo} />
        )}
        {comedia.length > 0 && (
          <CarruselSeccion titulo="Comedia" libros={comedia} onEscuchar={setLibroActivo} libroActivo={libroActivo} />
        )}
        {medieval.length > 0 && (
          <CarruselSeccion titulo="Época Medieval" libros={medieval} onEscuchar={setLibroActivo} libroActivo={libroActivo} />
        )}
        {romantico.length > 0 && (
          <CarruselSeccion titulo="Romántico" libros={romantico} onEscuchar={setLibroActivo} libroActivo={libroActivo} />
        )}

        {librosFiltrados.length === 0 && (
          <div className="text-center py-20" role="status" aria-live="polite">
            <p className="text-slate-400 text-xl">
              No se encontraron audiolibros para &ldquo;{busqueda}&rdquo;
            </p>
            <p className="text-slate-600 text-sm mt-2">Intenta con otro título o autor</p>
          </div>
        )}
      </main>

      {/* ── Reproductor global (aparece al seleccionar un libro) ── */}
      {libroActivo && (
        <ReproductorGlobal
          libro={libroActivo}
          onCerrar={() => setLibroActivo(null)}
        />
      )}
    </div>
  );
}
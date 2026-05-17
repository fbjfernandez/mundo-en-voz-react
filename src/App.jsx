import { useState } from 'react';
import CarruselSeccion from './components/CarruselSeccion';
import { libros } from './data/libros';

export default function App() {
  const [busqueda, setBusqueda] = useState("");

 
  const librosFiltrados = libros.filter(libro => 
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase())
  );

  
  const populares = librosFiltrados.filter(l => l.genero === "Populares");
  const terror = librosFiltrados.filter(l => l.genero === "Terror");
  const comedia = librosFiltrados.filter(l => l.genero === "Comedia");
  const medieval = librosFiltrados.filter(l => l.genero === "Medieval");

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600">
      
      {/* Encabezado accesible */}
      <header className="py-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
          Mundo en Voz
        </h1>
        <p className="text-slate-400 text-sm mt-2">Plataforma de Audiolibros Accesibles</p>
      </header>

      {/* Buscador Accesible */}
      <section className="max-w-2xl mx-auto px-4 mb-12" aria-label="Buscador">
        <div className="relative">
          <label htmlFor="buscador-input" className="sr-only">Buscar por título o autor</label>
          <input
            id="buscador-input"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué deseas escuchar hoy? (Ej: Arte de la Guerra...)"
            className="w-full px-5 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-950 transition-all text-lg"
          />
        </div>
        {/* Anuncio en tiempo real para lectores de pantalla (A11y) */}
        <p className="sr-only" aria-live="polite">
          {busqueda && `Se encontraron ${librosFiltrados.length} libros.`}
        </p>
      </section>

      {/* Contenedor Principal de Carruseles */}
      <main className="max-w-7xl mx-auto px-4 space-y-16 pb-24">
        {populares.length > 0 && (
          <CarruselSeccion titulo="Libros Populares" libros={populares} />
        )}
        
        {terror.length > 0 && (
          <CarruselSeccion titulo="Relatos de Terror" libros={terror} />
        )}

        {comedia.length > 0 && (
          <CarruselSeccion titulo="Comedia" libros={comedia} />
        )}

        {medieval.length > 0 && (
          <CarruselSeccion titulo="Época Medieval" libros={medieval} />
        )}

        {librosFiltrados.length === 0 && (
          <div className="text-center py-12" role="status">
            <p className="text-slate-400 text-lg">No se encontraron audiolibros para "{busqueda}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
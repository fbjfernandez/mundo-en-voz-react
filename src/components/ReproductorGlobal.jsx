export default function ReproductorGlobal({ libro }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <img 
            src={libro.imagen} 
            alt="" 
            className="w-12 h-12 rounded-lg object-cover border border-slate-700"
          />
          <div>
            <p className="font-bold text-slate-100 text-sm line-clamp-1">{libro.titulo}</p>
            <p className="text-xs text-slate-400">{libro.autor}</p>
          </div>
        </div>

        
        <div className="w-full sm:max-w-xl">
          <audio 
            src={libro.audio} 
            controls 
            autoPlay // Se reproduce automáticamente al hacer clic en escuchar
            className="w-full h-9 accent-blue-600"
          />
        </div>

        
        <span className="sr-only" aria-live="assertive">
          Reproduciendo ahora: {libro.titulo}. Utiliza los controles del reproductor para pausar o ajustar el volumen.
        </span>

      </div>
    </div>
  );
}
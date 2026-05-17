export default function BookCard({ libro }) {
  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700/50 transition-all duration-300 flex flex-col h-full group">

      <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
        <img 
          src={libro.imagen} 
          alt={`Portada del libro ${libro.titulo}`} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <span className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-md shadow-sm">
          {libro.genero}
        </span>
      </div>
    
      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
            {libro.titulo}
          </h3>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {libro.autor}
          </p>
        </div>

        <button 
          onClick={() => console.log(`Reproduciendo: ${libro.titulo}`)}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label={`Escuchar audiolibro: ${libro.titulo} de ${libro.autor}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
          Escuchar
        </button>
      </div>
    </div>
  );
}

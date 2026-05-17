import { useEffect, useRef, useState, useCallback } from 'react';

// ── Íconos SVG inline (sin dependencias extra) ──────────────────────────────
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M8 5.14v14l11-7-11-7z" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconRewind = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
  </svg>
);
const IconForward = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
  </svg>
);
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const IconMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ── Formatea segundos en mm:ss ──────────────────────────────────────────────
function formatTime(seg) {
  if (!seg || isNaN(seg)) return '0:00';
  const m = Math.floor(seg / 60);
  const s = Math.floor(seg % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ReproductorGlobal({ libro, onCerrar }) {
  const audioRef = useRef(null);

  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso,      setProgreso]      = useState(0);       // 0-100
  const [tiempoActual,  setTiempoActual]  = useState(0);
  const [duracion,      setDuracion]      = useState(0);
  const [volumen,       setVolumen]       = useState(1);
  const [silenciado,    setSilenciado]    = useState(false);
  const [velocidad,     setVelocidad]     = useState(1);
  const [usandoTTS,     setUsandoTTS]     = useState(false);
  const [anuncio,       setAnuncio]       = useState('');

  const velocidades = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // ── Anuncio para lectores de pantalla ──────────────────────────────────────
  const anunciar = useCallback((msg) => {
    setAnuncio('');
    setTimeout(() => setAnuncio(msg), 50);
  }, []);

  // ── Al cambiar de libro: reiniciar estado ──────────────────────────────────
  useEffect(() => {
    setReproduciendo(false);
    setProgreso(0);
    setTiempoActual(0);
    setDuracion(0);
    setUsandoTTS(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    audio.playbackRate = velocidad;
    audio.volume = silenciado ? 0 : volumen;

    const intentarReproducir = () => {
      audio.play()
        .then(() => setReproduciendo(true))
        .catch(() => {
          // Si el archivo de audio no existe → usar Web Speech API
          activarTTS();
        });
    };

    audio.addEventListener('canplay', intentarReproducir, { once: true });
    audio.addEventListener('error',   () => activarTTS(),  { once: true });

    return () => {
      audio.removeEventListener('canplay', intentarReproducir);
      window.speechSynthesis?.cancel();
    };
  }, [libro]);

  // ── Web Speech API como fallback ──────────────────────────────────────────
  function activarTTS() {
    if (!window.speechSynthesis) return;
    setUsandoTTS(true);

    const texto = `${libro.titulo}, por ${libro.autor}.`;
    const utt = new SpeechSynthesisUtterance(texto);
    utt.lang = 'es-ES';
    utt.rate = velocidad;
    utt.volume = silenciado ? 0 : volumen;

    utt.onstart  = () => setReproduciendo(true);
    utt.onend    = () => setReproduciendo(false);
    utt.onerror  = () => setReproduciendo(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
    anunciar(`Reproduciendo con voz del dispositivo: ${libro.titulo}`);
  }

  // ── Eventos del elemento <audio> ─────────────────────────────────────────
  function handleTimeUpdate() {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setTiempoActual(a.currentTime);
    setProgreso((a.currentTime / a.duration) * 100);
  }
  function handleLoadedMetadata() {
    setDuracion(audioRef.current?.duration || 0);
  }
  function handleEnded() {
    setReproduciendo(false);
    setProgreso(0);
    anunciar(`${libro.titulo} ha terminado`);
  }

  // ── Controles ─────────────────────────────────────────────────────────────
  function togglePlay() {
    const audio = audioRef.current;
    if (usandoTTS) {
      if (reproduciendo) {
        window.speechSynthesis.pause();
        setReproduciendo(false);
        anunciar('Pausado');
      } else {
        window.speechSynthesis.resume();
        setReproduciendo(true);
        anunciar('Reproduciendo');
      }
      return;
    }
    if (!audio) return;
    if (reproduciendo) {
      audio.pause();
      setReproduciendo(false);
      anunciar('Pausado');
    } else {
      audio.play();
      setReproduciendo(true);
      anunciar(`Reproduciendo ${libro.titulo}`);
    }
  }

  function retroceder() {
    if (audioRef.current) audioRef.current.currentTime -= 10;
    anunciar('Retrocedido 10 segundos');
  }
  function avanzar() {
    if (audioRef.current) audioRef.current.currentTime += 10;
    anunciar('Adelantado 10 segundos');
  }

  function handleProgreso(e) {
    const val = Number(e.target.value);
    setProgreso(val);
    if (audioRef.current && duracion) {
      audioRef.current.currentTime = (val / 100) * duracion;
    }
  }

  function handleVolumen(e) {
    const val = Number(e.target.value);
    setVolumen(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val === 0) setSilenciado(true);
    else setSilenciado(false);
  }

  function toggleSilencio() {
    const nuevo = !silenciado;
    setSilenciado(nuevo);
    if (audioRef.current) audioRef.current.volume = nuevo ? 0 : volumen;
    anunciar(nuevo ? 'Silenciado' : 'Sonido activado');
  }

  function cambiarVelocidad(v) {
    setVelocidad(v);
    if (audioRef.current) audioRef.current.playbackRate = v;
    if (usandoTTS && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      activarTTS();
    }
    anunciar(`Velocidad: ${v}x`);
  }

  // ── Teclado global ────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      // Solo actuar si el foco NO está en un input de texto
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowLeft')  retroceder();
      if (e.key === 'ArrowRight') avanzar();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reproduciendo, usandoTTS]);

  // ── Cerrar ────────────────────────────────────────────────────────────────
  function cerrar() {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setReproduciendo(false);
    onCerrar();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Elemento de audio real (oculto) */}
      <audio
        ref={audioRef}
        src={libro.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />

      {/* Anuncio para lectores de pantalla */}
      <p className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {anuncio}
      </p>

      {/* ── Panel del reproductor ── */}
      <div
        role="region"
        aria-label={`Reproductor: ${libro.titulo} de ${libro.autor}`}
        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-md border-t border-slate-700 shadow-2xl"
      >
        {/* Barra de progreso (arriba del panel) */}
        <div className="relative w-full h-1.5 bg-slate-700 group cursor-pointer">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progreso}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progreso}
            onChange={handleProgreso}
            aria-label={`Progreso: ${formatTime(tiempoActual)} de ${formatTime(duracion)}`}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">

          {/* Fila 1: portada + título + controles + cerrar */}
          <div className="flex items-center gap-4">

            {/* Portada */}
            <img
              src={libro.imagen}
              alt=""
              aria-hidden="true"
              className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
            />

            {/* Título y autor */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-100 text-sm truncate">{libro.titulo}</p>
              <p className="text-xs text-slate-400 truncate">{libro.autor}</p>
              {usandoTTS && (
                <p className="text-xs text-amber-400 mt-0.5" aria-hidden="true">
                  🔊 Usando voz del dispositivo
                </p>
              )}
            </div>

            {/* Controles principales */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* Retroceder 10s */}
              <button
                onClick={retroceder}
                disabled={usandoTTS}
                aria-label="Retroceder 10 segundos"
                title="Retroceder 10 s (←)"
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IconRewind />
              </button>

              {/* Play / Pausa */}
              <button
                onClick={togglePlay}
                aria-label={reproduciendo ? `Pausar ${libro.titulo}` : `Reproducir ${libro.titulo}`}
                title="Reproducir/Pausar (Espacio)"
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg shadow-blue-900/30"
              >
                {reproduciendo ? <IconPause /> : <IconPlay />}
              </button>

              {/* Avanzar 10s */}
              <button
                onClick={avanzar}
                disabled={usandoTTS}
                aria-label="Avanzar 10 segundos"
                title="Avanzar 10 s (→)"
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IconForward />
              </button>
            </div>

            {/* Tiempo */}
            {!usandoTTS && (
              <span className="text-xs text-slate-400 font-mono tabular-nums hidden sm:block flex-shrink-0" aria-hidden="true">
                {formatTime(tiempoActual)} / {formatTime(duracion)}
              </span>
            )}

            {/* Botón cerrar */}
            <button
              onClick={cerrar}
              aria-label="Cerrar reproductor"
              className="ml-2 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex-shrink-0"
            >
              <IconClose />
            </button>
          </div>

          {/* Fila 2: volumen + velocidad */}
          <div className="flex items-center gap-4 flex-wrap">

            {/* Volumen */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSilencio}
                aria-label={silenciado ? 'Activar sonido' : 'Silenciar'}
                className="p-1.5 rounded text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex-shrink-0"
              >
                {silenciado ? <IconMute /> : <IconVolume />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={silenciado ? 0 : volumen}
                onChange={handleVolumen}
                aria-label={`Volumen: ${Math.round((silenciado ? 0 : volumen) * 100)}%`}
                className="w-20 sm:w-28 h-1.5 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-500 tabular-nums w-8 hidden sm:block" aria-hidden="true">
                {Math.round((silenciado ? 0 : volumen) * 100)}%
              </span>
            </div>

            {/* Separador */}
            <div className="h-4 w-px bg-slate-700 hidden sm:block" aria-hidden="true" />

            {/* Velocidad */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Velocidad de reproducción">
              <span className="text-xs text-slate-500 mr-1 hidden sm:block">Velocidad</span>
              {velocidades.map((v) => (
                <button
                  key={v}
                  onClick={() => cambiarVelocidad(v)}
                  aria-label={`Velocidad ${v}x${velocidad === v ? ', seleccionada' : ''}`}
                  aria-pressed={velocidad === v}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${velocidad === v
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                  {v}x
                </button>
              ))}
            </div>

            {/* Separador */}
            <div className="h-4 w-px bg-slate-700 hidden sm:block" aria-hidden="true" />

            {/* Hint de teclado */}
            <p className="text-xs text-slate-600 hidden md:block" aria-hidden="true">
              Espacio = pausar · ← → = ±10 s
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
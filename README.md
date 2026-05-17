
# Mundo en Voz 🎧 — Plataforma de Audiolibros Accesibles
es una aplicación web diseñada específicamente para mitigar las barreras de acceso a la lectura que enfrentan las personas con discapacidad visual. El proyecto implementa accesibilidad web (WCAG) junto con interfaces interactivas, fluidas y optimizadas para el rendimiento (WPO).


## 🚀 Características  Implementadas (Frontend)

* **Buscador Dinámico en Tiempo Real:** Filtrado predictivo e inmediato por título de obra o autor mediante gestión de estados reactivos (`useState`), evitando recargas innecesarias en el cliente.
* **Carruseles de Navegación Segmentados:** Agrupación automatizada por géneros literarios (Populares, Terror, Comedia, Medieval) utilizando **Swiper.js**, adaptados con breakpoints totalmente responsivos para dispositivos móviles y escritorio.
* **Diseño UI Unificado:** Control estricto de las proporciones visuales de las portadas  para evitar saltos de maquetación y garantizar estabilidad visual.


## ♿ Enfoque en Accesibilidad (A11y)

A diferencia de un catálogo web tradicional, la interfaz se construyó priorizando la compatibilidad con lectores de pantalla (**Screen Readers** como NVDA o JAWS):
* **Atributos ARIA Semánticos:** Incorporación de regiones `aria-label` y estados `aria-live="polite"` / `"assertive"` para anunciar dinámicamente al usuario la cantidad de resultados encontrados tras una búsqueda o el cambio de pista en reproducción.
* **Estructura HTML Semántica:** Jerarquías estrictas en encabezados (`<h1>`, `<h2>`, etc.) e inputs con `labels` explícitos ocultos visualmente (`sr-only`) pero completamente legibles por sintetizadores de voz.


## 🛠️ Stack Tecnológico
| Tecnología      | Uso                                            |
| --------------- | ---------------------------------------------- |
| React.js        | Construcción de componentes y manejo de estado |
| Vite            | Entorno de desarrollo y bundling               |
| Tailwind CSS    | Estilizado responsive y utilitario             |
| Swiper.js       | Carruseles interactivos                        |
| HTML5 Audio API | Reproducción multimedia                        |

## 🌐 Demo en Producción
https://mundo-en-voz-react.vercel.app

## 🏗️ Arquitectura General del Sistema

```text
┌─────────────────────────────────────────┐
│               FRONTEND                  │
│        React + Vite + Tailwind          │
│                                         │
│  • Interfaz accesible                   │
│  • Reproductor multimedia               │
│  • Buscador dinámico                    │
└───────────────┬─────────────────────────┘
                │
                │ HTTP Requests / API Calls
                ▼
┌─────────────────────────────────────────┐
│               BACKEND                   │
│       Node.js + Express.js API          │
│                                         │
│  • Gestión de usuarios                  │
│  • Gestión de audiolibros               │
│  • Autenticación JWT                    │
│  • Conexión con MongoDB                 │
└───────────────┬─────────────────────────┘
                ├─────────────────────────────────────────┐
                │                                         │
                │ Consultas y almacenamiento              │ Solicita archivos MP3
                ▼                                         ▼
┌─────────────────────────────────────────┐ ┌─────────────────────────────────────────┐
│               DATABASE                  │ │             CLOUD STORAGE               │
│            MongoDB Atlas                │ │          AWS S3 / Cloudinary          │
│                                         │ │                                         │
│  • Colecciones de libros y usuarios     │ │  • Streaming multimedia (MP3)           │
│  • Persistencia de metadatos            │ │  • Almacenamiento de portadas           │
└─────────────────────────────────────────┘ └─────────────────────────────────────────┘

import Link from 'next/link'
import { Search } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Encuentra el espacio perfecto para tu evento
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Alquila terrazas, balcones, jardines y salones por horas entre particulares.
            </p>
            
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="¿Dónde buscas?"
                    className="input w-full text-secondary-900"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    className="input w-full text-secondary-900"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary px-8 py-3"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca</h3>
              <p className="text-secondary-600">
                Explora espacios únicos en tu ciudad filtrando por ubicación, precio y capacidad.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reserva</h3>
              <p className="text-secondary-600">
                Selecciona el horario que mejor te convenga y confirma tu reserva al instante.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Disfruta</h3>
              <p className="text-secondary-600">
                Vive una experiencia única en espacios auténticos con anfitriones locales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes un espacio para compartir?
          </h2>
          <p className="text-xl text-secondary-600 mb-8">
            Conviértete en anfitrión y empieza a ganar dinero alquilando tu terraza, balcón o jardín.
          </p>
          <Link href="/become-host" className="btn btn-primary px-8 py-3 text-lg">
            Publicar mi espacio
          </Link>
        </div>
      </section>
    </div>
  )
}

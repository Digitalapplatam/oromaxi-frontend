'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* NAVBAR */}
      <nav className="border-b border-gray-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold">
            <span className="text-gold">ORO</span>
            <span className="text-white">MAXI</span>
          </div>

          <div className="flex gap-4 items-center">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-gray-light">Hola, {user?.firstName}</span>
                <Link
                  href="/dashboard/seller"
                  className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-light hover:text-gold"
                >
                  Ingresar
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-gold">Invierte</span> Responsablemente
        </h1>
        <p className="text-2xl text-gray-light mb-12">
          Marketplace de confianza para oro, relojería y joyas de valor
        </p>

        <div className="flex gap-6 justify-center">
          <Link
            href="/marketplace"
            className="px-8 py-4 bg-gold text-dark-bg font-bold text-lg rounded-lg hover:bg-yellow-500 transition"
          >
            Explorar Catálogo
          </Link>
          <Link
            href="/signup"
            className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded-lg hover:bg-gold hover:text-dark-bg transition"
          >
            Vender Joya
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-dark py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Por qué OROMAXI</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Confianza Verificada',
                desc: 'Joyerías y compradores verificados con sello OROMAXI',
              },
              {
                title: 'Precios Justos',
                desc: 'Competencia abierta entre compradores para mejor precio',
              },
              {
                title: 'Recompra Segura',
                desc: 'Recupera tus joyas con términos claros y transparentes',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-gray-dark rounded-lg">
                <h3 className="text-xl font-bold text-gold mb-3">{feature.title}</h3>
                <p className="text-gray-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-dark py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-light">
          <p>© 2024 OROMAXI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

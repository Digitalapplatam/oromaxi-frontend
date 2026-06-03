'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const STEPS_SELLER = [
  { num: '01', title: 'Crea tu cuenta', desc: 'Regístrate gratis en menos de 2 minutos. Elige si quieres comprar, vender o ambos.' },
  { num: '02', title: 'Publica tu joya', desc: 'Sube fotos, describe el artículo, indica el material, kilates, peso y precio esperado.' },
  { num: '03', title: 'Recibe ofertas', desc: 'Compradores y joyerías verificadas hacen ofertas. Tú decides cuál aceptar.' },
  { num: '04', title: 'Cobra seguro', desc: 'Una vez aceptada la oferta, coordinamos la entrega y el pago de forma segura.' },
];

const STEPS_BUYER = [
  { num: '01', title: 'Explora el catálogo', desc: 'Navega por cientos de joyas, relojes y piezas de oro verificadas en Ecuador.' },
  { num: '02', title: 'Encuentra lo que buscas', desc: 'Filtra por categoría, ciudad, precio y tipo de venta para encontrar la pieza perfecta.' },
  { num: '03', title: 'Haz una oferta', desc: 'Envía tu oferta al vendedor con un mensaje personalizado. Válida por 7 días.' },
  { num: '04', title: 'Recibe tu joya', desc: 'El vendedor acepta tu oferta y coordinan la entrega. Simple y seguro.' },
];

const FAQS = [
  { q: '¿Es gratis publicar en OROMAXI?', a: 'Sí, publicar artículos es completamente gratuito. OROMAXI cobra una pequeña comisión solo cuando se concreta una venta.' },
  { q: '¿Cómo sé que los artículos son reales?', a: 'Todos los artículos pasan por un proceso de revisión antes de aparecer en el catálogo. Además, los vendedores tienen perfiles verificados.' },
  { q: '¿Qué es la venta con recompra?', a: 'Es una modalidad donde vendes tu joya pero tienes opción de recuperarla en un plazo pactado, pagando el valor acordado.' },
  { q: '¿En qué ciudades operan?', a: 'Actualmente operamos en Quito, Guayaquil, Cuenca y Machala. Próximamente más ciudades de Ecuador.' },
  { q: '¿Cómo se realizan los pagos?', a: 'Los pagos se coordinan directamente entre comprador y vendedor, con el respaldo de OROMAXI para garantizar la transacción.' },
];

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Link href="/marketplace" className="text-gray-light hover:text-gold text-sm">Catálogo</Link>
            <Link href="/signup" className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500 text-sm">
              Comenzar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          ¿Cómo <span className="text-gold">funciona</span>?
        </h1>
        <p className="text-xl text-gray-light">
          OROMAXI conecta a vendedores de joyas con compradores y joyerías verificadas en Ecuador.
        </p>
      </section>

      {/* Para vendedores */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs text-gold font-bold tracking-widest uppercase">Para vendedores</span>
          <h2 className="text-3xl font-bold text-white mt-2">Vende tu joya en 4 pasos</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {STEPS_SELLER.map((step) => (
            <div key={step.num} className="bg-gray-dark rounded-xl p-6 text-center relative">
              <div className="text-4xl font-bold text-gold/20 mb-3">{step.num}</div>
              <h3 className="text-white font-bold mb-2">{step.title}</h3>
              <p className="text-gray-light text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/signup" className="px-8 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition">
            Publicar mi joya
          </Link>
        </div>
      </section>

      {/* Para compradores */}
      <section className="bg-gray-dark py-12 mt-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs text-gold font-bold tracking-widest uppercase">Para compradores</span>
            <h2 className="text-3xl font-bold text-white mt-2">Encuentra tu joya ideal</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS_BUYER.map((step) => (
              <div key={step.num} className="bg-dark-bg rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-gold/20 mb-3">{step.num}</div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-gray-light text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/marketplace" className="px-8 py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-dark-bg transition">
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* Tipos de venta */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Tipos de venta</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '💰', title: 'Venta definitiva', desc: 'Vendes tu joya de forma permanente al mejor postor. El comprador paga y recibe la pieza.' },
            { icon: '🔄', title: 'Venta con recompra', desc: 'Vendes tu joya pero mantienes el derecho de recuperarla en un plazo y precio pactado.' },
            { icon: '🏆', title: 'Subasta', desc: 'Los compradores compiten haciendo ofertas. Vendes al mejor precio en el mercado.' },
          ].map((t) => (
            <div key={t.title} className="bg-gray-dark rounded-xl p-6">
              <div className="text-3xl mb-4">{t.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{t.title}</h3>
              <p className="text-gray-light text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-dark py-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-dark-bg rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-light text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">¿Listo para empezar?</h2>
        <p className="text-gray-light text-lg mb-8">Únete a OROMAXI y compra o vende joyas de forma segura en Ecuador.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="px-8 py-4 bg-gold text-dark-bg font-bold text-lg rounded-lg hover:bg-yellow-500 transition">
            Crear cuenta gratis
          </Link>
          <Link href="/marketplace" className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded-lg hover:bg-gold hover:text-dark-bg transition">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-dark py-8 bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-light">
          <p>© 2024 OROMAXI. Todos los derechos reservados. · Ecuador</p>
        </div>
      </footer>
    </div>
  );
}

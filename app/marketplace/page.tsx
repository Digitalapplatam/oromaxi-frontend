'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { itemsAPI } from '@/lib/api';

const CATEGORIES = ['Todos', 'ORO', 'JOYERIA', 'RELOJERIA'];

export default function MarketplacePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'Todos') params.category = category;
      const res = await itemsAPI.getAll(params);
      setItems(res.data.items || res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark sticky top-0 bg-dark-bg z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span>
            <span className="text-white">MAXI</span>
          </Link>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-gray-light text-sm">Hola, {user?.firstName}</span>
                <Link
                  href="/dashboard/seller"
                  className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500 text-sm"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-light hover:text-gold text-sm">
                  Ingresar
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500 text-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gold">Catálogo</span> de joyas
          </h1>
          <p className="text-gray-light">Oro, relojería y joyería verificada en Ecuador</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-gray-dark border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
          />
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? 'bg-gold text-dark-bg'
                    : 'bg-gray-dark text-gray-light hover:border-gold border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24 text-gray-light">Cargando catálogo...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-light text-xl mb-4">No hay artículos disponibles</p>
            {isAuthenticated && (
              <Link
                href="/dashboard/seller"
                className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500"
              >
                Publicar artículo
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-gray-dark rounded-xl overflow-hidden border border-gray-dark hover:border-gold/50 transition group"
              >
                {/* Imagen */}
                <div className="h-48 bg-dark-bg flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">💍</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white group-hover:text-gold transition line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-xs bg-dark-bg text-gold px-2 py-1 rounded ml-2 shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-light text-sm line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gold font-bold text-lg">
                      ${Number(item.basePrice || item.price || 0).toLocaleString()}
                    </span>
                    <Link
                      href={`/items/${item.id}`}
                      className="text-sm text-gold hover:underline"
                    >
                      Ver detalle →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { itemsAPI } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';

const CATEGORIES = ['Todos', 'ORO', 'JOYERIA', 'RELOJERIA'];
const CITIES = ['Todas', 'Quito', 'Guayaquil', 'Cuenca', 'Machala'];
const SALE_TYPES = ['Todos', 'definitive', 'auction', 'buyback'];
const SALE_LABELS: Record<string, string> = {
  Todos: 'Todos', definitive: 'Venta directa', auction: 'Subasta', buyback: 'Con recompra',
};

export default function MarketplacePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
  const [city, setCity] = useState('Todas');
  const [saleType, setSaleType] = useState('Todos');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [category, city, saleType]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category !== 'Todos') params.category = category;
      if (city !== 'Todas') params.city = city;
      if (saleType !== 'Todos') params.saleType = saleType;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await itemsAPI.getAll(params);
      setItems(res.data.items || res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.material?.toLowerCase().includes(search.toLowerCase())
  );

  const activeFilters = [
    category !== 'Todos' && category,
    city !== 'Todas' && city,
    saleType !== 'Todos' && SALE_LABELS[saleType],
    minPrice && `Mín $${minPrice}`,
    maxPrice && `Máx $${maxPrice}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark sticky top-0 bg-dark-bg z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/seller" className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500 text-sm">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-light hover:text-gold text-sm">Ingresar</Link>
                <Link href="/signup" className="px-4 py-2 bg-gold text-dark-bg font-semibold rounded-lg hover:bg-yellow-500 text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">
              <span className="text-gold">Catálogo</span> de joyas
            </h1>
            <p className="text-gray-light">Oro, relojería y joyería verificada en Ecuador</p>
          </div>
          {isAuthenticated && (
            <Link href="/items/new" className="px-5 py-2 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 text-sm">
              + Publicar
            </Link>
          )}
        </div>

        {/* Búsqueda y filtros */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre, material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-gray-dark border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg border transition text-sm font-medium ${showFilters ? 'border-gold text-gold bg-gold/10' : 'border-gray-dark text-gray-light hover:border-gold'}`}>
              Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            {activeFilters.length > 0 && (
              <button onClick={() => { setCategory('Todos'); setCity('Todas'); setSaleType('Todos'); setMinPrice(''); setMaxPrice(''); }}
                className="px-4 py-3 rounded-lg border border-red-900 text-red-400 hover:bg-red-900/20 text-sm transition">
                Limpiar
              </button>
            )}
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="bg-gray-dark rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-light mb-2">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-light mb-2">Ciudad</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-light mb-2">Tipo de venta</label>
                <select value={saleType} onChange={(e) => setSaleType(e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                  {SALE_TYPES.map(s => <option key={s} value={s}>{SALE_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-light mb-2">Precio ($)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Mín" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold" />
                  <input type="number" placeholder="Máx" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="md:col-span-4">
                <button onClick={fetchItems} className="px-6 py-2 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 text-sm transition">
                  Aplicar filtros
                </button>
              </div>
            </div>
          )}

          {/* Tags de filtros activos */}
          {activeFilters.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {activeFilters.map((f: any) => (
                <span key={f} className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-24 text-gray-light">Cargando catálogo...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-light text-xl mb-4">No hay artículos disponibles</p>
            {isAuthenticated && (
              <Link href="/items/new" className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500">
                Publicar artículo
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-light text-sm mb-4">{filtered.length} artículo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => {
                const img = Array.isArray(item.images) ? item.images[0] : (item.images || '').split(',')[0];
                return (
                  <Link key={item.id} href={`/items/${item.id}`}
                    className="bg-gray-dark rounded-xl overflow-hidden border border-gray-dark hover:border-gold/50 transition group block">
                    <div className="h-48 bg-dark-bg flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <span className="text-4xl">💍</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white group-hover:text-gold transition line-clamp-1">{item.title}</h3>
                        <span className="text-xs bg-dark-bg text-gold px-2 py-1 rounded ml-2 shrink-0">{item.category}</span>
                      </div>
                      <p className="text-gray-light text-xs mb-1">{item.material} {item.purity} · {item.city}</p>
                      <p className="text-gray-light text-sm line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gold font-bold text-lg">${Number(item.expectedPrice || 0).toLocaleString()}</span>
                        <span className="text-xs text-gray-light">{item.offers?.length || 0} oferta{item.offers?.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

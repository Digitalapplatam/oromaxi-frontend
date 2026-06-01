'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { itemsAPI, offersAPI } from '@/lib/api';

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await itemsAPI.getById(id as string);
      setItem(res.data.item || res.data);
    } catch {
      setError('Artículo no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleOffer = async (e: any) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setOfferLoading(true);
    try {
      await offersAPI.create({
        itemId: id,
        amount: parseFloat(offerAmount),
        message: offerMessage,
        receiverId: item.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setOfferSuccess(true);
      setOfferAmount('');
      setOfferMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar oferta');
    } finally {
      setOfferLoading(false);
    }
  };

  const SALE_TYPE_LABEL: Record<string, string> = {
    definitive: 'Venta definitiva',
    buyback: 'Con recompra',
    auction: 'Subasta',
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-gray-light">
      Cargando...
    </div>
  );

  if (!item) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-light mb-4">Artículo no encontrado</p>
        <Link href="/marketplace" className="text-gold hover:underline">← Volver al catálogo</Link>
      </div>
    </div>
  );

  const isOwner = user?.id === item.userId;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <Link href="/marketplace" className="text-gray-light hover:text-gold text-sm">
            ← Catálogo
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Imágenes */}
          <div>
            <div className="bg-gray-dark rounded-xl h-80 flex items-center justify-center overflow-hidden">
              {item.images && item.images.split(',')[0] ? (
                <img
                  src={item.images.split(',')[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">💍</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-gold/20 text-gold px-3 py-1 rounded-full">{item.category}</span>
                <span className="text-xs bg-gray-dark text-gray-light px-3 py-1 rounded-full">
                  {SALE_TYPE_LABEL[item.saleType] || item.saleType}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
              <p className="text-gray-light">{item.description}</p>
            </div>

            {/* Detalles */}
            <div className="bg-gray-dark rounded-xl p-5 grid grid-cols-2 gap-4">
              {[
                { label: 'Material', value: item.material },
                { label: 'Pureza', value: item.purity || '—' },
                { label: 'Peso', value: item.weight ? `${item.weight}g` : '—' },
                { label: 'Estado', value: item.condition },
                { label: 'Ciudad', value: item.city },
                { label: 'Marca', value: item.brand || '—' },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-gray-light text-xs">{d.label}</p>
                  <p className="text-white font-medium">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Precio */}
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
              <p className="text-gray-light text-sm mb-1">Precio esperado</p>
              <p className="text-4xl font-bold text-gold">
                ${Number(item.expectedPrice || item.basePrice || 0).toLocaleString()}
              </p>
              {item.minAcceptable > 0 && (
                <p className="text-gray-light text-sm mt-1">
                  Mínimo aceptable: ${Number(item.minAcceptable).toLocaleString()}
                </p>
              )}
            </div>

            {/* Oferta */}
            {!isOwner && (
              <div className="bg-gray-dark rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Hacer una oferta</h3>
                {offerSuccess ? (
                  <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                    ✅ Oferta enviada. El vendedor la revisará pronto.
                  </div>
                ) : (
                  <form onSubmit={handleOffer} className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-light mb-1">Tu oferta ($)</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-light mb-1">Mensaje (opcional)</label>
                      <textarea
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        rows={2}
                        className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold resize-none"
                        placeholder="Explica tu oferta..."
                      />
                    </div>
                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={offerLoading}
                      className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
                    >
                      {offerLoading ? 'Enviando...' : isAuthenticated ? 'Enviar oferta' : 'Inicia sesión para ofertar'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {isOwner && (
              <div className="bg-gray-dark rounded-xl p-5 text-center text-gray-light">
                Este es tu artículo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

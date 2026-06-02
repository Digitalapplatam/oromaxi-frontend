'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { adminAPI, itemsAPI } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [tab, setTab] = useState<'items' | 'stats'>('items');
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [pendingRes, statsRes] = await Promise.all([
        adminAPI.getPendingItems(),
        adminAPI.getStats(),
      ]);
      setItems(pendingRes.data.items || pendingRes.data || []);
      setStats(statsRes.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { alert('Error al aprobar'); }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Motivo del rechazo:');
    if (!reason) return;
    try {
      await adminAPI.rejectItem(id, { reason });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { alert('Error al rechazar'); }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
            <span className="ml-3 text-xs bg-gold text-dark-bg px-2 py-1 rounded font-bold">ADMIN</span>
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <button onClick={() => { logout(); router.push('/'); }}
              className="px-4 py-2 border border-gray-dark text-gray-light rounded-lg hover:border-gold hover:text-gold text-sm transition">
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Panel de administración</h1>
        <p className="text-gray-light mb-8">Gestiona artículos, usuarios y estadísticas</p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total usuarios', value: stats.totalUsers || 0, color: 'text-white' },
              { label: 'Total artículos', value: stats.totalItems || 0, color: 'text-gold' },
              { label: 'Pendientes', value: stats.pendingItems || items.length, color: 'text-yellow-400' },
              { label: 'Total ofertas', value: stats.totalOffers || 0, color: 'text-green-400' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-dark rounded-xl p-5">
                <p className="text-gray-light text-sm">{s.label}</p>
                <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-dark">
          <button onClick={() => setTab('items')}
            className={`pb-3 font-semibold text-sm transition ${tab === 'items' ? 'text-gold border-b-2 border-gold' : 'text-gray-light hover:text-white'}`}>
            Artículos pendientes {items.length > 0 && `(${items.length})`}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-light">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-dark rounded-xl">
            <p className="text-gray-light text-xl">No hay artículos pendientes de aprobación ✅</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const img = Array.isArray(item.images) ? item.images[0] : (item.images || '').split(',')[0];
              return (
                <div key={item.id} className="bg-gray-dark rounded-xl p-5 border border-gray-dark">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-dark-bg rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-3xl">
                      {img ? <img src={img} className="w-full h-full object-cover" /> : '💍'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white text-lg">{item.title}</h3>
                          <p className="text-gray-light text-sm mt-1">{item.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-light">
                            <span>{item.category}</span>
                            <span>{item.material} {item.purity}</span>
                            <span>{item.weight}g</span>
                            <span>{item.city}</span>
                            <span className="text-gold font-bold">${Number(item.expectedPrice).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-light mt-1">
                            Vendedor: {item.user?.firstName} {item.user?.lastName}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4 shrink-0">
                          <button onClick={() => handleApprove(item.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-500 transition">
                            ✓ Aprobar
                          </button>
                          <button onClick={() => handleReject(item.id)}
                            className="px-4 py-2 bg-red-900/50 text-red-400 text-sm font-bold rounded-lg hover:bg-red-900 transition">
                            ✗ Rechazar
                          </button>
                          <Link href={`/items/${item.id}`}
                            className="px-4 py-2 border border-gray-dark text-gray-light text-sm rounded-lg hover:border-gold hover:text-gold transition">
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

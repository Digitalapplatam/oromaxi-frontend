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
  const [tab, setTab] = useState<'items' | 'users'>('items');
  const [items, setItems] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
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
      // Usuarios pendientes de verificación
      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?verified=false`, {
        headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` }
      });
      if (usersRes.ok) {
        const ud = await usersRes.json();
        setPendingUsers(ud.users || ud || []);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
        body: JSON.stringify({ isVerified: true }),
      });
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch { alert('Error al verificar usuario'); }
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
        <div className="flex gap-6 mb-6 border-b border-gray-dark">
          <button onClick={() => setTab('items')}
            className={`pb-3 font-semibold text-sm transition ${tab === 'items' ? 'text-gold border-b-2 border-gold' : 'text-gray-light hover:text-white'}`}>
            Artículos pendientes {items.length > 0 && `(${items.length})`}
          </button>
          <button onClick={() => setTab('users')}
            className={`pb-3 font-semibold text-sm transition ${tab === 'users' ? 'text-gold border-b-2 border-gold' : 'text-gray-light hover:text-white'}`}>
            Usuarios por verificar {pendingUsers.length > 0 && (
              <span className="ml-2 bg-yellow-400 text-dark-bg text-xs px-2 py-0.5 rounded-full font-bold">{pendingUsers.length}</span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-light">Cargando...</div>
        ) : tab === 'users' ? (
          // USUARIOS PENDIENTES
          pendingUsers.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-dark rounded-xl">
              <p className="text-gray-light text-xl">No hay usuarios pendientes de verificación ✅</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((u) => (
                <div key={u.id} className="bg-gray-dark rounded-xl p-5 border border-gray-dark">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{u.firstName} {u.lastName}</p>
                          <p className="text-gray-light text-sm">{u.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-4 text-xs text-gray-light">
                        <span>Rol: <span className="text-gold capitalize">{u.role}</span></span>
                        <span>Ciudad: {u.city}</span>
                        {u.idDocument && <span>Doc: {u.idType} {u.idDocument}</span>}
                        <span>Registrado: {new Date(u.createdAt).toLocaleDateString('es-EC')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleVerifyUser(u.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-500 transition">
                        ✓ Verificar
                      </button>
                      <button className="px-4 py-2 bg-red-900/50 text-red-400 text-sm font-bold rounded-lg hover:bg-red-900 transition">
                        ✗ Rechazar
                      </button>
                    </div>
                  </div>
                  {/* Alerta UAFEC si es joyería */}
                  {u.role === 'jewelry' && (
                    <div className="mt-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg px-4 py-2 text-xs text-yellow-300">
                      ⚠️ Joyería — Verificar RUC en el SRI y revisar listas restrictivas UAFEC antes de aprobar
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { usersAPI } from '@/lib/api';

export default function SellerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout, login } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradingRole, setUpgradingRole] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMyItems();
  }, [isAuthenticated]);

  const handleActivateSeller = async () => {
    setUpgradingRole(true);
    try {
      await usersAPI.updateProfile(user.id, { role: 'BOTH' });
      login({ ...user, role: 'BOTH' }, useAuthStore.getState().token);
    } catch {
      alert('Error al actualizar el rol. Intenta de nuevo.');
    } finally {
      setUpgradingRole(false);
    }
  };

  const fetchMyItems = async () => {
    try {
      const res = await usersAPI.getItems(user.id);
      setItems(res.data.items || res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const statusColor = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    APPROVED: 'text-green-400 bg-green-400/10',
    REJECTED: 'text-red-400 bg-red-400/10',
    SOLD: 'text-gray-400 bg-gray-400/10',
  };

  const statusLabel = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    SOLD: 'Vendido',
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span>
            <span className="text-white">MAXI</span>
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-light text-sm">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-dark text-gray-light rounded-lg hover:border-gold hover:text-gold text-sm transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Mi Dashboard</h1>
            <p className="text-gray-light mt-1">Gestiona tus artículos publicados</p>
          </div>
          <Link
            href="/items/new"
            className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            + Publicar artículo
          </Link>
        </div>

        {/* Banner activar vendedor */}
        {user?.role === 'BUYER' && (
          <div className="mb-6 bg-gold/10 border border-gold/30 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gold font-semibold">¿También quieres vender?</p>
              <p className="text-gray-light text-sm">Activa el modo vendedor para publicar tus artículos</p>
            </div>
            <button
              onClick={handleActivateSeller}
              disabled={upgradingRole}
              className="px-5 py-2 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 shrink-0 ml-4"
            >
              {upgradingRole ? 'Activando...' : 'Activar modo vendedor'}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: items.length, color: 'text-white' },
            { label: 'Pendientes', value: items.filter((i) => i.status === 'PENDING').length, color: 'text-yellow-400' },
            { label: 'Aprobados', value: items.filter((i) => i.status === 'APPROVED').length, color: 'text-green-400' },
            { label: 'Vendidos', value: items.filter((i) => i.status === 'SOLD').length, color: 'text-gold' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-dark rounded-xl p-5 border border-gray-dark">
              <p className="text-gray-light text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="text-center py-16 text-gray-light">Cargando artículos...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-dark rounded-xl">
            <p className="text-gray-light text-xl mb-4">Aún no tienes artículos publicados</p>
            <Link
              href="/items/new"
              className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500"
            >
              Publicar mi primer artículo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-dark rounded-xl p-5 border border-gray-dark flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-dark-bg rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '💍'
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-gray-light text-sm">{item.category}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-center">
                  <span className="text-gold font-bold">
                    ${Number(item.basePrice || item.price || 0).toLocaleString()}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[item.status] || 'text-gray-light'}`}>
                    {statusLabel[item.status] || item.status}
                  </span>
                  <Link
                    href={`/items/${item.id}`}
                    className="text-sm text-gold hover:underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

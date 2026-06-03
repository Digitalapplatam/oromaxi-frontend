'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { usersAPI, offersAPI } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import AccountStatusBanner from '@/components/AccountStatusBanner';

export default function SellerDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout, login } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingRole, setUpgradingRole] = useState(false);
  const [tab, setTab] = useState<'items' | 'offers'>('items');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [itemsRes, offersRes] = await Promise.all([
        usersAPI.getItems(user.id),
        usersAPI.getProfile(user.id),
      ]);
      setItems(itemsRes.data.items || itemsRes.data || []);

      // Get offers for each item
      const myItems = itemsRes.data.items || itemsRes.data || [];
      const allOffers: any[] = [];
      for (const item of myItems) {
        try {
          const offerRes = await offersAPI.getForItem(item.id);
          const itemOffers = (offerRes.data.offers || offerRes.data || []).map((o: any) => ({ ...o, itemTitle: item.title }));
          allOffers.push(...itemOffers);
        } catch {}
      }
      setOffers(allOffers);
    } catch {}
    finally { setLoading(false); }
  };

  const handleActivateSeller = async () => {
    setUpgradingRole(true);
    try {
      await usersAPI.updateProfile(user.id, { role: 'BOTH' });
      login({ ...user, role: 'BOTH' }, useAuthStore.getState().token);
    } catch {
      alert('Error al actualizar el rol.');
    } finally { setUpgradingRole(false); }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await offersAPI.accept(offerId);
      fetchData();
    } catch { alert('Error al aceptar oferta'); }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await offersAPI.reject(offerId, { reason: 'Rechazado por el vendedor' });
      fetchData();
    } catch { alert('Error al rechazar oferta'); }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  const statusColor: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    APPROVED: 'text-green-400 bg-green-400/10',
    REJECTED: 'text-red-400 bg-red-400/10',
    SOLD: 'text-gray-400 bg-gray-400/10',
  };
  const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado', SOLD: 'Vendido',
  };
  const offerStatusLabel: Record<string, string> = {
    pending: 'Pendiente', accepted: 'Aceptada', rejected: 'Rechazada',
  };
  const offerStatusColor: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    accepted: 'text-green-400 bg-green-400/10',
    rejected: 'text-red-400 bg-red-400/10',
  };

  const pendingOffers = offers.filter(o => o.status === 'pending');

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
            <Link href="/perfil" className="text-gray-light hover:text-gold text-sm">{user?.firstName} {user?.lastName}</Link>
            <button onClick={handleLogout}
              className="px-4 py-2 border border-gray-dark text-gray-light rounded-lg hover:border-gold hover:text-gold text-sm transition">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Mi Dashboard</h1>
            <p className="text-gray-light mt-1">Gestiona tus artículos y ofertas</p>
          </div>
          <Link href="/items/new"
            className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition">
            + Publicar artículo
          </Link>
        </div>

        {/* Banner verificación cuenta */}
        <div className="mb-4"><AccountStatusBanner /></div>

        {/* Banner activar vendedor */}
        {user?.role === 'BUYER' && (
          <div className="mb-6 bg-gold/10 border border-gold/30 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gold font-semibold">¿También quieres vender?</p>
              <p className="text-gray-light text-sm">Activa el modo vendedor para publicar tus artículos</p>
            </div>
            <button onClick={handleActivateSeller} disabled={upgradingRole}
              className="px-5 py-2 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 shrink-0 ml-4">
              {upgradingRole ? 'Activando...' : 'Activar modo vendedor'}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Artículos', value: items.length, color: 'text-white' },
            { label: 'Aprobados', value: items.filter(i => i.status === 'APPROVED' || i.adminApproved).length, color: 'text-green-400' },
            { label: 'Ofertas recibidas', value: offers.length, color: 'text-gold' },
            { label: 'Ofertas pendientes', value: pendingOffers.length, color: 'text-yellow-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-dark rounded-xl p-5 border border-gray-dark">
              <p className="text-gray-light text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-dark">
          <button onClick={() => setTab('items')}
            className={`pb-3 font-semibold text-sm transition ${tab === 'items' ? 'text-gold border-b-2 border-gold' : 'text-gray-light hover:text-white'}`}>
            Mis artículos ({items.length})
          </button>
          <button onClick={() => setTab('offers')}
            className={`pb-3 font-semibold text-sm transition ${tab === 'offers' ? 'text-gold border-b-2 border-gold' : 'text-gray-light hover:text-white'}`}>
            Ofertas recibidas ({offers.length})
            {pendingOffers.length > 0 && (
              <span className="ml-2 bg-yellow-400 text-dark-bg text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingOffers.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-light">Cargando...</div>
        ) : tab === 'items' ? (
          // ARTÍCULOS
          items.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-dark rounded-xl">
              <p className="text-gray-light text-xl mb-4">Aún no tienes artículos publicados</p>
              <Link href="/items/new" className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg hover:bg-yellow-500">
                Publicar mi primer artículo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const img = Array.isArray(item.images) ? item.images[0] : (item.images || '').split(',')[0];
                return (
                  <div key={item.id} className="bg-gray-dark rounded-xl p-5 border border-gray-dark flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-dark-bg rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {img ? <img src={img} className="w-full h-full object-cover" /> : '💍'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="text-gray-light text-sm">{item.category} · {item.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-center">
                      <span className="text-gold font-bold">${Number(item.expectedPrice || 0).toLocaleString()}</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[item.status] || 'text-gray-light'}`}>
                        {statusLabel[item.status] || item.status}
                      </span>
                      <Link href={`/items/${item.id}`} className="text-sm text-gold hover:underline">Ver →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          // OFERTAS
          offers.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-dark rounded-xl">
              <p className="text-gray-light text-xl">Aún no has recibido ofertas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-gray-dark rounded-xl p-5 border border-gray-dark">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-light text-xs mb-1">Artículo: <span className="text-white">{offer.itemTitle}</span></p>
                      <p className="text-2xl font-bold text-gold">${Number(offer.amount).toLocaleString()}</p>
                      {offer.message && <p className="text-gray-light text-sm mt-1">"{offer.message}"</p>}
                      <p className="text-gray-light text-xs mt-2">
                        De: {offer.maker?.firstName} {offer.maker?.lastName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${offerStatusColor[offer.status] || ''}`}>
                        {offerStatusLabel[offer.status] || offer.status}
                      </span>
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAcceptOffer(offer.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-500 transition">
                            Aceptar
                          </button>
                          <button onClick={() => handleRejectOffer(offer.id)}
                            className="px-4 py-2 bg-red-900/50 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-900 transition">
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

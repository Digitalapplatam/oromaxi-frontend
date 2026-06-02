'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { usersAPI } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';

export default function PerfilPage() {
  const router = useRouter();
  const { isAuthenticated, user, login } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', city: '', state: '' });
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      state: user?.state || '',
    });
    fetchItems();
  }, [isAuthenticated]);

  const fetchItems = async () => {
    try {
      const res = await usersAPI.getItems(user.id);
      setItems(res.data.items || res.data || []);
    } catch {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile(user.id, form);
      login({ ...user, ...form }, useAuthStore.getState().token);
      setEditing(false);
    } catch { alert('Error al guardar'); }
    finally { setSaving(false); }
  };

  const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Machala'];

  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link href="/dashboard/seller" className="text-gray-light hover:text-gold text-sm">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Perfil */}
          <div className="md:col-span-1">
            <div className="bg-gray-dark rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-3xl font-bold text-gold mx-auto mb-4">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <h2 className="text-white font-bold text-xl">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-light text-sm mt-1">{user?.email}</p>
              <p className="text-gray-light text-xs mt-1">{user?.city}, Ecuador</p>

              <div className="mt-4 pt-4 border-t border-gray-dark">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-light">Artículos</span>
                  <span className="text-white font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-light">Rol</span>
                  <span className="text-gold font-bold capitalize">{user?.role}</span>
                </div>
              </div>

              <button onClick={() => setEditing(!editing)}
                className="mt-6 w-full px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-dark-bg transition text-sm font-semibold">
                {editing ? 'Cancelar' : 'Editar perfil'}
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="md:col-span-2 space-y-6">
            {/* Editar */}
            {editing && (
              <div className="bg-gray-dark rounded-xl p-6 space-y-4">
                <h3 className="text-white font-semibold">Editar información</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-light mb-1">Nombre</label>
                    <input value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-light mb-1">Apellido</label>
                    <input value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-light mb-1">Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
                    placeholder="+593..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-light mb-1">Ciudad</label>
                  <select value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold">
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="w-full bg-gold text-dark-bg font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            )}

            {/* Mis artículos */}
            <div className="bg-gray-dark rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Mis artículos ({items.length})</h3>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-light mb-3">No tienes artículos publicados</p>
                  <Link href="/items/new" className="text-gold hover:underline text-sm">+ Publicar artículo</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const img = Array.isArray(item.images) ? item.images[0] : (item.images || '').split(',')[0];
                    return (
                      <Link key={item.id} href={`/items/${item.id}`}
                        className="flex gap-3 items-center hover:bg-dark-bg p-2 rounded-lg transition">
                        <div className="w-12 h-12 bg-dark-bg rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                          {img ? <img src={img} className="w-full h-full object-cover" /> : '💍'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-gray-light text-xs">${Number(item.expectedPrice).toLocaleString()}</p>
                        </div>
                        <span className="text-gold text-xs">→</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

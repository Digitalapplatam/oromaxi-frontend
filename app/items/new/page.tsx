'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { itemsAPI } from '@/lib/api';

const CATEGORIES = ['ORO', 'JOYERIA', 'RELOJERIA'];
const CONDITIONS = ['excellent', 'very_good', 'good', 'fair'];
const CONDITION_LABELS: Record<string, string> = {
  excellent: 'Excelente',
  very_good: 'Muy bueno',
  good: 'Bueno',
  fair: 'Regular',
};
const MATERIALS = ['Oro', 'Plata', 'Platino', 'Oro blanco', 'Oro rosado'];
const PURITIES = ['10K', '14K', '18K', '20K', '22K', '24K'];
const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Machala'];
const SALE_TYPES = [
  { value: 'definitive', label: 'Venta definitiva', desc: 'Vendo y transfiero la propiedad' },
  { value: 'buyback', label: 'Venta con recompra', desc: 'Vendo pero puedo recuperarla después' },
  { value: 'auction', label: 'Subasta', desc: 'Los compradores compiten por el mejor precio' },
];

export default function NewItemPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'JOYERIA',
    material: 'Oro',
    purity: '18K',
    weight: '',
    brand: '',
    condition: 'good',
    expectedPrice: '',
    minAcceptable: '',
    saleType: 'definitive',
    city: 'Quito',
    images: [] as string[],
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'oromaxi_unsigned');
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dotxq0u1n';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm((f) => ({ ...f, images: [...f.images, data.secure_url] }));
      }
    } catch {
      setError('Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-light mb-4">Debes iniciar sesión para publicar</p>
          <Link href="/login" className="px-6 py-3 bg-gold text-dark-bg font-bold rounded-lg">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        material: form.material,
        purity: form.purity,
        weight: parseFloat(form.weight) || 0,
        brand: form.brand || undefined,
        condition: form.condition,
        expectedPrice: parseFloat(form.expectedPrice) || 0,
        minAcceptable: form.minAcceptable ? parseFloat(form.minAcceptable) : undefined,
        saleType: form.saleType,
        city: form.city,
        images: form.images,
      };
      const res = await itemsAPI.create(payload);
      const itemId = res.data?.item?.id || res.data?.id;
      if (itemId) {
        router.push(`/items/${itemId}`);
      } else {
        router.push('/dashboard/seller');
      }
    } catch (err: any) {
      const errData = err.response?.data?.error;
      if (Array.isArray(errData)) {
        setError(errData.map((e: any) => e.message).join(', '));
      } else {
        setError(errData || err.response?.data?.message || 'Error al publicar');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-gray-dark bg-dark-bg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <Link href="/dashboard/seller" className="text-gray-light hover:text-gold text-sm">
            ← Mi dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Publicar artículo</h1>
        <p className="text-gray-light mb-8">Completa los datos de tu joya o reloj</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Tipo de venta */}
          <div>
            <label className="block text-sm text-gray-light mb-3">Tipo de venta</label>
            <div className="grid grid-cols-1 gap-3">
              {SALE_TYPES.map((st) => (
                <button key={st.value} type="button" onClick={() => set('saleType', st.value)}
                  className={`p-4 rounded-lg border text-left transition ${form.saleType === st.value ? 'border-gold bg-gold/10' : 'border-gray-dark hover:border-gold/50'}`}>
                  <div className={`font-semibold ${form.saleType === st.value ? 'text-gold' : 'text-white'}`}>{st.label}</div>
                  <div className="text-gray-light text-sm mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Datos básicos */}
          <div className="bg-gray-dark rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Información del artículo</h2>

            <div>
              <label className="block text-sm text-gray-light mb-1">Título * (mín. 5 caracteres)</label>
              <input required minLength={5} value={form.title} onChange={(e) => set('title', e.target.value)}
                className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                placeholder="Ej: Anillo de oro 18K con diamante" />
            </div>

            <div>
              <label className="block text-sm text-gray-light mb-1">Descripción * (mín. 10 caracteres)</label>
              <textarea required minLength={10} value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={3} className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold resize-none"
                placeholder="Describe tu artículo, historia, estado, detalles especiales..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-light mb-1">Categoría</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-light mb-1">Estado</label>
                <select value={form.condition} onChange={(e) => set('condition', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold">
                  {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-light mb-1">Material *</label>
                <select value={form.material} onChange={(e) => set('material', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold">
                  {MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-light mb-1">Kilates</label>
                <select value={form.purity} onChange={(e) => set('purity', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold">
                  {PURITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-light mb-1">Peso (g) *</label>
                <input required type="number" step="0.01" min="0.01" value={form.weight} onChange={(e) => set('weight', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-gray-dark rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Fotos del artículo</h2>
            <div className="grid grid-cols-3 gap-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                </div>
              ))}
              {form.images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-dark hover:border-gold cursor-pointer flex flex-col items-center justify-center text-gray-light hover:text-gold transition">
                  {uploadingImage ? <span className="text-xs">Subiendo...</span> : (
                    <><span className="text-2xl">+</span><span className="text-xs mt-1">Agregar foto</span></>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>
          </div>

          {/* Precios */}
          <div className="bg-gray-dark rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Precios</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-light mb-1">Precio esperado ($) *</label>
                <input required type="number" step="0.01" min="0.01" value={form.expectedPrice} onChange={(e) => set('expectedPrice', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm text-gray-light mb-1">Mínimo aceptable ($)</label>
                <input type="number" step="0.01" min="0.01" value={form.minAcceptable} onChange={(e) => set('minAcceptable', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm text-gray-light mb-1">Ciudad</label>
            <select value={form.city} onChange={(e) => set('city', e.target.value)}
              className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gold text-dark-bg font-bold py-4 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 text-lg">
            {loading ? 'Publicando...' : 'Publicar artículo'}
          </button>
        </form>
      </div>
    </div>
  );
}

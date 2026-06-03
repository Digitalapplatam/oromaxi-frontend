'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import ThemeToggle from '@/components/ThemeToggle';

const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Machala'];
const DOC_TYPES = ['Cédula', 'Pasaporte', 'RUC'];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [role, setRole] = useState<'cliente' | 'joyeria' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cliente
  const [clienteForm, setClienteForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', city: 'Quito', docType: 'Cédula', docNumber: '',
  });

  // Joyería
  const [joyeriaForm, setJoyeriaForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', city: 'Quito',
    businessName: '', ruc: '', address: '',
  });

  const handleClienteSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.signup({
        firstName: clienteForm.firstName,
        lastName: clienteForm.lastName,
        email: clienteForm.email,
        password: clienteForm.password,
        phone: clienteForm.phone,
        city: clienteForm.city,
        state: clienteForm.city,
        role: 'user',
        idDocument: clienteForm.docNumber,
        idType: clienteForm.docType,
      });
      login(res.data.user, res.data.token);
      router.push('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  const handleJoyeriaSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.signup({
        firstName: joyeriaForm.firstName,
        lastName: joyeriaForm.lastName,
        email: joyeriaForm.email,
        password: joyeriaForm.password,
        phone: joyeriaForm.phone,
        city: joyeriaForm.city,
        state: joyeriaForm.city,
        role: 'jewelry',
        idDocument: joyeriaForm.ruc,
        idType: 'RUC',
      });
      login(res.data.user, res.data.token);
      router.push('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  const setC = (k: string, v: string) => setClienteForm(f => ({ ...f, [k]: v }));
  const setJ = (k: string, v: string) => setJoyeriaForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4"><ThemeToggle /></div>
          <Link href="/" className="text-3xl font-bold">
            <span className="text-gold">ORO</span><span className="text-white">MAXI</span>
          </Link>
          <p className="text-gray-light mt-2">Crea tu cuenta gratuita</p>
        </div>

        {/* Selección de tipo */}
        {!role && (
          <div className="space-y-4">
            <p className="text-white text-center font-semibold mb-6">¿Cómo vas a usar OROMAXI?</p>
            <button onClick={() => setRole('cliente')}
              className="w-full p-5 bg-gray-dark border border-gray-dark rounded-xl text-left hover:border-gold transition group">
              <div className="flex items-center gap-4">
                <span className="text-3xl">👤</span>
                <div>
                  <p className="text-white font-bold group-hover:text-gold transition">Cliente</p>
                  <p className="text-gray-light text-sm mt-1">Compra joyas en venta directa o participa en subastas. Regístrate con tu cédula o pasaporte.</p>
                </div>
              </div>
            </button>
            <button onClick={() => setRole('joyeria')}
              className="w-full p-5 bg-gray-dark border border-gray-dark rounded-xl text-left hover:border-gold transition group">
              <div className="flex items-center gap-4">
                <span className="text-3xl">💎</span>
                <div>
                  <p className="text-white font-bold group-hover:text-gold transition">Joyería / Empresa</p>
                  <p className="text-gray-light text-sm mt-1">Publica catálogos, vende y compra artículos de usuarios. Requiere RUC empresarial.</p>
                </div>
              </div>
            </button>
            <p className="text-center text-gray-light text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-gold hover:underline">Ingresar</Link>
            </p>
          </div>
        )}

        {/* Formulario Cliente */}
        {role === 'cliente' && (
          <div className="bg-gray-dark rounded-xl p-6 border border-gray-dark">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setRole(null)} className="text-gray-light hover:text-gold text-sm">← Volver</button>
              <h2 className="text-white font-bold">Registro como Cliente</h2>
            </div>
            <form onSubmit={handleClienteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-light mb-1">Nombre *</label>
                  <input required value={clienteForm.firstName} onChange={e => setC('firstName', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="Juan" />
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Apellido *</label>
                  <input required value={clienteForm.lastName} onChange={e => setC('lastName', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="Pérez" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-light mb-1">Correo electrónico *</label>
                <input required type="email" value={clienteForm.email} onChange={e => setC('email', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                  placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-light mb-1">Contraseña * (mín. 6 caracteres)</label>
                <input required type="password" minLength={6} value={clienteForm.password} onChange={e => setC('password', e.target.value)}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                  placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-light mb-1">Teléfono</label>
                  <input value={clienteForm.phone} onChange={e => setC('phone', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="+593..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Ciudad *</label>
                  <select required value={clienteForm.city} onChange={e => setC('city', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-light mb-1">Tipo de documento *</label>
                  <select required value={clienteForm.docType} onChange={e => setC('docType', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                    {DOC_TYPES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Número *</label>
                  <input required value={clienteForm.docNumber} onChange={e => setC('docNumber', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="1234567890" />
                </div>
              </div>
              {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          </div>
        )}

        {/* Formulario Joyería */}
        {role === 'joyeria' && (
          <div className="bg-gray-dark rounded-xl p-6 border border-gray-dark">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setRole(null)} className="text-gray-light hover:text-gold text-sm">← Volver</button>
              <h2 className="text-white font-bold">Registro como Joyería</h2>
            </div>
            <form onSubmit={handleJoyeriaSubmit} className="space-y-4">
              <div className="border border-gold/20 rounded-lg p-4 bg-gold/5 space-y-3">
                <p className="text-gold text-xs font-bold uppercase tracking-wide">Datos empresariales</p>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Nombre de la joyería *</label>
                  <input required value={joyeriaForm.businessName} onChange={e => setJ('businessName', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="Joyería La Perla S.A." />
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">RUC *</label>
                  <input required value={joyeriaForm.ruc} onChange={e => setJ('ruc', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="1234567890001" maxLength={13} />
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Dirección *</label>
                  <input required value={joyeriaForm.address} onChange={e => setJ('address', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="Av. Principal 123" />
                </div>
              </div>

              <div className="border border-gray-dark rounded-lg p-4 space-y-3">
                <p className="text-gray-light text-xs font-bold uppercase tracking-wide">Datos del representante</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-light mb-1">Nombre *</label>
                    <input required value={joyeriaForm.firstName} onChange={e => setJ('firstName', e.target.value)}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                      placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-light mb-1">Apellido *</label>
                    <input required value={joyeriaForm.lastName} onChange={e => setJ('lastName', e.target.value)}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                      placeholder="Pérez" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Correo *</label>
                  <input required type="email" value={joyeriaForm.email} onChange={e => setJ('email', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="contacto@joyeria.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-light mb-1">Contraseña * (mín. 6 caracteres)</label>
                  <input required type="password" minLength={6} value={joyeriaForm.password} onChange={e => setJ('password', e.target.value)}
                    className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                    placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-light mb-1">Teléfono</label>
                    <input value={joyeriaForm.phone} onChange={e => setJ('phone', e.target.value)}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold"
                      placeholder="+593..." />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-light mb-1">Ciudad *</label>
                    <select required value={joyeriaForm.city} onChange={e => setJ('city', e.target.value)}
                      className="w-full bg-dark-bg border border-gray-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-3 py-2 rounded-lg text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50">
                {loading ? 'Creando cuenta...' : 'Registrar joyería'}
              </button>
            </form>
          </div>
        )}

        {role && (
          <p className="text-center text-gray-light mt-4 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-gold hover:underline">Ingresar</Link>
          </p>
        )}
      </div>
    </div>
  );
}

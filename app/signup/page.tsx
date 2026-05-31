'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'BUYER',
    state: 'Pichincha',
    city: 'Quito',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.signup(form);
      login(res.data.user, res.data.token);
      router.push('/dashboard/seller');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-gold">ORO</span>
            <span className="text-white">MAXI</span>
          </Link>
          <p className="text-gray-light mt-2">Crea tu cuenta gratuita</p>
        </div>

        {/* Card */}
        <div className="bg-gray-dark rounded-xl p-8 border border-gray-dark">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-light mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-light mb-1">Apellido</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-light mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-light mb-1">Contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-dark-bg border border-gray-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-light mb-2">¿Cómo vas a usar OROMAXI?</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'BUYER', label: 'Comprador', desc: 'Quiero comprar joyas y oro' },
                  { value: 'SELLER', label: 'Vendedor', desc: 'Quiero vender mis joyas' },
                  { value: 'BOTH', label: 'Ambos', desc: 'Comprar y vender' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`p-3 rounded-lg border text-left transition ${
                      form.role === opt.value
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gray-dark text-gray-light hover:border-gold/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs mt-1 opacity-70">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark-bg font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-gray-light mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-gold hover:underline">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

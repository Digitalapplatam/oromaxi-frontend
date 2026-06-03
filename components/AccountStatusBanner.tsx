'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

export default function AccountStatusBanner() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || !user) return null;

  if (user.isVerified) return null;

  return (
    <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex items-start gap-3">
        <span className="text-yellow-400 text-xl shrink-0">⏳</span>
        <div>
          <p className="text-yellow-400 font-semibold text-sm">Cuenta pendiente de verificación</p>
          <p className="text-yellow-200/70 text-xs mt-1">
            Puedes explorar la plataforma y ver ofertas, pero necesitas verificar tu documentación para realizar compras.
            Nuestro equipo revisará tus datos en máximo 24 horas.
          </p>
        </div>
      </div>
      <Link href="/perfil"
        className="shrink-0 px-4 py-2 bg-yellow-600 text-white text-xs font-bold rounded-lg hover:bg-yellow-500 transition">
        Ver mi perfil
      </Link>
    </div>
  );
}

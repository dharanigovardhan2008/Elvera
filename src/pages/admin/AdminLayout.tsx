import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Boxes, BarChart3, Users } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { user, loading, isAdmin } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-sm font-medium text-zinc-600">Loading admin panel...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 text-center max-w-md shadow-sm">
          <h2 className="text-2xl font-bold text-text mb-3">Access Denied</h2>
          <p className="text-zinc-500 leading-7">
            You are logged in, but your account does not have admin access.
          </p>
        </div>
      </div>
    );
  }

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Combos', path: '/admin/combos', icon: Boxes },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white border border-zinc-200 rounded-3xl p-4 h-fit sticky top-28">
            <div className="mb-6 px-2">
              <h2 className="text-xl font-serif font-bold text-text">Admin Panel</h2>
              <p className="text-sm text-zinc-500 mt-1">Manage ELVERA</p>
            </div>

            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-black text-white'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

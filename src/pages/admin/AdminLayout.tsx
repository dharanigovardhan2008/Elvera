import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wider">ELVERA ADMIN</h1>
          <p className="text-gray-600 mt-2">Management Dashboard</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

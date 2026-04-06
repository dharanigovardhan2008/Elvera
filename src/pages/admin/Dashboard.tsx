export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600">Total Combos</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600">Total Clicks</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
      <p className="text-gray-500">Admin panel coming soon...</p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface UserItem {
  id: string;
  email?: string;
  displayName?: string;
  uid?: string;
  createdAt?: any;
  lastLogin?: any;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [adminIds, setAdminIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const adminsSnapshot = await getDocs(collection(db, 'admins'));

        const adminDocIds = adminsSnapshot.docs.map((doc) => doc.id);
        setAdminIds(adminDocIds);

        const usersList: UserItem[] = usersSnapshot.docs.map((doc) => {
          const data = doc.data() as any;

          return {
            id: doc.id,
            uid: data.uid || doc.id,
            email: data.email || '',
            displayName: data.displayName || '',
            createdAt: data.createdAt || null,
            lastLogin: data.lastLogin || null,
          };
        });

        console.log('USERS LIST:', usersList);
        console.log('ADMIN IDS:', adminDocIds);

        setUsers(usersList);
      } catch (err: any) {
        console.error('Error loading users:', err);
        setError(err?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const formatDate = (timestamp: any) => {
    try {
      if (!timestamp) return 'N/A';
      if (timestamp.toDate) return timestamp.toDate().toLocaleString();
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text">Users</h1>
        <p className="text-zinc-500 mt-1">View registered users and admin access</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading users...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500">
            Error: {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">No users found</div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {users.map((user) => {
              const isAdmin = adminIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-text">
                      {user.displayName || 'Unnamed User'}
                    </p>
                    <p className="text-sm text-zinc-500 break-all">
                      {user.email || 'No email'}
                    </p>
                    <div className="mt-2 text-xs text-zinc-400 space-y-1">
                      <p>UID: {user.uid}</p>
                      <p>Created: {formatDate(user.createdAt)}</p>
                      <p>Last Login: {formatDate(user.lastLogin)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isAdmin ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

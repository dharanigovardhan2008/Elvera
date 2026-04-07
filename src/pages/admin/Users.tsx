import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface UserItem {
  id: string;
  email?: string;
  displayName?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminIds, setAdminIds] = useState<string[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const adminsSnapshot = await getDocs(collection(db, 'admins'));

        const admins = adminsSnapshot.docs.map((doc) => doc.id);
        setAdminIds(admins);

        const list: UserItem[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<UserItem, 'id'>),
        }));

        setUsers(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text">Users</h1>
        <p className="text-zinc-500 mt-1">View registered users and admin access</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-zinc-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">No users found</div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {users.map((user) => {
              const isAdmin = adminIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-text">
                      {user.displayName || 'Unnamed User'}
                    </p>
                    <p className="text-sm text-zinc-500">{user.email || 'No email'}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isAdmin
                          ? 'bg-black text-white'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {isAdmin ? 'Admin' : 'User'}
                    </span>

                    <span className="text-xs text-zinc-400 break-all">{user.id}</span>
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

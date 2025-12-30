'use client';

import { GetAllUsers } from '@/app/api/Functions/GetUser';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    try {
      const res = await GetAllUsers();
      setUsers(res.data); // ✅ only users array
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border p-2 rounded">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Users;

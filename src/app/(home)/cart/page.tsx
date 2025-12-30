'use client'
import { GetUser } from '@/app/api/Functions/GetUser';
import Cart from '@/components/Home/Cart/Cart';
import { Button } from '@/components/ui/button';
import  { useEffect, useState } from 'react'

const Page = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const u = await GetUser();
      setUser(u);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      {user ? (
        <Cart/>
      ) : (
        <Button onClick={() => (window.location.href = "/login")}>
          Please Login
        </Button>
      )}
    </div>
  );
};

export default Page
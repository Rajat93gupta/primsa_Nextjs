'use client'
import { GetUser } from '@/app/api/Functions/GetUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'

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
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Welcome, {user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is your dashboard or content card.</p>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => (window.location.href = "/login")}>
          Please Login
        </Button>
      )}
    </div>
  );
};

export default Page
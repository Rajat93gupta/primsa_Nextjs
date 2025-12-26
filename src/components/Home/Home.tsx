"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const HomePage = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");

      if (!res.ok) throw new Error("Failed to fetch products");

      const jsonData = await res.json();
      setData(jsonData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white grid grid-cols-3 gap-4 p-4">
      {data.map((item) => (
        <div key={item.id} className="border p-3 rounded">
          <h1 className="font-bold">{item.title}</h1>
          <p>{item.description}</p>
          <p className="font-semibold">₹{item.price}</p>
          <Image src={item.image} alt={item.title} width={100} height={100} />
        </div>
      ))}
    </div>
  );
};

export default HomePage;

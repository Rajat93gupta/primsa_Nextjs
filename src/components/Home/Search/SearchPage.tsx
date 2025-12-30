"use client";

import { GetAllProducts } from "@/app/api/Functions/GetProducts";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const filterData = async () => {
      setLoading(true);
      try {
        const resp: Product[] = await GetAllProducts();

        const filtered = resp.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    filterData();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-6">
        {/* Left Filter Sidebar */}
        <div className="w-60 border p-3 rounded">
          <p className="font-semibold">Filters</p>
        </div>

        {/* Search Results */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold mb-4">
            Search results for {query}
          </h1>

          {loading && <p>Loading...</p>}

          {!loading && filteredData.length === 0 && (
            <p>No products found</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <div key={item.id} className="border p-4 rounded">
                <Image
                  src={item.image}
                  width={200}
                    height={200}
                  alt={item.title}
                  className="h-40 w-full object-contain"
                />
                <h2 className="font-medium mt-2">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

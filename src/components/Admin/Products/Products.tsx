"use client";

import { GetAllProducts } from "@/app/api/Functions/GetProducts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 1. Define the Product interface to fix TypeScript errors
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

const Products = () => {
  // 2. Initialize state with the Product type
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await GetAllProducts();
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadError("");

      const res = await fetch("/api/uploadProduct", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Refresh product list after successful upload
      fetchProducts();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  // 3. Handle Loading and Error states in the UI
  if (loading)
    return <div className="p-10 text-center">Loading products...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center border-b pb-5">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="w-full max-w-xs">
          <Label htmlFor="picture">Upload products</Label>
          <Input
            id="picture"
            type="file"
            accept=".xlsx,.xls"
            className="mt-2"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-blue-500 mt-2">Uploading products...</p>
          )}

          {uploadError && (
            <p className="text-sm text-red-500 mt-2">{uploadError}</p>
          )}
        </div>
      </div>
      <Table>
        <TableCaption>A list of fetched products from your API.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="text-right">Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id}</TableCell>
              <TableCell className="max-w-50 truncate">
                {product.title}
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="hidden md:table-cell max-w-100 text-muted-foreground truncate">
                {product.description}
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="relative h-12 w-12 border rounded-md overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Items</TableCell>
            <TableCell className="text-right font-bold">
              {data.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Products;

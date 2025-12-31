"use client";

import { GetAllProducts } from "@/app/api/Functions/GetProducts";
import Image from "next/image";
import { useEffect, useState } from "react";

import Link from "next/link";
import MyCarousel from "./Slider/Slider";
import ProductCard from "./ProductCard/ProductCard";

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
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <MyCarousel/>
    <div>
      <h1 className="text-2xl font-bold text-center mt-6">Welcome to Our Store!</h1>
      <p className="text-center text-gray-600 ">
        Discover a wide range of products at unbeatable prices. Shop now and enjoy exclusive deals!
      </p>
    </div>
    <div className="container gap-8 items-center my-6 justify-center flex mx-auto">
      {
        [1,2,3,4,5,6].map((item, index)=>(
          <div key={index} className="flex text-center w-fit flex-col gap-2">
        <div className="h-50 w-50 flex rounded-full border-4 items-center justify-center  border-gray-30">
        {index+1}
      </div>
      <span className="">Food</span>
      </div>
        ))
      }

    </div>

    <div>
      <h1 className="text-2xl font-bold text-center underline my-2">Products</h1>
    </div>
      
    <div className=" gap-4 grid grid-cols-4 my-4 ">


       
      {data.map((item) => (
        <Link key={item.id} href={`/home/${item.title}?id=${item.id}`}>
          <ProductCard product={item} />
        {/* <div  className="border p-3 rounded">
          <h1 className="font-bold">{item.title}</h1>
          <p>{item.description}</p>
          <p className="font-semibold">₹{item.price}</p>
          <Image src={item.image} alt={item.title} width={100} height={100} />
        </div> */}
        </Link>
      ))}
    </div>
    
    </>

  );
};

export default HomePage;

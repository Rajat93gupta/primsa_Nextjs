import Image from "next/image";
import React from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="max-w-sm bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
      <div className=" ">
        <a href="#">
          <div className="relative h-50 mx-auto w-50">
            <Image
              fill
              priority
              className="rounded-t-lg p-8"
              src={product.image}
              alt={product.title}
            />
          </div>
        </a>
        <div className="px-5  flex  justify-between w-fulltext-start pb-5">
          <a href="#">
            <h3 className="text-gray-900 font-semibold text-base tracking-tight dark:text-white">
              {product.title}
            </h3>
          </a>

          <div className="  text-right ">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

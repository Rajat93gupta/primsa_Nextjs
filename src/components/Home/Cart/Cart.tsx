/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { GetUser } from "@/app/api/Functions/GetUser";
import { useCart } from "@/Context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const { removeFromCart, updateQuantity } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart from API
  useEffect(() => {
    const GetCart = async () => {
      try {
        const resp = await GetUser();
        const items: CartItem[] = resp.cart.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          title: item.product.title,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity,
        }));
        setCartItems(items);
      } catch (err) {
        console.error(err);
      }
    };
    GetCart();
  }, []);

  // Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleQuantityChange = async (productId: number, newQty: number) => {
    try {
      await updateQuantity(productId, newQty);
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Handle remove item
  const handleRemove = async (productId: number) => {
    try {
      await removeFromCart(productId);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  const router = useRouter();

 const handleCheckout = async () => {
  const amountInPaise = Math.round(total * 100); // total is in rupees, convert to paise
  router.push(`/checkout?amount=${amountInPaise}`);
};

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto bg-white p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-gray-100 p-6 rounded-md">
            <h3 className="text-lg font-semibold text-slate-900">Your Cart</h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <div className="sm:space-y-6 space-y-8">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid sm:grid-cols-3 items-center gap-4"
                  >
                    <div className="sm:col-span-2 flex sm:items-center max-sm:flex-col gap-6">
                      <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                        <Image
                          width={100}
                          height={100}
                          src={item.image}
                          className="w-full h-full object-contain"
                          alt={item.title}
                        />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <h6
                          onClick={() => handleRemove(item.productId)}
                          className="text-xs font-medium text-red-500 cursor-pointer mt-1"
                        >
                          Remove
                        </h6>
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center px-2.5 py-1.5 border border-gray-300 text-slate-900 text-xs rounded-md">
                            <span
                              className="cursor-pointer"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              -
                            </span>
                            <span className="mx-3">{item.quantity}</span>
                            <span
                              className="cursor-pointer"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <h4 className="text-[15px] font-semibold text-slate-900">
                        ₹{item.price * item.quantity}
                      </h4>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-100 rounded-md p-6 md:sticky top-0 h-max">
            <h3 className="text-lg font-semibold text-slate-900">
              Order details
            </h3>
            <hr className="border-gray-300 mt-4 mb-8" />

            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm">
                Discount{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  $0.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  $2.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax{" "}
                <span className="ml-auto text-slate-900 font-semibold">
                  $4.00
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total <span className="ml-auto font-semibold">₹{total}</span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleCheckout}
                className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
              >
                Checkout
              </button>
              <button className="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-transparent text-slate-900 border border-gray-300 rounded-md cursor-pointer">
                Continue Shopping
              </button>
            </div>

            <div className="mt-6">
              <p className="text-slate-900 text-sm font-medium mb-2">
                Do you have a promo code?
              </p>
              <div className="flex border border-blue-600 overflow-hidden rounded-md">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="w-full outline-0 bg-white text-slate-600 text-sm px-4 py-2.5"
                />
                <button className="flex items-center justify-center font-medium tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white cursor-pointer">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Cart;

"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/Context/AuthContext";
import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [query, setQuery] = useState("");
  console.log(user, "user");
  const router = useRouter();
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="h-16 flex items-center justify-center bg-primary/50  shadow-md">
      <div className="flex items-center justify-between w-full px-10">
        <Link href="/home" className="flex-1">
          <h1 className="text-2xl font-bold">MyStore</h1>
        </Link>
        {/* Search */}
        <div className=" flex-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            type="Search"
            placeholder="Search"
            className="w-full"
          />
        </div>
        <div className="flex gap-3 flex-1 justify-end items-center">
          {!loading &&
            (user ? (
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ))}
          <Link href="/cart">
            <Button className="cursor-pointer">Cart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

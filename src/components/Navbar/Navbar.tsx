"use client";

import Link from "next/link";
import { useAuth } from "@/Context/AuthContext";
import { Input } from "../ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [query, setQuery] = useState("");
  // console.log(user, "user");
  const router = useRouter();
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className=" py-4 px-16 flex items-center justify-center bg-white sticky z-50 top-0 shadow-md">
      <div className="flex container items-center justify-between w-full px-10">
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
          <Link href="/cart">
            <Button className="cursor-pointer w-10 h-10 rounded-full relative mr-2">
              <ShoppingCart size={16} />
              <span className="rounded-full -top-0.5 text-xs font-medium -right-1.25 bg-red-300 absolute items-center justify-center h-5 w-5 inline-flex">
                0
              </span>
            </Button>
          </Link>
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-10 cursor-pointer rounded-full"
                  >
                    P
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                    <Link href="/order">
                      <DropdownMenuItem className="cursor-pointer">
                        My Orders
                        {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      Settings
                      {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="cursor-pointer">Login</Button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

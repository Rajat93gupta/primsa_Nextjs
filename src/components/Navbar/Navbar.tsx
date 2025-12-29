"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/Context/AuthContext";
import { Input } from "../ui/input";

// const navigationMenuItems = [
//   { title: "Home", href: "#" },
//   { title: "Blog", href: "#blog" },
//   { title: "Docs", href: "#docs" },
// ];
const Navbar = () => {
  const { user, logout, loading } = useAuth();
  console.log(user, "user");

  return (
    <div className="h-16 flex items-center justify-center bg-primary/50  shadow-md">
      <div className="flex items-center justify-between w-full px-10">
        <h1 className="text-2xl font-bold flex-1">MyStore</h1>
        {/* <NavigationMenu>
          <NavigationMenuList>
            {navigationMenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu> */}
        {/* Search */}
        <div className=" flex-2">
          <Input type="Search" placeholder="Search" className="w-full" />


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

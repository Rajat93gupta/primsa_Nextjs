"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Package, Users } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Users",
    href: "/admin",
    icon: Users,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300
        ${open ? "w-64" : "w-16"}`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {open && <h2 className="text-lg font-bold">Admin</h2>}
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded hover:bg-gray-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MENU */}
        <div className="">
            <nav className="mt-4 space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <button onClick={()=>logout()} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
            Logout
          </button>
        </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}

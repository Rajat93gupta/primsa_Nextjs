import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import AddProductDialog from "../Home/AddProductDiloge";

const navigationMenuItems = [
  { title: "Home", href: "#" },
  { title: "Blog", href: "#blog" },
  { title: "Docs", href: "#docs" },
];
const Navbar = () => {
  return (
    <div className="h-16 flex items-center justify-center bg-primary/50  shadow-md">
      <div className="flex items-center justify-between w-full px-10">
        <h1 className="text-2xl font-bold">MyStore</h1>
        <NavigationMenu>
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
        </NavigationMenu>
          <AddProductDialog/>
      </div>
    </div>
  );
};

export default Navbar;

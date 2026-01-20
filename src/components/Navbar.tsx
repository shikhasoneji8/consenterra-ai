import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/ConsenTerra_Logo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";

const solutions = [
  {
    title: "PriXplainer",
    description: "Understand before you consent.",
    href: "/solutions/prixplainer",
  },
  {
    title: "FoundrFATE",
    description: "Founder success shouldn't feel like luck.",
    href: "/solutions/foundrfate",
  },
  {
    title: "TrustEarthy",
    description: "Small swaps. Real impact.",
    href: "/solutions/trusteartthy",
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Solutions", href: "/solutions", hasDropdown: true },
  { name: "Extension", href: "/extension" },
  { name: "Career", href: "/career" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full glass-strong"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <nav className="section-container flex h-16 items-center justify-between">
        {/* Logo + Text */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={logo}
            alt="ConsenTerra"
            className="h-9 w-9"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            ConsenTerra
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <NavigationMenuItem key={link.name}>
                    <div className="flex items-center">
                      <Link
                        to={link.href}
                        className={cn(
                          "relative inline-flex h-10 items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-normal transition-colors hover:text-primary whitespace-nowrap group",
                          isActive(link.href) && "text-primary"
                        )}
                      >
                        <span className="hidden sm:inline">{link.name}</span>
                        <span className="sm:hidden">Solutions</span>
                        {/* Animated underline */}
                        <motion.span
                          className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                      <NavigationMenuTrigger
                        className={cn(
                          "bg-transparent hover:bg-transparent hover:text-primary text-sm font-normal px-0 sm:px-1 h-10",
                          isActive(link.href) && "text-primary"
                        )}
                      >
                        <span className="sr-only">Open solutions menu</span>
                      </NavigationMenuTrigger>
                    </div>
                    <NavigationMenuContent>
                      <ul className="w-[280px] p-2 bg-popover border border-border rounded-lg shadow-xl backdrop-blur-xl">
                        {solutions.map((solution, index) => (
                          <motion.li
                            key={solution.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <NavigationMenuLink asChild>
                              <Link
                                to={solution.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-secondary group"
                              >
                                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                  {solution.title}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {solution.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </motion.li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        "relative inline-flex h-10 items-center justify-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal transition-colors hover:text-primary whitespace-nowrap group",
                        isActive(link.href) && "text-primary"
                      )}
                    >
                      <span className="hidden md:inline">{link.name}</span>
                      <span className="md:hidden">
                        {link.name === "Privacy Policy"
                          ? "Privacy"
                          : link.name === "About Us"
                          ? "About"
                          : link.name}
                      </span>
                      {/* Animated underline */}
                      <motion.span
                        className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
                        initial={{ scaleX: isActive(link.href) ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Menu */}
          <UserMenu />
        </div>
      </nav>
    </motion.header>
  );
}
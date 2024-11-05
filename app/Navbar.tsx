"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { Box } from "@radix-ui/themes";
const Navbar = () => {
  const currentPath = usePathname(); // this hook comes with Next.js that allows us to get the current-path path-name
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  const { status, data: session } = useSession();
  
  return (
    <nav className="flex items-center gap-x-5 p-5 mb-5 h-14 border">
      <Link href={"/"}>
        <AiFillBug />
      </Link>
      <ul className="flex gap-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classnames({
                "text-zinc-500": currentPath !== link.href,
                "text-zinc-900": currentPath === link.href,
                " hover:text-zinc-900 transition-colors": true,
              })}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        {status === "authenticated" && (
          <Link href={"/api/auth/signout"}>Log out</Link>
        )}
        {status === "unauthenticated" && (
          <Link href={"/api/auth/signin"}>Log in</Link>
        )}
      </Box>
    </nav>
  );
};

export default Navbar;

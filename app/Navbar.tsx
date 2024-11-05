"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
const Navbar = () => {
  const currentPath = usePathname(); // this hook comes with Next.js that allows us to get the current-path path-name
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  const { status, data: session } = useSession();

  return (
    <nav className=" border-b mb-5 px-5 py-5">
      <Container>
        <Flex justify={"between"}>
          <Flex gap={"3"} align={"center"}>
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
          </Flex>
          <Flex>
            <Box>
              {status === "authenticated" && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Avatar
                      src={session.user?.image!}
                      fallback="?"
                      radius="full"
                      className="cursor-pointer"
                    />
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content >
                    <DropdownMenu.Label>
                      <Text size={"2"}>{session.user?.email}</Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Item>
                      <Link href={"/api/auth/signout"}>Log out</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
              {status === "unauthenticated" && (
                <Link href={"/api/auth/signin"}>Log in</Link>
              )}
            </Box>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// add "!" marks at the end of env parameters to tell TS we have values for those!

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma/client";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };

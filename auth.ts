import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { sanity } from "@/sanity/lib/sanity";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== 'string' || typeof password !== 'string') {
          return null;
        }

        const query = `
          *[_type == "user" && email == $email][0]{
            _id,
            email,
            username,
            password
          }
        `;

        const user = await sanity.fetch(query, { email });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return {
          id: user._id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
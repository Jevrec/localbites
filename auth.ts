import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { sanity } from "@/sanity/lib/sanity";
import Google from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
            password,
            role
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
          role: user.role || "user"
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
    async signIn({ user, account, profile }) {
      
      if (account?.provider === "google") {
        try {
          
          const existingUser = await sanity.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: user.email }
          );

          if (!existingUser) {
            await sanity.create({
              _type: "user",
              email: user.email,
              username: user.name || user.email?.split('@')[0],
              role: "user",
            });
          }
        } catch (error) {
          console.error("Error creating Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      
      if (account?.provider === "google") {
        const sanityUser = await sanity.fetch(
          `*[_type == "user" && email == $email][0]{ _id, role }`,
          { email: token.email }
        );
        if (sanityUser) {
          token.id = sanityUser._id;
          token.role = sanityUser.role || "user";
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});
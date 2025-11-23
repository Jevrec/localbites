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
          if (!credentials?.email || !credentials?.password) return null;
          
          const query = `
            *[_type == "user" && email == $email][0]{
              _id,
              email,
              username,
              password
            }
          `;
          
          const user = await sanity.fetch(query, {
            email: credentials.email as string,
          });
          
          if (!user) return null;
          
          const isValid = await bcrypt.compare(
            credentials.password as string, 
            user.password
          );
          
          if (!isValid) return null;
          
          return {
            id: user._id,
            email: user.email,
            name: user.username,
          };
        },
    }),
  ],

  session: {
    strategy: "jwt",
  },
});

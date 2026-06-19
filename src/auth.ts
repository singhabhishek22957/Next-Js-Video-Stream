import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { loginSchema } from "@/validations/auth.validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60,
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;
        await connectDB();

        const user = await User.findOne({
          email,
          active: true,
          isDeleted: false,
        });

        if (!user) {
          return null;
        }

        // Check lock
        if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
          return null;
        }

        const isValid = await user.comparePassword(password);

        if (!isValid) {
          return null;
        }

        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;
        user.lastSeen = new Date();
        user.online = true;
        await user.save();

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        session.user.name = token.name as string;

        session.user.email = token.email as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

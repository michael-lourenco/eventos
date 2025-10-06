import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface Token extends JWT {
  sub?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_OAUTH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CREDENTIALS_OAUTH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET!,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token }: { token: Token }) {
      return token;
    },
    async session({ session, token }: { session: Session; token: Token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
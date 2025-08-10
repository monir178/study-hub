import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { verifyPassword } from "@/lib/auth/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER" as const,
        };
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER" as const,
        };
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If user object exists (on sign-in), set the role
      if (user) {
        token.role = user.role;
      }

      // For OAuth providers, set default role if not exists
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
        session.user.role = token.role as "USER" | "MODERATOR" | "ADMIN";
      }
      return session;
    },
    async signIn({ user, account, profile: _profile }) {
      // For OAuth providers, handle account linking and image storage
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        if (!user.email) return false;

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this OAuth provider is already linked
            const existingAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider,
            );

            if (!existingAccount) {
              // Link the new OAuth account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token as string | null,
                  access_token: account.access_token as string | null,
                  expires_at: account.expires_at as number | null,
                  token_type: account.token_type as string | null,
                  scope: account.scope as string | null,
                  id_token: account.id_token as string | null,
                  session_state: account.session_state as string | null,
                },
              });
            }

            // Update existing user's image and email verification if they don't have a custom uploaded one
            const shouldUpdateImage = existingUser.imageSource !== "UPLOAD";
            const updateData: {
              image?: string;
              imageSource?: "GOOGLE" | "GITHUB";
              name?: string;
              emailVerified?: Date;
            } = {};

            if (shouldUpdateImage && user.image) {
              const imageSource =
                account.provider === "google" ? "GOOGLE" : "GITHUB";
              updateData.image = user.image;
              updateData.imageSource = imageSource;
              updateData.name = user.name || existingUser.name || undefined;
            }

            // Set emailVerified if not already set (OAuth emails are pre-verified)
            if (!existingUser.emailVerified) {
              updateData.emailVerified = new Date();
            }

            // Only update if we have data to update
            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { email: user.email },
                data: updateData,
              });
            }
          } else {
            // For new users created by PrismaAdapter, update image source and email verification
            setTimeout(async () => {
              try {
                const imageSource =
                  account.provider === "google" ? "GOOGLE" : "GITHUB";
                await prisma.user.update({
                  where: { email: user.email! },
                  data: {
                    imageSource: imageSource as "GOOGLE" | "GITHUB",
                    emailVerified: new Date(), // OAuth emails are pre-verified
                  },
                });
              } catch {}
            }, 100);
          }
        } catch {
          return false;
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
});

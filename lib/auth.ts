import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord") {
        try {
          await dbConnect();
          
          const discordProfile = profile as any;
          const discordId = user.id;
          
          // Verificar se o usuário já existe
          let existingUser = await User.findOne({ discordId });
          
          if (!existingUser) {
            // Criar novo usuário
            existingUser = await User.create({
              discordId: discordId || undefined,
              name: user.name || discordProfile.username,
              email: user.email || "",
              image: user.image || undefined,
              username: discordProfile.username,
              discriminator: discordProfile.discriminator,
              registroCompleto: false,
            });
          } else {
            // Atualizar apenas informações básicas do perfil, preservando dados do registro
            if (user.email) existingUser.email = user.email;
            if (user.image) existingUser.image = user.image;
            if (discordProfile.username) existingUser.username = discordProfile.username;
            if (discordProfile.discriminator) existingUser.discriminator = discordProfile.discriminator;
            // NÃO atualizar: registroCompleto, statusAprovacao, passaporte, cargo, contratadoPor
            await existingUser.save();
          }
          
          user.id = existingUser._id.toString();
        } catch (error) {
          console.error("Erro ao salvar usuário:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      if (account && profile) {
        token.accessToken = account.access_token;
        const discordProfile = profile as any;
        token.username = discordProfile.username;
        token.discriminator = discordProfile.discriminator;
        token.picture = discordProfile.image_url || discordProfile.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.discriminator = token.discriminator as string;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

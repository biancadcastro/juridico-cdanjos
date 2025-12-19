import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export const db = {
  user: {
    async findByEmail(email: string) {
      await dbConnect();
      return await User.findOne({ email });
    },
    async create(data: { name: string; email: string; password?: string; image?: string; discordId?: string }) {
      await dbConnect();
      return await User.create(data);
    },
    async findById(id: string) {
      await dbConnect();
      return await User.findById(id);
    },
  },
};

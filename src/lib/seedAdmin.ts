
import { User } from "@/models/user.model";

export async function seedAdmin() {
  try {
    const admin = await User.findOne({
        email: process.env.DEFAULT_ADMIN_EMAIL,
    });

    if (admin) {
      console.log("Admin already exists");
      return;
    }

    await User.create({
      name: "Administrator",
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
    });

    console.log("Default admin created");
  } catch (e:any) {
    // Another request created it first
    if (e?.code === 11000) {
      console.log("Admin already created by another process.");
      return;
    }

    throw e;
  }
}

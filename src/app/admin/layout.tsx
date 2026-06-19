

import AuthLayout from "@/layouts/auth.layout";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import {User} from "@/models/user.model";

export default  async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(
    session.user.id
  ).lean();

  if (
    !user ||
    !user.active ||
    user.isDeleted
  ) {
    redirect("/account-disabled");
  }
  return (
     <SessionProvider>
    <AuthLayout>
     {children}
    </AuthLayout>
    </SessionProvider>
  );
}

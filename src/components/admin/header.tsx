"use client";

import { logoutAction } from "@/features/auth/actions/userCRUD.action";
import ThemeToggle from "@/components/themeToggle";
import { useSession } from "next-auth/react";
import { FiLogOut, FiMenu } from "react-icons/fi";

interface AdminHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
}

export default function AdminHeader({
  open,
  setOpen,
}: AdminHeaderProps) {
  const {data:session} = useSession();
  const user = session?.user;
  async function handleLogout() {
    await logoutAction();
  }


  return (
    <header
      className="
        sticky top-0 z-40
        h-16
        px-4 md:px-6
        bg-surface
        border-b border-border
        flex items-center justify-between
        relative
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <button
          onClick={() => setOpen(!open)}
          className="
            lg:hidden
            h-10 w-10
            flex items-center justify-center
            rounded-lg
            border border-border
            bg-background
          "
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h3 className="font-semibold text-sm md:text-base">
            {user?.name || "Admin"}
          </h3>

          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Center */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-lg md:text-xl font-bold text-primary">
          StreamFlix Admin
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            bg-primary-foreground
            hover:bg-primary
            text-muted-foreground
            hover:opacity-90
            transition
          "
        >
          <FiLogOut />

          <span className="hidden sm:block">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}
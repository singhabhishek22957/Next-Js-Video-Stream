


"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/header";
import AdminSidebar from "@/components/admin/sidebar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: PublicLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen

        flex
        flex-col

        bg-background
        text-foreground
      "
    >
      {/* Header */}
      <AdminHeader
        open={open}
        setOpen={setOpen}
      />

      {/* Content */}
      <div className="flex flex-1">
        <AdminSidebar
          open={open}
          setOpen={setOpen}
        />

        <main
          className="
            flex-1

            overflow-y-auto

            bg-background

            p-4
            md:p-6
            lg:p-8
          "
        >
          {children}
        </main>
      </div>

    </div>
  );
}
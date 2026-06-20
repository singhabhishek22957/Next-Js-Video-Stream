
"use client";

import { useState } from "react";

import PublicHeader from "@/components/publicHeader";
import PublicSidebar from "@/components/publicSidebar";

import { SidebarMenuItem } from "@/types/sidebar";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

interface PublicLayoutClientProps {
  children: React.ReactNode;
  menuItems: SidebarMenuItem[];
}

export default function PublicLayoutClient({
  children,
  menuItems,
}: PublicLayoutClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className=" min-h-screen

        flex
        flex-col

        bg-background
        text-foreground">
      {/* Fixed Header */}
      <PublicHeader
        open={open}
        setOpen={setOpen}
      />

      {/* Body */}
      <div className="flex flex-1">
        <PublicSidebar
          open={open}
          setOpen={setOpen}
          menuItems={menuItems}
        />

        {/* Content Scroll Area */}
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
          <Footer />
        </main>
      </div>
    </div>
  );
}
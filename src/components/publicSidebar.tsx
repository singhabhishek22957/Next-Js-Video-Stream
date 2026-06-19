"use client";

import { Heart } from "lucide-react";

import { Sheet, SheetContent } from "./ui/sheet";
import MenuItems from "./menuItems";

import { SidebarMenuItem } from "@/types/sidebar";

interface PublicSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuItems: SidebarMenuItem[];
}

export default function PublicSidebar({
  open,
  setOpen,
  menuItems,
}: PublicSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          
          className="
            w-1/2
            p-0
            h-full
            bg-surface
            border-r
            border-border
          "
        >
          <div className="flex max-h-screen h-screen flex-col">
            {/* Header */}
            {/* <div
              className="
                h-16

                flex
                items-center

                px-6

                border-b
                border-border

                shrink-0
              "
            >
              <h1
                className="
                  text-2xl
                  font-bold

                  text-primary
                "
              >
                StreamFlix
              </h1>
            </div> */}

            {/* Scrollable Menu */}
            <div
              className="
                flex-1
                overflow-y-auto
              "
            >
              <MenuItems menuItems={menuItems} setOpen={setOpen} />
            </div>

            {/* Footer */}
            <div
              className="
                shrink-0

                border-t
                border-border

                px-4
                py-3

                flex
                items-center
                justify-between

                text-xs
                text-muted-foreground
              "
            >
              <span>StreamFlix</span>

              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-current" />
                2026
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className="
            hidden
    lg:flex

    w-72
    shrink-0

    sticky
    top-16

    h-[calc(100vh-4rem)]

    flex-col

    bg-surface

    border-r
    border-border
        "
      >
        {/* Header */}
        {/* <div
          className="
            h-16

            flex
            items-center

            px-6

            border-b
            border-border

            shrink-0
          "
        >
          <h1
            className="
              text-2xl
              font-bold

              text-primary
            "
          >
            StreamFlix
          </h1>
        </div> */}

        {/* Scrollable Menu */}
        <div
          className="
            flex-1
    overflow-y-auto
          "
        >
          <MenuItems menuItems={menuItems} />
        </div>

        {/* Footer */}
        <div
          className="
            shrink-0

            border-t
            border-border

            px-4
            py-3

            flex
            items-center
            justify-between

            text-xs
            text-muted-foreground
          "
        >
          <span>StreamFlix</span>

          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-current" />
            Made with passion
          </span>
        </div>
      </aside>
    </>
  );
}

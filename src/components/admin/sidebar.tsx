"use client";

import Link from "next/link";
import { useState, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { adminSidebarMenuItems } from "@/config";
import { iconMap } from "../menuItems";

interface AdminSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

interface MenuItemsProps {
  setOpen?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

function MenuItems({
  setOpen,
}: MenuItemsProps) {
  const pathname = usePathname();

  const [expanded, setExpanded] =
    useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <nav className="mt-4 flex flex-col gap-2">
      {adminSidebarMenuItems.map((item) => {
        const isActive =
          pathname === item.path;
          const Icon = iconMap[item.icon];

        return (
          <div key={item.label}>
            {/* Parent */}
            {item.children ? (
              <button
                onClick={() =>
                  toggleExpand(item.label)
                }
                className="
                  flex w-full items-center justify-between

                  rounded-lg

                  px-3 py-2

                  text-muted-foreground

                  hover:bg-surface
                  hover:text-foreground

                  transition
                "
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {expanded[item.label] ? (
                  <FaChevronUp size={12} />
                ) : (
                  <FaChevronDown size={12} />
                )}
              </button>
            ) : (
              <Link
                href={item.path!}
                onClick={() =>
                  setOpen?.(false)
                }
                className={`
                  flex items-center gap-3

                  rounded-lg

                  px-3 py-2

                  transition

                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )}

            {/* Children */}
            {item.children &&
              expanded[item.label] && (
                <div
                  className="
                    ml-5 mt-2

                    border-l border-border

                    pl-3

                    flex flex-col gap-1
                  "
                >
                  {item.children.map(
                    (child) => {
                      const active =
                        pathname ===
                        child.path;

                      return (
                        <Link
                          key={
                            child.label
                          }
                          href={child.path}
                          onClick={() =>
                            setOpen?.(
                              false
                            )
                          }
                          className={`
                            rounded-md

                            px-2 py-2

                            text-sm

                            transition

                            ${
                              active
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:bg-surface hover:text-foreground"
                            }
                          `}
                        >
                          {child.label}
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({
  open,
  setOpen,
}: AdminSidebarProps) {
  const router = useRouter();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent
          side="left"
          className="
            w-72

            bg-surface

            border-r border-border

            p-0
          "
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle
                className="
                  flex items-center
                  justify-center
                  gap-2

                  text-primary
                "
              >
                <FaChartLine />
                <span>
                  Admin Panel
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <MenuItems
                setOpen={setOpen}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className="
          hidden lg:flex

          w-72

          flex-col

          bg-surface

          border-r border-border
        "
      >
        <div
          onClick={() =>
            router.push(
              "/admin/dashboard"
            )
          }
          className="
            flex items-center gap-3

            p-6

            cursor-pointer

            border-b border-border
          "
        >
          <FaChartLine
            className="
              text-primary
            "
          />

          <h1
            className="
              text-xl
              font-bold
            "
          >
            Admin Panel
          </h1>
        </div>

        <div
          className="
            flex-1

            overflow-y-auto

            p-4
          "
        >
          <MenuItems />
        </div>
      </aside>
    </Fragment>
  );
}
"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { FaHome, FaMap, FaVideo, FaLanguage } from "react-icons/fa";

const iconMap = {
  home: FaHome,
  map: FaMap,
  video: FaVideo,
  language: FaLanguage,
};

import { SidebarMenuItem } from "@/types/sidebar";

interface MenuItemsProps {
  menuItems: SidebarMenuItem[];
  setOpen?: (open: boolean) => void;
}

interface MenuItemsProps {
  setOpen?: (open: boolean) => void;
}

const MenuItems = memo(({ menuItems, setOpen }: MenuItemsProps) => {
  const pathname = usePathname();
  
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  const handleNavigate = useCallback(() => {
    setOpen?.(false);
  }, [setOpen]);

  const toggleExpand = useCallback((label: string) => {
    setExpandedLabel((prev) => (prev === label ? null : label));
  }, []);

  return (
    <nav aria-label="Primary Navigation">
      <ul className="mt-4 flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = iconMap[item.icon];
          const childActive = item.children?.some(
            (child) => child.path === pathname,
          );

          const isExpanded = expandedLabel === item.label || childActive;

          return (
            <li key={item.label}>
              {item.path ? (
                <Link
                  href={item.path}
                  onClick={handleNavigate}
                  className={`
                    flex items-center gap-3
                    text-primary
                    rounded-xl

                    px-3 py-2.5

                    transition-all

                    ${
                      isActive || childActive
                        ? `
                          bg-primary/10
                          text-primary
                          font-semibold
                        `
                        : `
                          text-foreground
                          hover:bg-background
                        `
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />

                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="
                    flex
                    w-full

                    items-center
                    justify-between

                    rounded-xl

                    px-3 py-2.5

                    text-foreground

                    hover:bg-background
                  "
                >
                  <span className="flex items-center gap-3">
                    
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>

                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              )}

              {item.children && isExpanded && (
                <ul
                  className="
                    ml-5
                    mt-2

                    border-l
                    border-border

                    pl-4
                  "
                >
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.path}
                        onClick={handleNavigate}
                        className={`
                            block

                            rounded-lg
                            text-primary
                            px-3 py-2

                            text-sm

                            ${
                              pathname === child.path
                                ? `
                                  bg-primary/10
                                  text-primary
                                  font-medium
                                `
                                : `
                                  text-muted
                                  hover:bg-background
                                `
                            }
                          `}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

MenuItems.displayName = "MenuItems";

export default MenuItems;

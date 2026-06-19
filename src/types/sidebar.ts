import { IconType } from "react-icons";

export interface SidebarChildItem {
  label: string;
  path: string;
}

export interface SidebarMenuItem {
  label: string;
  icon: IconType;
  path?: string;
  children?: SidebarChildItem[];
}
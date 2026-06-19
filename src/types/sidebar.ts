import { IconType } from "react-icons";

export interface SidebarChildItem {
  label: string;
  path: string;
}

export interface SidebarMenuItem {
  label: string;
  icon: "home" | "video" | "language" | "map" | 'users' | 'fileText' | 'settings' | 'email' |'action';
  path?: string;
  children?: SidebarChildItem[];
}
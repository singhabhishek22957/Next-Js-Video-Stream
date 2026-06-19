import {
  FiHome,
  FiUsers,
  FiSettings,
  FiFileText,
} from "react-icons/fi";

import { FaVideo } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


import { SidebarMenuItem } from "@/types/sidebar";

export const adminSidebarMenuItems: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    icon: FiHome,
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: FiUsers,
    children: [
      {
        label: "All Users",
        path: "/admin/users/all",
      },
      {
        label: "Deleted Users",
        path: "/admin/users/deleted",
      },
      {
        label: "Add User",
        path: "/admin/users/add",
      },
    ],
  },
  {
    label: "Videos",
    icon: FaVideo,
    children: [
      {
        label: "All Videos",
        path: "/admin/videos/all",
      },
      {
        label: "Add Converted Video",
        path: "/admin/videos/add-converted",
      },
      {
        label: "Add Video",
        path: "/admin/videos/add",
      },
      {
        label: "Deleted Videos",
        path: "/admin/videos/deleted",
      },
      {
        label: "Unlisted Videos",
        path: "/admin/videos/unlisted",
      },
      {
        label: "Uploaded By Me",
        path: "/admin/videos/me",
      },
    ],
  },
  {
    label: "Contact",
    icon: MdEmail,
    children: [
      {
        label: "All Contact",
        path: "/admin/contact/all",
      },
      {
        label: "Resolved Contact",
        path: "/admin/contact/resolved",
      },
      {
        label: "Rejected Contact",
        path: "/admin/contact/rejected",
      },
    ],
  },
  {
    label: "Others",
    icon: FiFileText,
    children: [
      {
        label: "Genre Action",
        path: "/admin/genre",
      },
      {
        label: "Region Action",
        path: "/admin/region",
      },
      {
        label: "Language Action",
        path: "/admin/language",
      },{
        label: "Image Action",
        path: "/admin/images",
      },
    ],
  },
  {
    label: "Reports",
    icon: FiFileText,
    path: "/admin/reports",
  },
  {
    label: "Settings",
    icon: FiSettings,
    path: "/admin/settings",
  },
];

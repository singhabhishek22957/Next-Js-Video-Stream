

import { SidebarMenuItem } from "@/types/sidebar";

export const adminSidebarMenuItems: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    icon: "home",
    path: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: "users",
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
    icon: "video",
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
    icon: "email",
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
    label: "Actions",
    icon: "action",
    children: [
      {
        label: "Genre",
        path: "/admin/genre",
      },
      {
        label: "Region",
        path: "/admin/region",
      },
      {
        label: "Language",
        path: "/admin/language",
      },{
        label: "Image",
        path: "/admin/images",
      },
    ],
  },
  {
    label: "Reports",
    icon: "fileText",
    path: "/admin/reports",
  },
  {
    label: "Settings",
    icon: "settings",
    path: "/admin/settings",
  },
];


import PublicLayoutClient from "./publicClient.layout";
import { getPublicSidebarMenuItems } from "@/lib/sidebar";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({
  children,
}: PublicLayoutProps) {
  const menuItems =
    await getPublicSidebarMenuItems();

  return (
    <PublicLayoutClient
      menuItems={menuItems}
    >
      {children}
    </PublicLayoutClient>
  );
}
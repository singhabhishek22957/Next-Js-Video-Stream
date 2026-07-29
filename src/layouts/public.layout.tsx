
import PublicLayoutClient from "./publicClient.layout";
import { getPublicSidebarMenuItems } from "@/lib/sidebar";
import { getFilterData } from "@/features/cacheData/actions/genreLangRegionData.action";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({
  children,
}: PublicLayoutProps) {
  const data = await getFilterData();
  const menuItems =
    await getPublicSidebarMenuItems();

  return (
    <PublicLayoutClient
      menuItems={menuItems}
      genres={data.genres}
      regions={data.regions}
      languages={data.languages}
    >
      {children}
    </PublicLayoutClient>
  );
}
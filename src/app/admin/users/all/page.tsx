import UsersTable from "@/components/admin/userTable";
import { allUserAction } from "@/features/auth/actions/userCRUD.action";

export default async function UsersPage() {
  const res = await allUserAction();

  return (
    <div className="p-6">
      <UsersTable users={res?.data} />
    </div>
  );
}
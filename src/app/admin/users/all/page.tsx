import UsersTable from "@/components/admin/userTable";
import { allUserAction } from "@/features/auth/actions/userCRUD.action";

export default async function UsersPage() {
  const res = await allUserAction();
  const users =
  res?.data?.map((user) => ({
    ...user,
    _id: user._id.toString(),
     lastSeen: user.lastSeen ?? new Date(),
  })) || [];

  return (
    <div className="p-6">
      <UsersTable users={users} />
    </div>
  );
}
import UsersTable from "@/components/admin/userTable";
import {  deletedUser } from "@/features/auth/actions/userCRUD.action";

export default async function UsersPage() {
  const res = await deletedUser();

  return (
    <div className="p-6">
      <h1 className=" text-2xl text-primary text-center font-bold  m-2">Deleted Users</h1>
      <UsersTable users={res?.data} />
    </div>
  );
}
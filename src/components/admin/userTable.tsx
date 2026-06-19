"use client";

import Link from "next/link";
import { Trash2, Pencil, Check, X } from "lucide-react";
import {updateActive, userDelete} from "@/features/auth/actions/userCRUD.action"
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  isDeleted: boolean;
  lastSeen: Date;
  online: boolean;
  isLocked: boolean;
  lockUntil: Date;
}


interface UsersTableProps {
  users?: User[];
}

export default function UsersTable({
  users = [],
}: UsersTableProps) {
    const router = useRouter();
    const [isPending , startTransition] = useTransition();

  async function handleDelete(id: string) {
    // call server action
    startTransition( async ()=>{
        const result = await userDelete(id);
        if(!result.success){
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
        return;

    })
  }

  

  async function handleEdit (id: string) {
    // call server action
    startTransition( async ()=>{
        const result = await updateActive(id);
        if(!result.success){
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
        return;

    })
  }

  if(!users || users.length === 0){
    return (
      <div className="p-6">
        <h1 className=" text-2xl text-primary text-center font-bold  m-2">No Users Found</h1>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="p-5 border-b border-border">
        <h2 className="text-xl font-semibold">
          Users Management
        </h2>

        <p className="text-sm text-muted-foreground">
          Manage all registered users
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left">
                #
              </th>

              <th className="px-4 py-3 text-left">
                Name
              </th>

              <th className="px-4 py-3 text-left">
                Email
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>
              <th className="px-4 py-3 text-left">
                Online & Last Seen
              </th>
              <th className="px-4 py-3 text-left">
                Lock & Lock Until
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="
                  border-b border-border
                  hover:bg-muted/20
                "
              >
                <td className="px-4 py-4">
                  {index + 1}
                </td>

                <td className="px-4 py-4 font-medium">
                  {user.name}
                </td>

                <td className="px-4 py-4">
                  {user.email}
                </td>

                <td className="px-4 py-4">
                  {user.active ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-500/10
                        px-3 py-1
                        text-green-600
                      "
                    >
                      <Check size={14} />
                      Active
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-red-500/10
                        px-3 py-1
                        text-red-600
                      "
                    >
                      <X size={14} />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {user.online ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-500/10
                        px-3 py-1
                        text-green-600
                      "
                    >
                      <Check size={14} />
                      {user.lastSeen
  ? new Date(user.lastSeen).toLocaleString()
  : "N/A"}
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-red-500/10
                        px-3 py-1
                        text-red-600
                      "
                    >
                      <X size={14} />
                      {user.lastSeen
  ? new Date(user.lastSeen).toLocaleString()
  : "N/A"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {!user.isLocked ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-500/10
                        px-3 py-1
                        text-green-600
                      "
                    >
                      <Check size={14} />
                      Unlocked
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-red-500/10
                        px-3 py-1
                        text-red-600
                      "
                    >
                      <X size={14} />
                      {user.lockUntil
  ? new Date(user.lockUntil).toLocaleString()
  : "Locked"}
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                    disabled={isPending}
                      onClick={() => handleEdit(user._id)}
                      className={`rounded-lg
                        p-2
                        bg-blue-500
                        text-white
                        ${isPending && "opacity-50 cursor-not-allowed"}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(user._id)
                      }
                      className="
                        rounded-lg
                        p-2
                        bg-red-500
                        text-white
                      "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="
                    py-10
                    text-center
                    text-muted-foreground
                  "
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createRegionAction,
  updateRegionAction,
  deleteRegionAction,
  toggleRegionStatusAction,
} from "@/features/region/actions/region.action";
import Image from "next/image";

interface Region {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
  thumbnailUrl?: string;
}

interface Props {
  regions: Region[];
}

export default function RegionManager({ regions }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    thumbnailUrl: "",
  });

  const handleSubmit = () => {
    startTransition(async () => {
      const result = editingId
        ? await updateRegionAction(editingId, formData.name, formData.code, formData.thumbnailUrl)
        : await createRegionAction(formData.name, formData.code, formData.thumbnailUrl);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setFormData({
        name: "",
        code: "",
        thumbnailUrl: "",
      });

      setEditingId("");

      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-5">
        <h2 className="mb-4 text-xl font-bold">
          {editingId ? "Edit Region" : "Create Region"}
        </h2>

        <div className="grid gap-4">
          <input
            placeholder="Region Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="rounded-md border p-2"
          />

          <input
            placeholder="Region Code"
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value,
              })
            }
            className="rounded-md border p-2"
          />
          <input
            placeholder="Thumbnail URL"
            value={formData.thumbnailUrl}
            onChange={(e) =>
              setFormData({
                ...formData,
                thumbnailUrl: e.target.value,
              })
            }
            className="rounded-md border p-2"
          />

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {regions.map((region) => (
              <tr key={region._id} className="border-b">
                <td className="p-3">
                  <Image
                    src={region.thumbnailUrl}
                    width={50}
                    height={50}
                    alt={region.name}
                    priority
                  />
                </td>
                <td className="p-3">{region.name}</td>

                <td className="p-3">{region.code}</td>

                <td className="p-3">
                  <button
                    onClick={async () => {
                      await toggleRegionStatusAction(region._id);

                      router.refresh();
                    }}
                    className={`rounded px-2 py-1 text-white ${
                      region.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {region.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(region._id);

                        setFormData({
                          name: region.name,
                          code: region.code,
                          thumbnailUrl: region.thumbnailUrl,
                        });
                      }}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={async () => {
                        await deleteRegionAction(region._id);

                        toast.success("Region deleted");

                        router.refresh();
                      }}
                    >
                      <Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

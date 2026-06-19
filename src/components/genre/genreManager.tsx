"use client";
import { useState, useTransition } from "react";

import { Pencil, Trash } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  createGenreAction,
  updateGenreAction,
  deleteGenreAction,
  toggleGenreStatusAction,
} from "@/features/genre/actions/genre.action";

interface Genre {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  thumbnailUrl?: string;
}

interface Props {
  genres: Genre[];
}

export default function GenreManager({ genres }: Props) {
  const [isPending, startTransition] = useTransition();

  const [editingId, setEditingId] = useState("");

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnailUrl: "",
  });

  const handleSubmit = () => {
    startTransition(async () => {
      let result;

      if (editingId) {
        result = await updateGenreAction(editingId, formData);
      } else {
        result = await createGenreAction(formData.name, formData.description, formData.thumbnailUrl);
      }

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();

      setFormData({
        name: "",
        description: "",
        thumbnailUrl: "",
      });

      setEditingId("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}

      <div className="rounded-lg border p-5">
        <h2 className="mb-4 text-xl font-bold">
          {editingId ? "Edit Genre" : "Create Genre"}
        </h2>

        <div className="grid gap-4">
          <input
            placeholder="Genre Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="border rounded-md p-2"
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
            className="border rounded-md p-2"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="border rounded-md p-2"
          />

          <button
            disabled={isPending}
            onClick={handleSubmit}
            className="rounded bg-primary  px-4 py-2 text-primary-foreground  hover:bg-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">
                Thumbnail
              </th>
              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Slug</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {genres.map((genre) => (
              <tr key={genre._id} className="border-b">
                <td className="p-3">
                  <Image
                  src={genre?.thumbnailUrl || "/image/default-thumbnail.png"}
                  alt="Thumbnail"
                  width={100}
                  height={100}
                  priority
                />
                </td>
                <td className="p-3">{genre.name}</td>

                <td className="p-3">{genre.slug}</td>

                <td className="p-3">
                  <button
                    onClick={() => toggleGenreStatusAction(genre._id)}
                    className={`rounded px-2 py-1 text-white ${
                      genre.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {genre.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(genre._id);
                        toast.success("Editing genre");
                        router.refresh();
                        setFormData({
                          name: genre.name,
                          description: genre.description || "",
                          thumbnailUrl: genre.thumbnailUrl || "",
                        });
                      }}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => {
                        deleteGenreAction(genre._id).then(() => {
                          toast.success("Genre deleted successfully");
                          router.refresh();
                        });
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

"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createLanguageAction,
  updateLanguageAction,
  deleteLanguageAction,
  toggleLanguageStatusAction,
} from "@/features/language/actions/language.action";
import Image from "next/image";

interface Language {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
  thumbnailUrl?: string;
}

interface Props {
  languages: Language[];
}

export default function LanguageManager({ languages }: Props) {
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
        ? await updateLanguageAction(editingId, formData.name, formData.code, formData.thumbnailUrl)
        : await createLanguageAction(formData.name, formData.code, formData.thumbnailUrl);

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
          {editingId ? "Edit Language" : "Create Language"}
        </h2>

        <div className="grid gap-4">
          <input
            placeholder="Language Name"
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
            placeholder="Language Code"
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
            value={formData.code}
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
            {languages.map((language) => (
              <tr key={language._id} className="border-b">
                <td className="p-3">
                  <Image
                    src={language.thumbnailUrl || "/image/default-thumbnail.png"}
                    alt={language.name}
                    width={50}
                    height={50}
                    priority
                  />
                </td>
                <td className="p-3">{language.name}</td>

                <td className="p-3">{language.code}</td>

                <td className="p-3">
                  <button
                    onClick={async () => {
                      await toggleLanguageStatusAction(language._id);

                      router.refresh();
                    }}
                    className={`rounded px-2 py-1 text-white ${
                      language.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {language.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(language._id);

                        setFormData({
                          name: language.name,
                          code: language.code,
                          thumbnailUrl: language.thumbnailUrl || "/image/default-thumbnail.png"
                        });
                      }}
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={async () => {
                        await deleteLanguageAction(language._id);

                        toast.success("Language deleted");

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

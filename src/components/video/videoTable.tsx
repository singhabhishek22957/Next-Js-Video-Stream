"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, X, Eye, Pencil, Trash, ArrowUpDown } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import { useTransition } from "react";
import { toast } from "sonner";

import { toggleDeleteVideoAction, toggleStatusUpdateVideoAction } from "@/features/video/actions/video.action";

interface Video {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  duration?: number;
  status: string;
  views: number;
  likes: number;
}

interface Props {
  videos?: Video[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: string;
}

export default function VideosTable({
  videos = [],
  currentPage,
  totalPages,
  pageSize,
  search,
  sortBy,
  sortOrder,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/admin/videos/all?${params.toString()}`);
  }

  function handleSort(field: string) {
    const params = new URLSearchParams(searchParams.toString());

    const currentField = params.get("sortBy");

    const currentOrder = params.get("sortOrder");

    const nextOrder =
      currentField === field && currentOrder === "asc" ? "desc" : "asc";

    params.set("sortBy", field);
    params.set("sortOrder", nextOrder);

    router.push(`/admin/videos/all?${params.toString()}`);
  }

  function formatDuration(duration?: number) {
    if (!duration) return "0 s";

    const seconds = Math.round(Math.abs(duration));

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    const result: string[] = [];

    if (hrs) result.push(`${hrs} h`);

    if (mins) result.push(`${mins} m`);

    if (secs) result.push(`${secs} s`);

    return result.join(" ");
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await toggleDeleteVideoAction(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  function handleEdit(id: string) {
    startTransition(async () => {
      const result = await toggleStatusUpdateVideoAction(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  if (!videos || videos.length === 0)
    return (
      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-xl font-semibold">No videos found</h2>
        </div>
      </div>
    );

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-5 border-b">
        <h2 className="text-xl font-semibold">Videos Management</h2>

        <div className="flex gap-3">
          <input
            defaultValue={search}
            placeholder="Search videos..."
            className="border rounded-lg px-3 py-2 w-72"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateQuery("search", e.currentTarget.value);
              }
            }}
          />

          <select
            value={pageSize}
            onChange={(e) => updateQuery("pageSize", e.target.value)}
            className="border text-muted-foreground rounded-lg px-3 py-2"
          >
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 border-b">
              <th className="px-4 py-3">Thumbnail</th>

              <th
                onClick={() => handleSort("title")}
                className="px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Title
                  <ArrowUpDown size={14} />
                </div>
              </th>

              <th className="px-4 py-3">Status</th>

              <th
                onClick={() => handleSort("duration")}
                className="px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Duration
                  <ArrowUpDown size={14} />
                </div>
              </th>

              <th
                onClick={() => handleSort("views")}
                className="px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Views
                  <ArrowUpDown size={14} />
                </div>
              </th>

              <th
                onClick={() => handleSort("likes")}
                className="px-4 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Likes
                  <ArrowUpDown size={14} />
                </div>
              </th>

              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((video) => (
              <tr key={video._id} className="border-b hover:bg-muted/20">
                <td className="px-4 py-4">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={120}
                    height={70}
                    className="rounded-lg object-cover"
                    priority
                  />
                </td>

                <td className="px-4 py-4">
                  <div className="font-medium">{video.title}</div>

                  <div className="text-xs text-muted-foreground">
                    {video.slug}
                  </div>
                </td>

                <td className="px-4 py-4">
                  {video.status === "published" ? (
                    <Check className="text-green-600" />
                  ) : (
                    <X className="text-red-600" />
                  )}
                </td>

                <td className="px-4 py-4">{formatDuration(video.duration)}</td>

                <td className="px-4 py-4">{video.views}</td>

                <td className="px-4 py-4">{video.likes}</td>

                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/videos/${video.slug}`}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye size={18} />
                    </Link>

                    <button
                      onClick={() => handleEdit(video._id)}
                      className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(video._id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {videos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No videos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border-t">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateQuery("page", String(currentPage - 1))}
            className="border px-3 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => (
              <button
                key={index}
                onClick={() => updateQuery("page", String(index + 1))}
                className={`px-3 py-2  text-muted-foreground bg-primary-foreground rounded ${
                  currentPage === index + 1 ? "bg-primary text-muted-foreground" : "border"
                }`}
              >
                {index + 1}
              </button>
            ),
          )}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateQuery("page", String(currentPage + 1))}
            className="border px-3 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

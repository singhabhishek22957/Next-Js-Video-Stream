
"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

interface ImageItem {
  _id: string;
  title: string;
  imageUrl: string;
  bunnyPath: string;
  createdAt: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function loadImages() {
    try {
      const res = await fetch("/api/images");

      const data = await res.json();

      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!title || !file) {
      return alert(
        "Title and image required",
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "title",
        title,
      );

      formData.append(
        "image",
        file,
      );

      const res = await fetch(
        "/api/images",
        {
          method: "POST",
          body: formData,
        },
      );

      const data =
        await res.json();

      if (data.success) {
        setTitle("");
        setFile(null);

        await loadImages();

        alert(
          "Image uploaded successfully",
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl(
    url: string,
  ) {
    await navigator.clipboard.writeText(
      url,
    );

    alert("URL copied");
  }

  async function deleteImage(
    id: string,
  ) {
    const ok = confirm(
      "Delete image?"
    );

    if (!ok) return;

    try {
      const res = await fetch(
        `/api/images/${id}`,
        {
          method: "DELETE",
        },
      );

      const data =
        await res.json();

      if (data.success) {
        await loadImages();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <h1
        className="
          text-2xl
          font-bold
        "
      >
        Image Manager
      </h1>

      {/* Upload Form */}

      <form
        onSubmit={handleUpload}
        className="
          rounded-xl
          border
          p-4
          space-y-4
        "
      >
        <input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          className="
            w-full
            rounded-md
            border
            p-2
          "
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ||
                null
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-md
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >
          {loading
            ? "Uploading..."
            : "Upload Image"}
        </button>
      </form>

      {/* Table */}

      <div
        className="
          overflow-x-auto
          rounded-xl
          border
        "
      >
        <table className="w-full">
          <thead>
            <tr
              className="
                border-b
                bg-muted
              "
            >
              <th className="p-3 text-left">
                Preview
              </th>

              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                URL
              </th>

              <th className="p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {images.map(
              (image) => (
                <tr
                  key={image._id}
                  className="border-b"
                >
                  <td className="p-3">
                    <Image
                      src={
                        image.imageUrl
                      }
                      alt={
                        image.title
                      }
                      width={120}
                      height={80}
                      className="
                        rounded-md
                        object-cover
                      "
                    />
                  </td>

                  <td className="p-3">
                    {image.title}
                  </td>

                  <td className="p-3 max-w-[350px]">
                    <div
                      className="
                        truncate
                        text-sm
                      "
                    >
                      {
                        image.imageUrl
                      }
                    </div>
                  </td>

                  <td className="p-3">
                    <div
                      className="
                        flex
                        gap-2
                      "
                    >
                      <button
                        onClick={() =>
                          copyUrl(
                            image.imageUrl
                          )
                        }
                        className="
                          rounded
                          bg-green-600
                          px-3
                          py-1
                          text-white
                        "
                      >
                        Copy URL
                      </button>

                      <button
                        onClick={() =>
                          deleteImage(
                            image._id
                          )
                        }
                        className="
                          rounded
                          bg-red-600
                          px-3
                          py-1
                          text-white
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}

            {!images.length && (
              <tr>
                <td
                  colSpan={4}
                  className="
                    p-10
                    text-center
                  "
                >
                  No Images Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

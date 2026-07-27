"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { generateSlug } from "@/features/video/actions/genrateSlug";
import { checkSlugAvailability } from "@/features/video/actions/checkSlugAbalibility";

interface AddVideoFormProps {
  genres: {
    _id: string;
    name: string;
    slug: string;
  }[];

  regions: {
    _id: string;
    name: string;
    code: string;
  }[];

  languages: {
    _id: string;
    name: string;
    code: string;
  }[];
}

export default function AddVideoFormMp4({
  genres,
  regions,
  languages,
}: AddVideoFormProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",

    thumbnail: null as File | null,

    video: null as File | null,

    actors: [""],

    genre: [] as string[],

    region: "",

    language: "",

    tags: "",

    status: "published",
  });
  const [slug, setSlug] = useState("");

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const [checkingSlug, setCheckingSlug] = useState(false);

  const handleCheckSlug = async () => {
    const value = formData.title;
    const generatedSlug = await generateSlug(value);

    setSlug(generatedSlug);

    setCheckingSlug(true);

    const result = await checkSlugAvailability(generatedSlug);

    setSlugAvailable(result.available);

    setCheckingSlug(false);
  };

  // const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;

  //   setFormData((prev) => ({
  //     ...prev,
  //     title: value,
  //   }));

  //   if (!value.trim()) {
  //     setSlug("");
  //     setSlugAvailable(null);
  //     return;
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      const file = files[0];
      if (name === "thumbnail") {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
        }));

        setThumbnailPreview(URL.createObjectURL(file));

        return;
      }

      if (name === "video") {
        const url = URL.createObjectURL(file);

        setVideoPreview(url);

        const videoElement = document.createElement("video");

        videoElement.preload = "metadata";

        videoElement.src = url;

        videoElement.onloadedmetadata = () => {
          setFormData((prev) => ({
            ...prev,
            video: file,
            duration: Math.round(videoElement.duration).toString(),
          }));

          URL.revokeObjectURL(url);
        };

        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleGenre = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genreId)
        ? prev.genre.filter((g) => g !== genreId)
        : [...prev.genre, genreId],
    }));
  };

  const handleActorChange = (index: number, value: string) => {
    const updated = [...formData.actors];

    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      actors: updated,
    }));
  };

  const addActor = () => {
    setFormData((prev) => ({
      ...prev,
      actors: [...prev.actors, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!slugAvailable) {
        toast.error("Slug already exists");
        return;
      }
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);

      data.append("description", formData.description);

      data.append("duration", formData.duration);

      data.append("status", formData.status);

      data.append("region", formData.region);

      data.append("language", formData.language);

      data.append("actors", JSON.stringify(formData.actors.filter(Boolean)));

      data.append("genre", JSON.stringify(formData.genre));

      data.append(
        "tags",
        JSON.stringify(
          formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      );

      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }

      if (formData.video) {
        data.append("video", formData.video);
      }

      const response: any = await axios.post("/api/admin/videosmp4", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );

          setUploadProgress(percent);
        },
      });

      toast.success("Video Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading video:", error);

      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Video</h1>

      <form  className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />
        <div>
          <button
            onClick={handleCheckSlug}
            className=" bg-blue-500 hover:bg-blue-600 text-muted-foreground py-2 px-4 rounded"
          >
            check slug
          </button>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Slug:</span>

          <span className="ml-2 font-medium">{slug}</span>
        </div>

        {checkingSlug && (
          <span className="text-yellow-500 text-sm">Checking slug...</span>
        )}

        {slugAvailable === true && (
          <span className="text-green-600 text-sm font-medium">
            ✓ Slug Available
          </span>
        )}

        {slugAvailable === false && (
          <span className="text-red-600 text-sm font-medium">
            ✗ Slug Already Exists
          </span>
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div>
          <label className="block mb-2 font-medium">Thumbnail</label>

          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <div className="mt-3 border rounded-lg p-3">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-60 h-36 object-cover rounded"
              />
            ) : (
              <div className="w-60 h-36 border rounded flex items-center justify-center text-gray-500">
                No Thumbnail Selected
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Video (MP4)</label>

          <input
            type="file"
            name="video"
            accept="video/mp4"
            onChange={handleChange}
            required
          />

          <div className="mt-3 border rounded-lg p-3">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-72 rounded" />
            ) : (
              <div className="w-72 h-40 border rounded flex items-center justify-center text-gray-500">
                No Video Selected
              </div>
            )}
          </div>
        </div>

        <input
          type="number"
          name="duration"
          value={formData.duration}
          readOnly
          placeholder="Auto detected"
          className="w-full border p-3 rounded bg-gray-100 cursor-not-allowed"
        />

        <div>
          <h3 className="font-semibold mb-2">Actors</h3>

          {formData.actors.map((actor, index) => (
            <input
              key={index}
              type="text"
              value={actor}
              onChange={(e) => handleActorChange(index, e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
          ))}

          <button
            type="button"
            onClick={addActor}
            className="border px-3 py-2 rounded"
          >
            Add Actor
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Genres</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {genres.map((genre) => (
              <label key={genre._id}>
                <input
                  type="checkbox"
                  checked={formData.genre.includes(genre._id)}
                  onChange={() => toggleGenre(genre._id)}
                />

                <span className="ml-2">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Region</option>

          {regions.map((region) => (
            <option key={region._id} value={region._id}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Language</option>

          {languages.map((language) => (
            <option key={language._id} value={language._id}>
              {language.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="tags"
          placeholder="tag1,tag2,tag3"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="published">Published</option>

          <option value="unlisted">Unlisted</option>
        </select>

        {loading && (
          <div>
            <div className="w-full bg-gray-200 h-4 rounded">
              <div
                className="bg-green-500 h-4 rounded"
                style={{
                  width: `${uploadProgress}%`,
                }}
              />
            </div>

            <p className="mt-2 font-semibold">{uploadProgress}% Uploaded</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}
